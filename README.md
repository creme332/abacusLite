# abacusLite
[![Front‑End_Checklist followed](https://img.shields.io/badge/Front‑End_Checklist-followed-brightgreen.svg)](https://github.com/thedaviddias/Front-End-Checklist/)
![HTML shield](https://img.shields.io/badge/-HTML-blue)
![JavaScript shield](https://img.shields.io/badge/-JavaScript-yellow)
![CSS shield](https://img.shields.io/badge/-CSS-orange)

abacusLite is an interactive abacus learning portal designed to help you master the abacus. On top of being free, abacusLite is supported on all devices.

![homepage screenshot](assets/img/2022-08-22-16-12-22.png)

[▶ Live Preview](https://creme332.github.io/abacusLite/)

# 🚀Features

## Tutorial mode ⛑
Enter two numbers and the computer will walk you through how to use an abacus for basic arithmetic operations. Currently explanations are available only for addition and subtraction.

- Input validation.
- Auto-fill feature.
- Integer overflow detection.
- Step-by-step explanation.

![video of abacus performing addition and subtraction](assets/img/tutorial-video.gif)

## Rush mode 🏃‍♀️💨
Use the abacus to evaluate math expressions as fast as possible.

![rush mode screenshot](assets/img/2022-08-24-17-20-23.png)

## Zen mode 🤪 
Use the classic abacus.

- No computer assistance.
- No animations.
- Sound effects.
- Can be used for addition, subtraction, multiplication, and division.

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
- [ ] Add multiplication and division to tutorial.
- [ ] Improve explanation when oveflow/underflow occurs. 
- [ ] Add option to vary difficulty in Rush mode.

### ✔ Done
- [x] Identify and remove unused css.
- [x] Implement rush mode.
- [x] Make website print-friendly.
- [x] Make website responsive.
- [x] Add project social media preview.

# 🐛 Bugs
Bug | How to reproduce | How to fix | Fixed
---|---|---|---|
Create more than 1 gap in a single column by merging beads ![](assets/img/beadglitch.gif)| While bead A is moving up, quickly click on bead B to cause bead B to move down. Both A and  B will merge. | Must prevent 2 beads in the same column from moving in opposite directions.  Might have to use `transitionend` event listeners.|✅
Empty space on right when browser is resized ![empty space on resizing glitch](assets/img/2022-08-22-14-30-56.png)|x|review padding, margin, svg image container size, ... | ❌