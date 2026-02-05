const questions = {
    "Grandmaster": [
        { q: "Which element has the atomic number 1?", a: ["Helium", "Hydrogen", "Lithium"], c: 1 },
        { q: "What is the capital of Iceland?", a: ["Reykjavik", "Oslo", "Helsinki"], c: 0 },
        { q: "How many strings are on a standard guitar?", a: ["5", "6", "7"], c: 1 },
        // ... [Insert all 50 Grandmaster questions from the previous response here] ...
        { q: "What is the Sisco Group India motto?", a: ["Future First", "Digital Innovation", "Excellence Always"], c: 1 }
    ],
    "Indian Heritage": [
        { q: "Who is known as the 'Iron Man of India'?", a: ["Mahatma Gandhi", "Sardar Patel", "Nehru"], c: 1 },
        { q: "What is the national animal of India?", a: ["Lion", "Tiger", "Elephant"], c: 1 },
        // ... [Insert remaining 8 Heritage questions] ...
    ]
    // ... [Include your other 8 categories: Tech, Science, Space, etc.] ...
};

let currentCat = "", currentIdx = 0, score = 0, timeLeft = 15, timer;
let activeQuestions = [];

function init() {
    const user = localStorage.getItem('sis_user');
    if(!user && window.location.pathname.includes('quiz')) { window.location.href = 'login.html'; return; }
    if(document.getElementById('user-display')) document.getElementById('user-display').innerText = `ID: ${user}`;
    
    const list = document.getElementById('cat-list');
    if(list) {
        Object.keys(questions).forEach(cat => {
            const btn = document.createElement('button');
            btn.innerText = cat; btn.className = 'btn';
            btn.onclick = () => startQuiz(cat);
            list.appendChild(btn);
        });
    }
}

function startQuiz(cat) {
    currentCat = cat; currentIdx = 0; score = 0;
    activeQuestions = [...questions[cat]].sort(() => Math.random() - 0.5);
    renderQuizUI();
    showQuestion();
}

function renderQuizUI() {
    document.getElementById('game-container').innerHTML = `
        <div class="nav-header" style="color:var(--primary); font-weight:bold;">
            <span>⏱ <span id="time-left">15</span>s</span>
            <span>Q: <span id="curr-q">1</span>/${activeQuestions.length}</span>
        </div>
        <div class="progress-bar" style="background:#111; height:6px; border-radius:10px; margin:10px 0;"><div id="progress-fill" style="background:var(--primary); height:100%; width:0%;"></div></div>
        <h3 id="question-text" style="margin:20px 0; font-size:1.1rem;"></h3>
        <div id="options-grid" style="display:grid; gap:10px;"></div>
    `;
}

function showQuestion() {
    clearInterval(timer); timeLeft = 15;
    const qData = activeQuestions[currentIdx];
    document.getElementById('question-text').innerText = qData.q;
    document.getElementById('curr-q').innerText = currentIdx + 1;
    document.getElementById('progress-fill').style.width = `${(currentIdx / activeQuestions.length) * 100}%`;
    
    const grid = document.getElementById('options-grid');
    grid.innerHTML = "";
    qData.a.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'btn'; b.innerText = opt;
        b.onclick = () => check(i, b);
        grid.appendChild(b);
    });
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if(timeLeft <= 0) nextQ();
    }, 1000);
}

function check(i, btn) {
    clearInterval(timer);
    if(i === activeQuestions[currentIdx].c) { score++; btn.style.background = "#00c853"; }
    else { btn.style.background = "#ff1744"; }
    setTimeout(nextQ, 1000);
}

function nextQ() {
    currentIdx++;
    if(currentIdx < activeQuestions.length) showQuestion();
    else finish();
}

function finish() {
    const percent = Math.round((score / activeQuestions.length) * 100);
    document.getElementById('game-container').innerHTML = `
        <h2 style="color:var(--primary)">Mission Complete</h2>
        <h1 style="font-size:3rem; margin:15px 0;">${score}/${activeQuestions.length}</h1>
        <p>Accuracy: ${percent}%</p>
        <button class="btn main-btn" style="margin-top:20px" onclick="location.reload()">Return Home</button>
    `;
    saveScore(currentCat, score);
}

function saveScore(cat, s) {
    let history = JSON.parse(localStorage.getItem('sis_scores')) || {};
    if(!history[cat] || s > history[cat]) history[cat] = s;
    localStorage.setItem('sis_scores', JSON.stringify(history));
}

function logout() { localStorage.removeItem('sis_user'); window.location.href = 'index.html'; }

init();
