const AdvancePhase = () => {
    let turn = state.FFT.turn;
    let phase = state.FFT.phase;
    let phases = ["Deployment","Airstrikes & Area Fire","Movement","Close Combat","Direct Fire","End Phase"];
    if (turn === 0) {
        currentPhase = "Deployment";
        _.each(UnitArray,unit => {
            if (HexMap[unit.hexLabel].offboard === false) {
                unit.token.set("tint_color","#000000");
            }
            //everybody is not spotted
        })
    } else {
        phaseNum = phases.indexOf(phase) + 1;
        if (phaseNum >= phases.length) {
            phaseNum = 0
            activePlayer = activePlayer === 0 ? 1:0;
            turn++;
        }
        currentPhase = phases[phaseNum];
    }

    state.FFT.turn = turn;
    state.FFT.activePlayer = activePlayer;
    state.FFT.currentPhase = currentPhase;

    SetupCard(currentPhase,"Turn " + turn,state.FFT.nations[currentPlayer]);

    switch(currentPhase) {
        case "Deployment":
            DeploymentPhase();
            break;
        case "Airstrikes & Area Fire":
            AreaFirePhase();
            break;
        case "Movement":
            MovementPhase();
            break;
        case "Close Combat":
            FirstQC();
            break;
        case "Direct Fire":
            DirectFirePhase();
            break;
        case "End Phase":
            SecondQC();
            break;
    }
    
    PrintCard();

}

const DeploymentPhase = () => {
    outputCard.body.push("Deploy any Available Reinforcements");
    outputCard.body.push("No Overwatch Fire is allowed");
}

const AreaFirePhase = () => {
    _.each(UnitArray,unit => {
        unit.token.set(SM.fired,false);
        unit.token.set(SM.unavail,false);
        unit.token.set(SM.move,false);
        unit.token.set(SM.double,false);
        unit.token.set(SM.down,false);
        if (unit.player !== activePlayer) {
            unit.Suppress("A",false);
        }
        if (unit.player === activePlayer) {
            unit.SetOverwatch(false);
            let m = unit.movement;
            if (unit.CheckSuppression()) {m -= 2};
            unit.token.set("bar1_value",m);
        }

        unit.startRotation = unit.token.get("rotation");
        unit.startHexLabel = unit.hexLabel;
        unit.spotter = false;
        unit.artQC = false;
        unit.coverTest = false;
    })
    //remove smoke
    _.each(HexMap,hex => {
        if (hex.smokePlayer === activePlayer) {
            let smokeID = hex.smoke;
            let smoke = findObjs({_type:"graphic", id: smokeID})[0];
            smoke.remove();
            hex.smoke = "";
            hex.smokePlayer = "";
        }
    })

    outputCard.body.push("[U]Available Artillery[/u]");
    ArtilleryAvailability(activePlayer);
    outputCard.body.push("[hr]");
    outputCard.body.push("Place and resolve any Area Fire attacks");
    outputCard.body.push("No Overwatch Fire is allowed");
}

const MovementPhase = () => {
    outputCard.body.push("Overwatch Fire can occur at any time");
    outputCard.body.push("Quality Checks will be done at the end of the Phase");
}

const FirstQC = () => {
    //qc from overwatch, note on unit somewhere has passed, ? a green dot
    QCCheck(); //builds array qcUnits
    nextPhase = "CloseCombat";
    RunQC(); //checks it, when 'empty' feed to nextPhase
}

const CloseCombatPhase = () => {
    //qc from overwatch, note on unit somewhere has passed, ? a green dot
    outputCard.body.push("Resolve Close Combats");
    outputCard.body.push("The Active Player determines the order of the Close Combats");
}

const DirectFirePhase = () => {
    //spotting from movement phase
    _.each(UnitArray,unit => {
        if (unit.player !== activePlayer) {
            unit.Suppress("B",false);
        }
    })
    outputCard.body.push("Overwatch Fire must take place BEFORE the Active Player begins their own fire");
    outputCard.body.push("Quality Checks will be done at the end of the Phase");
}

const SecondQC = () => {
    //qc from Direct Fire
    QCCheck(); //builds array qcUnits
    nextPhase = "FormQC";
    RunQC(); //checks it, when 'empty' feed to nextPhase
}

const StartFormQC = () => {
    //check formations for their quality checks if warranted
    let qcFormations = [];
    _.each(FormationArray, formation => {
        if (formation.casualties >= formation.breakpoint) {
            qcFormations.push(formation);
        }
    })
    RunFormQC();
}

const EndPhase = () => {
    //place any unit of active players that didnt move or fire on overwatch
    _.each(UnitArray,unit => {
        if (unit.token.get(SM.fired) === false && unit.token.get(SM.move) === false && unit.token.get(SM.double) === false && unit.player === activePlayer && unit.token.get(SM.unavail) === false) {
            //sets overwatch
            unit.SetOverwatch(true);
        }
    })
    //spotting for end phase
    CheckSpotting(unit,"End")
}

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
        } else if (nextPhase === "FormQC") {
            StartFormQC();
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

const RunFormQC = () => {
    let formation = qcFormations.shift();
    if (formation) {
        let unit = UnitArray[formation.tokenIDs[0]];
        if (unit) {
            sendPing(unit.token.get("left"),unit.token.get("top"),Campaign().get("playerpageid"),null,true);
            SetupCard(formation.name,"Formation QC",unit.nation);
            ButtonInfo("Make Quality Check","!TakeFQC;" + unit.id);
            PrintCard();
        }
    } else {
       EndPhase();
    }
}