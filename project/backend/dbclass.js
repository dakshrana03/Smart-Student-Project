const mongoclient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const url = "mongodb+srv://Sean:Team30@cluster0.lcbelp3.mongodb.net/webserver";
const client = new mongoclient(url);

/*NOTE: PLEASE ADD parameter username and add field for username!!*/

/**
 * Tests the connection of database
 */
exports.run = async () => {
    try {
        await client.connect();
        console.log("[Database]: Connecting to database Webserver...");

        await client.db("webserver").command({ ping: 1 });
        console.log("[Database]: connection established.");
    } finally {
        await client.close();
        console.log("[Database]: Connection closed\n");
    }
}

/**
 * Insert a basic class object in the database
 * @param creator
 * @param {String} cName
 * @param {String} cColor
 */
exports.insert_class = async (creator, cName, cColor) => {
    if (cName === "" || cName == null || cColor === "" || cColor == null || creator == null || creator === "") { // check for empty inputs
        throw new Error("[Database]: Inputs cannot be empty, cannot create class.");
    }
    let baseClassObj = { usr: creator, ClassName: cName, ClassColor: cColor, ClassTags: [], TodoTags: [] }; // create the object
    if (await client.db().collection("classes").findOne({ $and: [{ usr: creator }, { ClassName: cName }] }) != null) { // check for duplicate name
        throw new Error(`[Database]: ${cName} already exist within classes collection.`);
    }
    await client.db().collection("classes").insertOne(baseClassObj); // add object to collection
    console.log(`[Database]: Class ${cName} is added to database.`);
}

/**
 * Updates an existing data in database
 * @param creator
 * @param {String} dataName - Name of the class
 * @param {String} newKey - new Key object
 * @param {*} newVal - new value
 */
exports.update_class = async (creator, dataName, newKey, newVal) => {
    let newObj = {};
    if (newKey === "" || newKey == null || newVal === "" || newVal == null || creator == null || creator === "") {
        throw new Error("inputs cannot be empty, cannot update class.");
    }
    newObj[newKey] = newVal; // create the object
    if (await client.db().collection("classes").findOne({ $and: [{ usr: creator }, { ClassName: dataName }] }) == null) {
        // if(!classExist(dataName)){
        throw new Error("[Database]: Class does not exist within class collection, cannot update class.");
    } else {
        await client.db().collection("classes").findOneAndUpdate({ $and: [{ usr: creator }, { ClassName: dataName }] }, { $set: newObj });
        console.log("[Database]: update_class complete.");
    }
}

/**
 * Delete a class from the database based on the name of the data
 * @param creator
 * @param {String} dataName - name of the class about to be deleted
 */
exports.delete_class = async (creator, dataName) => {
    if (dataName === "" || dataName == null) {
        throw new Error("[Database]: Inputs cannot be empty, cannot delete class.");
    }

    if (await client.db().collection("classes").findOne({ $and: [{ usr: creator }, { ClassName: dataName }] }) == null) {
        // if(!classExist(dataName)){
        throw new Error("[Database]: Class does not exist within class collection, " +
            "cannot delete class.");
    } else {
        await client.db().collection("classes").findOneAndDelete({ $and: [{ usr: creator }, { ClassName: dataName }] });
        console.log("[Database]: delete_class complete.");
    }
}

/**
 * Get all classes within class data with a class name 
 * @returns list of all the classes in the collection
 */
exports.get_allClass = async (usr) => {
    await client.connect();
    return await client.db().collection('classes').find({ usr: usr }).toArray();
}

/**
 * Gets a specific class
 * @param {*} classNeeded - Name of the class needed
 * @param {*} usr - Creator/client name
 * @returns the specific class
 */
exports.getSpecificClass = async (classNeeded, usr) => {
    await client.connect();
    let result = await client.db().collection('classes').findOne({ $and: [{ usr: usr }, { ClassName: classNeeded }] });
    if (result == null) {
        console.log(`[Database] : The class does not exist for ${usr}`);
        throw new Error(`[Database] : The user does not exist.`);
    } else {
        return result;
    }
}
/**
 * Links other JSON object from other modules if they are related to a specific class by adding their objectID to TodoTags
 * @param {*} classNeeded - Name of the class
 * @param {*} usr - Creator/client name
 * @param {*} objID - objectID of todo object
 */
exports.addTodoTags = async (classNeeded, usr, objID) => {
    await client.connect();
    let findObj = await client.db().collection('classes').findOne({ $and: [{ usr: usr }, { ClassName: classNeeded }] });
    if (findObj == null) throw `[Database] : Class ${classNeeded} does not exist for user ${usr}. Cannot add an object ID`;
    if (findObj.ClassName == classNeeded) {
        await client.db().collection('classes').findOneAndUpdate(findObj, { $push: { TodoTags: objID } });
        console.log(`[Database] : added todo task \"${objID}\" to class ${classNeeded}`);
    }
}

/**
 * Edits the tags linked to the class if it is getting edited. If tag does not exist, add it. If it already exist,
 * do nothing as nothing will change the TodoTags array. Otherwise delete it.
 * @param {String} newTag - new tag to replace old
 * @param {String} usr - creator/client name
 * @param {String} objID -objectID of todo object
 */
exports.editTodoTags = async (newTag, usr, objID) => {
    await client.connect();
    let findObj = await client.db().collection('classes').findOne({ $and: [{ usr: usr }, { TodoTags: objID }] });
    if (findObj == null)
        throw `[Database] : The ${objID} does not exist to ${usr}, cannot edit tags.`;
    else if (findObj.ClassName != newTag) {
        await client.db().collection('classes').findOneAndUpdate(findObj, { $pull: { TodoTags: objID } });
        this.addTodoTags(newTag, usr, objID);
        console.log(`[Database] : unlinked ${objID} from ${findObj.ClassName}`)
    } else
        console.log(`[Database] : ${objID} already linked to ${findObj.ClassName}`)
}

/**
 * Unlinks todo object from class object if its deleted.
 * @param {String} usr - creator/client name
 * @param {String} objID - objectID of todo object
 */
exports.deleteTodoTags = async (usr, objID) => {
    await client.connect();
    let findObj = await client.db().collection('classes').findOne({ TodoTags: objID });
    await client.db().collection('classes').findOneAndUpdate(findObj, { $pull: { TodoTags: objID } });
}

/**
 * Gets all the todo object linked to the class.
 * @param {*} usr - creator/client name
 * @param {*} ClassNeeded - name of the class linked to todo objects we want
 * @returns 
 */
exports.getAllTodoTags = async (usr, ClassNeeded) => {
    await client.connect();
    let findObj = await client.db().collection('classes').findOne({ $and: [{ usr: usr }, { ClassName: ClassNeeded }] });
    let todoObjId = [];
    if (findObj == null) throw `[Database] : Class ${ClassNeeded} does not exist for user ${usr}.`;
    if (findObj.TodoTags.length < 1) return [];
    else {
        console.log('hasdasd');
        findObj.TodoTags.forEach(element => {
            let temp = new ObjectID(element);
            todoObjId.push(temp);
        });
        return await client.db().collection('listings').find({ _id: { $in: todoObjId } }).toArray();
    }
}