const CallArtillery = (msg) => {
    let spotterID = msg.selected[0]._id;
    let spotter = UnitArray[spotterID];
    SetupCard(spotter.name,"Call Artillery",spotter.nation);
    if (((spotter.special.includes("Recon") || spotter.special.includes("Forward Observer")) && spotter.spotter >= 2) ||  (spotter.special.includes("Recon") === false && spotter.special.includes("Forward Observer") === false && spotter.spotter >= 1)) {
        outputCard.body.push("Unit unable to Spot for any more Barrages");
    } else if (artUnits.length === 0) {
        outputCard.body.push("There is no Available Artillery or Airstrikes");
    } else {
        CreateArtilleryToken(spotter);
        outputCard.body.push("Place Target and Select Artillery");
        outputCard.body.push("Commit when done");
    }
    PrintCard();
}

const CreateArtilleryToken = (spotter) => {
    let centre = HexMap[spotter.hexLabel].centre;
    
    let img = getCleanImgSrc("https://files.d20.io/images/105823565/P035DS5yk74ij8TxLPU8BQ/thumb.png?1582679991");
    let charID = "-OkLrIEzBQrYJMzCEg5H";
    let existing = findObjs({_type:"graphic", represents: charID});
    _.each(existing,tok => {
        let exist = UnitArray[tok.get("id")];
        if (exist) {
            delete UnitArray[tok.get("id")];
        }
        tok.remove();
    })

    let newToken = createObj("graphic", {
        left: centre.x,
        top: centre.y,
        width: 80,
        height: 80, 
        pageid: Campaign().get("playerpageid"),
        imgsrc: img,
        layer: "objects",
        represents: charID,
        name: "Artillery Target",
        showname: true,
        disableTokenMenu: true,
        showplayers_aura1: true,
        gmn: "TargetIcon",
    })
    toFront(newToken);
    //redo ability
    let abilArray = findObjs({_type: "ability", _characterid: charID});
    //clear old abilities
    for(let a=0;a<abilArray.length;a++) {
        abilArray[a].remove();
    } 
    //create a macro for each avail artillery unit, labelled 1 - name etc
    for (let i=0;i<artUnits.length;i++) {
        let abilityName = (i+1) + ": " + artUnit.name;
        let action = "!AddArtillery;" + newToken.id + ";" + spotter.id + ";" + artUnit.id + ";?{Type|HE|Smoke";
        AddAbility(abilityName,action,charID);
    }
    //then add a macro for check LOS, and a macro for Commit and Cancel
    abilityName = "Check LOS";
    action = "!CheckLOS;" + spotter.id + ";" + newToken.id;
    AddAbility(abilityName,action,charID);
    abilityName = "Commit";
    action = "!CommitArtillery";
    AddAbility(abilityName,action,charID);
    abilityName = "Cancel";
    action = "!CancelArtillery";
    AddAbility(abilityName,action,charID);
    areaFire = {
        centre: "",
        artUnits: [],
        type: "",
    };
}

const AddArtillery = (msg) => {
    let Tag = msg.content.split(";");
    let targetID = Tag[1];
    let target = UnitArray[targetID];
    let spotterID = Tag[2];
    let spotter = UnitArray[spotterID];
    let artilleryID = Tag[3];
    let artillery = UnitArray[artilleryID];
    let type = Tag[4]; //HE Or Smoke

    //check LOS first
    let losResult = LOS(spotter,target);
    if (losResult.los === false) {
        sendChat("","No LOS To Target")
        return;
    }
    //mixing HE and SMoke ?
    if (areaFire.type === "") {
        areaFire.type = type;
    } else if (areaFire.type !== type) {
        sendChat("","Cannot mix HE and Smoke in same Barrage");
        return;
    }
    //check range for the artillery selected
    if (HexMap[artillery.hexLabel].offboard === false) {
        let distance = artillery.Distance(target);
        if (distance < artillery.artRange[0] || distance > artillery.artRange[1]) {
            sendChat("","Not in Range of Selected Artillery");
            return;
        }
    } 
    //lock target token in place
    if (areaFire.centre === "") {
        areaFire.centre = HexMap[target.hexLabel].centre;
        target.token.set("lockMovement",true);
    }
    areaFire.units.push(artillery);
    sendChat("",artillery.name + " Added to Barrage");
}


const CommitArtillery = (msg) => {
    areaFireList.push(areaFire);
    areaFire = {};
    sendChat("","Committed");
    let tokenID = msg.selected[0]._id;
    let token =  findObjs({_type:"graphic", id: tokenID})[0];
    let targetUnit = UnitArray[tokenID];
    if (token) {
        token.remove()
    }
    if (targetUnit) {
        delete UnitArray[tokenID];
    }
}

const CancelArtillery = (msg) => {
    areaFire = {
        centre: "",
        artUnits: [],
        type: "",
    };
    sendChat("","Cleared all Artillery Attached to this Target");
    let tokenID = msg.selected[0]._id;
    let token =  findObjs({_type:"graphic", id: tokenID})[0];
    token.set("lockMovement",false);
}
