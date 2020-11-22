const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const amadeusRequestAccessTokenBody = 'grant_type=client_credentials&client_id=' + process.env.AMADEUS_API_KEY + '&client_secret=' + process.env.AMADEUS_API_SECRET;
module.exports = amadeusRequestAccessTokenBody;

app.listen(port, () => console.log(`App listening on port ${port}`));
