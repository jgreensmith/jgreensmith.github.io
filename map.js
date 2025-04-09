const gridSize = 100;    

let posX = 0;
let posY = 0;
let counter = 0;
let activeCounter = null; // Track which counter is active
let counters = []; // Store all counters
let currentCounterIndex = -1; // Track the current counter index

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
}

function iterateCounters() {
    if (counters.length === 0) return; // If there are no counters, exit the function.

    // Remove the 'active' class from the currently active counter (if any).
    if (currentCounterIndex >= 0) {
        counters[currentCounterIndex].classList.remove("active");
    }

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
    }

    // Add the 'active' class to the new active counter to visually indicate it is active.
    activeCounter.classList.add("active");
}

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

    createCounter('Monster', '400px', '1160px');
    createCounter('You', '0px', '260px');

    if (helperCookie === "success") {
        createCounter('Helper', '100px', '260px');
    }

    window.addEventListener("keydown", (event) => {
        if (!activeCounter) return; // Only move if a counter is selected
        if (event.key === "ArrowLeft") moveCounter(-1, 0);
        if (event.key === "ArrowRight") moveCounter(1, 0);
        if (event.key === "ArrowUp") moveCounter(0, -1);
        if (event.key === "ArrowDown") moveCounter(0, 1);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadMap();

    // Add event listener to the button
    const iterateButton = document.getElementById("iterate-button");
    iterateButton.addEventListener("click", iterateCounters);
});
