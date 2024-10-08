average = (jsonOBJ) => {
    let total = 0; // init the total output
    for(const w in jsonOBJ.weights) { // jump through each weight
        let w_i = jsonOBJ.weights[w]; // grab the weight value
        let a_n = 0; // init the number of grade items
        let sum = 0; // init the sum of all grade items
        for(const g in jsonOBJ.grades[w]) { // jump through each grade item list
            a_n++; // count each item
            sum += jsonOBJ.grades[w][g]; // add each item together
        }
        total += w_i * sum/a_n; // take the average of the items and multiply by the weight
    }
    return total;
};
const debug = false; // change me to test
if(debug) {
    // this example should give a grade of 0.5 (50%);
    let grades = {
        "tag": null,
        "weights": {
            "Assignments": 0.1,
            "Project": 0.4,
            "Exam": 0.5
        },
        "grades": {
            "Assignments": {"A1": 1, "A2": 1, "A3": 1},
            "Project": {"D1": 1},
            "Exam": {"E1": 0}
        }
    }

    console.log(`Average: ${average(grades)}`);
}