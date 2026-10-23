// js/raffle.js - Motor de Sorteio Ponderado, Urna Virtual e Mensagens Festivas

/**
 * Monta a urna de bilhetes virtuais ponderada por cotas adquiridas
 * @param {Array} guesses Lista de palpites do estado
 * @param {Object} options Configurações do sorteio (mode, targetGender, excludePreviousWinners)
 * @param {Array} previousWinners Lista de vencedores já sorteados
 * @returns {Array} Array de bilhetes virtuais para amostragem aleatória
 */
export function buildRaffleTickets(guesses = [], options = {}, previousWinners = []) {
    const {
        mode = 'all', // 'all' | 'correct'
        targetGender = null, // 'boy' | 'girl' | null
        excludePreviousWinners = true
    } = options;

    // Filtra apenas participantes com status confirmado
    let eligible = (Array.isArray(guesses) ? guesses : []).filter(g => g.status === 'confirmed');

    // Se a modalidade for 'Apenas Acertadores', filtra pelo gênero revelado
    if (mode === 'correct' && targetGender) {
        eligible = eligible.filter(g => g.gender === targetGender);
    }

    // Se deve excluir ganhadores anteriores
    if (excludePreviousWinners && Array.isArray(previousWinners) && previousWinners.length > 0) {
        const winnerKeys = new Set(
            previousWinners.map(w => (w.guessId ? String(w.guessId) : w.winnerName?.trim().toLowerCase()))
        );

        eligible = eligible.filter(g => {
            const keyById = g.id ? String(g.id) : null;
            const keyByName = g.guestName?.trim().toLowerCase();
            return !winnerKeys.has(keyById) && !winnerKeys.has(keyByName);
        });
    }

    // Gera os bilhetes virtuais: 1 cota = 1 bilhete na urna
    const tickets = [];
    eligible.forEach((guess, guessIndex) => {
        const quotasCount = Math.max(1, parseInt(guess.quotasCount, 10) || 1);
        for (let q = 1; q <= quotasCount; q++) {
            tickets.push({
                ticketIndex: tickets.length,
                guessId: guess.id || `guess_${guessIndex}`,
                guestName: guess.guestName || 'Convidado Anônimo',
                gender: guess.gender || 'boy',
                whatsapp: guess.whatsapp || '',
                quotaNumber: q,
                totalQuotas: quotasCount,
                totalAmount: Number(guess.totalAmount) || 0,
                guessObj: guess
            });
        }
    });

    // Embaralha a urna usando Fisher-Yates para garantia estatística
    return shuffleTickets(tickets);
}

/**
 * Embaralha a urna de bilhetes
 */
function shuffleTickets(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = getSecureRandomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Retorna um inteiro aleatório no intervalo [0, max - 1] com suporte criptográfico
 */
function getSecureRandomInt(max) {
    if (max <= 1) return 0;
    const cryptoObj = (typeof globalThis !== 'undefined' && globalThis.crypto) || (typeof window !== 'undefined' && window.crypto);
    if (cryptoObj && cryptoObj.getRandomValues) {
        const randomBuffer = new Uint32Array(1);
        cryptoObj.getRandomValues(randomBuffer);
        return randomBuffer[0] % max;
    }
    return Math.floor(Math.random() * max);
}

/**
 * Seleciona aleatoriamente o bilhete vencedor da urna
 * @param {Array} tickets Urna de bilhetes gerada por buildRaffleTickets
 * @returns {Object|null} Bilhete vencedor selecionado ou null se vazia
 */
export function selectWinningTicket(tickets) {
    if (!Array.isArray(tickets) || tickets.length === 0) return null;
    const winnerIndex = getSecureRandomInt(tickets.length);
    return tickets[winnerIndex];
}

/**
 * Gera URL direta do WhatsApp com mensagem de parabéns pré-formatada
 * @param {Object} winner Dados do vencedor sorteado
 * @param {string} prizeTitle Título da premiação
 * @returns {string|null} URL do WhatsApp ou null se não houver telefone
 */
export function createWhatsAppCelebrationLink(winner, prizeTitle = 'Prêmio do Bolão') {
    if (!winner) return null;
    let phone = (winner.whatsapp || '').replace(/\D/g, '');
    if (!phone) return null;

    // Se o telefone brasileiro não tiver DDI (55), adiciona automaticamente
    if (phone.length === 10 || phone.length === 11) {
        phone = '55' + phone;
    }

    const genderText = winner.gender === 'girl' ? 'Menina 🪆' : 'Menino 🏋️';
    const text = `🎉 *PARABÉNS, ${winner.winnerName}!* 👶🍼✨\n\nVocê acabou de ser SORTEADO(A) no *${prizeTitle}* do nosso Chá Revelação com seu palpite para *${genderText}* (${winner.quotasCount || 1} cota(s))!\n\nEntramos em contato para celebrar e transferir o seu prêmio. Muito obrigado pelo carinho e por apoiar o nosso bebê! ❤️`;

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
}
