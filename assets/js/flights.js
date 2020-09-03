/* -------------------- BEGINS DECLARATIONS OF GLOBAL VARIABLES -------------------- */
/* ---------- declares variables to point to html elements ---------- */
var flightsListEl = document.getElementById("flights-list");
var flightCountEl = document.getElementById("flight-count");

/* ---------- declares common variables of amadeus apis ---------- */
// amadeus for developers testing baseUrl
var baseUrl = "https://test.api.amadeus.com";
// url for requesting and checking on access token
var accessTokenPath = "/v1/security/oauth2/token/";
// access token must be renewed for 30 minutes at a time
var accessToken = "rxmpRlh8hSf6J0o8yaJ4t9aATQbA";
// `value` of `headers` "Authorization" `key`
var authorizationValue = "Bearer " + accessToken;

/* ---------- declares variables for "flight offers search" amadeus api ---------- */
var flightOffersSearchPath = "/v2/shopping/flight-offers";
var queryOrigin = "?originLocationCode=";
var queryDestination = "&destinationLocationCode=";
var queryDepartureDate = "&departureDate=";
var queryNumberOfAdults = "&adults=";
var queryCurrency = "&currencyCode=";

/* ---------- declares variables for user input for "flight offers search" amadeus api ---------- */
// HARDCODING. MUST BE CHANGED TO USER INPUT
var originCode = "CDG";
var destinationCode = "LAX";
var departureDate = "2020-10-10";
var numberOfAdults = "1";
var currencyCode = "USD";

// full "flight offers search" api url
var flightOffersSearchApiUrl =
  baseUrl +
  flightOffersSearchPath +
  queryOrigin +
  originCode +
  queryDestination +
  destinationCode +
  queryDepartureDate +
  departureDate +
  queryNumberOfAdults +
  numberOfAdults +
  queryCurrency +
  currencyCode;

/* ---------- declares variables for "ai-generated photos" amadeus api ---------- */
// amadeus url variables
var aiGeneratedPhotosPath = "/v2/media/files/generated-photos";
var queryCategory = "?category=";
// MUST BE UPPERCASE
var category = "MOUNTAIN";

// full "ai-generated photos" api url
var aiGeneratedPhotosApiUrl =
  baseUrl + aiGeneratedPhotosPath + queryCategory + category;
/* -------------------- ENDS DECLARATIONS OF GLOBAL VARIABLES -------------------- */

/* -------------------- BEGINS AMADEUS CREDENTIALS -------------------- */
/* ---------- checks status of access token. expires every 30 minutes ---------- */
// not part of program. used for testing only.
var accessTokenStatus = function () {
  var fetchAccessToken = baseUrl + accessTokenPath + accessToken;

  fetch(fetchAccessToken)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
};
/* -------------------- ENDS AMADEUS CREDENTIALS -------------------- */

/* -------------------- BEGINS FETCH APIS -------------------- */
/* ---------- gets "ai-generated photos" amadeus api ----------*/
var getAiGeneratedPhotos = function () {
  fetch(aiGeneratedPhotosApiUrl, {
    method: "GET",
    headers: {
      Authorization: authorizationValue,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.log("Catch-all error for ai-generated photos.");
    });
};

/* ---------- gets "flight offers search" amadeus api ---------- */
var getFlightOffersSearch = function () {
  fetch(flightOffersSearchApiUrl, {
    method: "GET",
    headers: {
      Authorization: authorizationValue,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      writeData(data);
    })
    .catch(function (error) {
      console.log("Catch-all error for get flight offers search.");
    });
};
/* -------------------- ENDS FETCH -------------------- */

/* -------------------- BEGINS METHODS -------------------- */
/* ---------- writes data from "flight offers search" amadeus api to html ---------- */
var writeData = function (data) {
  // dictionary of codes
  var aircraftCodeList = data.dictionaries.aircraft;
  var carriersCodeList = data.dictionaries.carriers;
  var currenciesCodeList = data.dictionaries.currencies;
  var locationsCityCodeList = data.dictionaries.locations;

  // number of flights available per user input
  var flightCount = data.meta.count;
  flightCountEl.textContent =
    "There are " + flightCount + " flights available for your selected route!";

  // each flight details
  for (var i = 0; i < flightCount; i++) {
    // essential details
    var cabin = data.data[i].travelerPricings[0].fareDetailsBySegment[0].cabin;
    var grandTotalPrice = data.data[i].price.grandTotal;
    var currencyCode = data.data[i].price.currency;
    var aircraftFull = aircraftCodeList[aircraftCode];
    var carrierFull = carriersCodeList[carrierCode];
    var departureCityCode =
      data.data[i].itineraries[0].segments[0].departure.iataCode;
    var arrivalCityCode =
      data.data[i].itineraries[0].segments[0].arrival.iataCode;
    var departureTerminal =
      data.data[i].itineraries[0].segments[0].departure.terminal;
    var arrivalTerminal =
      data.data[i].itineraries[0].segments[0].arrival.terminal;
    var oneWay = data.data[i].oneWay;
    var flightNumber = data.data[i].itineraries[0].segments[0].number;
    var departureTime = data.data[i].itineraries[0].segments[0].departure.at;
    var arrivalTime = data.data[i].itineraries[0].segments[0].arrival.at;

    // more details
    var numberOfStops = data.data[i].itineraries[0].segments[0].numberOfStops;
    var flightDuration = data.data[i].itineraries[0].segments[0].duration;
    var numberOfBookableSeats = data.data[i].numberOfBookableSeats;
    var airClass =
      data.data[i].travelerPricings[0].fareDetailsBySegment[0].class;
    var lastTicketingDate = data.data[i].lastTicketingDate;

    // optional details
    var departureCountryCode =
      locationsCityCodeList[departureCityCode].countryCode;
    var arrivalCountryCode = locationsCityCodeList[arrivalCityCode].countryCode;
    var basePrice = data.data[i].price.base;
    var totalPrice = data.data[i].price.total;
    // checks if there is data for operator, otherwise it does not look for it
    if (
      typeof data.data[i].itineraries[0].segments[0].operating !== "undefined"
    ) {
      var operatorCode =
        data.data[i].itineraries[0].segments[0].operating.carrierCode;
      var operatorFull = carriersCodeList[operatorCode];
    }

    // hidden details
    var currencyFull = currenciesCodeList[currencyCode];
    var aircraftCode = data.data[i].itineraries[0].segments[0].aircraft.code;
    var carrierCode = data.data[i].itineraries[0].segments[0].carrierCode;

    // combines above data
    var flightDetails =
      "Cabin: " +
      cabin +
      " | class: " +
      airClass +
      " | aircraft: " +
      aircraftFull +
      " | carrier: " +
      carrierFull +
      " | operated by: " +
      operatorFull +
      " | from: " +
      departureCityCode +
      ", " +
      departureCountryCode +
      " | terminal: " +
      departureTerminal +
      " | to: " +
      arrivalCityCode +
      ", " +
      arrivalCountryCode +
      " | terminal: " +
      arrivalTerminal +
      " | number of stops: " +
      numberOfStops +
      " | Base Price = " +
      basePrice +
      " " +
      currencyCode +
      " | Total Price = " +
      totalPrice +
      " " +
      currencyFull +
      " | Grand Total Price = " +
      grandTotalPrice +
      " " +
      currencyFull;

    // creates and appends html elements
    var flightListItemEl = document.createElement("li");
    flightListItemEl.textContent = flightDetails;
    flightsListEl.appendChild(flightListItemEl);
  }
};
/* -------------------- ENDS METHODS -------------------- */

/* -------------------- BEGINS CALLING FUNCTIONS/METHODS -------------------- */
// accessTokenStatus(); // not part of program. used for testing purposes
// getAiGeneratedPhotos(); // poor images. not used on website.
// getFlightOffersSearch();
/* -------------------- ENDS CALLING FUNCTIONS/METHODS -------------------- */
