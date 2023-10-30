const selectedToken = canvas.tokens.controlled[0];

if (selectedToken) {
    const actor = selectedToken.actor;

    if (actor) {
        // Increment the exhaustion level by 1
        const currentExhaustionLevel = actor.data.data.attributes.exhaustion || 0;
        console.error(actor.data.data.attributes.exhaustion);
        // Define constants for condition names
        const EXHAUSTION_CONDITIONS = [
            "None",
            "Erschöpft 1",
            "Erschöpft 2",
            "Erschöpft 3",
            "Erschöpft 4",
            "Erschöpft 5",
            "Tot"
        ];

        // Remove the previous exhaustion condition
        if (currentExhaustionLevel > 0) {
            game.cub.removeCondition(EXHAUSTION_CONDITIONS[currentExhaustionLevel]);
        }

        // Add the new exhaustion condition
        nexExhaustionLevel = currentExhaustionLevel + 1;
        const newExhaustionCondition = EXHAUSTION_CONDITIONS[nexExhaustionLevel];
        game.cub.addCondition(newExhaustionCondition);

        actor.update({
            "data.attributes.exhaustion": nexExhaustionLevel
        });

        ui.notifications.info(`${actor.name} has gained one point of exhaustion and is now ${newExhaustionCondition}.`);

    } else {
        ui.notifications.warn("No actor found for the selected token.");
    }
} else {
    ui.notifications.error("No token selected. Please select a token to apply exhaustion.");
}
