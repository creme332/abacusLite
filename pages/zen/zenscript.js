const abacus = document.querySelector(".abacus");
const numberOfColumns = 10;
const beadsPerColumn = 10;
const beadSize = 40; //px
const columnHeight = beadSize * (beadsPerColumn + 1); //px
const columnWidth = beadSize + 10; //px
const columnColors = ["limegreen", "red", "hotpink", "dodgerblue", "orange"];
let gapPosition = []; //gap position in each column. 

console.assert(numberOfColumns > 0 && beadsPerColumn > 0, "Invalid abacus size");
console.assert(columnHeight % beadSize == 0, "Column height must be a multiple of bead size");
console.assert(columnHeight / beadSize == (beadsPerColumn + 1), "Extra space in each column should be equal to 1 bead size");

function buildAbacus() {
    const columnContainer = document.createElement("div");
    columnContainer.className = "column-container";
    const topBar = document.createElement("div");
    topBar.className ="abacus-bar";
    const bottomBar = document.createElement("div");
    bottomBar.className ="abacus-bar";
    abacus.appendChild(topBar);
    for (let i = 0; i < numberOfColumns; i++) {
        //initially, gap is found at top for each column
        gapPosition.push(0);

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
            bead.style.top="0px";
            bead.style.backgroundColor = columnColors[i % columnColors.length];
            column.appendChild(bead);
        }
        //add column to columnContainer
        columnContainer.appendChild(column);
    }
    abacus.appendChild(columnContainer);
    abacus.appendChild(bottomBar);
}
buildAbacus();
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
// showBeadPos();
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
    });
});