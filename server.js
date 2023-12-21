const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    role: String,
    username: String,
    name: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/api/users', (req, res) => {
    const userData = req.body;
    const newUser = new User(userData);

    newUser.save((err, user) => {
        if (err) {
        console.error(err);
        res.status(500).send('Error creating user');
        } else {
        res.status(201).json(user);
        }
    });
});

app.get('/api/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
        } else {
        res.status(200).json(users);
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
