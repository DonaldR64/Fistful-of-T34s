


    const DirectFire = (msg) => {
        let Tag = msg.content.split(";");
        let shooter = UnitArray[Tag[1]];
        let target = UnitArray[Tag[2]];





        

        SetupCard(shooter.name,target.name,shooter.nation);

        let losResult = LOS(shooter,target);
        let errorMsg = [];
        if (losResult.los === false) {
            errorMsg.push("[#ff0000]No LOS to Target[/#]");
            errorMsg.push(losResult.losReason);
        }

        if (weapon.range === "C" && losResult.distance > 1) {
            errorMsg.push("[#ff0000]Weapon only used in Close Combat[/#]");
        } else if (losResult.distance > weapon.range[2]) {
            errorMsg.push("[#ff0000]Target is Out of Range[/#]");
        }
        if (shooter.token.get(SM.unavail) === true || shooter.token.get(SM.double) === true) {
            errorMsg.push("[#ff0000]Unit is unable to Fire[/#]");
        }
        if (shooter.token.get(SM.fired) === true && (weapon.fired === true || shooter.type !== "Infantry")) {
            errorMsg.push("[#ff0000]Unit has already Fired[/#]");
        }

        let closeCombat = (losResult.distance === 1) ? true:false;

        let targetFacing = losResult.targetFacing;

        let armour = (targetFacing === "Front") ? target.armourF:target.armourSR;
        // -, S or a #
        


        if (closeCombat === true && shooter.type === "Infantry" && target.armour === true) {
            //side armour bit, check for friendlies
            if (Friendlies(target) === false) {
                armour = target.armourSR;
            }
        }


        let pen,ai,penTip,aiTip;




        if (target.armour === true) {
            if (shooter.pen === "NA") {
                errorMsg.push("No Anti-Tank Weapons");
            } else {
                if (shooter.pen[1] === true && closeCombat === false) {
                    errorMsg.push("Only AT in Close Combat");
                } else {
                    pen = shooter.pen[0];
                    penTip = "Base Pen: " + pen;
                    //pen for tanks up or down
                    if (shooter.type !== "Infantry") {
                        if (losResult.distance > shooter.range[1]) {
                            pen -= 2;
                            penTip += "<br>-2 Pen for Long Range";
                        }
                        if (losResult.distance <= shooter.range[0]) {
                            pen += 2;
                            penTip += "<br>+2 Pen for Short Range";
                        }
                    }
                }
            }
        } else {
            type = "AntiInfantry";
            if (shooter.antiInf === "NA") {
                errorMsg.push("No Anti-Infantry Weapons");
            } else {
                ai = shooter.antiInf[0];
                if (losResult.distance > shooter.antiInf[1]) {
                    ai = 0;
                }
                aiTip = (ai >= 0) ? "+" + ai:ai;
                aiTip = "Anti-Infantry: " + aiTip;
            }
        }


        let ROF = DeepCopy(shooter.rof);
        let rofTip = "";
        let flag = false;
        if (ROF.includes("(")) {
            ROF = ROF.replace("(","");
            ROF = ROF.replace(")","");
            if (shooter.token.get(SM.move)) {
                flag = true;
            }
        }
        ROF = ROF.split("/");
        if (closeCombat === true && ROF.length > 1) {
            ROF = ROF[1];
        } else {
            ROF = ROF[0];
        }
        ROF = parseInt(ROF);
        if (flag === true) {ROF--};
        if (ROF === 0) {
            errorMsg.push("Target has no ROF due to movement");
        }


        if (errorMsg.length > 0) {
            _.each(errorMsg,msg => {
                outputCard.body.push(msg);
            })
            PrintCard();
            return;
        }

        //so will have ai or pen as 'wpn' and wpnTip has base info
        let toHit = 4;
        let toHitTip = "<br>Base 4+";
        if (shooter.quality.includes("Good") || shooter.quality.includes("Excellent")) {
            toHitTip += "<br>+1 Quality";
            toHit--;
        }
        if (losResult.distance <= shooter.range[0]) {
            toHit--;
            toHitTip += "<br>+1 Short Range";
            shortRangeFlag = true;
        }
        if (losResult.distance > shooter.range[1]) {
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
        if (type === "AntiInfantry" && ai !== 0) {
            toHit += ai;
            toHitTip += "<br>" + aiTip;
        }

        
        let rolls = [];
        let hits = 0;coverSaves = 0;finalHits = 0;
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

        let tip = "Rolls: " + rolls.toString() + " vs. " + toHit + "+" + toHitTip;

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
        //Sound
        let sound;
        if (shooter.type === "Infantry") {
            sound = "Rifles";
            if (shooter.name.includes("HMG")) {
                sound = "MG";
            }
        } else {
            sound = "Shotgun";
            if (target.movetype === "Leg" || target.movetype === "Towed") {
                sound = "MG";
                if (shooter.special.includes("Flamethrower")) {
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
        if (shooter.special.includes("Flamethrower") && shortRangeFlag === true) {
            spawnFxBetweenPoints(new Point(shooter.token.get("left"),shooter.token.get("top")), new Point(target.token.get("left"),target.token.get("top")), "breath-fire");
        }
log("CC: " + closeCombat)
        if (closeCombat === false) {
            shooter.token.set(SM.fired,true);
        } else {
            //deprecate the movement marker 
            if (shooter.token.get(SM.ccmove)) {
                let m = parseInt(shooter.token.get(SM.ccmove));
                if (m > 0) {
                    m--;
                }
                if (m > 0) {
                    shooter.token.set(SM.ccmove,m);
                }
            }
            let qc = QualityCheck(target);
log("QC")
log(qc)
            let noun = (qc.pass === true) ? "is Suppressed":"Surrenders or Routs";
            outputCard.body.push(target.name + " " + qc.tip + ' its QC and ' + noun);
            if (qc.pass === true) {
                target.Suppress("B",true);
            }
        }
        shooter.token.set("tint_color","transparent");




        PrintCard();

    }