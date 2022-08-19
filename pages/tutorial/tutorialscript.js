const abacus = document.querySelector(".abacus");
const numberOfColumns = 5;
const beadsPerColumn = 10; // DO NOT CHANGE
const beadSize = 40; //px
const columnHeight = beadSize * (beadsPerColumn + 1); //px
const columnWidth = beadSize + 10; //px
const columnColors = ["limegreen", "red", "hotpink", "dodgerblue", "orange"];
const DEFAULT_CELL_COLOR = "#fafafa";
let gapPosition = []; //gap position in each column. 

// create a container to store each column in abacus
const columnContainer = document.createElement("div");
columnContainer.className = "column-container";

//create container to store each counter
const abacusCounterContainer = document.createElement("div");
abacusCounterContainer.className = "counter-container";

//create a container to take user input
const cellContainer = document.querySelector(".user-input");
const num1 = document.querySelector(".num1");
const num2 = document.querySelector(".num2");

const instructionPara = document.querySelector("#instruction");
const warningPara = document.querySelector("#warning");
let overflowedColumnsCount = 0;

function ColumnOverflow(EnableErrorAnimation, currentColumnIndex) {
    //when a column counter is 10, this function is called with parameter true

    const currentColumn = AbacusCounterArray[currentColumnIndex];
    if (EnableErrorAnimation) {
        warningPara.style.display = "block";
        currentColumn.classList.add("error-animation");
        overflowedColumnsCount++;
    } else {
        if (currentColumn.classList.contains("error-animation")) overflowedColumnsCount--;
        currentColumn.classList.remove("error-animation");
    }

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
function verifyCellInput(e) {
    let cell = e.target;
    let inputText = cell.value;
    if (!(inputText >= "0" && inputText <= "9")) {
        cell.classList.add("error-animation");
        instructionPara.textContent = "Invalid input 😭";
        // cell.style.backgroundColor ="red";
    }
    // else cell.style.backgroundColor = DEFAULT_CELL_COLOR;
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

        //create column
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
        //add column to columnContainer
        columnContainer.appendChild(column);
    }
    abacus.appendChild(columnContainer);
    abacus.appendChild(bottomBar);

    abacus.appendChild(abacusCounterContainer);
}
buildAbacus();
buildNumGrid();

const beads = document.querySelectorAll(".bead");
const AbacusCounterArray = abacusCounterContainer.querySelectorAll(".counter");

// function showBeadPos() {
//     //for debugging
//     beads.forEach(b => {
//         b.textContent = getBeadIndex(b);
//     })
// }

function getBeadIndex(bead) {
    //let currentColumn = bead.parentNode;
    //let relativeY = bead.getBoundingClientRect().top - currentColumn.getBoundingClientRect().top;
    let relativeY = bead.offsetTop;
    let beadIndex = parseInt(relativeY / beadSize);
    return beadIndex;
}
function getColumnIndex(column) {
    let relativeX = column.getBoundingClientRect().left - abacus.getBoundingClientRect().left;
    let columnIndex = parseInt(relativeX / columnWidth);
    return columnIndex;
}

function shiftGap(columnDiv, newGapPosition) {
    //shifts the gap in a specific column to a new position
    //returns true if at least 1 bead changed position
    let AbacusChanged = false;
    let currentColumnIndex = getColumnIndex(columnDiv); //left-most column has index 0
    let ColumnGapIndex = gapPosition[currentColumnIndex]; // index of gap in clickedColumn 
    let currentColumnBeads = columnDiv.querySelectorAll(".bead"); //all beads in current column

    //loop through each bead in current column and move it if needed
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

    //show overflow animation if column has 10 active beads
    if (newGapPosition == beadsPerColumn) {
        ColumnOverflow(true, currentColumnIndex);
    } else {
        ColumnOverflow(false, currentColumnIndex);
    }

    //update abacus counter for current column
    let currentCounter = abacusCounterContainer.querySelector(`div:nth-child(${currentColumnIndex + 1})`);
    currentCounter.textContent = newGapPosition;

    return AbacusChanged;
}

//implement abacus auto-fill
const columnsArray = columnContainer.querySelectorAll(".column");
const submitbtn = document.querySelector(".submitbtn");
const num1Cells = num1.querySelectorAll(".cell");
const num2Cells = num2.querySelectorAll(".cell");
const TIME_BETWEEN_AUTOFILL = 200; //default 1000

let currentNum2Column = num2Cells.length; //points to current column where addition must take place
let currentNum2Digit;
let currentNum1Digit;
let carry = 0;
let gameOver = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetAll() {
    //sets abacus and everything else to their default state.
    //returns true if there was a change in position of beads

    gameOver = false;

    //reset color of num1 cells
    num1Cells.forEach(cell => {
        cell.style.backgroundColor = DEFAULT_CELL_COLOR;
    });
    //reset color of num2 cells
    num2Cells.forEach(cell => {
        cell.style.backgroundColor = DEFAULT_CELL_COLOR;
    });
    //reset column pointer for num2
    currentNum2Column = num2Cells.length;

    //reset instruction-container
    instructionPara.textContent = "";

    //reset carry 
    carry = 0;

    let AbacusChanged = false;
    //place gap at top in each column
    columnsArray.forEach(column => {
        let k = shiftGap(column, 0);
        if (k == true) AbacusChanged = true;
    });

    return AbacusChanged;
}

function showgameOverInstruction() {
    let firstAbacusCounter = AbacusCounterArray[0]; //left-most counter
    if (carry == 0 && firstAbacusCounter.textContent != "10")
        instructionPara.textContent = `Done ! 👍`;
    else
        instructionPara.textContent = `Integer overflow 👎`;
}
function EnableComputerAssistance(event) {
    if (event.code == "Enter") {

        //check if all user input is valid
        let allCells = cellContainer.querySelectorAll(".cell");
        for (cell of allCells) {
            if (cell.classList.contains("error-animation")) return;
        }

        //ignore other keydown events
        document.removeEventListener("keydown", EnableComputerAssistance);

        //reset abacus beads
        let AbacusChanged = resetAll();

        //update instruction 
        instructionPara.textContent ="Auto-filling abacus for num1 ..."
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

async function showNewInstruction() {
    if (currentNum2Column == 0) {
        gameOver = true;
        showgameOverInstruction();
        return;
    }
    currentNum2Column--;
    num2Cells[currentNum2Column].style.backgroundColor = columnColors[currentNum2Column];

    currentNum1Digit = parseInt(num1Cells[currentNum2Column].value);
    currentNum2Digit = parseInt(num2Cells[currentNum2Column].value);

    //skip instructions when num2cell is a 0.
    while (currentNum2Digit == 0) {
        await sleep(TIME_BETWEEN_AUTOFILL);
        currentNum2Column--;
        carry = 0;
        if (currentNum2Column < 0) {
            gameOver = true;
            showgameOverInstruction();
            return;
        }
        num2Cells[currentNum2Column].style.backgroundColor = columnColors[currentNum2Column];
        currentNum2Digit = parseInt(num2Cells[currentNum2Column].value);

    }
    if(currentNum2Digit==1){ 
        instructionPara.textContent = `Move ${[currentNum2Digit]} bead upwards in ${columnColors[currentNum2Column]} column.`;
    }else{
        instructionPara.textContent = `Move ${[currentNum2Digit]} beads upwards in ${columnColors[currentNum2Column]} column.`;
    }
}
function UserFillAbacus(e) {
    //Prevent user from displacing other beads onclick
    beads.forEach(bead => {
        bead.removeEventListener("click", UserFillAbacus);
    });

    let clickedBead = e.target;
    let clickedColumn = clickedBead.parentNode; //column containing clicked bead
    let clickedBeadIndex = getBeadIndex(clickedBead); //position of clicked bead in clickedColumn. top-most position is index 0.
    let clickedColumnIndex = getColumnIndex(clickedColumn);

    if (gameOver) return;

    shiftGap(clickedColumn, clickedBeadIndex);

    //when current clicked bead animation is over
    abacus.addEventListener("transitionend", () => {
        currentNum1Digit = parseInt(num1Cells[currentNum2Column].value);
        currentNum2Digit = parseInt(num2Cells[currentNum2Column].value);

        let expectedCounterDigit = (currentNum1Digit + currentNum2Digit + carry) % beadsPerColumn;
        let currentCounterDigit = parseInt(AbacusCounterArray[currentNum2Column].textContent);

        //check if user correctly made the correct move
        if (currentCounterDigit == expectedCounterDigit) {
            //calculate carry for next column
            carry = Math.floor((currentNum2Digit + currentNum1Digit + carry) / beadsPerColumn);

            showNewInstruction();
        }

        //enable event listeners
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
        await sleep(TIME_BETWEEN_AUTOFILL); //sleep between columns transition
    }

    //autofill is over at this point

    //re-allow user to call computerAssitance to reset if needed.
    document.addEventListener("keydown", EnableComputerAssistance);

    // show first instruction
    showNewInstruction();

    //re-allow user to click beads
    beads.forEach(bead => {
        bead.addEventListener("click", UserFillAbacus);
    });
}
document.addEventListener("keydown", EnableComputerAssistance);