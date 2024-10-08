    
/*
--------------------------------------------------------
|                       FUNCTIONS                       |
--------------------------------------------------------
*/

// ##### utility function #####

/**
 * Checks for the existence of the shared key name between the weights and grades subobjects
 * @param {string} key should only be used with weight keys that appear in both the weights and grades subobjects
 * @param {object} jsonOBJ 
 * @returns true if weights and grades have the key, false otherwise
 */
exports.hasWeight = (key, jsonOBJ) => {
    if(jsonOBJ.weights.hasOwnProperty(key) && jsonOBJ.grades.hasOwnProperty(key)) return true;
    else return false;
};


// ##### tag functions #####

/**
 * Sets the tag value of the grade object
 * @param {string} newTag 
 * @param {object} jsonOBJ 
 */
exports.setTag = (newTag, jsonOBJ) => {;
    jsonOBJ.tag = newTag;
};

/**
 * Sets the tag value to null
 * @param {object} jsonOBJ 
 */
exports.deleteTag = (jsonOBJ) => {
    jsonOBJ.tag = null;
};


// ##### weight functions #####

/**
 * Sets the weight value of a given weight key
 * @param {string} key 
 * @param {float} val 
 * @param {object} jsonOBJ 
 */
exports.setWeightVal = (key, val, jsonOBJ) => {
    if (jsonOBJ.weights.hasOwnProperty(key)){
        jsonOBJ.weights[key] = val;
    } else throw `[Warning] setWeightVal(): No such key ${key}`; 
    // console.log("[Warning] setWeightVal(): No such key " + key);
};

/**
 * Sets the key name of an already existing weight key
 * @param {string} newKey 
 * @param {string} oldKey 
 * @param {object} jsonOBJ 
 */
exports.setWeightKey = (newKey, oldKey, jsonOBJ) => {
    if (this.hasWeight(oldKey, jsonOBJ)) {
        jsonOBJ.weights[newKey] = jsonOBJ.weights[oldKey];
        jsonOBJ.grades[newKey] = jsonOBJ.grades[oldKey];
        delete jsonOBJ.weights[oldKey];
        delete jsonOBJ.grades[oldKey];
    } else throw `[Warning] setWeightKey(): No such key ${oldKey}`;
    // console.log("[Warning] setWeightKey(): No such key " + oldKey);
};

/**
 * Creates a new weight and grade subobject to the object
 * @param {string} key 
 * @param {float} val 
 * @param {object} jsonOBJ 
 */
exports.addWeight = (key, val, jsonOBJ) => {
    if (!this.hasWeight(key, jsonOBJ)) {
        jsonOBJ.weights[key] = val;
        jsonOBJ.grades[key] = {};
    } else throw `[Warning] addWeight(): Key value ${key} already exists`;
    // else console.log(`[Warning] addWeight(): Key value ${key} already exists`)
};

/**
 * Deletes weight and all grades associated from the subobject of the object
 * @param {string} key 
 * @param {object} jsonOBJ 
 */
exports.deleteWeight = (key, jsonOBJ) => {
    if (this.hasWeight(key, jsonOBJ)) {
        delete jsonOBJ.weights[key];
        delete jsonOBJ.grades[key];
    } else throw `[Warning] deleteWeight(): No such key ${key}`; 
    // else console.log("[Warning] deleteWeight(): No such key " + key);
};


// ##### grade functions #####

/**
 * Sets the value of a specified grade (gKey), within a specified weight bracket (wKey)
 * @param {string} wKey /
 * @param {string} gKey 
 * @param {float} newVal 
 * @param {object} jsonOBJ 
 */
exports.setGradeVal = (wKey, gKey, newVal, jsonOBJ) => {
    var key = wKey;
    var hasKey = false;
    if (this.hasWeight(wKey, jsonOBJ)){
        key = gKey;
        if (jsonOBJ.grades[wKey].hasOwnProperty(gKey)) {
            hasKey = true;
            jsonOBJ.grades[wKey][gKey] = newVal;
         }
    }
    if (!hasKey) {
        console.log("[Warning] setGradeVal(): No such key " + key);
    }
};

/**
 * Sets the name of an object in the grades subobject list object
 * @param {string} newKey 
 * @param {string} oldKey 
 * @param {string} wKey 
 * @param {object} jsonOBJ 
 */
exports.setGradeKey = (newKey, oldKey, wKey, jsonOBJ) => {
    var key = wKey;
    var hasKey = false;
    if (this.hasWeight(wKey, jsonOBJ)) {
        key = oldKey;
        if (jsonOBJ.grades[wKey].hasOwnProperty(oldKey)){
            hasKey = true;
            jsonOBJ.grades[wKey][newKey] = jsonOBJ.grades[wKey][oldKey];
            delete jsonOBJ.grades[wKey][oldKey];
        }
    }
    if (!hasKey) {
        // console.log("[Warning] setGradeKey(): No such key " + key);
        throw "[Warning] setGradeKey(): No such key " + key;
    }
};

/**
 * Creates a new grade entry in the grades subobject
 * @param {string} key 
 * @param {number} val
 * @param {string} wKey 
 * @param {object} jsonOBJ 
 */
exports.addGrade = (key, val, wKey, jsonOBJ) => {
    if (this.hasWeight(wKey, jsonOBJ)) {
        if (!jsonOBJ.grades[wKey].hasOwnProperty(key))
            jsonOBJ.grades[wKey][key] = val;
        // else console.log(`[Warning] addGrade(): Key ${key} already exists`);
        else throw `[Warning] addGrade(): Key ${key} already exists`
    }  else throw "[Warning] addGrade(): No such weight key " + wKey
    //else console.log("[Warning] addGrade(): No such weight key " + wKey);
};

/**
 * Deletes individual grade from a specified weight subgroup in grades group
 * @param {string} wKey 
 * @param {string} gKey 
 * @param {object} jsonOBJ 
 */
exports.deleteGrade = (wKey, gKey, jsonOBJ) => {
    var key = wKey;
    var hasKey = false;
    if (this.hasWeight(wKey, jsonOBJ)) {
        key = gKey;
        if (jsonOBJ.grades[wKey].hasOwnProperty(gKey)) {
            hasKey = true;
            delete jsonOBJ.grades[wKey][gKey];
        }
    }
    if (!hasKey) {
        throw `[Warning] deleteGrade(): No such key ${key}`;
        // console.log("[Warning] deleteGrade(): No such key " + key);
    }
};

// ##### TESTING #####

/**
 * Function to easily string the current tested function.
 * @param {string} funcName name ofthe function being tested
 */
function test(funcName) {
    return "[Testing] " + funcName + ": result should be ";
};

/**
 * Base grade object format
 */

function run_test(){
    var grades = {
    "tag": null,
    "weights": {},
    "grades": {}
}

var newTag = "CPMT370";
var wKey = "Project";
var wKey2 = "Exams"
var wVal = 0.3;
var wVal2 = 0.5;
var gKey = "Deliverable 1";
var gKey2 = "Midterm";
var gVal = 0.88;
var gVal2 = 0.66;


console.log("Initial grades object: " + JSON.stringify(grades));
console.log(" ")
// ##### checking hasWeight #####
console.log(test("hasWeight") + "false");
// console.log(hasWeight("key", grades));
console.log(" ")

// ##### tag tests #####
console.log(test("setTag") + newTag);
this.setTag(newTag, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("deleteTag") + "null");
deleteTag(grades);
console.log(JSON.stringify(grades));
console.log(" ")

// ##### grade tests #####
console.log(test("addWeight") + `new weight {${wKey}: ${wVal}} and grades {${wKey}: {}}`);
addWeight(wKey, wVal, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("addWeight") + `no change`);
addWeight(wKey, wVal2, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("addGrade") + `new grade entry {${gKey}: ${gVal}}`);
addGrade(gKey, gVal, wKey, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("addGrade") + `a failure`);
addGrade(gKey, gVal, "wKey", grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("addGrade") + `no duplicate grade name entry {${gKey}: ${gVal2}}, cannot have two with same key and rejects the entry`);
addGrade(gKey, gVal2, wKey, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("deleteGrade") + `removed grade entry {${gKey}: ${gVal}}`);
deleteGrade(wKey, gKey, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("addGrade") + `new grade entry {${gKey}: ${gVal}}`);
addGrade(gKey, gVal, wKey, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("setGradeVal") + `a grade value change to {${gKey}: ${gVal2}}`);
setGradeVal(wKey, gKey, gVal2, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("setGradeVal") + `a grade key change to {${gKey2}: ${gVal2}}`);
setGradeKey(gKey2, gKey, wKey, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("setWeightVal") + `a weight value change to {${wKey}: ${wVal2}}`);
setWeightVal(wKey, wVal2, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("setWeightKey") + `a weight key change to {${wKey2}: ${wVal2}}`);
setWeightKey(wKey2, wKey, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("deleteWeight") + `failure`);
deleteWeight(wKey, grades);
console.log(JSON.stringify(grades));
console.log(" ")

console.log(test("deleteWeight") + `weight {} and grades {}`);
deleteWeight(wKey2, grades);
console.log(JSON.stringify(grades));
console.log(" ")
}

