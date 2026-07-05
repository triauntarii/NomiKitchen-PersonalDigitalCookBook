const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173', // Port default Vite (React)
    credentials: true
}));

app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Welcome to Nomi Kitchen API" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});