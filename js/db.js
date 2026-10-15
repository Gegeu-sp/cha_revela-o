// js/db.js - Camada de Abstração de Dados (Firestore + LocalStorage Realtime Fallback)

import { getFirebaseConfig, isFirebaseConfigured, defaultEventSettings } from './config.js';

let db = null;
let app = null;
let useCloud = false;
let cachedConfig = null;
let cachedGuesses = null;

// Callbacks registrados para sincronização
const guessListeners = new Set();
const configListeners = new Set();

// Mock inicial de palpites caso o armazenamento local esteja zerado
const initialMockGuesses = [
    {
        id: "mock_1",
        guestName: "Tia Carla",
        whatsapp: "(11) 98765-4321",
        gender: "girl",
        quotasCount: 2,
        unitPrice: 15.00,
        totalAmount: 30.00,
        status: "confirmed",
        isManual: false,
        notes: "Comprovante enviado no WhatsApp",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        confirmedAt: new Date(Date.now() - 3600000 * 20).toISOString()
    },
    {
        id: "mock_2",
        guestName: "Tio João",
        whatsapp: "(11) 99876-5432",
        gender: "boy",
        quotasCount: 1,
        unitPrice: 15.00,
        totalAmount: 15.00,
        status: "confirmed",
        isManual: false,
        notes: "Pix recebido",
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        confirmedAt: new Date(Date.now() - 3600000 * 15).toISOString()
    },
    {
        id: "mock_3",
        guestName: "Vovó Helena",
        whatsapp: "(11) 91234-5678",
        gender: "girl",
        quotasCount: 3,
        unitPrice: 15.00,
        totalAmount: 45.00,
        status: "confirmed",
        isManual: true,
        notes: "Entregue em mãos",
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        confirmedAt: new Date(Date.now() - 3600000 * 9).toISOString()
    }
];

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

            // Listener em tempo real para palpites
            const guessesRef = collection(db, 'guesses');
            onSnapshot(guessesRef, (snapshot) => {
                const list = [];
                snapshot.forEach(docSnap => {
                    list.push({ id: docSnap.id, ...docSnap.data() });
                });

                // Se a coleção estiver vazia no Firestore e houver palpites mock locais, sincroniza para a nuvem
                if (list.length === 0 && initialMockGuesses.length > 0) {
                    initialMockGuesses.forEach(g => {
                        const { id, ...data } = g;
                        setDoc(doc(db, 'guesses', id), data, { merge: true }).catch(() => {});
                    });
                }

                // Ordenação em memória resiliente e segura
                list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                cachedGuesses = list;
                localStorage.setItem('bolao_guesses', JSON.stringify(list));
                notifyGuessListeners(list);
            }, (error) => {
                console.warn('Erro ao escutar palpites no Firestore, usando fallback local:', error);
                cachedGuesses = getLocalGuesses();
                notifyGuessListeners(cachedGuesses);
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
        localStorage.setItem('bolao_guesses', JSON.stringify(initialMockGuesses));
    }

    // Escuta alterações entre abas diferentes no mesmo navegador
    window.addEventListener('storage', (event) => {
        if (event.key === 'bolao_guesses') {
            notifyGuessListeners(getLocalGuesses());
        }
        if (event.key === 'bolao_event_settings') {
            notifyConfigListeners(getLocalConfig());
        }
    });

    // Notifica estado inicial
    setTimeout(() => {
        notifyConfigListeners(getLocalConfig());
        notifyGuessListeners(getLocalGuesses());
    }, 50);
}

function getLocalConfig() {
    try {
        const val = localStorage.getItem('bolao_event_settings');
        return val ? JSON.parse(val) : defaultEventSettings;
    } catch {
        return defaultEventSettings;
    }
}

function getLocalGuesses() {
    try {
        const val = localStorage.getItem('bolao_guesses');
        return val ? JSON.parse(val) : [];
    } catch {
        return [];
    }
}

function saveLocalGuesses(guesses) {
    localStorage.setItem('bolao_guesses', JSON.stringify(guesses));
    notifyGuessListeners(guesses);
}

function notifyGuessListeners(guesses) {
    guessListeners.forEach(fn => fn(guesses));
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
    const newGuess = {
        guestName: guessData.guestName.trim(),
        whatsapp: guessData.whatsapp.trim(),
        gender: guessData.gender,
        babyNameChosen: guessData.babyNameChosen || (guessData.gender === 'boy' ? 'Menino' : 'Menina'),
        quotasCount: Number(guessData.quotasCount) || 1,
        unitPrice: Number(guessData.unitPrice) || 15.00,
        totalAmount: Number(guessData.totalAmount) || 15.00,
        status: guessData.status || "pending",
        isManual: Boolean(guessData.isManual),
        notes: guessData.notes || "",
        createdAt: new Date().toISOString(),
        confirmedAt: guessData.status === "confirmed" ? new Date().toISOString() : null
    };

    if (useCloud && db) {
        try {
            const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            const docRef = await addDoc(collection(db, 'guesses'), newGuess);
            const item = { id: docRef.id, ...newGuess };
            const current = getLocalGuesses();
            current.unshift(item);
            cachedGuesses = current;
            saveLocalGuesses(current);
            return { success: true, ...item };
        } catch (err) {
            console.warn('Falha no Firestore addDoc, usando fallback local:', err);
        }
    }

    const guesses = getLocalGuesses();
    const id = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const itemWithId = { id, ...newGuess };
    guesses.unshift(itemWithId);
    cachedGuesses = guesses;
    saveLocalGuesses(guesses);
    return { success: true, id, ...newGuess };
}

export async function updateGuess(guessId, fields) {
    if (useCloud && db) {
        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
            // Usa setDoc com merge para atualizar com segurança até registros pré-existentes ou criados offline
            await setDoc(doc(db, 'guesses', guessId), fields, { merge: true });
        } catch (err) {
            console.warn('Erro ao atualizar no Firestore:', err);
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
    if (useCloud && db) {
        const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
        await deleteDoc(doc(db, 'guesses', guessId));
    } else {
        const guesses = getLocalGuesses().filter(g => g.id !== guessId);
        saveLocalGuesses(guesses);
    }
    return { success: true };
}

// Reiniciar o Bolão (Zerar todos os palpites para começar do zero)
export async function resetAllGuesses() {
    if (useCloud && db) {
        const { collection, getDocs, deleteDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
        const snap = await getDocs(collection(db, 'guesses'));
        const deletePromises = [];
        snap.forEach(d => {
            deletePromises.push(deleteDoc(doc(db, 'guesses', d.id)));
        });
        await Promise.all(deletePromises);
        notifyGuessListeners([]);
    } else {
        saveLocalGuesses([]);
    }
    return { success: true };
}

export function isUsingCloud() {
    return useCloud;
}
