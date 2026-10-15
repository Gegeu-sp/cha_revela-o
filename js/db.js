// js/db.js - Camada de Abstração de Dados (Firestore + LocalStorage Realtime Fallback)

import { getFirebaseConfig, isFirebaseConfigured, defaultEventSettings } from './config.js';

let db = null;
let app = null;
let useCloud = false;

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
            onSnapshot(configRef, (snapshot) => {
                const data = snapshot.exists() ? snapshot.data() : defaultEventSettings;
                notifyConfigListeners(data);
            }, (error) => {
                console.warn('Erro ao escutar config no Firestore, alternando para cache:', error);
            });

            // Listener em tempo real para palpites
            const guessesRef = collection(db, 'guesses');
            const q = query(guessesRef, orderBy('createdAt', 'desc'));
            onSnapshot(q, (snapshot) => {
                const list = [];
                snapshot.forEach(docSnap => {
                    list.push({ id: docSnap.id, ...docSnap.data() });
                });
                notifyGuessListeners(list);
            }, (error) => {
                console.warn('Erro ao escutar palpites no Firestore, usando fallback local:', error);
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
    if (!useCloud) {
        callback(getLocalGuesses());
    }
    return () => guessListeners.delete(callback);
}

export function subscribeToEventConfig(callback) {
    configListeners.add(callback);
    if (!useCloud) {
        callback(getLocalConfig());
    }
    return () => configListeners.delete(callback);
}

export async function saveEventConfig(newConfig) {
    const updated = {
        ...getLocalConfig(),
        ...newConfig,
        updatedAt: new Date().toISOString()
    };

    if (useCloud && db) {
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
        await setDoc(doc(db, 'settings', 'event_config'), updated, { merge: true });
    } else {
        localStorage.setItem('bolao_event_settings', JSON.stringify(updated));
        notifyConfigListeners(updated);
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
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
        const docRef = await addDoc(collection(db, 'guesses'), newGuess);
        return { success: true, id: docRef.id, ...newGuess };
    } else {
        const guesses = getLocalGuesses();
        const id = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        const itemWithId = { id, ...newGuess };
        guesses.unshift(itemWithId);
        saveLocalGuesses(guesses);
        return { success: true, id, ...newGuess };
    }
}

export async function updateGuess(guessId, fields) {
    if (useCloud && db) {
        const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
        await updateDoc(doc(db, 'guesses', guessId), fields);
    } else {
        const guesses = getLocalGuesses();
        const index = guesses.findIndex(g => g.id === guessId);
        if (index !== -1) {
            guesses[index] = { ...guesses[index], ...fields };
            saveLocalGuesses(guesses);
        }
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
