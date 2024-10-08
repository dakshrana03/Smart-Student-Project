const mongoclient = require('mongodb').MongoClient;
const url = "mongodb+srv://Sean:Team30@cluster0.lcbelp3.mongodb.net/webserver";
const client = new mongoclient(url);

/*
--------------------------------------------------------
|                     DB FUNCTIONS                     |
--------------------------------------------------------
*/

/**
 * Creates a new empty user in the database
 * @param usrName unique name for the user (client)
 * @param usrPassword user set password (client)
 * @returns {Promise<void>}
 */
exports.create_user = async (usrName, usrPassword) => {
    if(usrName === "" || usrName == null || usrPassword === "" || usrPassword == null){ // check for empty inputs
        throw new Error("[Database]: Inputs cannot be empty, cannot create user.");
    }

    let baseUsrObj = {usr: usrName, pwd: usrPassword}; // create the object
    if(await client.db().collection("users").findOne({usr: usrName}) != null){ // check for duplicate username
        throw new Error(`[Database]: ${usrName} already exist within users collection.`);
    } else {
        await client.db().collection("users").insertOne(baseUsrObj); // add object to collection
        console.log(`[Database]: Class ${usrName} is added to database.`);
    }
}

exports.authorize_user = async (usrName, usrPassword) => {
    if(usrName === "" || usrName == null || usrPassword === "" || usrPassword == null){ // check for empty inputs
        throw new Error("[Database]: Inputs cannot be empty, cannot login user.");
    }

    let usrObj = await client.db().collection("users").findOne({usr: usrName}); // get object from db
    if(usrObj === null) { // check if object exists
        throw new Error(`[Database]: User ${usrName} does not exist, cannot login user.`);
    }
    else return usrObj.pwd === usrPassword;
}
/*
-------------------------------------------------------
|                    SUB FUNCTIONS                    |
-------------------------------------------------------
*/

/**
 * Takes a data object and writes the users data to it
 * @param {string} userID mongoDB object id for the user
 * @param {object} jsonOBJ object of a data type
 */
exports.linkUser = (userID, jsonOBJ) => {
    jsonOBJ.usrID = userID;
}

exports.searchByCookie = (usrName) => {

}