const defaultSaveDC = '10';
let damageInput = '';
let saveDCInput = defaultSaveDC;
let currentActor = null;
let dialogId = 'bloody_condition_setup';

// Function to save the input values to localStorage for the selected token
const saveInputValues = (actor) => {
    localStorage.setItem(`damageInput_${actor._id}`, damageInput);
    localStorage.setItem(`saveDCInput_${actor._id}`, saveDCInput);
};

// Function to load the input values from localStorage for the selected token
const loadInputValues = (actor) => {
    damageInput = localStorage.getItem(`damageInput_${actor._id}`) || '';
    saveDCInput = localStorage.getItem(`saveDCInput_${actor._id}`) || defaultSaveDC;
};

const validateInput = (input) => {
    const regex = /^(\d*d(4|6|8|10|12|20)(\+\d*d(4|6|8|10|12|20))*|\d+)$/;
    return regex.test(input);
};

const showErrorDialog = (message) => {
    new Dialog({
        title: "Error",
        content: `<p>${message}</p>`,
        buttons: {
            ok: {
                icon: "<i class='fas fa-check'></i>",
                label: "OK",
                callback: () => {
                    // Reopen the dialog after showing the error
                    reopenDialog(dialogId, currentActor);
                },
            },
        },
        id: dialogId, // Set the same dialog id
    }).render(true);
};

const showSuccessMessage = (actor) => {
    //TODO: doesn't get triggered
    ChatMessage.create({
        content: 'Saving throw successful. No longer bloodied.',
        speaker: ChatMessage.getSpeaker(),
        type: CONST.CHAT_MESSAGE_TYPES.OOC,
        whisper: [],
        whisperTo: [],
    });

    // Remove the "Blutend" condition
    game.cub.removeCondition("Blutend");

    // Delete the saved input values
    localStorage.removeItem(`damageInput_${actor._id}`);
    localStorage.removeItem(`saveDCInput_${actor._id}`);
};

const reopenDialog = (id, actor) => {
    new Dialog({
        title: "Bloody Condition Setup",
        content: `
            <form>
                <div class="form-group">
                    <label for "damageInput">Blood Damage (e.g., 1d4+5+3d10):</label>
                    <input type="text" id="damageInput" name="damageInput" value="${damageInput}" required />
                </div>
                <div class="form-group">
                    <label for "saveDCInput">Constitution Saving Throw DC (default is 10):</label>
                    <input type="number" id="saveDCInput" name="saveDCInput" min="1" value="${saveDCInput}" required />
                </div>
            </form>
        `,
        buttons: {
            rollDamage: {
                icon: "<i class='fas fa-check'></i>",
                label: "Roll Damage",
                callback: (html) => {
                    damageInput = html.find('#damageInput').val();
                    saveInputValues(actor); // Save the updated input values for the actor

                    if (!validateInput(damageInput)) {
                        showErrorDialog("Please enter a valid damage expression.");
                    } else {
                        const damageRoll = new Roll(damageInput);
                        damageRoll.toMessage({
                            flavor: "Blood Damage",
                            speaker: ChatMessage.getSpeaker(),
                        });
                    }
                },
                default: true,
            },
            rollSave: {
                icon: "<i class='fas fa-check'></i>",
                label: `Roll Saving Throw.`,
                callback: (html) => {
                    saveDCInput = html.find('#saveDCInput').val();
                    saveInputValues(actor); // Save the updated input values for the actor
                    const saveDC = parseInt(saveDCInput);

                    if (isNaN(saveDC) || saveDC <= 0) {
                        showErrorDialog("Please enter a valid Constitution Saving Throw DC.");
                    } else {
                        const text = `Constitution Saving Throw. Must meet  ${saveDCInput}`;
                        actor.rollAbilitySave("con", {
                            flavor: text,
                            dc: saveDC,
                            callback: (roll) => {
                                console.error(`${saveDC} AA`)
                                if (roll.total < saveDC) {
                                    // Display a chat message and button to roll the damage again
                                    //TODO: doesnt show
                                    ChatMessage.create({
                                        content: 'The saving throw failed.',
                                        speaker: ChatMessage.getSpeaker(),
                                        type: CONST.CHAT_MESSAGE_TYPES.OOC,
                                        buttons: {
                                            rollDamageAgain: {
                                                label: "Roll Damage Again",
                                                callback: () => {
                                                    const damageRoll = new Roll(damageInput);
                                                    damageRoll.toMessage({
                                                        flavor: "Blood Damage",
                                                        speaker: ChatMessage.getSpeaker(),
                                                    });
                                                },
                                            },
                                        },
                                    });
                                } else {
                                    showSuccessMessage(actor);
                                }
                            },
                        });
                    }
                },
            },
        },
        id: id, // Set the same dialog id
        default: "rollDamage", // Set the default button to roll damage
    }).render(true);
};

const selectedToken = canvas.tokens.controlled[0];

if (selectedToken) {
    currentActor = selectedToken.actor;
    loadInputValues(currentActor); // Load the saved input values for the selected actor
    reopenDialog(dialogId, currentActor); // Reopen the dialog with the specified dialog id and actor
} else {
    ui.notifications.error("No token selected. Please select a token to set up the Bloody condition.");
}
