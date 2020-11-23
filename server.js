const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/* ------------------- fetches access token from amadeus -------------------- */
function fetchAmadeusAccessToken(req, res) {
  const amadeusRequestAccessTokenBody = 'grant_type=client_credentials&client_id=' + process.env.AMADEUS_API_KEY + '&client_secret=' + process.env.AMADEUS_API_SECRET;

  fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: amadeusRequestAccessTokenBody
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var accessToken = (data.access_token);
      res.json(accessToken);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// api get request from flights search to get access token from amadeus
app.get('/api/amadeus-access-token', fetchAmadeusAccessToken);

/* ------------------- sends rapid api key to frontend -------------------- */
app.get('/api/rapid-api-key', (req, res) => {
  const rapidApiKey = process.env.RAPID_API_KEY;
  res.json(rapidApiKey);
});

app.listen(port, () => console.log(`App listening on port ${port}`));
