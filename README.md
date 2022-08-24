# abacus-tool
[![Front‑End_Checklist followed](https://img.shields.io/badge/Front‑End_Checklist-followed-brightgreen.svg)](https://github.com/thedaviddias/Front-End-Checklist/)
![HTML shield](https://img.shields.io/badge/-HTML-blue)
![](https://img.shields.io/badge/-JavaScript-yellow)
![](https://img.shields.io/badge/-CSS-orange)

An interactive abacus to help you master the abacus.

![homepage](assets/img/2022-08-22-16-12-22.png)

[▶ Live Preview](https://creme332.github.io/abacus-basics/)

# 🚀Features

## Tutorial mode 
Enter two numbers and the computer will walk you through how to use an abacus for basic arithmetic operations (addition and subtraction).

- Input validation.
- Auto-fill feature.
- Integer overflow detection.
- Step-by-step explanation.

![video of tutorial](assets/img/tutorial-video.mp4)
## Rush mode 🏃‍♀️💨
Use the abacus to evaluate given expressions before timer runs out.

![rush mode screenshot](assets/img/2022-08-24-17-20-23.png)

## Zen mode 🤪 
Use the classic abacus.

- No computer assistance.
- No animations.
- Background music. (optional)

![zen mode screenshot](assets/img/2022-08-22-16-14-37.png)
# 📌 Attributions
Resource | Source
---|---
All images in `assets/img` | pngtree
Background music in zen mode | black coffee by elijah who
Checkbox toggle switch | https://codepen.io/marcusconnor/pen/QJNvMa
3D image on homepage | SALY 3D-Illustration-Pack from Figma

# 🔨 To-Do
- [ ] Add sitemap.
- [ ] Add a diagram showing skeleton and class names.
- [ ] Identify and remove unused css.


### ✔ Done
- [x] Implement rush mode.
- [x] Group css properties
- [x] Add sound effects to zen mode.
- [x] Make website print-friendly.
- [x] Fix merging beads glitch in zen mode.
- [x] Add explanation when overflow occurs.
- [x] Label cells for num1 and num2.
- [x] Allow only 1 digit in each cell. (Use textarea)
- [x] Make website responsive.
- [x] During autofill, prevent user from using abacus.
- [x] use color coding in instruction instead of column 0,1...
- [x] Add project social media preview.
- [x] Convert shiftGap into async function

# 🐛 Bugs
Bug | How to reproduce | How to fix | Fixed
---|---|---|---|
Create more than 1 gap in a single column by merging beads ![](assets/img/beadglitch.gif)| While bead A is moving up, quickly click on bead B to cause bead B to move down. Both A and  B will merge. | Must prevent 2 beads in the same column from moving in opposite directions.  Might have to use `transitionend` event listeners.|✅
Empty space on right when browser is resized ![empty space on resizing glitch](assets/img/2022-08-22-14-30-56.png)|x|review padding, margin, svg image container size, ... | ❌