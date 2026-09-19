const windows = {};
let z = 20;
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

setInterval(updateClock, 1000);
updateClock();

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("searchInput").value.trim();

  if (query) {
    window.open(
      "https://www.google.com/search?q=" + encodeURIComponent(query),

      "_blank",
    );
  }
});

function makeWindow(id, title, icon, html, width = 360, left = 40, top = 100) {
  /* If already open,
     bring it to front */

  if (windows[id]) {
    windows[id].style.zIndex = ++z;
    return windows[id];
  }

  const win = document.createElement("section");

  win.className = "window";
  win.id = "win-" + id;

  win.style.width = width + "px";
  win.style.left = left + "px";
  win.style.top = top + "px";
  win.style.zIndex = ++z;

  win.innerHTML = `
    <div class="titlebar">
      <div class="title">
        ${icon} ${title}
      </div>
      
      <button
        class="close"
        aria-label="Close"
      >
        ×
      </button>

    </div>

    <div class="content">
      ${html}
    </div>
  `;

  document.getElementById("windows").appendChild(win);

  windows[id] = win;

  win.querySelector(".close").onclick = () => {
    if (id === "pong") {
      stopPong();
    }

    if (id === "timer") {
      stopTimer();
    }

    win.remove();
    delete windows[id];
  };

  win.addEventListener("mousedown", () => {
    win.style.zIndex = ++z;
  });

  dragWindow(win, win.querySelector(".titlebar"));

  return win;
}

function dragWindow(win, bar) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;
  bar.addEventListener("mousedown", function (e) {
    dragging = true;
    const rect = win.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    win.style.zIndex = ++z;
  });

  document.addEventListener("mousemove", function (e) {
    if (!dragging) return;

    const desktop = document.getElementById("desktop").getBoundingClientRect();

    let x = e.clientX - desktop.left - offsetX;

    let y = e.clientY - desktop.top - offsetY;

    x = Math.max(5, Math.min(x, desktop.width - win.offsetWidth - 5));

    y = Math.max(5, Math.min(y, desktop.height - win.offsetHeight - 5));

    win.style.left = x + "px";
    win.style.top = y + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}

function openApp(id) {
  if (id === "notes") {
    const saved = localStorage.getItem("myos_notes") || "";

    const w = makeWindow(
      "notes",
      "Notes",
      "📄",
      `
        <textarea
        id="notesText"
        placeholder="write something..."
        >${escapeHtml(saved)}</textarea>
        <div class="row">
        <button id="saveNotes">
          💾 Save
        </button>
        
        <span
        class=" muted"
        id="noteStatus"
        >
         No notes saved yet.
        </span>
        </div>
        `,

      340,
      80,
      285,
    );

    w.querySelector("#saveNotes").onclick = () => {
      localStorage.setItem(
        "myos_notes",

        w.querySelector("#notesText").value,
      );

      w.querySelector("#noteStatus").textContent = "saved!";
    };
  }

  if (id === "calc") {
    const w = makeWindow(
      "calc",
      "calculator",
      "🧮",

      `
        
        <input
        class="calc-display"
        id="calcDisplay"
        readonly
        value="0"
      >
      <div class="calc-grid">
      
        ${[
          "7",
          "8",
          "9",
          "+",
          "4",
          "5",
          "6",
          "-",
          "1",
          "2",
          "3",
          "*",
          "0",
          ".",
          "(",
          ")",
          "C",
          "⌫",
          "=",
          "/",
        ]

          .map(
            (key) => `
            <button data-key="${key}">
               ${key}
               </button>
               `,
          )
          .join("")}
        </div>
        `,

      300,
      620,
      600,
    );

    const display = w.querySelector("#calcDisplay");

    w.querySelectorAll("[data-key]").forEach((button) => {
      button.onclick = () => {
        const key = button.dataset.key;

        if (key === "C") {
          display.value = "0";
        } else if (key === "⌫") {
          display.value =
            display.value.length > 1 ? display.value.slice(0, -1) : "0";
        } else if (key === "=") {
          try {
            if (!/^[0-9+\-*/().\s]+$/.test(display.value)) {
              throw 0;
            }

            display.value = String(Function("return(" + display.value + ")")());
          } catch {
            display.value = "Error";
          }
        } else {
          if (display.value === "0" || display.value === "Error") {
            display.value = "";
          }

          display.value += key;
        }
      };
    });
  }

  if (id === "timer") {
    const w = makeWindow(
      "timer",
      "Timer",
      "⏱️",

      `
        <div
        class="timer-display"
        id="timerDisplay"
      >
        00:00
      </div>


      <div class="row">

        <input
          class="timer-input"
          id="timerMin"
          type="number"
          min="0"
          placeholder="Min"
          style="width:75px"
        >
        
        <input
         class="timer-input"
         id="timerSec"
         type="number"
         min="0"
         max="59"
         placeholder="Sec"
         style="width:75px"
         >
         
         
        <button id="timerStart">
          ▶ Start
        </button>


        <button id="timerStop">
          ■ Stop
        </button>
        
        <button id="timerReset">
         ↻ Reset
        </button>
        
      </div>
      
      
      `,

      440,
      960,
      405,
    );

    timerSetup(w);
  }

  if (id === "todo") {
    const w = makeWindow(
      "todo",
      "Todo",
      "☑️",

      `
        
        <div
        class="row"
        style="margin-top:0"
        >
        
        <input
          class="todo-input"
          id="todoInput"
          placeholder="Add a task..."
          style="flex:1"
        >
        
        <button id="todoAdd">
         Add
        </button>
        
        </div>
        
        
        <div
        class="todo-list"
        id="todoList"
        ></div>
        
        `,

      320,
      930,
      600,
    );

    todoSetup(w);
  }

  if (id === "about") {
    makeWindow(
      "about",
      "About",
      "ℹ️",

      `
        
        <div class="about">
         <p>
          <strong>
           My OS
          </strong>
          
          <br>
          built as a browser-based desktop.
          
         </p>
         
         <p>
         
          <strong>
          Features:
          </strong>
         </p>
         
         <p>
         
          • Live clock
          <br>

          • Simulated weather
          <br>

          • Google search
          <br>

          • Notes with save
          <br>

          • Calculator
          <br>

          • Timer
          <br>

          • Todo list
          <br>

          • Ping Pong
         </p>
         
         
         </div>
        </div>
        
        `,
      310,
      1125,
      20,
    );
  }

  if (id === "pong") {
    const w = makeWindow(
      "pong",
      "Ping Pong",
      "🏓",

      `
        
        <div class="pong-wrap">
         <p class="muted">
         Player 1: W/S
         &nbsp; | &nbsp;
         Player 2: Arrow Keys
         </p>
         
         <canvas
           id="pongCanvas"
           width="520"
           height="300"
         ></canvas>
         
         <p class="muted">
          press any control key to play
         </p>
         
        </div>
        
        `,

      560,
      70,
      580,
    );

    startPong(w);
  }
}

function escapeHtml(text) {
  return text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
}

let timerInterval = null;
let timerSeconds = 0;

function timerSetup(w) {
  const display = w.querySelector("#timerDisplay");

  function render() {
    const minutes = Math.floor(timerSeconds / 60);

    const seconds = timerSeconds % 60;

    display.textContent =
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  w.querySelector("#timerStart").onclick = () => {
    if (timerInterval) return;
    const minutes = Number(w.querySelector("#timerMin").value) || 0;

    const seconds = Number(w.querySelector("#timerSec").value) || 0;

    if (timerSeconds === 0) {
      timerSeconds = minutes * 60 + seconds;
    }

    render();

    timerInterval = setInterval(() => {
      if (timerSeconds <= 0) {
        stopTimer();
      }

      timerSeconds--;
      render();
    }, 1000);
  };

  w.querySelector("#timerStop").onclick = stopTimer;

  w.querySelector("#timerReset").onclick = () => {
    stopTimer();
    timerSeconds = 0;
    render();
  };
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function todoSetup(w) {
  const input = w.querySelector("#todoInput");

  const list = w.querySelector("#todoList");

  let tasks = JSON.parse(localStorage.getItem("myos_todos") || "[]");

  function render() {
    list.innerHTML = "";
    tasks.forEach((task, index) => {
      const row = document.createElement("div");

      row.className = "todo-item";
      row.innerHTML = `
        <span>
          ${escapeHtml(task)}
        </span>

        <button>
          ×
        </button>

       `;

      row.querySelector("button").onclick = () => {
        tasks.splice(index, 1);
        save();
      };

      list.appendChild(row);
    });
  }

  function save() {
    localStorage.setItem("myos_todos", JSON.stringify(tasks));

    render();
  }

  function addTask() {
    const value = input.value.trim();
    if (!value) return;
    tasks.push(value);
    input.value = "";
    save();
  }

  w.querySelector("#todoAdd").onclick = addTask;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  render();
}

let pongAnimation = null;
let pongKeys = {};

function startPong(w) {
  stopPong();
  const canvas = w.querySelector("#pongCanvas");

  const ctx = canvas.getContext("2d");

  let player1 = 120;
  let player2 = 120;

  let ballX = 260;
  let ballY = 150;

  let ballDX = 4;
  let ballDY = 3;

  let score1 = 0;
  let score2 = 0;

  const keyDown = (event) => {
    pongKeys[event.key.toLowerCase()] = true;
  };

  const keyUp = (event) => {
    pongKeys[event.key.toLowerCase()] = false;
  };

  document.addEventListener("keydown", keyDown);

  document.addEventListener("keyup", keyUp);

  function gameloop() {
    player1 += (pongKeys["w"] ? -5 : 0) + (pongKeys["s"] ? 5 : 0);

    player2 += (pongKeys["arrowup"] ? -5 : 0) + (pongKeys["arrowdown"] ? 5 : 0);

    player1 = Math.max(0, Math.min(240, player1));

    player2 = Math.max(0, Math.min(240, player2));

    ballX += ballDX;
    ballY += ballDY;

    if (ballY < 7 || ballY > 293) {
      ballDY *= -1;
    }

    if (ballX < 28 && ballY > player1 && ballY < player1 + 60) {
      ballDX = Math.abs(ballDX);
    }

    if (ballX > 492 && ballY > player2 && ballY < player2 + 60) {
      ballDX = -Math.abs(ballDX);
    }

    if (ballX < 0) {
      score2++;

      ballX = 260;
      ballY = 150;
      ballDX = 4;
    }

    if (ballX > 520) {
      score1++;
      ballX = 260;
      ballY = 150;
      ballDX = -4;
    }

    ctx.clearRect(0, 0, 520, 300);

    ctx.fillStyle = "#eee";

    ctx.fillRect(15, player1, 10, 60);

    ctx.fillRect(495, player2, 10, 60);

    ctx.beginPath();
    ctx.arc(ballX, ballY, 7, 0, Math.PI * 2);

    ctx.fill();

    ctx.font = "20px monospace";

    ctx.fillText(score1, 235, 25);

    ctx.fillText(score2, 280, 25);

    ctx.setLineDash([6, 8]);

    ctx.beginPath();
    ctx.moveTo(260, 0);

    ctx.lineTo(260, 300);

    ctx.stroke();

    ctx.setLineDash([]);

    pongAnimation = requestAnimationFrame(gameloop);
  }

  gameloop();

  w._pongCleanup = () => {
    document.removeEventListener("keydown", keyDown);

    document.removeEventListener("keyup", keyUp);
  };
}

function stopPong() {
  if (pongAnimation) {
    cancelAnimationFrame(pongAnimation);
  }
  pongAnimation = null;

  if (windows.pong?._pongCleanup) {
    windows.pong._pongCleanup();
  }
}

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    document.activeElement.tagName !== "INPUT" &&
    document.activeElement.tagName !== "TEXTAREA"
  ) {
    const ids = Object.keys(windows);
    if (ids.length) {
      const id = ids[ids.length - 1];

      windows[id].querySelector(".close").click();
    }
  }
});
