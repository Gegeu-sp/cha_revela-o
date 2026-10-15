// js/config.js - Configurações do Firebase e Detecção de Modo Demo / Nuvem

/**
 * Configuração padrão do Firebase.
 * Pode ser preenchida aqui diretamente ou configurada pelo Administrador na interface.
 */
export const defaultFirebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Verifica se há configuração personalizada salva em localStorage
export function getFirebaseConfig() {
    try {
        const saved = localStorage.getItem('bolao_firebase_config');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.apiKey && parsed.projectId) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Erro ao ler configuração do Firebase de localStorage:', e);
    }
    return defaultFirebaseConfig;
}

// Salva nova configuração do Firebase
export function saveFirebaseConfig(config) {
    localStorage.setItem('bolao_firebase_config', JSON.stringify(config));
}

// Verifica se o Firebase possui credenciais válidas configuradas
export function isFirebaseConfigured() {
    const config = getFirebaseConfig();
    return Boolean(config && config.apiKey && config.projectId && config.apiKey.length > 5);
}

// Configurações padrão do Evento do Chá Revelação com nomes dos bebês
export const defaultEventSettings = {
    title: "Bolão de Chá Revelação - Menino ou Menina?",
    boyBabyName: "Lucca",
    girlBabyName: "Maya",
    expectedBirthDate: "2026-11-20",
    quotaPrice: 15.00,
    pixKey: "charevelacao@email.com",
    pixReceiverName: "Mamãe & Papai",
    pixCity: "São Paulo",
    prizePercentage: 50,
    eventStatus: "active", // active | closed | revealed
    revealedGender: null   // 'boy' | 'girl' | null
};
