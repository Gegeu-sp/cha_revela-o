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
    const cleanEmail = email.trim().toLowerCase();

    // Se Firebase estiver ativo
    if (auth && isFirebaseConfigured()) {
        try {
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');
            const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
            currentUser = userCred.user;
            notifyAuthListeners(currentUser);
            return { success: true, user: currentUser };
        } catch (err) {
            console.error('Falha no login Firebase:', err);
            let msg = 'E-mail ou senha incorretos.';
            if (err.code === 'auth/invalid-credential') msg = 'Credenciais inválidas.';
            if (err.code === 'auth/user-not-found') msg = 'Administrador não encontrado.';
            return { success: false, error: msg };
        }
    }

    // Modo Demo / Fallback Local
    // Credencial padrão: admin@bolao.com / admin123 (ou qualquer e-mail/senha com mais de 5 dígitos para facilitar testes)
    if (password && password.length >= 4) {
        currentUser = {
            uid: 'admin_local_' + Date.now(),
            email: cleanEmail || 'admin@bolao.com',
            displayName: 'Administrador dos Pais',
            isDemo: true
        };
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(currentUser));
        notifyAuthListeners(currentUser);
        return { success: true, user: currentUser };
    } else {
        return { success: false, error: 'A senha deve ter pelo menos 4 caracteres.' };
    }
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
