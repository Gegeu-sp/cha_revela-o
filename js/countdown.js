// js/countdown.js - Componente de Contagem Regressiva para a Data Prevista de Nascimento

let countdownInterval = null;

export function initCountdown(targetDateStr) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    renderCountdown(targetDateStr);
    countdownInterval = setInterval(() => {
        renderCountdown(targetDateStr);
    }, 60000); // Atualiza a cada 1 minuto
}

export function renderCountdown(targetDateStr) {
    const displayEl = document.getElementById('data-prevista-display');
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const countdownWrapper = document.getElementById('countdown-wrapper');

    if (!targetDateStr) return;

    // Converte YYYY-MM-DD para objeto Date às 00:00 local
    const parts = targetDateStr.split('-');
    if (parts.length !== 3) return;

    const targetDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    
    // Formatação em Português
    if (displayEl) {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        displayEl.textContent = targetDate.toLocaleDateString('pt-BR', options);
    }

    const now = new Date();
    const diffMs = targetDate - now;

    if (diffMs <= 0) {
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minutesEl) minutesEl.textContent = '0';
        if (countdownWrapper) {
            const messageEl = document.getElementById('countdown-message');
            if (messageEl) messageEl.textContent = '🍼 Chegou a hora do nosso bebê! 🎉';
        }
        return;
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    if (daysEl) daysEl.textContent = days.toString();
    if (hoursEl) hoursEl.textContent = hours.toString();
    if (minutesEl) minutesEl.textContent = minutes.toString();
}
