const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/api/user', require('./routes/user'));

const PORT = 8000 || process.env.port;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})