# Web OS

A browser-based operating system interface built with HTML, CSS, and JavaScript.

## Features

* Browser-based desktop interface
* Live digital clock
* Google search from the desktop
* Draggable application windows
* Notes application with local storage
* Calculator
* Countdown timer
* Todo list with local storage
* Two-player Ping Pong game
* About application
* Multiple applications can be opened independently
* Windows can be moved around the desktop
* Responsive layout for smaller screens

## Applications

### Notes

A simple text editor for writing notes. Notes can be saved using the browser's local storage, so they remain available after refreshing the page.

### Calculator

A basic calculator supporting:

* Addition
* Subtraction
* Multiplication
* Division
* Decimals
* Parentheses
* Clear
* Backspace

### Timer

A countdown timer where you can set minutes and seconds and start, stop, or reset the timer.

### Todo

A simple task list. Tasks are stored using local storage and can be removed when completed.

### Ping Pong

A basic two-player Pong game.

Player 1 uses:

```text
W / S
```

Player 2 uses:

```text
Arrow Up / Arrow Down
```

### Google Search

The search bar on the desktop opens the entered search query directly in Google in a new browser tab.

## Technologies Used

* HTML
* CSS
* JavaScript
* Local Storage
* HTML Canvas

## Project Structure

```text
web-os/
│
├── index.html
├── style.css
└── script.js
```

### index.html

Contains the structure of the desktop, search bar, application buttons, and window container.

### style.css

Controls the appearance of the desktop, application windows, buttons, inputs, calculator, timer, todo list, and Pong game.

### script.js

Handles the application logic, window management, dragging, Google search, clock, calculator, timer, todo list, notes, and Pong game.

## How to Run

No installation or server is required.

1. Download or clone the repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a web browser.

## Future Improvements

Some possible improvements for future versions include:

* Desktop icons
* Taskbar
* Window minimize and maximize buttons
* Better window resizing
* More applications
* Improved animations
* Custom wallpapers
* More advanced file management
* Better mobile support
* Boot screen and loading animation

## License

This project was created for learning and experimentation with HTML, CSS, and JavaScript.
