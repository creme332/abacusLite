# abacus-tool
[![Front‑End_Checklist followed](https://img.shields.io/badge/Front‑End_Checklist-followed-brightgreen.svg)](https://github.com/thedaviddias/Front-End-Checklist/)
![HTML shield](https://img.shields.io/badge/-HTML-blue)
![](https://img.shields.io/badge/-JavaScript-yellow)
![](https://img.shields.io/badge/-CSS-orange)

An interactive abacus to help you master the abacus.

![GIF of the abacus website](gifs/gif1.gif)

[▶ Live Preview]()

# 🚀Features

## Tutorial mode 🤖
- Auto-fill abacus.
- Integer overflow detection.
- Step-by-step explanation.

## Rush mode 🏃‍♀️💨
- Use the abacus to evaluate given expressions before timer runs out.
## Zen mode 🤪
- Use abacus as you wish without any interference.
# 📌 Attributions
Resource | Source
---|---
resource| owner

# 🕓 History

# 🔨 To-Do
- [ ] Make website responsive.
- [ ] Add sitemap.
- [ ] Allow only 1 digit in each cell. (Use textarea)
- [ ] create  a function updateCounter(column)
- [ ] prevent user from changing a correct abacus column
### ✔ Done
- [x] During autofill, prevent user from using abacus.
- [x] use color coding in instruction instead of column 0,1.,,,
- [x] Add project social media preview.
- [x] Convert shiftGap into async function

# 🐛 Bugs
Bug | How to reproduce | How to fix | Fixed
---|---|---|---|
Create more than 1 gap in a single column by merging beads ![](assets/beadglitch.gif)| While bead A is moving up, quickly click on bead B to cause bead B to move down. Both A and  B will merge. | Must prevent 2 beads in the same column from moving in opposite directions.  Might have to use `transitionend` event listeners.|✅