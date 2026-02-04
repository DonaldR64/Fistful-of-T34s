const FFT = (() => {
    const version = '2026.1.31';
    if (!state.FFT) {state.FFT = {}};

    const pageInfo = {};
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC","BD","BE","BF","BG","BH","BI"];

    const UnitMarkers = ["A::6001458","B::6001459","C::6001460","D::6001461","E::6001462","F::6001463","G::6001464","H::6001465","I::6001466","J::6001467","L::6001468","M::6001469","O::6001471","P::6001472","Q::6001473","R::6001474","S::6001475"];

    const TurnMarkers = ["","https://s3.amazonaws.com/files.d20.io/images/361055772/zDURNn_0bbTWmOVrwJc6YQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055766/UZPeb6ZiiUImrZoAS58gvQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055764/yXwGQcriDAP8FpzxvjqzTg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055768/7GFjIsnNuIBLrW_p65bjNQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055770/2WlTnUslDk0hpwr8zpZIOg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055771/P9DmGozXmdPuv4SWq6uDvw/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055765/V5oPsriRTHJQ7w3hHRBA3A/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055767/EOXU3ujXJz-NleWX33rcgA/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055769/925-C7XAEcQCOUVN1m1uvQ/thumb.png?1695998303"];



    let HexSize, HexInfo, DIRECTIONS;

    //math constants
    const M = {
        f0: Math.sqrt(3),
        f1: Math.sqrt(3)/2,
        f2: 0,
        f3: 3/2,
        b0: Math.sqrt(3)/3,
        b1: -1/3,
        b2: 0,
        b3: 2/3,
    }

    const ArmourTypes = ["Halftrack","Tank Destroyer","Tank"];

    const DefineHexInfo = () => {
        HexSize = (70 * pageInfo.scale)/M.f0;
        if (pageInfo.type === "hex") {
            HexInfo = {
                size: HexSize,
                pixelStart: {
                    x: 35 * pageInfo.scale,
                    y: HexSize,
                },
                width: 70  * pageInfo.scale,
                height: pageInfo.scale*HexSize,
                xSpacing: 70 * pageInfo.scale,
                ySpacing: 3/2 * HexSize,
                directions: {
                    "Northeast": new Cube(1,-1,0),
                    "East": new Cube(1,0,-1),
                    "Southeast": new Cube(0,1,-1),
                    "Southwest": new Cube(-1,1,0),
                    "West": new Cube(-1,0,1),
                    "Northwest": new Cube(0,-1,1),
                },
                halfToggleX: 35 * pageInfo.scale,
                halfToggleY: 0,
            }
            DIRECTIONS = ["Northeast","East","Southeast","Southwest","West","Northwest"];
        } else if (pageInfo.type === "hexr") {
            //Hex H or Flat Topped
            HexInfo = {
                size: HexSize,
                pixelStart: {
                    x: HexSize,
                    y: 35 * pageInfo.scale,
                },
                width: pageInfo.scale*HexSize,
                height: 70  * pageInfo.scale,
                xSpacing: 3/2 * HexSize,
                ySpacing: 70 * pageInfo.scale,
                directions: {
                    "North": new Cube(0, -1, 1),
                    "Northeast": new Cube(1, -1, 0),
                    "Southeast": new Cube(1,0,-1),
                    "South": new Cube(0,1,-1),
                    "Southwest": new Cube(-1,1,0),
                    "Northwest": new Cube(-1,0,1),
                },
                halfToggleX: 0,
                halfToggleY: 35 * pageInfo.scale,
            }
            DIRECTIONS = ["North","Northeast","Southeast","South","Southwest","Northwest"];
        }
    }

    let UnitArray = {};
    let FormationArray = {};
    let qcUnits = [];
    let artUnits = [];

    let outputCard = {title: "",subtitle: "",side: "",body: [],buttons: [],};


    const Nations = {
        "Red Army": {
            "image": "",
            "backgroundColour": "#ff0000",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#ff0000",
            "borderStyle": "5px groove",

        },
        "Wermacht": {
            "image": "",
            "backgroundColour": "#ffffff",
            "titlefont": "Bokor",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px double",
        },

        "Neutral": {
            "image": "",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
        },

    };


    const SM = {
        suppressed: "status_yellow",
        qc: "status_red",
        fired: "status_Shell::5553215",
        move: "status_Advantage-or-Up::2006462",
        double: "status_Fast::5865486",
        green: "status_green", //to note has taken an art QC already
        unavail: "status_oneshot::5503748",
    }


    //height is height of terrain element
    //movecosts
    //cover for direct fire - 0 = None, 1 = Light (5+), 2 = Heavy (4+)
    //cover for spotting - true/false

    const LinearTerrain = {




    }

    const Capitalize = (val) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }



    const TerrainInfo = {
        "Heavy Woods": {name: "Heavy Woods",height: 1, moveCosts: {leg: 1, tracked: 2, horse: 2, wheeled: 2, halftrack: 2}, cover: 1,spot: true},
        "Town": {name: "Town",height: 1, moveCosts: {leg: 1, tracked: 2, horse: 2, wheeled: 2, halftrack: 2}, cover: 2,spot: true},
        "River": {name: "River",height: 0, moveCosts: {leg: 1000, tracked:1000, horse: 1000, wheeled: 1000, halftrack: 1000}, cover: 1,spot: true},



    }

    const HillHeights = {
        "#000000": 1,
        "#666666": 2,
        
    }








    const simpleObj = (o) => {
        let p = JSON.parse(JSON.stringify(o));
        return p;
    };

    const getCleanImgSrc = (imgsrc) => {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    };

    const tokenImage = (img) => {
        //modifies imgsrc to fit api's requirement for token
        img = getCleanImgSrc(img);
        img = img.replace("%3A", ":");
        img = img.replace("%3F", "?");
        img = img.replace("med", "thumb");
        return img;
    };

    const DeepCopy = (variable) => {
        variable = JSON.parse(JSON.stringify(variable))
        return variable;
    };

    const PlaySound = (name) => {
        let sound = findObjs({type: "jukeboxtrack", title: name})[0];
        if (sound) {
            sound.set({playing: true,softstop:false});
        }
    };

    const FX = (fxname,unit1,unit2) => {
        //unit2 is target, unit1 is shooter
        //if its an area effect, unit1 isnt used
        if (fxname.includes("System")) {
            //system fx
            fxname = fxname.replace("System-","");
            if (fxname.includes("Blast")) {
                fxname = fxname.replace("Blast-","");
                spawnFx(unit2.token.get("left"),unit2.token.get("top"), fxname);
            } else {
                spawnFxBetweenPoints(new Point(unit1.token.get("left"),unit1.token.get("top")), new Point(unit2.token.get("left"),unit2.token.get("top")), fxname);
            }
        } else {
            let fxType =  findObjs({type: "custfx", name: fxname})[0];
            if (fxType) {
                spawnFxBetweenPoints(new Point(unit1.token.get("left"),unit1.token.get("top")), new Point(unit2.token.get("left"),unit2.token.get("top")), fxType.id);
            }
        }
    }






    const pointInPolygon = (point,vertices) => {
        //evaluate if point is in the polygon
        px = point.x
        py = point.y
        collision = false
        len = vertices.length - 1
        for (let c=0;c<len;c++) {
            vc = vertices[c];
            vn = vertices[c+1]
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y)/(vn.y-vc.y)+vc.x)) {
                collision = !collision
            }
        }
        return collision
    }

    const translatePoly = (poly) => {
        //translate points in a pathv2 polygon to map points
        let vertices = [];
        let points = JSON.parse(poly.get("points"));
        let centre = new Point(poly.get("x"), poly.get("y"));
        //covert path points from relative coords to actual map coords
        //define 'bounding box;
        let minX = Infinity,minY = Infinity, maxX = 0, maxY = 0;
        _.each(points,pt => {
            minX = Math.min(pt[0],minX);
            minY = Math.min(pt[1],minY);
            maxX = Math.max(pt[0],maxX);
            maxY = Math.max(pt[1],maxY);
        })
        //translate each point back based on centre of box
        let halfW = (maxX - minX)/2 + minX;
        let halfH = (maxY - minY)/2 + minY
        let zeroX = centre.x - halfW;
        let zeroY = centre.y - halfH;
        _.each(points,pt => {
            let x = Math.round(pt[0] + zeroX);
            let y = Math.round(pt[1] + zeroY);
            vertices.push(new Point(x,y));
        })
        return vertices;
    }


    const KeyNum = (unit,keyword) => {
        let key = unit.keywords.split(",");
        log(key)
        let num = 1;
        _.each(key,word => {
            if (word.includes(keyword)) {
                word = word.trim().replace(keyword,"").replace("(","").replace(")","");
                num = parseInt(word);
            }
            log(num)
        })
        return num;
    }









    //Retrieve Values from character Sheet Attributes
    const Attribute = (character,attributename) => {
        //Retrieve Values from character Sheet Attributes
        let attributeobj = findObjs({type:'attribute',characterid: character.id, name: attributename})[0]
        let attributevalue = "";
        if (attributeobj) {
            attributevalue = attributeobj.get('current');
        }
        return attributevalue;
    };

    const AttributeArray = (characterID) => {
        let aa = {}
        let attributes = findObjs({_type:'attribute',_characterid: characterID});
        for (let j=0;j<attributes.length;j++) {
            let name = attributes[j].get("name")
            let current = attributes[j].get("current")   
            if (!current || current === "") {current = " "} 
            aa[name] = current;
            let max = attributes[j].get("max")   
            if (!max || max === "") {max = " "} 
            aa[name + "_max"] = max;
        }
        return aa;
    };

    const AttributeSet = (characterID,attributename,newvalue,max) => {
        if (!max) {max = false};
        let attributeobj = findObjs({type:'attribute',characterid: characterID, name: attributename})[0]
        if (attributeobj) {
            if (max === true) {
                attributeobj.set("max",newvalue)
            } else {
                attributeobj.set("current",newvalue)
            }
        } else {
            if (max === true) {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    max: newvalue,
                    characterid: characterID,
                });            
            } else {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    characterid: characterID,
                });            
            }
        }
        return attributeobj.id;
    };

    const DeleteAttribute = (characterID,attributeName) => {
        let attributeObj = findObjs({type:'attribute',characterid: characterID, name: attributeName})[0]
        if (attributeObj) {
            attributeObj.remove();
        }
    }

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        };
        toOffset() {
            let cube = this.toCube();
            let offset = cube.toOffset();
            return offset;
        };
        toCube() {
            let x = this.x - HexInfo.pixelStart.x;
            let y = this.y - HexInfo.pixelStart.y;
            let q,r;
            if (pageInfo.type === "hex") {
                q = (M.b0 * x + M.b1 * y) / HexInfo.size;
                r = (M.b3 * y) / HexInfo.size;
            } else if (pageInfo.type === "hexr") {
                q = (M.b3 * x) / HexInfo.size;
                r = (M.b1 * x + M.b0 * y) / HexInfo.size;
            }
            let cube = new Cube(q,r,-q-r).round();
            return cube;
        };
        distance(b) {
            return Math.sqrt(((this.x - b.x) * (this.x - b.x)) + ((this.y - b.y) * (this.y - b.y)));
        }
        label() {
            return this.toCube().label();
        }
    }

    class Offset {
        constructor(col,row) {
            this.col = col;
            this.row = row;
        }
        label() {
            let label = rowLabels[this.row] + (this.col + 1).toString();
            return label;
        }
        toCube() {
            let q,r;
            if (pageInfo.type === "hex") {
                q = this.col - (this.row - (this.row&1))/2;
                r = this.row;
            } else if (pageInfo.type === "hexr") {
                q = this.col;
                r = this.row - (this.col - (this.col&1))/2;
            }
            let cube = new Cube(q,r,-q-r);
            cube = cube.round(); 
            return cube;
        }
        toPoint() {
            let cube = this.toCube();
            let point = cube.toPoint();
            return point;
        }
    };

    const Angle = (theta) => {
        while (theta < 0) {
            theta += 360;
        }
        while (theta >= 360) {
            theta -= 360;
        }
        return theta
    }   

    class Cube {
        constructor(q,r,s) {
            this.q = q;
            this.r =r;
            this.s = s;
        }

        add(b) {
            return new Cube(this.q + b.q, this.r + b.r, this.s + b.s);
        }
        angle(b) {
            //angle between 2 hexes
            let origin = this.toPoint();
            let destination = b.toPoint();

            let x = Math.round(origin.x - destination.x);
            let y = Math.round(origin.y - destination.y);
            let phi = Math.atan2(y,x);
            phi = phi * (180/Math.PI);
            phi = Math.round(phi);
            phi -= 90;
            phi = Angle(phi);
            return phi;
        }        
        subtract(b) {
            return new Cube(this.q - b.q, this.r - b.r, this.s - b.s);
        }
        static direction(direction) {
            return HexInfo.directions[direction];
        }
        neighbour(direction) {
            //returns a hex (with q,r,s) for neighbour, specify direction eg. hex.neighbour("NE")
            return this.add(HexInfo.directions[direction]);
        }
        neighbours() {
            //all 6 neighbours
            let results = [];
            for (let i=0;i<DIRECTIONS.length;i++) {
                results.push(this.neighbour(DIRECTIONS[i]));
            }
            return results;
        }

        len() {
            return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
        }
        distance(b) {
            return this.subtract(b).len();
        }
        lerp(b, t) {
            return new Cube(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
        }
        linedraw(b) {
            //returns array of hexes between this hex and hex 'b' incl. hex 'b'
            var N = this.distance(b);
            var a_nudge = new Cube(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06);
            var b_nudge = new Cube(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
            var results = [];
            var step = 1.0 / Math.max(N, 1);
            for (var i = 1; i <= N; i++) {
                results.push(a_nudge.lerp(b_nudge, step * i).round());
            }
            return results;
        }
        label() {
            let offset = this.toOffset();
            let label = offset.label();
            return label;
        }
        radius(rad) {
            //returns array of hexes in radius rad
            //Not only is x + y + z = 0, but the absolute values of x, y and z are equal to twice the radius of the ring
            let results = [];
            let h;
            for (let i = 0;i <= rad; i++) {
                for (let j=-i;j<=i;j++) {
                    for (let k=-i;k<=i;k++) {
                        for (let l=-i;l<=i;l++) {
                            if((Math.abs(j) + Math.abs(k) + Math.abs(l) === i*2) && (j + k + l === 0)) {
                                h = new Cube(j,k,l);
                                results.push(this.add(h));
                            }
                        }
                    }
                }
            }
            return results;
        }

        ring(radius) {
            let results = [];
            let b = new Cube(-1 * radius,0,1 * radius);  //start at west 
            let cube = this.add(b);
            for (let i=0;i<6;i++) {
                //for each direction
                for (let j=0;j<radius;j++) {
                    results.push(cube);
                    cube = cube.neighbour(DIRECTIONS[i]);
                }
            }
            return results;
        }

        round() {
            var qi = Math.round(this.q);
            var ri = Math.round(this.r);
            var si = Math.round(this.s);
            var q_diff = Math.abs(qi - this.q);
            var r_diff = Math.abs(ri - this.r);
            var s_diff = Math.abs(si - this.s);
            if (q_diff > r_diff && q_diff > s_diff) {
                qi = -ri - si;
            }
            else if (r_diff > s_diff) {
                ri = -qi - si;
            }
            else {
                si = -qi - ri;
            }
            return new Cube(qi, ri, si);
        }
        toPoint() {
            let x,y;
            if (pageInfo.type === "hex") {
                x = (M.f0 * this.q + M.f1 * this.r) * HexInfo.size;
                y = 3/2 * this.r * HexInfo.size;
            } else if (pageInfo.type === "hexr") {
                x = 3/2 * this.q * HexInfo.size;
                y = (M.f1 * this.q + M.f0 * this.r) * HexInfo.size;
            }
            x += HexInfo.pixelStart.x;
            y += HexInfo.pixelStart.y;
            let point = new Point(x,y);
            return point;
        }
        toOffset() {
            let col,row;
            if (pageInfo.type === "hex") {
                col = this.q + (this.r - (this.r&1))/2;
                row = this.r;
            } else if (pageInfo.type === "hexr") {
                col = this.q;
                row = this.r + (this.q - (this.q&1))/2;
            }
            let offset = new Offset(col,row);
            return offset;
        }
        whatDirection(b) {
            let delta = new Cube(b.q - this.q,b.r - this.r, b.s - this.s);
            let dir = "Unknown";
            let keys = Object.keys(HexInfo.directions);
            for (let i=0;i<6;i++) {
                let d = HexInfo.directions[keys[i]];
                if (d.q === delta.q && d.r === delta.r && d.s === delta.s) {
                    dir = keys[i];
                }
            }
            return dir
        }

     
    };

    class Hex {
        //hex will have its elevation and the hexes terrain which can reference TerrainInfo for other details
        constructor(point) {
            this.centre = point;
            let offset = point.toOffset();
            this.offset = offset;
            this.tokenIDs = [];
            this.cube = offset.toCube();
            this.label = offset.label();
            this.elevation = 0;
            this.terrain = "Open";
            this.offboard = false;
            this.moveCosts = {leg: 1, tracked: 1, horse: 1, wheeled: 1, halftrack: 1}
            this.cover = 0;
            this.smoke = "";
            this.smokePlayer = "";
            this.edges = {};
            _.each(DIRECTIONS,a => {
                this.edges[a] = "Open";
            })
            HexMap[this.label] = this;
        }
    }

    class Unit {
        constructor(id) {
            let token = findObjs({_type:"graphic", id: id})[0];
            let label = (new Point(token.get("left"),token.get("top"))).label();
            let charID = token.get("represents");
            let char = getObj("character", charID); 

            let aa = AttributeArray(charID);
  

            this.token = token;
            this.charName = char.get("name");
            let name = token.get("name");
            if (!name || name === "") {
                name = this.charName;
            }
            this.name = name;

            this.id = id;
            this.charID = charID;
            this.hexLabel = label;

            this.nation = aa.nation || "Neutral";
            if (state.FFT.nations[0] === "") {
                state.FFT.nations[0] = this.nation;
            } else if (state.FFT.nations[0] !== this.nation && state.FFT.nations[1] === "") {
                state.FFT.nations[1] = this.nation;
            }
            this.player = (this.nation === "Neutral") ? 2:(state.FFT.nations[0] === this.nation)? 0:1;
            this.type = aa.type;
            this.movement = parseInt(aa.movement);
            this.moveType = aa.moveType;
            this.quality = aa.quality;
            this.armourF = parseInt(aa.armourF) || "NA"; 
            this.armourSR = parseInt(aa.armourSR) || "NA"; 

            if (aa.artflag === "On") {
                this.avail = (aa.avail === "Auto") ? 1:parseInt(aa.avail.replace("+",""));
                this.artsize = parseInt(aa.artsize.replace(/[^0-9]+/g, ''));
                this.arteffect = aa.arteffect;
                this.artrange = parseInt(aa.artrange);
            } else {
                this.rof = parseInt(aa.rof);
                if (aa.range) {
                    this.range = aa.range.split("/")
                } else {
                    this.range = [0,0,0];
                }
                _.each(this.range, band => {
                    band = parseInt(band);
                })
                this.antiInf = parseInt(aa.antiInf) || 0;
                this.pen = aa.pen || 0;
            }


            this.formationID = "";




            UnitArray[id] = this;
            HexMap[label].tokenIDs.push(id);






        }



        Destroyed () {
            

        }













    }

    class Formation {
        constructor(name,uID,fID = stringGen()) {
            let refUnit = UnitArray[uID];
            refUnit.formationID = fID;
            this.nation = refUnit.nation;
            this.player = refUnit.player || 0;
            this.casualties = 0;
            this.name = name;
            this.id = fID;
            this.tokenIDs = [uID];
            FormationArray[fID] = this;
            if (!state.FFT.formationInfo[fID]) {
                let info = {
                    name: name,
                    nation: this.nation,
                    player: this.player,
                    casualties: 0,
                    tokenIDs: this.tokenIDs,
                }
                state.FFT.formationInfo[fID] = info;
            } else {
                let info = state.FFT.formationInfo[fID]
                this.casualties = info.casualties;
                this.breakpoint = info.breakpoint;
                this.hq = info.hq;
            }
        }




        AddUnit(uID) {
            if (this.tokenIDs.includes(uID) === false) {
                this.tokenIDs.push(uID);
            }
            UnitArray[uID].formationID = this.id;
        }


    }







    const AddAbility = (abilityName,action,characterID) => {
        createObj("ability", {
            name: abilityName,
            characterid: characterID,
            action: action,
            istokenaction: true,
        })
    }    

    const AddAbilities = (msg) => {
        if (!msg.selected) {
            sendChat("","No Token Selected");
            return;
        };
        let id = msg.selected[0]._id;
        let unit = UnitArray[id];
        if (!unit) {return};
        AddAbilities2(unit);
    }


    const AddAbilities2 = (unit) => {
        let char = getObj("character", unit.charID);   

        let abilityName,action;
        let abilArray = findObjs({_type: "ability", _characterid: char.id});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 
        //Move 
        if (unit.moveMax > 0) {
            abilityName = "0 - Move";
            action = "!Activate;Move;@{selected|token_id}";
            AddAbility(abilityName,action,char.id);
        }

        let systemNum = 0;
        //Use Weapons 
        for (let i=0;i<unit.weapons.length;i++) {
            let weapon = unit.weapons[i];
            systemNum++;
            abilityName = systemNum + " - " + weapon.name;
            action = "!Activate;Attack" + i + ";@{selected|token_id}";
            //how many targets?
            let targets = 1;
            if (weapon.name.includes("(x")) {
                let temp = weapon.name.split("(x");
                targets = parseInt(temp[1].replace(")",""));
            }
            for (let t=0;t<targets;t++) {
                action += ";@{target|Target " + (t+1) + "|token_id}";
            }
            AddAbility(abilityName,action,char.id);
        }

        //Use Abilities

        


        //Load Weapons/Abilities





        sendChat("","Abilities Added")
    }


    const ButtonInfo = (phrase,action,inline) => {
        //inline - has to be true in any buttons to have them in same line -  starting one to ending one
        if (!inline) {inline = false};
        let info = {
            phrase: phrase,
            action: action,
            inline: inline,
        }
        outputCard.buttons.push(info);
    };

    const SetupCard = (title,subtitle,side) => {
        outputCard.title = title;
        outputCard.subtitle = subtitle;
        outputCard.side = side;
        outputCard.body = [];
        outputCard.buttons = [];
        outputCard.inline = [];
    };

    const DisplayDice = (roll,tablename,size) => {
        roll = roll.toString();
        tablename = tablename.replace(/\s+/g, '');
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        if (!table) {
            table = findObjs({type:'rollabletable', name: "Neutral"})[0];
        }
        let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];        
        let avatar = obj.get('avatar');
        let out = "<img width = "+ size + " height = " + size + " src=" + avatar + "></img>";
        return out;
    };

    const PrintCard = (id) => {
        let output = "";
        if (id) {
            let playerObj = findObjs({type: 'player',id: id})[0];
            let who = playerObj.get("displayname");
            output += `/w "${who}"`;
        } else {
            output += "/desc ";
        }

        if (!outputCard.side || !Nations[outputCard.side]) {
            outputCard.side = "Neutral";
        }

        //start of card
        output += `<div style="display: table; border: ` + Nations[outputCard.side].borderStyle + " " + Nations[outputCard.side].borderColour + `; `;
        output += `background-color: #EEEEEE; width: 100%; text-align: center; `;
        output += `border-radius: 1px; border-collapse: separate; box-shadow: 5px 3px 3px 0px #aaa;;`;
        output += `"><div style="display: table-header-group; `;
        output += `background-color: ` + Nations[outputCard.side].backgroundColour + `; `;
        output += `background-image: url(` + Nations[outputCard.side].image + `), url(` + Nations[outputCard.side].image + `); `;
        output += `background-position: left,right; background-repeat: no-repeat, no-repeat; background-size: contain, contain; align: center,center; `;
        output += `border-bottom: 2px solid #444444; "><div style="display: table-row;"><div style="display: table-cell; padding: 2px 2px; text-align: center;"><span style="`;
        output += `font-family: ` + Nations[outputCard.side].titlefont + `; `;
        output += `font-style: normal; `;

        let titlefontsize = "1.4em";
        if (outputCard.title.length > 12) {
            titlefontsize = "1em";
        }

        output += `font-size: ` + titlefontsize + `; `;
        output += `line-height: 1.2em; font-weight: strong; `;
        output += `color: ` + Nations[outputCard.side].fontColour + `; `;
        output += `text-shadow: none; `;
        output += `">`+ outputCard.title + `</span><br /><span style="`;
        output += `font-family: Arial; font-variant: normal; font-size: 13px; font-style: normal; font-weight: bold; `;
        output += `color: ` +  Nations[outputCard.side].fontColour + `; `;
        output += `">` + outputCard.subtitle + `</span></div></div></div>`;

        //body of card
        output += `<div style="display: table-row-group; ">`;

        let inline = 0;

        for (let i=0;i<outputCard.body.length;i++) {
            let out = "";
            let line = outputCard.body[i];
            if (!line || line === "") {continue};
            if (line.includes("[INLINE")) {
                let end = line.indexOf("]");
                let substring = line.substring(0,end+1);
                let num = substring.replace(/[^\d]/g,"");
                if (!num) {num = 1};
                line = line.replace(substring,"");
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += line + " ";

                for (let q=0;q<num;q++) {
                    let info = outputCard.inline[inline];
                    out += `<a style ="background-color: ` + Nations[outputCard.side].backgroundColour + `; padding: 5px;`
                    out += `color: ` + Nations[outputCard.side].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                    out += `border-color: ` + Nations[outputCard.side].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                    out += `"href = "` + info.action + `">` + info.phrase + `</a>`;
                    inline++;                    
                }
                out += `</div></span></div></div>`;
            } else {
                line = line.replace(/\[hr(.*?)\]/gi, '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">');
                line = line.replace(/\[\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\](.*?)\[\/[\#]\]/g, "<span style='color: #$1;'>$2</span>"); // [#xxx] or [#xxxx]...[/#] for color codes. xxx is a 3-digit hex code
                line = line.replace(/\[[Uu]\](.*?)\[\/[Uu]\]/g, "<u>$1</u>"); // [U]...[/u] for underline
                line = line.replace(/\[[Bb]\](.*?)\[\/[Bb]\]/g, "<b>$1</b>"); // [B]...[/B] for bolding
                line = line.replace(/\[[Ii]\](.*?)\[\/[Ii]\]/g, "<i>$1</i>"); // [I]...[/I] for italics
                let lineBack,fontcolour;
                if (line.includes("[F]")) {
                    let ind1 = line.indexOf("[F]") + 3;
                    let ind2 = line.indexOf("[/f]");
                    let fac = line.substring(ind1,ind2);
                    if (Nations[fac]) {
                        lineBack = Nations[fac].backgroundColour;
                        fontcolour = Nations[fac].fontColour;
                    }
                    line = line.replace("[F]" + fac + "[/f]","");

                } else {
                    lineBack = (i % 2 === 0) ? "#D3D3D3": "#EEEEEE";
                    fontcolour = "#000000";
                }
                out += `<div style="display: table-row; background: ` + lineBack + `;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color:` + fontcolour + `; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += line + `</div></span></div></div>`;                
            }
            output += out;
        }

        //buttons
        if (outputCard.buttons.length > 0) {
            for (let i=0;i<outputCard.buttons.length;i++) {
                let info = outputCard.buttons[i];
                let inline = info.inline;
                if (i>0 && inline === false) {
                    output += '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">';
                }
                let out = "";
                let borderColour = Nations[outputCard.side].borderColour;
                
                if (inline === false || i===0) {
                    out += `<div style="display: table-row; background: #FFFFFF;; ">`;
                    out += `<div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                    out += `"><span style="line-height: normal; color: #000000; `;
                    out += `"> <div style='text-align: center; display:block;'>`;
                }
                if (inline === true) {
                    out += '<span>     </span>';
                }
                out += `<a style ="background-color: ` + Nations[outputCard.side].backgroundColour + `; padding: 5px;`
                out += `color: ` + Nations[outputCard.side].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                out += `border-color: ` + borderColour + `; font-family: Tahoma; font-size: x-small; `;
                out += `"href = "` + info.action + `">` + info.phrase + `</a>`
                
                if (inline === false || i === (outputCard.buttons.length - 1)) {
                    out += `</div></span></div></div>`;
                }
                output += out;
            }

        }

        output += `</div></div><br />`;
        sendChat("",output);
        outputCard = {title: "",subtitle: "",side: "",body: [],buttons: [],};
    }

    //related to building hex map
    const LoadPage = () => {
        //build Page Info and flesh out Hex Info
        pageInfo.page = getObj('page', Campaign().get("playerpageid"));
        pageInfo.name = pageInfo.page.get("name");
        pageInfo.scale = pageInfo.page.get("snapping_increment");
        pageInfo.width = pageInfo.page.get("width") * 70;
        pageInfo.height = pageInfo.page.get("height") * 70;
        pageInfo.type = pageInfo.page.get("grid_type");

    }

    const BuildMap = () => {
        let startTime = Date.now();
        HexMap = {};
        let startX = HexInfo.pixelStart.x;
        let startY = HexInfo.pixelStart.y;
        let halfToggleX = HexInfo.halfToggleX;
        let halfToggleY = HexInfo.halfToggleY;
        if (pageInfo.type === "hex") {
            for (let j = startY; j <= pageInfo.height;j+=HexInfo.ySpacing){
                for (let i = startX;i<= pageInfo.width;i+=HexInfo.xSpacing) {
                    let point = new Point(i,j);     
                    let hex = new Hex(point);
                }
                startX += halfToggleX;
                halfToggleX = -halfToggleX;
            }
        } else if (pageInfo.type === "hexr") {
            for (let i=startX;i<=pageInfo.width;i+=HexInfo.xSpacing) {
                for (let j=startY;j<=pageInfo.height;j+=HexInfo.ySpacing) {
                    let point = new Point(i,j);     
                    let hex = new Hex(point);
                }
                startY += halfToggleY;
                halfToggleY = -halfToggleY;
            }
        }
        AddElevations();
        AddTerrain();    
        //AddEdges();
        AddTokens();
        let elapsed = Date.now()-startTime;
        log("Hex Map Built in " + elapsed/1000 + " seconds");
    };







    //terrain that is edges - hedges, walls, barricades and such
    const AddEdges = () => {
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "pathv2",layer: "map",});
        _.each(paths,path => {
            let type = EdgeInfo[path.get("stroke").toLowerCase()];
            if (type) {
                let vertices = translatePoly(path);
                //work through pairs of vertices
                for (let i=0;i<(vertices.length -1);i++) {
                    let pt1 = vertices[i];
                    let pt2 = vertices[i+1];
                    let midPt = new Point((pt1.x + pt2.x)/2,(pt1.y + pt2.y)/2);
                    //find nearest hex to midPt
                    let hexLabel = midPt.label();
                    //now run through that hexes neighbours and see what intersects with original line to identify the 2 neighbouring hexes
                    let hex1 = HexMap[hexLabel];
                    if (!hex1) {continue}
                    let pt3 = hex1.centre;
                    let neighbourCubes = hex1.cube.neighbours();
                    for (let j=0;j<neighbourCubes.length;j++) {
                        let k = j+3;
                        if (k> 5) {k-=6};
                        let hl2 = neighbourCubes[j].label();
                        let hex2 = HexMap[hl2];
                        if (!hex2) {continue}
                        let pt4 = hex2.centre;
                        let intersect = lineLine(pt1,pt2,pt3,pt4);
                        if (intersect) {
                            //dont overwrite bridges
                            if (hex1.edges[DIRECTIONS[j]].name !== "Bridge") {
                                hex1.edges[DIRECTIONS[j]] = type;
                            }
                            if (hex2.edges[DIRECTIONS[k]].name !== "Bridge") {
                                hex2.edges[DIRECTIONS[k]] = type;
                            }
                        }
                    }
                }
            }
        })
    }


    const AddTerrain = () => {
        //add terrain using tokens on map page, either on top or under map
        let tokens = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        _.each(tokens,token => {
            let name = token.get("name");
            let terrain = TerrainInfo[name];
            if (terrain) {
//log(terrain)
                let centre = new Point(token.get("left"),token.get('top'));
                let centreLabel = centre.toCube().label();
                let hex = HexMap[centreLabel];
                hex.terrain = name;
                hex.height = terrain.height;
                hex.moveCosts = terrain.moveCosts;
                hex.cover = terrain.cover;
            }
            if (name === "Map") {
                DefineOffboard(token);
            }
        })
        //add smoke
        tokens = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "foreground",});
        _.each(tokens,token => {
            let name = token.get("name");
            if (name.includes("Smoke")) {
                let centre = new Point(token.get("left"),token.get('top'));
                let centreLabel = centre.toCube().label();
                let hex = HexMap[centreLabel];
                hex.smoke = token.id;
                hex.smokePlayer = parseInt(name.replace("Smoke",""));
            }
        })



    }

    const AddElevations = () => {
        //use terrain lines to build elevations
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "pathv2",layer: "map",});
        _.each(paths,path => {
            let elevation = HillHeights[path.get("stroke").toLowerCase()];
            if (elevation) {
                elevation = parseInt(elevation);
                let vertices = translatePoly(path);
                _.each(HexMap,hex => {
                    let result = pointInPolygon(hex.centre,vertices);
                    if (result === true) {
                        hex.elevation = Math.max(hex.elevation,elevation);
                    }
                });
            }
        });
    }





     
    const AddTokens = () => {
        FormationArray = {};
        UnitArray = {};
        //create an array of all tokens
        let start = Date.now();
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });

        let c = tokens.length;
        let s = (1===c?'':'s');     
        
        tokens.forEach((token) => {
            let character = getObj("character", token.get("represents"));   
            let fID = decodeURIComponent(token.get("gmnotes")).toString();
            if (character && fID && fID.includes("TargetIcon") === false) {
                let unit = new Unit(token.get("id"));
                let formation = FormationArray[fID];
                let formationInfo = state.FFT.formationInfo[fID];
                if (!formation) {
                    if (formationInfo) {
                        formation = new Formation(state.FFT.formationInfo[fID].name,unit.id,fID);
                        formation.AddUnit(unit.id);
                    } else {
                        sendChat("",unit.name + " - needs to redefine its Formation");
                    }
                } else {
                    formation.AddUnit(unit.id);
                }
            }  
        });
        let elapsed = Date.now()-start;
        log(`${c} token${s} checked in ${elapsed/1000} seconds - ` + Object.keys(UnitArray).length + " placed in Unit Array");

    }

    const DefineOffboard = (token) => {
        let centre = new Point(token.get("left"),token.get('top'));
        let halfW = token.get("width")/2;
        let halfH = token.get("height")/2;
        let minX = centre.x - halfW;
        let maxX = centre.x + halfW;
        let minY = centre.y - halfH;
        let maxY = centre.y + halfH;
        _.each(HexMap,hex => {
            if (hex.centre.x < minX || hex.centre.x > maxX || hex.centre.y < minY || hex.centre.y > maxY) {
                hex.terrain = "Offboard";
                hex.offboard = true;
            }
        })
    }

    const stringGen = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(randomInteger(possible.length)));
        }
        return text;
    };



    const PlaceTarget = (msg) => {
        let Tag = msg.split(";");
        let id = Tag[0];
        let type = Tag[1];
        let unit = UnitArray[id];

        if (type === "Relay") {
            let charID = "-OWqqZirwy4ocuhD9Llb";
            let img = "https://files.d20.io/images/105823565/P035DS5yk74ij8TxLPU8BQ/thumb.png?1582679991";           
            img = getCleanImgSrc(img);
            let newToken = createObj("graphic", {
                left: unit.token.get("left"),
                top: unit.token.get("top"),
                width: 50,
                height: 50, 
                pageid: Campaign().get("playerpageid"),
                imgsrc: img,
                layer: "objects",
                represents: charID,
                name: "Marker",
            })
            let newUnit = new Unit(newToken.id);
            newUnit.targettingUnitID = id;
            log(newUnit)
        }

        




    }

    const SetupGame = (msg) => {
        let firstNation = msg.content.split(";")[1];
        let firstPlayer = state.FFT.nations[0] === firstNation ? 0:1;
        state.FFT.firstPlayer = firstPlayer;
        state.FFT.turn = 0;
        state.FFT.activePlayer = 2;
        state.FFT.phase = "";

        state.FFT.visibility = 70; //can later alter this




    }


    const AdvancePhase = () => {
        let turn = state.FFT.turn;
        let activePlayer = state.FFT.activePlayer;
        let phase = state.FFT.phase;

        let phases = ["Artillery","Movement","Firing","End"];
        
        let currentPhase = phases[phases.indexOf(phase) + 1] || "Artillery";

        if (currentPhase === "Artillery") {
            if (activePlayer !== state.FFT.firstPlayer || turn === 0) {
                turn += 1;
                activePlayer = state.FFT.firstPlayer;
            } else {
                activePlayer = (state.FFT.firstPlayer === 0) ? 1:0;
            }
        }




        state.FFT.turn = turn;
        state.FFT.phase = currentPhase;
        state.FFT.activePlayer = activePlayer;

        SetupCard(state.FFT.nations[activePlayer] + " " + currentPhase + " Phase","Turn " + turn,state.FFT.nations[activePlayer]);

        if (currentPhase === "Artillery") {
            //remove green markers for artillery QCs
            //remove yellow suppression markers if appropr turn
            _.each(UnitArray,unit => {
                unit.token.set(SM.green,false); //marker for artillery QCs
                unit.token.set(SM.unavail,false); //marker for avail 
                unit.token.set(SM.fired,false);
                //artillery
                if (unit.player !== activePlayer) {
                    unit.token.set(SM.suppressed,false);
                }
            })
            //check for available artillery
            ArtilleryAvailability(activePlayer);
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


        }

        if (currentPhase === "Movement") {
            _.each(UnitArray,unit => {
                if (unit.token.get(SM.fired) === false && unit.token.get(SM.unavail) === false) {
                    //if fired in art phase cant move
                    unit.token.set("aura1_color","#00ff00");
                }
                unit.token.set(SM.green,false); //art QC checks
            })
        }



        if (currentPhase === "Firing") {
            _.each(UnitArray,unit => {
                if (unit.token.get("aura1_color") === "#000000") {
                    unit.token.set("aura1_color","#00ff00");
                }
            })
        }





        if (currentPhase === "End") {

            //qchecks
            //allowing players to do it
            qcUnits = [];
            _.each(UnitArray,unit => {
                if (unit.token.get(SM.qc)) {
                    qcUnits.push(unit);
                }
                if (unit.token.get(SM.fired) === false && unit.token.get(SM.move) === false && unit.token.get(SM.double) === false) {
                    //sets overwatch
                    unit.token.set("aura1_color","#ff00ff");
                }
            })
            if (qcUnits.length > 0) {
                ButtonInfo("Start Quality Checks","!RunQC");
            } else {
                outputCard.body.push("No Quality Checks, can Advance to next Player");
            }
        }

        PrintCard();











    }

    const TokenInfo = (msg) => {
        if (!msg.selected) {return};
        let id = msg.selected[0]._id;
        let unit = UnitArray[id];
        if (!unit) {return};
        SetupCard(unit.name,"",unit.nation);
        let hex = HexMap[unit.hexLabel];
        let terInfo = TerrainInfo[hex.terrain];
        outputCard.body.push("Hex: " + unit.hexLabel);
        outputCard.body.push("Terrain: " + hex.terrain);
        outputCard.body.push("Elevation: " + hex.elevation);
        let keys = Object.keys(hex.moveCosts);
        let line = "Move Costs: ";
        let arr = []
        _.each(keys,key => {
            arr.push(Capitalize(key) + ": " + hex.moveCosts[key]);
        })
        line += arr.toString();
        outputCard.body.push(line);
        outputCard.body.push("Cover: " + hex.cover);

        for (let i=0;i<6;i++) {
            let edge = hex.edges[DIRECTIONS[i]];
            if (edge !== "Open") {
                outputCard.body.push(edge.name + " on " + DIRECTIONS[i] + " Edge");
            }
        }

        
        PrintCard();
    }


    const QualityCheck = (unit) => {
log(unit.name)
        let passed = true;
        let unitHex = HexMap[unit.hexLabel];
        let formation = FormationArray[unit.formationID];
        if (!formation) {
            sendChat("",unit.name + " - has no formation in data");
            return false;
        }
        let cohesion = formation.hq || false;
log("Cohesion: " + cohesion)
        let cohRange = (unit.quality === "Fair") ? 2:(unit.quality === "Good") ? 4:6;
log("Coh Range: " + cohRange)
        if (cohesion === false) {
            for (let i=0;i<formation.tokenIDs.length;i++) {
                let unit2 = UnitArray[formation.tokenIDs[i]];
                if (!unit2 || unit2.id === unit.id) {continue};
                let dist = unitHex.cube.distance(HexMap[unit2.hexLabel].cube);
                if (dist <= cohRange) {
log(unit2.name + " is in cohesion")
                    cohesion = true;
                    break;
                }
            }
        }
        let qualityRoll = randomInteger(6);
        let target = unit.quality.replace(/[^\d]/g,"");

        let tip = "<br>Roll: " + qualityRoll;
        if (cohesion === false) {
            qualityRoll = Math.max(qualityRoll - 1, 1);
            tip += "<br>Cohesion -1";
        } 
        let mods = 0;
        if (ArmourTypes.includes(unit.type) === false && unit.token.get(SM.qc) > 1) {
            mods = unit.token.get(SM.qc) - 1;
        }
        if (mods > 0 && ArmourTypes.includes(unit.type) === false) {
            tip += "<br>Extra QC Markers -" + mods;
            qualityRoll = Math.max(qualityRoll - mods,1);
        } 
        if (cohesion === true && mods === 0) {
            tip += "<br>No Modifications";
        }
        tip = "Result: " + qualityRoll + " vs. " + target + "+" + tip;
        if (qualityRoll >= target) {
            tip = '[Passes](#" class="showtip" title="' + tip + ')';
        } else {
            tip = '[Fails](#" class="showtip" title="' + tip + ')';
            passed = false;
//remove unit
        }

        if (unit && unit.token) {
            unit.token.set(SM.qc,false);
        }
        let result = {
            pass: passed,
            tip: tip,
        }
        return result;
    }


    const ArtilleryAvailability = (player) => {
        artUnits = [];
        let avail = [];
        let unavail = [];
        _.each(UnitArray,unit => {
            if (unit.player === player) {
                if (unit.type === "Artillery" || unit.type === "Mortar" || unit.type === "Aircraft") {
                    let availRoll = randomInteger(6);
                    let target = unit.avail;
                    let tipmods = "";
                    let offboard = HexMap[unit.hexLabel].offboard;
                    if (offboard === false && target > 1) {
                        target--;
                        tipmods += "<br>On Board Artillery +1";
                    }
                    if (unit.token.get(SM.suppressed) === true) {
                        target++
                        tipmods += "<br>Suppressed -1";
                    }            
                    
                    tip = "Roll: " + availRoll + " vs. " + target + "+" + tipmods;


                    tip = '[🎲 ](#" class="showtip" title="' + tip + ')';
                    if (availRoll >= target) {
                        artUnits.push(unit);
                        avail.push(tip + unit.name + " is Available");
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
                        unit.token.set("aura1_color","#000000");
                    }
                }
            }
        })
        if (avail.length > 0) {
            outputCard.body.push("Available Artillery");
            for (let i=0;i<avail.length;i++) {
                outputCard.body.push(avail[i]);
            }
            if (unavail.length > 0) {
                outputCard.body.push("[hr]");
            }
        }
        if (avail.length === 0) {
            outputCard.body.push("There is no Available Artillery");
        }
        if (unavail.length > 0) {
            for (let i=0;i<unavail.length;i++) {
                outputCard.body.push(unavail[i]);
            }
        }
    }

    const CallArtillery = (msg) => {
        let spotterID = msg.selected[0]._id;
        let spotter = UnitArray[spotterID];
        SetupCard(spotter.name,"Call Artillery",spotter.nation);
        if (state.FFT.phase !== "Artillery") {
            outputCard.body.push("Not the Artillery Phase");
        } else if (artUnits.length === 0) {
            outputCard.body.push("There is no Available Artillery or Airstrikes");
        } else {
            for (let i=0;i<artUnits.length;i++) {
                let artUnit = artUnits[i];
                let pt2 = ";?{Type|HE|Smoke}";
                if (artUnit.type === "Aircraft") {
                    pt2 = ";HE";
                }
                ButtonInfo(artUnit.name,"!Artillery;" + spotterID + ";" + artUnit.id + pt2);
            }
        }
        PrintCard();
    }


    const CheckArtillery = () => {
        let player = state.FFT.activePlayer;
        let nation = state.FFT.nations[player];
        SetupCard("Available Artillery","",nation);
        _.each(artUnits,unit => {
            outputCard.body.push(unit.name);
        })
        if (artUnits.length === 0) {
            outputCard.body.push("No Artillery/Air Available");
        }
        PrintCard();
    }




    const DrawLine = (hex1,hex2) => {
        let x1 = hex1.centre.x;
        let x2 = hex2.centre.x;
        let y1 = hex1.centre.y;
        let y2 = hex2.centre.y;

        let x = (x1+x2)/2;
        let y = (y1+y2)/2;

        x1 = x - x1;
        x2 = x - x2;
        y1 = y - y1;
        y2 = y - y2;

        let pts = [[x1,y1],[x2,y2]];
        

        let page = getObj('page',Campaign().get('playerpageid'));
        let newLine = createObj('pathv2',{
            layer: "foreground",
            pageid: page.id,
            shape: "pol",
            stroke: '#000000',
            stroke_width: 3,
            fill: '#000000',
            x: x,
            y: y,
            points: JSON.stringify(pts),
        });

        
    }

    const RemoveLines = () => {
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "pathv2",layer: "foreground",});
        _.each(paths,path => {
            path.remove();
        })
    }


    const RollDice = (msg) => {
        PlaySound("Dice");
        let roll = randomInteger(8);
        let playerID = msg.playerid;
        let id,unit,player;
        if (msg.selected) {
            id = msg.selected[0]._id;
        }
        let nation = "Neutral";

        if (!id && !playerID) {
            log("Back")
            return;
        }
        if (id) {
            unit = UnitArray[id];
            if (unit) {
                nation = unit.nation;
                player = unit.player;
            }
        }
        if ((!id || !unit) && playerID) {
            nation = state.FFT.players[playerID];
            player = (state.FFT.nations[0] === nation) ? 0:1;
        }

        if (!state.FFT.players[playerID] || state.FFT.players[playerID] === undefined) {
            if (nation !== "Neutral") {    
                state.FFT.players[playerID] = nation;
            } else {
                sendChat("","Click on one of your tokens then select Roll again");
                return;
            }
        } 
        let res = "/direct " + DisplayDice(roll,nation,40);
        sendChat("player|" + playerID,res);
    }


    const PlaceArtToken = (spotterID, artilleryID,type) => {
        let spotter = UnitArray[spotterID];
        let artilleryUnit = UnitArray[artilleryID];
        let radius = (artilleryUnit.artsize - 1) * 100;
        let img = getCleanImgSrc("https://files.d20.io/images/105823565/P035DS5yk74ij8TxLPU8BQ/thumb.png?1582679991");
        let name = artilleryUnit.name + " Target";
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
            left: spotter.token.get("left"),
            top: spotter.token.get("top"),
            width: 80,
            height: 80, 
            pageid: Campaign().get("playerpageid"),
            imgsrc: img,
            layer: "objects",
            represents: charID,
            tooltip: name,
            show_tooltip: true,
            name: name,
            showname: true,
            disableTokenMenu: true,
            showplayers_aura1: true,
            aura1_color: "#ffff00",
            aura1_radius: radius,
            gmn: "TargetIcon",
        })
        //redo ability
        let abilArray = findObjs({_type: "ability", _characterid: charID});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 
        
        let abilityName = (type === "HE") ? "Fire for Effect":"Drop Smoke";
        let action = "!ArtilleryTwo;" + newToken.get("id") + ";" + spotterID + ";" + artilleryID + ";" + type
        AddAbility(abilityName,action,charID);
        toFront(newToken);

        let target = new Unit(newToken.get("id"));



    }

    const Artillery = (msg) => {
        //places target icon on spotter, to be moved and activated
        let Tag = msg.content.split(";");
        let spotterID = Tag[1];
        let artilleryID = Tag[2];
        let type = Tag[3];
        PlaceArtToken(spotterID,artilleryID,type);
    }





    const ArtilleryTwo = (msg) => {
        let Tag = msg.content.split(";");
        let targetID = Tag[1];
        let target = UnitArray[targetID];
        let spotterID = Tag[2];
        let spotter = UnitArray[spotterID];
        let artilleryID = Tag[3];
        let artillery = UnitArray[artilleryID];
        let type = Tag[4];
        let subtitle = (type === "HE") ? "Fire for Effect":"Smoke";
        SetupCard(artillery.name,subtitle,spotter.nation);
        //check LOS and Range
        let losResult = LOS(spotter,target);
        let distance = HexMap[artillery.hexLabel].cube.distance(HexMap[target.hexLabel].cube);
        if (distance > artillery.artrange) {
            outputCard.body.push("Out of Range of Artillery Unit");
        } else if (losResult.los === false) {
            outputCard.body.push("No LOS to Target"); 
        } else {
            let radius = artillery.artsize - 1;
            let hexLabels = [target.hexLabel];
            if (radius > 0) {
                let cubes = HexMap[target.hexLabel].cube.radius(radius);       
                _.each(cubes,cube => {
                    hexLabels.push(cube.label());
                })
            }
            hexLabels = [...new Set(hexLabels)];

            //Sound
            let sound = "Howitzer";
            if (artillery.type === "Mortar") {sound = "Mortar"};
            if (artillery.name.includes("Katyusha")) {sound = "Katyusha"};
            if (artillery.type === "Aircraft") {sound = "Bomb"};
            PlaySound(sound);

            const CreateExplosion = (x,y)=>{
                spawnFx(x,y,"bomb-smoke");
            };

            let numExplosions = 3 * hexLabels.length;

            const ChainExplosions = () => {
                if(numExplosions--){
                    let hexLabel = hexLabels[randomInteger(hexLabels.length) - 1];
                    CreateExplosion(HexMap[hexLabel].centre.x,HexMap[hexLabel].centre.y);
                    setTimeout(ChainExplosions,250);
                }
            };

            ChainExplosions();

            target.token.remove();
            delete UnitArray[target.id];
            if (type === "Smoke") {
                PlaceSmoke(artillery,hexLabels);
            } else if (type === "HE") {
                HE(artillery,hexLabels);
            }
            artillery.token.set(SM.fired,true);
            artillery.token.set("aura1_color","#000000");
            let index = artUnits.map(e => e.id).indexOf(artilleryID);
            artUnits.splice(index,1);
        }
        PrintCard();
    }

    const PlaceSmoke = (artillery,hexLabels) => {
        let img = getCleanImgSrc("https://files.d20.io/images/196609276/u8gp3vcjYAunqphuw6tgWw/thumb.png?1611938031");
        _.each(hexLabels,hexLabel => {
            let left = HexMap[hexLabel].centre.x;
            let top = HexMap[hexLabel].centre.y;
            let newToken = createObj("graphic", {
                left: left,
                top: top,
                width: 80,
                height: 80, 
                pageid: Campaign().get("playerpageid"),
                imgsrc: img,
                layer: "foreground",
                name: artillery.player + "Smoke",
            });
            HexMap[hexLabel].smoke = newToken.id;
            HexMap[hexLabel].smokePlayer = artillery.player;
        })
    }

    const HE = (artillery,hexLabels) => {
        _.each(UnitArray,unit => {{
            if (hexLabels.includes(unit.hexLabel)) {
                let hex = HexMap[unit.hexLabel];
log(unit.name)
log(hex)
                let artRoll = randomInteger(6);
                let artEffect = artillery.arteffect;
                let bonus = 0;
                if (artEffect === "+1") {
                    bonus = 1;
                } else if (artEffect === "+1 vs Armour" && ArmourTypes.includes(unit.type)) {
                    bonus = 1;
                } 
                let result = artRoll + bonus;
                let tip = "Result: " + result + " vs. 4+";
                tip += "<br>Roll: " + artRoll;
                if (bonus !== 0) {
                    tip += "<br>Bonus: " + artEffect;
                }
log(result)
                if (result > 3) {
                    tip = '[Hit](#" class="showtip" title="' + tip + ')';
                    
                    if (result >= 6) {
                        if (hex.cover > 0 || ArmourTypes.includes(unit.type)) {
                            if (unit.token.get(SM.green) === false) {
                                unit.token.set(SM.green, true);
                                unit.token.set(SM.suppressed,true);
                                let qc = QualityCheck(unit);
                                let noun = (qc.pass === true) ? "Suppressed":"Destroyed";
                                outputCard.body.push(unit.name + ' is ' + tip + ' and ' + qc.tip + ' its QC and is ' + noun);
                            } else {
                                unit.token.set(SM.suppressed,true);
                                outputCard.body.push(unit.name + ' is ' + tip + ' and Suppressed');
                            }         
                        } else {
                            outputCard.body.push(unit.name + ' is ' + tip + ' and Destroyed');
//destroy unit
                        }
                    } else {
                        if (hex.cover === 0 && ArmourTypes.includes(unit.type) === false && unit.token.get(SM.green) === false) {
                            unit.token.set(SM.green,true);
                            let qc = QualityCheck(unit);
                            let noun = (qc.pass === true) ? "Suppressed":"Destroyed";
                            outputCard.body.push(unit.name + ' is ' + tip + ' and ' + qc.tip + ' its QC and is ' + noun);
                        } else {
                            outputCard.body.push(unit.name + ' is ' + tip + ' and Suppressed');
                            unit.token.set(SM.suppressed,true);
                        }
                    }
                } else {
                    tip = '[Missed](#" class="showtip" title="' + tip + ')';
                    outputCard.body.push(unit.name + " is " + tip);
                }
            }
        }})




    }




    const RunQC = () => {
log(qcUnits)
        let unit = qcUnits.shift();
log(unit)
        if (unit) {
            sendPing(unit.token.get("left"),unit.token.get("top"),Campaign().get("playerpageid"),null,true);
            SetupCard(unit.name,"Quality Check",unit.nation);
            ButtonInfo("Make Quality Check","!TakeQC;" + unit.id);
            PrintCard();
        } else {
            AdvancePhase();
        }
    }

    const TakeQC = (msg) => {
        let id = msg.content.split(";")[1];
        let unit = UnitArray[id];
        SetupCard(unit.name,"Quality Check",unit.nation);
        qc = QualityCheck(unit);
        let noun = (qc.pass === true) ? "Suppressed":"Destroyed";
        outputCard.body.push(unit.name + " " + qc.tip + ' its QC and is ' + noun);
        let phrase = "Next Unit";
        if (qcUnits.length === 0) {
            phrase = "Next Phase";
        }
        ButtonInfo(phrase,"!RunQC")
        PrintCard();
    }












    const ClearState = (msg) => {
        LoadPage();
        BuildMap();

        //clear arrays
        UnitArray = {};
        FormationArray = {};
        //clear token info
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        })
        tokens.forEach((token) => {
            if (token.get("name").includes("Objective") === true) {return};
            token.set({
                name: "",
                tint_color: "transparent",
                aura1_color: "transparent",
                aura1_radius: 0,
                showplayers_bar1: false,
                showplayers_bar2: false,
                showplayers_bar3: false,
                showname: true,
                showplayers_aura1: true,
                gmnotes: "",
                statusmarkers: "",
                tooltip: "",
            });                
        });
    
        RemoveDead("All");

        state.FFT = {
            playerIDs: ["",""],
            players: {},
            nations: ["",""],
            formNum: [0,0],
            formationInfo: {},
            lines: [],
            turn: 0,
            phase: "",
            activePlayer: 0,
            firstPlayer: 0,
        }



        sendChat("","Cleared State/Arrays");
    }


    const RemoveDepLines = () => {
        for (let i=0;i<state.FFT.deployLines.length;i++) {
            let id = state.FFT.deployLines[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
    }

    const RemoveDead = (info) => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "map",
        });
        tokens.forEach((token) => {
            if (token.get("status_dead") === true) {
                token.remove();
            }
            let removals = ["Objective","Turn"];
            for (let i=0;i<removals.length;i++) {
                if (token.get("name").includes(removals[i]) && info === "All") {
                    token.remove();
                }
            }
        });
    }

    const DefineFormation = (msg) => {
        if (!msg.selected) {
            sendChat("","No Tokens Selected");
            return
        }
        let Tag = msg.content.split(";");
        let formationName = Tag[1];
        let breakpoint = Tag[2];
        let hq = (Tag[3] === "HQ/Recon") ? true:false;

        let unit;
        let unitNames = {};
        let unitNumbers = [" 1st "," 2nd "," 3rd "," 4th "," 5th "," 6th "," 7th "," 8th "," 9th "," 10th "];
        let unit1 = new Unit(msg.selected[0]._id);
        let formation = new Formation(formationName,unit1.id);
        formation.hq = hq;
        formation.breakpoint = breakpoint;
        state.FFT.formationInfo[formation.id].breakpoint = breakpoint;
        state.FFT.formationInfo[formation.id].hq = hq;
        let number = state.FFT.formNum[formation.player];
        state.FFT.formNum[formation.player]++;

        for (let i=0;i<msg.selected.length;i++) {
            mID = msg.selected[i]._id;
            unit = new Unit(mID);
            formation.AddUnit(mID);
            unit.token.set({
                tint_color: "transparent",
                gmnotes: formation.id,
                tint_color: "transparent",
                aura1_color: "#00ff00",
                aura1_radius: 10,
                disableTokenMenu: true,
                showname: true,
                showplayers_aura1: true,
                statusmarkers: "",
                tooltip: formation.name,
                show_tooltip: true,
            })
        }

        _.each(formation.tokenIDs, tID => {
            let unit = UnitArray[tID];
            let name = unit.charName;
            let type = "Plt";
            if (name.includes("Company")) {type = "Co"};
            let sname = name.replace(/ Platoon| Company/,"");
            if (unit.type === "Truck" || unit.type === "Halftrack") {
                name = sname;
            } else {
                if (!unitNames[sname]) {
                    name = sname + " 1st " + type;
                    unitNames[sname] = 1;
                } else {
                    name = sname + unitNumbers[unitNames[sname]] + type;
                    unitNames[sname] += 1;
                }
            }
            unit.name = name;
            unit.token.set("name",name);
        })





        sendChat("",formation.name + " Added")
    }











    //line line collision where line1 is pt1 and 2, line2 is pt 3 and 4
    const lineLine = (pt1,pt2,pt3,pt4) => {
        //calculate the direction of the lines
        uA = ( ((pt4.x-pt3.x)*(pt1.y-pt3.y)) - ((pt4.y-pt3.y)*(pt1.x-pt3.x)) ) / ( ((pt4.y-pt3.y)*(pt2.x-pt1.x)) - ((pt4.x-pt3.x)*(pt2.y-pt1.y)) );
        uB = ( ((pt2.x-pt1.x)*(pt1.y-pt3.y)) - ((pt2.y-pt1.y)*(pt1.x-pt3.x)) ) / ( ((pt4.y-pt3.y)*(pt2.x-pt1.x)) - ((pt4.x-pt3.x)*(pt2.y-pt1.y)) );
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            intersection = {
                x: (pt1.x + (uA * (pt2.x-pt1.x))),
                y: (pt1.y + (uA * (pt2.y-pt1.y)))
            }
            return intersection;
        }
        return;
    }
   


    const TargetAngle = (shooter,target) => {
        let shooterHex = HexMap[shooter.hexLabel];
        let targetHex = HexMap[target.hexLabel];
        //angle from shooter's hex to target's hex
        let phi = Angle(shooterHex.cube.angle(targetHex.cube));
        let theta = Angle(shooter.token.get("rotation"));
        let gamma = Angle(phi - theta);
        return gamma;
    }




    const CheckLOS = (msg) => {
        let Tag = msg.content.split(";");
        let shooterID = Tag[1];
        let targetID = Tag[2];
        let shooter = UnitArray[shooterID];
        let coverLevels = ["No","Light","Heavy"];

        if (!shooter) {
            sendChat("","Not valid shooter");
            return;
        }
        let target = UnitArray[targetID];
        if (!target) {
            sendChat("","Not valid target");
            return;
        }

        SetupCard(shooter.name,"LOS",shooter.nation);
        let losResult = LOS(shooter,target);
        outputCard.body.push("Distance: " + losResult.distance);
        if (losResult.los === false) {
            outputCard.body.push("[#ff0000]No LOS to Target[/#]");
            outputCard.body.push(losResult.losReason);
        } else {
            outputCard.body.push("Shooter has LOS to Target");
            outputCard.body.push("Target has " + coverLevels[losResult.cover] + " Cover");
            outputCard.body.push("Target is in the " + losResult.shooterFacing + " Arc");
            outputCard.body.push("Target is being hit on the " + losResult.targetFacing + " Arc");

            let bands = ["in Short","in Effective","in Long","Out of"];
            let final = 3;
            for (let band = 0;band < 3;band++) {
                if (losResult.distance <= shooter.range[band]) {
                    final = band;
                    break;
                }
            }
            outputCard.body.push("Target is " + bands[final] + " Range");



        }



        PrintCard();
    }


    const LOS = (shooter,target) => {
        let los = true;
        let losReason = "";
        let losBlock = "";
        let cover = 0;
        
        let shooterHex = HexMap[shooter.hexLabel];
        let targetHex = HexMap[target.hexLabel];
        let distance = shooterHex.cube.distance(targetHex.cube);
        
        //firing arc on weapon
        let angle = TargetAngle(shooter,target);
        let angleT = TargetAngle(target,shooter);
        let shooterFacing = (angle <= 60 || angle >= 300) ? "Front":"Side/Rear";
        let targetFacing = (angleT <= 60 || angleT >= 300) ? "Front":"Side/Rear";

        //check lines
        let pt1 = new Point(0,shooterHex.elevation);
        let pt2 = new Point(distance,targetHex.elevation);
//log("Shooter E: " + shooterHex.elevation);
//log("Target E: " + targetHex.elevation);

        let interCubes = shooterHex.cube.linedraw(targetHex.cube)
        for (let i=0;i<interCubes.length - 1;i++) {
            let label = interCubes[i].label();
//log(label)
            let interHex = HexMap[label];
            if (interHex.smoke !== "") {
                los = false;
                losBlock = label;
                losReason = "Blocked by Smoke at " + label;
                break;
            }
            if (interHex.cover === 0) {continue};
            let teH = interHex.height; //terrain in hex
            let edH = 0; //height of any terrain on edge crossed
            let iH = Math.max(teH,edH);
            interHexHeight = iH + interHex.elevation;
//log("Total Height: " + interHexHeight)
            let pt3 = new Point(i,0);
            let pt4 = new Point(i,interHexHeight);
            if (lineLine(pt1,pt2,pt3,pt4)) {
                los = false;
                losBlock = label;
                losReason = "Blocked by " +  interHex.terrain +" at " + label;
                break;
            }
        }

        //target hex
        cover = targetHex.cover;

        let result = {
            los: los,
            losReason: losReason,
            losBlock: losBlock,
            distance: distance,
            cover: cover,
            shooterFacing: shooterFacing,
            targetFacing: targetFacing,
        }

        return result;
    }




    const LocationChange = (tok,prev) => {
        let distance = 0;
        let newHex = HexMap[(new Point(tok.get("left"),tok.get("top"))).label()];
        if (newHex.tokenIDs.includes(tok.id) === false) {
            newHex.tokenIDs.push(tok.id);
        }
        let unit = UnitArray[tok.get("id")];
        if (unit) {
            unit.hexLabel = newHex.label;
        }
        let prevHex = HexMap[(new Point(prev.left,prev.top)).label()];
        if (prevHex.tokenIDs.includes(tok.id)) {
            prevHex.tokenIDs.splice(prevHex.tokenIDs.indexOf(tok.id),1);
        }
        distance = newHex.cube.distance(prevHex.cube);
        let info = {
            newHex: newHex,
            prevHex: prevHex,
            distance: distance,
        }
        return info;
    }




    const changeGraphic = (tok,prev) => {
        //RemoveLines();
        let unit = UnitArray[tok.id];
        if (unit) {
            let label = (new Point(tok.get("left"),tok.get("top"))).label();
            if (label !== unit.hexLabel || tok.get("rotation") !== prev.rotation) {
                if (state.FFT.turn > 0 && tok.get("name").includes("Target") === false) {
                    let bounceBack = false
                    if ((state.FFT.phase === "Movement" && tok.get("aura1_color") === "#000000") || state.FFT.phase !== "Movement") {
                        bounceBack = true;
                    }
                    if (bounceBack === true) {
                        tok.set("left",prev.left);
                        tok.set("top",prev.top);
                        tok.set("rotation",prev.rotation);
                        sendChat("","Not Able to Move");
                        return;
                    }
                }


                log(unit.name + ' is moving from ' + unit.hexLabel + ' to ' + label)
                let index = HexMap[unit.hexLabel].tokenIDs.indexOf(unit.id);
                if (index > -1) {
                    HexMap[unit.hexLabel].tokenIDs.splice(index,1);
                }
                HexMap[label].tokenIDs.push(unit.id);
                unit.hexLabel = label;
                unit.token.set({
                    left: HexMap[label].centre.x,
                    top: HexMap[label].centre.y,
                })
            }
        }



    }







    const addGraphic = (obj) => {
        log(obj)
        RemoveLines();




    }
    
    const destroyGraphic = (obj) => {
        let name = obj.get("name");
        log(name + " Destroyed")
        if (UnitArray[obj.get("id")]) {
            delete UnitArray[obj.get("id")];
        }


    }






    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        let args = msg.content.split(";");
        log(args);
    
        switch(args[0]) {
            case '!Dump':
                log("State");
                log(state.FFT);
                log("Units");
                log(UnitArray);
                log("Formations");
                log(FormationArray)
                break;
            case '!ClearState':
                ClearState(msg);
                break;
            case '!AddAbilities':
                AddAbilities(msg);
                break;
            case '!AdvancePhase':
                AdvancePhase();
                break;
            case '!SetupGame':
                SetupGame(msg);
                break;

            case '!TokenInfo':
                TokenInfo(msg);
                break;
            case '!CheckLOS':
                CheckLOS(msg);
                break;
            case '!RemoveLines':
                RemoveLines();
                break;
            case '!DefineFormation':
                DefineFormation(msg);
                break;
            case '!Roll':
                RollDice(msg);
                break;

            case '!CallArtillery':
                CallArtillery(msg);
                break;
            case '!Artillery':
                Artillery(msg);
                break;
            case '!ArtilleryTwo':
                ArtilleryTwo(msg);
                break;
            case '!RunQC':
                RunQC();
                break;
            case '!TakeQC':
                TakeQC(msg);
                break;
            case '!CheckArtillery':
                CheckArtillery();
                break;
            case '!DirectFire':
                DirectFire(msg);
                break;
        }
    };




    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        on("add:graphic", addGraphic);
        on('change:graphic',changeGraphic);
        on('destroy:graphic',destroyGraphic);
    };
    on('ready', () => {
        log("===>Fistful of T34s<===");
        log("===> Software Version: " + version + " <===")
        LoadPage();
        DefineHexInfo();
        BuildMap();
        registerEventHandlers();
        sendChat("","API Ready")
        log("On Ready Done")
    });
    return {
        // Public interface here
    };






})();


