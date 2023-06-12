const express = require('express');
const geolib = require('geolib');
const example = require('./example.js');
const locations = require('./routes/locations.route.js');

const app = express();
const port = 3000;

app.use('/api', locations);

app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
});
