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
];

let selectedPokemon = [];
let cpuTeam = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('battle-btn').addEventListener('click', startBattle);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('result-modal').addEventListener('click', (e) => {
        if(e.target === document.getElementById('result-modal')) closeModal();
    });
});

function startGame() {
    const deck = document.getElementById('player-deck');
    deck.innerHTML = '';
    
    const shuffled = [...pokemonData].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(pokemon => {
        const card = createCard(pokemon);
        deck.appendChild(card);
    });
    
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('battle-btn').classList.remove('hidden');
    document.getElementById('battle-btn').disabled = true;
    selectedPokemon = [];

     // Resetar CPU
     document.getElementById('cpu-deck').classList.add('hidden');
     document.getElementById('cpu-deck').innerHTML = '';
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
        // Desselecionar
        card.classList.remove('selected');
        selectedPokemon = selectedPokemon.filter(p => p !== pokemon);
    } else {
        if(selectedPokemon.length >= 3) return;
        card.classList.add('selected');
        selectedPokemon.push(pokemon);
    }
    
    document.getElementById('battle-btn').disabled = selectedPokemon.length !== 3;
}

function resetGame() {
    document.getElementById('result-modal').classList.add('hidden');
    startGame();
}

function generateCPUTeam() {
    const shuffled = [...pokemonData].sort(() => Math.random() - 0.5);
    cpuTeam = shuffled.slice(0, 3);
    
    const cpuDeck = document.getElementById('cpu-deck');
    cpuDeck.innerHTML = '';
    cpuDeck.classList.remove('hidden');
    
    cpuTeam.forEach(pokemon => {
        const card = createCard(pokemon);
        card.classList.add('cpu-card');
        cpuDeck.appendChild(card);
    });
}

function calculateTotal(team) {
    return team.reduce((acc, curr) => acc + curr.strength + curr.speed, 0);
}

async function startBattle() {
    document.getElementById('battle-music').play();
    generateCPUTeam();
    
    const battleStage = document.createElement('div');
    battleStage.className = 'battle-stage';
    document.querySelector('.game-area').appendChild(battleStage);
    
    // Animar cada batalha individual
    for(let i = 0; i < 3; i++) {
        const playerPokemon = selectedPokemon[i];
        const cpuPokemon = cpuTeam[i];
        
        battleStage.innerHTML = `
            <div class="battle-pokemon">
                <img src="${playerPokemon.img}" class="player-pokemon">
                <div class="health-bar"><div class="health-progress" style="width: 100%"></div></div>
            </div>
            <div class="battle-pokemon">
                <img src="${cpuPokemon.img}" class="cpu-pokemon">
                <div class="health-bar"><div class="health-progress" style="width: 100%"></div></div>
            </div>
        `;
        
        // Animar ataque
        await animateAttack(playerPokemon, cpuPokemon, battleStage);
    }
    
    document.getElementById('battle-music').pause();
    showFinalResults();
}

async function animateAttack(attacker, defender, container) {
    const attackImg = container.querySelector(attacker === selectedPokemon[0] ? '.player-pokemon' : '.cpu-pokemon');
    const defendImg = container.querySelector(attacker === selectedPokemon[0] ? '.cpu-pokemon' : '.player-pokemon');
    
    // Efeito de ataque
    attackImg.classList.add('attacking');
    document.getElementById('attack-sound').cloneNode(true).play();
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Efeito de dano
    const damage = Math.abs(attacker.strength - defender.strength);
    const healthBar = defendImg.parentElement.querySelector('.health-progress');
    const newWidth = Math.max(0, 100 - (damage * 10));
    
    healthBar.style.width = `${newWidth}%`;
    defendImg.classList.add('hit');
    
    // Efeito visual
    const effect = document.createElement('div');
    effect.className = 'attack-effect';
    defendImg.parentElement.appendChild(effect);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    attackImg.classList.remove('attacking');
    defendImg.classList.remove('hit');
}

function showFinalResults() {
    const resultModal = document.getElementById('result-modal');
    resultModal.classList.remove('hidden');
    
    // Calcular vencedores individuais
    const playerTotal = calculateTotal(selectedPokemon);
    const cpuTotal = calculateTotal(cpuTeam);
    
    document.getElementById('result-title').textContent = 
        playerTotal > cpuTotal ? 'Vitória!' : 
        playerTotal < cpuTotal ? 'Derrota!' : 'Empate!';
    
    // Atualizar resultados
    document.getElementById('player-result').innerHTML = selectedPokemon.map(p => `
        <div class="result-card ${p.strength + p.speed > 10 ? 'winner' : ''}">
            <img src="${p.img}" alt="${p.name}">
            <div class="result-stats">
                <h3>${p.name}</h3>
                <p>Força: ${p.strength}</p>
                <p>Velocidade: ${p.speed}</p>
                <p>Total: ${p.strength + p.speed}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('cpu-result').innerHTML = cpuTeam.map(p => `
        <div class="result-card ${p.strength + p.speed > 10 ? 'winner' : ''}">
            <img src="${p.img}" alt="${p.name}">
            <div class="result-stats">
                <h3>${p.name}</h3>
                <p>Força: ${p.strength}</p>
                <p>Velocidade: ${p.speed}</p>
                <p>Total: ${p.strength + p.speed}</p>
            </div>
        </div>
    `).join('');
}

//Função para o modal
function handleModalClick(event) {
    if (event.target === document.getElementById('result-modal')) {
        closeModal();
    }
}

function closeModal() {
    document.getElementById('result-modal').classList.add('hidden');
    document.getElementById('battle-music').pause();
  }
