const gridSize = 100;    

let posX = 0;
let posY = 0;
let counter = 0;
let activeCounter = null; // Track which counter is active
let counters = []; // Store all counters
let currentCounterIndex = -1; // Track the current counter index
let monsterHealth = 80;
let youHealth = 50;
let helperHealth = 50;
let ac = 15;


function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to create a new counter
function createCounter(name, startTop, startLeft) {
    const counterDiv = document.createElement("div");
    counterDiv.classList.add("counter");
    
    const counterId = `counter-${name}`;
    counterDiv.id = counterId;
    counterDiv.innerText = name;

    counterDiv.style.top = startTop;
    counterDiv.style.left = startLeft;
    // Attach click event to activate movement for this counter

    board.appendChild(counterDiv);

    counters.push(counterDiv); // Add to counters list
}

function loadStats() {
    const infoDisplay = document.getElementById("health");

    // Populate the info-display with health stats
    infoDisplay.innerHTML = `
        <p><strong>Monster HP:</strong> ${monsterHealth}</p>
        <p><strong>Your HP:</strong> ${youHealth}</p>
        <p><strong>Helper HP:</strong> ${helperHealth}</p>
    `;
}

function attackMonster(target) {
    if (!activeCounter) return;
    const infoDisplay = document.getElementById("dice");

    let attack = Math.floor(Math.random() * 20) + 5;
    let damage = 0;
    let result = "Miss!"
    
    if (attack >= ac) {
        damage = Math.floor(Math.random() * 10) + 3;
        result = "Hit!"
        if (target === "you") {
            youHealth = youHealth - damage
        } else {
            monsterHealth = monsterHealth - damage
        }
    } 

    infoDisplay.innerHTML = `
        <p><strong>Attack:</strong> ${attack} to hit</p>
        <p><strong>AC:</strong> ${ac}</p>
        <p><strong>Result:</strong> ${result}</p>
        <p><strong>Damage:</strong> ${damage}</p>
    `;
    loadStats()

};

function updateAttackButtonState() {
    const attackButton = document.getElementById("attack-button");
    const monster = document.getElementById("counter-Monster");
    attackButton.disabled = true;

    // Disable the attack button if the active counter is the monster
    if (activeCounter && activeCounter.id === monster.id) {
        attackButton.disabled = true;
        return;
    }

    // Check if the active counter is within 1 space of the monster
    const monsterX = parseInt(monster.style.left, 10);
    const monsterY = parseInt(monster.style.top, 10);

    if (activeCounter) {
        const activeX = parseInt(activeCounter.style.left, 10);
        const activeY = parseInt(activeCounter.style.top, 10);

        const isWithinOneSpace =
            Math.abs(monsterX - activeX) <= gridSize &&
            Math.abs(monsterY - activeY) <= gridSize;

        attackButton.disabled = !isWithinOneSpace;
    } else {
        attackButton.disabled = true; // Disable if no active counter
    }
}

function moveCounter(dx, dy) {
    if (!activeCounter) return; // Only move if counter is active
    
    let posX = parseInt(activeCounter.style.left, 10);
    let posY = parseInt(activeCounter.style.top, 10);

    let newX = posX + dx * gridSize;
    let newY = posY + dy * gridSize;
    
    if (newX >= 0 && newX < window.innerWidth - gridSize && newX >= 260) posX = newX;
    if (newY >= 0 && newY < window.innerHeight - gridSize) posY = newY;
    
    activeCounter.style.left = `${posX}px`;
    activeCounter.style.top = `${posY}px`;

    // Update the attack button state after moving a counter.
    updateAttackButtonState();
}

function iterateCounters() {
    if (counters.length === 0) return; // If there are no counters, exit the function.

    // Remove the 'active' class from the currently active counter (if any).
    if (currentCounterIndex >= 0) {
        counters[currentCounterIndex].classList.remove("active");
    };

    // Move to the next counter in the list. If at the end, loop back to the first counter.
    currentCounterIndex = (currentCounterIndex + 1) % counters.length;

    // Set the new active counter based on the updated index.
    activeCounter = counters[currentCounterIndex];

    // Get references to the "Monster" and "You" counters by their IDs.
    const monster = document.getElementById("counter-Monster");
    const you = document.getElementById("counter-You");

    // Check if the active counter is the "Monster".
    if (activeCounter.id === monster.id) {
        // Get the current position of the "Monster" counter.
        const monsterX = parseInt(monster.style.left, 10);
        const monsterY = parseInt(monster.style.top, 10);

        // Get the current position of the "You" counter.
        const youX = parseInt(you.style.left, 10);
        const youY = parseInt(you.style.top, 10);

        // Initialize movement direction variables (dx for horizontal, dy for vertical).
        let dx = 0, dy = 0;

        // Determine the horizontal direction to move:
        // If the "Monster" is to the left of "You", move right (dx = 1).
        // If the "Monster" is to the right of "You", move left (dx = -1).
        if (monsterX < youX) dx = 1;
        else if (monsterX > youX) dx = -1;

        // Determine the vertical direction to move:
        // If the "Monster" is above "You", move down (dy = 1).
        // If the "Monster" is below "You", move up (dy = -1).
        if (monsterY < youY) dy = 1;
        else if (monsterY > youY) dy = -1;

        // Move the "Monster" counter up to 4 spaces towards the "You" counter.
        for (let i = 0; i < 4; i++) {
            // Only move if there is still a direction to move in (dx or dy is not 0).
            if (dx !== 0 || dy !== 0) {
                moveCounter(dx, dy); // Move the "Monster" one step in the determined direction.

                // Recalculate the "Monster" position after the move.
                const newMonsterX = parseInt(monster.style.left, 10);
                const newMonsterY = parseInt(monster.style.top, 10);

                // If the "Monster" aligns with "You" horizontally, stop horizontal movement.
                if (newMonsterX === youX) dx = 0;

                // If the "Monster" aligns with "You" vertically, stop vertical movement.
                if (newMonsterY === youY) dy = 0;
            }
        }
    } else {
        // Allow the user to move the active counter up to 4 times.
        let movesRemaining = 5;

        // Add a temporary event listener for keydown to handle movement.
        function handleUserMove(event) {
            if (movesRemaining <= 0) {
            // Remove the event listener once the user has used all moves.
            window.removeEventListener("keydown", handleUserMove);
            return;
            }

            if (event.key === "ArrowLeft") {
                moveCounter(-1, 0);
                movesRemaining--;
            } else if (event.key === "ArrowRight") {
                moveCounter(1, 0);
                movesRemaining--;
            } else if (event.key === "ArrowUp") {
                moveCounter(0, -1);
                movesRemaining--;
            } else if (event.key === "ArrowDown") {
                moveCounter(0, 1);
                movesRemaining--;
            }
        }

        // Attach the event listener to the window for user input.
        window.addEventListener("keydown", handleUserMove);
    }

    // Add the 'active' class to the new active counter to visually indicate it is active.
    activeCounter.classList.add("active");
};

async function loadMap() {
    mapCookie = getCookie('map');
    mapIndex = parseInt(mapCookie[0]);
    helperCookie = getCookie('helper');

    res = await fetch("map.json");
    data = await res.json();
    
    renderMap(data[mapIndex], helperCookie);
}

function renderMap(map, helperCookie) {
    const board = document.getElementById("board");
    const boardContainer = document.getElementById('board-container');
    // Calculate dimensions based on the boardContainer
    const containerWidth = boardContainer.offsetWidth;
    const containerHeight = boardContainer.offsetHeight;

    const cols = Math.floor(containerWidth / gridSize);
    const rows = Math.floor(containerHeight / gridSize);

    boardContainer.style.backgroundImage = `url(${map.image})`;
    board.style.gridTemplateColumns = `repeat(${cols}, ${gridSize}px)`;
    board.style.gridTemplateRows = `repeat(${rows}, ${gridSize}px)`;

    // Clear existing cells
    board.innerHTML = "";

    for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
    }

    createCounter('Monster', '385px', '1185px');
    createCounter('You', '85px', '285px');

    if (helperCookie === "success") {
        createCounter('Helper', '185px', '285px');
    }


}

document.addEventListener("DOMContentLoaded", () => {
    loadMap();

    const iterateButton = document.getElementById("iterate-button");
    iterateButton.addEventListener("click", iterateCounters);
    const attackButton = document.getElementById("attack-button");
    attackButton.addEventListener("click", attackMonster);

    // Load stats initially
    loadStats();

    // Update the attack button state initially
    updateAttackButtonState();
});
