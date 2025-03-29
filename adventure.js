let adventureData = [];
let currentStep = 0;

async function loadAdventure() {
    const response = await fetch("adventure.json");
    adventureData = await response.json();
    renderStep(currentStep);
}

function renderStep(stepIndex) {
    const step = adventureData[stepIndex];
    const storyText = document.getElementById("story-text");
    const choicesContainer = document.getElementById("choices-container");
    const img = document.getElementById("story-image");

    // Update story text and image
    storyText.innerText = step.question;
    img.src = step.image    
    // Clear and render choices
    choicesContainer.innerHTML = "";
    if (step.options) {
        step.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.className = "choice-btn";
            button.innerText = option.option;
            button.onclick = () => {
                currentStep = option.result;
                renderStep(currentStep);
            };
            choicesContainer.appendChild(button);
        });
    } else {

    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAdventure();
});