let adventureData = [];
let currentStep = 0;
let stepTracker = [];

async function loadAdventure() {
    // This loads the adventure data, including all the choices
    const response = await fetch("adventure.json");
    adventureData = await response.json();
    //render the first page - index 0
    renderStep(currentStep);
}

function renderStep(stepIndex) {
    //render the html based on the data index 
    const step = adventureData[stepIndex];
    const storyText = document.getElementById("story-text");
    const choicesContainer = document.getElementById("choices-container");
    const img = document.getElementById("story-image");

    // Update story text and image
    storyText.innerText = step.question;
    img.src = step.image;
    // Clear and render choices
    choicesContainer.innerHTML = "";
    if (step.options) {
        step.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.className = "choice-btn";
            button.innerText = option.option;
            button.onclick = () => {
                currentStep = option.result;
                stepTracker.push(index);
                if (step.outcomes) {
                    const outcomeMessage = step.outcomes[option.outcome];
                    if (outcomeMessage) {
                        //alert(outcomeMessage);
                        document.cookie = `helper=${option.outcome}; path=/; secure; SameSite=Strict;`;
                    }
                }
                renderStep(currentStep);
            };
            choicesContainer.appendChild(button);
        });
    } else {
        // If theres no choices in the data then render fight or flee!
        fightOrFleeArr = ['Fight', 'Flee']
        fightOrFleeArr.forEach((option, index) => {
            const button = document.createElement("button");
            button.className = "choice-btn";
            button.innerText = option;
            button.onclick = () => {
                if(option === 'Flee') {
                    location.replace('/loser.html');
                } else {
                    //Map code is based on desicions 
                    document.cookie = `map=${stepTracker.join('')}; path=/; secure; SameSite=Strict;`;
                    location.replace('/map.html');

                };
            };
            choicesContainer.appendChild(button);
        })
        

    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAdventure();
});