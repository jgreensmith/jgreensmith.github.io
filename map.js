const gridSize = 100;
let posX = 0;
let posY = 0;
let counter = 0;
let activeCounter = null; // Track which counter is active


function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to create a new counter
function createCounter() {
    const counterDiv = document.createElement("div");
    counterDiv.classList.add("counter");
    
    const counterId = `counter-${document.querySelectorAll(".counter").length}`;
    counterDiv.id = counterId;
    counterDiv.innerText = "0";
    
    // Random initial position within grid boundaries
    counterDiv.style.left = `${Math.floor(Math.random() * (window.innerWidth / gridSize)) * gridSize}px`;
    counterDiv.style.top = `${Math.floor(Math.random() * (window.innerHeight / gridSize)) * gridSize}px`;

    // Attach click event to activate movement for this counter
    counterDiv.addEventListener("click", () => enableMovement(counterId));

    board.appendChild(counterDiv);
}

function enableMovement(counterId) {

    activeCounter = document.getElementById(counterId);
    activeCounter.classList.add("active"); // Apply active styles
}

function moveCounter(dx, dy) {

    if (!activeCounter) return; // Only move if counter is active
    
    let posX = parseInt(activeCounter.style.left, 10);
    let posY = parseInt(activeCounter.style.top, 10);

    let newX = posX + dx * gridSize;
    let newY = posY + dy * gridSize;

    if (newX >= 0 && newX < window.innerWidth - gridSize) posX = newX;
    if (newY >= 0 && newY < window.innerHeight - gridSize) posY = newY;

    activeCounter.style.left = `${posX}px`;
    activeCounter.style.top = `${posY}px`;

}

async function loadMap() {
    cookie = getCookie('map');
    mapIndex = parseInt(cookie[0]);

    //console.log(typeof mapIndex);

    res = await fetch("map.json");
    data = await res.json();
    
    console.log(data);

    renderMap(data[mapIndex]);
}

function renderMap(map) {

    const boardContainer = document.getElementById('board-container')
    const board = document.getElementById("board");
    const addCounterBtn = document.getElementById("addCounterBtn");

    const cols = Math.ceil(window.innerWidth / 100);
    const rows = Math.ceil(window.innerHeight / 100);


    boardContainer.style.backgroundImage = `url(${map.image})`;
    board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
    board.style.gridTemplateRows = `repeat(${rows}, 100px)`;

    for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
    }

    



    window.addEventListener("keydown", (event) => {
        if (!activeCounter) return; // Only move if a counter is selected
        if (event.key === "ArrowLeft") moveCounter(-1, 0);
        if (event.key === "ArrowRight") moveCounter(1, 0);
        if (event.key === "ArrowUp") moveCounter(0, -1);
        if (event.key === "ArrowDown") moveCounter(0, 1);
    });

    addCounterBtn.addEventListener("click", createCounter);

    // document.addEventListener("click", () => {
    //     if (activeCounter) {
    //         activeCounter.classList.remove("active");
    //         activeCounter = null;
    //     }
    // });

}

document.addEventListener("DOMContentLoaded", () => {
    loadMap();
});
