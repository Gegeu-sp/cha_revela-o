// js/auth.js - Serviço de Autenticação do Administrador (Firebase Auth + Fallback Demo)

import { getFirebaseConfig, isFirebaseConfigured } from './config.js';

let auth = null;
let currentUser = null;
const authListeners = new Set();

const LOCAL_ADMIN_KEY = 'bolao_local_admin_session';

export async function initAuth() {
    if (isFirebaseConfigured()) {
        try {
            const { getApps } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js');
            const { getAuth, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');

            const app = getApps()[0];
            if (app) {
                auth = getAuth(app);
                onAuthStateChanged(auth, (user) => {
                    currentUser = user;
                    notifyAuthListeners(user);
                });
                return;
            }
        } catch (e) {
            console.warn('Erro ao inicializar Firebase Auth, operando com autenticação local:', e);
        }
    }

    // Fallback de sessão local
    try {
        const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
        if (saved) {
            currentUser = JSON.parse(saved);
        }
    } catch {
        currentUser = null;
    }
    notifyAuthListeners(currentUser);
}

export function subscribeToAuth(callback) {
    authListeners.add(callback);
    callback(currentUser);
    return () => authListeners.delete(callback);
}

function notifyAuthListeners(user) {
    authListeners.forEach(fn => fn(user));
}

export async function loginAdmin(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Senha Mestra dos Pais: admin123 (ou admin ou senha >= 4 dígitos)
    // Permite aos pais gerenciar o bolão instantaneamente em qualquer aparelho (celular, tablet ou PC)
    if (cleanPassword === 'admin123' || cleanPassword === 'admin' || cleanPassword.length >= 4) {
        currentUser = {
            uid: 'admin_pais_' + (cleanEmail.replace(/[^a-z0-9]/g, '') || 'pais'),
            email: cleanEmail || 'admin@bolao.com',
            displayName: 'Administrador dos Pais',
            isAdmin: true
        };
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(currentUser));
        notifyAuthListeners(currentUser);
        return { success: true, user: currentUser };
    }

    return { success: false, error: 'Senha incorreta. A senha de acesso dos pais é: admin123' };
}

export async function logoutAdmin() {
    if (auth && isFirebaseConfigured()) {
        try {
            const { signOut } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');
            await signOut(auth);
        } catch (e) {
            console.warn('Erro ao deslogar Firebase:', e);
        }
    }
    currentUser = null;
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    notifyAuthListeners(null);
    return { success: true };
}

export function getCurrentUser() {
    return currentUser;
}

export function isAdminAuthenticated() {
    return Boolean(currentUser);
}
