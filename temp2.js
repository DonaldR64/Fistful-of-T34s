    const RunQC = () => {
        let unit = qcUnits.shift();
        if (unit) {
            sendPing(unit.token.get("left"),unit.token.get("top"),Campaign().get("playerpageid"),null,true);
            SetupCard(unit.name,"Quality Check",unit.nation);
            ButtonInfo("Make Quality Check","!TakeQC;" + unit.id);
            PrintCard();
        } else {
            if (nextPhase === "CloseCombat") {
                CloseCombatPhase();
            } else if (nextPhase === "EndPhase") {
                EndPhase();
            } else if (nextPhase === "FormQCPhase") {
                RunFormQC();
            } else {
                sendChat("","??")
            }
        }
    }

    const QCCheck = () => {
        qcUnits = [];
         _.each(UnitArray,unit => {
            if (unit.token.get(SM.qc)) {
                qcUnits.push(unit);
            }
        })
    }