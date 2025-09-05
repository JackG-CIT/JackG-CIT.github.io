document.addEventListener("keydown", (event) => { //allowing me to test whatever level i want easily
    console.log("Key pressed:", event.key);
    if (event.key === "+") {
        currentLevel = 11;
        update();
    }
    if (event.key === "=") {
        currentLevel++;
        update();
    }
    if (event.key === "-") {
        currentLevel--;
        update();
    }
    if (event.key === "_") {
        localStorage.setItem("bestMoves", "null");
        localStorage.setItem("bestTime", "null");
    }
});

function wait(ms) { // wait function
    return new Promise(resolve => setTimeout(resolve, ms));
}

//audio stuff
const knightsTemplar = document.getElementById("backgroundaudio");
const betweenWorlds = document.getElementById("backgroundaudio1");
const BarefootAdventures = document.getElementById("backgroundaudio2");
let timeSincePageLoaded = 0; 

document.getElementById("playAudioButton").addEventListener("click", function() {
    // Start playing the audio
    knightsTemplar.currentTime = (timeSincePageLoaded-(0.75));
    if (currentLevel < 5){
        knightsTemplar.play();
        knightsTemplar.volume = 0.7;
    }
    if (currentLevel > 4 && currentLevel < 11){
        BarefootAdventures.play();
    }
    if (currentLevel >= 11){
        betweenWorlds.play();
    }
});
document.getElementById("pauseAudioButton").addEventListener("click", function() {
    //Pause the audio
    knightsTemplar.pause();
    betweenWorlds.pause();
    BarefootAdventures.pause();
});
function fadeOutAudio(audioElement, duration) {
    const fadeInterval = 50;
    const fadeSteps = duration / fadeInterval;
    const volumeStep = audioElement.volume / fadeSteps;

    const fadeOut = setInterval(() => {
        if (audioElement.volume > 0) {
            audioElement.volume = Math.max(0, audioElement.volume - volumeStep);
        } else {
            clearInterval(fadeOut);
            audioElement.pause();
        }
    }, fadeInterval);
}
function fadeInAudio(audioElement, duration) {
    const fadeInterval = 50; 
    const fadeSteps = duration / fadeInterval; 
    const volumeStep = 1 / fadeSteps; 

    audioElement.volume = 0;
    audioElement.play();

    const fadeIn = setInterval(() => {
        if (audioElement.volume < 1) {
            audioElement.volume = Math.min(1, audioElement.volume + volumeStep);
        } else {
            clearInterval(fadeIn);
        }
    }, fadeInterval);
}




/*all the stuff before the actual game*/
document.getElementById("skipintro").addEventListener("click",function(){
    console.log("skip intro clicked");
    document.getElementsByClassName("gif")[0].style.setProperty("display", "none", "important"); //important is used to make sure that this overrides css styling
    document.getElementById("skipintro").style.setProperty("display", "none", "important");
    document.getElementById("makeLintoQ").style.setProperty("display", "none", "important");
});
document.getElementById("button1").addEventListener("click",function(){
    console.log("button1 clicked");
    document.getElementById("navsection").style.setProperty("display", "none", "important");
    document.getElementById("LevelSelect").style.setProperty("display", "block", "important");
});
document.getElementById("button2").addEventListener("click",function(){
    console.log("button2 clicked");
    window.open("./RulesnScoring.html");
});
document.getElementById("button3").addEventListener("click",function(){
    console.log("button3 clicked");
    window.open("./Prototypeing.html");
});
document.getElementById("paint1").addEventListener("click",function(){
    console.log("paint1 clicked");
    document.getElementById("makeLevel").style.setProperty("display", "block", "important");   
    document.getElementById("makeLevelbg").style.setProperty("display", "block", "important");    
});
document.getElementById("backtomain").addEventListener("click",function(){
    console.log("backtomain clicked");
    document.getElementById("makeLevel").style.setProperty("display", "none", "important");   
    document.getElementById("makeLevelbg").style.setProperty("display", "none", "important");    
});
document.getElementById("backtomain1").addEventListener("click",function(){
    console.log("backtomain1 clicked");
    document.getElementById("navsection").style.setProperty("display", "block", "important");
    startTimer = false;
});

document.addEventListener("DOMContentLoaded", function() {
    console.log("start function called");
    start();
    
    document.getElementById("colorChosen").style.backgroundColor = "transparent";
    document.getElementById("colorChosen").style.color = "transparent";
});

let startTimer = false;
let currentTime = 0
const timerElement = document.getElementById("timer");
function updateTimer() {
    timeSincePageLoaded += 0.01;
    if (startTimer){
        currentTime += 0.01;
        if (currentTime>1000){
            timerElement.innerHTML = currentTime.toFixed(0);
        }else if (currentTime<100){
            timerElement.innerHTML = currentTime.toFixed(2);
        } else {
            timerElement.innerHTML = currentTime.toFixed(1);
        }
    }
    if(logLevelTimes){
        allLevelTimes[currentLevel] += 0.01;
        /*allLevelTimes[currentLevel] = Math.floor(allLevelTimes[currentLevel]*100)/100*/
    }
}
setInterval(updateTimer, 10);

let currentColor = "transparent";
const radioButtons = document.querySelectorAll('input[name="color"]');
radioButtons.forEach(radio => {
    radio.addEventListener('change', function(){
        currentColor = document.querySelector('input[name="color"]:checked').value;
        document.getElementById("colorChosen").style.backgroundColor = currentColor;
        document.getElementById("colorChosen").style.color = currentColor;
    });
});
const table = document.getElementById("grid");
for (let i = 0; i < 10; i++) {
  const row = document.createElement("tr");
  for (let j = 0; j < 10; j++) {
    const cell = document.createElement("td");
    cell.addEventListener("click", () => {
      cell.style.backgroundColor = currentColor;
    });
    row.appendChild(cell);
  }
  table.appendChild(row);
}

//declaring all the variables
let logLevelTimes = false;
let allLevelTimes = [0,0,0,0,0,0,0,0,0,0,0,0];
let allLevelMoves = [0,0,0,0,0,0,0,0,0,0,0,0];
let currentLevel = 0;//figuring out what level the player is on to give the the right set up
let maxLevel = 0;
let playerx = 6; // holds the x value of player
let playery = 6; // y value
let row = ""; //going to be used quite alot to get the row / y value of cell
let cell = "";// same as above but for finding the specific cell int the row
let row1 = ""; // these are going to be used for when I have to check for 2 cells values at the same time
let cell1 = "";
let levelMoves = 0;
let totalMoves = 0;
let totalResets = 0;
let hasExtra = false;
let newClass = "";
let levelHintLeft = 3;
const Hints = {
    1:["Your goal is to get to the Exit","You can only push One Box at a time, not two","Try pushing the box right infront of it down"],
    2:["You might need t push more than one box this level","Try to get to a spot where you can push the box infront of the exit out of the way","Get better at the game. This is almost the exact same as the first level just with one more step"],
    3:["The grey box with a W on it is an Immovable wall","Try moving on top of the tan colored Pressure Plate","Is there anything that can hold the pressureplate down while you escape?"],
    4:["There are some boxes this level that you will not use","Use the 5 boxes that arent directly on a wall","Actually put them on the pressure plates now"],   
    5:["If you cant go around , try going through","You can use any box to power any pressure plate, it doesnt have to be the first one you push","Stuck right before the entrance? Are there any boxes that you can go back and get to activate this last pressure plate?"],
    6:["Dont just push the first boxes that you can, think it through","Try getting the two bottom right boxes into place first ","Now do everything else, you got it"],
    7:["You need to get the far left box somehow.","Remember that if you dont need to use a pressure plate again then you can move the box off of it and reuse it","Really order matters, if your really stuck after 1000 seconds have passed try emailing me"],
    8:["There really shouldnt be a need for a hint here","If a box is in the same spot as a wall, the box will be pushed out","just get to the exit now"],
    9:["Put a box where the pressure plate activated walls in the corners are, then deactivate the pressure plate","When pushing the box out it can only be put in a space with nothing there, it also starts 1 row above then the same row then the row below",""],
    10:["","",""],
    11:["","",""]
}
const levelGoals = ["Learn box pushing mechanics and get to the Exit","Reinforce your learning","What is that new color?","Reinforce you learning","Sometimes you have to think things Through :)","The order that things are done in matters. Alot","Apparently this one is really hard","Try to learn the mechanics of boxes being pushed by walls","Use the wall pushing box mechanics","What are these new light tan and black squares?","Last Level!! So close", "I meant last easy level... Good Luck :)"]
/*let getboxx = "";
let getboxy = "";*/ //this was used but ended up being commented out for efficiency... still good for exlaining tho so they arent deleted
let numBoxes = [5, 10, 1,7,2,13,5,10,8,6,11,20];// tells the number of boxes that need to be made in each given level
let numWalls = [0, 0, 1,15,23,26,28,7,18,5,37,109];
let numpressurePlates = [0, 0, 1,5,3,7,9,2,4,0,6,21];
let numCannons = [0,0,0,0,0,0,0,0,0,4,3,5];
let numFuses = [0,0,0,0,0,0,0,0,0,4,3,5];

// const poses = {
//    "lvl1":[
//        ["wall", "box"],
//        ["wall", "box"]
//    ]
//}

const Positions = { // A method o method o method o  arrays... kinda like a 4d matrix
    /*Box positions*/1:{
        /*x values*/ 1:{// first value of Positions object is an object
            1:[11,10,7,9,3,4,4,9,5,3,3,14],//first value of this first object is the x values of the first box for any given level
            2:[10,11,0,9,4,5,4,3,5,8,4,14],
            3:[11,9,0,10,0,5,4,3,6,3,4,14],
            4:[10,10,0,10,0,2,3,3,7,3,6,15],
            5:[10,11,0,10,0,4,9,3,8,4,6,15],
            6:[0,10,0,11,0,5,0,10,8,10,6,15],
            7:[0,11,0,4,0,6,0,10,9,0,9,16],
            8:[0,3,0,0,0,2,0,9,10,0,9,16],
            9:[0,4,0,0,0,3,0,8,0,0,10,16],
            10:[0,3,0,0,0,4,0,7,0,0,10,8],
            11:[0,0,0,0,0,5,0,0,0,0,8,9],
            12:[0,0,0,0,0,6,0,0,0,0,0,9],
            13:[0,0,0,0,0,7,0,0,0,0,0,10],
            14:[0,0,0,0,0,0,0,0,0,0,0,8],
            15:[0,0,0,0,0,0,0,0,0,0,0,8],
            16:[0,0,0,0,0,0,0,0,0,0,0,10],
            17:[0,0,0,0,0,0,0,0,0,0,0,10],
            18:[0,0,0,0,0,0,0,0,0,0,0,20],
            19:[0,0,0,0,0,0,0,0,0,0,0,14],
            20:[0,0,0,0,0,0,0,0,0,0,0,9],
        },
        /*y values*/ 2:{ //same with the ys
            1:[6,6,8,2,3,3,2,5,11,6,9,8],
            2:[7,6,0,3,3,4,4,3,5,7,9,9],
            3:[8,7,0,3,0,5,6,4,6,7,10,10], 
            4:[6,8,0,9,0,7,9,5,7,9,4,8],
            5:[5,9,0,10,0,7,6,6,8,8,5,9],
            6:[0,5,0,9,0,7,0,5,3,10,7,10],
            7:[0,4,0,4,0,7,0,10,3,0,9,8],
            8:[0,10,0,0,0,11,0,10,3,0,10,9],
            9:[0,10,0,0,0,11,0,10,0,0,9,10],
            10:[0,9,0,0,0,11,0,10,0,0,10,9],
            11:[0,0,0,0,0,11,0,0,0,0,9,8],
            12:[0,0,0,0,0,11,0,0,0,0,0,10],
            13:[0,0,0,0,0,11,0,0,0,0,0,9],
            14:[0,0,0,0,0,0,0,0,0,0,0,8],
            15:[0,0,0,0,0,0,0,0,0,0,0,10],
            16:[0,0,0,0,0,0,0,0,0,0,0,8],
            17:[0,0,0,0,0,0,0,0,0,0,0,10],
            18:[0,0,0,0,0,0,0,0,0,0,0,15],
            19:[0,0,0,0,0,0,0,0,0,0,0,4],
            20:[0,0,0,0,0,0,0,0,0,0,0,4],
        }
    },
    /*wall positions*/2:{
        1:{
            1:[0,0,11,7,10,2,3,9,4,11,2,25],
            2:[0,0,0,8,6,2,7,11,9,8,7,3],
            3:[0,0,0,9,11,3,7,11,10,2,7,4],
            4:[0,0,0,10,3,4,8,10,11,7,8,5],
            5:[0,0,0,11,3,5,7,10,4,6,9,6],
            6:[0,0,0,7,3,6,9,9,5,0,10,9],
            7:[0,0,0,8,5,7,11,10,4,0,6,9],
            8:[0,0,0,9,5,3,11,0,4,0,2,11],
            9:[0,0,0,10,5,7,11,0,2,0,2,13],
            10:[0,0,0,11,7,7,2,0,3,0,3,15],
            11:[0,0,0,7,8,7,2,0,9,0,3,15],
            12:[0,0,0,8,9,7,4,0,10,0,3,18],
            13:[0,0,0,9,10,7,4,0,11,0,4,19],
            14:[0,0,0,10,11,8,5,0,11,0,4,19],
            15:[0,0,0,11,7,8,5,0,10,0,5,20],
            16:[0,0,0,0,8,2,6,0,11,0,5,21],
            17:[0,0,0,0,9,3,6,0,10,0,7,22],
            18:[0,0,0,0,10,3,6,0,9,0,7,23],
            19:[0,0,0,0,11,3,7,0,0,0,7,24],
            20:[0,0,0,0,7,4,7,0,0,0,7,24],
            21:[0,0,0,0,7,2,7,0,0,0,7,25],
            22:[0,0,0,0,11,3,8,0,0,0,7,2],
            23:[0,0,0,0,10,4,8,0,0,0,8,2],
            24:[0,0,0,0,0,5,8,0,0,0,8,2],
            25:[0,0,0,0,0,6,10,0,0,0,8,3],
            26:[0,0,0,0,0,7,10,0,0,0,9,3],
            27:[0,0,0,0,0,0,11,0,0,0,9,3],
            28:[0,0,0,0,0,0,11,0,0,0,9,3],
            29:[0,0,0,0,0,0,0,0,0,0,10,4],
            30:[0,0,0,0,0,0,0,0,0,0,10,4],
            31:[0,0,0,0,0,0,0,0,0,0,10,4],
            32:[0,0,0,0,0,0,0,0,0,0,11,4],
            33:[0,0,0,0,0,0,0,0,0,0,11,5],
            34:[0,0,0,0,0,0,0,0,0,0,11,6],
            35:[0,0,0,0,0,0,0,0,0,0,11,6],
            36:[0,0,0,0,0,0,0,0,0,0,2,6],
            37:[0,0,0,0,0,0,0,0,0,0,6,6],
            38:[0,0,0,0,0,0,0,0,0,0,0,6],
            39:[0,0,0,0,0,0,0,0,0,0,0,6],
            40:[0,0,0,0,0,0,0,0,0,0,0,6],
            41:[0,0,0,0,0,0,0,0,0,0,0,6],
            42:[0,0,0,0,0,0,0,0,0,0,0,6],
            43:[0,0,0,0,0,0,0,0,0,0,0,6],
            44:[0,0,0,0,0,0,0,0,0,0,0,6],
            45:[0,0,0,0,0,0,0,0,0,0,0,7],
            46:[0,0,0,0,0,0,0,0,0,0,0,7],
            47:[0,0,0,0,0,0,0,0,0,0,0,8],
            48:[0,0,0,0,0,0,0,0,0,0,0,8],
            49:[0,0,0,0,0,0,0,0,0,0,0,10],
            50:[0,0,0,0,0,0,0,0,0,0,0,10],
            51:[0,0,0,0,0,0,0,0,0,0,0,11],
            52:[0,0,0,0,0,0,0,0,0,0,0,11],
            53:[0,0,0,0,0,0,0,0,0,0,0,12],
            54:[0,0,0,0,0,0,0,0,0,0,0,12],
            55:[0,0,0,0,0,0,0,0,0,0,0,12],
            56:[0,0,0,0,0,0,0,0,0,0,0,12],
            57:[0,0,0,0,0,0,0,0,0,0,0,12],
            58:[0,0,0,0,0,0,0,0,0,0,0,12],
            59:[0,0,0,0,0,0,0,0,0,0,0,12],
            60:[0,0,0,0,0,0,0,0,0,0,0,12],
            61:[0,0,0,0,0,0,0,0,0,0,0,12],
            62:[0,0,0,0,0,0,0,0,0,0,0,13],
            63:[0,0,0,0,0,0,0,0,0,0,0,13],
            64:[0,0,0,0,0,0,0,0,0,0,0,14],
            65:[0,0,0,0,0,0,0,0,0,0,0,14],
            66:[0,0,0,0,0,0,0,0,0,0,0,16],
            67:[0,0,0,0,0,0,0,0,0,0,0,16],
            68:[0,0,0,0,0,0,0,0,0,0,0,17],
            69:[0,0,0,0,0,0,0,0,0,0,0,17],
            70:[0,0,0,0,0,0,0,0,0,0,0,18],
            71:[0,0,0,0,0,0,0,0,0,0,0,18],
            72:[0,0,0,0,0,0,0,0,0,0,0,18],
            73:[0,0,0,0,0,0,0,0,0,0,0,18],
            74:[0,0,0,0,0,0,0,0,0,0,0,18],
            75:[0,0,0,0,0,0,0,0,0,0,0,18],
            76:[0,0,0,0,0,0,0,0,0,0,0,18],
            77:[0,0,0,0,0,0,0,0,0,0,0,18],
            78:[0,0,0,0,0,0,0,0,0,0,0,18],
            79:[0,0,0,0,0,0,0,0,0,0,0,18],
            80:[0,0,0,0,0,0,0,0,0,0,0,18],
            81:[0,0,0,0,0,0,0,0,0,0,0,18],
            82:[0,0,0,0,0,0,0,0,0,0,0,21],
            83:[0,0,0,0,0,0,0,0,0,0,0,20],
            84:[0,0,0,0,0,0,0,0,0,0,0,20],
            85:[0,0,0,0,0,0,0,0,0,0,0,21],
            86:[0,0,0,0,0,0,0,0,0,0,0,21],
            87:[0,0,0,0,0,0,0,0,0,0,0,21],
            88:[0,0,0,0,0,0,0,0,0,0,0,21],
            89:[0,0,0,0,0,0,0,0,0,0,0,21],
            90:[0,0,0,0,0,0,0,0,0,0,0,21],
            91:[0,0,0,0,0,0,0,0,0,0,0,21],
            92:[0,0,0,0,0,0,0,0,0,0,0,22],
            93:[0,0,0,0,0,0,0,0,0,0,0,22],
            94:[0,0,0,0,0,0,0,0,0,0,0,22],
            95:[0,0,0,0,0,0,0,0,0,0,0,22],
            96:[0,0,0,0,0,0,0,0,0,0,0,22],
            97:[0,0,0,0,0,0,0,0,0,0,0,23],
            98:[0,0,0,0,0,0,0,0,0,0,0,24],
            99:[0,0,0,0,0,0,0,0,0,0,0,24],
            100:[0,0,0,0,0,0,0,0,0,0,0,24],
            101:[0,0,0,0,0,0,0,0,0,0,0,24],
            102:[0,0,0,0,0,0,0,0,0,0,0,25],
            103:[0,0,0,0,0,0,0,0,0,0,0,25],
            104:[0,0,0,0,0,0,0,0,0,0,0,25],
            105:[0,0,0,0,0,0,0,0,0,0,0,25],
            106:[0,0,0,0,0,0,0,0,0,0,0,26],
            107:[0,0,0,0,0,0,0,0,0,0,0,26],
            108:[0,0,0,0,0,0,0,0,0,0,0,26],
            109:[0,0,0,0,0,0,0,0,0,0,0,26],
        },
        2:{
            1:[0,0,6,6,11,9,7,4,4,6,3,9],
            2:[0,0,0,6,6,10,6,7,9,6,2,3],
            3:[0,0,0,6,6,10,7,4,6,10,6,9],
            4:[0,0,0,6,10,10,7,6,6,2,6,9],
            5:[0,0,0,6,9,10,10,7,10,11,6,2],
            6:[0,0,0,5,8,10,5,7,10,0,6,6],
            7:[0,0,0,5,10,10,9,4,2,0,3,12],
            8:[0,0,0,5,9,2,10,0,3,0,7,13],
            9:[0,0,0,5,8,2,6,0,4,0,11,7],
            10:[0,0,0,5,4,3,5,0,4,10,2,6],
            11:[0,0,0,7,4,4,6,0,11,0,5,12],
            12:[0,0,0,7,4,5,5,0,9,0,7,9],
            13:[0,0,0,7,4,6,7,0,9,0,5,8],
            14:[0,0,0,7,4,7,5,0,5,0,7,10],
            15:[0,0,0,7,8,8,7,0,5,0,5,3],
            16:[0,0,0,0,8,4,2,0,7,0,7,13],
            17:[0,0,0,0,8,4,3,0,7,0,3,13],
            18:[0,0,0,0,8,5,4,0,10,0,5,13],
            19:[0,0,0,0,8,6,8,0,0,0,7,9],
            20:[0,0,0,0,5,5,9,0,0,0,8,13],
            21:[0,0,0,0,7,2,11,0,0,0,9,13],
            22:[0,0,0,0,10,9,5,0,0,0,11,3],
            23:[0,0,0,0,10,9,6,0,0,0,3,8],
            24:[0,0,0,0,0,9,8,0,0,0,5,10],
            25:[0,0,0,0,0,9,10,0,0,0,7,2],
            26:[0,0,0,0,0,9,11,0,0,0,3,5],
            27:[0,0,0,0,0,0,5,0,0,0,5,13],
            28:[0,0,0,0,0,0,7,0,0,0,7,15],
            29:[0,0,0,0,0,0,0,0,0,0,3,5],
            30:[0,0,0,0,0,0,0,0,0,0,5,8],
            31:[0,0,0,0,0,0,0,0,0,0,7,10],
            32:[0,0,0,0,0,0,0,0,0,0,3,12],
            33:[0,0,0,0,0,0,0,0,0,0,5,10],
            34:[0,0,0,0,0,0,0,0,0,0,6,3],
            35:[0,0,0,0,0,0,0,0,0,0,7,5],
            36:[0,0,0,0,0,0,0,0,0,0,5,6],
            37:[0,0,0,0,0,0,0,0,0,0,6,7],
            38:[0,0,0,0,0,0,0,0,0,0,0,8],
            39:[0,0,0,0,0,0,0,0,0,0,0,10],
            40:[0,0,0,0,0,0,0,0,0,0,0,11],
            41:[0,0,0,0,0,0,0,0,0,0,0,12],
            42:[0,0,0,0,0,0,0,0,0,0,0,13],
            43:[0,0,0,0,0,0,0,0,0,0,0,15],
            44:[0,0,0,0,0,0,0,0,0,0,0,16],
            45:[0,0,0,0,0,0,0,0,0,0,0,6],
            46:[0,0,0,0,0,0,0,0,0,0,0,12],
            47:[0,0,0,0,0,0,0,0,0,0,0,6],
            48:[0,0,0,0,0,0,0,0,0,0,0,12],
            49:[0,0,0,0,0,0,0,0,0,0,0,6],
            50:[0,0,0,0,0,0,0,0,0,0,0,12],
            51:[0,0,0,0,0,0,0,0,0,0,0,6],
            52:[0,0,0,0,0,0,0,0,0,0,0,12],
            53:[0,0,0,0,0,0,0,0,0,0,0,4],
            54:[0,0,0,0,0,0,0,0,0,0,0,5],
            55:[0,0,0,0,0,0,0,0,0,0,0,7],
            56:[0,0,0,0,0,0,0,0,0,0,0,8],
            57:[0,0,0,0,0,0,0,0,0,0,0,10],
            58:[0,0,0,0,0,0,0,0,0,0,0,11],
            59:[0,0,0,0,0,0,0,0,0,0,0,13],
            60:[0,0,0,0,0,0,0,0,0,0,0,14],
            61:[0,0,0,0,0,0,0,0,0,0,0,16],
            62:[0,0,0,0,0,0,0,0,0,0,0,6],
            63:[0,0,0,0,0,0,0,0,0,0,0,12],
            64:[0,0,0,0,0,0,0,0,0,0,0,6],
            65:[0,0,0,0,0,0,0,0,0,0,0,12],
            66:[0,0,0,0,0,0,0,0,0,0,0,6],
            67:[0,0,0,0,0,0,0,0,0,0,0,12],
            68:[0,0,0,0,0,0,0,0,0,0,0,6],
            69:[0,0,0,0,0,0,0,0,0,0,0,12],
            70:[0,0,0,0,0,0,0,0,0,0,0,2],
            71:[0,0,0,0,0,0,0,0,0,0,0,3],
            72:[0,0,0,0,0,0,0,0,0,0,0,5],
            73:[0,0,0,0,0,0,0,0,0,0,0,6],
            74:[0,0,0,0,0,0,0,0,0,0,0,7],
            75:[0,0,0,0,0,0,0,0,0,0,0,8],
            76:[0,0,0,0,0,0,0,0,0,0,0,10],
            77:[0,0,0,0,0,0,0,0,0,0,0,11],
            78:[0,0,0,0,0,0,0,0,0,0,0,12],
            79:[0,0,0,0,0,0,0,0,0,0,0,13],
            80:[0,0,0,0,0,0,0,0,0,0,0,15],
            81:[0,0,0,0,0,0,0,0,0,0,0,16],
            82:[0,0,0,0,0,0,0,0,0,0,0,4],
            83:[0,0,0,0,0,0,0,0,0,0,0,8],
            84:[0,0,0,0,0,0,0,0,0,0,0,10],
            85:[0,0,0,0,0,0,0,0,0,0,0,5],
            86:[0,0,0,0,0,0,0,0,0,0,0,8],
            87:[0,0,0,0,0,0,0,0,0,0,0,10],
            88:[0,0,0,0,0,0,0,0,0,0,0,12],
            89:[0,0,0,0,0,0,0,0,0,0,0,14],
            90:[0,0,0,0,0,0,0,0,0,0,0,15],
            91:[0,0,0,0,0,0,0,0,0,0,0,16],
            92:[0,0,0,0,0,0,0,0,0,0,0,4],
            93:[0,0,0,0,0,0,0,0,0,0,0,8],
            94:[0,0,0,0,0,0,0,0,0,0,0,10],
            95:[0,0,0,0,0,0,0,0,0,0,0,12],
            96:[0,0,0,0,0,0,0,0,0,0,0,14],
            97:[0,0,0,0,0,0,0,0,0,0,0,12],
            98:[0,0,0,0,0,0,0,0,0,0,0,8],
            99:[0,0,0,0,0,0,0,0,0,0,0,10],
            100:[0,0,0,0,0,0,0,0,0,0,0,12],
            101:[0,0,0,0,0,0,0,0,0,0,0,14],
            102:[0,0,0,0,0,0,0,0,0,0,0,8],
            103:[0,0,0,0,0,0,0,0,0,0,0,10],
            104:[0,0,0,0,0,0,0,0,0,0,0,12],
            105:[0,0,0,0,0,0,0,0,0,0,0,14],
            106:[0,0,0,0,0,0,0,0,0,0,0,8],
            107:[0,0,0,0,0,0,0,0,0,0,0,9],
            108:[0,0,0,0,0,0,0,0,0,0,0,10],
            109:[0,0,0,0,0,0,0,0,0,0,0,12],
        }
    },
    /*pressurePlate positions*/3:{
        1:{
            1:[0,0,9,2,4,2,3,10,5,0,4,3],
            2:[0,0,0,3,11,6,3,11,4,0,9,5],
            3:[0,0,0,4,8,2,4,0,3,0,2,22],
            4:[0,0,0,5,0,5,5,0,10,0,8,24],
            5:[0,0,0,6,0,4,6,0,0,0,9,7],
            6:[0,0,0,0,0,7,7,0,0,0,10,6],
            7:[0,0,0,0,0,5,7,0,0,0,0,12],
            8:[0,0,0,0,0,0,8,0,0,0,0,5],
            9:[0,0,0,0,0,0,11,0,0,0,0,17],
            10:[0,0,0,0,0,0,0,0,0,0,0,12],
            11:[0,0,0,0,0,0,0,0,0,0,0,12],
            12:[0,0,0,0,0,0,0,0,0,0,0,8],
            13:[0,0,0,0,0,0,0,0,0,0,0,25],
            14:[0,0,0,0,0,0,0,0,0,0,0,26],
            15:[0,0,0,0,0,0,0,0,0,0,0,24],
            16:[0,0,0,0,0,0,0,0,0,0,0,21],
            17:[0,0,0,0,0,0,0,0,0,0,0,20],
            18:[0,0,0,0,0,0,0,0,0,0,0,21],
            19:[0,0,0,0,0,0,0,0,0,0,0,23],
            20:[0,0,0,0,0,0,0,0,0,0,0,23],
            21:[0,0,0,0,0,0,0,0,0,0,0,25]
        },
        2:{
            1:[0,0,9,11,9,3,2,5,11,0,9,9],
            2:[0,0,0,11,11,4,10,5,11,0,4,12],
            3:[0,0,0,11,5,5,10,0,3,0,2,15],
            4:[0,0,0,11,0,6,10,0,10,0,2,15],
            5:[0,0,0,11,0,7,5,0,0,0,2,16],
            6:[0,0,0,0,0,7,5,0,0,0,2,9],
            7:[0,0,0,0,0,8,2,0,0,0,0,9],
            8:[0,0,0,0,0,0,2,0,0,0,0,13],
            9:[0,0,0,0,0,0,11,0,0,0,0,13],
            10:[0,0,0,0,0,0,0,0,0,0,0,6],
            11:[0,0,0,0,0,0,0,0,0,0,0,12],
            12:[0,0,0,0,0,0,0,0,0,0,0,16],
            13:[0,0,0,0,0,0,0,0,0,0,0,11],
            14:[0,0,0,0,0,0,0,0,0,0,0,11],
            15:[0,0,0,0,0,0,0,0,0,0,0,3],
            16:[0,0,0,0,0,0,0,0,0,0,0,3],
            17:[0,0,0,0,0,0,0,0,0,0,0,4],
            18:[0,0,0,0,0,0,0,0,0,0,0,6],
            19:[0,0,0,0,0,0,0,0,0,0,0,4],
            20:[0,0,0,0,0,0,0,0,0,0,0,6],
            21:[0,0,0,0,0,0,0,0,0,0,0,5]
        }
    },
    /*Cannon positions */ 4:{
        /*x positions */ 1:{
            1:[0,0,0,0,0,0,0,0,0,2,2,2],
            2:[0,0,0,0,0,0,0,0,0,11,2,12],
            3:[0,0,0,0,0,0,0,0,0,6,3,15],
            4:[0,0,0,0,0,0,0,0,0,7,0,15],
            5:[0,0,0,0,0,0,0,0,0,0,0,7],
        },
        /*y positions */ 2:{
            1:[0,0,0,0,0,0,0,0,0,6,6,9],
            2:[0,0,0,0,0,0,0,0,0,10,10,2],
            3:[0,0,0,0,0,0,0,0,0,2,11,2],
            4:[0,0,0,0,0,0,0,0,0,11,0,16],
            5:[0,0,0,0,0,0,0,0,0,0,0,13],
        },
        /*direction*/ 3:{ /* 1=up 2=right 3=down 4=left*/
            1:["","","","","","","","","","2","2","2"],
            2:["","","","","","","","","","4","2","4"],
            3:["","","","","","","","","","3","1","3"],
            4:["","","","","","","","","","1","","1"],
            5:["","","","","","","","","","","","2"],
        }
    },
    /*Fuse positions */ 5:{
        /*x positions */ 1:{
            1:[0,0,0,0,0,0,0,0,0,5,10,2],
            2:[0,0,0,0,0,0,0,0,0,8,2,13],
            3:[0,0,0,0,0,0,0,0,0,5,4,14],
            4:[0,0,0,0,0,0,0,0,0,8,0,14],
            5:[0,0,0,0,0,0,0,0,0,0,0,8],
        },
        /*y positions */ 2:{
            1:[0,0,0,0,0,0,0,0,0,9,4,2],
            2:[0,0,0,0,0,0,0,0,0,9,9,2],
            3:[0,0,0,0,0,0,0,0,0,4,11,2],
            4:[0,0,0,0,0,0,0,0,0,4,0,16],
            5:[0,0,0,0,0,0,0,0,0,0,0,13],
        },
    }
}

let playerstartx = [6, 6, 6, 4, 4, 3, 2, 6, 4, 6,5,9];
let playerstarty = [6, 6, 6, 6, 6, 3, 2, 6, 7, 9,9,9];
let tds = "";// this will store an array of all of the tds so that I can go through each one of them
function start(){
    currentLevel = 0;
    levelMoves = 0;
    document.getElementById("levelMoves").innerHTML = levelMoves;
    totalMoves = 0;
    document.getElementById("totalMoves").innerHTML = totalMoves;
    totalResets = 0;
    document.getElementById("totalResets").innerHTML = totalResets;
    startTimer = false;
    currentTime = 0;
    document.getElementById("timer").innerHTML = currentTime;
    update();
}

let newTd = "";
let newRow = "";

function update(){

    if (currentLevel === 12){
        startTimer = false;
        logLevelTimes = false;
        if(localStorage.getItem("bestTime") === null || localStorage.getItem("bestTime") === "null" || currentTime < localStorage.getItem("bestTime")){
            localStorage.setItem("bestTime", currentTime);
            console.log("updated Time");
        }
        if(localStorage.getItem("bestMoves") === null || localStorage.getItem("bestMoves") === "null" || totalMoves < localStorage.getItem("bestMoves")){
            localStorage.setItem("bestMoves", totalMoves);
            console.log("updated Moves");
        }
        console.log(localStorage.getItem("bestTime"));
        console.log(localStorage.getItem("bestMoves"));
        console.log(allLevelTimes);
        console.log(allLevelMoves);

        const table = document.getElementById("endStats");
        console.log(table);
        for (let i = 0; i < allLevelMoves.length; i++) {
            table.rows[1].cells[i + 1].innerHTML = allLevelMoves[i];
        }
        for (let i = 0; i < allLevelTimes.length; i++) {
            table.rows[2].cells[i + 1].innerHTML = (Math.floor(allLevelTimes[i]*100))/100;
        }
        
        document.getElementById("stats").style.setProperty("display", "block", "important");
        document.getElementById("endStats").style.setProperty("display", "block", "important");

        return;
    }

    console.log("entered event listener");
    
    row = document.getElementsByClassName("y" + playery)[0];
    console.log(row);
    cell = row.getElementsByClassName("x" + playerx)[0];
    cell.style.backgroundColor = "transparent";

    // this segment here is meant to reset the board every time update is called to make sure that errors dont happen from overriding the css background colors
    document.getElementById("tablehead").innerHTML = "Level " + (currentLevel+1);
    document.getElementById("levelGoals").innerHTML = levelGoals[currentLevel];

    if (currentLevel>4) {
        document.getElementById("cellfloor1").style.setProperty("display", "none", "important");
        document.getElementById("cellfloor").style.setProperty("display", "none", "important");
    } else {
        document.getElementById("cellfloor1").style.setProperty("display", "block", "important");
        document.getElementById("cellfloor").style.setProperty("display", "block", "important");
    }

    if (currentLevel>10){

        let addedtds = document.querySelectorAll(".addedCell");
        addedtds.forEach(td => {
            td.remove();
        });
        let addedtrs = document.querySelectorAll(".addedRow");
        addedtrs.forEach(tr => {
            tr.remove();
        });

        console.log("Entered if to remove classes");
        for (let h = 2; h<12; h++){
            document.getElementsByClassName("y" + h)[0].getElementsByClassName("x12")[0].classList.remove("nopass");
            document.getElementsByClassName("y" + h)[0].getElementsByClassName("x12")[0].classList.remove("wall");
            document.getElementsByClassName("y" + h)[0].getElementsByClassName("x12")[0].style.backgroundColor = "transparent";
            document.getElementsByClassName("y" + h)[0].getElementsByClassName("x12")[0].innerHTML = "";
        }
        for (let h = 2; h<13; h++){
            document.getElementsByClassName("y12")[0].getElementsByClassName("x" + h)[0].classList.remove("nopass");
            document.getElementsByClassName("y12")[0].getElementsByClassName("x" + h)[0].classList.remove("wall");
            document.getElementsByClassName("y12")[0].getElementsByClassName("x" + h)[0].style.backgroundColor = "transparent";
            document.getElementsByClassName("y12")[0].getElementsByClassName("x" + h)[0].innerHTML = "";
        }
        document.getElementsByClassName("y6")[0].getElementsByClassName("x12")[0].classList.remove("exit");
        document.getElementsByClassName("y6")[0].getElementsByClassName("x12")[0].style.backgroundColor = "transparent";

        tds = document.querySelectorAll("td");//sets tds to the array created from query select all

        for (let i = 0; i < tds.length; i++) {//setting each cell to black to clear board
            tds[i].style.textAlign = "center";
            tds[i].style.fontStyle = "normal";
            tds[i].style.fontWeight = "normal";
            if (tds[i].classList.contains("box")||tds[i].classList.contains("nopass")||tds[i].classList.contains("pressurePlate")||tds[i].classList.contains("cannon")||tds[i].classList.contains("fuse")){
                tds[i].style.backgroundColor = "transparent";
                tds[i].classList.remove("box");
                tds[i].classList.remove("pressurePlate");
                tds[i].classList.remove("nopass");
                tds[i].classList.remove("cannon");
                tds[i].classList.remove("fuse");
                tds[i].innerHTML = "";
                tds[i].style.color = "white";
                tds[i].style.opacity = "100%";
            }
        }

        for (let i=1; i<13; i++){
            for (let j = 0; j<15; j++){
                newTd = document.createElement("td");
                newTd.classList.add("addedCell");
                row = document.getElementsByClassName(("y"+i))[0];
                row.appendChild(newTd);
                if (j===14 || i===1){
                    newTd.classList.add("wall");
                }
                newClass = "x" + (13+j);
                newTd.classList.add(newClass);
                newTd.style.textAlign = "center";
                newTd.style.fontStyle = "normal";
                newTd.style.fontWeight = "normal";
                if (i===9 && j===14){
                    newTd.classList.remove("wall");
                    newTd.classList.add("exit");
                    newTd.style.backgroundColor = "white";
                }
            }
        }

        for(let i=0; i<5; i++){
            newRow = document.createElement("tr");
            newClass = "y" + (13+i);
            newRow.classList.add(newClass);
            newRow.classList.add("addedRow");
            document.getElementById("game").appendChild(newRow);
            for(let j = 0; j<27; j++){
                newTd = document.createElement("td");
                newRow.appendChild(newTd);
                newClass = "x" + (j+1);
                newTd.classList.add(newClass);
                newTd.classList.add("addedCell");
                if(i===4||j===0||j===26){
                    newTd.classList.add("wall");
                }
                newTd.style.textAlign = "center";
                newTd.style.fontStyle = "normal";
                newTd.style.fontWeight = "normal";
            }
            console.log(newRow);
            console.log("newRow");
        }

        tds = document.querySelectorAll(".wall");//setting edges to grey again
        for (let i = 0; i < tds.length; i++) {
            tds[i].style.backgroundColor = "rgb(110, 110, 110)";
            tds[i].classList.add("nopass");
        }

        tds = document.querySelectorAll('td');
        tds.forEach(td => {
            td.style.setProperty("width", "30px", "important");
            td.style.setProperty("height", "30px", "important");
            
        });
        
        document.getElementById("notifications").style.setProperty("left", "85%", "important");
        document.getElementById("soundstuff").style.setProperty("display", "none", "important");
        document.getElementById("game").style.setProperty("left", "15%", "important");
        document.getElementById("game").style.setProperty("top", "0.5%", "important");
        document.getElementById("key").style.setProperty("left", "4%", "important");

    } else {

        let addedtds = document.querySelectorAll(".addedCell");
        addedtds.forEach(td => {
            td.remove();
        });
        document.getElementById("notifications").style.setProperty("left", "69%", "important");
        document.getElementById("soundstuff").style.setProperty("display", "block", "important");
        document.getElementById("game").style.setProperty("left", "26%", "important");
        document.getElementById("game").style.setProperty("top", "2%", "important");
        document.getElementById("key").style.setProperty("left", "7%", "important");
        tds = document.querySelectorAll('td');
        tds.forEach(td => {
            td.style.setProperty("width", "40px", "important");
            td.style.setProperty("height", "40px", "important");
        });
    
        for (let h = 2; h < 12; h++){
            document.getElementsByClassName("y" + h)[0].getElementsByClassName("x12")[0].classList.add("nopass");
            document.getElementsByClassName("y" + h)[0].getElementsByClassName("x12")[0].classList.add("wall");
        }
        for (let h = 2; h < 13; h++){
            document.getElementsByClassName("y12")[0].getElementsByClassName("x" + h)[0].classList.add("nopass");
            document.getElementsByClassName("y12")[0].getElementsByClassName("x" + h)[0].classList.add("wall");
        }

        document.getElementsByClassName("y6")[0].getElementsByClassName("x12")[0].classList.add("exit");

        tds = document.querySelectorAll("td");//sets tds to the array created from query select all
        for (let i = 0; i < tds.length; i++) {//setting each cell to black to clear board
            tds[i].style.textAlign = "center";
            tds[i].style.fontStyle = "normal";
            tds[i].style.fontWeight = "normal";
            if (tds[i].classList.contains("box")||tds[i].classList.contains("nopass")||tds[i].classList.contains("pressurePlate")||tds[i].classList.contains("cannon")||tds[i].classList.contains("fuse")){
                tds[i].style.backgroundColor = "transparent";
                tds[i].classList.remove("box");
                tds[i].classList.remove("pressurePlate");
                tds[i].classList.remove("nopass");
                tds[i].classList.remove("cannon");
                tds[i].classList.remove("fuse");
                tds[i].innerHTML = "";
                tds[i].style.color = "white";
                tds[i].style.opacity = "100%";
            }
        }
        tds = document.querySelectorAll(".wall");//setting edges to grey again
        for (let i = 0; i < tds.length; i++) {
            tds[i].style.backgroundColor = "rgb(110, 110, 110)";
            tds[i].classList.add("nopass");
        }
        document.getElementsByClassName("exit")[0].style.backgroundColor = "white";//setting exit color
    }
    
    //currentLevel = (document.getElementById("dropdown").value) -1;//setting value of current level to be 1 less than input so that it lines up a little easier with the indexs for finding all of the values i will need
    //console.log("Current Level:" + currentLevel);


    playery = playerstarty[currentLevel];//setting player back at the start of the level
    playerx = playerstartx[currentLevel];
    row = document.getElementsByClassName("y" + playery)[0];//grabbing the row by class
    cell = row.getElementsByClassName("x" + playerx)[0];//then grabbing the specific cell
    cell.style.backgroundColor = "red";//setting player on the board
    cell.classList.add("player");
    //and the pressurePlates
    for (let k = 1; k<=numpressurePlates[currentLevel]; k++){
        console.log("adding pressureplate");
        row = document.getElementsByClassName("y" + Positions[3][2][k][currentLevel])[0];
        console.log("rowdone");
        console.log(row);
        cell = row.getElementsByClassName("x" + Positions[3][1][k][currentLevel])[0];
        console.log("celldone");
        console.log(cell);
        cell.classList.add("pressurePlate");
        cell.style.backgroundColor = "tan";
    }
    for (let i = 1; i<=numBoxes[currentLevel]; i++){//repeat for each box that should be in the level
        console.log("adding box");
        row = document.getElementsByClassName("y" + Positions[1][2][i][currentLevel])[0];//This is getting the object Positions, accessing the first thing there (box positions) then accessing the second thing there (the y values) then accessing the ith element which is basically what number box, then the currentlevel element which will have the value of the x or y coordinate for any specific level, then the first element of the array output by using getElementsByClassName... lotta brackets ik
        console.log("rowdone");
        console.log(row);
        cell = row.getElementsByClassName("x" + Positions[1][1][i][currentLevel])[0];//same here
        console.log("celldone");
        console.log(cell);
        cell.classList.add("box");//setting the class to box so it can be checked for when the player moves
        cell.innerHTML = "box";
        cell.style.color = "white";
        cell.style.backgroundColor = "brown";//setting color to brown so player can see it
    }
    //doing the same now for walls
    for (let j = 1; j<=numWalls[currentLevel]; j++){
        console.log("adding wall");
        row = document.getElementsByClassName("y" + Positions[2][2][j][currentLevel])[0];
        console.log("rowdone");
        console.log(row);
        cell = row.getElementsByClassName("x" + Positions[2][1][j][currentLevel])[0];
        console.log("celldone");
        console.log(cell);
        cell.classList.add("nopass");
        cell.innerHTML = "W";
        cell.style.backgroundColor = "rgb(110, 110, 110)";
        if (j<=numpressurePlates[currentLevel]){ 
            console.log(cell);
            console.log("is light grey");
            cell.style.backgroundColor = "rgb(110, 110, 110)";
            cell.innerHTML = "W";
            cell.style.fontStyle = "italic";
            cell.style.fontWeight = "900";
        }
    }
    for (let h = 1; h<=numCannons[currentLevel]; h++){
        console.log("adding cannon");
        row = document.getElementsByClassName("y" + Positions[4][2][h][currentLevel])[0];
        console.log("rowdone");
        console.log(row);
        cell = row.getElementsByClassName("x" + Positions[4][1][h][currentLevel])[0];
        console.log("celldone");
        console.log(cell);
        cell.classList.add("nopass");
        cell.classList.add("cannon");
        let direction = (Positions[4][3][h][currentLevel])
        cell.classList.add(direction);
        if (direction==="1"){
            cell.innerHTML = "U"
        }
        if (direction==="2"){
            cell.innerHTML = "R"
        }
        if (direction==="3"){
            cell.innerHTML = "D"
        }
        if (direction==="4"){
            cell.innerHTML = "L"
        }
        cell.style.backgroundColor = "black";
    }
    for (let l = 1; l<=numFuses[currentLevel]; l++){
        console.log("adding fuse");
        row = document.getElementsByClassName("y" + Positions[5][2][l][currentLevel])[0];
        console.log("rowdone");
        console.log(row);
        cell = row.getElementsByClassName("x" + Positions[5][1][l][currentLevel])[0];
        console.log("celldone");
        console.log(cell);
        cell.classList.add("fuse");
        cell.style.backgroundColor = "bisque";
    }
    if(currentLevel == 0){
        document.getElementById("gotoLevel0").style.setProperty("color", "white", "important");
    } else if (currentLevel == 1){
        document.getElementById("gotoLevel1").style.setProperty("color", "white", "important");
    } else if (currentLevel == 2){
        document.getElementById("gotoLevel2").style.setProperty("color", "white", "important");
    } else if (currentLevel == 3){
        document.getElementById("gotoLevel3").style.setProperty("color", "white", "important");
    } else if (currentLevel == 4){
        document.getElementById("gotoLevel4").style.setProperty("color", "white", "important");
    } else if (currentLevel == 5){
        document.getElementById("gotoLevel5").style.setProperty("color", "white", "important");
    } else if (currentLevel == 6){
        document.getElementById("gotoLevel6").style.setProperty("color", "white", "important");
    } else if (currentLevel == 7){
        document.getElementById("gotoLevel7").style.setProperty("color", "white", "important");
    } else if (currentLevel == 8){
        document.getElementById("gotoLevel8").style.setProperty("color", "white", "important");
    }  else if (currentLevel == 9){
        document.getElementById("gotoLevel9").style.setProperty("color", "white", "important");
    }
    if (currentLevel>maxLevel){
        maxLevel = currentLevel;
        /*console.log("gotoLevel" + currentLevel);
        document.getElementById("gotoLevel" + maxLevel).style.setProperty("color", "white", "important");*/
    }
    if (currentLevel == 5){
        fadeOutAudio(knightsTemplar, 3000);
        fadeInAudio(BarefootAdventures, 3000);
    }
    if (currentLevel == 11){
        fadeOutAudio(BarefootAdventures, 3000);
        fadeInAudio(betweenWorlds, 3000);
    }
    checkpressurePlates();
}

/*function styleAllCells(){
    tds = document.querySelectorAll("td");//sets tds to the array created from query select all
    for (let i = 0; i < tds.length; i++) {//setting each cell to black to clear board
        tds[i].style.textAlign = "center";
        tds[i].style.fontWeight = "normal";
        tds[i].style.opacity = "100%";
        if (tds[i].classList.contains("pressurePlate")){
            tds[i].style.backgroundColor = "tan";
            //add a way to add an image
            if (tds[i].classList.contains("box")){
                tds[i].style.opacity = "70%";
            }
        }
        if (tds[i].classList.contains("box")){
            tds[i].style.backgroundColor = "brown";
            tds[i].innerHTML = "Box";
        }
        if (tds[i].classList.contains("nopass")){
            tds[i].style.fontWeight = "900%";
            tds[i].innerHTML = "W";

        }
    }
}*/

let cell2 = "";
let row2 = "";

function checkpressurePlates(){
    console.log("checking pressurePlates");
    for(let i = 1; i <= numpressurePlates[currentLevel]; i++){
        row2 = document.getElementsByClassName("y" + Positions[3][2][i][currentLevel])[0];
        cell2 = row2.getElementsByClassName("x" + Positions[3][1][i][currentLevel])[0];
        console.log(Positions[3][2][i][currentLevel] === playery);
        console.log(Positions[3][1][i][currentLevel] === playerx);
        console.log(row2);
        console.log(cell2);
        console.log(i);
        if ((cell2.classList.contains("pressurePlate") && cell2.classList.contains("box")) || (Positions[3][2][i][currentLevel] === playery && Positions[3][1][i][currentLevel] === playerx)){
            cell2.style.opacity = "60%";
            row2 = document.getElementsByClassName("y" + Positions[2][2][i][currentLevel])[0];
            cell2 = row2.getElementsByClassName("x" + Positions[2][1][i][currentLevel])[0];
            cell2.classList.remove("nopass"); 
            cell2.innerHTML = "";
            cell2.style.backgroundColor = "transparent";
            if (cell2.classList.contains("box")){
                cell2.innerHTML = "box";
                cell2.style.backgroundColor = "brown";
            }
        } else {
            row2 = document.getElementsByClassName("y" + Positions[3][2][i][currentLevel])[0];
            cell2 = row2.getElementsByClassName("x" + Positions[3][1][i][currentLevel])[0];
            cell2.style.opacity = "100%";
            console.log("turning cell grey");
            row2 = document.getElementsByClassName("y" + Positions[2][2][i][currentLevel])[0];
            cell2 = row2.getElementsByClassName("x" + Positions[2][1][i][currentLevel])[0];
            console.log(row2);
            console.log(cell2);
            console.log("(" + Positions[2][1][i][currentLevel] + ", " + Positions[2][2][i][currentLevel]+ ")"),
            cell2.classList.add("nopass");
            cell2.innerHTML = "W";
            cell2.style.backgroundColor = "rgb(110, 110, 110)";
            if (cell2.classList.contains("box")){
                let radius = 1;
                while (true) {
                    for (let j = -radius; j<= radius; j++){
                        for (let k = -radius; k<=radius; k++){
                            row2 = document.getElementsByClassName("y" + ((Positions[2][2][i][currentLevel]) + j))[0];
                            cell2 = row2.getElementsByClassName("x" + ((Positions[2][1][i][currentLevel]) + k))[0];
                            if (!(cell2.classList.contains("box")||cell2.classList.contains("nopass") || (((Positions[2][2][i][currentLevel]) + j) == playery) && ((Positions[2][1][i][currentLevel]) + k) == playerx)){
                                cell2.innerHTML = "box";
                                cell2.style.backgroundColor = "brown";
                                cell2.classList.add("box");
                                row2 = document.getElementsByClassName("y" + Positions[2][2][i][currentLevel])[0];
                                cell2 = row2.getElementsByClassName("x" + Positions[2][1][i][currentLevel])[0];
                                cell2.classList.remove("box");
                                return;
                            }
                        }
                    }
                radius ++;  
                }
            }
        }
    }
}


async function checkFuses() {
    for(let i = 1; i <= numFuses[currentLevel]; i++){
        row = document.getElementsByClassName("y" + Positions[5][2][i][currentLevel])[0];
        cell = row.getElementsByClassName("x" + Positions[5][1][i][currentLevel])[0];
        if ((cell.classList.contains("fuse") && cell.classList.contains("box")) || (Positions[5][2][i][currentLevel] === playery && Positions[5][1][i][currentLevel] === playerx)){
            cell.style.opacity = "60%";
            row = document.getElementsByClassName("y" + Positions[4][2][i][currentLevel])[0];
            cell = row.getElementsByClassName("x" + Positions[4][1][i][currentLevel])[0];
            let cannondirection = Positions[4][3][i][currentLevel];
            if (cannondirection == 2) {
                row = document.getElementsByClassName("y" + Positions[4][2][i][currentLevel])[0];
                cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])+1))[0];
                if(cell.classList.contains("box")){
                    cell.classList.remove("box")
                    cell.innerHTML = "";
                    cell.backgroundColor = "transparent";
                    let tilesTraveled = 1;
                    row = document.getElementsByClassName("y" + Positions[4][2][i][currentLevel])[0];
                    cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])+tilesTraveled))[0];
                    while (true){ //((Positions[4][1][i][currentLevel])+tilesTraveled)<12
                        row = document.getElementsByClassName("y" + Positions[4][2][i][currentLevel])[0];
                        cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])+tilesTraveled))[0];
                        cell.classList.remove("box");
                        cell.innerHTML = "";
                        cell.style.backgroundColor = "transparent";
                        if(cell.classList.contains("fuse")){
                            cell.style.backgroundColor = "bisque";
                        }
                        if(cell.classList.contains("pressurePlate")){
                            cell.style.backgroundColor = "tan";
                        }
                        row = document.getElementsByClassName("y" + Positions[4][2][i][currentLevel])[0];
                        cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])+tilesTraveled+1))[0];
                        if(!(cell == undefined)){
                            if(cell.classList.contains("box")){
                                cell.classList.remove("box");
                                cell.innerHTML = "";
                                cell.style.backgroundColor = "transparent"
                                if(cell.classList.contains("fuse")){
                                    cell.style.backgroundColor = "bisque";
                                }
                                if(cell.classList.contains("pressurePlate")){
                                    cell.style.backgroundColor = "tan";
                                }
                                return;
                            } else if(cell.classList.contains("nopass")){
                                cell.classList.remove("nopass");
                                cell.innerHTML = "";
                                cell.style.backgroundColor = "transparent"
                                if(cell.classList.contains("fuse")){
                                    cell.style.backgroundColor = "bisque";
                                }
                                if(cell.classList.contains("pressurePlate")){
                                    cell.style.backgroundColor = "tan";
                                }
                                return;
                            } else if(Positions[4][2][i][currentLevel] == playery && ((Positions[4][1][i][currentLevel])+tilesTraveled+1) == playerx){
                                update();
                                return;
                            }else {
                                cell.classList.add("box");
                                cell.innerHTML = "box";
                                cell.style.backgroundColor = "brown"
                                tilesTraveled++;
                            }
                        }
                        if(cell == undefined){
                            tds = document.querySelectorAll(".wall");//setting edges to grey again
                            for (let j = 0; j < tds.length; j++) {
                                tds[j].style.backgroundColor = "rgb(110, 110, 110)";
                                tds[j].classList.add("nopass");
                                tds[j].innerHTML = "";
                            }
                            return;
                        }
                        await wait(25);
                    }
                }
                tds = document.querySelectorAll(".wall");//setting edges to grey again
                for (let i = 0; i < tds.length; i++) {
                    tds[i].style.backgroundColor = "rgb(110, 110, 110)";
                    tds[i].classList.add("nopass");
                    tds[i].innerHTML = "";
                }
                document.getElementsByClassName("exit")[0].style.backgroundColor = "white";//setting exit color
            }

            if (cannondirection == 1) {
                row = document.getElementsByClassName("y" + ((Positions[4][2][i][currentLevel])-1))[0];
                cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])))[0];
                if(cell.classList.contains("box")){
                    cell.classList.remove("box")
                    cell.innerHTML = "";
                    cell.backgroundColor = "transparent";
                    let tilesTraveled = 1;
                    row = document.getElementsByClassName("y" + ((Positions[4][2][i][currentLevel])-tilesTraveled))[0];
                    cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])))[0];
                    while (((Positions[4][2][i][currentLevel])-tilesTraveled)>1){
                        row = document.getElementsByClassName("y" + ((Positions[4][2][i][currentLevel])-tilesTraveled))[0];
                        cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])))[0];
                        cell.classList.remove("box");
                        cell.innerHTML = "";
                        cell.style.backgroundColor = "transparent";
                        if(cell.classList.contains("fuse")){
                            cell.style.backgroundColor = "bisque";
                        }
                        if(cell.classList.contains("pressurePlate")){
                            cell.style.backgroundColor = "tan";
                        }
                        row = document.getElementsByClassName("y" + ((Positions[4][2][i][currentLevel])-tilesTraveled-1))[0];
                        cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])))[0];
                        if(!(cell == undefined)){
                            if(cell.classList.contains("box")){
                                cell.classList.remove("box");
                                cell.innerHTML = "";
                                cell.style.backgroundColor = "transparent"
                                if(cell.classList.contains("fuse")){
                                    cell.style.backgroundColor = "bisque";
                                }
                                if(cell.classList.contains("pressurePlate")){
                                    cell.style.backgroundColor = "tan";
                                }
                                return;
                            } else if(cell.classList.contains("nopass")&& (!cell.classList.contains("wall"))){
                                cell.classList.remove("nopass");
                                cell.innerHTML = "";
                                cell.style.backgroundColor = "transparent"
                                if(cell.classList.contains("fuse")){
                                    cell.style.backgroundColor = "bisque";
                                }
                                if(cell.classList.contains("pressurePlate")){
                                    cell.style.backgroundColor = "tan";
                                }
                                return;
                            } else if (((Positions[4][2][i][currentLevel])-tilesTraveled-1) == playery && ((Positions[4][1][i][currentLevel])) == playerx){
                                update();
                                return;                                
                            } else {
                                cell.classList.add("box");
                                cell.innerHTML = "box";
                                cell.style.backgroundColor = "brown"
                                tilesTraveled++;
                            }
                        }
                        if(cell == undefined){
                            tds = document.querySelectorAll(".wall");//setting edges to grey again
                            for (let j = 0; j < tds.length; j++) {
                                tds[j].style.backgroundColor = "rgb(110, 110, 110)";
                                tds[j].classList.add("nopass");
                                tds[j].innerHTML = "";
                            }
                            return;
                        }
                        await wait(25);
                    }
                }
                tds = document.querySelectorAll(".wall");//setting edges to grey again
                for (let j = 0; j < tds.length; j++) {
                    tds[j].style.backgroundColor = "rgb(110, 110, 110)";
                    tds[j].classList.add("nopass");
                    tds[j].innerHTML = "";
                }
                document.getElementsByClassName("exit")[0].style.backgroundColor = "white";//setting exit color
            }

            if (cannondirection == 4) {
                row = document.getElementsByClassName("y" + Positions[4][2][i][currentLevel])[0];
                cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])-1))[0];
                if(cell.classList.contains("box")){
                    cell.classList.remove("box")
                    cell.innerHTML = "";
                    cell.backgroundColor = "transparent";
                    if(cell.classList.contains("fuse")){
                        cell.style.backgroundColor = "bisque";
                    }
                    if(cell.classList.contains("pressurePlate")){
                        cell.style.backgroundColor = "tan";
                    }
                    let tilesTraveled = 1;
                    row = document.getElementsByClassName("y" + Positions[4][2][i][currentLevel])[0];
                    cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])-tilesTraveled))[0];
                    while (((Positions[4][1][i][currentLevel])-tilesTraveled)>1){
                        row = document.getElementsByClassName("y" + Positions[4][2][i][currentLevel])[0];
                        cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])-tilesTraveled))[0];
                        cell.classList.remove("box");
                        cell.innerHTML = "";
                        cell.style.backgroundColor = "transparent";
                        if(cell.classList.contains("fuse")){
                            cell.style.backgroundColor = "bisque";
                        }
                        if(cell.classList.contains("pressurePlate")){
                            cell.style.backgroundColor = "tan";
                        }
                        row = document.getElementsByClassName("y" + Positions[4][2][i][currentLevel])[0];
                        cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])-tilesTraveled-1))[0];
                        console.log(cell);
                        console.log(tilesTraveled);
                        console.log((Positions[4][1][i][currentLevel])-tilesTraveled-1);
                        if(!(cell == undefined)){
                            if(cell.classList.contains("box")){
                                cell.classList.remove("box");
                                cell.innerHTML = "";
                                cell.style.backgroundColor = "transparent";
                                if(cell.classList.contains("fuse")){
                                    cell.style.backgroundColor = "bisque";
                                }
                                if(cell.classList.contains("pressurePlate")){
                                    cell.style.backgroundColor = "tan";
                                }
                                return;
                            } else if(cell.classList.contains("nopass")&& (!cell.classList.contains("wall"))){
                                cell.classList.remove("nopass");
                                cell.innerHTML = "";
                                cell.style.backgroundColor = "transparent";
                                if(cell.classList.contains("fuse")){
                                    cell.style.backgroundColor = "bisque";
                                }
                                if(cell.classList.contains("pressurePlate")){
                                    cell.style.backgroundColor = "tan";
                                }
                                return;
                            } else if (Positions[4][2][i][currentLevel] == playery && ((Positions[4][1][i][currentLevel])-tilesTraveled-1) == playerx){
                                update();
                                return;
                            } else {
                                cell.classList.add("box");
                                cell.innerHTML = "box";
                                cell.style.backgroundColor = "brown"
                                tilesTraveled++;
                            }
                        }
                        if(cell == undefined){
                            tds = document.querySelectorAll(".wall");//setting edges to grey again
                            for (let j = 0; j < tds.length; j++) {
                                tds[j].style.backgroundColor = "rgb(110, 110, 110)";
                                tds[j].classList.add("nopass");
                                tds[j].innerHTML = "";
                            }
                            return;
                        }
                        await wait(25);
                    }
                }
                tds = document.querySelectorAll(".wall");//setting edges to grey again
                for (let j = 0; j < tds.length; j++) {
                    tds[j].style.backgroundColor = "rgb(110, 110, 110)";
                    tds[j].classList.add("nopass");
                    tds[j].innerHTML = "";
                }
                document.getElementsByClassName("exit")[0].style.backgroundColor = "white";//setting exit color
            }

            if (cannondirection == 3) {
                row = document.getElementsByClassName("y" + ((Positions[4][2][i][currentLevel])+1))[0];
                cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])))[0];
                if(cell.classList.contains("box")){
                    cell.classList.remove("box")
                    cell.innerHTML = "";
                    cell.backgroundColor = "transparent";
                    if(cell.classList.contains("fuse")){
                        cell.style.backgroundColor = "bisque";
                    }
                    if(cell.classList.contains("pressurePlate")){
                        cell.style.backgroundColor = "tan";
                    }
                    let tilesTraveled = 1;
                    row = document.getElementsByClassName("y" + ((Positions[4][2][i][currentLevel])+tilesTraveled))[0];
                    cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])))[0];
                    while (((Positions[4][2][i][currentLevel])+tilesTraveled)<12){
                        row = document.getElementsByClassName("y" + ((Positions[4][2][i][currentLevel])+tilesTraveled))[0];
                        cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])))[0];
                        cell.classList.remove("box");
                        cell.innerHTML = "";
                        cell.style.backgroundColor = "transparent";
                        if(cell.classList.contains("fuse")){
                            cell.style.backgroundColor = "bisque";
                        }
                        if(cell.classList.contains("pressurePlate")){
                            cell.style.backgroundColor = "tan";
                        }
                        row = document.getElementsByClassName("y" + ((Positions[4][2][i][currentLevel])+tilesTraveled+1))[0];
                        cell = row.getElementsByClassName("x" + ((Positions[4][1][i][currentLevel])))[0];
                        if(!(cell == undefined)){
                            if(cell.classList.contains("box")){
                                cell.classList.remove("box");
                                cell.innerHTML = "";
                                cell.style.backgroundColor = "transparent";
                                if(cell.classList.contains("fuse")){
                                    cell.style.backgroundColor = "bisque";
                                }
                                if(cell.classList.contains("pressurePlate")){
                                    cell.style.backgroundColor = "tan";
                                }
                                return;
                            } else if(cell.classList.contains("nopass")&& (!cell.classList.contains("wall"))){
                                cell.classList.remove("nopass");
                                cell.innerHTML = "";
                                cell.style.backgroundColor = "transparent";
                                if(cell.classList.contains("fuse")){
                                    cell.style.backgroundColor = "bisque";
                                }
                                if(cell.classList.contains("pressurePlate")){
                                    cell.style.backgroundColor = "tan";
                                }
                                return;
                            } else if(((Positions[4][2][i][currentLevel])+tilesTraveled+1) == playery && ((Positions[4][1][i][currentLevel])) == playerx){
                                update();
                                return;                                
                            } else {
                                cell.classList.add("box");
                                cell.innerHTML = "box";
                                cell.style.backgroundColor = "brown"
                                tilesTraveled++;
                            }
                        }
                        if(cell == undefined){
                            tds = document.querySelectorAll(".wall");//setting edges to grey again
                            for (let j = 0; j < tds.length; j++) {
                                tds[j].style.backgroundColor = "rgb(110, 110, 110)";
                                tds[j].classList.add("nopass");
                                tds[j].innerHTML = "";
                            }
                            return;
                        }
                        await wait(25);
                    }
                }
                tds = document.querySelectorAll(".wall");//setting edges to grey again
                for (let j = 0; j < tds.length; j++) {
                    tds[j].style.backgroundColor = "rgb(110, 110, 110)";
                    tds[j].classList.add("nopass");
                    tds[j].innerHTML = "";
                }
                document.getElementsByClassName("exit")[0].style.backgroundColor = "white";//setting exit color
            }

        } else {
            row = document.getElementsByClassName("y" + Positions[5][2][i][currentLevel])[0];
            cell = row.getElementsByClassName("x" + Positions[5][1][i][currentLevel])[0];
            cell.style.opacity = "100%";
        }
    }
}

/*
function checkGaurds(){
    for(let i = 0; i<numGaurds[currentLevel]; i++){
        let tileAway = 1;
        row = document.getElementsByClassName("y" + Positions[6][2][i][currentLevel])[0];
        cell = row.getElementsByClassName("x" + Positions[6][1][i][currentLevel])[0];
        while (tileAway<4 && !(cell.classlist.contains("box") || cell.classlist.contains("nopass"))){
            if (Positions[6][3][i][currentLevel] == 2) {  //right
                
            }
            tileAway++;
            row = document.getElementsByClassName("y" + Positions[6][2][i][currentLevel])[0];
            cell = row.getElementsByClassName("x" + Positions[6][1][i][currentLevel])[0];
        }
    }
}
*/

function moveRight(){

    if (!startTimer){
        logLevelTimes = true;
        startTimer = true;
    }
    
    allLevelMoves[currentLevel] += 1; 
    document.getElementById("levelMoves").innerHTML = allLevelMoves[currentLevel];
    totalMoves += 1; 
    document.getElementById("totalMoves").innerHTML = totalMoves;
    
    row = document.getElementsByClassName("y" + playery)[0];
    cell = row.getElementsByClassName("x" + (playerx+1))[0];

    if (cell.classList.contains("exit")){
        console.log("next Level!");
        currentLevel++;
        if(currentLevel > maxLevel){
            maxLevel = currentLevel;
        }
        levelMoves = 0;
        update();
        return;
    }

    row = document.getElementsByClassName("y" + playery)[0];//getting the cell that is 2 to the right of the player
    cell = row.getElementsByClassName("x" + (playerx+2))[0];
    row1 = document.getElementsByClassName("y" + playery)[0];//getting the one taht is 1 to the right
    cell1 = row1.getElementsByClassName("x" + (playerx+1))[0];
    console.log(cell);
    console.log(cell1);
    if (!(cell1.classList.contains("nopass")) && !(cell.classList.contains("box") && cell1.classList.contains("box")) && !((cell.classList.contains("nopass") && cell1.classList.contains("box")))) {//if the player wont be moving out of bounds, and there are not 2 boxes directly to their right (the player only has strength to push one)
            console.log("move started");
            if (cell1.classList.contains("box")){//if the one directly to the right is a box
                console.log(cell1);
                cell1.classList.remove("box");//remove its class so it wont interfere in the future
                cell1.innerHTML = "";
                row = document.getElementsByClassName("y" + playery)[0];//grabbing the one 2 to the right where the box will be pushed to
                cell = row.getElementsByClassName("x" + (playerx+2))[0];
                cell.classList.add("box"); //setting the new cells color and class
                cell.innerHTML = "box";
                cell.style.backgroundColor = "brown";
                cell.style.color = "white";
            }

            row = document.getElementsByClassName("y" + playery)[0];
            cell = row.getElementsByClassName("x" + playerx)[0];
            cell.style.backgroundColor = "transparent";//setting the current locations background color to 0
            if (cell.classList.contains("pressurePlate")){
                cell.style.backgroundColor = "tan";
            }
            if (cell.classList.contains("fuse")){
                cell.style.backgroundColor = "bisque";
            }
            if (cell.classList.contains("player")){
                cell.classList.remove("player");
            }
            playerx++;//moving one to the right
            
            checkpressurePlates();
            checkFuses();
            
            row = document.getElementsByClassName("y" + playery)[0];
            cell = row.getElementsByClassName("x" + playerx)[0];
            cell.style.backgroundColor = "red";//moving player to new location
            cell.classList.add("player");

    }
}
function moveLeft(){

    if (!startTimer){
        logLevelTimes = true;
        startTimer = true;
    }


    allLevelMoves[currentLevel] += 1; 
    document.getElementById("levelMoves").innerHTML = allLevelMoves[currentLevel];
    totalMoves += 1; 
    document.getElementById("totalMoves").innerHTML = totalMoves;

    row = document.getElementsByClassName("y" + playery)[0];
    console.log(playerx-2);
    console.log(row.getElementsByClassName("x1")[0])
    cell = row.getElementsByClassName("x" + (playerx-2))[0];
    row1 = document.getElementsByClassName("y" + playery)[0];
    cell1 = row1.getElementsByClassName("x" + (playerx-1))[0];
    console.log(cell);
    console.log(cell1);
    if (!(cell1.classList.contains("nopass")) && !(cell.classList.contains("box") && cell1.classList.contains("box")) && !((cell.classList.contains("nopass") && cell1.classList.contains("box")))) {
            console.log("move started");
            if (cell1.classList.contains("box")){
                console.log(cell1);
                cell1.classList.remove("box");
                cell1.innerHTML = "";
                row = document.getElementsByClassName("y" + playery)[0];
                cell = row.getElementsByClassName("x" + (playerx-2))[0];
                cell.style.backgroundColor = "brown";
                cell.classList.add("box");
                cell.innerHTML = "box";
                cell.style.color = "white";
            }

            row = document.getElementsByClassName("y" + playery)[0];
            cell = row.getElementsByClassName("x" + playerx)[0];
            cell.style.backgroundColor = "transparent";
            if (cell.classList.contains("pressurePlate")){
                cell.style.backgroundColor = "tan";
            }
            if (cell.classList.contains("fuse")){
                cell.style.backgroundColor = "bisque";
            }
            if (cell.classList.contains("player")){
                cell.classList.remove("player");
            }
            playerx--;

            checkpressurePlates();
            checkFuses();

            row = document.getElementsByClassName("y" + playery)[0];
            cell = row.getElementsByClassName("x" + playerx)[0];
            cell.style.backgroundColor = "red";
            cell.classList.add("player");
    }
}
function moveUp(){

    if (!startTimer){
        logLevelTimes = true;
        startTimer = true;
    }


    allLevelMoves[currentLevel] += 1; 
    document.getElementById("levelMoves").innerHTML = allLevelMoves[currentLevel];
    totalMoves += 1; 
    document.getElementById("totalMoves").innerHTML = totalMoves;

    console.log("move up started");
    row = document.getElementsByClassName("y" + (playery-2))[0];
    cell = row.getElementsByClassName("x" + (playerx))[0];
    console.log("cell and row set");
    row1 = document.getElementsByClassName("y" + (playery-1))[0];
    cell1 = row1.getElementsByClassName("x" + (playerx))[0];
    console.log(cell);
    console.log(cell1);
    if (!(cell1.classList.contains("nopass")) && !(cell.classList.contains("box") && cell1.classList.contains("box")) && !((cell.classList.contains("nopass") && cell1.classList.contains("box")))) {
            console.log("move started");
            if (cell1.classList.contains("box")){
                console.log(cell1);
                cell1.classList.remove("box");
                cell1.innerHTML = "";
                row = document.getElementsByClassName("y" + (playery-2))[0];
                cell = row.getElementsByClassName("x" + playerx)[0];
                cell.style.backgroundColor = "brown";
                cell.classList.add("box"); 
                cell.innerHTML = "box";
                cell.style.color = "white";
            }

            row = document.getElementsByClassName("y" + playery)[0];
            cell = row.getElementsByClassName("x" + playerx)[0];
            cell.style.backgroundColor = "transparent";
            if (cell.classList.contains("pressurePlate")){
                cell.style.backgroundColor = "tan";
            }
            if (cell.classList.contains("fuse")){
                cell.style.backgroundColor = "bisque";
            }
            if (cell.classList.contains("player")){
                cell.classList.remove("player");
            }

            playery--;

            checkpressurePlates();
            checkFuses();

            row = document.getElementsByClassName("y" + playery)[0];
            cell = row.getElementsByClassName("x" + playerx)[0];
            cell.style.backgroundColor = "red";
            cell.classList.add("player");
    }
}
function moveDown(){

    if (!startTimer){
        logLevelTimes = true;
        startTimer = true;
    }


    allLevelMoves[currentLevel] += 1; 
    document.getElementById("levelMoves").innerHTML = allLevelMoves[currentLevel];
    totalMoves += 1; 
    document.getElementById("totalMoves").innerHTML = totalMoves;

    console.log("move up started");
    row = document.getElementsByClassName("y" + (playery+2))[0];
    cell = row.getElementsByClassName("x" + (playerx))[0];
    console.log("cell and row set");
    row1 = document.getElementsByClassName("y" + (playery+1))[0];
    cell1 = row1.getElementsByClassName("x" + (playerx))[0];
    console.log(cell);
    console.log(cell1);
    if (!(cell1.classList.contains("nopass")) && !(cell.classList.contains("box") && cell1.classList.contains("box")) && !((cell.classList.contains("nopass") && cell1.classList.contains("box")))) {
            console.log("move started");
            if (cell1.classList.contains("box")){
                console.log(cell1);
                cell1.classList.remove("box");
                cell1.innerHTML = "";
                row = document.getElementsByClassName("y" + (playery+2))[0];
                cell = row.getElementsByClassName("x" + playerx)[0];
                cell.style.backgroundColor = "brown";
                cell.classList.add("box"); 
                cell.innerHTML = "box";
                cell.style.color = "white";
            }

            row = document.getElementsByClassName("y" + playery)[0];
            cell = row.getElementsByClassName("x" + playerx)[0];
            cell.style.backgroundColor = "transparent";
            if (cell.classList.contains("pressurePlate")){
                cell.style.backgroundColor = "tan";
            }
            if (cell.classList.contains("fuse")){
                cell.style.backgroundColor = "bisque";
            }
            if (cell.classList.contains("player")){
                cell.classList.remove("player");
            }

            playery++;

            checkpressurePlates();
            checkFuses();

            row = document.getElementsByClassName("y" + playery)[0];
            cell = row.getElementsByClassName("x" + playerx)[0];
            cell.style.backgroundColor = "red";
            cell.classList.add("player");
    }
}

document.getElementById("resetLevel").addEventListener("click", function(){
    totalResets += 1;
    document.getElementById("totalResets").innerHTML = totalResets;
    update();
})
document.addEventListener("keydown", (event) => {
    if (event.key === "r") {
        totalResets += 1;
        document.getElementById("totalResets").innerHTML = totalResets;
        update();
    }
});

document.getElementById("startGame").addEventListener("click", start)

/*document.getElementById("dropdown").addEventListener("change", function(){
    console.log("entered event listener");
    currentLevel = document.getElementById("dropdown").value - 1;
    update();
})*/

document.getElementById("moveRight").addEventListener("click", moveRight);
document.addEventListener("keydown", (event) => {
    console.log("Key pressed:", event.key);
    if (event.key === "ArrowRight" || event.key === "d") {
        moveRight();
    }
});

document.getElementById("moveLeft").addEventListener("click", moveLeft);
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "a") {
        moveLeft();
    }
});

document.getElementById("moveUp").addEventListener("click", moveUp);
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "w") {
        moveUp();
    }
});
document.getElementById("moveDown").addEventListener("click", moveDown);
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "s") {
        moveDown();
    }
});
document.getElementById("gotoLevel0").addEventListener("click",function(){
    document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
    currentLevel = 0;
    update();
})
document.getElementById("gotoLevel1").addEventListener("click",function(){
    if(maxLevel>0){
        document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
        currentLevel = 1;
        update();
    }
})
document.getElementById("gotoLevel2").addEventListener("click",function(){
    if(maxLevel>1){
        document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
        currentLevel = 2;
        update();
    }
})
document.getElementById("gotoLevel3").addEventListener("click",function(){
    if(maxLevel>2){
        document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
        currentLevel = 3;
        update();
    }
})
document.getElementById("gotoLevel4").addEventListener("click",function(){
    if(maxLevel>3){
        document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
        currentLevel = 4;
        update();
    }
})
document.getElementById("gotoLevel5").addEventListener("click",function(){
    if(maxLevel>4){
        document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
        currentLevel = 5;
        update();
    }
})
document.getElementById("gotoLevel6").addEventListener("click",function(){
    if(maxLevel>5){
        document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
        currentLevel = 6;
        update();
    }
})
document.getElementById("gotoLevel7").addEventListener("click",function(){
    if(maxLevel>6){
        document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
        currentLevel = 7;
        update();
    }
})
document.getElementById("gotoLevel8").addEventListener("click",function(){
    if(maxLevel>7){
        document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
        currentLevel = 8;
        update();
    }
})
document.getElementById("gotoLevel9").addEventListener("click",function(){
    if(maxLevel>8){
        document.getElementById("LevelSelect").style.setProperty("display", "none", "important");
        currentLevel = 9;
        update();
    }
})
