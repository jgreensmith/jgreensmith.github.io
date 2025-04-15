const gridSize = 100;    

let posX = 0;
let posY = 0;
let counter = 0;
let activeCounter = null; // Track which counter is active
let counters = []; // Store all counters
let currentCounterIndex = -1; // Track the current counter index
let monsterHealth = 80;
let youHealth = 40;
let ac = 12;


function getCookie(name) {
    // Retrieve all cookies as a single string
    let value = `; ${document.cookie}`;
    
    // Split into two parts - everything before cookie and evrything after and including the cookie
    let parts = value.split(`; ${name}=`);
    
    // If the cookie exists, return its value; otherwise, return null
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to create a new counter
function createCounter(name, startTop, startLeft) {
    const counterDiv = document.createElement("div");
    counterDiv.classList.add("counter");
    
    // The counter ID includes the name of the counter 
    // to seperate manual and automatred logic
    const counterId = `counter-${name}`;
    counterDiv.id = counterId;
    counterDiv.innerText = name;

    counterDiv.style.top = startTop;
    counterDiv.style.left = startLeft;
    // Attach click event to activate movement for this counter

    board.appendChild(counterDiv);

    counters.push(counterDiv); // Add to counters list
}

function loadStats(change) {
    // inject releavent HTML about dice rolls and health into the display
    const infoDisplay = document.getElementById("health");

    if (change === "monster") {
        infoDisplay.innerHTML = `
        <p style="color: red;"><strong>Monster HP:</strong> ${monsterHealth}</p>
        <p><strong>Your HP:</strong> ${youHealth}</p>
        `;
    } else if (change === "you") {
        infoDisplay.innerHTML = `
        <p ><strong>Monster HP:</strong> ${monsterHealth}</p>
        <p style="color: red;"><strong>Your HP:</strong> ${youHealth}</p>
        `;
    } else {
        infoDisplay.innerHTML = `
        <p><strong>Monster HP:</strong> ${monsterHealth}</p>
        <p><strong>Your HP:</strong> ${youHealth}</p>
    `;    }
    
}

function attack(targetty) {
    if (!activeCounter) return;
    const attackButton = document.getElementById("attack-button");
    const infoDisplay = document.getElementById("dice");

    // This is the replica logic of the dnd 20 sided dice!
    let attack = Math.floor(Math.random() * 20) + 6;
    let damage = 0;
    let result = "Miss!"
    
    if (attack >= ac) {

        // 10 sided dice for damage
        damage = Math.floor(Math.random() * 10) + 5;

        // Double the damage on a critical hit!
        if (attack === 26){
            alert("CRITICAL SUCCESS!");
            damage = damage * 2
        }
        result = "Hit!"
        if (targetty === "you") {
            // Monster does double damage
            damage = damage * 2
            youHealth = youHealth - damage

            // go to loser if your health drops to 0 
            if (youHealth <= 0) {
                location.replace('/loser.html');
            }
            loadStats("you");

        } else {
            monsterHealth = monsterHealth - damage
                        
            // go to loser if monster health drops to 0 
            if (monsterHealth <= 0) {
                location.replace('/winner.html');
            }
            loadStats("monster");

        }
    } 

    // render summary

    infoDisplay.innerHTML = `
        <p><strong>Attack:</strong> ${attack} to hit</p>
        <p><strong>AC:</strong> ${ac}</p>
        <p><strong>Result:</strong> ${result}</p>
        <p><strong>Damage:</strong> ${damage}</p>
    `;
    attackButton.disabled = true;

};

function updateAttackButtonState() {
    const attackButton = document.getElementById("attack-button");
    const monster = document.getElementById("counter-Monster");

    // disable the attack button if the active counter is the monster
    if (activeCounter && activeCounter.id === monster.id) {
        attackButton.disabled = true;
        return;
    }

    // check if the active counter is within 1 space of the monster
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
    
    // move anywhere on the board but not onto the control panel (260)
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
    // https://stackoverflow.com/questions/65839332/how-do-i-use-modulus-for-selection-of-4-statements-iterated-through-a-loop-of-10
    currentCounterIndex = (currentCounterIndex + 1) % counters.length;

    // Set the new active counter based on the updated index.
    activeCounter = counters[currentCounterIndex];

    const monster = document.getElementById("counter-Monster");
    const you = document.getElementById("counter-You");

    if (activeCounter.id === monster.id) {
        // current position of the "Monster" counter.
        const monsterX = parseInt(monster.style.left, 10);
        const monsterY = parseInt(monster.style.top, 10);

        //current position of the "You" counter.
        const youX = parseInt(you.style.left, 10);
        const youY = parseInt(you.style.top, 10);

        let dx = 0, dy = 0;

        // Determine the horizontal direction to move:
        if (monsterX < youX) dx = 1;
        else if (monsterX > youX) dx = -1;

        // Determine the vertical direction to move:
        if (monsterY < youY) dy = 1;
        else if (monsterY > youY) dy = -1;

        // move monster up to 4 spaces towards the "You" counter.
        for (let i = 0; i < 4; i++) {
            // Only move if there is still a direction to move in (dx or dy is not 0).
            if (dx !== 0 || dy !== 0) {
                moveCounter(dx, dy); // Move the monster one step in the determined direction.

                // Recalculate the "Monster" position after the move.
                const newMonsterX = parseInt(monster.style.left, 10);
                const newMonsterY = parseInt(monster.style.top, 10);

                // if monster reaches you stop moving
                if (newMonsterX === youX) dx = 0;
                if (newMonsterY === youY) dy = 0;

            } else {
                moveCounter(1, 0); 
                attack("you");
                break;
            }
        }
        iterateCounters();
    } else {
        updateAttackButtonState();
        // Allow the user to move the active counter up to 4 times.
        let movesRemaining = 5;
        
        // Add a temporary event listener for keydown to handle movement.
        function handleUserMove(event) {
            if (movesRemaining <= 0) {
                // Remove the event listener once the user has used all moves.
                window.removeEventListener("keydown", handleUserMove);
                return;
            }
            
            // Use arrow keys to move you and helper
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
    // map cookie sets image url 
    mapCookie = getCookie('map');
    mapIndex = parseInt(mapCookie[0]);
    // helper cookie checks if there should be a helper
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

    // calculate number of rows and columns for CSS grid
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

    // create counters with hard coded starting postitions
    createCounter('Monster', '400px', '1200px');
    createCounter('You', '100px', '300px');

    if (helperCookie === "success") {
        createCounter('Helper', '200px', '300px');
    }


}

document.addEventListener("DOMContentLoaded", () => {
    loadMap();

    const iterateButton = document.getElementById("iterate-button");
    iterateButton.addEventListener("click", iterateCounters);
    const attackButton = document.getElementById("attack-button");
    attackButton.addEventListener("click", attack);
    attackButton.disabled = true;
    alert("On your turn - use arrow keys to move counter");

    // Load stats initially
    loadStats();

    // Update the attack button state initially
    updateAttackButtonState();
});
