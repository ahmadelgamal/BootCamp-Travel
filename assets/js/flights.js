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
var accessToken = "U6L7iz6A54EKpuGTGAVBHyF2coMw";
// `value` of `headers` "Authorization" `key`
var authorizationValue = "Bearer " + accessToken;

/* ---------- declares variables for "flight offers search" amadeus api ---------- */
var flightOffersSearchPath = "/v2/shopping/flight-offers";
var queryOrigin = "?originLocationCode=";
var queryDestination = "&destinationLocationCode=";
var queryDepartureDate = "&departureDate=";
var queryNumberOfAdults = "&adults=";
var queryCurrency = "&currencyCode=";
var queryReturnDate = "&returnDate=";

/* ---------- declares variables for user input for "flight offers search" amadeus api ---------- */
// HARDCODING. MUST BE CHANGED TO USER INPUT
var originCode = "CDG";
var destinationCode = "LAX";
var departureDate = "2020-10-10";
var numberOfAdults = "1";
var currencyCode = "USD";
var returnDate = "2020-10-20";

// full "flight offers search" api url
var oneWayFlightOffersSearchApiUrl =
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

// full "flight offers search" api url
var roundTripFlightOffersSearchApiUrl =
  oneWayFlightOffersSearchApiUrl + queryReturnDate + returnDate;

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
    })
    .catch(function (error) {
      console.log("Catch-all error for check status of access token.");
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
      // replace this with error message in html
      console.log("Catch-all error for ai-generated photos.");
    });
};

/* ---------- gets "flight offers search" amadeus api ---------- */
var getFlightOffersSearch = function () {
  fetch(roundTripFlightOffersSearchApiUrl, {
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
      // replace this with error message in html
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

  // number of flights available matching user input
  var flightCount = data.meta.count;
  flightCountEl.textContent =
    "There are " + flightCount + " flights available for your selected route!";

  // each flight details
  for (var i = 0; i < flightCount; i++) {
    var flightListItemEl = document.createElement("li");
    var itineraryListEl = document.createElement("ol");
    var intineraryCount = data.data[i].itineraries.length;

    for (var y = 0; y < intineraryCount; y++) {
      // html elements
      var itineraryListItemEl = document.createElement("li");
      var segmentListEl = document.createElement("ol");
      // number of segments for each flight. it is also "number of stops" for "trip"
      var segmentCount = data.data[i].itineraries[0].segments.length;

      for (var x = 0; x < segmentCount; x++) {
        var segmentListItemEl = document.createElement("li");
        // essential details
        var cabin =
          data.data[i].travelerPricings[0].fareDetailsBySegment[x].cabin;
        var grandTotalPrice = data.data[i].price.grandTotal;
        var currencyCode = data.data[i].price.currency;
        var aircraftFull = aircraftCodeList[aircraftCode];
        var carrierFull = carriersCodeList[carrierCode];
        var departureCityCode =
          data.data[i].itineraries[0].segments[x].departure.iataCode;
        var arrivalCityCode =
          data.data[i].itineraries[0].segments[x].arrival.iataCode;
        var departureTerminal =
          data.data[i].itineraries[0].segments[x].departure.terminal;
        var arrivalTerminal =
          data.data[i].itineraries[0].segments[x].arrival.terminal;
        var oneWay = data.data[i].oneWay;
        var flightNumber = data.data[i].itineraries[0].segments[x].number;
        var departureTime =
          data.data[i].itineraries[0].segments[x].departure.at;
        var arrivalTime = data.data[i].itineraries[0].segments[x].arrival.at;

        // more details
        var flightDuration = data.data[i].itineraries[0].segments[x].duration;
        var numberOfBookableSeats = data.data[i].numberOfBookableSeats;
        var airClass =
          data.data[i].travelerPricings[0].fareDetailsBySegment[x].class;
        var lastTicketingDate = data.data[i].lastTicketingDate;

        // optional details
        var departureCountryCode =
          locationsCityCodeList[departureCityCode].countryCode;
        var arrivalCountryCode =
          locationsCityCodeList[arrivalCityCode].countryCode;
        var basePrice = data.data[i].price.base;
        var totalPrice = data.data[i].price.total;
        // checks if there is data for operator, otherwise it does not look for it
        if (
          typeof data.data[i].itineraries[0].segments[x].operating !==
          "undefined"
        ) {
          var operatorCode =
            data.data[i].itineraries[0].segments[x].operating.carrierCode;
          var operatorFull = carriersCodeList[operatorCode];
        }

        // hidden details
        var currencyFull = currenciesCodeList[currencyCode];
        var aircraftCode =
          data.data[i].itineraries[0].segments[x].aircraft.code;
        var carrierCode = data.data[i].itineraries[0].segments[x].carrierCode;
        var numberOfStops =
          data.data[i].itineraries[0].segments[x].numberOfStops;

        // combines above data
        var segmentDetails =
          i +
          "-" +
          x +
          " | Cabin: " +
          cabin +
          " | class: " +
          airClass +
          " | aircraft: " +
          aircraftFull +
          " | carrier: " +
          carrierFull +
          " | operated by: " +
          operatorFull +
          "<br /> | from: " +
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
          "<br /> | Base Price = " +
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

        // creates a new listing for each segment
        segmentListItemEl.innerHTML = segmentDetails;
        segmentListEl.appendChild(segmentListItemEl);
      }
      itineraryListItemEl.appendChild(segmentListEl);
      itineraryListEl.appendChild(itineraryListItemEl);
    }
    // creates a new listing for each flight
    flightListItemEl.appendChild(itineraryListEl);
    flightsListEl.appendChild(flightListItemEl);
  }
};
/* -------------------- ENDS METHODS -------------------- */

/* -------------------- BEGINS CALLING FUNCTIONS/METHODS -------------------- */
// not part of program. used for testing purposes
// accessTokenStatus();
// poor images. not used on website.
// getAiGeneratedPhotos();
// main function of this app
getFlightOffersSearch();
/* -------------------- ENDS CALLING FUNCTIONS/METHODS -------------------- */
