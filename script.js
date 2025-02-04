document.addEventListener("DOMContentLoaded", () => {
    const boardSize = 8; // 8x8 grid
    const board = document.getElementById("board");

    // Generate the grid
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;

        // Click event to toggle cell color
        cell.addEventListener("click", () => {
            cell.style.backgroundColor = cell.style.backgroundColor === "lightblue" ? "#ddd" : "lightblue";
        });

        board.appendChild(cell);
    }
});
