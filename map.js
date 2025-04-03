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
    
    const counterId = `counter-${document.querySelectorAll(".counter").length}`;
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
    if (counters.length === 0) return;

    // Remove 'active' class from the current counter
    if (currentCounterIndex >= 0) {
        counters[currentCounterIndex].classList.remove("active");
    }

    // Move to the next counter and then loop back to the begining 
    // 0/3 = 0 r 0, 2/3 = 0 r 2...
    currentCounterIndex = (currentCounterIndex + 1) % counters.length;

    activeCounter = counters[currentCounterIndex];
    
    if(activeCounter.innerText == "You") {
        console.log('scoops');
    }
    // Add 'active' class to the new counter
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
