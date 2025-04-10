const pokemonData = [
    {name: 'Pikachu', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', strength: 7, speed: 9, ability: 'Thunderbolt'},
    {name: 'Charizard', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', strength: 9, speed: 8, ability: 'Flamethrower'},
    {name: 'Blastoise', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', strength: 8, speed: 7, ability: 'Hydro Pump'},
    {name: 'Venusaur', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', strength: 8, speed: 6, ability: 'Solar Beam'},
    {name: 'Gengar', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png', strength: 7, speed: 8, ability: 'Shadow Ball'},
    {name: 'Dragonite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', strength: 9, speed: 7, ability: 'Outrage'},
    {name: 'Jigglypuff', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png', strength: 5, speed: 4, ability: 'Sing'},
    {name: 'Machamp', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png', strength: 10, speed: 5, ability: 'Karate Chop'},
    {name: 'Eevee', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png', strength: 6, speed: 7, ability: 'Adaptability'},
    {name: 'Snorlax', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png', strength: 10, speed: 2, ability: 'Rest'},
    {name: 'Gyarados', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png', strength: 9, speed: 6, ability: 'Hydro Pump'},
    {name: 'Alakazam', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png', strength: 6, speed: 9, ability: 'Psychic'},
    {name: 'Arcanine', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png', strength: 8, speed: 7, ability: 'Fire Blast'},
    {name: 'Lapras', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png', strength: 8, speed: 5, ability: 'Ice Beam'},
    {name: 'Rhydon', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png', strength: 10, speed: 3, ability: 'Earthquake'},
    {name: 'Golem', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png', strength: 9, speed: 4, ability: 'Rock Slide'},
    {name: 'Exeggutor', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/103.png', strength: 7, speed: 5, ability: 'Solar Beam'},
    {name: 'Magmar', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png', strength: 8, speed: 7, ability: 'Fire Punch'},
    {name: 'Vaporeon', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png', strength: 7, speed: 6, ability: 'Water Pulse'}
];

let selectedPokemon = [];
let cpuTeam = [];
let battleStage;
let currentRound = 1;
let playerScore = 0;
let cpuScore = 0;
let roundResults = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('battle-btn').addEventListener('click', startBattle);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('result-modal').addEventListener('click', (e) => {
        if(e.target === document.getElementById('result-modal')) closeModal();
    });
});

function startGame() {
     // Limpar batalha anterior
     const existingBattleStage = document.querySelector('.battle-stage');
     if (existingBattleStage) existingBattleStage.remove();

    const startScreen = document.getElementById('start-screen');
    const body = document.body;
    
    startScreen.classList.add('hidden');
    document.querySelector('header').classList.remove('hidden');
    document.querySelector('.container').classList.remove('hidden');
    body.classList.add('game-started');

    // Resetar seleção
    const deck = document.getElementById('player-deck');
    deck.innerHTML = '';
    
    // Selecionar novos pokémons
    const roundPokemon = [...pokemonData]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
    
    roundPokemon.forEach(pokemon => {
        const card = createCard(pokemon);
        deck.appendChild(card);
    });

  // Atualizar UI
    document.getElementById('battle-btn').classList.remove('hidden');
    document.getElementById('battle-btn').disabled = true;
    selectedPokemon = [];
    
    updateScoreBoard();
}

function updateScoreBoard() {
    document.querySelector('.score-board').innerHTML = `
        <span>Rodada: ${currentRound}/3</span>
        <span>Player: ${playerScore}</span>
        <span>CPU: ${cpuScore}</span>
    `;
}

function createCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
        <img src="${pokemon.img}" alt="${pokemon.name}">
        <h3>${pokemon.name}</h3>
        <div class="stats">
            <div>Força: ${pokemon.strength}</div>
            <div>Velocidade: ${pokemon.speed}</div>
            <div>Habilidade: ${pokemon.ability}</div>
        </div>
    `;
    
    card.addEventListener('click', () => selectPokemon(card, pokemon));
    return card;
}

function selectPokemon(card, pokemon) {
    if(selectedPokemon.includes(pokemon)) {
        card.classList.remove('selected');
        selectedPokemon = selectedPokemon.filter(p => p !== pokemon);
    } else {
        if(selectedPokemon.length >= 3) return;
        card.classList.add('selected');
        selectedPokemon.push(pokemon);
    }
    
    document.getElementById('battle-btn').disabled = selectedPokemon.length !== 3;
}

function generateCPUTeam() {
    const availableCPU = [...pokemonData]
        .filter(p => !selectedPokemon.includes(p))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    cpuTeam = availableCPU;
    
    const cpuDeck = document.getElementById('cpu-deck');
    const cpuTitle = document.querySelectorAll('.team-title')[1];
    
    cpuDeck.innerHTML = '';
    cpuDeck.classList.remove('hidden');
    cpuTitle.classList.remove('hidden');
    
    cpuTeam.forEach(pokemon => {
        const card = createCard(pokemon);
        card.classList.add('cpu-card');
        card.style.pointerEvents = 'none';
        cpuDeck.appendChild(card);
    });
}

async function startBattle() {
     // Bloquear novas batalhas após 3 rodadas
     if(currentRound > 3) return;
    document.getElementById('player-deck').classList.add('hidden');
    document.getElementById('battle-music').play();
    generateCPUTeam();
    
    battleStage = document.createElement('div');
    battleStage.className = 'battle-stage';
    document.querySelector('.game-area').appendChild(battleStage);
    
    let playerWins = 0;
    let cpuWins = 0;
    
    for(let i = 0; i < 3; i++) {
        const playerPokemon = selectedPokemon[i];
        const cpuPokemon = cpuTeam[i];
        
        battleStage.innerHTML = `
        <h2 class="round-info">Rodada ${currentRound}</h2>
        <div class="battle-row">
            <div class="battle-pokemon">
                <img src="${playerPokemon.img}" class="player-pokemon">
                <div class="health-bar">
                    <div class="health-progress" style="width: 100%"></div>
                </div>
            </div>
            <div class="versus">VS</div>
            <div class="battle-pokemon">
                <img src="${cpuPokemon.img}" class="cpu-pokemon">
                <div class="health-bar">
                    <div class="health-progress" style="width: 100%"></div>
                </div>
            </div>
        </div>
    `;
        
        const result = await animateAttack(playerPokemon, cpuPokemon);
        if(result === 'player') playerWins++;
        else if(result === 'cpu') cpuWins++;
    }
    
    roundResults.push({
        round: currentRound,
        playerWins,
        cpuWins,
        playerTeam: selectedPokemon.map(p => p.name),
        cpuTeam: cpuTeam.map(p => p.name)
    });
    
    handleBattleResult(playerWins, cpuWins);
}

async function animateAttack(attacker, defender) {
    const attackImg = battleStage.querySelector('.player-pokemon');
    const defendImg = battleStage.querySelector('.cpu-pokemon');
    
    attackImg.classList.add('attacking');
    document.getElementById('attack-sound').play();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const playerPower = attacker.strength + attacker.speed;
    const cpuPower = defender.strength + defender.speed;
    const damage = Math.abs(playerPower - cpuPower);
    
    const healthBar = defendImg.parentElement.querySelector('.health-progress');
    healthBar.style.width = `${Math.max(0, 100 - damage * 10)}%`;
    
    defendImg.classList.add('hit');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    attackImg.classList.remove('attacking');
    defendImg.classList.remove('hit');
    
    return playerPower > cpuPower ? 'player' : 'cpu';
}

function handleBattleResult(playerWins, cpuWins) {
    playerScore += playerWins;
    cpuScore += cpuWins;
    
    if(currentRound === 3) {
        showFinalResults();
        document.getElementById('battle-btn').classList.add('hidden');
    } else {
        showRoundResult(playerWins, cpuWins);
    }
}

function showRoundResult(playerWins, cpuWins) {
    const resultModal = document.getElementById('result-modal');
    resultModal.classList.remove('hidden');
    
    document.getElementById('result-title').innerHTML = `
        <h2>Rodada ${currentRound} Concluída!</h2>
        <h3>${playerWins > cpuWins ? 'Vitória!' : cpuWins > playerWins ? 'Derrota!' : 'Empate!'}</h3>
    `;
    
    document.getElementById('player-result').innerHTML = `
        <h4>Vitórias: ${playerWins}</h4>
        <p>Pokémons: ${selectedPokemon.map(p => p.name).join(', ')}</p>
    `;
    
    document.getElementById('cpu-result').innerHTML = `
        <h4>Vitórias: ${cpuWins}</h4>
        <p>Pokémons: ${cpuTeam.map(p => p.name).join(', ')}</p>
    `;
    
    document.getElementById('reset-btn').textContent = 'Próxima Rodada';

   // Atualizar currentRound após mostrar resultados
   currentRound++;
   updateScoreBoard();
}

function showFinalResults() {
    const resultModal = document.getElementById('result-modal');
    resultModal.classList.remove('hidden');
    
    // Esconder botão de batalha após última rodada
    document.getElementById('battle-btn').classList.add('hidden');

    document.getElementById('result-title').innerHTML = `
        <h2>Campeão do Torneio!</h2>
        <h3>${playerScore > cpuScore ? 'Parabéns, Você Venceu!' : cpuScore > playerScore ? 'A CPU Venceu!' : 'Empate!'}</h3>
    `;
    
    document.getElementById('player-result').innerHTML = `
        <h4>Total de Vitórias: ${playerScore}</h4>
        ${roundResults.map(r => `
            <div class="round-summary">
                <h5>Rodada ${r.round}:</h5>
                <p>Vitórias: ${r.playerWins}</p>
                <p>Pokémons: ${r.playerTeam.join(', ')}</p>
            </div>
        `).join('')}
    `;
    
    document.getElementById('cpu-result').innerHTML = `
        <h4>Total de Vitórias: ${cpuScore}</h4>
        ${roundResults.map(r => `
            <div class="round-summary">
                <h5>Rodada ${r.round}:</h5>
                <p>Vitórias: ${r.cpuWins}</p>
                <p>Pokémons: ${r.cpuTeam.join(', ')}</p>
            </div>
        `).join('')}
    `;
    
    document.getElementById('reset-btn').textContent = 'Jogar Novamente';
}

function resetGame() {
    const isRestart = document.getElementById('reset-btn').textContent === 'Jogar Novamente';
    
    if (isRestart) {
        currentRound = 1;
        playerScore = 0;
        cpuScore = 0;
        roundResults = [];
        document.getElementById('start-screen').classList.remove('hidden');
        document.querySelector('header').classList.add('hidden');
        document.querySelector('.container').classList.add('hidden');
    } else {
        closeModal();
        startGame();
    }
    closeModal();
}

function closeModal() {
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('battle-music').pause();
    document.getElementById('player-deck').classList.remove('hidden');
}