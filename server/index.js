const express = require('express');
const app = express();



const PORT = 8000 || process.env.port;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})