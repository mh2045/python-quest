/* ══════════════════════════════════════════
   SUPABASE CONFIG
══════════════════════════════════════════ */
var SUPABASE_URL = 'https://bbtdjyijtdilzorsxyad.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidGRqeWlqdGRpbHpvcnN4eWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MDI4MDcsImV4cCI6MjA5MjM3ODgwN30.w0Pdcg0lLw8MoLQt1RvIPOH8KZVZ9LAMuuLUtNQCS7Q';

/* ══════════════════════════════════════════
   SUPABASE HELPERS
══════════════════════════════════════════ */
async function sbLoad(username) {
  try {
    var r = await fetch(
      SUPABASE_URL + '/rest/v1/progress?username=eq.' + encodeURIComponent(username) + '&select=xp,completed',
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY } }
    );
    var rows = await r.json();
    if (rows && rows.length > 0) return { xp: rows[0].xp || 0, completed: rows[0].completed || [] };
  } catch(e) {}
  return { xp: 0, completed: [] };
}

async function sbSave(username, data) {
  try {
    await fetch(
      SUPABASE_URL + '/rest/v1/progress',
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ username: username, xp: data.xp, completed: data.completed })
      }
    );
  } catch(e) {}
}

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */
var userId='', xp=0, completed=[], curLesson=0, curSlide=0, quizDone=false, sessionXP=0;

/* ══════════════════════════════════════════
   SCREENS
══════════════════════════════════════════ */
function show(id) {
  document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('on'); });
  document.getElementById(id).classList.add('on');
}

/* ══════════════════════════════════════════
   LOGIN
══════════════════════════════════════════ */
document.getElementById('login-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') doLogin();
});

async function doLogin() {
  var val = document.getElementById('login-input').value.trim();
  if (!val) return;
  var btn = document.querySelector('.btn-primary');
  btn.textContent = 'Loading...';
  btn.disabled = true;
  userId = val.toLowerCase().replace(/\s+/g, '_');
  var data = await sbLoad(userId);
  xp = data.xp || 0;
  completed = data.completed || [];
  btn.textContent = 'Start Playing';
  btn.disabled = false;
  renderHome();
  show('s-home');
}

/* ══════════════════════════════════════════
   HOME
══════════════════════════════════════════ */
function renderHome() {
  var nameVal = document.getElementById('login-input').value.trim();
  document.getElementById('user-badge').textContent = nameVal;
  document.getElementById('xp-display').textContent = xp + ' / ' + TOTAL_XP;
  document.getElementById('xp-fill').style.width = Math.min(100, Math.round(xp / TOTAL_XP * 100)) + '%';

  var wrap = document.getElementById('lesson-grid-wrap');
  wrap.innerHTML = '';

  TIERS.forEach(function(tier) {
    var lbl = document.createElement('div');
    lbl.className = 'tier-label';
    lbl.textContent = tier.label;
    wrap.appendChild(lbl);

    var grid = document.createElement('div');
    grid.className = 'grid';

    for (var i = tier.range[0]; i <= tier.range[1]; i++) {
      (function(idx) {
        var l = LESSONS[idx];
        var unlocked = idx === 0 || completed.indexOf(idx - 1) >= 0;
        var done = completed.indexOf(idx) >= 0;
        var d = document.createElement('div');
        d.className = 'card ' + (unlocked ? 'unlocked' : 'locked') + ' ' + (done ? 'done' : '');
        d.innerHTML = (done ? '<span class="card-check">&#10003;</span>' : '') +
          '<div class="card-icon">' + l.icon + '</div>' +
          '<div class="card-num">Lesson ' + (idx + 1) + '</div>' +
          '<div class="card-title">' + l.title + '</div>' +
          '<div class="card-sub">' + l.sub + '</div>';
        if (unlocked) { d.onclick = function() { startLesson(idx); }; }
        grid.appendChild(d);
      })(i);
    }
    wrap.appendChild(grid);
  });
}

function goHome() { renderHome(); show('s-home'); }

/* ══════════════════════════════════════════
   LESSON
══════════════════════════════════════════ */
function startLesson(idx) {
  curLesson = idx; curSlide = 0; quizDone = false; sessionXP = 0;
  var l = LESSONS[idx];
  document.getElementById('lesson-h-title').textContent = l.title;
  document.getElementById('lesson-h-sub').textContent = l.sub;
  renderDots(); renderSlide(); show('s-lesson');
}

function renderDots() {
  var l = LESSONS[curLesson];
  document.getElementById('dots').innerHTML = l.slides.map(function(_, i) {
    return '<div class="dot ' + (i < curSlide ? 'done' : i === curSlide ? 'active' : '') + '" id="dot' + i + '"></div>';
  }).join('');
}

function renderSlide() {
  var l = LESSONS[curLesson], s = l.slides[curSlide], total = l.slides.length;
  renderDots();
  document.getElementById('slide-counter').textContent = (curSlide + 1) + ' / ' + total;
  document.getElementById('btn-prev').disabled = (curSlide === 0);
  var nb = document.getElementById('btn-next');
  nb.textContent = curSlide === total - 1 ? 'Finish' : 'Next';
  nb.disabled = (s.type === 'quiz' && !quizDone);
  var body = document.getElementById('lesson-body');

  if (s.type === 'learn') {
    body.innerHTML = '<div class="slide"><div class="badge badge-learn">Learn</div><h3>' + s.title + '</h3>' + s.body + '</div>';
  } else if (s.type === 'quiz') {
    var lines = s.q.split('\n'), title = lines[0], code = lines.slice(1).join('\n').trim();
    body.innerHTML = '<div class="slide"><div class="badge badge-quiz">Quiz</div><h3>' + title + '</h3>' +
      (code ? '<div class="code-block"><pre>' + code + '</pre></div>' : '') +
      '<div class="quiz-opts" id="quiz-opts">' +
      s.opts.map(function(o, i) { return '<button class="quiz-opt" onclick="answerQuiz(' + i + ')" id="qo' + i + '">' + o + '</button>'; }).join('') +
      '</div><div class="feedback" id="feedback"></div></div>';
  } else if (s.type === 'code') {
    body.innerHTML = '<div class="slide"><div class="badge badge-code">Code Challenge</div><h3>' + s.title + '</h3>' +
      '<p style="font-size:.91rem;line-height:1.75;color:#b0b8d0;margin-bottom:.9rem">' + s.inst + '</p>' +
      '<div class="code-wrap"><div class="code-label">Your Code</div>' +
      '<textarea class="code-area" id="code-area" placeholder="Type your Python code here..."></textarea></div>' +
      '<div class="code-btns">' +
      '<button class="btn-run" onclick="checkCode()">Check</button>' +
      '<button class="btn-hint" onclick="showHint()">Hint</button></div>' +
      '<div class="output" id="code-output"></div></div>';
  }
}

function nextSlide() {
  var l = LESSONS[curLesson];
  if (curSlide < l.slides.length - 1) { curSlide++; quizDone = false; renderSlide(); }
  else { finishLesson(); }
}
function prevSlide() { if (curSlide > 0) { curSlide--; quizDone = false; renderSlide(); } }

function answerQuiz(idx) {
  if (quizDone) return;
  var s = LESSONS[curLesson].slides[curSlide];
  quizDone = true;
  s.opts.forEach(function(_, i) {
    var b = document.getElementById('qo' + i);
    b.disabled = true;
    if (i === s.correct) b.classList.add('correct');
    else if (i === idx && i !== s.correct) b.classList.add('wrong');
  });
  var fb = document.getElementById('feedback'), correct = (idx === s.correct);
  fb.className = 'feedback show ' + (correct ? 'good' : 'bad');
  fb.textContent = correct ? s.ok : s.bad;
  if (correct) { addXP(5); showToast('Correct! +5 XP'); }
  document.getElementById('btn-next').disabled = false;
}

function checkCode() {
  var s = LESSONS[curLesson].slides[curSlide];
  var code = document.getElementById('code-area').value.trim();
  var out = document.getElementById('code-output');
  if (!code) { out.className = 'output show err'; out.textContent = 'Write some code first!'; return; }
  var passed = s.check ? s.check(code) : true;
  if (passed) {
    out.className = 'output show ok';
    out.textContent = 'Looks great! Your code structure is correct.\n\nTo run it: visit replit.com or python.org/shell and paste it in.';
    addXP(10); showToast('Code accepted! +10 XP');
  } else {
    out.className = 'output show err'; out.textContent = s.msg;
  }
}

function showHint() {
  var s = LESSONS[curLesson].slides[curSlide];
  var out = document.getElementById('code-output');
  out.className = 'output show hint';
  out.textContent = 'Hint:\n\n' + s.hint;
}

function addXP(n) { xp = Math.min(TOTAL_XP, xp + n); sessionXP += n; }

async function finishLesson() {
  var already = (completed.indexOf(curLesson) >= 0);
  if (!already) {
    xp = Math.min(TOTAL_XP, xp + LESSONS[curLesson].xp);
    sessionXP += LESSONS[curLesson].xp;
    completed.push(curLesson);
    await sbSave(userId, { xp: xp, completed: completed });
  }
  document.getElementById('r-icon').textContent = already ? '⭐' : '🎉';
  document.getElementById('r-title').textContent = LESSONS[curLesson].title + ' Complete!';
  document.getElementById('r-sub').textContent = already ? 'Great review!' : 'Well done, Pythonista!';
  document.getElementById('r-xp').textContent = sessionXP > 0 ? '+' + sessionXP : '+0';
  document.getElementById('r-save').textContent = already ? 'Already completed' : 'Progress saved to cloud';
  var nb = document.getElementById('btn-next-lesson');
  if (curLesson + 1 < LESSONS.length) {
    nb.style.display = '';
    nb.textContent = 'Next: ' + LESSONS[curLesson + 1].title;
  } else {
    nb.style.display = 'none';
  }
  show('s-result');
}

function goNextLesson() { if (curLesson + 1 < LESSONS.length) startLesson(curLesson + 1); }

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast good show';
  setTimeout(function() { t.className = 'toast good'; }, 2500);
}
