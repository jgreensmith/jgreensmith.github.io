document.addEventListener("DOMContentLoaded", () => {
    
    const gridSize = 100;
    let posX = 0;
    let posY = 0;
    let counter = 0;
    let activeCounter = null; // Track which counter is active

    const board = document.getElementById("board");
    const addCounterBtn = document.getElementById("addCounterBtn");

    const cols = Math.ceil(window.innerWidth / 100);
    const rows = Math.ceil(window.innerHeight / 100);

    board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
    board.style.gridTemplateRows = `repeat(${rows}, 100px)`;

    for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
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
    }

    function moveCounter(dx, dy) {

        if (!activeCounter) return; // Only move if counter is active
        
        let posX = parseInt(activeCounter.style.left, 10);
        let posY = parseInt(activeCounter.style.top, 10);

        console.log(posX, posY)

        let newX = posX + dx * gridSize;
        let newY = posY + dy * gridSize;

        if (newX >= 0 && newX < window.innerWidth - gridSize) posX = newX;
        if (newY >= 0 && newY < window.innerHeight - gridSize) posY = newY;

        activeCounter.style.left = `${posX}px`;
        activeCounter.style.top = `${posY}px`;

    }


    window.addEventListener("keydown", (event) => {
        if (!activeCounter) return; // Only move if a counter is selected
        if (event.key === "ArrowLeft") moveCounter(-1, 0);
        if (event.key === "ArrowRight") moveCounter(1, 0);
        if (event.key === "ArrowUp") moveCounter(0, -1);
        if (event.key === "ArrowDown") moveCounter(0, 1);
    });

    addCounterBtn.addEventListener("click", createCounter);

});
