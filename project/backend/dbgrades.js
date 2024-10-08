'use strict'
const mongoclient = require('mongodb').MongoClient;
const url = "mongodb+srv://Sean:Team30@cluster0.lcbelp3.mongodb.net/webserver";
const client = new mongoclient(url);
// import * as gm from './gradeMethods'
const gm = require('./gradeMethods');
const dbclass = require('./dbclass');

/*NOTE: PLEASE ADD parameter username and add field for username!!*/

/**
 * Insert a grade objecct in the databse
 * @param creator
 * @param {String} gradeName - name of the grade object, assignment name for example.
 * @param {String} tag - tag for linking to other data objects
 */
exports.insert_grade = async (creator, gradeName, tag=null) => {
    let baseGradeObj = {name: gradeName, tag: tag, weights: {}, grades: {},
    usr: creator};
    try{
        await client.connect();
        if(gradeName === "" || gradeName == null || creator === "" || creator == null){
            throw "[Database]: Name cannot be empty."
        }
        if(await client.db().collection("grades").findOne({$and: [{usr: creator}, {name: gradeName}]}) != null){
            throw `[Database]: ${gradeName} already exist on the server.`
        }
        await client.db().collection("grades").insertOne(baseGradeObj);
        console.log(`[Database]: Grades added to database`);
    } catch(err){
        console.log(err);
    } 
    finally{
        // await client.close();
        if(tag != null){
            await this.set_tag(gradeName, tag);
        }
    }
}

/**
 * Find the name of the grade and add a tag and link to the class. If there is no newTag, delete the tag associated and unlink. Also, throw an exception if the gradeName's tag
 * is already empty.
 * @param creator
 * @param {*} gradeName - name of the grade object
 * @param {*} newTag - the new tag of the grade object
 */
exports.set_tag = async (creator, gradeName, newTag=null) => {
    let dataInQuestion = {$and: [{usr: creator}, {name: gradeName}]};
    let oldTag = null;
    let gradeObj = {};
    try{
        await client.connect();
        if(newTag == null){
            gradeObj = await client.db().collection("grades").findOne(dataInQuestion).then(
                result => {
                    if(result.tag == null){
                        throw "[Database]: the class object does not have tags already";
                    }
                    else{
                        oldTag = result.tag;
                        gm.deleteTag(result);
                        return result;
                    }
            });
            await client.db().collection("grades").findOneAndReplace(dataInQuestion, gradeObj);
            await client.db().collection("grades").findOneAndDelete(dataInQuestion);
            await client.db().collection("classes").findOneAndUpdate({$and: [{usr: creator}, {ClassName: oldTag}]}, {$pull: {ClassTags: gradeObj._id}});
            console.log(`[Database]: Deleted and unlinked grade object from respective class object`);
        }
        else{
            gradeObj = await client.db().collection("grades").findOne(dataInQuestion).then( // replace the grade tag first
                result => {
                    gm.setTag(newTag, result);
                    return result;
            });
            await client.db().collection("grades").findOneAndReplace(dataInQuestion, gradeObj); // replace the null from the class name
            await client.db().collection("classes").findOneAndUpdate({$and: [{usr: creator}, {ClassName: newTag}]}, {$addToSet: {ClassTags: gradeObj._id}}) //update the class tag list in class object
        }
    } catch(err) {
        console.log(err);
    } 
    // finally {
    //     await client.close();
    // }
}

/**
 * Adds weight percentagee to the grade object. Throw error if the key already exist inside the class object
 * @param creator
 * @param weightKey
 * @param weightVal
 * @param gradeName
 */
exports.addWeight = async (creator, weightKey, weightVal, gradeName) => {
    let findObj = {$and: [{usr: creator}, {name: gradeName}]};
    await client.connect();
    try{
        if(typeof weightVal != "number"){
            throw "[Database]: gradeVal is not a number";
        }
        let gradeObj = await client.db().collection("grades").findOne(findObj).then(
            result => {
                gm.addWeight(weightKey, weightVal, result);
                return result;
            }
        )
        await client.db().collection("grades").findOneAndReplace(findObj, gradeObj);
    } catch(err) {
        console.log(err);
    } 
}

/**
 * Finds the grade schema object named gradeName and parses to finds the appropriate weightKey.
 * After it finds it, add the name of your assignment(gradeKey) and the grade you got for it(gradeVal).
 * They will be sorted by their weights (from weight key)
 * @param creator
 * @param {String} gradeKey - Name of grade (assignment 2 for example)
 * @param {number} gradeVal - grade value for the gradeKey (what grade did you get)
 * @param {String} weightKey - type of grade is it for (assignments, projects, etc)
 * @param {String} gradeName - Name of the scheme (the object)
 */
exports.addGrade = async (creator, gradeKey, gradeVal, weightKey, gradeName) => {
    let findObj = {$and: [{usr: creator}, {name: gradeName}]};
    await client.connect();
    try{
        if(typeof gradeVal != "number"){
            throw "[Database]: gradeVal is not a number";
        }
        let gradeObj = await client.db().collection("grades").findOne(findObj).then(
            result => {
                gm.addGrade(gradeKey, gradeVal, weightKey, result);
                return result;
            }
        )
        await client.db().collection("grades").findOneAndReplace(findObj, gradeObj);
    } catch(err){
        console.log(err);
    } 
    // finally {
    //     client.close();
    // }
}

exports.changeGradeKey = async (creator, newKey, oldKey, wKey, gradeName) => {
    let findObj = {$and: [{usr: creator}, {name: gradeName}]};
    await client.connect();
    try{
        let gradeObj = await client.db().collection("grades").findOne(findObj).then(
            result => {
                gm.setGradeKey(newKey, oldKey, wKey, result);
                return result;
            }
        );
        await client.db().collection("grades").findOneAndReplace(findObj, gradeObj);
    }catch(err){
        console.log(err);
    } 
    finally {
        console.log(await client.db().collection('grades').findOne(findObj));
    }
}

exports.changeGradeVal = async (creator, wKey, gKey, newVal, gradeName) => {
    let findObj = {$and: [{usr: creator}, {name: gradeName}]};
    await client.connect();
    try{
        if(typeof newVal != "number"){
            throw "[Database]: newVal must be a number"
        }
        let gradeObj = await client.db().collection("grades").findOne(findObj).then(
            result => {
                gm.setGradeVal(wKey, gKey, newVal, result);
                return result;
            }
        );
        await client.db().collection("grades").findOneAndReplace(findObj, gradeObj);
    } catch(err) {
        console.log(err);
    } 
    finally {
        console.log(await client.db().collection('grades').findOne(findObj));
    }
}

/**
 * Deletes a specific grade with a weight. If it does not exist or the object itself does not too,
 * throw an exception
 * @param {String} creator - name of the client 
 * @param {String} gradeName - grade object
 * @param {String} wKey - weight key (needed)
 * @param {String} gKey - grade key (what we need to delete)
 */
exports.deleteGrade = async (creator, gradeName, wKey, gKey) => {
    let findObj = {$and: [{usr: creator}, {name:gradeName}]};
    await client.connect();
    let gradeObj = await client.db().collection('grades').findOne(findObj).then(
        result => {
            if(result == null)
                throw `[Database]: ${gradeName} created by ${creator} does not exist.`;
            gm.deleteGrade(wKey, gKey, result);
            return result;
        }
    )
    await client.db().collection('grades').findOneAndReplace(findObj, gradeObj);
    console.log(`[Database]: Deleted grade ${gKey} from ${gradeName}`);
}

/**
 * Renames a weight key of gradeName object. Throw an exception if the object does not exist or
 * the key does not exist in the object.
 * @param {String} creator - name of client
 * @param {String} gradeName - grade object
 * @param {String} newKey - weight key to be added
 * @param {String} oldKey - replaced by newKey
 */
exports.setWeightKey = async (creator, gradeName, newKey, oldKey) => {
    let findObj = {$and: [{usr: creator}, {name:gradeName}]};
    await client.connect();
    let gradeObj = await client.db().collection('grades').findOne(findObj).then(
        result => {
            if(result == null){
                throw `[Database]: ${gradeName} created by ${creator} does not exist.`;
            }
            gm.setWeightKey(newKey, oldKey, result);
            return result;
        }
    );
    await client.db().collection('grades').findOneAndReplace(findObj, gradeObj);
    console.log(`[Database]: replaced ${oldKey} with ${newKey} on ${gradeName}`);
}

/**
 * Sets the weight value of a specific weight data. For example, it sets a weight of
 * Projects to 0.5 in terms of the total grade.
 * @param {*} creator - name of client
 * @param {*} gradeName - grade object
 * @param {*} curKey - weight Key
 * @param {*} curVal - weight value assigned to weight Key
 */
exports.setWeightVal = async (creator, gradeName, curKey, curVal) => {
    if(curVal >= 1.0)
        throw `[Database]: ${curVal} cannot be greater than 1.0`;
    let findObj = {$and: [{usr: creator}, {name:gradeName}]};
    await client.connect();
    let gradeObj = await client.db().collection('grades').findOne(findObj).then(
        result => {
            if(result == null){
                throw `[Database]: ${gradeName} created by ${creator} does not exist.`;
            }
            gm.setWeightVal(curKey, curVal, result);
            return result;
        }
    );
    await client.db().collection('grades').findOneAndReplace(findObj, gradeObj);
    console.log(`[Database]: ${curKey} with a value of ${curVal} has been set`);
}

/**
 * Deletes the a weight key along with it's associated grade data along with it.
 * @param {String} creator - name of client
 * @param {String} gradeName -grade object
 * @param {String} key - weight key
 */
exports.deleteWeight = async (creator, gradeName, key) => {
    let findObj = {$and: [{usr: creator}, {name:gradeName}]};
    await client.connect();
    let gradeObj = await client.db().collection('grades').findOne(findObj).then(
        result => {
            if(result == null){
                throw `[Database]: ${gradeName} created by ${creator} does not exist.`;
            }
            gm.deleteWeight(key, result);
            return result;
        }
    )
    await client.db().collection('grades').findOneAndReplace(findObj, gradeObj);
    console.log(`[Database]: deleted weight ${key} from ${gradeName}`);
}

/**
 * Get all classes within class data with a class name
 * @returns list of all the classes in the collection
 */
exports.get_allGrades = async (usr) => {
    return await client.db().collection('grades').find({usr: usr}).toArray();
}

function tests() {
    changeGradeKey("Project 25", "Project 2312", "Projects", "Grade Schemes")
    changeGradeVal("Projects", "Project 2", 102, "Grade Schemes")
    insert_class("GEOL121", "yellow");
    deleteGrade("jason", "Grade Schemes", "Projects", "Project 3");
    setWeightKey("jason", "Grade Schemes", "Projects", "New Projects");
    setWeightVal("jason", "Grade Schemes", "Projects", 0.5);
    deleteWeight("jason", "Grade Schemes", "Proasdasdjects");
}