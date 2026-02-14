    const ArtilleryAvailability2 = (player) => {
        artUnits = [];
        let avail = [];
        let unavail = [];
        _.each(UnitArray,unit => {
            if (unit.player === player) {
                if (unit.artFlag === true && unit.CheckSuppression() === false) {
                    let availMod = unit.avail;
                    let tipmods = "";
                    if (availMod !== 0) {
                        tipmods += "<br>Availability: " + availMod;
                    }
                    let offboard = HexMap[unit.hexLabel].offboard;
                    if (offboard === false && target > 1) {
                        availMod++;
                        tipmods += "<br>On Board Artillery +1";
                    }         
                    let result = ArtAvailTable[unit.nation,unit.artType,availMod];

                    tip = "Final Result: " + result.result;
                    tip = "Roll: " + result.roll + tipmods;


                    tip = '[🎲 ](#" class="showtip" title="' + tip + ')';
                    if (result.FU > 0) {
                        unit.FU = result.FU;
                        artUnits.push(unit);
                        avail.push(tip + unit.name + " is Available with " + result.FU + " FU");
                    } else {
                        if (unit.type === "Aircraft") {
                            unavail.push(tip + unit.name + " is Refuelling/Reloading");
                        }
                        if (unit.type === "Artillery" && offboard === true) {
                            let roll = randomInteger(6);
                            if (roll < 4) {
                                unavail.push(tip + unit.name + " is Unavailable");
                            } else {
                                unavail.push(tip + unit.name + " is Reloading");
                            }
                        }
                        if (offboard === false) {
                            unavail.push(tip + unit.name + " is Reloading and Unavailable");
                        }
                        unit.token.set(SM.unavail,true);
                    }
                }
            }
        })
        if (avail.length > 0) {
            for (let i=0;i<avail.length;i++) {
                outputCard.body.push(avail[i]);
            }
            if (unavail.length > 0) {
                outputCard.body.push("[hr]");
            }
        }
        if (avail.length === 0) {
            outputCard.body.push("No Artillery or Air Support");
        }
        if (unavail.length > 0) {
            for (let i=0;i<unavail.length;i++) {
                outputCard.body.push(unavail[i]);
            }
        }
    }




    const ArtAvailTable = (nation,type,availMod) => {
        let side = {
            "Wermacht": "Western",
            "Red Army": "Soviet",
        }

        let FUTable = {
            "Western": {
                "Self-Propelled": [0,1,1,2,2,3],
                "Towed": [0,0,1,1,2,3],
                "Battalion": [0,1,1,1,1,1,],
            },
            "Soviet": {
                "Self-Propelled": [0,0,1,2,3,3],
                "Towed": [0,0,0,1,3,3],
                "Battalion": [0,0,1,1,1,1,],
            },
        }
        let artRoll = randomInteger(6);
        let artResult = artRoll + availMod;
        artResult = Math.min(Math.max(0,artResult),6);
        let FU = FUTable[side[nation]][type][artResult - 1];
        let result = {
            roll: artRoll,
            result: artResult,
            FU: FU,
        }
        return result;
    }



    const AreaFireIndexTable = {
        //ref by calibre first, then FU to get fire index #
        //this only goes up to FU 10, and no ICM or Helo yet
        "HE 30-69": [0,1,2,3,4,5,6,6,8,8,8],
        "HE 70-89": [0,3,4,7,8,9,10,10,15,15,15],
        "HE 90-119": [0,3,5,8,9,11,14,14,15,15,15],
        "HE 120-139": [0,8,10,14,15,16,18,18,19,19,19],
        "HE 140-169": [0,8,12,14,16,17,18,18,20,20,20],
        "HE 170+": [0,14,16,18,19,21,21,21,22,22,22],
    };

    const MRLSAreaFireIndexTable = {
        //ref by size, and maxes at 10 FU
        //ICM not in yet
        "Light HE": [0,1,1,1,1,1,1,2,2,3,3],
        "Medium HE": [0,1,1,2,4,5,6,8,8,9,10],
        "Heavy HE": [0,8,12,15,16,18,19,19,21,21,21],
        "Very Heavy HE": [0,12,15,17,18,19,21,21,22,22,22],
    }