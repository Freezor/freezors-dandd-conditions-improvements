const selectedToken = canvas.tokens.controlled[0];

if (selectedToken) {
    if (game.cub.hasCondition("Konzentration")) {
        game.cub.removeCondition("Konzentration");
        ui.notifications.info(`${selectedToken.name} no longer has the "Konzentration" condition.`);
    } else {
        ui.notifications.warn(`${selectedToken.name} does not have the "Konzentration" condition.`);
    }
} else {
    ui.notifications.error("No token selected. Please select a token to remove the condition.");
}
