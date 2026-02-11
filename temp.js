const AdvancePhase = () => {
    let turn = state.FFT.turn;
    let phase = state.FFT.phase;
    let phases = ["Deployment","Airstrikes & Area Fire","Movement & Close Combat","Direct Fire","End Phase"];
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
        if (phaseNum > 4) {
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
        case "Movement & Close Combat":
            MovementPhase();
            break;
        case "Direct Fire":
            DirectFirePhase();
            break;
        case "End Phase":
            EndPhase();
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
    outputCard.body.push("Place and resolve any Area FIre attacks");
    outputCard.body.push("No Overwatch Fire is allowed");
}

const MovementPhase = () => {
    outputCard.body.push("Overwatch Fire can occur before, during or after any movement");
    outputCard.body.push("When all movement and Overwatch Fire is done, resolve Close Combats");
    outputCard.body.push("The Active Player determines the order of the Close Combats");
}

const DirectFirePhase = () => {
    //spotting from movement phase
    //qc to be done, note which units have already taken one by placing a SM.passed

    _.each(UnitArray,unit => {
        if (unit.player !== activePlayer) {
            unit.Suppress("B",false);
        }
    })
    outputCard.body.push("Overwatch Fire must take place before the Active Player begins their own fire");
}

const EndPhase = () => {
    //qcs to be done

    //place any unit of active players that didnt move or fire on overwatch

    //spotting for end phase


}