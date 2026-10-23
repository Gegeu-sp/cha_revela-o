// js/auth.js - Serviço de Autenticação do Administrador com Blindagem Criptográfica SHA-256, Anti-Força Bruta e Sessão Segura

import { isFirebaseConfigured } from './config.js';

let auth = null;
let currentUser = null;
const authListeners = new Set();

const LOCAL_ADMIN_KEY = 'bolao_local_admin_session';
const LOCKOUT_KEY = 'bolao_admin_lockout';
const PASSWORD_HASH_KEY = 'bolao_admin_password_hash';

// Hash padrão seguro para a credencial inicial dos pais: "Revelacao2026!"
// SHA-256: bceda375d4f9763b451cfca0e46bb729a1e59e7e121a7e670969d1c3cbf5e82a
const DEFAULT_ADMIN_HASH = 'bceda375d4f9763b451cfca0e46bb729a1e59e7e121a7e670969d1c3cbf5e82a';

// Configurações de Segurança
const LOCKOUT_THRESHOLD = 5;            // 5 tentativas consecutivas com erro
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutos de bloqueio
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos de inatividade

/**
 * Computa o hash unidirecional SHA-256 de uma string utilizando a Web Crypto API nativa.
 * @param {string} str Texto de entrada
 * @returns {Promise<string>} Hash hexadecimal em minúsculas (64 caracteres)
 */
export async function computeSha256(str) {
    if (typeof str !== 'string') return '';
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        console.error('Erro na computação Web Crypto SHA-256:', e);
        // Fallback determinístico básico caso Web Crypto não esteja disponível em ambiente restrito
        return '';
    }
}

/**
 * Mascara números de telefone para proteção da privacidade dos participantes (LGPD).
 * Entrada: "(11) 98765-4321" ou "11987654321"
 * Saída: "(11) 9****-4321"
 */
export function maskPhone(phone) {
    if (!phone) return '';
    const clean = String(phone).replace(/\D/g, '');
    if (clean.length === 11) {
        return `(${clean.slice(0, 2)}) ${clean.slice(2, 3)}****-${clean.slice(7)}`;
    }
    if (clean.length === 10) {
        return `(${clean.slice(0, 2)}) ****-${clean.slice(6)}`;
    }
    if (clean.length > 5) {
        return clean.slice(0, 3) + '****' + clean.slice(-2);
    }
    return '****';
}

/**
 * Migra senhas antigas em texto plano para hash seguro e inicializa storage de credencial.
 */
function initCredentialStorage() {
    try {
        const legacyPlain = localStorage.getItem('bolao_admin_custom_password');
        const currentHash = localStorage.getItem(PASSWORD_HASH_KEY);

        if (!currentHash) {
            if (legacyPlain && legacyPlain !== 'admin123' && legacyPlain !== 'admin' && legacyPlain.length !== 64) {
                // Migra senha personalizada anterior para hash SHA-256
                computeSha256(legacyPlain).then(hash => {
                    localStorage.setItem(PASSWORD_HASH_KEY, hash);
                });
            } else {
                localStorage.setItem(PASSWORD_HASH_KEY, DEFAULT_ADMIN_HASH);
            }
        }
        // Remove a chave legado em texto plano por segurança
        localStorage.removeItem('bolao_admin_custom_password');
    } catch (err) {
        console.warn('Erro ao inicializar armazenamento de credencial segura:', err);
    }
}

/**
 * Consulta o status atual de bloqueio por força bruta.
 * @returns {{ isLocked: boolean, remainingSeconds: number, failedAttempts: number }}
 */
export function getLockoutStatus() {
    try {
        const data = JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{}');
        const failedAttempts = Number(data.failedAttempts) || 0;
        const lockedUntil = Number(data.lockedUntil) || 0;
        const now = Date.now();

        if (lockedUntil && now < lockedUntil) {
            const remainingSeconds = Math.ceil((lockedUntil - now) / 1000);
            return { isLocked: true, remainingSeconds, failedAttempts };
        }

        // Se o tempo expirou, reseta o bloqueio
        if (lockedUntil && now >= lockedUntil) {
            resetLockout();
        }

        return { isLocked: false, remainingSeconds: 0, failedAttempts };
    } catch {
        return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
    }
}

/**
 * Registra uma tentativa falha de autenticação e aplica lockout se atingir o limiar.
 */
function recordFailedAttempt() {
    try {
        const status = getLockoutStatus();
        const nextFailed = status.failedAttempts + 1;
        let lockedUntil = null;

        if (nextFailed >= LOCKOUT_THRESHOLD) {
            lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
        }

        localStorage.setItem(LOCKOUT_KEY, JSON.stringify({
            failedAttempts: nextFailed,
            lockedUntil
        }));
    } catch (err) {
        console.warn('Erro ao registrar tentativa com erro:', err);
    }
}

/**
 * Limpa o rastreamento de tentativas falhas após um login com sucesso.
 */
function resetLockout() {
    try {
        localStorage.removeItem(LOCKOUT_KEY);
    } catch {
        // Ignora
    }
}

/**
 * Atualiza o carimbo de última atividade da sessão administrativa para controle de timeout.
 */
export function updateActivity() {
    if (currentUser && currentUser.isAdmin) {
        currentUser.lastActivity = Date.now();
        try {
            localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(currentUser));
        } catch {}
    }
}

export async function initAuth() {
    initCredentialStorage();

    if (isFirebaseConfigured()) {
        try {
            const { getApps } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js');
            const { getAuth, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');

            const app = getApps()[0];
            if (app) {
                auth = getAuth(app);
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        currentUser = {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName || 'Administrador dos Pais',
                            isAdmin: true,
                            lastActivity: Date.now()
                        };
                        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(currentUser));
                    }
                    notifyAuthListeners(currentUser);
                });
            }
        } catch (e) {
            console.warn('Operando com autenticação administrativa local protegida:', e);
        }
    }

    // Carregamento e verificação de expiração da sessão local
    try {
        const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const now = Date.now();
            const lastActive = Number(parsed.lastActivity) || 0;

            // Expira a sessão se estiver inativa por mais de 30 minutos
            if (lastActive && (now - lastActive > SESSION_TIMEOUT_MS)) {
                console.info('Sessão administrativa expirada por inatividade (30 minutos).');
                currentUser = null;
                localStorage.removeItem(LOCAL_ADMIN_KEY);
            } else {
                currentUser = parsed;
                updateActivity();
            }
        }
    } catch {
        currentUser = null;
    }

    notifyAuthListeners(currentUser);

    // Registra listener de atividade do usuário para renovar o timeout da sessão
    if (typeof window !== 'undefined') {
        const activityEvents = ['click', 'keydown', 'touchstart'];
        activityEvents.forEach(evt => {
            window.addEventListener(evt, () => {
                if (currentUser) updateActivity();
            }, { passive: true });
        });
    }
}

export function subscribeToAuth(callback) {
    authListeners.add(callback);
    callback(currentUser);
    return () => authListeners.delete(callback);
}

function notifyAuthListeners(user) {
    authListeners.forEach(fn => fn(user));
}

/**
 * Autentica o administrador verificando proteção contra força bruta e comparando o hash SHA-256.
 * @param {string} email Identificador ou e-mail
 * @param {string} password Senha digitada em texto plano
 */
export async function loginAdmin(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Verifica bloqueio ativo por força bruta (Lockout)
    const lockout = getLockoutStatus();
    if (lockout.isLocked) {
        const minutes = Math.ceil(lockout.remainingSeconds / 60);
        return {
            success: false,
            error: `Acesso bloqueado por muitas tentativas incorretas. Tente novamente em ${lockout.remainingSeconds} segundo(s) (~${minutes} min).`,
            isLocked: true,
            remainingSeconds: lockout.remainingSeconds
        };
    }

    if (!cleanPassword) {
        return { success: false, error: 'Por favor, digite a senha de acesso.' };
    }

    // 2. Calcula hash SHA-256 da senha digitada
    const inputHash = await computeSha256(cleanPassword);
    const configuredHash = localStorage.getItem(PASSWORD_HASH_KEY) || DEFAULT_ADMIN_HASH;

    // 3. Tenta autenticação no Firebase Auth caso ativo em nuvem
    if (auth && isFirebaseConfigured()) {
        try {
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');
            const targetEmail = cleanEmail || 'admin@bolao.com';
            const userCred = await signInWithEmailAndPassword(auth, targetEmail, cleanPassword);
            if (userCred && userCred.user) {
                resetLockout();
                currentUser = {
                    uid: userCred.user.uid,
                    email: userCred.user.email,
                    displayName: 'Administrador dos Pais',
                    isAdmin: true,
                    lastActivity: Date.now()
                };
                localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(currentUser));
                notifyAuthListeners(currentUser);
                return { success: true, user: currentUser };
            }
        } catch {
            // Se o Firebase Auth em nuvem falhar (ex: usuário não cadastrado no console), avalia o hash seguro local
        }
    }

    // 4. Comparação segura do hash SHA-256
    if (inputHash === configuredHash) {
        resetLockout();
        currentUser = {
            uid: 'admin_pais_' + (cleanEmail.replace(/[^a-z0-9]/g, '') || 'pais'),
            email: cleanEmail || 'admin@bolao.com',
            displayName: 'Administrador dos Pais',
            isAdmin: true,
            lastActivity: Date.now()
        };
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(currentUser));
        notifyAuthListeners(currentUser);
        return { success: true, user: currentUser };
    }

    // 5. Credencial incorreta: registra falha e avalia bloqueio
    recordFailedAttempt();
    const updatedLockout = getLockoutStatus();
    if (updatedLockout.isLocked) {
        return {
            success: false,
            error: `Limite de tentativas excedido! Acesso temporariamente bloqueado por 5 minutos por segurança.`,
            isLocked: true,
            remainingSeconds: updatedLockout.remainingSeconds
        };
    }

    const attemptsLeft = LOCKOUT_THRESHOLD - updatedLockout.failedAttempts;
    return {
        success: false,
        error: `Senha incorreta. Você tem mais ${attemptsLeft} tentativa(s) antes do bloqueio temporário.`
    };
}

/**
 * Altera a senha administrativa, gravando o novo hash SHA-256 de forma irreversível.
 * @param {string} currentPassword Senha atual
 * @param {string} newPassword Nova senha desejada
 */
export async function changeAdminPassword(currentPassword, newPassword) {
    const cleanCurrent = (currentPassword || '').trim();
    const cleanNew = (newPassword || '').trim();

    if (!cleanNew || cleanNew.length < 6) {
        return { success: false, error: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }

    const currentHash = await computeSha256(cleanCurrent);
    const configuredHash = localStorage.getItem(PASSWORD_HASH_KEY) || DEFAULT_ADMIN_HASH;

    if (currentHash !== configuredHash) {
        return { success: false, error: 'A senha atual digitada está incorreta.' };
    }

    const newHash = await computeSha256(cleanNew);
    localStorage.setItem(PASSWORD_HASH_KEY, newHash);
    return { success: true };
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
    return Boolean(currentUser && currentUser.isAdmin);
}
