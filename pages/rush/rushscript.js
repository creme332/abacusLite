//abacus variables
const abacus = document.querySelector(".abacus");
const numberOfColumns = 10;
const beadsPerColumn = 10; // DO NOT CHANGE
const beadSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--BEAD-SIZE')); //px
const columnHeight = beadSize * (beadsPerColumn + 1); //px
const columnWidth = beadSize + 10; //px
const columnColors = ["limegreen", "red", "hotpink", "dodgerblue", "orange"];
let gapPosition = [];
//gapPosition[2] == 3 means the gap in the 2nd
// column(zero-based index) is found on the 3rd row (zero-based index).
// Top row has an index of 0.

// create a container to store each column in abacus
const columnContainer = document.createElement("div");
columnContainer.className = "column-container";

//create container to store each counter
const abacusCounterContainer = document.createElement("div");
abacusCounterContainer.className = "counter-container";

function buildAbacus() {
    const topBar = document.createElement("div");
    topBar.className = "abacus-bar";
    const bottomBar = document.createElement("div");
    bottomBar.className = "abacus-bar";
    abacus.appendChild(topBar);

    for (let i = 0; i < numberOfColumns; i++) {
        //initially, gap is found at top for each column
        gapPosition.push(0);

        //create a counter for current column
        let counter = document.createElement("div");
        counter.className = "counter";
        counter.style.width = columnWidth + "px";
        counter.style.height = beadSize + "px";
        counter.textContent = gapPosition[i];

        //add counter to counter-container
        abacusCounterContainer.appendChild(counter);

        //create a column for abacus
        let column = document.createElement("div");
        column.className = "column";
        column.style.height = columnHeight + "px";
        column.style.width = columnWidth + "px";

        //create stick
        let stick = document.createElement("div");
        stick.className = "stick";
        stick.style.height = columnHeight + "px";

        // put stick in column
        column.appendChild(stick);

        //put beads in column
        for (let j = 0; j < beadsPerColumn; j++) {
            let bead = document.createElement("div");
            bead.className = "bead";
            bead.style.height = beadSize + "px";
            bead.style.width = beadSize + "px";
            bead.style.top = "0px";
            bead.style.backgroundColor = columnColors[i % columnColors.length];
            column.appendChild(bead);
        }
        columnContainer.appendChild(column);
    }
    abacus.appendChild(columnContainer);
    abacus.appendChild(bottomBar);
    abacus.appendChild(abacusCounterContainer);
}

function getBeadIndex(bead) {
    //returns the row position of bead
    //top row has index 0

    //let currentColumn = bead.parentNode;
    //let relativeY = bead.getBoundingClientRect().top - currentColumn.getBoundingClientRect().top;
    let relativeY = bead.offsetTop;
    let beadIndex = parseInt(relativeY / beadSize);
    return beadIndex;
}
function getColumnIndex(column) {
    //returns the column position of column
    //left-most column has index 0
    let relativeX = column.getBoundingClientRect().left - abacus.getBoundingClientRect().left;
    let columnIndex = parseInt(relativeX / columnWidth);
    return columnIndex;
}

buildAbacus();

const columnsArray = columnContainer.querySelectorAll(".column");
const beads = document.querySelectorAll(".bead");
const AbacusCounterArray = abacusCounterContainer.querySelectorAll(".counter");

function shiftGap(columnDiv, newGapPosition) {
    //shifts the gap in a specific column to a new position

    let currentColumnIndex = getColumnIndex(columnDiv); //left-most column has index 0
    let ColumnGapIndex = gapPosition[currentColumnIndex]; // index of gap in clickedColumn 
    let currentColumnBeads = columnDiv.querySelectorAll(".bead"); //all beads in current column

    //loop through each bead in current column and move bead if needed
    currentColumnBeads.forEach(cbead => {
        let cbeadPos = getBeadIndex(cbead);
        currentY = parseInt(cbead.style.top);

        if (newGapPosition > ColumnGapIndex) { //must displace beads upwards

            if (cbeadPos > ColumnGapIndex && cbeadPos <= newGapPosition) { //current bead is below gap and above clicked bead
                currentY -= beadSize; // move beadSize units upwards
                cbead.style.top = currentY.toString() + "px";
                AbacusChanged = true;
            }

        } else { //must displace beads downwards
            if (cbeadPos < ColumnGapIndex && cbeadPos >= newGapPosition) { //current bead is above gap and below clicked bead
                currentY += beadSize; // move beadSize units downwards
                cbead.style.top = currentY.toString() + "px";
                AbacusChanged = true;
            }
        }
    });

    //update gap position
    gapPosition[currentColumnIndex] = newGapPosition;

    //update abacus counter for current column
    let currentCounter = abacusCounterContainer.querySelector(`div:nth-child(${currentColumnIndex + 1})`);
    currentCounter.textContent = newGapPosition;
}

function displaceBead(e) {
    //disable event listener for all beads 
    beads.forEach(bead => {
        bead.removeEventListener("click", displaceBead);
    });

    let clickedBead = e.target;
    let clickedColumn = clickedBead.parentNode; //column containing clicked bead
    let clickedBeadIndex = getBeadIndex(clickedBead); //position of clicked bead in clickedColumn. top-most position is index 0.
    shiftGap(clickedColumn, clickedBeadIndex);

    //when bead displacement animation is over, re-enable event listeners for beads.
    beads.forEach(bead => {
        bead.addEventListener("click", displaceBead);
    });
}

//displace beads onclick
beads.forEach(bead => {
    bead.addEventListener("click", displaceBead);
});

const START_TIME = 120; //in seconds
let TIME_LEFT = START_TIME;
const timer = document.querySelector("#timer");
const submitButton = document.querySelector("#submitbtn");
const questionBox = document.querySelector("#question");
const scoreVal = document.querySelector("#score-value");

timer.textContent = TIME_LEFT;
const ONE_SECOND = 1000; //1000 ms  = 1s
let expectedAnswer = 0;
let playerScore = 0;
let gameOver = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function startTimer() {
    //remove event listener to prevent startTimer from being called again
    timer.removeEventListener("click", startTimer);
    while (TIME_LEFT > 0) {
        await sleep(ONE_SECOND); //wait 1 second;
        TIME_LEFT--;
        timer.textContent = TIME_LEFT;

    }
    //re-add eventlistener
    gameOver = true;
    questionBox.textContent = "Game over ⛔ Restart game ☝";
    TIME_LEFT = START_TIME;
    timer.textContent = TIME_LEFT;
    timer.addEventListener("click", startGame);
}

function updatePlayerScore(correctAnswer) {
    if (correctAnswer) {
        playerScore += 100;
    } else {
        playerScore -= 200;
    }
    scoreVal.textContent = playerScore;
}
function getUserAnswer() {
    const allCounters = abacusCounterContainer.querySelectorAll(".counter");
    let userAnswer = "";
    allCounters.forEach(c => {
        userAnswer += c.textContent;
    });
    // console.log(userAnswer);
    return parseInt(userAnswer);
}
function startGame() {
    timer.removeEventListener("click", startGame);
    gameOver = false;
    playerScore = 0;
    scoreVal.textContent = playerScore;
    generateQuestion();
    startTimer();

    submitButton.addEventListener("click", () => {
        if (gameOver) {
            return;
        }
        if (TIME_LEFT > 0) {
            if (getUserAnswer() == expectedAnswer) {
                submitButton.classList.add("correct-answer");
                updatePlayerScore(true);
                generateQuestion();
            } else {
                submitButton.classList.add("wrong-answer");
                updatePlayerScore(false);
            }
            submitButton.addEventListener("transitionend", () => {
                submitButton.classList.remove("correct-answer");
                submitButton.classList.remove("wrong-answer");

            }, { once: true });
        }
    });
}
function generateQuestion() {
    const maxAbacusValue = 9999999999; //max value that can be displayed on abacus
    const lowerBound = 100;
    // const upperBound = maxAbacusValue - lowerBound;
    const upperBound = 99999;

    let n1 = parseInt(Math.random() * upperBound) + lowerBound;
    let n2 = parseInt(Math.random() * upperBound) + lowerBound;
    const operators = ["+", "-"];
    let randomIndex = parseInt(Math.random() * operators.length);

    questionBox.textContent = Math.max(n1, n2).toString() + operators[randomIndex] + Math.min(n1, n2).toString();
    expectedAnswer = eval(questionBox.textContent);
    // console.log(expectedAnswer);
}
timer.addEventListener("click", startGame);
