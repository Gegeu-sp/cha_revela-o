// js/app.js - Orquestrador Principal da Aplicação

import { initDatabase, subscribeToGuesses, subscribeToEventConfig, addGuess, isUsingCloud } from './db.js?v=2.2';
import { initAuth } from './auth.js?v=2.2';
import { updateStateFromConfig, updateStateFromGuesses, subscribeToState } from './state.js?v=2.2';
import { updateScoreboard } from './ranking.js?v=2.2';
import { initCountdown } from './countdown.js?v=2.2';
import { initAdminController, showToast } from './admin.js?v=2.2';

let latestState = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializa Banco de Dados, Autenticação e Admin
    await initDatabase();
    await initAuth();
    initAdminController();

    // 2. Conecta listeners de sincronização em tempo real
    subscribeToEventConfig((config) => {
        updateStateFromConfig(config);
    });

    subscribeToGuesses((guesses) => {
        updateStateFromGuesses(guesses);
    });

    // 3. Reage a qualquer mudança de estado calculada
    subscribeToState((state) => {
        latestState = state;
        renderPublicView(state);
    });

    // 4. Configura ouvintes dos formulários, Pix e Menu Mobile
    setupPublicForm();
    setupPixCopyHelper();
    setupMobileMenu();
});

function renderPublicView(state) {
    const { config, totalConfirmedCount, totalArrecadado, premioEstimado } = state;

    const boyName = config?.boyBabyName || 'Menino';
    const girlName = config?.girlBabyName || 'Menina';

    // Atualiza Textos do Evento e Nomes dos Bebês
    const heroTitle = document.getElementById('hero-title');
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

    if (config.quotaPrice) {
        const precoFormatado = `R$ ${Number(config.quotaPrice).toFixed(2).replace('.', ',')}`;
        cotaPriceTexts.forEach(el => el.textContent = precoFormatado);
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
    if (valorArrecadadoEl) valorArrecadadoEl.textContent = `R$ ${totalArrecadado.toFixed(2).replace('.', ',')}`;
    if (premioEstimadoEl) premioEstimadoEl.textContent = `R$ ${premioEstimado.toFixed(2).replace('.', ',')}`;

    // Indicador de Sincronização em Nuvem vs Local
    const cloudStatusEl = document.getElementById('cloud-sync-status');
    if (cloudStatusEl) {
        if (isUsingCloud()) {
            cloudStatusEl.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> <span class="text-emerald-700 font-bold">Nuvem Conectada (Sincronizado)</span>`;
        } else {
            cloudStatusEl.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <span class="text-amber-700 font-semibold">Modo Local (Demonstração)</span>`;
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
    const pixKey = config?.pixKey || 'charevelacao@email.com';
    const qrImg = document.getElementById('pix-qrcode-img');
    const qrTextContainer = document.getElementById('pix-copia-cola-text');

    // Monta payload Pix ou chave simples para geração imediata de QR Code
    const qrData = encodeURIComponent(pixKey);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}&color=1e293b`;

    if (qrImg && qrImg.src !== qrUrl) {
        qrImg.src = qrUrl;
    }

    if (qrTextContainer) {
        qrTextContainer.textContent = pixKey;
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
        const babyVoted = isBoy ? `🌿 ${boyName}` : `🌸 ${girlName}`;

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
            const pixKey = latestState?.config?.pixKey || 'charevelacao@email.com';

            const mensagemWhats = `Olá! Meu nome é *${nome}*.\nAcabei de registrar meu palpite no Bolão de Chá Revelação!\n\n` +
                `🎯 Meu palpite oficial: *É ${babyNameChosen.toUpperCase()}! ${icon}*\n` +
                `🎟️ Quantidade de Cotas: *${quotasCount} cota${quotasCount > 1 ? 's' : ''}* (R$ ${totalAmount.toFixed(2).replace('.', ',')})\n` +
                `🔑 Chave Pix: ${pixKey}\n\n` +
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
    const copyBtns = document.querySelectorAll('.btn-copy-pix');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pixKey = latestState?.config?.pixKey || '';
            if (pixKey) {
                navigator.clipboard.writeText(pixKey).then(() => {
                    showToast('Chave Pix copiada com sucesso!', 'success');
                }).catch(() => {
                    prompt('Copie a chave Pix:', pixKey);
                });
            }
        });
    });
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
