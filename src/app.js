const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // You can implement your login logic here, like checking credentials against a database
    // For simplicity, I'm just checking if username and password are both 'admin'
    if (username === 'admin' && password === 'admin') {
        res.redirect('/register');
    } else {
        res.send('Invalid credentials');
    }
});

// Endpoint to display list of students
app.get('/data', (req, res) => {
    // Read student data from JSON file
    fs.readFile(path.join(__dirname, 'data', 'students.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const students = JSON.parse(data);
        res.json(students);
    });
});

// List page
app.get('/students', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'students.html'));
});

// Registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Registration endpoint
app.post('/register', (req, res) => {

    const { firstName, lastName, email, dob, gender, address } = req.body;

    // Read existing students data
    fs.readFile(path.join(__dirname, 'data', 'students.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const students = JSON.parse(data);
        console.log(students);
        // Add new student
        students.push({ firstName, lastName, email, dob, gender, address });
        // Write updated data back to the file
        fs.writeFile(path.join(__dirname, 'data', 'students.json'), JSON.stringify(students, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/students');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
