// Initialize Firebase
var config = {
    apiKey: "AIzaSyAstECT27U3Q76OL9jWLcW8YvuBb5JqML8",
    authDomain: "michael-train-scheduler.firebaseapp.com",
    databaseURL: "https://michael-train-scheduler.firebaseio.com",
    projectId: "michael-train-scheduler",
    storageBucket: "michael-train-scheduler.appspot.com",
    messagingSenderId: "384155330175"
};
firebase.initializeApp(config);

var clear = function () {
    $("#train").val("");
    $("#city").val("");
    $("#departure").val("");
    $("#frequency").val("");
};

var database = firebase.database();

$("#add-train").on("click", function () {

    if (document.getElementById('train').value === '' || document.getElementById('city').value === '' || document.getElementById('departure').value === '' || document.getElementById('frequency').value === '') {
        alert("Please fill out missing fields.");
        return false;
    } else {

        var train = $("#train").val().trim();
        var city = $("#city").val().trim();
        var firstLeaves = moment($("#departure").val().trim(), "HH:mm").subtract(10, "years").format("X");
        var leavesEvery = $("#frequency").val().trim();
        var addGare = { 
            name: train, 
            destination: city, 
            firstTrain: firstLeaves, 
            frequency: leavesEvery 
        };

        database.ref().push(addGare);
        console.log(database);

        clearInputs();

        return false;
    }
});

    database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    var nameOfTrain = childSnapshot.val().name;
    var nameOfCity = childSnapshot.val().destination;
    var trainLeavesFirst = childSnapshot.val().firstTrain;
    var trainFrequency = childSnapshot.val().frequency;

    var differenceTimes = moment().diff(moment.unix(trainLeavesFirst), "minutes");
    console.log("difference in time: " + differenceTimes); 

    var minutesLeft = moment().diff(moment.unix(trainLeavesFirst), "minutes") % trainFrequency;
    console.log("minutes left: " + minutesLeft); 

    var totalTime = trainFrequency - minutesLeft;
    console.log("total time: " + totalTime); 

    var nextTrainTime = moment().add(totalTime, "m").format("hh:mm A");
    console.log("arrival time: " + nextTrainTime); 

    $("#gare > tbody").append("<tr> <td>" + nameOfTrain + "</td> <td>" + nameOfCity + "</td> <td>" + trainFrequency + "</td> <td>" + nextTrainTime + "</td> <td>" + totalTime + "</td> </tr>");
});
