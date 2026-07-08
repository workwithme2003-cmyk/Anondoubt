const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const { v4: uuidv4 } = require('uuid');

const app  = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── JSON FILE DATABASE ────────────────────────────────────────────────────────
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return { questions: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── SEED DATA ─────────────────────────────────────────────────────────────────
function seedIfEmpty() {
  const db = readDB();
  if (db.questions.length > 0) return;

  const now = Date.now();
  db.questions = [
    {
      _id: uuidv4(), subject: 'Computer Science',
      title: 'What is the difference between process and thread?',
      body: "I keep confusing these two. My professor explained it but I still don't get it. Can someone explain with a simple real-world example?",
      votes: 24, createdAt: new Date(now - 7200000).toISOString(),
      answers: [{ _id: uuidv4(), text: "A process is an independent program with its own memory space. A thread is a unit of execution within a process, sharing the same memory. Think of a process as a restaurant and threads as the waiters working simultaneously!", createdAt: new Date(now - 1800000).toISOString() }]
    },
    {
      _id: uuidv4(), subject: 'Mathematics',
      title: 'How to solve integration by parts? Any trick to remember?',
      body: 'Especially the ILATE rule — when exactly do I apply it and when not?',
      votes: 18, createdAt: new Date(now - 18000000).toISOString(),
      answers: [{ _id: uuidv4(), text: "Remember LIATE: Logarithm, Inverse trig, Algebraic, Trigonometric, Exponential. The first function in LIATE that appears becomes 'u', and the other becomes 'dv'. Practice 5 problems daily!", createdAt: new Date(now - 3600000).toISOString() }]
    },
    {
      _id: uuidv4(), subject: 'Physics',
      title: "Why is the sky blue? What's the actual physics behind it?",
      body: '',
      votes: 31, createdAt: new Date(now - 28800000).toISOString(),
      answers: [
        { _id: uuidv4(), text: "It's Rayleigh scattering! Shorter blue wavelengths scatter more than red ones when sunlight hits the atmosphere. So wherever you look, blue reaches your eye.", createdAt: new Date(now - 7200000).toISOString() },
        { _id: uuidv4(), text: "At sunset, light travels through more atmosphere so most blue scatters away, leaving red and orange. That's why sunsets are so beautiful!", createdAt: new Date(now - 3600000).toISOString() }
      ]
    },
    {
      _id: uuidv4(), subject: 'Chemistry',
      title: 'How do I balance redox reactions? I am so lost.',
      body: "I know the half-reaction method exists but I always get the wrong answer in the exam.",
      votes: 9, createdAt: new Date(now - 3600000).toISOString(),
      answers: []
    },
    {
      _id: uuidv4(), subject: 'Economics',
      title: "What's the difference between GDP and GNP?",
      body: '',
      votes: 15, createdAt: new Date(now - 43200000).toISOString(),
      answers: [{ _id: uuidv4(), text: "GDP = value of goods/services produced within a country's borders. GNP = GDP + income by residents abroad - income by foreigners inside. GDP measures location, GNP measures nationals.", createdAt: new Date(now - 5400000).toISOString() }]
    },
    {
      _id: uuidv4(), subject: 'Biology',
      title: 'What is the difference between mitosis and meiosis?',
      body: 'Both involve cell division but I get confused about which produces how many cells.',
      votes: 13, createdAt: new Date(now - 86400000).toISOString(),
      answers: [{ _id: uuidv4(), text: "Mitosis produces 2 identical daughter cells (for growth & repair). Meiosis produces 4 genetically unique cells (for sexual reproduction). Simple rule: Mitosis = More of the same. Meiosis = Mix it up!", createdAt: new Date(now - 43200000).toISOString() }]
    }
  ];
  writeDB(db);
  console.log('✅ Database seeded with 6 sample questions');
}

seedIfEmpty();

// ─── VALID SUBJECTS ───────────────────────────────────────────────────────────
const VALID_SUBJECTS = ['Mathematics','Physics','Chemistry','Computer Science','English','Biology','Economics','History'];

// ─── API ROUTES ────────────────────────────────────────────────────────────────

// GET all questions
app.get('/api/questions', (req, res) => {
  try {
    const { subject, sort, search } = req.query;
    let { questions } = readDB();

    if (subject && subject !== 'All') questions = questions.filter(q => q.subject === subject);
    if (search) {
      const s = search.toLowerCase();
      questions = questions.filter(q =>
        q.title.toLowerCase().includes(s) ||
        q.body.toLowerCase().includes(s)  ||
        q.subject.toLowerCase().includes(s)
      );
    }
    if (sort === 'unanswered') questions = questions.filter(q => q.answers.length === 0);
    if (sort === 'popular')    questions.sort((a, b) => b.votes - a.votes);
    else                       questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: questions, total: questions.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single question
app.get('/api/questions/:id', (req, res) => {
  try {
    const { questions } = readDB();
    const q = questions.find(q => q._id === req.params.id);
    if (!q) return res.status(404).json({ success: false, error: 'Question not found' });
    res.json({ success: true, data: q });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create question
app.post('/api/questions', (req, res) => {
  try {
    const { subject, title, body } = req.body;
    if (!subject || !title)           return res.status(400).json({ success: false, error: 'subject and title are required' });
    if (!VALID_SUBJECTS.includes(subject)) return res.status(400).json({ success: false, error: 'Invalid subject' });
    if (title.trim().length < 5)      return res.status(400).json({ success: false, error: 'Title too short (min 5 chars)' });

    const db = readDB();
    const newQ = { _id: uuidv4(), subject, title: title.trim(), body: (body || '').trim(), votes: 0, createdAt: new Date().toISOString(), answers: [] };
    db.questions.unshift(newQ);
    writeDB(db);
    res.status(201).json({ success: true, data: newQ });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH vote
app.patch('/api/questions/:id/vote', (req, res) => {
  try {
    const { action } = req.body;
    const db = readDB();
    const q = db.questions.find(q => q._id === req.params.id);
    if (!q) return res.status(404).json({ success: false, error: 'Question not found' });
    q.votes = Math.max(0, q.votes + (action === 'down' ? -1 : 1));
    writeDB(db);
    res.json({ success: true, votes: q.votes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add answer
app.post('/api/questions/:id/answers', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 2) return res.status(400).json({ success: false, error: 'Answer text is required' });
    const db = readDB();
    const q = db.questions.find(q => q._id === req.params.id);
    if (!q) return res.status(404).json({ success: false, error: 'Question not found' });
    const newAnswer = { _id: uuidv4(), text: text.trim(), createdAt: new Date().toISOString() };
    q.answers.push(newAnswer);
    writeDB(db);
    res.status(201).json({ success: true, data: newAnswer, totalAnswers: q.answers.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET stats
app.get('/api/stats', (req, res) => {
  try {
    const { questions } = readDB();
    const totalA = questions.reduce((s, q) => s + q.answers.length, 0);
    res.json({ success: true, data: { questions: questions.length, answers: totalA, helpers: Math.floor(questions.length * 1.8) + 12 } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET subject counts
app.get('/api/subjects/counts', (req, res) => {
  try {
    const { questions } = readDB();
    const result = { All: questions.length };
    questions.forEach(q => { result[q.subject] = (result[q.subject] || 0) + 1; });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── CATCH-ALL → FRONTEND ─────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  🤫  AnonDoubt Server Started!           ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  🌐  http://localhost:${PORT}               ║`);
  console.log(`║  🗄️   Database: db.json (no setup needed) ║`);
  console.log(`║  📡  API: /api/questions                  ║`);
  console.log('╚══════════════════════════════════════════╝\n');
});
