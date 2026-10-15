// js/state.js - Store de Estado Reativo e Cálculos de Cotas, Ranking e Arrecadação

import { defaultEventSettings } from './config.js';

let currentConfig = { ...defaultEventSettings };
let allGuesses = [];
const stateListeners = new Set();

export function updateStateFromConfig(newConfig) {
    currentConfig = { ...currentConfig, ...newConfig };
    emitStateChange();
}

export function updateStateFromGuesses(guesses) {
    allGuesses = Array.isArray(guesses) ? guesses : [];
    emitStateChange();
}

export function subscribeToState(callback) {
    stateListeners.add(callback);
    callback(getComputedState());
    return () => stateListeners.delete(callback);
}

function emitStateChange() {
    const computed = getComputedState();
    stateListeners.forEach(fn => fn(computed));
}

export function getComputedState() {
    const confirmedGuesses = allGuesses.filter(g => g.status === 'confirmed');
    const pendingGuesses = allGuesses.filter(g => g.status === 'pending');

    // Totais financeiros
    const totalArrecadado = confirmedGuesses.reduce((sum, g) => sum + (Number(g.totalAmount) || 0), 0);
    const totalPendente = pendingGuesses.reduce((sum, g) => sum + (Number(g.totalAmount) || 0), 0);

    const prizePercentage = Number(currentConfig.prizePercentage) || 50;
    const premioEstimado = (totalArrecadado * (prizePercentage / 100));
    const fundoEnxoval = (totalArrecadado * ((100 - prizePercentage) / 100));

    // Cotas do Placar (Menino vs Menina)
    let boyCotas = 0;
    let girlCotas = 0;

    confirmedGuesses.forEach(g => {
        const cotas = Number(g.quotasCount) || 1;
        if (g.gender === 'boy') boyCotas += cotas;
        if (g.gender === 'girl') girlCotas += cotas;
    });

    const totalCotas = boyCotas + girlCotas;
    let boyPercent = 50;
    let girlPercent = 50;

    if (totalCotas > 0) {
        boyPercent = Math.round((boyCotas / totalCotas) * 100);
        girlPercent = 100 - boyPercent;
    }

    // Identifica líder
    let leader = 'draw'; // 'boy' | 'girl' | 'draw'
    if (boyCotas > girlCotas) leader = 'boy';
    else if (girlCotas > boyCotas) leader = 'girl';

    // Maiores contribuidores (Ranking de participantes)
    const contributorMap = new Map();
    confirmedGuesses.forEach(g => {
        const key = g.guestName;
        const current = contributorMap.get(key) || { name: key, totalCotas: 0, totalAmount: 0, gender: g.gender };
        current.totalCotas += Number(g.quotasCount) || 1;
        current.totalAmount += Number(g.totalAmount) || 0;
        contributorMap.set(key, current);
    });

    const topContributors = Array.from(contributorMap.values())
        .sort((a, b) => b.totalCotas - a.totalCotas)
        .slice(0, 5);

    return {
        config: currentConfig,
        guesses: allGuesses,
        confirmedGuesses,
        pendingGuesses,
        totalConfirmedCount: confirmedGuesses.length,
        totalPendingCount: pendingGuesses.length,
        totalArrecadado,
        totalPendente,
        premioEstimado,
        fundoEnxoval,
        boyCotas,
        girlCotas,
        totalCotas,
        boyPercent,
        girlPercent,
        leader,
        topContributors
    };
}
