// js/admin.js - Controlador do Painel Administrativo dos Pais

import { loginAdmin, logoutAdmin, subscribeToAuth, isAdminAuthenticated, getLockoutStatus, changeAdminPassword, maskPhone } from './auth.js';
import { updateGuess, deleteGuess, addGuess, saveEventConfig, resetAllGuesses, saveDraw, getDrawHistory, resetDrawHistory } from './db.js';
import { subscribeToState } from './state.js';
import { triggerCelebration } from './ranking.js';
import { buildRaffleTickets, selectWinningTicket, createWhatsAppCelebrationLink } from './raffle.js';

let currentState = null;
let currentFilter = 'all'; // 'all' | 'pending' | 'confirmed'
let isRaffling = false;
let currentRaffleTickets = [];
let lockoutTimerInterval = null;

export function initAdminController() {
    subscribeToState((state) => {
        currentState = state;
        if (isAdminAuthenticated()) {
            renderAdminGuessesTable();
            populateSettingsForm();
            updatePendingBadge();
            updateRaffleUI();
        }
    });

    subscribeToAuth((user) => {
        updateAdminAuthUI(user);
    });

    setupAdminEventListeners();
    setupRaffleEventListeners();
}

function updateAdminAuthUI(user) {
    const authBtn = document.getElementById('btn-admin-auth');
    const adminDashboard = document.getElementById('admin-dashboard-modal');
    const adminLoginModal = document.getElementById('admin-login-modal');

    if (user) {
        if (authBtn) {
            authBtn.innerHTML = `<i class="fa-solid fa-lock-open text-emerald-600 text-xs"></i> <span class="hidden sm:inline">Painel</span> <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Admin</span>`;
        }
        if (adminLoginModal) adminLoginModal.classList.add('hidden');
    } else {
        if (authBtn) {
            authBtn.innerHTML = `<i class="fa-solid fa-lock text-slate-400 text-xs"></i> <span class="hidden sm:inline">Área dos Pais</span><span class="sm:hidden">Pais</span>`;
        }
        if (adminDashboard) adminDashboard.classList.add('hidden');
    }
}

function updateLockoutUI() {
    const lockoutBanner = document.getElementById('admin-lockout-banner');
    const countdownEl = document.getElementById('admin-lockout-countdown');
    const submitBtn = document.getElementById('btn-admin-submit-login');
    const passwordInput = document.getElementById('admin-password');
    const status = getLockoutStatus();

    if (status.isLocked) {
        if (lockoutBanner) lockoutBanner.classList.remove('hidden');
        if (countdownEl) {
            const mins = Math.floor(status.remainingSeconds / 60);
            const secs = status.remainingSeconds % 60;
            countdownEl.textContent = `${mins}m ${secs.toString().padStart(2, '0')}s`;
        }
        if (submitBtn) submitBtn.disabled = true;
        if (passwordInput) passwordInput.disabled = true;
    } else {
        if (lockoutBanner) lockoutBanner.classList.add('hidden');
        if (submitBtn) submitBtn.disabled = false;
        if (passwordInput) passwordInput.disabled = false;
        if (lockoutTimerInterval) {
            clearInterval(lockoutTimerInterval);
            lockoutTimerInterval = null;
        }
    }
}

function startLockoutWatcher() {
    updateLockoutUI();
    if (!lockoutTimerInterval) {
        lockoutTimerInterval = setInterval(updateLockoutUI, 1000);
    }
}

function updatePendingBadge() {
    const pendingCount = currentState?.totalPendingCount || 0;
    const badgeEl = document.getElementById('admin-pending-badge');
    if (badgeEl) {
        if (pendingCount > 0) {
            badgeEl.textContent = `${pendingCount} pendente${pendingCount > 1 ? 's' : ''}`;
            badgeEl.classList.remove('hidden');
        } else {
            badgeEl.classList.add('hidden');
        }
    }
}

function setupAdminEventListeners() {
    const authBtn = document.getElementById('btn-admin-auth');
    const loginModal = document.getElementById('admin-login-modal');
    const dashboardModal = document.getElementById('admin-dashboard-modal');
    const closeLoginBtn = document.getElementById('btn-close-login');
    const closeDashboardBtn = document.getElementById('btn-close-dashboard');
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.getElementById('btn-admin-logout');

    if (authBtn) {
        authBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isAdminAuthenticated()) {
                openAdminDashboard();
            } else {
                startLockoutWatcher();
                loginModal.classList.remove('hidden');
            }
        });
    }

    if (closeLoginBtn && loginModal) {
        closeLoginBtn.addEventListener('click', () => {
            loginModal.classList.add('hidden');
            if (lockoutTimerInterval) {
                clearInterval(lockoutTimerInterval);
                lockoutTimerInterval = null;
            }
        });
    }

    if (closeDashboardBtn && dashboardModal) {
        closeDashboardBtn.addEventListener('click', () => dashboardModal.classList.add('hidden'));
    }

    // Formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            const errorEl = document.getElementById('admin-login-error');
            const submitBtn = document.getElementById('btn-admin-submit-login') || loginForm.querySelector('button[type="submit"]');

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Entrando...`;
            errorEl.classList.add('hidden');

            const res = await loginAdmin(email, password);
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Entrar no Painel`;

            if (res.success) {
                showToast('Login efetuado com sucesso!', 'success');
                loginModal.classList.add('hidden');
                loginForm.reset();
                if (lockoutTimerInterval) {
                    clearInterval(lockoutTimerInterval);
                    lockoutTimerInterval = null;
                }
                openAdminDashboard();
            } else {
                if (res.isLocked) {
                    startLockoutWatcher();
                }
                errorEl.textContent = res.error || 'Credenciais inválidas.';
                errorEl.classList.remove('hidden');
            }
        });
    }

    // Formulário de Alteração de Senha dos Pais
    const changePassForm = document.getElementById('admin-change-password-form');
    if (changePassForm) {
        changePassForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPass = document.getElementById('current-password-input').value;
            const newPass = document.getElementById('new-password-input').value;

            const res = await changeAdminPassword(currentPass, newPass);
            if (res.success) {
                showToast('Senha dos pais atualizada com sucesso!', 'success');
                changePassForm.reset();
            } else {
                showToast(res.error || 'Erro ao atualizar senha.', 'error');
            }
        });
    }

    // Botão de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await logoutAdmin();
            dashboardModal.classList.add('hidden');
            showToast('Você saiu do painel administrativo.', 'info');
        });
    }

    // Abas do Painel Administrativo
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchAdminTab(targetTab);
        });
    });

    // Filtros de status dos palpites
    const filterBtns = document.querySelectorAll('.filter-guess-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => {
                b.className = b === btn ? 
                    'filter-guess-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white shadow-sm' : 
                    'filter-guess-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200';
            });
            renderAdminGuessesTable();
        });
    });

    // Formulário de Configuração do Evento com Nomes dos Bebês
    const settingsForm = document.getElementById('admin-settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const quotaPrice = parseFloat(document.getElementById('setting-quota-price').value) || 15;
            const boyBabyName = document.getElementById('setting-boy-name').value.trim() || 'Menino';
            const girlBabyName = document.getElementById('setting-girl-name').value.trim() || 'Menina';
            const expectedBirthDate = document.getElementById('setting-expected-date').value;
            const pixKey = document.getElementById('setting-pix-key').value.trim();
            const pixReceiverName = document.getElementById('setting-pix-receiver').value.trim();
            const prizePercentage = parseInt(document.getElementById('setting-prize-percentage').value) || 50;

            await saveEventConfig({
                quotaPrice,
                boyBabyName,
                girlBabyName,
                expectedBirthDate,
                pixKey,
                pixReceiverName,
                prizePercentage
            });

            showToast('Configurações e nomes dos bebês atualizados com sucesso!', 'success');
        });
    }

    // Formulário de Adicionar Palpite Manual
    const manualForm = document.getElementById('admin-manual-guess-form');
    if (manualForm) {
        manualForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const guestName = document.getElementById('manual-guest-name').value.trim();
            const whatsapp = document.getElementById('manual-whatsapp').value.trim();
            const gender = document.getElementById('manual-gender').value;
            const quotasCount = parseInt(document.getElementById('manual-quotas').value) || 1;
            const unitPrice = currentState?.config?.quotaPrice || 15.00;
            const totalAmount = quotasCount * unitPrice;
            const notes = document.getElementById('manual-notes').value.trim();

            const babyNameChosen = gender === 'boy' ? 
                (currentState?.config?.boyBabyName || 'Menino') : 
                (currentState?.config?.girlBabyName || 'Menina');

            await addGuess({
                guestName,
                whatsapp,
                gender,
                babyNameChosen,
                quotasCount,
                unitPrice,
                totalAmount,
                status: 'confirmed',
                isManual: true,
                notes: notes || 'Adicionado manualmente pelo Administrador'
            });

            manualForm.reset();
            showToast(`Palpite de ${guestName} adicionado e confirmado!`, 'success');
            triggerCelebration();
            switchAdminTab('palpites');
        });
    }

    // Ação: Reiniciar Bolão do Zero (Zerar Dados)
    const resetBtn = document.getElementById('btn-reset-bolao');
    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            const confirmWord = prompt('⚠️ ATENÇÃO: Deseja ZERAR TODOS os palpites e recomeçar o bolão do zero?\n\nEsta ação apagará todos os votos e arrecadações de teste.\n\nDigite a palavra "ZERAR" para confirmar:');
            if (confirmWord && confirmWord.trim().toUpperCase() === 'ZERAR') {
                await resetAllGuesses();
                showToast('O Bolão foi reiniciado com sucesso! Todos os palpites foram zerados.', 'info');
                renderAdminGuessesTable();
            } else if (confirmWord !== null) {
                alert('Palavra incorreta. A reinicialização foi cancelada.');
            }
        });
    }

    // Formulário de Edição de Palpite Modal
    const editModal = document.getElementById('admin-edit-guess-modal');
    const editForm = document.getElementById('admin-edit-guess-form');
    const closeEditBtn = document.getElementById('btn-close-edit-modal');

    if (closeEditBtn && editModal) {
        closeEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));
    }

    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const guessId = document.getElementById('edit-guess-id').value;
            const guestName = document.getElementById('edit-guest-name').value.trim();
            const whatsapp = document.getElementById('edit-whatsapp').value.trim();
            const gender = document.getElementById('edit-gender').value;
            const quotasCount = parseInt(document.getElementById('edit-quotas').value) || 1;
            const unitPrice = parseFloat(document.getElementById('edit-unit-price').value) || 15.00;
            const totalAmount = quotasCount * unitPrice;
            const status = document.getElementById('edit-status').value;
            const notes = document.getElementById('edit-notes').value.trim();

            const babyNameChosen = gender === 'boy' ? 
                (currentState?.config?.boyBabyName || 'Menino') : 
                (currentState?.config?.girlBabyName || 'Menina');

            await updateGuess(guessId, {
                guestName,
                whatsapp,
                gender,
                babyNameChosen,
                quotasCount,
                unitPrice,
                totalAmount,
                status,
                notes,
                confirmedAt: status === 'confirmed' ? new Date().toISOString() : null
            });

            editModal.classList.add('hidden');
            showToast('Palpite atualizado com sucesso!', 'success');
        });
    }
}

export function openAdminDashboard(targetTab = null) {
    const dashboard = document.getElementById('admin-dashboard-modal');
    if (!dashboard) return;
    dashboard.classList.remove('hidden');
    renderAdminGuessesTable();
    populateSettingsForm();
    updatePendingBadge();
    updateRaffleUI();
    if (targetTab) {
        switchAdminTab(targetTab);
    }
}

function switchAdminTab(targetTab) {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');

    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === targetTab) {
            btn.className = 'admin-tab-btn px-4 py-2 text-sm font-semibold text-[#3B0069] border-b-2 border-[#8F56AD] bg-[#BE9ECF]/20 rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap';
        } else {
            btn.className = 'admin-tab-btn px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5 whitespace-nowrap';
        }
    });

    tabPanes.forEach(pane => {
        if (pane.id === `admin-tab-${targetTab}`) {
            pane.classList.remove('hidden');
        } else {
            pane.classList.add('hidden');
        }
    });

    if (targetTab === 'sorteio') {
        updateRaffleUI();
    }
}

function populateSettingsForm() {
    if (!currentState || !currentState.config) return;
    const { quotaPrice, boyBabyName, girlBabyName, expectedBirthDate, pixKey, pixReceiverName, prizePercentage } = currentState.config;

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
    };

    setVal('setting-quota-price', quotaPrice);
    setVal('setting-boy-name', boyBabyName || 'Lucca');
    setVal('setting-girl-name', girlBabyName || 'Maya');
    setVal('setting-expected-date', expectedBirthDate || '');
    setVal('setting-pix-key', pixKey || '');
    setVal('setting-pix-receiver', pixReceiverName || '');
    setVal('setting-prize-percentage', prizePercentage || 50);
}

function renderAdminGuessesTable() {
    const tbody = document.getElementById('admin-guesses-tbody');
    if (!tbody || !currentState) return;

    let guesses = currentState.guesses || [];
    
    // Aplica filtro se necessário
    if (currentFilter === 'pending') {
        guesses = guesses.filter(g => g.status === 'pending');
    } else if (currentFilter === 'confirmed') {
        guesses = guesses.filter(g => g.status === 'confirmed');
    }

    if (guesses.length === 0) {
        const msg = currentFilter === 'pending' ? 'Nenhum Pix pendente de confirmação! 🎉' : 'Nenhum palpite encontrado.';
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-400 text-sm font-medium">${msg}</td></tr>`;
        return;
    }

    const boyName = currentState?.config?.boyBabyName || 'Menino';
    const girlName = currentState?.config?.girlBabyName || 'Menina';

    tbody.innerHTML = guesses.map(g => {
        const isBoy = g.gender === 'boy';
        const badgeColor = isBoy ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700';
        const icon = isBoy ? `💙 ${boyName}` : `💖 ${girlName}`;

        let statusBadge = '';
        if (g.status === 'confirmed') {
            statusBadge = `<span class="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> Confirmado</span>`;
        } else if (g.status === 'cancelled') {
            statusBadge = `<span class="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><i class="fa-solid fa-circle-xmark"></i> Cancelado</span>`;
        } else {
            statusBadge = `<span class="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 animate-pulse"><i class="fa-solid fa-clock"></i> Aguardando Pix</span>`;
        }

        const rawPhone = (g.whatsapp || '').replace(/\D/g, '');
        const masked = maskPhone(g.whatsapp);
        const waLink = rawPhone ? `https://wa.me/${rawPhone.length <= 11 ? '55' + rawPhone : rawPhone}` : null;

        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-sm ${g.status === 'pending' ? 'bg-amber-50/30' : ''}">
                <td class="py-3 px-4 font-medium text-slate-800">
                    <div class="font-bold">${escapeHtml(g.guestName)} ${g.isManual ? '<span class="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">Manual</span>' : ''}</div>
                    <div class="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>${escapeHtml(masked || 'Sem telefone')}</span>
                        ${waLink ? `<a href="${waLink}" target="_blank" class="text-emerald-600 hover:text-emerald-700" title="Abrir WhatsApp oficial"><i class="fa-brands fa-whatsapp text-xs"></i></a>` : ''}
                    </div>
                </td>
                <td class="py-3 px-4"><span class="${badgeColor} px-2.5 py-1 rounded-full text-xs font-bold">${icon}</span></td>
                <td class="py-3 px-4 text-center">
                    <span class="font-extrabold text-slate-700">${g.quotasCount || 1} cota${(g.quotasCount || 1) > 1 ? 's' : ''}</span>
                    <span class="text-xs font-bold text-slate-500 block">R$ ${Number(g.totalAmount || 15).toFixed(2).replace('.', ',')}</span>
                </td>
                <td class="py-3 px-4">${statusBadge}</td>
                <td class="py-3 px-4 text-xs text-slate-500 max-w-xs truncate">${escapeHtml(g.notes || '-')}</td>
                <td class="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    ${g.status !== 'confirmed' ? `
                        <button onclick="window.confirmPaymentAdmin('${g.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center gap-1" title="Confirmar Pagamento">
                            <i class="fa-solid fa-check"></i> Confirmar Pix
                        </button>
                    ` : ''}
                    <button onclick="window.openEditGuessModal('${g.id}')" class="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="window.deleteGuessAdmin('${g.id}')" class="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Funções globais atreladas à janela para disparos inline da tabela
window.confirmPaymentAdmin = async function(guessId) {
    await updateGuess(guessId, {
        status: 'confirmed',
        confirmedAt: new Date().toISOString()
    });
    showToast('Pagamento Pix confirmado com sucesso!', 'success');
    triggerCelebration();
};

window.deleteGuessAdmin = async function(guessId) {
    if (!confirm('Tem certeza de que deseja remover este registro?')) return;
    await deleteGuess(guessId);
    showToast('Palpite removido.', 'info');
};

window.openEditGuessModal = function(guessId) {
    if (!currentState) return;
    const g = currentState.guesses.find(item => item.id === guessId);
    if (!g) return;

    document.getElementById('edit-guess-id').value = g.id;
    document.getElementById('edit-guest-name').value = g.guestName || '';
    document.getElementById('edit-whatsapp').value = g.whatsapp || '';
    document.getElementById('edit-gender').value = g.gender || 'boy';
    document.getElementById('edit-quotas').value = g.quotasCount || 1;
    document.getElementById('edit-unit-price').value = g.unitPrice || 15.00;
    document.getElementById('edit-status').value = g.status || 'pending';
    document.getElementById('edit-notes').value = g.notes || '';

    const modal = document.getElementById('admin-edit-guess-modal');
    if (modal) modal.classList.remove('hidden');
};

export function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColors = {
        success: 'bg-emerald-600 text-white',
        error: 'bg-red-600 text-white',
        info: 'bg-slate-900 text-white'
    };

    const icons = {
        success: 'fa-circle-check',
        error: 'fa-triangle-exclamation',
        info: 'fa-circle-info'
    };

    toast.className = `toast-item ${bgColors[type] || bgColors.info} px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium max-w-sm`;
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> <span>${escapeHtml(message)}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ==========================================
// CONTROLADOR DO SISTEMA DE SORTEIO OFICIAL
// ==========================================

function setupRaffleEventListeners() {
    const quickRaffleBtn = document.getElementById('btn-quick-raffle');
    const modeSelect = document.getElementById('raffle-mode-select');
    const genderContainer = document.getElementById('raffle-gender-container');
    const targetGenderSelect = document.getElementById('raffle-target-gender');
    const excludePrevCheckbox = document.getElementById('raffle-exclude-previous');
    const runRaffleBtn = document.getElementById('btn-run-raffle');
    const resetHistoryBtn = document.getElementById('btn-reset-raffle-history');

    if (quickRaffleBtn) {
        quickRaffleBtn.addEventListener('click', () => {
            switchAdminTab('sorteio');
        });
    }

    if (modeSelect) {
        modeSelect.addEventListener('change', () => {
            if (genderContainer) {
                if (modeSelect.value === 'correct') {
                    genderContainer.classList.remove('hidden');
                } else {
                    genderContainer.classList.add('hidden');
                }
            }
            updateRaffleUI();
        });
    }

    if (targetGenderSelect) {
        targetGenderSelect.addEventListener('change', () => updateRaffleUI());
    }

    if (excludePrevCheckbox) {
        excludePrevCheckbox.addEventListener('change', () => updateRaffleUI());
    }

    if (runRaffleBtn) {
        runRaffleBtn.addEventListener('click', () => runRaffleDraw());
    }

    if (resetHistoryBtn) {
        resetHistoryBtn.addEventListener('click', async () => {
            const confirmed = confirm('Tem certeza de que deseja zerar o histórico de sorteios realizados? Essa ação não pode ser desfeita.');
            if (confirmed) {
                await resetDrawHistory();
                updateRaffleUI();
                showToast('Histórico de sorteios zerado com sucesso!', 'info');
            }
        });
    }
}

function updateRaffleUI() {
    const modeSelect = document.getElementById('raffle-mode-select');
    const targetGenderSelect = document.getElementById('raffle-target-gender');
    const excludePrevCheckbox = document.getElementById('raffle-exclude-previous');
    const summaryBadge = document.getElementById('raffle-eligible-summary');

    const mode = modeSelect ? modeSelect.value : 'all';
    const targetGender = targetGenderSelect ? targetGenderSelect.value : 'boy';
    const excludePreviousWinners = excludePrevCheckbox ? excludePrevCheckbox.checked : true;

    const previousWinners = currentState?.draws || getDrawHistory() || [];

    currentRaffleTickets = buildRaffleTickets(
        currentState?.guesses || [],
        { mode, targetGender, excludePreviousWinners },
        previousWinners
    );

    if (summaryBadge) {
        const uniqueParticipants = new Set(currentRaffleTickets.map(t => t.guestName?.trim().toLowerCase())).size;
        summaryBadge.textContent = `${currentRaffleTickets.length} cota(s) (${uniqueParticipants} participante(s))`;
    }

    renderRaffleHistoryTable();
}

function renderRaffleHistoryTable() {
    const tbody = document.getElementById('raffle-history-tbody');
    if (!tbody) return;

    const history = currentState?.draws || getDrawHistory() || [];

    if (!Array.isArray(history) || history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-4 text-center text-slate-400">Nenhum sorteio realizado ainda.</td></tr>`;
        return;
    }

    tbody.innerHTML = history.map((item, idx) => {
        const dateFormatted = item.drawnAt ? new Date(item.drawnAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '--';
        const genderBadge = item.gender === 'girl' ? 
            `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#BE9ECF]/30 text-[#3B0069]">🪆 Menina</span>` : 
            `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#CEE1DF]/60 text-[#03665A]">🏋️ Menino</span>`;
        
        const modeBadge = item.mode === 'correct' ? 
            `<span class="text-amber-700 font-semibold">Acertadores</span>` : 
            `<span class="text-slate-500 font-normal">Geral</span>`;

        const waLink = createWhatsAppCelebrationLink(item, item.prizeTitle || 'Prêmio do Bolão');
        const contactAction = waLink ? 
            `<a href="${waLink}" target="_blank" class="inline-flex items-center gap-1 text-[#03665A] hover:text-[#02423A] font-bold bg-[#CEE1DF]/40 hover:bg-[#CEE1DF] px-2.5 py-1 rounded-lg transition" title="Enviar WhatsApp"><i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp</a>` : 
            `<span class="text-slate-400">Sem telefone</span>`;

        return `
            <tr class="hover:bg-slate-50/70 transition">
                <td class="py-2.5 px-3 font-bold text-slate-800">${history.length - idx}º</td>
                <td class="py-2.5 px-3 font-semibold text-slate-900">${escapeHtml(item.winnerName)}</td>
                <td class="py-2.5 px-3">${genderBadge}</td>
                <td class="py-2.5 px-3 text-center font-bold">${item.quotasCount || 1}</td>
                <td class="py-2.5 px-3">${modeBadge}</td>
                <td class="py-2.5 px-3 text-slate-500">${dateFormatted}</td>
                <td class="py-2.5 px-3 text-right">${contactAction}</td>
            </tr>
        `;
    }).join('');
}

async function runRaffleDraw() {
    if (isRaffling) return;

    updateRaffleUI();

    if (!currentRaffleTickets || currentRaffleTickets.length === 0) {
        alert('⚠️ Não há participantes elegíveis na urna com as opções selecionadas. Certifique-se de que há palpites com pagamento confirmado!');
        return;
    }

    isRaffling = true;

    const displayBox = document.getElementById('raffle-display-box');
    const displayName = document.getElementById('raffle-display-name');
    const displayDetail = document.getElementById('raffle-display-detail');
    const winnerCard = document.getElementById('raffle-winner-card');
    const runBtn = document.getElementById('btn-run-raffle');
    const modeSelect = document.getElementById('raffle-mode-select');
    const targetGenderSelect = document.getElementById('raffle-target-gender');
    const prizeTitleInput = document.getElementById('raffle-prize-title');

    if (winnerCard) winnerCard.classList.add('hidden');
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.classList.add('opacity-60', 'cursor-not-allowed');
        runBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-xl"></i> <span>Sorteando...</span>`;
    }

    if (displayBox) {
        displayBox.className = 'w-full max-w-md mx-auto py-4 px-6 rounded-2xl bg-white border-2 border-[#8F56AD] shadow-md transition-all duration-100 animate-roulette-spin';
    }

    // Seleciona o bilhete vencedor antecipadamente com segurança criptográfica
    const winningTicket = selectWinningTicket(currentRaffleTickets);
    const totalDuration = 3800; // 3.8 segundos de animação e suspense
    const startTime = Date.now();
    let currentInterval = 35;

    function spinCycle() {
        const elapsed = Date.now() - startTime;
        const randomTicket = currentRaffleTickets[Math.floor(Math.random() * currentRaffleTickets.length)];

        if (displayName) displayName.textContent = randomTicket.guestName;
        if (displayDetail) {
            const genderTag = randomTicket.gender === 'girl' ? '🪆 Menina' : '🏋️ Menino';
            displayDetail.textContent = `Palpite: ${genderTag} • Cota ${randomTicket.quotaNumber} de ${randomTicket.totalQuotas}`;
        }

        if (elapsed < totalDuration) {
            // Desaceleração exponencial (easing out suave)
            const progress = elapsed / totalDuration;
            currentInterval = 35 + Math.pow(progress, 3) * 380;
            setTimeout(spinCycle, currentInterval);
        } else {
            finalizeDraw(winningTicket);
        }
    }

    spinCycle();

    async function finalizeDraw(winner) {
        if (displayBox) {
            displayBox.className = 'w-full max-w-md mx-auto py-4 px-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-md transition-all duration-300';
        }
        if (displayName) displayName.textContent = winner.guestName;
        if (displayDetail) displayDetail.textContent = `🎉 Vencedor(a) Sorteado(a)! (${winner.totalQuotas} cotas)`;

        const prizeTitle = prizeTitleInput ? prizeTitleInput.value.trim() : 'Prêmio do Bolão';
        const mode = modeSelect ? modeSelect.value : 'all';
        const targetGender = targetGenderSelect ? targetGenderSelect.value : null;

        const drawData = {
            guessId: winner.guessId,
            winnerName: winner.guestName,
            whatsapp: winner.whatsapp,
            gender: winner.gender,
            quotasCount: winner.totalQuotas,
            totalAmount: winner.totalAmount,
            mode,
            targetGender: mode === 'correct' ? targetGender : null,
            prizeTitle: prizeTitle || 'Prêmio do Bolão'
        };

        const savedResult = await saveDraw(drawData);

        // Disparo comemorativo de confetes
        triggerRaffleConfetti();

        // Renderiza e revela o cartão do vencedor
        if (winnerCard) {
            const nameEl = document.getElementById('raffle-winner-name');
            const genderEl = document.getElementById('raffle-winner-gender');
            const quotasEl = document.getElementById('raffle-winner-quotas');
            const waBtn = document.getElementById('raffle-winner-whatsapp-btn');

            if (nameEl) nameEl.textContent = winner.guestName;
            if (genderEl) genderEl.textContent = winner.gender === 'girl' ? '🪆 Votou em Menina' : '🏋️ Votou em Menino';
            if (quotasEl) quotasEl.textContent = `🎟️ ${winner.totalQuotas} Cota(s) (${winner.quotaNumber}ª cota premiada)`;

            const waLink = createWhatsAppCelebrationLink(savedResult, prizeTitle);
            if (waBtn) {
                if (waLink) {
                    waBtn.href = waLink;
                    waBtn.classList.remove('hidden');
                } else {
                    waBtn.classList.add('hidden');
                }
            }

            winnerCard.classList.remove('hidden');
        }

        if (runBtn) {
            runBtn.disabled = false;
            runBtn.classList.remove('opacity-60', 'cursor-not-allowed');
            runBtn.innerHTML = `<i class="fa-solid fa-dice text-xl text-[#CEE1DF]"></i> <span>Sortear Novamente</span>`;
        }

        isRaffling = false;
        updateRaffleUI();
        showToast(`🎉 Parabéns ${winner.guestName}! Sorteio concluído com sucesso!`, 'success');
    }
}

function triggerRaffleConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
        particleCount: 85,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#03665A', '#689D97', '#8F56AD', '#3B0069', '#FFD700', '#CEE1DF']
    });
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#03665A', '#8F56AD', '#BE9ECF']
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#3B0069', '#689D97', '#CEE1DF']
        });
    }, 250);
}

function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

