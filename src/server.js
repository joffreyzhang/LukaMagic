const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Papa = require('papaparse');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Endpoint to get room data
app.get('/rooms', (req, res) => {
    fs.readFile('/q0c.csv', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading CSV file');
        }
        const jsonData = Papa.parse(data, { header: true });
        res.json(jsonData.data);
    });
});

// Endpoint to update room description
app.post('/update-description', (req, res) => {
    const { teln, newDescription } = req.body;

    fs.readFile('/q0c.csv', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading CSV file');
        }

        const jsonData = Papa.parse(data, { header: true });
        const roomIndex = jsonData.data.findIndex(room => room.teln === teln);

        if (roomIndex === -1) {
            return res.status(404).send('Room not found');
        }

        jsonData.data[roomIndex].descript = newDescription;

        const csv = Papa.unparse(jsonData.data);
        fs.writeFile('/q0c.csv', csv, 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error writing to CSV file');
            }
            res.send('Description updated successfully');
        });
    });
});

// Endpoint to add a new user
app.post('/add-user', (req, res) => {
    const newUser = req.body;

    fs.readFile('/q0c.csv', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading CSV file');
        }

        const jsonData = Papa.parse(data, { header: true });
        jsonData.data.push(newUser);

        const csv = Papa.unparse(jsonData.data);
        fs.writeFile('q0c.csv', csv, 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error writing to CSV file');
            }
            res.send('User added successfully');
        });
    });
});

// Endpoint to delete a user
app.post('/delete-user', (req, res) => {
    const { name } = req.body;

    fs.readFile('/q0c.csv', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading CSV file');
        }

        const jsonData = Papa.parse(data, { header: true });
        const filteredData = jsonData.data.filter(room => room.name.toLowerCase() !== name.toLowerCase());

        const csv = Papa.unparse(filteredData);
        fs.writeFile('/q0c.csv', csv, 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error writing to CSV file');
            }
            res.send('User deleted successfully');
        });
    });
});

// Endpoint to modify a user
app.post('/modify-user', (req, res) => {
    const { name, attribute, value } = req.body;

    fs.readFile('/q0c.csv', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading CSV file');
        }

        const jsonData = Papa.parse(data, { header: true });
        const userIndex = jsonData.data.findIndex(room => room.name.toLowerCase() === name.toLowerCase());

        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }

        jsonData.data[userIndex][attribute] = value;

        const csv = Papa.unparse(jsonData.data);
        fs.writeFile('/q0c.csv', csv, 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error writing to CSV file');
            }
            res.send('User modified successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
