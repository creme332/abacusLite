//abacus variables
const abacus = document.querySelector(".abacus");
const numberOfColumns = 5;
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

//get user-input container
const cellContainer = document.querySelector(".user-input");
const num1 = document.querySelector(".num1");
const num2 = document.querySelector(".num2");

//get paragraph where instructions will be entered.
const instructionPara = document.querySelector("#instruction");
const DEFAULT_INSTRUCTION = "Fill num1 and num2, where num1 ≥ num2, then press Enter key.";
//get paragraph where integer overflow/underflow warning will be entered.
const warningPara = document.querySelector("#warning");
let overflowedColumnsCount = 0; //number of columns in abacus currently overflowing
let columnUnderflowCount = 0; //number of columns in abacus currently underflowing
const OVERFLOW_MESSAGE = "⚠ Add 1 bead to the current column's left neighbour, reset current counter to 0, then keep counting.";
const UNDERFLOW_MESSAGE = "⚠ Subtract 1 bead from current column's nearest non-zero left neighbour, reset current counter to 10, then keep counting.";
const TRANSITION_DURATION = 0; //default 1000

//user-input// numGrid variables
let numGridPtr = numberOfColumns; //points to current column where addition must take place
const DEFAULT_CELL_COLOR = "#fafafa";
let currentNum2Digit;
let currentNum1Digit;

//auto-fill variables
let calculationOver = false; //is whole calulation + animation over?
let AdditionOverflow = false;
let performAddition = false;
let finalAnswer = "";

function ColumnOverflow(EnableErrorAnimation, currentColumnIndex) {
    //when a column counter is 10, this function is called with parameter true
    warningPara.textContent = OVERFLOW_MESSAGE;
    const currentColumn = AbacusCounterArray[currentColumnIndex];
    if (EnableErrorAnimation) {
        warningPara.style.display = "block";
        currentColumn.classList.add("error-animation");
        overflowedColumnsCount++;
    } else {
        if (currentColumn.classList.contains("error-animation")) overflowedColumnsCount--;
        currentColumn.classList.remove("error-animation");
    }

    //remove warning paragraph if there are no overflowing columns
    if (overflowedColumnsCount == 0) {
        warningPara.style.display = "none";
    }
}

function buildNumGrid() {
    for (let i = 0; i < numberOfColumns; i++) {
        //create a cell for num1
        let cell1 = document.createElement("textarea");
        cell1.className = "cell";
        cell1.maxLength = "1";
        cell1.value = 0;
        cell1.style.backgroundColor = DEFAULT_CELL_COLOR;
        cell1.addEventListener('input', verifyCellInput);

        //create a cell for num2
        let cell2 = document.createElement("textarea");
        cell2.className = "cell";
        cell2.maxLength = "1";
        cell2.value = 0;
        cell2.style.backgroundColor = DEFAULT_CELL_COLOR;
        cell2.addEventListener('input', verifyCellInput);

        num1.appendChild(cell1);
        num2.appendChild(cell2);
    }
}

function verifyCellInput(e) { //verify user input in num2
    let cell = e.target;
    let inputText = cell.value;

    if (!(inputText >= "0" && inputText <= "9")) { //invalid user input
        cell.classList.add("error-animation");
        instructionPara.textContent = "Invalid input 😭";
    }
    else {
        instructionPara.textContent = "Press Enter key when you're done.";
        cell.classList.remove("error-animation");
    }
}

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
buildNumGrid(); // num grid the grid which will accept user input

const columnsArray = columnContainer.querySelectorAll(".column");

//The following variables must be initialised AFTER abacus and numGrid have been built
const beads = document.querySelectorAll(".bead");
const AbacusCounterArray = abacusCounterContainer.querySelectorAll(".counter");
const num1Cells = num1.querySelectorAll(".cell");
const num2Cells = num2.querySelectorAll(".cell");


function disableNumGrid(disableCells) {
    //disableNumGrid==true : user cannot edit cells

    for (let i = 0; i < numberOfColumns; i++) {
        num1Cells[i].disabled = disableCells;
        num2Cells[i].disabled = disableCells;
    }
}
function columnUnderflow(EnableErrorAnimation, currentColumnIndex) {
    warningPara.textContent = UNDERFLOW_MESSAGE;
    const currentColumn = AbacusCounterArray[currentColumnIndex];
    if (EnableErrorAnimation) {
        warningPara.style.display = "block";
        currentColumn.classList.add("error-animation");
    } else {
        warningPara.style.display = "none";
        currentColumn.classList.remove("error-animation");
    }

}
function shiftGap(columnDiv, newGapPosition) {
    //shifts the gap in a specific column to a new position
    //returns true if at least 1 bead changed position

    let AbacusChanged = false;
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

    //for additiona, show overflow animation if column has 10 used beads
    if (performAddition) {
        if (newGapPosition == beadsPerColumn) {
            ColumnOverflow(true, currentColumnIndex);
        } else {
            ColumnOverflow(false, currentColumnIndex);
        }
    }

    //update abacus counter for current column
    let currentCounter = abacusCounterContainer.querySelector(`div:nth-child(${currentColumnIndex + 1})`);
    currentCounter.textContent = newGapPosition;

    return AbacusChanged;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetAll() {
    //sets abacus and everything else to their default state.
    //returns true if there was a change in position of beads

    calculationOver = false;

    //reset color of num1 cells
    num1Cells.forEach(cell => {
        cell.style.backgroundColor = DEFAULT_CELL_COLOR;
    });

    //reset color of num2 cells
    num2Cells.forEach(cell => {
        cell.style.backgroundColor = DEFAULT_CELL_COLOR;
    });

    //reset column pointer
    numGridPtr = num2Cells.length;

    //reset instruction-container
    instructionPara.textContent = "";

    let AbacusChanged = false;
    //place gap at top in each column
    columnsArray.forEach(column => {
        let k = shiftGap(column, 0);
        if (k == true) AbacusChanged = true;
    });

    return AbacusChanged;
}

function showgameOverInstruction() {
    if (performAddition) {
        if (AdditionOverflow) {
            instructionPara.textContent = `Integer overflow 👎`;
        } else {
            instructionPara.textContent = `Done ! 👍`;
        }
    } else { //for subtraction
        instructionPara.textContent = `Done ! 👍`;
    }

}


function num1Greaternum2() {
    //returns true if num1 is greater than num2
    for (let i = 0; i < numberOfColumns; i++) {
        let num1value = parseInt(num1Cells[i].value);
        let num2value = parseInt(num2Cells[i].value);
        if (num1value == num2value) continue;
        if (num1value < num2value) return false;
        return true;
    }
    return true;
}

function calculateFinalAnswer() {
    //can use a single loop to obtain n1 and n2
    let n1 = "";
    num1Cells.forEach(cell => {
        n1 += cell.value;
    })
    n1 = parseInt(n1);

    let n2 = "";
    num2Cells.forEach(cell => {
        n2 += cell.value;
    })
    n2 = parseInt(n2);

    if (performAddition) {
        finalAnswer = n1 + n2;
    } else {
        finalAnswer = n1 - n2;
    }
    finalAnswer = finalAnswer.toString();
    while (finalAnswer.length < numberOfColumns) {
        finalAnswer = "0" + finalAnswer;
    }
    console.log("Final answer is ", finalAnswer);

    //if overflow will occur
    if (finalAnswer.length != numberOfColumns) {
        finalAnswer = finalAnswer.slice(1); //remove first char to make finalAnswer of size numberOfColumns
        AdditionOverflow = true;
    }
    console.log("Final answer is ", finalAnswer);
}
function EnableComputerAssistance(event) {
    if (event.code == "Enter") {//enter key pressed

        console.log("num1>=num2:", num1Greaternum2());

        //check if all user input is valid
        let allCells = cellContainer.querySelectorAll(".cell");
        for (cell of allCells) {
            if (cell.classList.contains("error-animation")) return;
        }
        //for subtraction, check if num1>= num2
        if (!performAddition) {
            if (!num1Greaternum2()) {
                instructionPara.textContent = " Obey 👉 num1 ≥ num2";
                return;
            }
        }

        //reset abacus beads, colors, ...
        let AbacusChanged = resetAll();

        AdditionOverflow = false;
        calculateFinalAnswer();

        //prevent change of operation
        checkbox.removeEventListener("click",()=>{
            performAddition = checkbox.checked;
        });

        //ignore other keydown events
        document.removeEventListener("keydown", EnableComputerAssistance);

        //update instruction 
        instructionPara.textContent = "Auto-filling abacus for num1 ..."

        if (AbacusChanged) {
            //wait for bead transitions to be over 
            abacus.addEventListener("transitionend", e => {
                AnimateAutoFillAbacus();
            }, { once: true });
        } else { //abacus is already in default state
            AnimateAutoFillAbacus();
        }
    }
}

async function showNextInstruction() {
    if (numGridPtr == 0) { // all columns in num grid have been processed
        calculationOver = true;
        showgameOverInstruction();
        return;
    }
    numGridPtr--;
    num2Cells[numGridPtr].style.backgroundColor = columnColors[numGridPtr];

    currentNum2Digit = parseInt(num2Cells[numGridPtr].value);

    //skip instructions when num2cell is a 0.
    while (currentNum2Digit == 0) {
        await sleep(TRANSITION_DURATION);
        numGridPtr--;
        if (numGridPtr < 0) {
            calculationOver = true;
            showgameOverInstruction();
            return;
        }
        num2Cells[numGridPtr].style.backgroundColor = columnColors[numGridPtr];
        currentNum2Digit = parseInt(num2Cells[numGridPtr].value);

    }
    if (performAddition) {
        if (currentNum2Digit == 1) { //"bead" 
            instructionPara.textContent = `Move ${[currentNum2Digit]} bead upwards in ${columnColors[numGridPtr]} column.`;
        } else { //"beads" 
            instructionPara.textContent = `Move ${[currentNum2Digit]} beads upwards in ${columnColors[numGridPtr]} column.`;
        }
    }
    else { //subtraction
        if (currentNum2Digit == 1) { //"bead" 
            instructionPara.textContent = `Move ${[currentNum2Digit]} bead downwards in ${columnColors[numGridPtr]} column.`;
        } else { //"beads" 
            instructionPara.textContent = `Move ${[currentNum2Digit]} beads downwards in ${columnColors[numGridPtr]} column.`;
        }
    }

}
function UserFillAbacus(e) {
    //move beads as per user's click

    //Prevent user from displacing other beads onclick
    //This solved the bead-merging issue.
    beads.forEach(bead => {
        bead.removeEventListener("click", UserFillAbacus);
    });

    let clickedBead = e.target;
    let clickedColumn = clickedBead.parentNode; //column containing clicked bead
    let clickedBeadIndex = getBeadIndex(clickedBead); //position of clicked bead in clickedColumn. top-most position is index 0.
    let clickedColumnIndex = getColumnIndex(clickedColumn);

    //prevent user from using abacus when calculation is over
    if (calculationOver) return;

    shiftGap(clickedColumn, clickedBeadIndex);

    //when current clicked bead animation is over
    abacus.addEventListener("transitionend", () => {
        currentNum1Digit = parseInt(num1Cells[numGridPtr].value);
        currentNum2Digit = parseInt(num2Cells[numGridPtr].value);
        if (!performAddition) { //for subtraction
            if (currentNum1Digit < currentNum2Digit) {
                columnUnderflow(true, numGridPtr);
            }
        }
        let expectedCounterDigit = parseInt(finalAnswer[numGridPtr]);
        let currentCounterDigit = parseInt(AbacusCounterArray[numGridPtr].textContent);

        if (currentCounterDigit == expectedCounterDigit) {
            if (!performAddition) columnUnderflow(false, numGridPtr);
            showNextInstruction();
        }

        beads.forEach(bead => {
            bead.addEventListener("click", UserFillAbacus);
        });
    }, { once: true });
}

async function AnimateAutoFillAbacus() {
    //autofill abacus with values in num1 grid.

    //move beads in each column
    for (let columnIndex = num1Cells.length - 1; columnIndex > -1; columnIndex--) {
        num1Cells[columnIndex].style.backgroundColor = columnColors[columnIndex % columnColors.length];
        let k = parseInt(num1Cells[columnIndex].value); //add k more beads in i-th column 
        newGapPosition = gapPosition[columnIndex] + k;
        shiftGap(columnsArray[columnIndex], newGapPosition);
        await sleep(TRANSITION_DURATION); //sleep between columns transition
    }

    //autofill is over at this point

    //re-allow user to restart if needed.
    document.addEventListener("keydown", EnableComputerAssistance);

    //allow change of operation
    checkbox.addEventListener("click",()=>{
        performAddition = checkbox.checked;
    });

    // show first instruction
    showNextInstruction();

    currentNum1Digit = parseInt(num1Cells[numGridPtr].value);
    currentNum2Digit = parseInt(num2Cells[numGridPtr].value);

    if (!performAddition) { //for subtraction
        if (currentNum1Digit < currentNum2Digit) {
            columnUnderflow(true, numGridPtr);
        }
    }

    //re-allow user to click beads
    beads.forEach(bead => {
        bead.addEventListener("click", UserFillAbacus);
    });
}
function fillNumGrid(num1, num2) {
    //num1 and num2 are strings of size 5

    for (let i = numberOfColumns - 1; i >= 0; i--) {
        num1Cells[i].value = num1[i];
        num2Cells[i].value = num2[i];
    }
}
//if performing subtraction, num1>=2 num2
if (!performAddition) {
    instructionPara.textContent = DEFAULT_INSTRUCTION;
}
// fillNumGrid("00015","00006");
fillNumGrid("01002", "00009");

let checkbox = document.querySelector("#operation");
checkbox.addEventListener("click",()=>{
    performAddition = checkbox.checked;
    console.log(performAddition);
});
document.addEventListener("keydown", EnableComputerAssistance);
