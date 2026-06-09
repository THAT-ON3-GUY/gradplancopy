const express = require('express');
const cors = require('cors');

const coursesRouter = require('./routes/courses');
const majorsRouter = require('./routes/majors');
const plansRouter = require('./routes/plans');
const { initDb } = require('./db/seed');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/courses', coursesRouter);
app.use('/api/majors', majorsRouter);
app.use('/api/plans', plansRouter);

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Grad Planner API running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
