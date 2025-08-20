// ===== State =====
const boardEl = document.getElementById("board");
const cells = [...document.querySelectorAll(".cell")];
const statusEl = document.getElementById("status");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");
const playAgainBtn = document.getElementById("playAgain");
const resetAllBtn = document.getElementById("resetAll");
const modeBtns = [...document.querySelectorAll('.segmented [data-mode]')];
const startBtns = [...document.querySelectorAll('.segmented [data-start]')];

let board, current, gameOver, mode, startAs;
let scores = { X: 0, O: 0, D: 0 };

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ===== Helpers =====
function setActive(btns, valueAttr, value){
  btns.forEach(b => b.classList.toggle('active', b.dataset[valueAttr] === value));
}

function freshBoard(){
  board = Array(9).fill(null);
  gameOver = false;
  current = startAs;
  cells.forEach(c => {
    c.textContent = "";
    c.disabled = false;
    c.classList.remove("marked","win");
  });
  updateStatus();
  if(mode === "ai" && current === "O") aiMove(); // if AI starts
}

function updateScoreUI(){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}

function updateStatus(text){
  statusEl.textContent = text || `${current}’s turn`;
}

function endGame(winner, line){
  gameOver = true;
  cells.forEach(c => c.disabled = true);
  if(winner){
    line.forEach(i => cells[i].classList.add("win"));
    updateStatus(`${winner} wins!`);
    scores[winner]++; 
  }else{
    updateStatus("It’s a draw.");
    scores.D++;
  }
  updateScoreUI();
}

// smart but simple AI: win > block > center > corner > random
function aiBestMove(){
  const ai = "O";
  const human = "X";
  // 1. try to win
  let move = findWinningMove(ai);
  if(move !== null) return move;
  // 2. block human
  move = findWinningMove(human);
  if(move !== null) return move;
  // 3. center
  if(board[4] === null) return 4;
  // 4. corners
  const corners = [0,2,6,8].filter(i => board[i] === null);
  if(corners.length) return pickRandom(corners);
  // 5. any
  const empty = board.map((v,i)=>v===null?i:null).filter(v=>v!==null);
  return pickRandom(empty);
}

function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function findWinningMove(player){
  for(const [a,b,c] of WIN_LINES){
    const line = [board[a], board[b], board[c]];
    const count = line.filter(v => v === player).length;
    const emptyIndex = [a,b,c].find(i => board[i] === null);
    if(count === 2 && emptyIndex !== undefined) return emptyIndex;
  }
  return null;
}

// ===== Events =====
boardEl.addEventListener("click", (e) =>{
  const cell = e.target.closest(".cell");
  if(!cell || gameOver) return;

  const idx = Number(cell.dataset.index);
  if(board[idx] !== null) return;

  placeMark(idx, current);
  if(checkResult()) return;

  // switch turn
  current = current === "X" ? "O" : "X";
  updateStatus();

  if(mode === "ai" && current === "O" && !gameOver){
    // small delay for feel
    setTimeout(aiMove, 320);
  }
});

function aiMove(){
  const idx = aiBestMove();
  placeMark(idx, "O");
  checkResult();
  if(!gameOver){
    current = "X";
    updateStatus();
  }
}

function placeMark(index, player){
  board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add("marked");
  cell.disabled = true;
}

function checkResult(){
  for(const line of WIN_LINES){
    const [a,b,c] = line;
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      endGame(board[a], line);
      return true;
    }
  }
  if(board.every(v => v !== null)){
    endGame(null, []);
    return true;
  }
  return false;
}

// Buttons
playAgainBtn.addEventListener("click", freshBoard);
resetAllBtn.addEventListener("click", ()=>{
  scores = {X:0,O:0,D:0};
  updateScoreUI();
  freshBoard();
});

// mode & start toggles
modeBtns.forEach(btn => btn.addEventListener('click', ()=>{
  mode = btn.dataset.mode;
  setActive(modeBtns, 'mode', mode);
  freshBoard();
}));
startBtns.forEach(btn => btn.addEventListener('click', ()=>{
  startAs = btn.dataset.start;
  setActive(startBtns, 'start', startAs);
  freshBoard();
}));

// ===== Init =====
mode = "pvp";
startAs = "X";
setActive(modeBtns, 'mode', mode);
setActive(startBtns, 'start', startAs);
updateScoreUI();
freshBoard();