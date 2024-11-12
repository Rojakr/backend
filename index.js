


// const express = require('express');
// const mysql = require('mysql2');
// const app = express();
// const port = 5000;

// app.use(express.json());

// // Serve static files (optional, if you have a UI)
// app.use(express.static('public'));

// // MySQL connection setup
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Roja_12@',
//   database: 'todo_app'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // Root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Todo App API');
// });

// // Fetch all tasks or filtered tasks based on completion status
// app.get('/tasks', (req, res) => {
//   const filter = req.query.status;
//   let query = 'SELECT * FROM tasks';
//   if (filter === 'completed') {
//     query = 'SELECT * FROM tasks WHERE completed = true';
//   } else if (filter === 'incomplete') {
//     query = 'SELECT * FROM tasks WHERE completed = false';
//   }
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching tasks:', err);
//       res.status(500).send('Error fetching tasks');
//     } else {
//       res.json(results);
//     }
//   });
// });

// // Add a new task
// app.post('/tasks', (req, res) => {
//   const { description } = req.body;
//   const query = 'INSERT INTO tasks (description, completed) VALUES (?, ?)';
//   db.query(query, [description, false], (err, result) => {
//     if (err) {
//       console.error('Error adding task:', err);
//       res.status(500).send('Error adding task');
//     } else {
//       res.json({ id: result.insertId, description, completed: false });
//     }
//   });
// });

// // Update task completion status
// app.put('/tasks/:id', (req, res) => {
//   const { id } = req.params;
//   const { completed } = req.body;
//   const query = 'UPDATE tasks SET completed = ? WHERE id = ?';
//   db.query(query, [completed, id], (err, result) => {
//     if (err) {
//       console.error('Error updating task:', err);
//       res.status(500).send('Error updating task');
//     } else if (result.affectedRows === 0) {
//       res.status(404).send('Task not found');
//     } else {
//       res.json({ id, completed });
//     }
//   });
// });

// // Delete a task
// app.delete('/tasks/:id', (req, res) => {
//   const { id } = req.params;
//   const query = 'DELETE FROM tasks WHERE id = ?';
//   db.query(query, [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting task:', err);
//       res.status(500).send('Error deleting task');
//     } else if (result.affectedRows === 0) {
//       res.status(404).send('Task not found');
//     } else {
//       res.status(204).send();
//     }
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());  // To allow cross-origin requests from React

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Change to your MySQL username
  password: 'Roja_12@',  // Change to your MySQL password
  database: 'todo_app'  // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Error fetching tasks' });
    }
    res.json(results);
  });
});

// Get filtered tasks (completed/incomplete)
app.get('/tasks/filter', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM tasks WHERE completed = ?';
  const params = [status === 'completed' ? 1 : 0];
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching filtered tasks:', err);
      return res.status(500).json({ error: 'Error fetching filtered tasks' });
    }
    res.json(results);
  });
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { description } = req.body;
  const query = 'INSERT INTO tasks (description, completed) VALUES (?, ?)';
  db.query(query, [description, 0], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      return res.status(500).json({ error: 'Error adding task' });
    }
    res.status(201).json({ id: result.insertId, description, completed: false });
  });
});

// Update task completion
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const query = 'UPDATE tasks SET completed = ? WHERE id = ?';
  db.query(query, [completed, id], (err) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ error: 'Error updating task' });
    }
    res.status(200).json({ id, completed });
  });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ error: 'Error deleting task' });
    }
    res.status(204).send();
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
