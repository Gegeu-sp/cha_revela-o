// js/app.js - Orquestrador Principal da Aplicação

import { initDatabase, subscribeToGuesses, subscribeToEventConfig, subscribeToDraws, addGuess, isUsingCloud } from './db.js';
import { initAuth } from './auth.js';
import { updateStateFromConfig, updateStateFromGuesses, updateStateFromDraws, subscribeToState, getComputedState } from './state.js';
import { updateScoreboard } from './ranking.js';
import { initCountdown } from './countdown.js';
import { initAdminController, showToast } from './admin.js';

let latestState = null;

function initApp() {
    // 1. Conecta observadores do store reativo
    subscribeToEventConfig((config) => {
        updateStateFromConfig(config);
    });

    subscribeToGuesses((guesses) => {
        updateStateFromGuesses(guesses);
    });

    subscribeToDraws((draws) => {
        updateStateFromDraws(draws);
    });

    // 2. Reage a qualquer mudança de estado calculada e renderiza IMEDIATAMENTE (Zero tempo de espera)
    subscribeToState((state) => {
        latestState = state;
        renderPublicView(state);
    });

    // 3. Configura formulários, helpers e menu
    setupPublicForm();
    setupPixCopyHelper();
    setupMobileMenu();

    // 4. Inicializa painel administrativo
    initAdminController();

    // 5. Conecta ao Firebase Firestore e Auth em segundo plano de forma assíncrona não-bloqueante
    initDatabase().catch(err => console.warn('Aviso ao conectar Firestore:', err));
    initAuth().catch(err => console.warn('Aviso ao inicializar Auth:', err));
}

// Disparo garantido imediato (se o documento já estiver pronto, executa agora)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function renderPublicView(state) {
    const { config, totalConfirmedCount, totalArrecadado, premioEstimado } = state;

    const boyName = config?.boyBabyName || 'Menino';
    const girlName = config?.girlBabyName || 'Menina';
    const unitPrice = Number(config?.quotaPrice) || 15.00;
    const precoFormatado = `R$ ${unitPrice.toFixed(2).replace('.', ',')}`;

    // Atualiza Textos do Evento e Nomes dos Bebês
    const heroBabyNames = document.getElementById('hero-baby-names');
    const labelBoyVote = document.getElementById('label-boy-vote');
    const labelGirlVote = document.getElementById('label-girl-vote');
    const cotaPriceTexts = document.querySelectorAll('.cota-preco-texto');
    const pixKeyElements = document.querySelectorAll('.pix-key-display');
    const pixReceiverElements = document.querySelectorAll('.pix-receiver-display');

    if (heroBabyNames) {
        heroBabyNames.innerHTML = `<span class="text-[#03665A] font-bold truncate max-w-[120px] sm:max-w-none inline-block">${escapeHtml(boyName)}</span> <span class="text-slate-400 font-normal px-0.5">vs</span> <span class="text-[#3B0069] font-bold truncate max-w-[120px] sm:max-w-none inline-block">${escapeHtml(girlName)}</span>`;
    }

    if (labelBoyVote) {
        labelBoyVote.textContent = `É o ${boyName}!`;
    }
    if (labelGirlVote) {
        labelGirlVote.textContent = `É a ${girlName}!`;
    }

    // Atualiza todos os textos com preço da cota
    cotaPriceTexts.forEach(el => el.textContent = precoFormatado);

    // Atualiza opções do select e valor calculado dinamicamente com base no quotaPrice da área dos pais
    const quotasSelect = document.getElementById('quotas-select');
    const valorCalculadoDisplay = document.getElementById('valor-calculado-display');
    if (quotasSelect) {
        const currentSelected = parseInt(quotasSelect.value) || 1;
        const optionsData = [
            { count: 1, label: '1 Cota' },
            { count: 2, label: '2 Cotas (Maior Chance!)' },
            { count: 3, label: '3 Cotas' },
            { count: 5, label: '5 Cotas (Super Palpite!)' },
            { count: 10, label: '10 Cotas (Padrinho/Madrinha)' }
        ];
        quotasSelect.innerHTML = optionsData.map(opt => {
            const totalOpt = (opt.count * unitPrice).toFixed(2).replace('.', ',');
            return `<option value="${opt.count}" ${opt.count === currentSelected ? 'selected' : ''}>${opt.label} - R$ ${totalOpt}</option>`;
        }).join('');

        if (valorCalculadoDisplay) {
            const totalAtual = (currentSelected * unitPrice).toFixed(2).replace('.', ',');
            valorCalculadoDisplay.textContent = `R$ ${totalAtual}`;
        }
    }

    if (config.pixKey) {
        pixKeyElements.forEach(el => el.textContent = config.pixKey);
    }
    if (config.pixReceiverName) {
        pixReceiverElements.forEach(el => el.textContent = config.pixReceiverName);
    }

    // Atualiza QR Code Dinâmico do Pix
    updatePixQrCode(config);

    // Contadores de Estatísticas
    const totalPalpitesEl = document.getElementById('total-palpites');
    const valorArrecadadoEl = document.getElementById('valor-arrecadado');
    const premioEstimadoEl = document.getElementById('premio-estimado');

    if (totalPalpitesEl) totalPalpitesEl.textContent = totalConfirmedCount.toString();
    if (valorArrecadadoEl) valorArrecadadoEl.innerHTML = `<span class="text-xs sm:text-base font-bold opacity-75 mr-0.5">R$</span>${totalArrecadado.toFixed(2).replace('.', ',')}`;
    if (premioEstimadoEl) premioEstimadoEl.innerHTML = `<span class="text-xs sm:text-base font-bold opacity-75 mr-0.5">R$</span>${premioEstimado.toFixed(2).replace('.', ',')}`;

    // Indicador de Sincronização em Nuvem vs Local
    const cloudStatusEl = document.getElementById('cloud-sync-status');
    if (cloudStatusEl) {
        if (isUsingCloud()) {
            cloudStatusEl.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> <span class="text-emerald-700 font-bold">Nuvem Conectada (Sincronizado)</span>`;
        } else {
            cloudStatusEl.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> <span class="text-emerald-700 font-semibold">Sincronizado em tempo real</span>`;
        }
    }

    // Placar da Disputa
    updateScoreboard(state);

    // Contagem Regressiva
    if (config.expectedBirthDate) {
        initCountdown(config.expectedBirthDate);
    }

    // Tabela Pública de Palpites
    renderPublicGuessesTable(state.guesses, boyName, girlName);
}

function updatePixQrCode(config) {
    const pixKey = config?.pixKey || 'argeu-rodrigues-dxm@jim.com';
    const copiaECola = config?.pixCopiaECola || '00020101021126490014BR.GOV.BCB.PIX0127argeu-rodrigues-dxm@jim.com5204000053039865802BR5925ARGEU RODRIGUES PINTO FIL6009SAO PAULO62070503***63040836';
    const qrUrl = config?.pixQrCodeUrl || 'assets/pix-qrcode.png';

    const qrImg = document.getElementById('pix-qrcode-img');
    const qrTextContainer = document.getElementById('pix-copia-cola-text');

    if (qrImg && !qrImg.src.endsWith(qrUrl)) {
        qrImg.src = qrUrl;
    }

    if (qrTextContainer) {
        qrTextContainer.textContent = copiaECola;
    }
}

function renderPublicGuessesTable(guesses, boyName, girlName) {
    const tbody = document.getElementById('tabela-corpo');
    if (!tbody) return;

    if (!guesses || guesses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-slate-400 text-sm">Nenhum palpite enviado ainda. O bolão está zerado e pronto para começar! 🍼</td></tr>`;
        return;
    }

    tbody.innerHTML = guesses.map(g => {
        const isBoy = g.gender === 'boy';
        const badgeColor = isBoy 
            ? 'bg-[#CEE1DF] text-[#03665A] border border-[#689D97]/30' 
            : 'bg-[#BE9ECF]/40 text-[#3B0069] border border-[#8F56AD]/30';
        const babyVoted = isBoy ? `🏋️ ${boyName}` : `🪆 ${girlName}`;

        let statusBadge = '';
        if (g.status === 'confirmed') {
            statusBadge = `<span class="text-[#03665A] font-extrabold text-xs flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600"></i> Confirmado</span>`;
        } else if (g.status === 'cancelled') {
            statusBadge = `<span class="text-red-500 font-semibold text-xs flex items-center gap-1.5"><i class="fa-solid fa-circle-xmark"></i> Cancelado</span>`;
        } else {
            statusBadge = `<span class="text-amber-700 font-semibold text-xs flex items-center gap-1.5 animate-pulse"><i class="fa-solid fa-clock text-amber-500"></i> Aguardando Pix</span>`;
        }

        const cotas = g.quotasCount || 1;

        return `
            <tr class="hover:bg-white/60 transition ${g.status === 'confirmed' ? '' : 'bg-amber-50/15'}">
                <td class="py-4 px-6 font-medium text-slate-800">
                    <span class="font-bold">${escapeHtml(g.guestName)}</span>
                    ${g.isManual ? '<span class="ml-1 text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">Manual</span>' : ''}
                </td>
                <td class="py-4 px-6">
                    <span class="${badgeColor} px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        ${babyVoted}
                    </span>
                </td>
                <td class="py-4 px-6 text-center font-extrabold text-slate-700">
                    ${cotas} <span class="text-xs font-normal text-slate-400">cota${cotas > 1 ? 's' : ''}</span>
                </td>
                <td class="py-4 px-6">${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

function setupPublicForm() {
    const form = document.getElementById('bolao-form');
    const quotasSelect = document.getElementById('quotas-select');
    const valorCalculadoDisplay = document.getElementById('valor-calculado-display');
    const successAlert = document.getElementById('success-alert');
    const whatsappLink = document.getElementById('whatsapp-link');

    if (!form) return;

    // Recalcula valor total dinamicamente
    const recalculateTotal = () => {
        const quotas = parseInt(quotasSelect?.value) || 1;
        const unitPrice = latestState?.config?.quotaPrice || 15.00;
        const total = quotas * unitPrice;
        if (valorCalculadoDisplay) {
            valorCalculadoDisplay.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
    };

    if (quotasSelect) {
        quotasSelect.addEventListener('change', recalculateTotal);
        quotasSelect.addEventListener('input', recalculateTotal);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const palpiteEl = document.querySelector('input[name="palpite"]:checked');
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const quotasCount = parseInt(quotasSelect?.value) || 1;
        const unitPrice = latestState?.config?.quotaPrice || 15.00;
        const totalAmount = quotasCount * unitPrice;

        if (!nome || !palpiteEl) {
            alert('Por favor, preencha seu nome e escolha seu palpite!');
            return;
        }

        const gender = palpiteEl.value; // 'boy' ou 'girl'
        const boyName = latestState?.config?.boyBabyName || 'Menino';
        const girlName = latestState?.config?.girlBabyName || 'Menina';
        const babyNameChosen = gender === 'boy' ? boyName : girlName;

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Registrando...`;

        try {
            await addGuess({
                guestName: nome,
                whatsapp,
                gender,
                babyNameChosen,
                quotasCount,
                unitPrice,
                totalAmount,
                status: 'pending',
                isManual: false
            });

            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-check-circle"></i> Confirmar e Salvar Palpite`;

            // Prepara texto e link para WhatsApp
            const icon = gender === 'boy' ? '💙' : '💖';
            const pixKey = latestState?.config?.pixKey || 'argeu-rodrigues-dxm@jim.com';
            const pixReceiver = latestState?.config?.pixReceiverName || 'ARGEU RODRIGUES PINTO FIL';

            const mensagemWhats = `Olá! Meu nome é *${nome}*.\nAcabei de registrar meu palpite no Bolão de Chá Revelação!\n\n` +
                `🎯 Meu palpite oficial: *É ${babyNameChosen.toUpperCase()}! ${icon}*\n` +
                `🎟️ Quantidade de Cotas: *${quotasCount} cota${quotasCount > 1 ? 's' : ''}* (R$ ${totalAmount.toFixed(2).replace('.', ',')})\n` +
                `🔑 Chave Pix: ${pixKey}\n` +
                `👤 Titular: ${pixReceiver}\n\n` +
                `Segue em anexo o comprovante da transferência Pix! 📸✨`;

            if (whatsappLink) {
                whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(mensagemWhats)}`;
            }

            form.reset();
            recalculateTotal();

            if (successAlert) {
                successAlert.classList.remove('hidden');
                successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            showToast('Palpite registrado com sucesso! Agora envie o comprovante no WhatsApp.', 'success');
        } catch (err) {
            console.error(err);
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-check-circle"></i> Confirmar e Salvar Palpite`;
            alert('Ocorreu um erro ao salvar o palpite. Tente novamente.');
        }
    });
}

function setupPixCopyHelper() {
    // 1. Copiar Chave Pix Simples (E-mail)
    const copyKeyBtns = document.querySelectorAll('.btn-copy-pix');
    copyKeyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pixKey = latestState?.config?.pixKey || 'argeu-rodrigues-dxm@jim.com';
            if (pixKey) {
                copyTextToClipboard(pixKey, 'Chave Pix copiada com sucesso! 📋');
            }
        });
    });

    // 2. Copiar Código Pix Copia e Cola (BR Code completo)
    const copyCopiaColaBtns = document.querySelectorAll('.btn-copy-copia-cola');
    copyCopiaColaBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const code = latestState?.config?.pixCopiaECola || 
                '00020101021126490014BR.GOV.BCB.PIX0127argeu-rodrigues-dxm@jim.com5204000053039865802BR5925ARGEU RODRIGUES PINTO FIL6009SAO PAULO62070503***63040836';
            if (code) {
                copyTextToClipboard(code, 'Código Pix Copia e Cola copiado! Cole no aplicativo do seu banco para pagar. 🚀');
            }
        });
    });

    // 3. Modal de Ampliação do QR Code Pix
    const modalQr = document.getElementById('modal-qr-expand');
    const btnExpand = document.getElementById('btn-expand-qr');
    const triggerContainer = document.getElementById('qr-container-trigger');
    const btnCloseModal = document.getElementById('btn-close-qr-modal');

    const openQrModal = (e) => {
        if (e) e.preventDefault();
        if (modalQr) modalQr.classList.remove('hidden');
    };

    const closeQrModal = (e) => {
        if (e) e.preventDefault();
        if (modalQr) modalQr.classList.add('hidden');
    };

    if (btnExpand) btnExpand.addEventListener('click', openQrModal);
    if (triggerContainer) triggerContainer.addEventListener('click', openQrModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeQrModal);
    if (modalQr) {
        modalQr.addEventListener('click', (e) => {
            if (e.target === modalQr) closeQrModal();
        });
    }
}

function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg, 'success');
        }).catch(() => {
            fallbackCopyText(text, successMsg);
        });
    } else {
        fallbackCopyText(text, successMsg);
    }
}

function fallbackCopyText(text, successMsg) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast(successMsg, 'success');
        } else {
            prompt('Copie o código abaixo:', text);
        }
    } catch {
        prompt('Copie o código abaixo:', text);
    } finally {
        document.body.removeChild(textarea);
    }
}

function setupMobileMenu() {
    const btn = document.getElementById('btn-mobile-menu');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}
