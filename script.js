document.addEventListener("DOMContentLoaded", () => {
    const screenWidth = window.screen.width; 
    const screenHeight = window.screen.height;
    console.log(screenWidth * screenHeight)


    // const board = document.getElementById("board");

    // // Generate the grid
    // for (let i = 0; i < 27 * 16; i++) {
    //     const cell = document.createElement("div");
    //     cell.classList.add("cell");
    //     cell.dataset.index = i;

    //     // Click event to toggle cell color
    //     cell.addEventListener("click", () => {
    //         cell.style.backgroundColor = cell.style.backgroundColor === "lightblue" ? "#ddd" : "lightblue";
    //     });

    //     board.appendChild(cell);
    // }

    const board = document.getElementById("board");
    // grid.innerHTML = ""; // Clear previous grid if resizing

    const cols = Math.ceil(window.innerWidth / 100);
    const rows = Math.ceil(window.innerHeight / 100);

    board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
    board.style.gridTemplateRows = `repeat(${rows}, 100px)`;

    for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
    }
});
