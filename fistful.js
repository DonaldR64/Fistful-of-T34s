const FFT = (() => {
    const version = '2026.2.16';
    if (!state.FFT) {state.FFT = {}};

    const pageInfo = {};
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC","BD","BE","BF","BG","BH","BI"];


    const MoveMarkers = ["https://files.d20.io/images/344441274/R0eEVMFzhYmwv6rigIA7GA/thumb.png?1685718541","https://s3.amazonaws.com/files.d20.io/images/435360245/m3tKJi3Pqb_40g75O6ouSg/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360246/pXI3HBrGMZ05ldDfH-zYCQ/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360229/JKMY922qxhf0E3z1l10jQg/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360228/YDGEQNR_qVFprdHJSjYNPg/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360232/1TysQcieJ5zbgYvXV4pqiA/thumb.png?1743563857","https://s3.amazonaws.com/files.d20.io/images/435360240/KfCmoF5WyWTStCWOTPrkJg/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360230/zjvzMFGWotZUORDeIVXrEw/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360226/-TXBFvMfahwOIjXEuS0mTQ/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360237/gEr7oP4z0ByUKTXpvSHYQQ/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360241/2HAnTYlC0uVR6mqyMoaACA/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360244/CDOLr8RkQ-pPhwjaOHTbEA/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360243/023KSjjB8QHtrMNbuO3ENQ/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360242/xx2msq4HjqRN5dUaPl0vfA/thumb.png?1743563857","https://s3.amazonaws.com/files.d20.io/images/435360236/L-iuGURhzreq2t2mKOj3Qg/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360247/v2Y15K10F2qZK268wPzYyw/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360239/SXny1fVCh5PeYxLGtnoPTA/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360233/EdB3z27csNyykkc2lWTefw/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360227/JpFvEVLKlKV6n6JsE8zrVg/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360234/5b2XrhzPgfgjdoI5y97LnQ/thumb.png?174356385","https://s3.amazonaws.com/files.d20.io/images/435360238/_sWU7YtYJsWT1NZC-wb80Q/thumb.png?1743563857","https://s3.amazonaws.com/files.d20.io/images/435360231/n7HVTuMwWch59Aofq1v96w/thumb.png?1743563856","https://s3.amazonaws.com/files.d20.io/images/435360235/yVtSNUPJOkxq0n2_FknMcA/thumb.png?1743563856"];

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
    let CompanyArray = {};
    let qcUnits = [];
    let qcFormations = [];
    let artUnits = [];
    let activePlayer = state.FFT.activePlayer || 0;
    let currentPhase = state.FFT.phase || "Deployment";
    let nextPhase = "";
    let MapAreas = {};
    let areaFire = {};
    let areaFireList = [];

    let outputCard = {title: "",subtitle: "",side: "",body: [],buttons: [],};

    const companyMarkers = [1,51,101,151,201,251];
    const companyMarkerNumbers = [5982118,5982169,5982220,5982270,5982320,5982371];

    const Doctrines = {
        "Red Army": "Soviet",
        "Wermacht": "Western",
    }

    const Nations = {
        "Red Army": {
            "image": "",
            "backgroundColour": "#ff0000",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#ff0000",
            "borderStyle": "5px groove",
            "hq": "Soviet::6433738",
            "response": 3,
            "artAccuracy": 5.
        },
        "Wermacht": {
            "image": "",
            "backgroundColour": "#ffffff",
            "titlefont": "Bokor",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px double",
            "hq": "Iron-Cross::7650254",
            "response": 3,
            "artAccuracy": 5,
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
        suppA: "status_brown",
        suppB: "status_yellow",
        qc: "status_red",
        fired: "status_Shell::5553215",
        move: "status_Advantage-or-Up::2006462",
        double: "status_Fast::5868456",
        unavail: "status_oneshot::5503748",
        down: "status_Disadvantage-or-Down::2006464",
        passed: "status_green",
        flag: "status_Red_Flag::5610550",
        full: "status_Cover-Full::2006474",



    }

    const areaColours = {
        "#000000": "Wermacht",
        "#ff0000": "Red Army"


    }



    //height is height of terrain element
    //movecosts
    //cover for  fire - 0 = None, 1 = Light (5+), 2 = Heavy (4+)

    const LinearTerrain = {




    }

    const Capit = (val) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const RoadCosts = {leg: 1,tracked: .5, wheeled: .25, halftrack: .5};

    const TerrainInfo = {
        "Heavy Woods": {name: "Heavy Woods",height: 1, moveCosts: {leg: 1, tracked: 2, wheeled: 2, halftrack: 2, towed: 2}, cover: 1},
        "Town": {name: "Town",height: 1, moveCosts: {leg: 1, tracked: 2, wheeled: 2, halftrack: 2, towed: 2}, cover: 2},
        "River": {name: "River",height: 0, moveCosts: {leg: -1, tracked:-1, wheeled: -1, halftrack: -1, towed: -1}, cover: 0,},
        "Craters": {name: "Craters",height: 0, moveCosts: {leg: 1, tracked:2, wheeled: 3, halftrack: 3,towed: 2}, cover: 0,},
        "Wrecks": {name: "Wrecks",height: 0, moveCosts: {leg: 1, tracked:2, wheeled: 3, halftrack: 3,towed: 2}, cover: 0,},
        "Water": {name: "Water",height: 0, moveCosts: {leg: -1, tracked:-1, wheeled: -1, halftrack: -1,towed: -1}, cover: 0,},



    }

    const HillHeights = {
        "#434343": 1,
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

        spiralToCube(index) {
            if (index === 0) {
                return this;
            } else {
                let radius = (index === 0) ? 0:Math.floor((Math.sqrt(12 * index - 3) + 3) / 6);
    log("Radius: " + radius)
                let startIndex = (radius === 0) ? 0: 1 + 3 * radius * (radius - 1);
    log("startIndex: " + startIndex)
                let ring = this.ring(radius);
    log(ring)
                let pos = index - startIndex;
    log(pos)
                return ring[pos];
            }
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
            this.moveCosts = {leg: 1, tracked: 1, wheeled: 1, halftrack: 1, towed: 1};
            this.cover = 0;
            this.road = false;
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
  
            this.charName = char.get("name");
            let name = token.get("name");
            if (!name || name === "") {
                name = this.charName;
            }
            this.name = name;

            this.id = id;
            this.charID = charID;
            this.hexLabel = label;
            this.startHexLabel = label;
            this.startRotation = token.get("rotation");
            this.special = aa.special || " ";

            this.nation = aa.nation || "Neutral";
            if (state.FFT.nations[0] === "") {
                state.FFT.nations[0] = this.nation;
            } else if (state.FFT.nations[0] !== this.nation && state.FFT.nations[1] === "") {
                state.FFT.nations[1] = this.nation;
            }
            this.player = (this.nation === "Neutral") ? 2:(state.FFT.nations[0] === this.nation)? 0:1;
            this.type = aa.type;
            this.movement = parseInt(aa.movement) || 0;
            this.moveType = aa.movetype ? aa.movetype.toLowerCase(): "NA";

            this.special = aa.special || " ";

            this.armourF = (aa.armourF === "S" || aa.armourF === "-") ? aa.armourF:parseInt(aa.armourF);
            this.armourSR = (aa.armourSR === "S" || aa.armourSR === "-") ? aa.armourSR:parseInt(aa.armourSR);
            this.armourSpecial = aa.armourSpecial || "-";
            this.armoured = (this.armourF !== "S" && this.armourF !== "-" && this.armourSR !== "S" && this.armourSR !== "-") ? true:false;
            this.openTopped = (this.special.includes("Open-Topped") || this.special.includes("Open Topped")) ? true:false;

            this.artFlag = aa.artflag === "On" ? true:false;
            this.artName = aa.artname;
            let artRange = aa.artrange; //min - max or just max
            if (artRange && artRange.includes("-")) {
                artRange = artRange.split("-").map((e) => parseInt(e));
            } else {
                artRange = [0,parseInt(artRange)];
            }
            this.artRange = artRange;

            let artType = aa.arttype;
            if (artType) {artType = artType.replace(" Artillery","")};
            this.artType = artType; //will be changed to Battalion if added to combat formation

            this.artCalibre = aa.artcalibre;
            this.mrls = (this.special.includes("MRLS")) ? true:false;

            this.shellTypes = aa.artshelltypes || "HE";



            let weapons = [];
            for (let i=1;i<3;i++) {
                let flag = aa["weapon" + i + "flag"];
                if (flag === "Off" || !flag) {continue};
                let name = aa["wpn" + i + "name"];
                if (!name) {continue};
                let rof = aa["wpn" + i + "rof"] || 0;
                let range = aa["wpn" + i + "range"] || "0/0/0/0";
                let pen = aa["wpn" + i + "pen"] || "-";
                let ai = aa["wpn" + i + "ai"] || "-";
                //range is array of [minimum,close,effective,long]
                if (range.includes("/")) {
                    range = range.split("/").map((e) => parseInt(e));
                    range.unshift(0); 
                } else if (range === "C") {
                    range = "C"
                } else if (range.includes("-")) {
                    //missiles will be eg. 1-40, so 40 is effective and long range, 1 is min which is in pos 3 of array
                    range = range.split("-").map((e) => parseInt(e));
                    range = [range[0],range[0],range[1],range[1]];
                } else {    
                    range = [0,0,parseInt(range),parseInt(range)]
                }
                weapons.push({
                    name: name,
                    rof: rof,
                    range: range,
                    pen: pen,
                    ai: ai,
                    fired: false,
                })
            }
            this.weapons = weapons;

            this.spotUses = 0;
            this.artQC = false;

            this.formationID = "";
            this.companyID = "";
            this.coverTest = false;
            this.CC = false;
            this.cohesion = (token.get("aura1_color") === "#ff0000") ? false:true;
log(this)

            this.token = token;
            


            UnitArray[id] = this;
            HexMap[label].tokenIDs.push(id);






        }



        Destroyed (note = "Nil") {
            let token = this.token;
            if (token) {
                if (note === "Wreck") {
                    token.set({
                        name: "Wrecks",
                        layer: "map",
                        statusmarkers: "",
                    })
                    let img = getCleanImgSrc("https://files.d20.io/images/444760310/hU74_47luSi2mkY1ejzjcQ/thumb.png?1749828980");
                    let newToken = createObj("graphic", {
                        left: token.get("left"),
                        top: token.get("top"),
                        width: 70,
                        height: 70, 
                        name: "BurningSmoke",
                        pageid: Campaign().get("playerpageid"),
                        imgsrc: img,
                        layer: "foreground",
                    })
                    let hex = HexMap[this.hexLabel];
                    hex.terrain += ", Wrecks";
                    let terrain = TerrainInfo["Wrecks"];
                    let costKeys = Object.keys(terrain.moveCosts);
                    _.each(costKeys,key => {
                        hex.moveCosts[key] = Math.max(hex.moveCosts[key],terrain.moveCosts[key]);
                        if (terrain.moveCosts[key] === -1) {
                            hex.moveCosts[key] = -1;
                            //impasssable
                        }
                    })
                    hex.cover = Math.max(hex.cover,terrain.cover);
                    HexMap[this.hexLabel] = hex;
                } else {
                    token.set("statusmarkers","");
                    token.set("status_dead",true);
                    token.set("layer","map");
                    toFront(token);
                }



            }
            let formation = FormationArray[this.formationID];
            if (formation) {
                formation.Casualty(this.id);
            }
            let company = CompanyArray[this.companyID];
            if (company) {
                company.Casualty(this.id);
            }
            delete UnitArray[this.id]
        }

        Distance = (unit2) => {
            let hex1 = HexMap[this.hexLabel];
            let hex2 = HexMap[unit2.hexLabel];
            let distance = hex1.cube.distance(hex2.cube);
            return distance;
        }

        SetOverwatch = (state) => {
            let colour = (state === true) ? "#ff00ff":"transparent";
            this.token.set("aura2_color",colour);
        }

        CheckOverwatch = () => {
            return (this.token.get("aura2_color") === "#ff00ff") ? true:false;
        }

        CheckCohesion = () => {
            if (this.token.get("aura1_color") === "#ff0000") {
                return false;
            } else {
                return true;
            }
        }




        CheckSuppression = () => {
            if (this.token.get(SM.suppA) === true || this.token.get(SM.suppB) === true) {
                return true;
            } else {return false};
        }

        Suppress = (type,flag) => {
            let marker = (type === "A") ? SM.suppA:SM.suppB;
            let otherMarker = (type === "A") ? SM.suppB:SM.suppA;
            if (flag === true) {
                //can only have one, set the other to false
                this.token.set(marker,true);
                this.token.set(otherMarker,false);
            } else {
                this.token.set(marker,false);
            }
        }









    }

    class Formation {
        constructor(name,uID,quality,fID = stringGen()) {
            let refUnit = UnitArray[uID];
            refUnit.formationID = fID;
            this.nation = refUnit.nation;
            this.player = refUnit.player || 0;
            this.casualties = 0;
            this.name = name;
            this.id = fID;
            this.tokenIDs = [uID];
            this.companyIDs = [];
            this.quality = quality;
            FormationArray[fID] = this;
            if (!state.FFT.formationInfo[fID]) {
                let info = {
                    name: name,
                    nation: this.nation,
                    player: this.player,
                    casualties: 0,
                    tokenIDs: this.tokenIDs,
                    quality: quality,
                }
                state.FFT.formationInfo[fID] = info;
            } else {
                let info = state.FFT.formationInfo[fID]
                this.casualties = info.casualties;
                this.breakpoint = info.breakpoint;
                this.type = info.type;
                this.artAvail = info.artAvail;
            }
        }

        AddCompany(cID) {
            if (this.companyIDs.includes(cID) === false) {
                this.companyIDs.push(cID);
            }
            CompanyArray[cID].formationID = this.id;
            CompanyArray[cID].quality = this.quality;
        }


        AddUnit(uID) {
            let unit = UnitArray[uID];
            if (this.tokenIDs.includes(uID) === false) {
                this.tokenIDs.push(uID);
            }
            unit.formationID = this.id;
            unit.quality = this.quality;
            if (this.type === "Combat" && unit.artFlag === true) {
                unit.artType = "Battalion";
            }
        }

        Casualty(uID) {
            let index = this.tokenIDs.indexOf(uID);
            if (index > -1) {
                this.tokenIDs.splice(index,1);
            }
            this.casualties++;
        }

    }


    class Company {
        constructor(name,cID = stringGen()) {
            this.id = cID;
            this.tokenIDs = [];
            this.formationID = "";
            this.name = name;
            this.quality = "-";
            this.hq = false;
            this.spotUses = 0;
            CompanyArray[cID] = this;
        }
        AddUnit(uID) {
            if (this.tokenIDs.includes(uID) === false) {
                this.tokenIDs.push(uID);
            }
            UnitArray[uID].companyID = this.id;
            this.player = UnitArray[uID].player;
        }
        Cohesion() {
            //checks cohesion, marks units not in cohesion
            if (this.hq === true) {return};
            //order units by distance from flag unit
            let units = this.tokenIDs.map((e) => UnitArray[e]);
            let ldr;
            _.each(units,unit => {
                let tok = unit.token;
                if (tok && tok.get(SM.flag) === true) {
                    ldr = unit;
                }
            })
            if (!ldr) {
                log(this.name + " has no leader")
                ldr = this.LeaderUnit();
            }
            let cohDistance = (this.quality.includes("Fair")) ? 2:(this.quality.includes("Good")) ? 4:6;

log("Leader: " + ldr.name);
            units = units.sort((a,b) => {
                return a.Distance(ldr) - b.Distance(ldr);
            })
            if (currentPhase === "Movement") {
                //resets at start of movement
                _.each(units,unit => {
                    unit.cohesion = false;
                })
                ldr.cohesion = true;
            }
            //test the unit
            for (let i=0;i<units.length;i++) {
                let unit1 = units[i]; //unit being tested, should be ldr to start with
                if (unit1.cohesion === true) {continue};
                if (HexMap[unit1.hexLabel].offboard === true) {
                    unit1.cohesion = true;
                    continue;
                };
                for (let j=0;j<units.length;j++) {
                    if (j===i) {continue};
                    let unit2 = units[j]; //unit being compared to
                    if (unit2.cohesion === true) {
                        let dist = unit1.Distance(unit2);
                        if (dist <= cohDistance) {
                            unit1.cohesion = true;
                            break;
                        }
                    }
                }
            }
            for (let i=0;i<units.length;i++) {
                let unit = units[i];
                if (unit.special.includes("Recon") || unit.special.includes("HQ") || unit.special.includes("Forward Observer")) {
                    unit.cohesion = true;
                }
                if (unit.cohesion === false) {
                    unit.token.set("aura1_color","#ff0000");
                } else {
                    unit.token.set("aura1_color","transparent");
                }
            }
            this.tokenIDs = units.map((e) => e.id);
        }







        Casualty(uID) {
            let index = this.tokenIDs.indexOf(uID);
            if (index > -1) {
                this.tokenIDs.splice(index,1);
            } 
        }

        LeaderUnit() {
            //pick centre of units in co that have weapons
            let units = this.tokenIDs.map((e) => UnitArray[e]);
            units = units.filter((e) => e.weapons.length > 0);
            let points = [];
            _.each(units,unit => {
                points.push(HexMap[unit.hexLabel].centre);
            })
            let centre = polySort(points,"Centre");
            let centreHex = HexMap[centre.label()];
            let centreUnit;
            let closestD = Infinity;
            _.each(units,unit => {
                let dist = HexMap[unit.hexLabel].cube.distance(centreHex.cube);
                if (dist < closestD) {
                    closestD = dist;
                    centreUnit = unit;
                }
            })
            centreUnit.token.set(SM.flag,true);
        }



    }






    const squaredPolar = (point, centre) => {
        return [
            Math.atan2(point.y-centre.y, point.x-centre.x),
            (point.x-centre.x)**2 + (point.y-centre.y)**2 // Square of distance
        ];
    }

    // sort points into a polygon
    const polySort = (points,request) => {
        // Get "centre of mass"
        let centre = [points.reduce((sum, p) => sum + p.x, 0) / points.length,
                      points.reduce((sum, p) => sum + p.y, 0) / points.length];
        if (request && request == "Centre") {
            return centre
        }
        // Sort by polar angle and distance, centered at this centre of mass.
        for (let point of points) point.push(...squaredPolar(point, centre));
        points.sort((a,b) => a[2] - b[2] || a[3] - b[3]);
        // Throw away the temporary polar coordinates
        for (let point of points) point.length -= 2; 
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

        //define areas with lines
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "pathv2",layer: "map",});
        _.each(paths,path => {
            let colour = path.get("stroke").toLowerCase();
            let type = areaColours[colour];
            if (type) {
                let centre = new Point(Math.round(path.get("x")), Math.round(path.get("y")));
                let vertices = translatePoly(path);
                MapAreas[type] = {'vertices': vertices, 'centre': centre};
            }
        });


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
                if (hex.terrain === "Open") {
                    hex.terrain = name;
                } else {
                    hex.terrain += ", " + terrain.name;
                }
                hex.height = terrain.height;
                let costKeys = Object.keys(terrain.moveCosts);
                _.each(costKeys,key => {
                    hex.moveCosts[key] = Math.max(hex.moveCosts[key],terrain.moveCosts[key]);
                    if (terrain.moveCosts[key] === -1) {
                        hex.moveCosts[key] = -1;
                        //impasssable
                    }
                })
                hex.cover = Math.max(hex.cover,terrain.cover);
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
        //add roads also
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
            if (path.get("stroke").toLowerCase() === "#ffffff") {
                let vertices = translatePoly(path);
log("Road")
log(vertices)
                for (let i=0;i<vertices.length - 1;i++) {
                    let hl1 = vertices[i].label();
                    let hl2 = vertices[i+1].label();
                    let hex1 = HexMap[hl1];
                    let hex2 = HexMap[hl2];
                    hex1.road = true;
                    hex2.road = true;
                    let cubes = hex1.cube.linedraw(hex2.cube);
                    _.each(cubes,cube => {
                        let hex = HexMap[cube.label()];
                        hex.road = true;
                    })
                }
            }
        });
    }

    const Transport = (msg) => {
        let Tag = msg.content.split(";");
        let type = Tag[1];
        let transportID = Tag[2];
        let transport = UnitArray[transportID];
        let errorMsg = [];
        let passengerID = (type === "Disembark") ? state.FFT.transportInfo[transportID]:Tag[3];
        let passenger = UnitArray[passengerID];
        let pMove,tMove,dist;

        SetupCard(type,"",transport.nation);

        if (!passenger) {
            errorMsg.push("No Passenger");
        } else {
            dist = (type === "Embark") ? transport.Distance(passenger):0;
            pMove = parseInt(passenger.token.get("bar1_value")) - 2;
            tMove = parseInt(transport.token.get("bar1_value")) - 2;
            if (dist > 1 && state.FFT.turn > 0 && HexMap[passenger.hexLabel].offboard === false) {
                errorMsg.push("Need to be Adjacent");
            }
            if (pMove < 0 && passenger.moveType === "Leg") {
                errorMsg.push("Need 2 move points to Embark");
            }
            if (tMove < 0) {
                errorMsg.push("Transport need 2 move points");
            }
            if (passenger.moveType === "Leg" && transport.special.includes("Limber")) {
                errorMsg.push("Limber cannot transport Infantry");
            }
        }


        if (errorMsg.length > 0) {
            _.each(errorMsg,msg => {
                outputCard.body.push(msg);
            })
            PrintCard();
            return;
        }

        if (type === "Embark") {
            state.FFT.transportInfo[transportID] = passengerID;
            transport.token.set(SM.full,true);
            transport.token.set("bar1_value",tMove);
            let area = MapAreas[transport.nation];
            let label = area.centre.label();
            let centre = HexMap[label].centre;
            passenger.token.set({
                left: centre.x,
                top: centre.y,
                bar1_value: pMove,
            })
            passenger.hexLabel = label;
            if (passenger.token.get(SM.flag)) {
                passenger.token.set(SM.flag,false);
                transport.token.set(SM.flag,true);
            }
        } else if (type === "Disembark") {
            pMove++;
            delete state.FFT.transportInfo[transportID];
            transport.token.set(SM.full,false);
            transport.token.set("bar1_value",tMove);
            passenger.token.set({
                top: transport.token.get("top"),
                left: transport.token.get("left"),
                bar1_value: pMove, //has to have 1 to be able to move off
            })
            passenger.hexLabel = transport.hexLabel;
            if (transport.token.get(SM.flag)) {
                transport.token.set(SM.flag,false);
                passenger.token.set(SM.flag,true);
            }
        }
        outputCard.body.push(passenger.name + " " + type + "s");
        if (type === "Disembark") {
            outputCard.body.push(passenger.name + " has " + pMove + " Move Points left");
        } else {
            outputCard.body.push(transport.name + " has " + tMove + " Move Points left");
        }
        PrintCard();
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
            let gmn = decodeURIComponent(token.get("gmnotes")).toString();
            gmn = gmn.split(";");
            let fID = gmn[0];
            let cID = gmn[1];
            if (character && fID && fID.includes("TargetIcon") === false) {
                let unit = new Unit(token.get("id"));
                let formation = FormationArray[fID];
                let formationInfo = state.FFT.formationInfo[fID];
                let company = CompanyArray[cID];
                let companyInfo = state.FFT.companyInfo[cID];
                if (!formation) {
                    if (formationInfo) {
                        formation = new Formation(state.FFT.formationInfo[fID].name,unit.id,state.FFT.formationInfo[fID].quality,fID);
                        if (!company) {
                            company = new Company(companyInfo.name,cID);
                            formation.AddCompany(company.id);
                            company.hq = companyInfo.hq;
                        }
                        company.AddUnit(unit.id)
                        formation.AddUnit(unit.id);
                    } else {
                        sendChat("",unit.name + " - needs to redefine its Formation");
                    }
                } else {
                    if (!company) {
                        company = new Company(companyInfo.name,cID);
                        formation.AddCompany(company.id);
                        company.hq = companyInfo.hq;
                        formation.AddCompany(company.id);
                    }
                    company.AddUnit(unit.id)
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
        let Tag = msg.content.split(";");
        let firstNation = Tag[1];
        let roads = Tag[2];
        let firstPlayer = state.FFT.nations[0] === firstNation ? 0:1;
        state.FFT.firstPlayer = firstPlayer;
        state.FFT.turn = 0;
        state.FFT.activePlayer = 2;
        state.FFT.phase = "";
        RemoveMoveMarkers();
        state.FFT.moveMarkers = [];
        state.FFT.visibility = 70; //can later alter this

        state.FFT.roads = (roads === "True") ? true:false;



    }


 
 



    const TokenInfo = (msg) => {
        if (!msg.selected) {return};
        let id = msg.selected[0]._id;
        let unit = UnitArray[id];
        if (!unit) {return};
        SetupCard(unit.name,"",unit.nation);
        let hex = HexMap[unit.hexLabel];
log(hex)
log(unit.moveType)

        outputCard.body.push("Hex: " + unit.hexLabel);
        outputCard.body.push("Terrain: " + hex.terrain);
        outputCard.body.push("Elevation: " + hex.elevation);
        outputCard.body.push("Move Cost: " + hex.moveCosts[unit.moveType] + " for " + Capit(unit.moveType));
        if (hex.road === true) {
            outputCard.body.push("Road in Hex");
        }
        let cover = (hex.cover === 0) ? "No Cover":(hex.cover === 1) ? "Cover Save 5+":"Cover Save 4+";
        outputCard.body.push("Cover: " + cover);

        for (let i=0;i<6;i++) {
            let edge = hex.edges[DIRECTIONS[i]];
            if (edge !== "Open") {
                outputCard.body.push(edge.name + " on " + DIRECTIONS[i] + " Edge");
            }
        }

        outputCard.body.push("[hr]")
        let result = unit.CheckCohesion();
        result = (result === true) ? " In ":" Not In ";
        outputCard.body.push("Unit is " + result + " Cohesion");


        
        PrintCard();
    }


    const QualityCheck = (unit,reason = "Fire") => {
log(unit.name)
        let passed = true;
        let extra = ""
        let cohesion = unit.CheckCohesion();
        if (reason === "CC") {
            

        }
        let qualityRoll = randomInteger(6);
        let target = (unit.quality.includes("Fair")) ? 5:(unit.quality.includes("Good")) ? 4:3;
        let tip = "<br>" + unit.quality + ": " + target + "+";
        let rollMods = 0;

        if (cohesion === false) {
            rollMods++;
            tip += "<br>Cohesion -1";
        } 
        if (reason === "CC") {
            rollMods -= 2;
            tip += "<br>Tank Fear +2";
        } else {
            let num = unit.token.get(SM.qc) === true ? 1:parseInt(unit.token.get(SM.qc));
            if (unit.armoured === false && num > 1) {
                num--;
                rollMods += num;
                tip += "<br>Extra QC Markers -" + num;
            }
        }

        target += rollMods;
        target = Math.min(target,6);


        if (cohesion === true && rollMods === 0) {
            tip += "<br>No Modifications";
        }


        tip = "Result: " + qualityRoll + " vs. " + target + "+" + tip;

        if ((qualityRoll >= target || qualityRoll === 6) && qualityRoll !== 1) {
            tip = '[Passes](#" class="showtip" title="' + tip + ')';
        } else {
            tip = '[Fails](#" class="showtip" title="' + tip + ')';
            passed = false;
            if (reason === "Fire") {
                let passengerID = state.FTT.transportInfo[target.id];
                let passenger = UnitArray[passengerID];
                if (passenger) {                
                    extra = passenger.name + " Routs with the Transport";
                    passenger.Destroyed();
                }
                unit.Destroyed();
            }
        }
        if (unit && unit.token) {
            unit.token.set(SM.qc,false);
        }
        let result = {
            pass: passed,
            tip: tip,
            extra: extra,
        }
        return result;
    }


    const ArtilleryAvailability2 = (player) => {
        artUnits = [];
        let unavail = [];
        _.each(UnitArray,unit => {
            let passenger = false;
            if (unit.player === player) {
                if (unit.artFlag === true && unit.CheckSuppression() === false) {
log(unit.name)
                    let type = unit.artType;
                    let target, mrlsTip;
                    let formation = FormationArray[unit.formationID];
                    let availMod = parseInt(formation.artAvail) || 0;
                    let offboard = HexMap[unit.hexLabel].offboard;
                    if (offboard === true) {
                        let area = MapAreas[unit.nation];
                        let pt = HexMap[unit.hexLabel].centre;
                        if (pt.x >= area.vertices[0].x && pt.x <= area.vertices[1].x && pt.y >= area.vertices[0].y && pt.y <= area.vertices[1].y) {
                            //is a passenger and cannot fire
                            passenger = true;
                        }
                    } else if (offboard === false) {
                        type = "Battalion";
                    }         
                    if (unit.mrls === true) {
                        target = 7;
                        mrlsTip = "Out of Rockets";
                        mrlsRounds = parseInt(unit.token.get("bar3_value"));
                        if (mrlsRounds > 0) {
                            target = 1;
                            mrlsTip = "Automatic<br>" + mrlsRounds + " Fire Units Available";
                        }
                    } else {
                        target = ArtAvailTable[unit.nation][type];
                    }

                    let availRoll = randomInteger(6);
                    let result = availRoll + availMod;

                    tip = "Final: " + result + " vs. "+ target + "+";
                    tip += "<br>----------------";
                    tip += "<br>Roll: " + availRoll;
                    if (availMod !== 0) {
                        tip += "<br>Availability: " + availMod;
                    }
                    if (unit.mrls === true) {
                        tip = mrlsTip;
                    }

                    tip = '[🎲 ](#" class="showtip" title="' + tip + ')';

                    if (result >= target && passenger === false) {
                        artUnits.push(unit);
                        outputCard.body.push(tip + unit.name + " is Available");
                    } else {
                        if (unit.type === "Aircraft") {
                            unavail.push(tip + unit.name + " is Refuelling/Reloading");
                        }
                        if (unit.type === "Artillery" && offboard === true && passenger === false && unit.mrls === false) {
                            let roll = randomInteger(6);
                            if (roll < 4) {
                                unavail.push(tip + unit.name + " is Tasked Elsewhere");
                            } else {
                                unavail.push(tip + unit.name + " is Reloading");
                            }
                        }
                        if (unit.type === "Artillery" && offboard === true && passenger === true) {
                            unavail.push(unit.name + " is being Transported");
                        }
                        if (unit.mrls === true) {
                            unavail.push(tip + unit.name + " has fired all its Rockets");
                        }              
                        if (offboard === false) {
                            unavail.push(tip + unit.name + " is Reloading");
                        }
                        unit.token.set(SM.unavail,true);
                    }
                }
            }
        })
        if (artUnits.length > 0 && unavail.length > 0) {
            outputCard.body.push("[hr]");
        }
        if (artUnits.length === 0) {
            outputCard.body.push("No Artillery or Air Support");
        }
        if (unavail.length > 0) {
            for (let i=0;i<unavail.length;i++) {
                outputCard.body.push(unavail[i]);
            }
        }
    }


    const ArtAvailTable = {
        "Wermacht": {
            "Self-Propelled": 2,
            "Towed": 3,
            "Battalion": 2,
        },
        "Red Army": {
            "Self-Propelled": 3,
            "Towed": 4,
            "Battalion": 2,
        },    
    }

    const MainCalibres = ["HE 30-69","HE 70-89","HE 90-119","HE 120-139","HE 140-169","HE 170+"];

    const MRLSCalibres = ["Light HE","Medium HE","Heavy HE","Very Heavy HE"]

    const AreaFireIndexTable = {
        //ref by calibre first, then FU to get fire index #
        //this only goes up to FU 10, and no ICM or Helo yet
        "HE 30-69": [0,1,2,3,4,5,6,6,8,8,8],
        "HE 70-89": [0,3,4,7,8,9,10,10,15,15,15],
        "HE 90-119": [0,3,5,8,9,11,14,14,15,15,15],
        "HE 120-139": [0,8,10,14,15,16,18,18,19,19,19],
        "HE 140-169": [0,8,12,14,16,17,18,18,20,20,20],
        "HE 170+": [0,14,16,18,19,21,21,21,22,22,22],
        //ref by size, and maxes at 10 FU
        //ICM not in yet
        "Light HE": [0,1,1,1,1,1,1,2,2,3,3],
        "Medium HE": [0,1,1,2,4,5,6,8,8,9,10],
        "Heavy HE": [0,8,12,15,16,18,19,19,21,21,21],
        "Very Heavy HE": [0,12,15,17,18,19,21,21,22,22,22],
    };

    //A = Soft in Open, B = Soft in Light Cover or AFV in Open, C = Soft in Heavy Cover or AFV in any Cover, then reference by fire index - 1 (0 index)
    //open topped = never in cover, +1 to die roll
    const AreaFireChart = {
        "A": ["-,2+S","S,6+Q","S,6+Q","S,5+Q","S,5+Q","S,5+Q","S,4+Q","S,4+Q","S,4+Q","S,3+Q","S,3+Q","S,3+Q","S,2+Q","S,2+Q","Q,6+D","Q,6+D","Q,6+D","Q,6+D","Q,6+D","Q,6+D","Q,5+D","Q,5+D"],
        "B": ["-,5+S","-,4+S","-,3+S","-,2+S","S,6+Q","S,6+Q","S,6+Q","S,6+Q","S,6+Q","S,6+Q","S,6+Q","S,5+Q","S,5+Q","S,5+Q","S,5+Q","S,4+Q","S,4+Q","S,3+Q","S,2+Q","S,2+Q","Q,6+D","Q,6+D"],
        "C": ["-,6+S","-,5+S","-,5+S","-,4+S","-,4+S","-,3+S","-,3+S","-,3+S","-,2+S","-,2+S","S,6+Q","S,6+Q","S,6+Q","S,6+Q","S,6+Q","S,6+Q","S,5+Q","S,5+Q","S,5+Q","S,4+Q","S,4+Q","S,3+Q"],
    }





    const IndirectAreaFireProblem = (spotter,centre) => {
        let roll = randomInteger(6);
        let note,info;
        if (spotter.quality === "Good" || spotter.quality === "Excellent") {roll++};
        if (spotter.CheckSuppression() === true) {roll--};
        if (roll < 1 || roll === 3) {
            info = SNAFU(centre,spotter);
        } else if (roll === 1 || roll === 2) {
            centre = ScatterCentre(centre,(3-roll));
            note = "Scatters and Lands with Reduced Effectiveness";
        } else if (roll === 4) {
            note = "Lands with Full Effectiveness, but hit with Counterbattery Fire";
        } else if (roll > 4) {
            note = "Lands with Reduced Effectiveness";
        }
        if (roll > 0 && roll !== 3) {
            outputCard.body.push("[#ff0000]" + note + "[/#]");
            outputCard.body.push("[hr]");
            info = {
                note: note,
                centre: centre,
            }
        }
        return info;
    }

    const SNAFU = (centre,spotter) => {
        let roll = randomInteger(6) + randomInteger(6) + randomInteger(6);
        let note;
        if (roll < 6) {
            note = "Observer gave Own Coordinates, Lands with Full Effectiveness";
            centre = spotter.hexLabel;
        } else if (roll === 7) {
            note = "Target Location Error, Lands with Full Effectiveness";
            centre = ScatterCentre(centre,10);
        } else if (roll === 8 || roll === 6) {
            note = "Target Location Error, Lands with Reduced Effectiveness";
            centre = ScatterCentre(centre,10);
        } else if (roll === 9) {
            note = "Map Confusion, Lands with Full Effectiveness";
            centre = ScatterCentre(centre,5);
        } else if (roll === 10 || roll === 11) {
            note = "Observer Range Measurement Error, Lands with Reduced Effectiveness";
            let distance = HexMap[spotter.hexLabel].cube.distance(HexMap[centre].cube);
            distance = Math.round(distance/4);
            centre = ScatterCentre(centre,distance);
        } else if (roll === 12) {
            note = "Barrage cancelled due to Uncertainty";
        } else if (roll === 13) {
            note = "Target Location Error, Lands with Reduced Effectiveness";
            centre = ScatterCentre(centre,5);
        } else if (roll === 14) {
            note = "Target Location Error, Lands with Full Effectiveness";
            centre = ScatterCentre(centre,5);
        } else if (roll === 15) {
            note = "Fire lands with Full Effectiveness, but Counterbattery Fire eliminates a group";
//if air, change to shot down by AA

        } else if (roll > 15) {
            note = "Barrage cancelled due to communications problems";
        }
        let info = {
            note: note,
            centre: centre,
        }
        outputCard.body.push("[#ff0000]SNAFU[/#]");
        outputCard.body.push(info.note);
        outputCard.body.push("[hr]");
        return info;
    }

    const ScatterCentre = (centre,distance) => {
        //random direction, distance is in hexes
        let possibles = HexLabel[centre].cube.ring(distance);
        let newC = possibles[randomInteger(possibles.length) - 1];
        centre = newC.label();
        return centre;
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

    const BlastCheck = (targetCentre,unit,radius) => {
        radius = radius * HexInfo.size * 2;
        let unitCentre = HexMap[unit.hexLabel].centre;
        let theta = Angle(unit.token.get("rotation")) * Math.PI/180;
        let w = unit.token.get("width");
        let h = unit.token.get("height");
        let squareTokens = ["Infantry","Mortar"]; //tokens without a direction triangle
        if (squareTokens.includes(unit.type) === false) {
            h -= 10;    
        }
        dXmin = unitCentre.x - (w/2);
        dXmax = unitCentre.x + (w/2);
        dYmin = unitCentre.y - (h/2);
        dYmax = unitCentre.y + (h/2);
        scale = pageInfo.scale;
        cX = (Math.cos(theta) * (targetCentre.x - unitCentre.x)) - (Math.sin(theta)*(targetCentre.y - unitCentre.y)) + unitCentre.x
        cY = (Math.sin(theta) * (targetCentre.x - unitCentre.x)) + (Math.cos(theta)*(targetCentre.y - unitCentre.y)) + unitCentre.y
        //closest point
        eX = Clamp(cX,dXmin,dXmax)
        eY = Clamp(cY,dYmin,dYmax)

        A = (eX - cX)
        B = (eY - cY)
        
        let caught = false;
        C = Math.sqrt(A*A + B*B)
        C = Math.round(C/70)*scale
        if (C<=radius) {
            caught = true
        }
        return caught;
    }

    const Clamp = (val,min,max) => {
        return (val>max) ? max:(val <min) ? min: val;
    }

    const TA = (radius,centreLabel,areaHexLabels) => {
        let targetArray = [];
        _.each(UnitArray,unit => {
            if (unit.name.includes("Target")) {return};
            if (areaHexLabels.includes(unit.hexLabel)) {
                let check = BlastCheck(centreLabel,unit,radius)
                if (check === true) {
                    targetArray.push(unit);
                }
            }
        })
        return targetArray;
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
log(target)


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
        let distance = artillery.Distance(target);
        let targetHex = HexMap[target.hexLabel];
        if (targetHex.terrain.includes("Water") || targetHex.terrain.includes("River") && type === "Smoke") {
            outputCard.body.push("Unable to place Target on Water");
        } else if (distance > artillery.artrange) {
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

            if (type === "Smoke") {
                PlaceSmoke(artillery,hexLabels);
            } else if (type === "HE") {
                let targetArray = TA(radius,target,hexLabels);
                HE(artillery,targetArray);
            }

            target.token.remove();
            delete UnitArray[target.id];

            spotter.spotter++;
            artillery.token.set(SM.fired,true);
            artillery.token.set("tint_color","transparent");

            let index = artUnits.map(e => e.id).indexOf(artilleryID);
            artUnits.splice(index,1);
        }
        PrintCard();
    }

    const PlaceSmoke = (player,hexLabels) => {
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
                name: player + "Smoke",
            });
            HexMap[hexLabel].smoke = newToken.id;
            HexMap[hexLabel].smokePlayer = player;
        })
    }

    const HE = (artillery,targetArray) => {
        _.each(targetArray,info => {
            let unit = UnitArray[info.unitID];
            let hex = HexMap[unit.hexLabel];
log(unit.name)
log(hex)
            let artRoll = randomInteger(6);
            let artEffect = artillery.arteffect;
            let bonus = 0, bonusText = "";
            if (artEffect === "+1") {
                bonus ++;
                bonusText = artEffect + " to Hit";
            } else if (artEffect === "+1 vs. Armour" && unit.armoured === true) {
                bonus ++;
                bonusText = artEffect;
            } else if (artEffect === "-1 vs. Armour" && unit.armoured === true) {
                bonus--;
                bonusText = artEffect;
            } 
            if (info.coverage === "Partial") {
                bonus--;
            }


            let result = artRoll + bonus;
            let tip = "Result: " + result + " vs. 4+";
            tip += "<br>Roll: " + artRoll;
            if (bonusText !== "") {
                tip += "<br>" + bonusText;
            }
            if (info.coverage === "Partial") {
                tip += "<br>-1 Partially Under";
            }

            if (unit.token.get("tint_color") === "#000000") {
                let hiddenRoll = randomInteger(6);
                if (hiddenRoll > 3) {
                    result = 1;
                    tip = "Unspotted Unit Missed<br>Roll: " + hiddenRoll + " vs. 4+";
                }
            }
            if (result > 3) {
                tip = '[Hit](#" class="showtip" title="' + tip + ')';
                
                if (result >= 6) {
                    if (hex.cover > 0 || unit.armoured === true) {
                        if (unit.artQC === false) {
                            unit.artQC = true;
                            unit.Suppress("A",true);
                            let qc = QualityCheck(unit);
                            let noun = (qc.pass === true) ? "Suppressed":"Routs";
                            outputCard.body.push(unit.name + ' is ' + tip + ' and ' + qc.tip + ' its QC and is ' + noun);
                        } else {
                            unit.Suppress("A",true);
                            outputCard.body.push(unit.name + ' is ' + tip + ' and Suppressed');
                        }         
                    } else {
                        outputCard.body.push(unit.name + ' is ' + tip + ' and Destroyed');
                        unit.Destroyed();
                    }
                } else {
                    if ((hex.cover > 0 || unit.armoured === true) && unit.artQC === false) {
                        unit.artQC = true;
                        let qc = QualityCheck(unit);
                        let noun = (qc.pass === true) ? "Suppressed":"Routed";
                        outputCard.body.push(unit.name + ' is ' + tip + ', ' + qc.tip + ' its QC and is ' + noun);
                        if (noun === "Suppressed") {
                            unit.Suppress("A",true);
                        }
                    } else {
                        outputCard.body.push(unit.name + ' is ' + tip + ' and Suppressed');
                        unit.Suppress("A",true);
                    }
                }
            } else {
                tip = '[Missed](#" class="showtip" title="' + tip + ')';
                outputCard.body.push(unit.name + " is " + tip);
            }
        })




    }







    const TakeQC = (msg) => {
        let id = msg.content.split(";")[1];
        let unit = UnitArray[id];
        SetupCard(unit.name,"Quality Check",unit.nation);
        qc = QualityCheck(unit);
        let i = randomInteger(6);
        let effect = "";
        if (qc.pass === true) {
            unit.token.set(SM.passed,true);
            if (unit.armoured === false) {
                effect = " and is Suppressed";
                unit.Suppress("B",true);
            }
        } else {
            if (unit.armoured === true) {
                effect = " and Withdraws from the Battle";
            } else {
                let r = randomInteger(6);
                if (r === 6) {
                    effect = " and Surrenders"
                } else if (r > 2 && r < 6) {
                    effect = " and Retreats";
                } else {
                    effect = " and Routs";
                }
            }
            unit.Destroyed();
        }
        outputCard.body.push(unit.name + " " + qc.tip + ' its QC' + effect);

        let phrase = "Next Unit";
        if (qcUnits.length === 0) {
            phrase = "Continue";
        }
        ButtonInfo(phrase,"!RunQC")
        PrintCard();
    }

    const TakeFQC = (msg) => {
        let id = msg.content.split(";")[1];
        let unit = UnitArray[id];
        let formation = FormationArray[unit.formationID];
        SetupCard(formation.name,"Formation Check",unit.nation);
        qc = QualityCheck(unit);
        if (qc.pass === true) {
            outputCard.body.push("The Formation passes and will stick around for now");
        } else {
            outputCard.body.push("The Formation withdraws from the Battlefield");
            //formation.Remove();
        }
        let phrase = "Next Formation";
        if (qcFormations.length === 0) {
            phrase = "Next Phase";
        }
        ButtonInfo(phrase,"!RunFormQC")
        PrintCard();        
    }






    const Friendlies = (unit) => {
        let result = false;
        let keys = Object.keys(UnitArray);
        for (let i=0;i<keys.length;i++) {
            let unit2 = UnitArray[keys[i]];
            if (unit2.id === unit.id || unit2.nation !== unit.nation) {continue}
            let distance = unit.Distance(unit2);
            if (distance === 1) {
                result = true;
                break;
            }
        }
        return result;
    }




    const CheckSpotting = (unit,phase) => {

        if (phase === "Movement" && unit.token.get("tint_color") === "transparent") {return};
        let moved = (unit.token.get(SM.move) || unit.token.get(SM.double)) ? true:false;
        let unitHex = HexMap[unit.hexLabel];
        let cover = unitHex.cover > 0 ? true:false;
        let fired = unit.token.get(SM.fired);
        let vis = state.FFT.visibility;

        let threshold;
        if (unit.moveType === "Leg") {
            if (fired === true) {
                threshold = 15;
            } else {
                if (moved === true && cover === false) {threshold = 15};
                if (moved === true && cover === true) {threshold = 10};
                if (moved === false && cover === false) {threshold = 5};
                if (moved === false && cover === true) {threshold = 2};
            }
        } else if (unit.moveType === "Towed") {
            if (fired === true) {
                threshold = vis;
            } else {
                if (moved === true && cover === false) {threshold = vis};
                if (moved === true && cover === true) {threshold = 15};
                if (moved === false && cover === false) {threshold = 25};
                if (moved === false && cover === true) {threshold = 5};
            }
        } else {
            if (fired === true) {
                threshold = vis;
            } else {
                if (moved === true && cover === false) {threshold = vis};
                if (moved === true && cover === true) {threshold = 20};
                if (moved === false && cover === false) {threshold = 45};
                if (moved === false && cover === true) {threshold = 10};
            }
        }
    

        let spotted = false;
        let keys = Object.keys(UnitArray);
        for (let i=0;i<keys.length;i++) {
            let id = keys[i];
            if (id === unit.id) {continue};
            let unit2 = UnitArray[id];
            if (!unit2) {log("No Unit2");continue};
            if (unit2.nation === unit.nation || unit2.nation === "Neutral") {continue};
            let distance = unit.Distance(unit2);
            let los = LOS(unit2,unit).los;
            if (los === false) {continue};
            let mod = 0;
            if (unit.quality.includes("Fair")) {mod -= 5};
            if (unit.quality.includes("Excellent")) {mod += 5};
            if (unit.special.toLowerCase().includes("recon")) {mod += 5};          
            if (threshold === 2) {
                mod = 0;
            }
            if (distance <= (threshold + mod)) {
                //spotted
                log(unit2.name + " Has spotted")
                unit.token.set("tint_color","transparent");
                spotted = true;
                break;
            }
        }
        if (spotted === false && phase === "End") {
            unit.token.set("tint_color","#000000");
        }



    }


    const ClearState = (msg) => {
        LoadPage();
        BuildMap();
        RemoveMoveMarkers();
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
                aura2_color: "transparent",
                aura2_radius: 0,
                bar1_value: 0,
                showplayers_bar1: true,
                showplayers_bar2: false,
                showplayers_bar3: false,
                showname: true,
                showplayers_aura1: true,
                showplayers_aura2: true,
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
            companyInfo: {},
            lines: [],
            turn: 0,
            phase: "Deployment",
            activePlayer: 0,
            firstPlayer: 0,
            roads: true,
            moveMarkers: [],
            visibility: 70,
            transportInfo: {},
        }
        BuildMap();
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
            if (info === "All" && token.get("name") === "Wreck") {
                token.remove();
            }
            if (token.get("name") === "Map Marker") {
                token.remove();
            }
        });
        if (info === "All") {
            let tokens = findObjs({
                _pageid: Campaign().get("playerpageid"),
                _type: "graphic",
                _subtype: "token",
                layer: "foreground",
            });
            tokens.forEach((token) => {
                token.remove();
            });



        }



    }

    const DefineFormation = (msg) => {
        if (!msg.selected) {
            sendChat("","No Tokens Selected");
            return
        }
        let Tag = msg.content.split(";");
        let formationName = Tag[1];
        let formationType = Tag[2];
        let breakpoint = Tag[3];
        let quality = Tag[4];
        let artAvail = Tag[5] || 0;

        let unit;
        let unit1 = new Unit(msg.selected[0]._id);
        let formation = new Formation(formationName,unit1.id,quality);
        formation.breakpoint = breakpoint;
        formation.type = formationType;
        formation.artAvail = artAvail;
        state.FFT.formationInfo[formation.id].breakpoint = breakpoint;
        state.FFT.formationInfo[formation.id].type = formationType;
        state.FFT.formationInfo[formation.id].artAvail = artAvail;


        if (formationType === "Combat") {
            state.FFT.formNum[formation.player]++;
        } 

        for (let i=0;i<msg.selected.length;i++) {
            mID = msg.selected[i]._id;
            unit = new Unit(mID);
            formation.AddUnit(mID);
            unit.token.set({
                tint_color: "transparent",
                tint_color: "transparent",
                aura1_color: "transparent",
                aura1_radius: 1,
                aura2_color: "transparent",
                aura2_radius: 5,
                disableTokenMenu: false,
                bar1_value: unit.movement,
                showplayers_bar1: true,
                showplayers_bar2: false,
                showplayers_bar3: false,
                showname: true,
                showplayers_aura1: true,
                showplayers_aura2: true,
                statusmarkers: "",
                show_tooltip: true,
            })
            if (unit.artFlag === true) {
                unit.token.set({
                    bar2_value: 3, //used for artillery
                    showplayers_bar2: true,
                    showplayers_bar3: true,
                })
                if (unit.special.includes("Fire Units")) {
                    let sp = unit.special.split(",");
                    let fu = 0;
                    _.each(sp,sub => {
                        if (sub.includes("Fire Units")) {
                            fu = sub.replace(/[^\d]/g,"");
                        }
                    })
                    unit.token.set("bar3_value",fu);
                }


            }
        }

        sendChat("",formation.name + " Added")
    }

    const DefineCompany = (msg) => {
        if (!msg.selected) {
            sendChat("","No Tokens Selected");
            return
        }
        let Tag = msg.content.split(";");
        let coLetter = Tag[1];
        let coType = Tag[2]; //Co or Battalion
        let unitType = " Plt. ";

        let ids = msg.selected.map((e) => e._id);
        let unitI = UnitArray[ids[0]];
        let nation = unitI.nation;
        let player = unitI.player;

        let companyName = coLetter + " " + coType;
        let company = new Company(companyName);

        let noFlag = false;
        let symbol;
        let formation = FormationArray[unitI.formationID];
        let formNum = state.FFT.formNum[player] - 1;
        if (formNum > 5) {
            formNum -= 6;
        }
        formNum = Math.min(Math.max(0,formNum),5);
        if (coLetter === "HQ" || coLetter === "Corps" || coLetter === "Divisional") {
            company.hq = true;
            symbol = Nations[nation].hq;
            noFlag = true;
        } else {
            let num = coLetter.toLowerCase().charCodeAt(0) - 97; //a will be 0
            let markerName = companyMarkers[formNum] + num;
            markerName = markerName.toString().padStart(4,'0');
            let markerNumber = companyMarkerNumbers[formNum] + num;
            if (nation === "Red Army" && formNum === 0 && num > 5) {
                markerNumber++;
            }
            symbol = "letters_and_numbers" + markerName + "::" + markerNumber;
        }
        symbol = "status_" + symbol;
log(symbol)
        let gmn = formation.id + ";" + company.id;

        let nameArray = {};
        let assigned = false;
        for (let i=0;i<ids.length;i++) {
            let id = ids[i];
            let unit = UnitArray[id];
            company.AddUnit(id);
            let charName = unit.charName;
            if (!nameArray[charName]) {
                nameArray[charName] = 1;
            } else {
                nameArray[charName]++;
            }
            if (unit.artFlag === true && formation.type !== "Combat") {
                unitType = " Battery "
            }
            let name = charName + unitType + nameArray[charName];
            let tooltip = formation.name + " / " + companyName;
            if (formation.type === "Combat") {
                tooltip += " / " + formation.quality + " Quality";
            }
            unit.token.set("gmnotes",gmn);
            unit.token.set("name",name);
            unit.token.set("tooltip",tooltip);
            unit.token.set(symbol,true);
            unit.name = name;
            if (assigned === false && noFlag === false && unit.weapons.length > 0) {
                unit.token.set(SM.flag,true);
                assigned = true;
            }
        }
        if (assigned === false) {
            UnitArray[ids[0]].token.set(SM.flag,true);
        }
        formation.AddCompany(company.id);
        let info = {
            name: companyName,
            hq: company.hq,
        }
        state.FFT.companyInfo[company.id] = info;
        sendChat("",companyName + " Added")
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

//add in spotted/unspotted units
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
        let distance = losResult.distance
        if (distance < 10) {
            distance = distance + " (" + distance * 100 + "m)";
        } else {
            distance = distance + " (" + distance/10 + "km)";
        }
        outputCard.body.push("Distance: " + distance);
        if (losResult.los === false) {
            outputCard.body.push("[#ff0000]No LOS to Target[/#]");
            outputCard.body.push(losResult.losReason);
        } else {
            outputCard.body.push("Shooter has LOS to Target");
            outputCard.body.push("Target has " + coverLevels[losResult.cover] + " Cover");
            if (losResult.inSmoke === true) {
                outputCard.body.push("Target is in Smoke");
            }
            outputCard.body.push("Target is in the " + losResult.shooterFacing + " Arc");
            outputCard.body.push("Target is being hit on the " + losResult.targetFacing + " Arc");
/*
needs fix for different weapons
            let bands = ["in Short","in Effective","in Long","Out of"];
            let final = 3;
            for (let band = 0;band < 3;band++) {
                if (losResult.distance <= shooter.range[band]) {
                    final = band;
                    break;
                }
            }
            outputCard.body.push("Target is " + bands[final] + " Range");
*/


        }



        PrintCard();
    }


    const LOS = (shooter,target) => {
        let los = true;
        let losReason = "";
        let losBlock = "";
        
        let shooterHex = HexMap[shooter.hexLabel];
        let targetHex = HexMap[target.hexLabel];
        let distance = shooter.Distance(target);
        
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

        let result = {
            los: los,
            losReason: losReason,
            losBlock: losBlock,
            distance: distance,
            cover: targetHex.cover,
            shooterFacing: shooterFacing,
            targetFacing: targetFacing,
            inSmoke: (targetHex.smoke !== "") ? true:false,
        }

        return result;
    }

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
        let destroyed = false;



        SetupCard(shooter.name,target.name,shooter.nation);
        let losResult = LOS(shooter,target);
        if (losResult.los === false) {
            errorMsg.push("[#ff0000]No LOS to Target[/#]");
            errorMsg.push(losResult.losReason);
        }
        if (shooter.token.get(SM.unavail) === true) {
            errorMsg.push("[#ff0000]Unit is Unable to Fire[/#]");
        }
        if ((shooter.moveType === "Towed" && (shooter.token.get(SM.move) || shooter.token.get(SM.double))) || shooter.token.get(SM.double)) {
            errorMsg.push("[#ff0000]Unit is unable to Fire due to Movement[/#]");
        }
        if (shooter.nation === target.nation) {
            errorMsg.push("[#ff0000]Friendly Fire[/#]");
        }

        let closeCombat = (losResult.distance === 1) ? true:false;

        if (closeCombat === true && shooter.player !== activePlayer && HexMap[shooter.hexLabel].cover === 0 && target.moveType === "Tracked" && shooter.CC === false) {
            let qcResult = QualityCheck(shooter,"CC");
            if (qcResult.pass === false) {
                errorMsg.push("Unit " + qcResult.tip + " its QC for Tank Fear");
                errorMsg.push("It does not fire this first round of combat");
            }
        }


        if (errorMsg.length > 0) {
            _.each(errorMsg,msg => {
                outputCard.body.push(msg);
            })
            PrintCard();
            return;
        }

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


        if (shooter.token.get(SM.fired) === true && (weapon.fired === true || shooter.type !== "Infantry")) {
            errorMsg.push("[#ff0000]Unit has already Fired that Weapon[/#]");
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
            if (armour === "S") {armour = 0};
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
                if (losResult.distance > weapon.range[2]) {
                    pen -= 2;
                    penTip += "<br>-2 Pen for Long Range";
                }
                if (losResult.distance <= weapon.range[1]) {
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
        let toHitTip = "<br>Base 4+ To Hit";
        if (shooter.quality.includes("Good") || shooter.quality.includes("Excellent")) {
            toHitTip += "<br>+1 Quality";
            toHit--;
        }
        if (losResult.distance <= weapon.range[1]) {
            toHit--;
            toHitTip += "<br>+1 Short Range";
        }
        if (losResult.distance > weapon.range[2]) {
            toHit++;
            toHitTip += "<br>-1 Long Range";
        }
        if (shooter.CheckSuppression() === true) {
            if (shooter.armoured === true) {
                toHit++;
                toHitTip += "<br>-1 Suppressed";
            } else {
                toHit+=2;
                toHitTip += "<br>-2 Suppressed";
            }
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
            toHit -= ai;
            toHitTip += "<br>" + aiTip;
        }

            
        let rolls = [];
        let hits = 0;
        let coverSaves = 0; 
        let finalHits = 0;
        for (let i=0;i<rof;i++) {
            let roll = randomInteger(6);
            rolls.push(roll);
            if ((roll >= toHit || roll === 6) && roll !== 1) {
                hits++;
            }
        }
        //cover saves
        let cover = HexMap[target.hexLabel].cover;
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

        outputCard.body.push(shooter.name + " fires " + weapon.name);
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
                    penDice = Math.min(10,penDice);
                    let penMod = (pen <= armour) ? (pen - armour):0; //will always be 0 or a negative #
                    let penTips = "", deflect = 0, qc = false;
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
                        let passengerID = state.FTT.transportInfo[target.id];
                        let passenger = UnitArray[passengerID];
                        if (passenger) {
                            outputCard.body.push("[U]Passenger[/u]");
                            let qcResult = QualityCheck(passengerID);
                            let line = passenger.name + " " + qcResult.tip + " its Quality Check";
                            if (qcResult.pass === true) {
                                passenger.token.set({
                                    top: target.token.get("top"),
                                    left: target.token.get("left"),
                                    bar1_value: 0,
                                })
                                passenger.hexLabel = target.hexLabel;
                                if (target.token.get(SM.flag)) {
                                    passenger.token.set(SM.flag,true);
                                }
                                passenger.token.set(SM.suppB,true);
                                line += " and Dismounts;"
                            } else {
                                line += " and is Destroyed";
                            }
                            outputCard.body.push(line);
                        }
                        target.Destroyed("Wreck");
                    } else if (qc === true) {
                        if (target.token.get(SM.passed)) {
                            tip = ' [Takes Minor Damage](#" class="showtip" title="' + tip + ')';
                        } else {
                            tip = ' [Takes Damage](#" class="showtip" title="' + tip + ')';
                            target.token.set(SM.qc,true);
                            //passengers will be dealt with in runqc
                        }
                    } else {
                        tip = ' [Deflects all Shots](#" class="showtip" title="' + tip + ')';
                    }
                    outputCard.body.push(target.name + tip);
                } else {
                    if (target.token.get(SM.passed)) {
                        outputCard.body.push("The Unit weathers the fire");
                    } else {
                        let oldQC = (target.token.get(SM.qc) === false) ? 0:(target.token.get(SM.qc) === true) ? 1:parseInt(target.token.get(SM.qc));
                        finalHits += oldQC;
                        if (finalHits > 0) {
                            target.token.set(SM.qc,finalHits);
                        }
                        //passengers dealth with in runqc
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
        if (turrets.includes(shooter.type) === false && shooter.special.includes("Forward Firing") === false) {
            shooter.token.set("rotation",angle);
        }
        if (shooter.special.includes("Flamethrower") && closeCombat === true) {
            spawnFxBetweenPoints(new Point(shooter.token.get("left"),shooter.token.get("top")), new Point(target.token.get("left"),target.token.get("top")), "breath-fire");
        }

        if (closeCombat === false) {
            shooter.token.set(SM.fired,true);
        } else {
            shooter.CC = true;
            target.CC = true;
            //deprecate movement, do quality check on target
            let m = 0;
            if (shooter.player === activePlayer) {
                m = parseInt(shooter.token.get("bar1_value")) || 0;
                m = Math.max(0,m-1);
                shooter.token.set("bar1_value",m);
            }
            let qc = QualityCheck(target);
            if (destroyed === false) {
                let noun;
                if (target.armoured === true) {
                    noun = (qc.pass === true) ? "":"and Surrenders or Routs";
                } else {
                    noun = (qc.pass === true) ? "but is Suppressed":"and Surrenders or Routs";
                }
                outputCard.body.push(target.name + " " + qc.tip + ' its QC ' + noun);
            }

            if (qc.pass === true && target.armoured === false && destroyed === false) {
                target.Suppress("B",true);
            } else if (qc.pass === false && m > 0) {
                outputCard.body.push("[hr]");
                outputCard.body.push(shooter.name + " has " + m + " Movement Points left");
            }
        }
        shooter.token.set("tint_color","transparent");
        shooter.SetOverwatch(false);
        PrintCard();
    }


const AdvancePhase = () => {
    let turn = state.FFT.turn;
    let phase = state.FFT.phase;
    let phases = ["Deployment","Airstrikes & Area Fire","Movement","Close Combat","Direct Fire","End Phase"];
    if (turn === 0) {
        currentPhase = "Deployment";
        turn = 1;
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
    state.FFT.phase = currentPhase;

    SetupCard(currentPhase,"Turn " + turn,state.FFT.nations[activePlayer]);
log("Phase" + currentPhase)
    switch(currentPhase) {
        case "Deployment":
            DeploymentPhase();
            break;
        case "Airstrikes & Area Fire":
            AreaFirePhase();
            break;
        case "Movement":
            ResolveAreaPhase();
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
    

}

const DeploymentPhase = () => {
    outputCard.body.push("Deploy any Available Reinforcements");
    outputCard.body.push("No Overwatch Fire is allowed");
    PrintCard();
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
        unit.spotUses = 0;
        unit.artQC = false;
        unit.coverTest = false;
        unit.CC = false;
    })
    _.each(CompanyArray,company => {
        company.spotUses = 0;
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
    ArtilleryAvailability2(activePlayer);
    outputCard.body.push("[hr]");
    outputCard.body.push("Place Air and Artillery");
    outputCard.body.push("No Overwatch Fire is allowed");
    PrintCard();
}

const ResolveAreaPhase = () => {
    areaFire = areaFireList.shift();
    if (areaFire) {
        SetupCard("Area Fire","",state.FFT.nations[activePlayer]);
        ButtonInfo("Resolve Next","!AreaFire");
        PrintCard();
    } else {
        MovementPhase();
    }
}

const ResolveAreaFire = () => {
log(areaFire)


    //areaFire is info - centre, artUnits, type, spotter, fu for MRLS
    let centre = areaFire.centre; //hexlabel where target is centred
    sendPing(HexMap[centre].centre.x,HexMap[centre].centre.y,Campaign().get("playerpageid"),null,true);
    let artUnits = areaFire.artUnitIDs.map((e) => UnitArray[e]);
    let type = areaFire.type; //HE or smoke
    let soundType = "Mortar";
    let spotter = UnitArray[areaFire.spotterID] //for accuracy

    let calibre,radius,info;
    let fu = parseInt(areaFire.fu); //will be 0 if non-MRLS
    let artUnitNames = [];
    let calNum = 100;
    _.each(artUnits,artUnit => {
        artUnitNames.push(artUnit.name);
        if (artUnit.mrls === true) {
            cal = MRLSCalibres.indexOf(artUnit.artCalibre);
            let indFU = parseInt(artUnit.token.get("bar3_value")) - areaFire.info[artUnit.id];
            artUnit.token.set("bar3_value",indFU);
            soundType = "Katyusha";
        } else {
            cal = MainCalibres.indexOf(artUnit.artCalibre);
            if (HexMap[artUnit.hexLabel].offboard === true && artUnit.artType !== "Battalion") {
                fu += 2;
                radius = 2;
            } else {
                fu += 1;
                radius = 1;
            }
            if (artUnit.type !== "Mortar") {
                soundType = "Howitzer";
            }
        }
        if (cal > -1 && cal < calNum) {
            calNum = cal; //lowest calibre
        }
        artUnit.token.set(SM.fired,true);
        artUnit.token.set("tint_color","transparent");
    })
    let fuTip = "<br>" + fu + " Fire Units Total";
    if (calNum === 100) {calNum = 0};
    if (areaFire.mrls === true) {
        calibre = MRLSCalibres[calNum];
        radius = (fu > 4) ? 3.5:3;
    } else {
        calibre = MainCalibres[calNum];
        if (radius > 0 && fu > 4) {radius = 2.5};
    }

    let accuracy = Nations[spotter.nation].artAccuracy;
    let accTip = "";
    if (spotter.quality === "Good" || spotter.quality === "Excellent") {
        accuracy--;
        accTip += "<br>(Spotter Quality +1)";
    }
    if (spotter.CheckSuppression() === true) {
        accuracy++;
        accTip += "<br>(Spotter Suppressed -1)";
    }
    accTip = "Accuracy: " + accuracy + accTip;

    let hexLabels = [centre];
    if (radius > 0) {
        let cubes = HexMap[centre].cube.radius(radius);       
        _.each(cubes,cube => {
            hexLabels.push(cube.label());
        })
    }
    hexLabels = [...new Set(hexLabels)];
log(hexLabels)
log(calibre)
log(fuTip)
    SetupCard("Artillery Fire","",spotter.nation);
    outputCard.body.push("[U]Units Involved[/u]");
    outputCard.body.push(artUnitNames.toString());
    outputCard.body.push("[hr]");
    //Sound and FX
    PlaySound(soundType);
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

    if (type === "Smoke") {
        //PlaceSmoke(spotter.player,hexLabels);
    } else if (type === "HE") {
        let targetArray = TA(radius,centre,hexLabels);
log(targetArray)
return
        //fireindex
        let FI = AreaFireIndexTable[calibre][fu];
        //accuracy
        let fiTip = "Full Effectiveness";
        let info = "Lands with Full Effectiveness";
    //spotting for self means auto 6 on accuracy roll essentially
        let accRoll = randomInteger(6);
        if (accRoll === 1) {
            info = IndirectAreaFireProblem(spotter,centre);
            centre = info.centre;
            info = info.note;
            if (info.includes("Reduced")) {
                fiTip = "Lands with Reduced Effectiveness";
            }
            if (info.includes("Counterbattery")) {
                if (info.includes("eliminates")) {
                    let companies = [];
                    _.each(artUnits,artUnit => {
                        let company = CompanyArray[artUnit.companyID];
                        if (companies.includes(company) === false) {
                            companies.push(company);
                        }
                    })
                    let company = companies[randomInteger(companies.length) - 1];
                    outputCard.body.push(company.name + " is eliminated");
                    let ids = company.tokenIDs;
                    _.each(ids,id => {
                        let unit = UnitArray[id];
                        unit.Destroyed();
                    })
                } else {
                    let formations = [];
                    let companies = [];
                    _.each(artUnits,artUnit => {
                        if (HexMap[artUnit.hexLabel].offboard === true) {
                            let formation = FormationArray[artUnit.formation];
                            if (formations.includes(formation) === false) {
                                formations.push(formation);
                            }
                        } else {
                            let company = CompanyArray[artUnit.companyID];
                            if (companies.includes(company) === false) {
                                companies.push(company);
                            }
                        }
                    })
                    for (let i=0;i<formations.length;i++) {
                        let formation = formations[i];
                        outputCard.body.push(formation.name + "gets -1 on availability");
                        formation.artAvail--;
                        state.FFT.formationInfo[formation.id].artAvail--;
                    }
                    for (let i=0;i<companies.length;i++) {
                        let company = companies[i];
                        let ids = company.tokenIDs;
                        let possibleIDs = artUnits.map((e) => e.id);
                        for (let j=0;j<ids.length;j++) {
                            let id = ids[j];
                            if (possibleIDs.includes(id)){
                                let unit = UnitArray[id];
                                outputCard.body.push(unit.name + " is eliminated");
                                unit.Destroyed();
                                break; //1 participating unit per onboard company
                            }
                        }
                    }
                }
            }
        } else if (accRoll < accuracy) {
            fiTip = "Lands with Reduced Effectiveness";
        }

        if (info.includes("cancelled")) {
            PrintCard();
            return;
        }

        if (fiTip === "Reduced Effectiveness") {
            FI = Math.max(1,(FI - 5));
        }

        //get units under artillery barrage, using centre and radius
        




        //for each unit, apply the FI

    }






}






const MovementPhase = () => {
    RemoveDead();
log(currentPhase)

    _.each(CompanyArray,company => {
        if (company.player === activePlayer) {
log(company.player)
            company.Cohesion();
        }
    })
    outputCard.body.push("Overwatch Fire can occur at any time");
    outputCard.body.push("Quality Checks will be done at the end of the Phase");
    PrintCard();
}

const FirstQC = () => {
    _.each(CompanyArray,company => {
        if (company.player === activePlayer) {
            company.Cohesion();
        }
    })
    RemoveMoveMarkers();   
    //qc from overwatch, note on unit somewhere has passed, ? a green dot
    QCCheck(); //builds array qcUnits
    nextPhase = "CloseCombat";
    RunQC(); //checks it, when 'empty' feed to nextPhase
}

const CloseCombatPhase = () => {
    RemoveDead();
    //qc from overwatch, note on unit somewhere has passed, ? a green dot
    outputCard.body.push("Resolve Close Combats");
    outputCard.body.push("The Active Player determines the order of the Close Combats");
    PrintCard();
}

const DirectFirePhase = () => {
    RemoveMoveMarkers();   
    RemoveDead();
    //spotting from movement phase
    _.each(UnitArray,unit => {
        if (unit.player !== activePlayer) {
            unit.Suppress("B",false);
        }
    })
    outputCard.body.push("Overwatch Fire must take place BEFORE the Active Player begins their own fire");
    outputCard.body.push("Quality Checks will be done at the end of the Phase");
    PrintCard();
}

const SecondQC = () => {
    //qc from Direct Fire
    QCCheck(); //builds array qcUnits
    nextPhase = "FormQC";
    RunQC(); //checks it, when 'empty' feed to nextPhase
}

const StartFormQC = () => {
    RemoveDead();
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
    RemoveDead();
    //place any unit of active players that didnt move or fire on overwatch
    _.each(UnitArray,unit => {
        if (unit.token.get(SM.fired) === false && unit.token.get(SM.move) === false && unit.token.get(SM.double) === false && unit.player === activePlayer && unit.token.get(SM.unavail) === false && unit.weapons.length > 0) {
            //sets overwatch
            unit.SetOverwatch(true);
        }
        //spotting for end phase
        CheckSpotting(unit,"End")
    })
    ButtonInfo("Next Turn ?","!AdvancePhase");
    PrintCard();
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

    const UnitQC = (msg) => {
        if (!msg.selected) {
            sendChat("","No Token Selected");
            return;
        }
        let id = msg.selected[0]._id;
        let unit = UnitArray[id];
        let qcResult = QualityCheck(unit);
        SetupCard(unit.name,"Quality Check",unit.nation);
        outputCard.body.push("Unit " + qcResult.tip + " its Quality Check");
        if (qcResult.extra !== "") {
            outputCard.body.push(qcResult.extra);
        }
        PrintCard();
    }

const CallArtillery = (msg) => {
    let spotterID = msg.selected[0]._id;
    let spotter = UnitArray[spotterID];
    let number = spotter.spotUses || 0;

    SetupCard(spotter.name,"Call Artillery",spotter.nation);

    let errorMsg = [];
    if (Doctrines[spotter.nation] === "Soviet" && spotter.special.includes("Recon") === false && spotter.special.includes("Forward Observer") === false) {
        number = CompanyArray[spotter.companyID].spotUses || 0;
        if (number > 1) {
            errorMsg.push("Company FO has already spotted this round");
        }
    } else if (spotter.special.includes("Recon") || spotter.special.includes("Forward Observer") && number > 1) {
        errorMsg.push("FO Has spotted already spotted twice this round");
    } else if (number > 0) {
        errorMsg.push("Unit has spotted already spotted this round");
    }
    if (artUnits.length === 0) {
        errorMsg.push("There is no Available Artillery");
    }

    if (errorMsg.length > 0) {
        _.each(errorMsg,msg => {
            outputCard.body.push(msg);
        })
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
        let abilityName = (i+1) + ": " + artUnits[i].name;
        let add = "";
        if (artUnits[i].mrls === true) {
            let poss = parseInt(artUnits[i].token.get("bar3_value"));
            for (let p=0;p<poss;p++) {
                add += "|" + (p+1);
            }
            add = ";?{Fire Units" + add + "}"
        }
        let shellType = ";?{Type";
        if (artUnit.shellType.includes("HE")) {
            shellType += "|HE";
        }
        if (artUnit.shellType.includes("Smoke")) {
            shellType += "|Smoke";
        }
        let action = "!AddArtillery;" + newToken.id + ";" + spotter.id + ";" + artUnits[i].id + shellType + "}" + add;
        AddAbility(abilityName,action,charID);
    }
    //then add a macro for check LOS, and a macro for Commit
    abilityName = "Check LOS";
    action = "!CheckLOS;" + spotter.id + ";" + newToken.id;
    AddAbility(abilityName,action,charID);
    abilityName = "Commit";
    action = "!CommitArtillery";
    AddAbility(abilityName,action,charID);
    areaFire = {
        centre: "",
        artUnitIDs: [],
        type: "",
        spotterID: spotter.id,
        mrls: false, //flag
        fu: 0, //MRLS can add variable #
        info: {},  //unit IDs and how many FU contributed for MRLS
    };
    let target = new Unit(newToken.id);
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
    let fu = Tag[5];//for MRLS

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

//cant mix MRLS and non


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
        areaFire.centre = target.hexLabel;
        target.token.set("lockMovement",true);
    }
    areaFire.artUnitIDs.push(artilleryID);
    if (fu) {
        areaFire.fu += parseInt(fu);
        areaFire.info[artilleryID] = parseInt(fu);
        areaFire.mrls = true;
    }
    sendChat("",artillery.name + " Added to Barrage");
}


const CommitArtillery = (msg) => {
    areaFireList.push(areaFire);
    _.each(areaFire.artUnitIDs,unitID => {
        let index = artUnits.map(e => e.id).indexOf(unitID);
        artUnits.splice(index,1);
    })
    let spotter = UnitArray[areaFire.spotterID];
    if (Doctrines[spotter.nation] === "Soviet" && spotter.special.includes("Recon") === false && spotter.special.includes("FO") === false) {
        CompanyArray[spotter.companyID].spotUses++;
    } else {
        spotter.spotUses++;
    }
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







    const changeGraphic = (tok,prev) => {
        //RemoveLines();
        let unit = UnitArray[tok.id];
        if (unit) {
            let label = (new Point(tok.get("left"),tok.get("top"))).label();
            let prevLabel = (new Point(prev.left,prev.top)).label();
            if (label !== unit.hexLabel || tok.get("rotation") !== prev.rotation) {
                RemoveMoveMarkers();   
                let move = parseInt(tok.get("bar1_value")) || 0;
                if (state.FFT.turn > 0 && tok.get("name").includes("Target") === false && currentPhase !== "Deployment") {
                    if (HexMap[label].moveCosts[unit.moveType] === -1 || (move <= 0 && prevLabel !== label) || unit.token.get(SM.down)) {
                        tok.set("left",prev.left);
                        tok.set("top",prev.top);
                        tok.set("rotation",prev.rotation);
                        if (move <= 0) {
                            sendChat("","No Movement Points");
                        } else if (unit.token.get(SM.down)) {
                            sendChat("","Unit has Gone to Ground for the remainder of the turn");
                        } else {
                            sendChat("","Hex is Impassable to this Unit");
                        }
                        return;
                    }
                    if (prevLabel !== label && HexMap[unit.startHexLabel].offboard === false && HexMap[label].offboard === false) {
                        let results = aStar(unit,label);
                        label = results.finalHexLabel;
                        let cost = results.cost;
                        let marker = (cost <= unit.movement/2) ? SM["move"]:SM["double"];
                        tok.set({
                            left: HexMap[label].centre.x,
                            top: HexMap[label].centre.y,
                        });
                        tok.set(SM.move,false);
                        tok.set(SM.double,false);
                        if (cost > 0) {
                            tok.set(marker,true);
                        }

                        let angle = Angle(HexMap[unit.startHexLabel].cube.angle(HexMap[label].cube));
                        tok.set({
                            rotation: angle,
                            bar1_value: unit.movement - cost,
                        })
                    } else if (prevLabel === label && tok.get("rotation") === unit.startRotation) {
                        tok.set(SM.move,false);
                        tok.set(SM.double,false);
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

    const ResetMove = (msg) => {
        RemoveMoveMarkers();
        if (!msg.selected) {
            sendChat("","No Token Selected");
            return;
        }
        let id = msg.selected[0]._id;
        let unit = UnitArray[id];
        if (unit && unit.token) {
            let hex = HexMap[unit.startHexLabel];
            unit.token.set({
                left: hex.centre.x,
                top: hex.centre.y,
                rotation: unit.startRotation,
            })
            unit.token.set(SM.move,false);
            unit.token.set(SM.double,false);
        }
    }



    const aStar = (unit,endHexLabel) => {
        let startHex = HexMap[unit.startHexLabel];
        let endHex = HexMap[endHexLabel];
log("Start: " + startHex.label)
log("End: " + endHex.label)
        let move = unit.movement;
        if (unit.CheckSuppression() === true) {
            move = Math.max(0,move - 2);
        }


log("Move: " + move)
        let distance = startHex.cube.distance(endHex.cube);
log("Distance: " + distance)
        let nodes = 1;
        let explored = [];
        let frontier = [{
            label: startHex.label,
            cost: 0,
            estimate: distance,
        }]

        while (frontier.length > 0) {
            //sort paths in frontier by cost,lowest cost first
            //choose lowest cost path from the frontier
            //if more than one, choose one with highest cost       
            frontier.sort(function(a,b) {
                return a.estimate - b.estimate || b.cost - a.cost; //2nd part used if estimates are same
            })
            let node = frontier.shift();
log("Node: " + node.label)
            nodes++;
            explored.push(node); //add this node to explored paths
            //if this node reaches goal, end loop
            if (node.label === endHexLabel) {
                break;
            }
            //generate possible next steps
            let next = HexMap[node.label].cube.neighbours();
            //for each possible next step
            for (let i=0;i<next.length;i++) {
                //calculate the cost of the next step 
                //by adding the step's cost to the node's cost
                let stepCube = next[i];
                let stepHexLabel = stepCube.label();
                let stepHex = HexMap[stepHexLabel];
                if (!stepHex) {continue};
                if (stepHex.offboard === true) {continue};
                let cost = stepHex.moveCosts[unit.moveType];
                if (cost === -1) {continue}
                if (stepHex.road === true && HexMap[node.label].road === true && state.FFT.roads === true && stepHex.terrain.includes("Wrecks") === false && stepHex.terrain.includes("Craters") === false) {
                    cost = RoadCosts[unit.moveType];
                }


                //check if this step has already been explored
                let isExplored = (explored.find(e => {
                    return e.label === stepHexLabel
                }));
                //avoid repeated nodes during the calcualtion of neighbours
                let isFrontier = (frontier.find(e => {
                    return e.label === stepHexLabel
                }));
                //if this step has not been explored
                if (!isExplored && !isFrontier) {
log("StepHex: " + stepHexLabel + " Added, Cost: " + cost)
                    let est = cost + stepHex.cube.distance(endHex.cube);
                    //add the step to the frontier
                    frontier.push({
                        label: stepHexLabel,
                        cost: cost,
                        estimate: est,
                    })
                }

            }
        }

        //if there are no paths left to explore or hit end hex
        let finalHexLabel = startHex.label;
        let totalCost = 0;
        if (explored.length > 0) {
            explored.sort((a,b) => {
                return b.estimate - a.estimate || a.cost - b.cost;
            })
log("Explored")
log(explored)



            let coverStart = startHex.cover > 0 ? true:false;
            let final = explored.length - 1;
            for (let i=1;i<explored.length;i++) {
                totalCost += explored[i].cost;
                let hexCover = HexMap[explored[i].label].cover > 0 ? true:false;
                if (totalCost > move) {
                    totalCost -= explored[i].cost;
                    final = i - 1; //prev hex
                    sendChat("","Stopped at limit of movement")
                    break;
                }
                if (unit.quality.includes("Fair") && coverStart === true && hexCover === false && unit.coverTest === false) {
                    //response check to leave cover, only needs to do once
                    unit.coverTest = true;
                    let responseRoll = randomInteger(6);
                    let target = Nations[unit.nation].response;
                    let tip = "Response Roll: " + responseRoll + " vs. " + target + "+";
                    tip = '[Unit](#" class="showtip" title="' + tip + ')';
                    if ((responseRoll < target && responseRoll !== 6) || responseRoll === 1) {
                        SetupCard(unit.name,"Breaking Cover",unit.nation);
                        outputCard.body.push("The " + tip + " Goes to Ground in Cover");
                        PrintCard();
                        totalCost -= explored[i].cost;
                        unit.token.set(SM.down,true);
                        final = i - 1; //prev hex
                        break;
                    }
                }
log(explored[i].label)
log(totalCost)
                AddMoveMarker(totalCost, explored[i].label);
            }
            finalHexLabel = explored[final].label;
        } else {
            sendChat(""," No Path to this Hex");
        }
log("Final Hex Label: " + finalHexLabel)

        let info = {
            finalHexLabel: finalHexLabel,
            cost: totalCost,
        }
        return info;
    }

    const RemoveMoveMarkers = () => {
        _.each(state.FFT.moveMarkers,markerID => {
            let tok = findObjs({_type:"graphic", id: markerID})[0];
            if (tok) {
                tok.remove();
            }
        })
        state.FFT.moveMarkers = [];
    }

    const AddMoveMarker = (cost,hexLabel) => {
        let c = HexMap[hexLabel].centre;
        cost = Math.round(cost);
        img = getCleanImgSrc(MoveMarkers[cost]);
        width = 25;
        height = 25;
        markerName = "Map Marker";
        let newToken = createObj("graphic", {
            left: c.x,
            top: c.y,
            width: width,
            height: height, 
            name: markerName,
            pageid: Campaign().get("playerpageid"),
            imgsrc: img,
            layer: "map",
        })

        if (newToken) {
            toFront(newToken);
        } 
        state.FFT.moveMarkers.push(newToken.id);
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
                log("Map Areas");
                log(MapAreas);
                log("Units");
                log(UnitArray);
                log("Formations");
                log(FormationArray)
                log("Companys");
                log(CompanyArray);
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
            case '!DefineCompany':
                DefineCompany(msg);
                break;
            case '!Roll':
                RollDice(msg);
                break;
            case '!UnitQC':
                UnitQC(msg);
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
            case '!RunFQC':
                RunFQC();
                break;
            case '!TakeFQC':
                TakeFQC(msg);
                break;
            case '!CheckArtillery':
                CheckArtillery();
                break;
            case '!DirectFire':
                DirectFire(msg)
                break;
            case '!ResetMove':
                ResetMove(msg);
                break;
            case '!Transport':
                Transport(msg);
                break;
            case '!AddArtillery':
                AddArtillery(msg);
                break;
            case '!CommitArtillery':
                CommitArtillery(msg);
                break;
            case '!AreaFire':
                ResolveAreaFire();
                break;

        }
    };

    function displayCurrentTime() {
        let now = new Date();
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        hours -= 5; //GMT to EST
        ampm = hours > 12 ? " PM":" AM";
        hours = hours > 12 ? hours-12:hours;
        let time = hours + ":" + minutes + ampm
        return time
    }



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
        sendChat("","API Ready at " + displayCurrentTime());
        log("On Ready Done")
    });
    return {
        // Public interface here
    };






})();


