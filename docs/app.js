let currentEditId = null;
const API = 'http://127.0.0.1:8000';

// Username management
function getUsername() { return localStorage.getItem('study_buddy_user'); }
function setUsername(username) { localStorage.setItem('study_buddy_user', username); }
function updateUserUI() {
  const user = getUsername();
  if (user) {
    document.getElementById('user-display').textContent = '👤 ' + user;
    document.getElementById('user-area').style.display = 'flex';
  }
}
function switchUser() {
  localStorage.removeItem('study_buddy_user');
  location.reload();
}
function promptUsername() {
  const stored = getUsername();
  if (stored) { updateUserUI(); return; }
  let user = prompt('Enter your name:', 'User');
  if (!user || user.trim() === '') { user = 'User_' + Date.now(); }
  setUsername(user.trim());
  updateUserUI();
}

async function loadExams() {
  try {
      const user = getUsername();
      const response = await fetch(`${API}/exams?user=${encodeURIComponent(user)}`);
      const exams = await response.json();
      render(exams);
  }
  catch (error) {
      console.error('Failed to load exams:', error);
      document.getElementById('exams-list').innerHTML =
        '<p style="color:var(--danger);text-align:center;padding:2rem">Server unavailable</p>';
  }
}

async function deleteExam(id) {
  try {
      const user = getUsername();
      await fetch(`${API}/exams/${id}?user=${encodeURIComponent(user)}`, { method: 'DELETE' });
      loadExams();
  } catch (error) {
      console.error('Failed to delete exam:', error);
      document.getElementById('exams-list').innerHTML =
        '<p style="color:var(--danger);text-align:center;padding:2rem">⚠️ Server unavailable</p>';
  }
}

const PREP = { easy: 7, medium: 14, hard: 21 };
function calcProgress(exam) {
  const PANIC_DAYS = { easy: 3, medium: 5, hard: 7 };
  const now = new Date();
  const examDate = new Date(exam.date + 'T00:00:00');
  const prepDays = PREP[exam.diff] || 14;
  const startPrep = new Date(examDate);
  startPrep.setDate(startPrep.getDate() - prepDays);
  const totalMs = examDate - startPrep;
  const passedMs = now - startPrep;
  const pct = Math.min(100, Math.max(0, Math.round((passedMs / totalMs) * 100)));
  const diffMs = examDate - now;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return { pct, daysLeft, isPanic: daysLeft <= PANIC_DAYS[exam.diff] && daysLeft >= 0 };
}

function barClass(pct, isPanic) {
  if (isPanic) return 'bar-red';
  if (pct < 50) return 'bar-green';
  if (pct < 80) return 'bar-amber';
  return 'bar-red';
}

function editExam(id, module, date, diff) {
  currentEditId = id;
  document.getElementById('inp-module').value = module;
  document.getElementById('inp-date').value = date;
  document.getElementById('inp-diff').value = diff;
  document.getElementById('submit-btn').textContent = 'Save Changes';
  document.getElementById('cancel-btn').style.display = 'block';
}

async function handleSubmit() {
  const module = document.getElementById('inp-module').value.trim();
  const date = document.getElementById('inp-date').value;
  const diff = document.getElementById('inp-diff').value;
  if (module === '') {
      document.getElementById('inp-module').style.borderColor = 'var(--danger)';
      setTimeout(() => {
          document.getElementById('inp-module').style.borderColor = '';
      }, 2000);
      return;
  }
  if (date === '') {
      document.getElementById('inp-date').style.borderColor = 'var(--danger)';
      setTimeout(() => {
          document.getElementById('inp-date').style.borderColor = '';
      }, 2000);
      return;
  }
  try {const user = getUsername();
      if (currentEditId === null) {
          await fetch(`${API}/exams?user=${encodeURIComponent(user)}`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({module, date, diff})
          });
      } else {
          await fetch(`${API}/exams/${currentEditId}?user=${encodeURIComponent(user)}`, {
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({module, date, diff})
          });
          currentEditId = null;
          document.getElementById('submit-btn').textContent = '+ Add Exam';
      }
      loadExams();
  } catch (error) {
      console.error('Failed to save exam:', error);
      document.getElementById('exams-list').innerHTML =
        '<p style="color:var(--danger);text-align:center;padding:2rem">Server unavailable</p>';
  }
}

function cancelEdit() {
  currentEditId = null;
  document.getElementById('inp-module').value = '';
  document.getElementById('inp-date').value = '';
  document.getElementById('inp-diff').value = 'easy';
  document.getElementById('submit-btn').textContent = 'Add Exam';
  document.getElementById('cancel-btn').style.display = 'none';
}

function closeTutorial() {
  document.getElementById('tutorial').style.display = 'none';
  localStorage.setItem('tutorial_shown', 'true');
}

function initTutorial() {
  if (!localStorage.getItem('tutorial_shown')) {
      document.getElementById('tutorial').style.display = 'flex';
  } else {
      document.getElementById('tutorial').style.display = 'none';
  }
}

function render(exams) {
  const list = document.getElementById('exams-list');
  const total = exams.length;
  const panic = exams.filter(e => calcProgress(e).isPanic).length;
  const done  = exams.filter(e => calcProgress(e).daysLeft < 0).length;
  document.getElementById('st-total').textContent = total;
  document.getElementById('st-panic').textContent = panic;
  document.getElementById('st-done').textContent  = done;
  if (exams.length === 0) {
      list.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:2rem">No exams</p>';
      return;
  }
  list.innerHTML = exams.map((exam, i) => {
      const { pct, daysLeft, isPanic } = calcProgress(exam);
      const timeClass = isPanic ? 'red' : daysLeft < 10 ? 'amber' : '';
      const timeText = daysLeft < 0 ? '✓ done' : `${daysLeft} day left`;
      return `
      <div class="exam-card${isPanic ? ' is-panic' : ''}" style="animation-delay:${i * 0.06}s">
          <div class="card-top">
              <div>
                  <div class="card-module">${exam.module}</div>
                  <div class="card-meta">${exam.date} · ${exam.diff}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                  <div class="time-badge ${timeClass}">${timeText}</div>
                   <button class="btn-edit" onclick="editExam(${exam.id}, '${exam.module}', '${exam.date}', '${exam.diff}')">✏️</button>
                  <button class="btn-delete" onclick="deleteExam(${exam.id})">✕</button>
              </div>
          </div>
          <div class="bar-track">
              <div class="bar-fill ${barClass(pct, isPanic)}"
                   id="bar-${exam.id}" style="width:0%"></div>
          </div>
          <div class="bar-meta">
              <span>Prepare (${PREP[exam.diff]}d)</span>
              <span id="pct-${exam.id}">0%</span>
          </div>
      </div>`;
  }).join('');
  requestAnimationFrame(() => {
      exams.forEach(exam => {
          const { pct } = calcProgress(exam);
          const bar = document.getElementById('bar-' + exam.id);
          const pctEl = document.getElementById('pct-' + exam.id);
          setTimeout(() => {
              bar.style.width = pct + '%';
              let n = 0;
              const step = () => {
                  n = Math.min(n + 2, pct);
                  pctEl.textContent = n + '%';
                  if (n < pct) requestAnimationFrame(step);
              };
              requestAnimationFrame(step);
          }, 100);
      });
  });
}

initTutorial();
promptUsername();
loadExams();
