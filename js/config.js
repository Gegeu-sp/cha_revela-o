// js/config.js - Configurações do Firebase e Detecção de Modo Demo / Nuvem

/**
 * Configuração padrão do Firebase.
 * Pode ser preenchida aqui diretamente ou configurada pelo Administrador na interface.
 */
export const defaultFirebaseConfig = {
    apiKey: "AIzaSyDiTKlUDX7V9TpjJPx7uvUYGXN_XaBGjIg",
    authDomain: "rifa-bolao.firebaseapp.com",
    projectId: "rifa-bolao",
    storageBucket: "rifa-bolao.firebasestorage.app",
    messagingSenderId: "192442338206",
    appId: "1:192442338206:web:cbd35f22d5ecaa5757a48f",
    measurementId: "G-40R8W9BGEF"
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
    title: "Qual é o seu palpite para o nosso bebê? - Bolão de Chá Revelação",
    boyBabyName: "Lucca",
    girlBabyName: "Maya",
    expectedBirthDate: "2026-11-20",
    quotaPrice: 15.00,
    pixKey: "argeu-rodrigues-dxm@jim.com",
    pixReceiverName: "ARGEU RODRIGUES PINTO FIL",
    pixCity: "SAO PAULO",
    pixProvider: "InfinitePay",
    pixCopiaECola: "00020101021126490014BR.GOV.BCB.PIX0127argeu-rodrigues-dxm@jim.com5204000053039865802BR5925ARGEU RODRIGUES PINTO FIL6009SAO PAULO62070503***63040836",
    pixQrCodeUrl: "assets/pix-qrcode.png",
    prizePercentage: 50,
    eventStatus: "active", // active | closed | revealed
    revealedGender: null   // 'boy' | 'girl' | null
};
