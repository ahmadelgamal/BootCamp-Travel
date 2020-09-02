// DECLARE GLOBAL VARIABLES
var flightsListEl = document.getElementById("flights-list");

var getFlightInfo = function () {
  // HARDCODING. MUST BE CHANGED TO USER INPUT
  var originCode = "LAX";
  var destinationCode = "CDG";
  var departureDate = "2020-10-10";
  var numberOfAdults = "1";

  // amadeus variables
  var host = "https://test.api.amadeus.com/";
  var flightOffersSearchPath = "v2/shopping/flight-offers";
  var queryOrigin = "?originLocationCode=";
  var queryDestination = "&destinationLocationCode=";
  var queryDepartureDate = "&departureDate=";
  var queryNumberOfAdults = "&adults=";

  var apiUrl =
    host +
    flightOffersSearchPath +
    queryOrigin +
    originCode +
    queryDestination +
    destinationCode +
    queryDepartureDate +
    departureDate +
    queryNumberOfAdults +
    numberOfAdults;

  // access token must be renewed for 30 minutes at a time
  var accessToken = "80oPFkdWLCDCGPyHdIIcLQQzl1BS";
  var authorizationValue = "Bearer " + accessToken;

  fetch(apiUrl, {
    headers: {
      Authorization: authorizationValue,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      writeData(data);
    });
};

getFlightInfo();

// write first 20 flight options
var writeData = function (data) {
  console.log(data.data[0].price);
  for (var i = 0; i < 20; i++) {
    var cabin = data.data[i].travelerPricings[0].fareDetailsBySegment[0].cabin;
    var airClass = data.data[i].travelerPricings[0].fareDetailsBySegment[0].class;
    var basePrice = data.data[i].price.base;
    var currency = data.data[i].price.currency;
    var totalPrice = data.data[i].price.total;
    var flightDetails = "Cabin: " + cabin + " | class: " + airClass + " | Base Price = " + basePrice + " " + currency + "| after fees = " + totalPrice + " " + currency;
    
    var flightListItemEl = document.createElement("li");
    flightListItemEl.textContent = flightDetails;
    flightsListEl.appendChild(flightListItemEl);
  }
};

// check status of access token. it expires every 30 minutes
// must call function. it is currently not called
var accessTokenStatus = function () {
  var fetchAccessToken =
    "https://test.api.amadeus.com/v1/security/oauth2/token/" + accessToken;

  fetch(fetchAccessToken)
    // returns the data in json readable format
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {})
    .catch(function (error) {
      console.log("Catch-all error");
    });
};
