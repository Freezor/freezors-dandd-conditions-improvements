// User modifiable declarations CHANGE AT YOUR OWN RISK
const blessIconPath = 'icons/svg/regen.svg';
const blessMsg = ' ist Gesegnet!';
const endblessMsg = ' ist nicht länger gesegnet';

// Fixed declarations DO NOT MODIFY
const selectedTokens = canvas.tokens.controlled;
let chatMsg = '';

// Check the number of selected tokens and apply bless effect
if (selectedTokens.length === 0) {
    ui.notifications.warn("Bitte selektiere die entsprechenden Tokens zuerst.");
} else if (selectedTokens.length > 3) {
    ui.notifications.error("Du kannst nur maximal 3 Kreaturen gleichzeitig segnen.");
} else {
    selectedTokens.forEach(async (token) => {
        const actorName = token.name;

        // If already blessed, remove the condition
        if (game.cub.hasCondition("Gesegnet", token.actor)) {
            token.actor.removeCondition("Gesegnet");
            chatMsg = `${actorName} ${endblessMsg}`;
        } else {
            // If not already blessed, add the condition
            token.actor.addCondition("Gesegnet");
            chatMsg = `${actorName} ${blessMsg}`;
        }

        // Write to chat if needed
        if (chatMsg !== '') {
            const chatData = {
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: chatMsg
            };
            ChatMessage.create(chatData, {});
        }
    });
}
