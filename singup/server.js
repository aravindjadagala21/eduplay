const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.PASSWORD,
  database: process.env.DB_NAME || 'eduplay',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if DB fails to connect
  }
  console.log('MySQL connected...');
});

app.post('/submit', async (req, res) => {
  try {
    const { ['first-name']: first_name, father_name, email, ['new-password']: password, gender, referrer: user_class, age, bio } = req.body;
    const userData = { first_name, father_name, email, password: password, gender, class: user_class, age, bio };

    const sql = 'INSERT INTO users SET ?';
    db.query(sql, userData, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('An error occurred while submitting the form.');
      }
      console.log('Data inserted:', result);

      res.redirect('http://localhost:4000/home.html'); // Ensure this origin allows redirection
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
