const questions = [
  { q: "What is the largest planet in our Solar System?", a: ["Earth", "Jupiter", "Mars", "Venus"], c: 1 },
  { q: "What is 12 × 8?", a: ["86", "96", "108", "112"], c: 1 },
  { q: "Which gas do plants mainly absorb for photosynthesis?", a: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], c: 2 },
  { q: "What does CPU stand for?", a: ["Central Processing Unit", "Computer Power Utility", "Core Program User", "Central Program Upload"], c: 0 },
  { q: "How many continents are commonly recognized on Earth?", a: ["5", "6", "7", "8"], c: 2 },
  { q: "Which organ pumps blood around the human body?", a: ["Lungs", "Brain", "Heart", "Kidneys"], c: 2 },
  { q: "What is the chemical symbol for gold?", a: ["Ag", "Au", "Gd", "Go"], c: 1 },
  { q: "Which planet is known as the Red Planet?", a: ["Mercury", "Mars", "Saturn", "Neptune"], c: 1 },
  { q: "What is the square root of 81?", a: ["7", "8", "9", "10"], c: 2 },
  { q: "Which device is commonly used to move a cursor on a computer?", a: ["Printer", "Mouse", "Speaker", "Router"], c: 1 }
];

let player1 = "", player2 = "", scores = [0, 0];
let qIndex = 0, turn = 0, timer = 10, timerId = null, locked = false;

const $ = id => document.getElementById(id);
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

function show(id) {
  ["startScreen", "gameScreen", "resultScreen"].forEach(x => $(x).classList.add("hidden"));
  $(id).classList.remove("hidden");
}

$("startBtn").onclick = () => {
  player1 = $("player1Input").value.trim();
  player2 = $("player2Input").value.trim();
  if (!player1 || !player2) {
    $("startError").textContent = "Please enter both player names.";
    return;
  }
  scores = [0, 0];
  qIndex = 0;
  turn = 0;
  show("gameScreen");
  loadQuestion();
};

function loadQuestion() {
  clearInterval(timerId);
  locked = false;
  timer = 10;
  $("feedback").textContent = "";
  $("questionNumber").textContent = `Question ${qIndex + 1} / ${questions.length}`;
  $("p1Name").textContent = player1;
  $("p2Name").textContent = player2;
  $("p1Score").textContent = scores[0];
  $("p2Score").textContent = scores[1];

  const item = questions[qIndex];
  $("question").textContent = item.q;
  $("turnLabel").textContent = `${turn === 0 ? player1 : player2}'s turn`;
  $("timer").textContent = timer;

  const answerArea = $("answers");
  answerArea.innerHTML = "";
  const choices = item.a.map((text, index) => ({ text, index }));
  shuffle(choices).forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = choice.text;
    btn.dataset.index = choice.index;
    btn.onclick = () => chooseAnswer(btn, choice.index);
    answerArea.appendChild(btn);
  });

  timerId = setInterval(() => {
    timer--;
    $("timer").textContent = timer;
    if (timer <= 0) chooseAnswer(null, -1);
  }, 1000);
}

function chooseAnswer(button, selected) {
  if (locked) return;
  locked = true;
  clearInterval(timerId);

  const correct = questions[qIndex].c;
  document.querySelectorAll(".answer").forEach(btn => {
    btn.disabled = true;
    if (Number(btn.dataset.index) === correct) btn.classList.add("correct");
    if (button && btn === button && selected !== correct) btn.classList.add("wrong");
  });

  if (selected === correct) {
    scores[turn]++;
    $("feedback").textContent = `${turn === 0 ? player1 : player2} got it right! +1 point`;
  } else {
    $("feedback").textContent = `Correct answer: ${questions[qIndex].a[correct]}`;
  }

  $("p1Score").textContent = scores[0];
  $("p2Score").textContent = scores[1];

  setTimeout(() => {
    if (turn === 0) {
      turn = 1;
      loadQuestion();
    } else {
      qIndex++;
      if (qIndex >= questions.length) showResults();
      else {
        turn = 0;
        loadQuestion();
      }
    }
  }, 1300);
}

function showResults() {
  clearInterval(timerId);
  $("finalP1Name").textContent = player1;
  $("finalP2Name").textContent = player2;
  $("finalP1Score").textContent = scores[0];
  $("finalP2Score").textContent = scores[1];

  if (scores[0] > scores[1]) $("resultTitle").textContent = `${player1} WINS! 🏆`;
  else if (scores[1] > scores[0]) $("resultTitle").textContent = `${player2} WINS! 🏆`;
  else $("resultTitle").textContent = "IT'S A DRAW! 🤝";

  show("resultScreen");
}

$("againBtn").onclick = () => {
  scores = [0, 0];
  qIndex = 0;
  turn = 0;
  show("gameScreen");
  loadQuestion();
};

$("menuBtn").onclick = () => {
  clearInterval(timerId);
  $("player1Input").value = "";
  $("player2Input").value = "";
  $("startError").textContent = "";
  show("startScreen");
};
