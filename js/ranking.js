// js/ranking.js - Placar Animado da Disputa (Menino vs Menina) e Efeitos Visuais

export function updateScoreboard(state) {
    const { config, boyPercent, girlPercent, boyCotas, girlCotas, leader, topContributors } = state;

    const boyName = config?.boyBabyName || 'Menino';
    const girlName = config?.girlBabyName || 'Menina';

    const barBoy = document.getElementById('score-bar-boy');
    const barGirl = document.getElementById('score-bar-girl');
    const percentBoyEl = document.getElementById('score-percent-boy');
    const percentGirlEl = document.getElementById('score-percent-girl');
    const cotasBoyEl = document.getElementById('score-cotas-boy');
    const cotasGirlEl = document.getElementById('score-cotas-girl');
    const nameBoyEl = document.getElementById('score-name-boy');
    const nameGirlEl = document.getElementById('score-name-girl');
    const leaderStatusEl = document.getElementById('scoreboard-leader-status');
    const cardBoy = document.getElementById('score-card-boy');
    const cardGirl = document.getElementById('score-card-girl');

    if (nameBoyEl) nameBoyEl.textContent = `É o ${boyName}!`;
    if (nameGirlEl) nameGirlEl.textContent = `É a ${girlName}!`;

    if (barBoy && barGirl) {
        barBoy.style.width = `${boyPercent}%`;
        barGirl.style.width = `${girlPercent}%`;
        barBoy.textContent = boyPercent > 10 ? `${boyName} (${boyPercent}%)` : `${boyPercent}%`;
        barGirl.textContent = girlPercent > 10 ? `${girlName} (${girlPercent}%)` : `${girlPercent}%`;
    }

    if (percentBoyEl) percentBoyEl.textContent = `${boyPercent}%`;
    if (percentGirlEl) percentGirlEl.textContent = `${girlPercent}%`;
    if (cotasBoyEl) cotasBoyEl.textContent = `${boyCotas} cota${boyCotas !== 1 ? 's' : ''}`;
    if (cotasGirlEl) cotasGirlEl.textContent = `${girlCotas} cota${girlCotas !== 1 ? 's' : ''}`;

    // Estilos de liderança e destaques visuais
    if (cardBoy && cardGirl && leaderStatusEl) {
        cardBoy.classList.remove('leader-boy', 'border-blue-500', 'border-[#03665A]');
        cardGirl.classList.remove('leader-girl', 'border-pink-500', 'border-[#8F56AD]');

        if (leader === 'boy') {
            cardBoy.classList.add('leader-boy', 'border-[#03665A]');
            leaderStatusEl.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#CEE1DF] text-[#03665A] text-xs font-extrabold animate-pulse shadow-sm">
                    <i class="fa-solid fa-crown text-amber-500 text-sm"></i> ${boyName} está na liderança! 🏋️
                </span>
            `;
        } else if (leader === 'girl') {
            cardGirl.classList.add('leader-girl', 'border-[#8F56AD]');
            leaderStatusEl.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#BE9ECF]/40 text-[#3B0069] text-xs font-extrabold animate-pulse shadow-sm">
                    <i class="fa-solid fa-crown text-amber-500 text-sm"></i> ${girlName} está na liderança! 🪆
                </span>
            `;
        } else {
            leaderStatusEl.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#CEE1DF]/50 text-[#3B0069] text-xs font-extrabold shadow-sm">
                    <i class="fa-solid fa-scale-balanced text-[#8F56AD]"></i> Disputa acirrada: Empate técnico entre ${boyName} e ${girlName}! ✨
                </span>
            `;
        }
    }

    renderTopContributors(topContributors, boyName, girlName);
}

function renderTopContributors(topContributors, boyName, girlName) {
    const listEl = document.getElementById('ranking-colaboradores');
    if (!listEl) return;

    if (!topContributors || topContributors.length === 0) {
        listEl.innerHTML = `
            <div class="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                Ainda não há palpites confirmados para o ranking. Seja o primeiro a participar! 🍼
            </div>
        `;
        return;
    }

    const medals = ['🥇', '🥈', '🥉', '4º', '5º'];
    listEl.innerHTML = topContributors.map((c, index) => {
        const isBoy = c.gender === 'boy';
        const badgeColor = isBoy 
            ? 'bg-[#CEE1DF] text-[#03665A] border border-[#689D97]/30' 
            : 'bg-[#BE9ECF]/40 text-[#3B0069] border border-[#8F56AD]/30';
        const babyVoted = isBoy ? `🏋️ ${boyName}` : `🪆 ${girlName}`;
        return `
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
                <div class="flex items-center gap-3">
                    <span class="text-base font-heading font-extrabold text-slate-700 w-6 text-center">${medals[index] || (index + 1)}</span>
                    <div>
                        <div class="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            ${escapeHtml(c.name)} <span class="text-xs font-semibold text-slate-500">(${babyVoted})</span>
                        </div>
                        <div class="text-[11px] text-slate-400">
                            ${c.totalCotas} cota${c.totalCotas !== 1 ? 's' : ''} adquirida${c.totalCotas !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-xs font-extrabold ${badgeColor} px-3 py-1 rounded-full inline-block">
                        R$ ${Number(c.totalAmount).toFixed(2).replace('.', ',')}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// Disparo festivo de confetes com a paleta oficial
export function triggerCelebration() {
    try {
        if (typeof window.confetti === 'function') {
            window.confetti({
                particleCount: 110,
                spread: 85,
                origin: { y: 0.6 },
                colors: ['#3B0069', '#8F56AD', '#BE9ECF', '#CEE1DF', '#689D97', '#03665A', '#FFD700']
            });
        }
    } catch (e) {
        console.log('Confetti effect triggered:', e);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}
