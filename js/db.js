// js/db.js - Camada de Abstração de Dados (Firestore + LocalStorage Realtime Fallback)

import { getFirebaseConfig, isFirebaseConfigured, defaultEventSettings } from './config.js';

let db = null;
let app = null;
let useCloud = false;
let cachedConfig = null;
let cachedGuesses = null;
let cachedDraws = null;

// Callbacks registrados para sincronização
const guessListeners = new Set();
const configListeners = new Set();
const drawListeners = new Set();

// Inicialização limpa: lista vazia por padrão para o Bolão começar do zero
const initialMockGuesses = [];

// Função de deduplicação rigorosa (por ID e por assinatura semântica)
export function deduplicateGuesses(guesses) {
    if (!Array.isArray(guesses)) return [];
    const seenIds = new Set();
    const seenSignatures = new Set();
    const result = [];

    for (const g of guesses) {
        if (!g) continue;
        
        // 1. Checagem por ID único
        if (g.id) {
            if (seenIds.has(g.id)) continue;
            seenIds.add(g.id);
        }

        // 2. Checagem por assinatura semântica (evita duplicações por duplo clique ou conflito temporário)
        const name = (g.guestName || '').trim().toLowerCase();
        const phone = (g.whatsapp || '').replace(/\D/g, '');
        const timeBucket = g.createdAt ? Math.floor(new Date(g.createdAt).getTime() / (120 * 1000)) : 0;
        const signature = `${name}_${phone}_${g.gender}_${g.quotasCount}_${timeBucket}`;
        
        if (timeBucket > 0) {
            if (seenSignatures.has(signature)) continue;
            seenSignatures.add(signature);
        }

        result.push(g);
    }
    return result;
}

export async function initDatabase() {
    if (isFirebaseConfigured()) {
        try {
            const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js');
            const { getFirestore, doc, collection, onSnapshot, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');

            const config = getFirebaseConfig();
            app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
            db = getFirestore(app);
            useCloud = true;
            console.log('✅ Firebase Firestore conectado com sucesso!');

            // Listener em tempo real para configurações do evento
            const configRef = doc(db, 'settings', 'event_config');
            const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            
            onSnapshot(configRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    cachedConfig = { ...defaultEventSettings, ...data };
                    localStorage.setItem('bolao_event_settings', JSON.stringify(cachedConfig));
                    notifyConfigListeners(cachedConfig);
                } else {
                    // Inicializa o documento no Firestore se for a primeira vez
                    const initialConfig = getLocalConfig();
                    setDoc(configRef, initialConfig, { merge: true }).catch(() => {});
                    cachedConfig = initialConfig;
                    notifyConfigListeners(initialConfig);
                }
            }, (error) => {
                console.warn('Erro ao escutar config no Firestore, alternando para cache:', error);
                cachedConfig = getLocalConfig();
                notifyConfigListeners(cachedConfig);
            });

            // Listener em tempo real para palpites (Multi-dispositivo em tempo real)
            const guessesRef = collection(db, 'guesses');
            onSnapshot(guessesRef, (snapshot) => {
                const list = [];
                snapshot.forEach(docSnap => {
                    list.push({ id: docSnap.id, ...docSnap.data() });
                });

                // Ordenação em memória resiliente e segura (mais recentes primeiro)
                list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                const deduped = deduplicateGuesses(list);
                cachedGuesses = deduped;
                localStorage.setItem('bolao_guesses', JSON.stringify(deduped));
                notifyGuessListeners(deduped);
            }, (error) => {
                console.warn('Erro ao escutar palpites no Firestore, usando fallback local:', error);
                cachedGuesses = getLocalGuesses();
                notifyGuessListeners(cachedGuesses);
            });

            // Listener em tempo real para sorteios (Multi-dispositivo para telão/apresentação)
            const drawsRef = collection(db, 'draws');
            onSnapshot(drawsRef, (snapshot) => {
                const list = [];
                snapshot.forEach(docSnap => {
                    list.push({ id: docSnap.id, ...docSnap.data() });
                });
                list.sort((a, b) => new Date(b.drawnAt || 0) - new Date(a.drawnAt || 0));
                cachedDraws = list;
                localStorage.setItem('bolao_draws', JSON.stringify(list));
                notifyDrawListeners(list);
            }, (error) => {
                console.warn('Erro ao escutar sorteios no Firestore, usando fallback local:', error);
                cachedDraws = getLocalDraws();
                notifyDrawListeners(cachedDraws);
            });

            return { useCloud: true };
        } catch (err) {
            console.warn('⚠️ Falha ao inicializar Firebase. Ativando modo local resiliente:', err);
            useCloud = false;
        }
    } else {
        useCloud = false;
        console.log('ℹ️ Operando em Modo Demonstração / LocalStorage (100% interativo).');
    }

    // Inicialização LocalStorage
    initLocalFallback();
    return { useCloud: false };
}

function initLocalFallback() {
    if (!localStorage.getItem('bolao_event_settings')) {
        localStorage.setItem('bolao_event_settings', JSON.stringify(defaultEventSettings));
    }
    if (!localStorage.getItem('bolao_guesses')) {
        localStorage.setItem('bolao_guesses', JSON.stringify([]));
    }
    if (!localStorage.getItem('bolao_draws')) {
        localStorage.setItem('bolao_draws', JSON.stringify([]));
    }

    // Escuta alterações entre abas diferentes no mesmo navegador
    window.addEventListener('storage', (event) => {
        if (event.key === 'bolao_guesses') {
            notifyGuessListeners(getLocalGuesses());
        }
        if (event.key === 'bolao_event_settings') {
            notifyConfigListeners(getLocalConfig());
        }
        if (event.key === 'bolao_draws') {
            notifyDrawListeners(getLocalDraws());
        }
    });

    // Notifica estado inicial
    setTimeout(() => {
        notifyConfigListeners(getLocalConfig());
        notifyGuessListeners(getLocalGuesses());
        notifyDrawListeners(getLocalDraws());
    }, 50);
}

function getLocalConfig() {
    try {
        const val = localStorage.getItem('bolao_event_settings');
        if (!val) return defaultEventSettings;
        const config = JSON.parse(val);
        // Atualiza chaves antigas de demonstração para a chave oficial do Argeu
        if (config && (config.pixKey === 'charevelacao@email.com' || !config.pixCopiaECola)) {
            config.pixKey = defaultEventSettings.pixKey;
            config.pixReceiverName = defaultEventSettings.pixReceiverName;
            config.pixCity = defaultEventSettings.pixCity;
            config.pixProvider = defaultEventSettings.pixProvider;
            config.pixCopiaECola = defaultEventSettings.pixCopiaECola;
            config.pixQrCodeUrl = defaultEventSettings.pixQrCodeUrl;
            localStorage.setItem('bolao_event_settings', JSON.stringify(config));
        }
        return config;
    } catch {
        return defaultEventSettings;
    }
}

function getLocalGuesses() {
    try {
        const val = localStorage.getItem('bolao_guesses');
        if (!val) return [];
        const parsed = JSON.parse(val);
        return deduplicateGuesses(Array.isArray(parsed) ? parsed : []);
    } catch {
        return [];
    }
}

function saveLocalGuesses(guesses) {
    const deduped = deduplicateGuesses(guesses);
    localStorage.setItem('bolao_guesses', JSON.stringify(deduped));
    notifyGuessListeners(deduped);
}

function notifyGuessListeners(guesses) {
    const deduped = deduplicateGuesses(guesses);
    guessListeners.forEach(fn => fn(deduped));
}

function notifyConfigListeners(config) {
    configListeners.forEach(fn => fn(config));
}

export function subscribeToGuesses(callback) {
    guessListeners.add(callback);
    // Sempre entrega imediatamente o estado disponível (nuvem ou cache local)
    callback(cachedGuesses || getLocalGuesses());
    return () => guessListeners.delete(callback);
}

export function subscribeToEventConfig(callback) {
    configListeners.add(callback);
    // Sempre entrega imediatamente a configuração disponível (nuvem ou cache local)
    callback(cachedConfig || getLocalConfig());
    return () => configListeners.delete(callback);
}

export async function saveEventConfig(newConfig) {
    const updated = {
        ...getLocalConfig(),
        ...newConfig,
        updatedAt: new Date().toISOString()
    };

    // Atualiza local e cache em memória primeiro para feedback instantâneo
    cachedConfig = updated;
    localStorage.setItem('bolao_event_settings', JSON.stringify(updated));
    notifyConfigListeners(updated);

    if (useCloud && db) {
        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            await setDoc(doc(db, 'settings', 'event_config'), updated, { merge: true });
            console.log('✅ Configuração salva no Firestore com sucesso!');
        } catch (err) {
            console.warn('Erro ao salvar no Firestore (mantido localmente):', err);
        }
    }
    return { success: true, config: updated };
}

export async function addGuess(guessData) {
    const rawName = (guessData.guestName || '').trim();
    const guestName = rawName.slice(0, 100) || 'Participante';
    const quotas = Math.min(100, Math.max(1, parseInt(guessData.quotasCount) || 1));
    const unitPrice = Number(guessData.unitPrice) || 15.00;
    const totalAmount = Math.max(0.01, quotas * unitPrice);
    const gender = guessData.gender === 'girl' ? 'girl' : 'boy';
    const status = (guessData.isManual && guessData.status) ? guessData.status : 'pending';

    const newGuess = {
        guestName,
        whatsapp: (guessData.whatsapp || '').trim(),
        gender,
        babyNameChosen: guessData.babyNameChosen || (gender === 'boy' ? 'Menino' : 'Menina'),
        quotasCount: quotas,
        unitPrice,
        totalAmount,
        status,
        isManual: Boolean(guessData.isManual),
        notes: (guessData.notes || '').slice(0, 500),
        createdAt: new Date().toISOString(),
        confirmedAt: status === "confirmed" ? new Date().toISOString() : null
    };

    if (useCloud && db) {
        try {
            const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            const docRef = await addDoc(collection(db, 'guesses'), newGuess);
            const item = { id: docRef.id, ...newGuess };
            return { success: true, ...item };
        } catch (err) {
            if (err?.code === 'permission-denied') {
                console.warn('Firestore bloqueou o palpite por violação de regra de segurança:', err);
            } else {
                console.warn('Falha no Firestore addDoc, usando fallback local:', err);
            }
        }
    }

    const current = getLocalGuesses();
    const id = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const itemWithId = { id, ...newGuess };
    current.unshift(itemWithId);
    const deduped = deduplicateGuesses(current);
    cachedGuesses = deduped;
    saveLocalGuesses(deduped);
    return { success: true, id, ...newGuess };
}

export async function updateGuess(guessId, fields) {
    if (useCloud && db) {
        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            // Usa setDoc com merge para atualizar com segurança até registros pré-existentes ou criados offline
            await setDoc(doc(db, 'guesses', guessId), fields, { merge: true });
        } catch (err) {
            if (err?.code === 'permission-denied') {
                console.warn('Firestore bloqueou a atualização (requer autenticação administrativa):', err);
            } else {
                console.warn('Erro ao atualizar no Firestore:', err);
            }
        }
    }

    const guesses = getLocalGuesses();
    const index = guesses.findIndex(g => g.id === guessId);
    if (index !== -1) {
        guesses[index] = { ...guesses[index], ...fields };
        cachedGuesses = guesses;
        saveLocalGuesses(guesses);
    }
    return { success: true };
}

export async function deleteGuess(guessId) {
    // 1. Atualiza cache em memória e localStorage imediatamente
    const guesses = getLocalGuesses().filter(g => g.id !== guessId);
    cachedGuesses = guesses;
    saveLocalGuesses(guesses);

    // 2. Remove do Firestore para sincronizar com todos os demais dispositivos
    if (useCloud && db) {
        try {
            const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            await deleteDoc(doc(db, 'guesses', guessId));
        } catch (err) {
            if (err?.code === 'permission-denied') {
                console.warn('Firestore bloqueou a exclusão (requer autenticação administrativa):', err);
            } else {
                console.warn('Erro ao deletar palpite no Firestore:', err);
            }
        }
    }
    return { success: true };
}

// Reiniciar o Bolão (Zerar todos os palpites para começar do zero em todos os dispositivos)
export async function resetAllGuesses() {
    // 1. Limpa cache local e localStorage imediatamente
    cachedGuesses = [];
    localStorage.setItem('bolao_guesses', JSON.stringify([]));
    notifyGuessListeners([]);

    // 2. Se a nuvem estiver ativa, apaga todos os documentos da coleção guesses no Firestore
    if (useCloud && db) {
        try {
            const { collection, getDocs, deleteDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            const snap = await getDocs(collection(db, 'guesses'));
            const deletePromises = [];
            snap.forEach(d => {
                deletePromises.push(deleteDoc(doc(db, 'guesses', d.id)));
            });
            await Promise.all(deletePromises);
            console.log('✅ Todos os palpites foram apagados do Firestore com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar palpites no Firestore:', err);
        }
    }
    return { success: true };
}

export function isUsingCloud() {
    return useCloud;
}

// ==========================================
// MÉTODOS DE HISTÓRICO E PERSISTÊNCIA DE SORTEIOS
// ==========================================

function getLocalDraws() {
    try {
        const val = localStorage.getItem('bolao_draws');
        return val ? JSON.parse(val) : [];
    } catch {
        return [];
    }
}

function saveLocalDraws(draws) {
    localStorage.setItem('bolao_draws', JSON.stringify(draws));
    notifyDrawListeners(draws);
}

function notifyDrawListeners(draws) {
    drawListeners.forEach(fn => fn(draws));
}

export function subscribeToDraws(callback) {
    drawListeners.add(callback);
    callback(cachedDraws || getLocalDraws());
    return () => drawListeners.delete(callback);
}

export async function saveDraw(drawData) {
    const drawItem = {
        ...drawData,
        drawnAt: drawData.drawnAt || new Date().toISOString()
    };

    if (useCloud && db) {
        try {
            const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            const docRef = await addDoc(collection(db, 'draws'), drawItem);
            const item = { id: docRef.id, ...drawItem };
            const current = getLocalDraws();
            current.unshift(item);
            cachedDraws = current;
            saveLocalDraws(current);
            return item;
        } catch (err) {
            console.warn('Falha ao salvar sorteio no Firestore, usando fallback local:', err);
        }
    }

    const current = getLocalDraws();
    const id = 'draw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const item = { id, ...drawItem };
    current.unshift(item);
    cachedDraws = current;
    saveLocalDraws(current);
    return item;
}

export function getDrawHistory() {
    return cachedDraws || getLocalDraws();
}

export async function resetDrawHistory() {
    cachedDraws = [];
    localStorage.setItem('bolao_draws', JSON.stringify([]));
    notifyDrawListeners([]);

    if (useCloud && db) {
        try {
            const { collection, getDocs, deleteDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            const snap = await getDocs(collection(db, 'draws'));
            const deletePromises = [];
            snap.forEach(d => {
                deletePromises.push(deleteDoc(doc(db, 'draws', d.id)));
            });
            await Promise.all(deletePromises);
            console.log('✅ Histórico de sorteios apagado do Firestore com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar sorteios no Firestore:', err);
        }
    }
    return { success: true };
}

