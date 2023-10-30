async function concentrationSavingThrowCallback(characterName, difficulty, actor) {
    if (actor) {
        const saveRoll = await actor.rollAbilitySave('con', {flavor: 'Konzentration Rettungswurf', dc: difficulty});

        // Use the blind option to prevent displaying the roll to the GM
        await saveRoll.toMessage({blind: true});

        if (saveRoll.total < difficulty) {
            // Saving throw failed, remove the 'Konzentration' active effect
            if (game.cub.hasCondition("Konzentration")) {
                game.cub.removeCondition("Konzentration");
            }
        }

        const resultMessage = saveRoll.total >= difficulty
            ? `${characterName} hat den Rettungswurf geschafft!`
            : `${characterName} hat den Rettungswurf nicht geschafft. Der magische Effekt endet!`;

        ChatMessage.create({content: resultMessage});
    } else {
        ui.notifications.error("Zu dem selektierten Token kann kein Charakter gefunden werden");
    }
}

const selectedToken = canvas.tokens.controlled[0];

if (selectedToken) {
    const characterName = selectedToken.actor?.name || "Unknown";
    const defaultDifficulty = 10;

    const content = `
    <form>
      <p><b>Konzentrationsrettungs für ${characterName} ausgelöst.</b></p>
      <p>Hat der Charakter kein Schaden erlitten, brich diesen Dialog bitte ab.</p>
      <div class="form-group">
        <label for "difficulty">Schwierigkeitsgrad:</label>
        <input type="number" id="difficulty" name="difficulty" min="1" value="${defaultDifficulty}" autofocus required/>
      </div>
    </form>`;

    const dialog = new Dialog({
        title: "Konzentrationscheck ausgelöst",
        content: content,
        buttons: {
            "Concentration Saving Throw": {
                icon: "<i class='fas fa-dice-d20'></i>",
                label: "Rettungswurf (Con)",
                callback: async (html) => {
                    const difficulty = parseInt(html.find('#difficulty').val());

                    if (isNaN(difficulty)) {
                        return ui.notifications.info("Bitte gib einen validen Schwierigkeitsgrad an.");
                    }

                    const actor = selectedToken.actor;
                    concentrationSavingThrowCallback(characterName, difficulty, actor);
                },
            },
            cancel: {
                icon: "<i class='fas fa-times'></i>",
                label: "Abbrechen",
            },
        },
        default: "Concentration Saving Throw",
    });

    dialog.render(true);
} else {
    ui.notifications.error("Kein Token ausgewählt. Bitte wählen Sie ein Token, um den Dialog auszulösen.");
}