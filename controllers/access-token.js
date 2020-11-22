

/* ------------------- fetches access token from amadeus -------------------- */
var requestAccessToken = function () {
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
      console.log(accessToken);
    })
    .catch(function (error) {
      console.log(error);
    });
};