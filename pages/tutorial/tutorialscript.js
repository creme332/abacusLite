const abacus = document.querySelector(".abacus");
const numberOfColumns = 5;
const beadsPerColumn = 10;
const beadSize = 40; //px
const columnHeight = beadSize * (beadsPerColumn + 1); //px
const columnWidth = beadSize + 10; //px
const topBeadsColors = ["green", "red", "#F9629F", "blue", "orange"];
const DEFAULT_CELL_COLOR = "black";
let gapPosition = []; //gap position in each column. 

// create a container to store each column in abacus
const columnContainer = document.createElement("div");
columnContainer.className = "column-container";

//create container to store each counter
const counterContainer = document.createElement("div");
counterContainer.className = "counter-container";

const num1 = document.querySelector(".num1");
const num2 = document.querySelector(".num2");

function buildNumGrid() {
    for (let i = 0; i < numberOfColumns; i++) {
        //create cell for num1
        let cell1 = document.createElement("div");
        cell1.className = "counter";
        cell1.textContent = "0";
        cell1.contentEditable = "true";
        cell1.style.backgroundColor = DEFAULT_CELL_COLOR;

        //create cell for num2
        let cell2 = document.createElement("div");
        cell2.className = "counter";
        cell2.textContent = "0";
        cell2.contentEditable = "true";
        cell2.style.backgroundColor = DEFAULT_CELL_COLOR;

        num1.appendChild(cell1);
        num2.appendChild(cell2);
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
        counterContainer.appendChild(counter);

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
            bead.style.backgroundColor = topBeadsColors[i % topBeadsColors.length];
            column.appendChild(bead);
        }
        //add column to columnContainer
        columnContainer.appendChild(column);
    }
    abacus.appendChild(columnContainer);
    abacus.appendChild(bottomBar);

    abacus.appendChild(counterContainer);
}
buildAbacus();
buildNumGrid();

const beads = document.querySelectorAll(".bead");

function showBeadPos() {
    beads.forEach(b => {
        b.textContent = getBeadIndex(b);
    })
}

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

//displace beads onclick
beads.forEach(bead => {
    bead.addEventListener("click", e => {
        let clickedBead = e.target;
        let clickedColumn = clickedBead.parentNode; //column containing clicked bead
        let clickedBeadIndex = getBeadIndex(clickedBead); //position of clicked bead in clickedColumn. top-most position is index 0.
        let currentColumnIndex = getColumnIndex(clickedColumn); //left-most column has index 0
        let ColumnGapIndex = gapPosition[currentColumnIndex]; // index of gap in clickedColumn 
        let currentColumnBeads = clickedColumn.querySelectorAll(".bead"); //all beads in current column

        //loop through each bead in current column and move it if needed
        currentColumnBeads.forEach(cbead => {
            let cbeadPos = getBeadIndex(cbead);
            currentY = parseInt(cbead.style.top);

            if (clickedBeadIndex > ColumnGapIndex) { //must displace beads upwards

                if (cbeadPos > ColumnGapIndex && cbeadPos <= clickedBeadIndex) { //current bead is below gap and above clicked bead
                    currentY -= beadSize; // move beadSize units upwards
                    cbead.style.top = currentY.toString() + "px";
                }

            } else { //must displace beads downwards
                if (cbeadPos < ColumnGapIndex && cbeadPos >= clickedBeadIndex) { //current bead is above gap and below clicked bead
                    currentY += beadSize; // move beadSize units downwards
                    cbead.style.top = currentY.toString() + "px";
                }
            }
        });
        //update gap position
        gapPosition[currentColumnIndex] = clickedBeadIndex;
        // showBeadPos();

        //update counter 
        let currentCounter = counterContainer.querySelector(`div:nth-child(${currentColumnIndex + 1})`);
        currentCounter.textContent = clickedBeadIndex;

        //show animation if counter shows 10
        // if (clickedBeadIndex == 10) {
        //     currentCounter.classList.add("error-animation");
        // } else {
        //     currentCounter.classList.remove("error-animation");
        // }
    });
});

//implement abacus auto-fill
const columnsArray = columnContainer.querySelectorAll(".column");
const submitbtn = document.querySelector(".submitbtn");
const num1Cells = num1.querySelectorAll(".counter");

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

    //update counter for current column
    let currentCounter = counterContainer.querySelector(`div:nth-child(${currentColumnIndex + 1})`);
    currentCounter.textContent = newGapPosition;

    return AbacusChanged;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function resetAbacus() {
    //place gap at top in each column
    //returns true if there was a change in abacus
    let AbacusChanged = false;
    columnsArray.forEach(column => {
        let k = shiftGap(column, 0);
        if (k == true) AbacusChanged = true;
    });
    return AbacusChanged;
}
function doSomething(event) {
    if (event.code == "Enter") {
        //reset color of num1 cells
        num1Cells.forEach(cell => {
            cell.style.backgroundColor = DEFAULT_CELL_COLOR;
        });
        //reset abacus
        let AbacusChanged = resetAbacus();
        if (AbacusChanged) {
            //wait for bead transitions to be over 
            abacus.addEventListener("transitionend", e => {
                AutoFillAbacus();
                console.log("Abacus transition Over");
            }, { once: true });
        } else { //abacus is already in default state
            AutoFillAbacus();
        }
    }
}
async function AutoFillAbacus() {
    //autofill abacus with values in num1 grid.
    
    //move beads
    for (let columnIndex = num1Cells.length - 1; columnIndex > -1; columnIndex--) {
        num1Cells[columnIndex].style.backgroundColor = topBeadsColors[columnIndex];
        let k = parseInt(num1Cells[columnIndex].textContent); //add k more beads in i-th column 
        // if (k == 0) continue;
        newGapPosition = gapPosition[columnIndex] + k;
        shiftGap(columnsArray[columnIndex], newGapPosition);
        await sleep(1000);
    }
}
document.addEventListener("keydown", doSomething);
