import express from 'express';

const app = express();

// test
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Qrunchy API!' });
});

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});