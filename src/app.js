const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'html')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // You can implement your login logic here, like checking credentials against a database
    // For simplicity, I'm just checking if username and password are both 'admin'
    if (username === 'admin' && password === 'admin') {
        res.redirect('/students');
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
        if (!data) {
            data = '[]';
        }
        const students = JSON.parse(data);
        res.json(students);
    });
});

// List page
app.get('/students', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'students.html'));
});

// Registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'register.html'));
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
        if (!data) {
            data = '[]';
        }
        
        const students = JSON.parse(data);
        const id = (students ? students[students.length - 1].id : 0) + 1;
        console.log(students);
        // Add new student
        students.push({ id, firstName, lastName, email, dob, gender, address });
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

// Delete studenta student record by ID
app.delete('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Read existing students data
    fs.readFile(path.join(__dirname, 'data', 'students.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (!data) {
            data = '[]';
        }
        
        const students = JSON.parse(data);

        // Remove the record with id
        const index = students.findIndex(student => student.id === id);
        if (index !== -1) {
            students.splice(index, 1);
           // Write updated data back to the file
            fs.writeFile(path.join(__dirname, 'data', 'students.json'), JSON.stringify(students, null, 2), err => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                }
                else {
                    res.status(200).json({ message: `Student with ID ${id} has been deleted successfully.` });
                }
            });
        }
        else {
            res.status(404).json({ error: `Student with ID ${id} not found.` });
        }
    });

});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
