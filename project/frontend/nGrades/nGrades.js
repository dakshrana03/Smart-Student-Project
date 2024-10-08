// the function we use to update in t



// An array of all grades which is stored in local storage
let allData = JSON.parse(localStorage.getItem('dataList')) || 
[{
    Name: 'first',
    Score: 90.5,
    Type: 'Quiz'
}];

// An array of all types and their values, which is stored in local storage
let typeData = JSON.parse(localStorage.getItem('typeData')) || [
    {name:'Choose from below', value: 0},
    {name:'Quiz', value:10},
    {name:'Assignment', value:20},
    {name:'Deliverable', value:20},
    {name:'Finals', value:50}
];

average();
display();
displayGradingScheme();
//checkPercentValue();

////////////////////////////////////////// ADD GRADE FUNCTIONS //////////////////////////////////////////////////////

/*
* This function provides addGradeForm in display and provides all resources through which all data can be
* stored in 'allData' array.
*/
/**
 * Creates a new class when "Add Grade" button is clicked on the top.
 * @param {*} listOfWeights - List of all the weights from grading scheme
 * @returns html file that rendered by form below
 */
function createClassForm(listOfWeights){
    let html = `
        <label class="namelabel">Name:</label><br>
        <input class="NameInput" type="text" placeholder="Name"> <br> <br>
        <label class="scorelabel"> Score in percent: </label> <br>
        <input class="scoreInput" type="text" placeholder="Score"> <br> <br>
        <label class="typelabel"> Type: </label><br>
        <select id="gradeType" class="typeInput">
    `;
    for(let i = 0; i < listOfWeights.length; i++){
        html += `<option value=${listOfWeights[i]}> ${listOfWeights[i]} </option>`;
    }
    html += `
        </select> <br>
        <button class="formSubmission" onclick="submitAddGradeForm(); display(); average();">Submit</button>
        <button class="formSubmission" onclick="cancelAddGradeForm(); display(); average();">Cancel</button>
    `;  
    return html;
};

let form = () => {
    let currentClass = getClassName("current_classpage");
    $.get('/getAllGrades', function(data){
        data.forEach((curClass) => {
            if(curClass.tag == currentClass){
                document.querySelector('.emptyForm').classList.add('addGradeForm');
                let output = document.querySelector('.addGradeForm');
                output.innerHTML = createClassForm(Object.keys(curClass.weights));
            }
        });
    });
}


function cancelAddGradeForm() {
    let form = document.querySelector('.emptyForm');
    form.innerHTML = '';
    form.classList.remove('addGradeForm');
}

/*
* This function stores all data input from addGradeForm, stores data in the array 'allData' and removes
* addGradeForm from display.
*/
function submitAddGradeForm() {
    let name = document.querySelector('.NameInput');
    let score = document.querySelector('.scoreInput');
    let type = document.getElementById('gradeType');
    let selectedIndex = type.selectedIndex;
    let selectedOption = type.options[selectedIndex];
    let selectedValue = selectedOption.value;
    
    // let newData = {
    //     Name: "",
    //     Score: 0,
    //     Type: ""
    // };

    //NOTE TO KEVIN: this was deleted for some reason. I added it back.
    let params = "gradeKey=" + name.value + "&gradeVal=" + score.value +
        "&weightKey=" + selectedValue;
    $.ajax({
        type: "POST",
        url: '/addgrade',
        data: params,
        contentType: "application/x-www-form-urlencoded",
        success: function(data) {
            alert(data);
        },
        error: function(){
            alert("does not work");
        }
    });

    // newData.Name = name.value;
    // newData.Score = Number(score.value);
    // newData.Type = selectedValue;
    // allData.push(newData);
    let form = document.querySelector('.emptyForm');
    form.innerHTML = '';
    form.classList.remove('addGradeForm');
}

///////////////////////////////////////////// DISPLAY GRADES FUNCTIONS ////////////////////////////////////////////////////

/*
* This function is used to display all items in the array 'allData' along with edit and delete buttons
*/
/**
 * Parses all of the grades from the current grade object
 * @param {JSON Ojbect} currentClass - Class object
 * @returns html file used to render on display()
 */
//TODO NOTE TO KEVIN: button here!!!!!!!!!!!!!!!!!!!!!
function displayMainGrades(currentClass){
    let gradeCategories = currentClass.grades;
    let html = ``;
    Object.keys(gradeCategories).forEach((category) => {
        Object.keys(gradeCategories[category]).forEach((gradeName) => {
            // console.log(`\t${gradeName}`);
            // console.log(`\t\t${gradeCategories[category][gradeName]}`)
            // console.log(`\t\t\t${category}`);
            html += `
                <div class="assignment-info"> ${gradeName} </div>
                <div class="assignment-score"> ${gradeCategories[category][gradeName]} </div>
                <div class="assignment-type"> ${category} </div>
                <button class="edit-button" onclick="editForm('${gradeName}', ${gradeCategories[category][gradeName]}, '${category}');"> edit </button>
                <button class="delete-button" onclick="deleteGrade('${gradeName}', '${category}'); display();"> delete </button>
            `;
        }); 
    })
    return html;
}
function display() {
    let thisFile = document.querySelector(".display");
    let currentClass = getClassName("current_classpage");
    $.get('/getAllGrades', function(data){
        data.forEach((curClass) => {
            if(curClass.tag == currentClass){
                // console.log(curClass);
                thisFile.innerHTML = displayMainGrades(curClass);
            }
        });
    });
}

/////////////////////////////////////////////////////    EDIT GRADES FUNCTIONS ///////////////////////////////////

/*
* a function that makes changes to already stored assignment grade
* index: index of item in array that needs to be edited
*/
function editForm(gradeName, gradeValue, gradeType){
    let currentClass = getClassName("current_classpage");
    $.get('/getAllGrades', function(data){
        data.forEach((curClass) => {
            if(curClass.tag == currentClass){
                document.querySelector('.emptyForm').classList.add('editGradeForm');
                let output = document.querySelector('.editGradeForm');
                output.innerHTML = editGradesForm(gradeName, gradeValue, gradeType);
            }
        });
    });
}

function editGradesForm(gradeName, gradeValue, type) {
    document.querySelector('.emptyForm').classList.add('editGradeForm');
    let html = `<label>Name:</label>\n`;
    html += `<input class="NameInput" type="text" value=${gradeName}>\n`;
    html += '<br>';
    html += '<br>';
    html += `<label>Score:</label>\n`;
    html += `<input class="scoreInput" type="text" value=${gradeValue}>\n`;
    html += '<br>';
    html += '<br>';
    html += '<br>';
    html += '<br>\n';
    html += `<button class="formSubmission" onclick="submitEditGradeForm('${String(gradeName)}', '${String(type)}'); average(); display();">submit</button>\n`;
    html += `<button class="formSubmission" onclick="cancelEditGradeForm(); display(); average();">Cancel</button>\n`;

    return html;
}

// removes edit grade form without any changes
function cancelEditGradeForm() {
    let form = document.querySelector('.emptyForm');
    form.innerHTML = '';
    form.classList.remove('editGradeForm');
}

/*
* This function stores all data input from editGradeForm, updates data in the array 'allData' and removes
* editGradeForm from display.
*/
function submitEditGradeForm(gradeName, type) {
    let oldName = gradeName;
    let name = document.querySelector('.NameInput');
    let score = document.querySelector('.scoreInput');


    // let params = "oldGradeKey=" + oldName + "&newGradeKey=" + name.value +
    //     "&curWeightKey=" + type  + "&newGradeVal=" + score.value;

    let changeGradeKeyData = "newGradeKey=" + name.value + "&oldGradeKey=" + oldName + "&curWeightKey=" + type;
    let changeGradeValData = "curWeightKey=" + type + "&newGradeKey=" + name.value + "&newGradeVal=" + score.value;

    if(oldName == name.value){
        $.ajax({
            type: "POST",
            url: "/changeGradeVal",
            data: changeGradeValData,
            contentType: "application/x-www-form-urlencoded",
            success: function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    }
    else{
        // request to change gradeKey
        $.ajax({
            type: "POST",
            url: "/changeGradeKey",
            data: changeGradeKeyData,
            contentType: "application/x-www-form-urlencoded",
            success: function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    
        // request to change gradeValue
        $.ajax({
            type: "POST",
            url: "/changeGradeVal",
            data: changeGradeValData,
            contentType: "application/x-www-form-urlencoded",
            success: function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    }

    let form = document.querySelector('.emptyForm');
    form.innerHTML = '';
    form.classList.remove('editGradeForm');
}

// adding function to button to push data in 'allData' array
let addButton = document.querySelector('.addGradeBtn');
addButton.onclick = () => form();


//////////////////////////////////////// Delete Grade function  /////////////////////////////////////////
function deleteGrade(classKey, categoryKey){
    let params = "weightKey=" + categoryKey + "&gradeKey=" + classKey;
    console.log(params);
    $.ajax({
        type: "POST",
        url: '/deleteGrades',
        data: params,
        contentType: 'application/x-www-form-urlencoded',
        success: function(data){
            alert(data);
        },
        error: function(err){
            alert(err);
        }
    })
}

///////////////////////////////// DISPLAY GRADING SCHEME FUNCTION ////////////////////////////////////////

/*
* This function displays and updates grading scheme on right-side bar
*/
//TODO NOTE TO KEVIN: button here!!!!!!!!!!!!!!!!!!!!!
function displayGradingScheme() {
    let thisFile = document.querySelector(".gradingScheme");
    let html = "";
    let currentClass = getClassName("current_classpage");
    $.get('/getAllGrades', function(data){
        data.forEach((curClass) => {
            if(curClass.tag == currentClass){
                for(let key in curClass.weights){
                    html += `
                        <div> ${key} </div>
                        <div> ${curClass.weights[key]} </div>
                        <button class="editbutton" onclick="
                            editGradingScheme('${key}', ${curClass.weights[key]});
                        "> edit </button>
                        <button class="deletebutton" onclick="deleteType('${key}')"> delete </button>
                    `;
                }
                thisFile.innerHTML = html;  
            }
        });
    })
}

////////////////////////////////////    ADD and EDIT GRADE SCHEME FUNCTIONS ////////////////////////////////////////////////////////

/*
* This function creates a form to fill one grade type and its value which is later stored and updates the grading scheme.
*/
function addGradeScheme() {
    let xForm = document.querySelector('.emptyForm');
    xForm.classList.add('addGradeSchemeForm');
    let html = `<label>Type Name</label><br>\n`;
    html += `<input class="gradeTypeInput" type="text" placeholder="Name">\n`;
    html += '<br>';
    html += '<br>';
    html += `<label>Percent Value</label><br>\n`;
    html += `<input class="gradeValueInput" type="text" placeholder="Value">\n`;
    html += '<br>';
    html += '<br>';
    html += `<button class="gradeSchemeFormSubmission" onclick="submitAddGradeSchemeForm(); displayGradingScheme(); average(); checkPercentValue();">Submit</button>`;
    html += `<button class="gradeSchemeFormSubmission" onclick="cancelAddGradeSchemeForm(); displayGradingScheme(); average(); checkPercentValue();">Cancel</button>`;

    let output = document.querySelector('.addGradeSchemeForm');
    output.innerHTML = html;
}

// removes add grade scheme form without adding any new grade type in grading scheme
function cancelAddGradeSchemeForm() {
    let form = document.querySelector('.emptyForm');
    form.innerHTML = '';
    form.classList.remove('addGradeSchemeForm');
}

/*
* This function submits the filled form to add type and values to grading scheme
*/
function submitAddGradeSchemeForm() {
    let data = {name: '',
    value: 0};

    data.name = document.querySelector('.gradeTypeInput').value;
    data.value = Number(document.querySelector('.gradeValueInput').value);

    // check for any already existing type with the same name
    // if yes, then deny the addition of data
    for (let int=1; int < typeData.length; int++){
        if (typeData[int].name === data.name){
            alert("There is already a type with the same name!");
            let xForm = document.querySelector('.emptyForm');
            xForm.innerHTML = '';
            xForm.classList.remove('addGradeSchemeForm');
            return;
        }
    }

    typeData.push(data);
    //localStorage.setItem('typeData', JSON.stringify(typeData));

    let dataToWWW = "name=" + data.name +
    "&value=" + data.value;
    let url = "/addweight";
    // ajax function
    $.ajax({
        type:"POST",
        url: '/addweight',
        data: dataToWWW,
        contentType:"application/x-www-form-urlencoded",
        success: function(data){
            alert(data);
        },
        error: function(){
            alert("add grade shceme does not work.")
        }
    })

    let xForm = document.querySelector('.emptyForm');
    xForm.innerHTML = '';
    xForm.classList.remove('addGradeSchemeForm');
}

////// Need to add a featur so that it updates current files which have the same type ////

/*
* This function is used to update particular type and value in grading scheme
* param: index is the position of the grade object in the array that needs to be updated.
*/
function editGradingScheme(IDofType, valueOfType){
    document.querySelector('.emptyForm').classList.add('editGradeSchemeForm');
    let html = `<label>Name:</label>\n`;
    html += `<input class="gradeTypeInput" type="text" value=${IDofType}>\n`;
    html += '<br>';
    html += '<br>';
    html += `<label>Score:</label>\n`;
    html += `<input class="gradeValueInput" type="text" value=${valueOfType}>\n`;
    html += '<br>';
    html += '<br>';
    html += `<button class="formSubmission" onclick="submitEditGradeSchemeForm('${IDofType}'); display(); displayGradingScheme(); average(); checkPercentValue();">submit</button>\n`;
    html += `<button class="formSubmission" onclick="cancelEditGradeSchemeForm(); display(); average(); checkPercentValue();">Cancel</button>\n`;

    let output = document.querySelector('.editGradeSchemeForm');
    output.innerHTML = html;


    // check for older version at bottom of code
}

// this function takes information entered in input boxes of edit grade scheme form and updates the grading scheme
function submitEditGradeSchemeForm(IDofType) {
    let oldName = IDofType;

    // object to store new values of Grade Type
    let dataValue = {name: '',
    value: 0};

    dataValue.name = document.querySelector('.gradeTypeInput').value;
    dataValue.value = Number(document.querySelector('.gradeValueInput').value);

    // Sending data to backend
    console.log(oldName + dataValue.name + dataValue.value);
    let changeWeightKeyData = "oldKey=" + oldName + "&newKey=" + dataValue.name;
    let changeWeightValData = "curKey=" + dataValue.name + "&newVal=" + dataValue.value;

    if(dataValue.value >= 1 || dataValue.value <= 0){
        alert("The weight has to be between 1 and 0");
        return;
    }
    
    if(oldName == dataValue.name){
        $.ajax({
            type: "POST",
            url: "/changeWeightVal",
            data: changeWeightValData,
            contentType: "application/x-www-form-urlencoded",
            success: function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    }
    else {
        $.ajax({
            type: "POST",
            url: "/changeWeightKey",
            data: changeWeightKeyData,
            contentType: "application/x-www-form-urlencoded",
            success: function (data) {
                console.log(data);  
            },
            error: function (err){
                console.log(err)
            }
        });
        
        $.ajax({
            type: "POST",
            url: "/changeWeightVal",
            data: changeWeightValData,
            contentType: "application/x-www-form-urlencoded",
            success: function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    }


    let xForm = document.querySelector('.emptyForm');
    xForm.innerHTML = '';
    xForm.classList.remove('editGradeSchemeForm');
    window.location.href = "nGrades.html";
}

// removes edit grade scheme form without any changes
function cancelEditGradeSchemeForm() {
    let form = document.querySelector('.emptyForm');
    form.innerHTML = '';
    form.classList.remove('editGradeSchemeForm');
}

// adding function to button to push data in 'typeData' array
document.querySelector(".addToGradingScheme").onclick = () => addGradeScheme();

/*
* This function deletes grades of particular type when that type is deleted from grading scheme.
*/
function deleteType(key) {
    let params = "weightKey=" + key;
    $.ajax({
        type: "POST",
        url: '/deleteGradeScheme',
        data: params,
        contentType: 'application/x-www-form-urlencoded',
        success: function(data){
            alert(data);
        },
        error: function(data){
            alert(err)
        }
    });
}

/*
* This function checks if all type values add up to 100.
*/
function checkPercentValue() {
    let total = 0;
    let currentClass = getClassName("current_classpage");
    $.get('/getAllGrades', function(data){
        data.forEach((curClass) => {
            if(curClass.tag == currentClass){
                for(let key in curClass.weights){
                    total += curClass.weights[key];
                }  
            }
        });
        // total should add up to 1, displaying all grades types values add up to 100%
        if (total !== 1){
            alert("Grading Scheme does not add up to 100%, please make changes accordingly.\nValue of grade type must be decimals so that their sum equals to 1.");
        }
    });
}


function getClassName(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i=0; i<ca.length; i++){
        let c = ca[i];
        while(c.charAt(0) == ' ') c = c.substring(1);
        if(c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

//////////////////////////////// Average Calculator and display functions ///////////////////////////////////////
/*
* This function calculates total percent per grade type.
*/
function average(){

    let averageForm = document.querySelector('.average');
    let currentClass = getClassName("current_classpage");
    $.get('/getAllGrades', function(data){
        data.forEach((curClass) => {
            if(curClass.tag == currentClass){
                // console.log(curClass);
                averageForm.innerHTML = displayAverages(curClass);
            }
        });
    });
}

function displayAverages(currentClass){
    let gradeCategories = currentClass.grades;
    let html = ``;
    Object.keys(gradeCategories).forEach((category) => {
        // total number of grades of one category
        let numOfGrades = 0;
        // total score in one category
        let total = 0;
        Object.keys(gradeCategories[category]).forEach((gradeName) => {
            // add each grades in total
            
            total += Number(gradeCategories[category][gradeName]);
            numOfGrades += 1;

        });


        let output = 0;
        let gradeValue = 1;

        // this will use value of the grade type to calculate percent average of grade types
        for (let key in currentClass.weights){
            if (key === category){
                gradeValue = Number(currentClass.weights[key]);
            }
        }

        // if there is no item of given type then display the message.
        if (numOfGrades === 0){output = "No grade of this type";}
        else{
            output = total / numOfGrades * gradeValue;
            output = output.toFixed(2)
        }
        html += `<p>${category}: ${output}</p>`;
    })
    return html;
}
