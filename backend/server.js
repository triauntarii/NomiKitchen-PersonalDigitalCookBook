const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173', // Port default Vite (React)
    credentials: true
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Welcome to Nomi Kitchen API" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});