'use strict'

/* ---------------------------- REQUIRE & IMPORTS  --------------------------- */
const express = require('express');
const bodyParser = require('body-parser');
const dbusers = require("./backend/dbusers");
const dbclass = require("./backend/dbclass");
const dbgrades = require("./backend/dbgrades");
const path = require('path');
const cookieParser = require("cookie-parser");
const fs = require('fs');

//To-DO
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
/* ---------------------------- To-DO --------------------------- */
// import * as dbgrades from "./backend/dbgrades"

/* ---------------------------- DB --------------------------- */
const mongoclient = require('mongodb').MongoClient;
const url = "mongodb+srv://Sean:Team30@cluster0.lcbelp3.mongodb.net/webserver";
const client = new mongoclient(url);

try {
    client.connect();
    console.log("[Database]: Connecting to database Webserver...");

    client.db("webserver").command({ ping: 1 });
    console.log("[Database]: connection established.");
} catch (e) {
    console.log(e);
}

/* ---------------------------- HTML --------------------------- */

//To-Do
const MONGO_URL = "mongodb://127.0.0.1:27017/Listing";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(url);
}
/* ---------------------------- To-DO --------------------------- */

const PORT = 8080;
const HOST = "0.0.0.0";
const app = express();

//HTML files here!
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('frontend'));

//To-Do
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join((__dirname, "public"))));



app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '/frontend/LoginPage.html');
    res.sendFile(filePath);
});
//Testing purposes
app.get('/ping', (req, res) => {
    console.log("[Server]: Requesting a ping from client.");
    res.send('pong');
    console.log("[Server]: ping request done.");
});

// TODO : change this to post() instead of get with parameters, then create a get() that sends it back to front end.
app.post('/createuser', (req, res) => {
    console.log("[Server]: Requesting to add a user to client.");
    let usrName = req.body.usrName;
    let usrPassword = req.body.usrPassword;
    dbusers.create_user(usrName, usrPassword).then(() => {
        console.log("User created successfully");
        res.send("Request complete");
    }).catch((err) => {
        console.error(err);
    })
});

app.post('/authorizeuser', (req, res) => {
    console.log("[Server]: Authorizing user...");
    let name = req.body.usrName;
    let password = req.body.usrPassword;
    // console.log(`${name}, ${password}`);
    dbusers.authorize_user(name, password).then((r) => {
        if (r) { // authorize user based on name and password given
            console.log(`User signed in successfully: ${r}`); // iff successful create a cookie with the username
            res.cookie("usr", name, { secure: true, path: "/" });
            res.send(r);
        } else {
            console.log(`User signed in successfully: ${r}`);
            res.send(r);
        }
    }).catch((err) => {
        // res.status(400).send();
        res.status(400).send("");
        console.error(err);
    })
});

app.post('/logout', (req, res) => {

})

/*TODO : change this to post() instead of get with parameters, then create a get() that sends it back to front end.
* Create a new class
*/

app.post('/createclass', (req, res) => {
    console.log("[Server]: Requesting to add a class to database.");
    let Name = req.body.name;
    let Color = req.body.color;
    let creator = req.cookies.usr; //username of the current user
    dbclass.insert_class(creator, Name, Color).then(() => {
        console.log("[Server]: Request to add a class done.");
        res.send("Request complete.");
    }).catch((err) => {
        console.error(err);
    });
});

/*TODO : change this to post() instead of get with parameters, then create a get() that sends it back to front end.
* Update a class sub-data field or create a new sub-data field if the data already exist.
*/
app.get('/updateclass', (req, res) => {
    console.log("[Server]: Request to update a class.");
    let currentData = "CME435";
    let key = "a_newer_field";
    let value = "new_data";
    let creator = req.cookies.usr; //username of the current user
    dbclass.update_class(creator, currentData, key, value).then(() => {
        console.log("[Server]: Request to update a class done.");
        res.send("Request complete.");
    }).catch((err) => {
        console.error(err);
    });
});

/**
 * TODO: change this to post() later to send it to front end.
 * Delete a class depending on what the frontend wants to be deleted
 */
app.get('/deleteclass', (req, res) => {
    console.log("[Server]: Request to delete a class.");
    let currentData = "CME435";
    let creator = req.cookies.usr; //username of the current user
    dbclass.delete_class(creator, currentData).then(() => {
        console.log("[Server]: Request to delete a class done.");
        res.send("Request complete.");
    }).catch((err) => {
        console.error(err);
    });
});

/**
 * Send all class within the collection as a list. Parse it in frontend.
 * TODO: Turn this into post
 */
app.get('/getallclass', (req, res) => {
    console.log("[Server]: Requesting to show all classes");
    let courseCreator = req.cookies.usr;
    dbclass.get_allClass(courseCreator).then(result => {
        res.send(result);
    });
    console.log("Request complete");
});

/**
 * Call this if a specific class gets clicked.
 */
app.post('/getClass', (req, res) => {
    console.log('[Server] Requesting to get a class info.');
    const courseName = req.body.name;
    const courseCreator = req.cookies.usr;
    dbclass.getSpecificClass(courseName, courseCreator)
        .then((result) => {
            res.cookie("current_classpage", courseName, { secure: true, path: "/" });
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.send("error");
        })
});

app.post('/getTodoObj', (req, res) => {
    console.log('[Server] Requesting to get a all todo obj from class.');
    const courseName = req.body.name;
    const courseCreator = req.cookies.usr;
    dbclass.getAllTodoTags(courseCreator, courseName)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.send("error");
        })
});

// TODO: Make this into post()
app.post('/insertgrade', (req, res) => {
    console.log(req.body);
    let gradeName = req.body.gradeName;
    let classTag = req.body.classTag;
    let creator = req.cookies.usr; //username of the current user
    console.log("[Server]: Requesting to insert a grade in database");
    dbgrades.insert_grade(creator, gradeName, classTag);
    console.log("[Server]: Request to add a class done");
    res.send("Request complete");
})

app.get('/getallgrades', (req, res) => {
    console.log("[Server]: Requesting to show all grades");
    let courseCreator = req.cookies.usr;
    dbgrades.get_allGrades(courseCreator).then(result => {
        res.send(result);
    });
    console.log("Request complete");
});

app.get('/addtag', (req, res) => {
    let gradeName = "Assignment-etc";
    let newTag = "CME345";
    let creator = req.cookies.usr; //username of the current user
    console.log("[Server]: Requesting to add a tag to a class");
    dbgrades.set_tag(creator, gradeName, newTag);
    console.log("[Server]: Request to add a tag done");
    res.send("Request complete");
})

app.get('/removetag', (req, res) => {
    let gradeName = "ASD123";
    let creator = req.cookies.usr; //username of the current user
    console.log("[Server]: Requesting to delete a tag to a class");
    dbgrades.set_tag(creator, gradeName, null);
    console.log("[Server]: Request to delete a tag done");
    res.send("Request complete");
})

app.post('/addweight', (req, res) => {
    let weightKey = req.body.name;
    let weightVal = Number(req.body.value);
    let gradeName = req.cookies.current_classpage;
    let creator = req.cookies.usr; //username of the current user

    if (typeof weightVal != "number") {
        throw "weightVal must be a number";
    }
    try {
        console.log(`[Server]: Requesting to add weight ${weightKey} to ${gradeName}`);
        dbgrades.addWeight(creator, weightKey, weightVal, gradeName);
        console.log("[Server]: Request to add weights done");
        res.send("Request complete");
    } catch (err) {
        console.log(err);
    }
})

app.post('/addgrade', (req, res) => {
    console.log(req.body);
    let gradeKey = req.body.gradeKey; // name of assignmxent/project/midterm/etc
    let gradeVal = Number(req.body.gradeVal);
    let weightKey = req.body.weightKey; // Should be similar to gradeKey
    let gradeName = req.cookies.current_classpage;
    let creator = req.cookies.usr; //username of the current user

    console.log(`[Server]: Requesting to add grades for ${gradeName}, ${weightKey}`)
    dbgrades.addGrade(creator, gradeKey, gradeVal, weightKey, gradeName);
    console.log("[Server]: Request to add grades done");
    res.send("Request complete");
});

app.post('/changeWeightKey', (req, res) => {
    let creator = req.cookies.usr;
    let currentClass = req.cookies.current_classpage;
    let newWeightKey = req.body.newKey;
    let oldWeightKey = req.body.oldKey;
    console.log(`[Server] : Requesting to change ${oldWeightKey} key from ${currentClass} to ${newWeightKey}`);
    dbgrades.setWeightKey(creator, currentClass, newWeightKey, oldWeightKey).catch((err) => {
        console.error(err);
        res.status(500).send();
    });
    console.log("done changing weight key");
});

app.post('/changeWeightVal', (req, res) => {
    let creator = req.cookies.usr;
    let currentClass = req.cookies.current_classpage;
    let curWeightKey = req.body.curKey;
    let newWeightVal  = Number(req.body.newVal);
    console.log(req.body);
    console.log(`[Server] : Requesting to change value of ${curWeightKey} from ${currentClass} to ${newWeightVal}`);
    dbgrades.setWeightVal(creator, currentClass, curWeightKey, newWeightVal).catch((err) => {
        console.log(err);
        res.status(500).send();
    });
    console.log("done changing weight value");
});

// app.post('/changeGrades', (req, res) => {
//     console.log(req.body);
//     let oldGradeKey = req.body.oldGradeKey;
//     let newGradeKey = req.body.newGradeKey;
//     let curWeightKey = req.body.curWeightKey;
//     let newGradeVal = Number(req.body.newGradeVal);
//     let currentClass = req.cookies.current_classpage;
//     let creator = req.cookies.usr;
//     console.log(`[Server] : Requesting to change grade for ${currentClass}, ${oldGradeKey}`);
//     dbgrades.changeGradeKey(creator, newGradeKey, oldGradeKey, curWeightKey, currentClass).catch((err) => {
//             console.log(err);
//         });
//     dbgrades.changeGradeVal(creator, curWeightKey, newGradeKey, newGradeVal, currentClass).catch((err) => {
//         console.log(err);
//     });
// });

app.post('/changeGradeKey', (req, res) => {
    let oldGradeKey = req.body.oldGradeKey;
    let newGradeKey = req.body.newGradeKey;
    let curWeightKey = req.body.curWeightKey;
    let currentClass = req.cookies.current_classpage;
    let creator = req.cookies.usr;
    console.log(`[Server] : Requesting to change ${currentClass} replacing ${oldGradeKey} with ${newGradeKey}`);
    dbgrades.changeGradeKey(creator, newGradeKey, oldGradeKey, curWeightKey, currentClass).catch((err) => {
        console.log(err);
    });
});

app.post('/changeGradeVal', (req, res) => {
    let newGradeKey = req.body.newGradeKey;
    let curWeightKey = req.body.curWeightKey;
    let newGradeVal = Number(req.body.newGradeVal);
    let currentClass = req.cookies.current_classpage;
    let creator = req.cookies.usr;
    console.log(`[Server] : Requesting to change ${currentClass} replacing old value with ${newGradeVal}`);
    dbgrades.changeGradeVal(creator, curWeightKey, newGradeKey, newGradeVal, currentClass).catch((err) => {
        console.log(err);
    });
});

app.post('/deleteGrades', (req, res) => {
    let creator = req.cookies.usr;
    let currentClass = req.cookies.current_classpage;
    let weightKey = req.body.weightKey;
    let gradeKey = req.body.gradeKey;
    console.log(`[Server] : Requesting to delete grade for ${currentClass}, ${gradeKey}`);
    dbgrades.deleteGrade(creator, currentClass, weightKey, gradeKey).catch((err) => {
        console.log(err);
        res.status(500).send();
    });
});

app.post('/deleteGradeScheme', (req, res) => {
    let creator = req.cookies.usr;
    let currentClass = req.cookies.current_classpage;
    let weightKey = req.body.weightKey;
    console.log(`[Server] : Requesting to delete a grade scheme for ${currentClass}, ${weightKey}`);
    dbgrades.deleteWeight(creator, currentClass, weightKey).catch((err) => {
        console.log(err);
    });
});

app.post('/saveNote', async (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let updated = req.body.updated;
    let creator = req.cookies.usr;
    await client.db().collection("notes").insertOne({ creator, title, body, updated });
});

app.get('/getAllNotes', (req, res) => {
    let creator = req.cookies.usr;
    res.send(client.db().collection("notes").find({ usr: creator }).toArray());
});

app.get('/dashboard', (req, res) => {
    const filePath = path.join(__dirname, '/frontend/dashboard.html');
    res.sendFile(filePath);
});

app.get('/sign-up', (req, res) => {
    const filePath = path.join(__dirname, '/frontend/sign-up.html');
    res.sendFile(filePath);
});

app.get('/log-in', (req, res) => {
    const filePath = path.join(__dirname, '/frontend/LoginPage.html');
    res.sendFile(filePath);
})

//To-Do

//Index Route
app.get("/listings", async (req, res) => {
    const user = req.cookies.usr;
    const allListings = await Listing.find({ user: user });
    res.render("listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Create Route
app.post("/listings", async (req, res) => {
    const user = req.cookies.usr;
    const newListing = new Listing({
        user: user,
        title: req.body.listing.title,
        description: req.body.listing.description,
        startDate: req.body.listing.startDate,
        endDate: req.body.listing.endDate,
        time: req.body.listing.time,
        tags: req.body.listing.tags,
        reminder: req.body.listing.reminder

    });
    await newListing.save();

    dbclass.addTodoTags(newListing.tags, user, newListing._id.toString())
        .catch((err) => { console.log(err) }); //Links to a class if its related\

    res.redirect("/listings");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});


//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const user = req.cookies.usr;
    dbclass.editTodoTags(req.body.listing.tags, user, req.params.id)
        .catch((err) => { console.log(err) }); // edits to a class

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    const user = req.cookies.usr;
    dbclass.deleteTodoTags(user, req.params.id)
        .catch((err) => { console.log(err) }); // Deletes the object id from Class object

    console.log(deletedListing);
    res.redirect("/listings");
});
/* ---------------------------- To-DO --------------------------- */
/* ---------------------------- Calendar --------------------------- */
// Define a Task schema
// const taskSchema = new mongoose.Schema({
//     title: String,
//     start: Date,
//     end: Date,
// });
// const Task = mongoose.model('Task', taskSchema);

app.get('/api/tasks', async (req, res) => {
    try {
        // const tasks = await Task.find();
        const user = req.cookies.usr;

        const allListings = await Listing.find({ user: user });
        // const combinedData = [...tasks, ...allListings];
        res.json(allListings);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/api/tasks', async (req, res) => {
    const { title, start, end } = req.body;

    try {
        const newTask = new Task({ title, start, end });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, start, end } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { title, start, end }, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findOneAndDelete({ _id: id });

        if (deletedTask) {
            res.json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/calendar", (req, res) => {

    res.render("listings/calendar.ejs");
})

// app.get("/calendar", (req, res) => {
//     const filePath = path.join(__dirname, '/frontend/Calendar.html');
//     res.sendFile(filePath);
// })
/* ---------------------------- Calendar --------------------------- */


app.listen(PORT, HOST);
console.log(`[Server]: Host -> ${HOST} : Port -> ${PORT} is live`);
