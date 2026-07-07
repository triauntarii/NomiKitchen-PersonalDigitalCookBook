const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173', // Port default Vite (React)
    credentials: true
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Welcome to Nomi Kitchen API" });
});

// Middleware penanganan error global (untuk menangkap error upload file dll)
app.use((err, req, res, next) => {
    console.error("Error handler:", err.message);
    res.status(err.status || 400).json({ 
        message: err.message || "Terjadi kesalahan pada server" 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});