let choiceSummary = []
const story = {
    1: { text: "Inside, you see two paths. Left or right?", choices: { left: 3, right: 4 } },
    2: { text: "Without the shelter of the cave you get struck by lighting and die.", choices: {} },
    3: { text: "You found the treasure... But its You guarded by a cave troll [enter combat map A]", choices: {} },
    4: { text: "The tunnel leads to an opening in the forest, you are met with an ancient green dragon [enter combat B]", choices: {} }
};

function makeChoice(choice) {
    const nextStep = story[choice];
    choiceSummary.push(choice)
    // Update the story text
    document.getElementById("story-text").innerText = nextStep.text;

    // Clear previous buttons
    const choicesContainer = document.getElementById("choices-container");
    choicesContainer.innerHTML = "";

    // If there are more choices, create new buttons
    if (Object.keys(nextStep.choices).length > 0) {
        for (const [key, value] of Object.entries(nextStep.choices)) {
            const button = document.createElement("button");
            button.className = "choice";
            button.innerText = key.charAt(0).toUpperCase() + key.slice(1);
            button.onclick = () => makeChoice(value);
            choicesContainer.appendChild(button);
        }
    } else {
        console.log(choiceSummary)
    }
}