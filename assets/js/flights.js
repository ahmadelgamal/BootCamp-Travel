/* ------------------------------ UCB EXTENSION ------------------------------- */
/* --------- ONLINE BLENDED | FULL STACK WEB DEVELOPMENT CERTIFICATE ---------- */
/* ------------------- PROJECT 1 GROUP 7 | BOOTCAMP TRAVEL -------------------- */
/* ------------------------ THIS FILE WAS DEVELOPED BY ------------------------ */
/* ------------------------------ AHMAD EL GAMAL ------------------------------ */

/* -------------------- BEGINS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES -------------------- */
/* ---------- declares constants to point to html elements ---------- */
// var flightsListEl = document.getElementById("flights-list");
// var flightCountEl = document.getElementById("flight-count");

// constants that point to search form
const searchFormEl = document.getElementById("form");
const goingFromEl = document.getElementById("going-from");
const goingToEl = document.getElementById("going-to");
const dateDepartureEl = document.getElementById("date-departure");
const dateReturnEl = document.getElementById("date-return");

// constants that point to flights grid
const flightsGridEl = document.getElementById("flights-grid");

/* ---------- declares variables for user input for "flight offers search" amadeus api ---------- */
// CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
var originCode = goingFromEl.value;
// CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
var destinationCode = goingToEl.value;
var departureDate = dateDepartureEl.value; // Format: YYYY-MM-DD
var returnDate = dateReturnEl.value; // Format: YYYY-MM-DD

// HARDCODING. MUST BE CHANGED TO USER INPUT
var numberOfAdults = "1";
// sets currency to USD in fetch request (default in amadeus is euro)
const currencyCode = "USD";

/* ---------- declares common variables of amadeus apis ---------- */
// amadeus for developers testing baseUrl
var baseUrl = "https://test.api.amadeus.com";
// url for requesting and checking on access token
var accessTokenPath = "/v1/security/oauth2/token/";
// access token must be renewed for 30 minutes at a time
var accessToken = "0OXA6rGFx8tcsvcnOWAKo4r8fs8U";
// `value` of `headers` "Authorization" `key`
var authorizationValue = "Bearer " + accessToken;

// path for flight offers search
var flightOffersSearchPath = "/v2/shopping/flight-offers";

/* ---------- declares required query variables for "flight offers search" amadeus api ---------- */
var queryOrigin = "?originLocationCode=";
var queryDestination = "&destinationLocationCode=";
var queryDepartureDate = "&departureDate=";
var queryNumberOfAdults = "&adults=";

/* ---------- declares optional query variables for "flight offers search" amadeus api ---------- */
var queryCurrency = "&currencyCode="; // default is EUR, so needed for USD
var queryReturnDate = "&returnDate="; // required for roundtrip flights
var queryChildren = "&children="; // for travelers between 2 and 12 on date of departure with own separate seat
var queryInfants = "&infants="; // for travelers 2 or less on date of departure. infants sit on lap of adult (# of infants must not exceed # of adults)
var travelClass = "&travelClass="; // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
var nonStop = "&nonStop="; // boolean
var maxPrice = "&maxPrice="; // max price per traveler. no decimals
var max = "&max="; // maximum number of flight options (default is 250)
var includedAirlineCodes = "&includedAirlineCodes="; // multiple airlines allowed, separate with comma (no spaces). cannot be combined with excludedAirlineCodes
var excludedAirlineCodes = "&excludedAirlineCodes="; // multiple airlines allowed, separate with comma (no spaces). cannot be combined with includedAirlineCodes

/* ---------- declares variables for amadeus api urls ---------- */
var oneWayFlightOffersSearchApiUrl;
var roundTripFlightOffersSearchApiUrl;
var apiUrl;

/* ---------- declares variables for "ai-generated photos" amadeus api ---------- */
// amadeus url variables
var aiGeneratedPhotosPath = "/v2/media/files/generated-photos";
var queryCategory = "?category=";
// MUST BE UPPERCASE
var category = "MOUNTAIN";

// full "ai-generated photos" api url
var aiGeneratedPhotosApiUrl =
  baseUrl + aiGeneratedPhotosPath + queryCategory + category;
/* -------------------- ENDS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES -------------------- */

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
  fetch(apiUrl, {
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
var saveUrl = function () {
  // full "flight offers search" api url for one way
  oneWayFlightOffersSearchApiUrl =
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

  // full "flight offers search" api url for roundtrip
  roundTripFlightOffersSearchApiUrl =
    oneWayFlightOffersSearchApiUrl + queryReturnDate + returnDate;

  // one-way was selected
  if (returnDate === "") {
    apiUrl = oneWayFlightOffersSearchApiUrl;
    // roundtrip was selected
  } else if (returnDate !== "") {
    apiUrl = roundTripFlightOffersSearchApiUrl;
  }
};

/* ---------- search form handler ---------- */
var searchFormHandler = function () {
  /* ---------- declares variables for user input for "flight offers search" amadeus api ---------- */
  // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
  originCode = goingFromEl.value;
  // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
  destinationCode = goingToEl.value;
  departureDate = dateDepartureEl.value; // Format: YYYY-MM-DD
  returnDate = dateReturnEl.value; // Format: YYYY-MM-DD

  // HARDCODING. MUST BE CHANGED TO USER INPUT
  // numberOfAdults = ???.value;

  saveUrl();
  getFlightOffersSearch();
};

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
    // var flightListItemEl = document.createElement("li");

    // creates a "single flight" (trip) container in index.html
    var tripContainerEl = document.createElement("div");
    tripContainerEl.classList.add(
      "uk-grid",
      "uk-width-1-1",
      "uk-background-default",
      "uk-border-rounded",
      "test-border",
      "margin-zero"
    );

    /* creates one container for both itineraries (outbound and inbound) of the trip
    this div is not in the structure of the html file yet */
    var itineraryContainerEl = document.createElement("div");

    // appends itinerary container to trip container
    tripContainerEl.appendChild(itineraryContainerEl);
    // appends trip container to flights grid
    flightsGridEl.appendChild(tripContainerEl);

    var intineraryCount = data.data[i].itineraries.length;

    for (var y = 0; y < intineraryCount; y++) {
      /* creates a container for each of the two itineraries
      this div is not in the structure of the html file yet */
      var itineraryItemEl = document.createElement("div");
      // creates a container for the segment
      var segmentListEl = document.createElement("div");
      itineraryItemEl.classList.add(
        "uk-width-1-2",
        "uk-padding-remove-horizontal"
      );
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

        var airlineFullEl = document.createElement("h4");

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

searchFormEl.addEventListener("submit", searchFormHandler);
/* -------------------- ENDS CALLING FUNCTIONS/METHODS -------------------- */
