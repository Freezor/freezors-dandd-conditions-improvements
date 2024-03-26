Hooks.once("init", function () {
    registerConditions();
});

function registerConditions() {
    const conditionsToAdd = {
        bloody: {
            label: "Blutend",
            icon: "modules/freezors-dandd-conditions-improvements/icons/blood.svg"
        },
        burning: {
            label: "Brennend",
            icon: "modules/freezors-dandd-conditions-improvements/icons/burning.svg"
        },
        calmed: {
            label: "Beruhigt",
            icon: "modules/freezors-dandd-conditions-improvements/icons/calmed.svg",
            reference: "Compendium.dnd5e.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.0b8N4FymGGfbZGpJ"
        },
        challenged: {
            label: "Herausgefordert",
            icon: "modules/freezors-dandd-conditions-improvements/icons/challenged.svg"
        },
        chilled: {
            label: "Gekühlt",
            icon: "modules/freezors-dandd-conditions-improvements/icons/chilled.svg"
        },
        confused: {
            label: "Verwirrt",
            icon: "modules/freezors-dandd-conditions-improvements/icons/confused.svg"
        },
        drunk: {
            label: "Betrunken",
            icon: "modules/freezors-dandd-conditions-improvements/icons/drunk.svg",
            statuses: ["drunken"]
        },
        drunken: {
            label: "Angetrunken",
            icon: "modules/freezors-dandd-conditions-improvements/icons/drunken.svg",
            reference: "Compendium.freezors-dandd-conditions-improvements.fci-rules.JournalEntry.ARu9VB16lwiq0anD.JournalEntryPage.jaUXjS9nq3AUEYEl"
        },
        freezing: {
            label: "Erfrierend",
            icon: "modules/freezors-dandd-conditions-improvements/icons/freezing.svg",
            statuses: ["chilled"]
        },
        frozen: {
            label: "Gefroren",
            icon: "modules/freezors-dandd-conditions-improvements/icons/frozen.svg",
            statuses: ["frozen", "chilled"]
        },
        hallucinating: {
            label: "Halluzinierend",
            icon: "modules/freezors-dandd-conditions-improvements/icons/hallucinating.svg"
        },
        inFlames: {
            label: "In Flammen",
            icon: "modules/freezors-dandd-conditions-improvements/icons/inFlames.svg",
            statuses: ["burning"]
        },
        openWound: {
            label: "Klaffende Wunde",
            icon: "modules/freezors-dandd-conditions-improvements/icons/openWound.svg",
            statuses: ["bloody"]
        },
        passedOut: {
            label: "Ohnmächtig (Alkohol)",
            icon: "modules/freezors-dandd-conditions-improvements/icons/passedOut.svg",
            statuses: ["drunken", "drunk"]
        },
        soakedInOil: {
            label: "Eingetränkt in Brennöl",
            icon: "modules/freezors-dandd-conditions-improvements/icons/soakedInOil.svg"
        },
        wet: {
            label: "Nass",
            icon: "modules/freezors-dandd-conditions-improvements/icons/wet.svg",
            statuses: ["soakedInOil"]
        }
    };

    for (const [key, value] of Object.entries(conditionsToAdd)) {
        CONFIG.DND5E.conditionTypes[key] = value;
    }
}