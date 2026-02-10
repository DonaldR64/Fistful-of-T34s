const DirectFire = (msg) => {
    let Tag = msg.content.split(";");
    let shooter = UnitArray[Tag[1]];
    let target = UnitArray[Tag[2]];
    let weapons = DeepCopy(shooter.weapons);
    let type, pen, ai, rof;
    let penTip = ""; 
    let aiTip = ""; 
    let rofTip = "";
    let errorMsg = [];


    SetupCard(shooter.name,target.name,shooter.nation);
    let losResult = LOS(shooter,target);
    if (losResult.los === false) {
        errorMsg.push("[#ff0000]No LOS to Target[/#]");
        errorMsg.push(losResult.losReason);
    }
    if (shooter.token.get(SM.unavail) === true || shooter.token.get(SM.double) === true) {
        errorMsg.push("[#ff0000]Unit is unable to Fire[/#]");
    }
    if (shooter.token.get(SM.fired) === true && (weapon.fired === true || shooter.type !== "Infantry")) {
        errorMsg.push("[#ff0000]Unit has already Fired that Weapon[/#]");
    }
    if (errorMsg.length > 0) {
        _.each(errorMsg,msg => {
            outputCard.body.push(msg);
        })
        PrintCard();
        return;
    }


    let closeCombat = (losResult.distance === 1) ? true:false;
    let targetFacing = losResult.targetFacing;
    let armour = (targetFacing === "Front") ? target.armourF:target.armourSR;
    if (closeCombat === true && shooter.type === "Infantry" && target.armour === true) {
        //side armour bit, check for friendlies
        if (Friendlies(target) === false) {
            armour = target.armourSR;
        }
    }
    //Armour will be  -, S or a #
    if (armour === "-") {
        type = "AI";
    } else if (armour === "S") {
        type = "S";
    } else {
        type = "Armour"
    }





    //Weapon selecton, defaults to weapon 0
    let weapon = weapons[0];
    //if multiple weapons, pick the most appropriate
    //if S type, pick best weapon and if AI or Anti-armour
    if (type === "AI") {
        if (weapons.length === 1 && weapon.ai === "-") {
            errorMsg.push("No Anti-Infantry Weapons");
        } else if (weapons.length > 1) {
            if (weapon.ai === "-" && weapons[1].ai === "-") {
                errorMsg.push("No Anti-Infantry Weapons");
            } else if (weapon.ai === "-" && weapons[1].ai !== "-") {
                weapon = weapons[1];
            } else if (weapon.ai !== "-" && weapons[1].ai !== "-") {
                let ai1 = parseInt(weapon.ai);
                let ai2 = parseInt(weapons[1].ai);
                if (closeCombat === true && weapon.range[0] > 1) {
                    ai1 = -100;
                }
                if (closeCombat === false && (weapon.range === "C" || losResult.distance > weapon.range[3] || losResult.distance < weapon.range[0])) {
                    ai1 = -100;
                }
                if (closeCombat === false && (weapons[1].range === "C" || losResult.distance > weapon.range[3] || losResult.distance < weapon.range[0])) {
                    ai2 = -100;
                }
                if (ai2 > ai1) {
                    weapon = weapons[1];
                }
            }
        }
    } else if (type === "Armour") {
        if (weapons.length === 1 && weapon.pen === "-") {
            errorMsg.push("No Anti-Tank Weapons");
        } else if (weapons.length > 1) {
            if (weapon.pen === "-" && weapons[1].pen === "-") {
                errorMsg.push("No Anti-Tank Weapons");
            } else if (weapon.pen === "-" && weapons[1].pen !== "-") {
                weapon = weapons[1];
            } else if (weapon.pen !== "-" && weapons[1].ai !== "-") {
                let p1 = parseInt(weapon.pen);
                let p2 = parseInt(weapons[1].pen);
                if (closeCombat === true && weapon.range[0] > 1) {
                    p1 = -100;
                }
                if (closeCombat === false && (weapon.range === "C" || losResult.distance > weapon.range[3] || losResult.distance < weapon.range[0])) {
                    p1 = -100;
                }
                if (closeCombat === false && (weapons[1].range === "C" || losResult.distance > weapon.range[3] || losResult.distance < weapon.range[0])) {
                    p2 = -100;
                }
                if (p2 > p1) {
                    weapon = weapons[1];
                }
            }
        }
    } else if (type === "S") {
        let r1,r2,d1,d2,p1,p2,max,pos,numbers = [];
        //rof
        if (closeCombat === true) {
            r1 = weapon.rof.includes("/") ? parseInt(weapon.rof.split("/")[1]) : parseInt(weapon.rof);
            if (weapon.range !== "C" && (weapon.range[0] > 1 || losResult.distance > weapon.range[3])) {r1 = 0};
            if (weapons.length > 1) {
                r2 = weapons[1].rof.includes("/") ? parseInt(weapons[1].rof.split("/")[1]) : parseInt(weapons[1].rof);
                if (weapons[1].range !== "C" && (weapons[1].range[0] > 1 || losResult.distance > weapons[1].range[3])) {
                    r2 = 0;
                }
            } else {
                r2 = 0;
            }
        } else {
            r1 = weapon.rof.includes("/") ? parseInt(weapon.rof.split("/")[0]) : parseInt(weapon.rof);
            if (weapon.range !== "C" && (weapon.range[0] > 1 || losResult.distance > weapon.range[3])) {r1 = 0};
            if (weapons.length > 1) {
                r2 = weapons[1].rof.includes("/") ? parseInt(weapons[1].rof.split("/")[0]) : parseInt(weapons[1].rof);
                if (weapon.range === "C") {
                    r1 = 0;
                }
                if (weapons[1].range === "C") {
                    r2 = 0;
                }
                if (weapons[1].range !== "C" && (weapons[1].range[0] > 1 || losResult.distance > weapons[1].range[3])) {
                    r2 = 0;
                }
            } else {
                r2 = 0;
            }
        }



        //chance of 4+ 
        d1 = weapon.ai === "-" ? 0:(3+parseInt(weapon.ai))/6;
        if (weapons.length > 1) {
            d2 = weapons[1].ai === "-" ? 0:(3+parseInt(weapons[1].ai))/6;
        } else {
            d2 = 0;
        }
        numbers.push(r1 * d1);
        numbers.push(r2 * d2);

        p1 = weapon.pen === "-" ? 1:parseInt(weapon.pen);
        if (weapons.length > 1) {
            p2 = weapons[1].pen === "-" ? 1:parseInt(weapons[1].pen);
        } else {
            p2 = 0;
        }

        if (weapon.pen.includes("h") === false && weapon.includes("he") === false) {
            if (losResult.distance < weapon.range[1]) {
                p1 += 2;
            }
            if (weapons.length > 1 && losResult.distance < weapons[1].range[1]) {
                p2 += 2;
            }
            if (losResult.distance > weapon.range[2]) {
                p1 -= 2;
            }
            if (weapons.length > 1 && losResult.distance > weapons[1].range[2]) {
                p2 += 2;
            }
        }
        //armour of an S is treated as 0, each pen = 1 dice, 4+ 
        numbers.push(r1 * p1 * .5);
        numbers.push(r2 * p2 * .5);

        max = Math.max(...numbers);
        pos = numbers.indexOf(max);
            
        if (pos === 0) {
            type = "AI";
        } else if (pos === 1) {
            type = "AI";
            weapon = weapons[1];
        } else if (pos === 2) {
            type = "Armour";
        } else if (pos === 3) {
            type = "Armour";
            weapon = weapons[1];
        }
    }

    //range issues
    if (closeCombat === false) {
        if (weapon.range === "C") {
            errorMsg.push("[#ff0000]Weapon only used in Close Combat[/#]");
        } else if (losResult.distance > weapon.range[2]) {
            errorMsg.push("[#ff0000]Target is Out of Range[/#]");
        } 
    } 
    if (losResult.distance < weapon.range[0]) {
        errorMsg.push("[#ff0000]Target is Under Minimum Range[/#]")
    }

    if (type === "Armour") {
        pen = parseInt(weapon.pen);
        penTip = "Base Pen: " + pen;
        if (weapon.pen.includes("h")) {
            let spec = target.armourSpecial;
            let add;
            if (spec === "A") {add = 1};
            if (spec === "B") {add = 2};
            if (spec === "C") {add = 3};
            if (spec === "D") {add = 4};
            if (spec === "E") {add = 5};
            if (spec === "F") {add = 6};
            armour += add;
            if (spec !== "-") {
                penTip += "<br>Special Armour +" + add;
            }
        }
        if (weapon.pen.includes("h") === false && weapon.pen.includes("he") === false) {
            if (losResult.distance > shooter.range[1]) {
                pen -= 2;
                penTip += "<br>-2 Pen for Long Range";
            }
            if (losResult.distance <= shooter.range[0]) {
                pen += 2;
                penTip += "<br>+2 Pen for Short Range";
            }
        } 
    } else if (type === "AI") {
        ai = parseInt(weapon.ai) || 0;
        aiTip = (ai >= 0) ? "+" + ai:ai.toString();
        aiTip = "Anti-Infantry: " + aiTip;
    }


    rof = weapon.rof;
    let flag = false;
    if (rof.includes("(")) {
        rof = rof.replace("(","");
        rof = rof.replace(")","");
        if (shooter.token.get(SM.move)) {
            flag = true;
        }
    }
    rof = rof.split("/");
    if (closeCombat === true && rof.length > 1) {
        rof = rof[1];
    } else {
        rof = rof[0];
    }
    rof = parseInt(rof);
    if (flag === true) {
        rof--;
        rofTip += "<br>-1 ROF due to movement";
    };
    if (shooter.quality.includes("Excellent")) {
        rof++;
        rofTip += "<br>+1 ROF due to Excellent";
    }
    if (rof === 0) {
        errorMsg.push("Target has no ROF due to movement");
    }

    if (errorMsg.length > 0) {
        _.each(errorMsg,msg => {
            outputCard.body.push(msg);
        })
        PrintCard();
        return;
    }

    let toHit = 4;
    let toHitTip = "<br>Base 4+";
    if (shooter.quality.includes("Good") || shooter.quality.includes("Excellent")) {
        toHitTip += "<br>+1 Quality";
        toHit--;
    }
    if (losResult.distance <= shooter.range[1]) {
        toHit--;
        toHitTip += "<br>+1 Short Range";
    }
    if (losResult.distance > shooter.range[2]) {
        toHit++;
        toHitTip += "<br>-1 Long Range";
    }
    if (shooter.CheckSuppression() === true) {
        toHit++;
        toHitTip += "<br>-1 Suppressed";
    }
    if (shooter.CheckOverwatch()) {
        toHit++;
        toHitTip += "<br>-1 Overwatch";
    }
    if (losResult.inSmoke === true) {
        toHit++;
        toHitTip += "<br>-1 for Smoke";
    }
    if (type === "AI" && ai !== 0) {
        toHit += ai;
        toHitTip += "<br>" + aiTip;
    }

        
    let rolls = [];
    let hits = 0;
    let coverSaves = 0; 
    let finalHits = 0;
    for (let i=0;i<ROF;i++) {
        let roll = randomInteger(6);
        rolls.push(roll);
        if ((roll >= toHit || roll === 6) && roll !== 1) {
            hits++;
        }
    }
    //cover saves
    let cover = HexMap[target.hexLabel].coverDirect;
    let coverRolls = [];
    let coverTip = "";
    if (cover > 0) {
        coverTip = (cover === 1) ? "<br>Soft Cover 5+ Save":"<br>Hard Cover 4+ Save";
        let coverSave = (cover === 1) ? 5:4;
        for (let i=0;i<hits;i++) {
            let coverRoll = randomInteger(6);
            coverRolls.push(coverRoll);
            if (coverRoll >= coverSave) {
                coverSaves++;
            }
        }
    }
    finalHits = hits - coverSaves;
    rolls = rolls.sort().reverse();

    let tip = "Rolls: " + rolls.toString() + " vs. " + toHit + "+" + rofTip + toHitTip;

    if (cover > 0) {
        coverRolls = coverRolls.sort().reverse();
        coverTip = "Rolls: " + coverRolls.toString() + " vs. " + coverTip;
    }

    if (hits === 0) {
        tip = '[Missed](#" class="showtip" title="' + tip + ')';
        outputCard.body.push(target.name + " is " + tip);
    } else {
        let s = (hits === 1) ? "":"s"
        let info = "Hit " + hits + " time" + s;
        tip = '[' + info + '](#" class="showtip" title="' + tip + ')';
        outputCard.body.push(target.name + " is " + tip);
        if (coverSaves > 0) {
            let cs = (coverSaves !== 1 || finalHits === 0) ? "s":"";
            if (finalHits === 0) {
                coverSaves = "All";
            }
            coverTip = '[' + coverSaves +'](#" class="showtip" title="' + coverTip + ')';
            outputCard.body.push("Cover Stopped " + coverTip + " Hit" + cs); 
        }

        if (finalHits > 0) {

            if (type === "Armour") {
                outputCard.body.push("[hr]");
                let penDice = (pen > armour) ? (pen - armour):1;
                let penMod = (pen <= armour) ? (pen - armour):0; //will always be 0 or a negative #
                let penTips = "", deflect = 0, qc = false, destroyed = false;
                for (let i=0;i<finalHits;i++) {
                    let penRolls = [];
                    for (let j=0;j<penDice;j++) {
                        let penRoll = randomInteger(6);
                        penRoll += penMod;
                        penRolls.push(penRoll);
                        if (penRoll < 4) {deflect++};
                        if (penRoll === 4 || penRoll === 5) {qc = true};
                        if (penRoll === 6) {destroyed = true};
                    }
                    penRolls = penRolls.sort().reverse();
                    if (i > 0) {penTips += "<br>"}; 
                    penTips += "Hit " + (i+1) + ": " + penRolls.toString();
                }
                tip = penTips;
                tip += "<br>___________________<br>";
                tip += "Pen " + pen + " vs. " + losResult.targetFacing + " Armour " + armour;
                tip += "<br>" + penTip;

                if (destroyed === true) {
                    tip = ' is [Destroyed](#" class="showtip" title="' + tip + ')';
                    target.Destroyed("Wreck");
                } else if (qc === true) {
                    tip = ' [Takes Damage](#" class="showtip" title="' + tip + ')';
                    target.token.set(SM.qc,true);
                } else {
                    tip = ' [Deflects all Shots](#" class="showtip" title="' + tip + ')';
                }
                outputCard.body.push(target.name + tip);
            } else {
                let oldQC = (target.token.get(SM.qc) === false) ? 0:(target.token.get(SM.qc) === true) ? 1:parseInt(target.token.get(SM.qc));
                finalHits += oldQC;
                if (finalHits > 0) {
                    target.token.set(SM.qc,finalHits);
                }
            }
        }

    }
    let sound;
    if (shooter.type === "Infantry") {
        sound = "Rifles";
        if (shooter.name.includes("MG")) {
            sound = "MG";
        }
    } else {
        sound = "Shotgun";
        if (target.movetype === "Leg" || target.movetype === "Towed") {
            sound = "MG";
            if (shooter.special.includes("Flamethrower") && closeCombat === true) {
                sound = "Flame";
            }
        }
    }

    PlaySound(sound);
    //rotate certain units eg tank destroyers, infantry --> basically those without turrets
    let turrets = ["Car","Halftrack","Tank"];
    let angle = Angle(HexMap[shooter.hexLabel].cube.angle(HexMap[target.hexLabel].cube));
    if (turrets.includes(shooter.type) === false) {
        shooter.token.set("rotation",angle);
    }
    if (shooter.special.includes("Flamethrower") && closeCombat === true) {
        spawnFxBetweenPoints(new Point(shooter.token.get("left"),shooter.token.get("top")), new Point(target.token.get("left"),target.token.get("top")), "breath-fire");
    }

    if (closeCombat === false) {
        shooter.token.set(SM.fired,true);
    } else {
        //deprecate movement, do quality check on target
        let m = 0;
        if (shooter.player === activePlayer) {
            m = parseInt(shooter.token.get("bar1_value")) || 0;
            m = Math.max(0,m-1);
            shooter.token.set("bar1_value",m);
        }
        let qc = QualityCheck(target);
        let noun = (qc.pass === true) ? "is Suppressed":"Surrenders or Routs";
        outputCard.body.push(target.name + " " + qc.tip + ' its QC and ' + noun);
        if (qc.pass === true) {
            target.Suppress("B",true);
        } else if (qc.pass === false && m > 0) {
            outputCard.body.push("[hr]");
            outputCard.body.push(shooter.name + " has " + m + " Movement Points left");
        }
    }
    shooter.token.set("tint_color","transparent");
    PrintCard();
}