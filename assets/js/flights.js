/* -------------------------------------------------------------------------- */
/* ----------------------------- UCB EXTENSION ------------------------------ */
/* ---------- BLENDED ONLINE | FULL STACK WEB DEVELOPMENT BOOTCAMP ---------- */
/* ------------------ PROJECT 1 GROUP 7 | BOOTCAMP TRAVEL ------------------- */
/* ----------------------- THIS FILE WAS DEVELOPED BY ----------------------- */
/* ----------------------------- AHMAD EL GAMAL ----------------------------- */
/* -------------------------- OTHER GROUP MEMBERS --------------------------- */
/* ------------------- GAUTAM TANKHA & MARCO EVANGELISTA -------------------- */
/* -------------------------------------------------------------------------- */

/* ----------- BEGINS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES ----------- */
/* --------------- declares constants to point to html elements -------------- */
// constants that point to search form
const searchFormEl = document.getElementById("form");
const goingFromEl = document.getElementById("going-from");
const goingToEl = document.getElementById("going-to");
const dateDepartureEl = document.getElementById("date-departure");
const dateReturnEl = document.getElementById("date-return");

// constants that point to flights grid
const flightsGridEl = document.getElementById("flights-grid");

/* OLD. WAS USED FOR TESTING. REMOVE WHEN READY */
// var flightsListEl = document.getElementById("flights-list");
// var flightCountEl = document.getElementById("flight-count");

/* ----- declares variables for user input for "flight offers search" amadeus api ----- */
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

/* ---------- declares common constants & variables of amadeus apis ---------- */
// amadeus for developers testing baseUrl
const baseUrl = "https://test.api.amadeus.com";
// url for requesting and checking on access token
const accessTokenPath = "/v1/security/oauth2/token/";
// access token must be renewed for 30 minutes at a time
const accessToken = "Dg6aDWQcT33FcWLdoIfQ5HLUumpY";
// `value` of `headers` "Authorization" `key`
const authorizationValue = "Bearer " + accessToken;

// path for flight offers search
const flightOffersSearchPath = "/v2/shopping/flight-offers";

/* ---------- declares required query variables for "flight offers search" amadeus api ---------- */
const queryOrigin = "?originLocationCode=";
const queryDestination = "&destinationLocationCode=";
const queryDepartureDate = "&departureDate=";
const queryNumberOfAdults = "&adults=";

/* ---------- declares important query variables for "flight offers search" amadeus api ---------- */
const queryReturnDate = "&returnDate="; // required for roundtrip flights
const travelClass = "&travelClass="; // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
const queryCurrency = "&currencyCode="; // default is EUR, so needed for USD

/* ---------- declares optional query variables for "flight offers search" amadeus api ---------- */
const queryChildren = "&children="; // for travelers between 2 and 12 on date of departure with own separate seat
const queryInfants = "&infants="; // for travelers 2 or less on date of departure. infants sit on lap of adult (# of infants must not exceed # of adults)
const nonStop = "&nonStop="; // boolean
const maxPrice = "&maxPrice="; // max price per traveler. no decimals
const max = "&max="; // maximum number of flight options (default is 250)
const includedAirlineCodes = "&includedAirlineCodes="; // multiple airlines allowed, separate with comma (no spaces). cannot be combined with excludedAirlineCodes
const excludedAirlineCodes = "&excludedAirlineCodes="; // multiple airlines allowed, separate with comma (no spaces). cannot be combined with includedAirlineCodes

/* ---------- declares variables for amadeus api urls ---------- */
var oneWayFlightOffersSearchApiUrl;
var roundTripFlightOffersSearchApiUrl;
var apiUrl;
/* -------------------- ENDS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES -------------------- */

/* -------------------- BEGINS FETCH APIS -------------------- */
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
/* ---------- saves api url depending on one-way or roundtrip ---------- */
var saveUrl = function () {
  // full "flight offers search" api url for one-way
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
  // prevents the initials submit from triggering a refresh of index.html
  event.preventDefault();

  /* ---------- gets current values in search form ---------- */
  // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
  originCode = goingFromEl.value;
  // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
  destinationCode = goingToEl.value;
  departureDate = dateDepartureEl.value;
  returnDate = dateReturnEl.value;

  // HARDCODED. MUST BE CHANGED TO USER INPUT
  // numberOfAdults = ???.value;

  saveUrl();
  getFlightOffersSearch();
};

/* ---------- converts time from fetch to ui time format ---------- */
var convertTime = function (timeToConvert) {
  // first change time to proper format
  var convertedTime = timeToConvert.split("");
  convertedTime.splice(0, 11);
  convertedTime.splice(5, 3);

  // then add am or pm and change the numbers accordingly (for example, 18 become 6pm)
  // if 0x:xx, it's am
  if (convertedTime[0] == 0) {
    var timeDesignation = "am";
    // if 00:xx, it's 12:xxam
    if (convertedTime[1] == 0) {
      convertedTime[0] = "1";
      convertedTime[1] = "2";
    }
    // if 10:xx or 11:xx, it's am
  } else if (convertedTime[0] == 1 && convertedTime[1] < 2) {
    var timeDesignation = "am";
    // if 12:xx, it's 12:xxpm
  } else if (convertedTime[0] == 1 && convertedTime[1] == 2) {
    var timeDesignation = "pm";
    // if 1x:xx (other than 10, 11, or 12) or 2x:xx, it's pm
  } else {
    var timeDesignation = "pm";
    if (
      convertedTime[0] == 1 ||
      (convertedTime[0] == 2 && convertedTime[1] > 1)
    ) {
      convertedTime[0] -= 1;
      convertedTime[1] -= 2;
    } else {
      var index1 = parseInt(convertedTime[1]) + 8;
      convertedTime[1] = index1;
      convertedTime.splice(0, 1);
    }
  }

  if (convertedTime[0] == 0) {
    convertedTime.splice(0, 1);
  }

  convertedTime = convertedTime.join("");

  convertedTime = convertedTime.concat(timeDesignation);
  // return converted time
  return convertedTime;
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

  // clears data from previous search
  flightsGridEl.innerHTML =
    "There are " + flightCount + " flights available for your selected route!";

  // each flight details
  for (var i = 0; i < flightCount; i++) {
    /* ----- creates a "single flight" (trip) container, in index.html, for each trip ----- */
    var tripContainerEl = document.createElement("div");
    tripContainerEl.classList.add(
      "uk-grid",
      "uk-width-1-1@s",
      "uk-width-2-3@m",
      "uk-background-default",
      "uk-border-rounded",
      "margin-zero",
      "uk-margin-small-top"
    );
    flightsGridEl.appendChild(tripContainerEl);

    /* ----- creates a container element for each itinerary ----- */
    // gets number of itineraries
    var intineraryCount = data.data[i].itineraries.length;

    // loops through number of itineraries to create a container element for each
    for (var y = 0; y < intineraryCount; y++) {
      var itineraryContainerEl = document.createElement("div");
      itineraryContainerEl.classList.add(
        "uk-width-1-2",
        "uk-padding-remove-horizontal"
      );
      tripContainerEl.appendChild(itineraryContainerEl);

      // number of segments for each flight. it is also "number of stops" for "trip"
      var segmentCount = data.data[i].itineraries[0].segments.length;

      /* ----- allocates data from fetch into variables ----- */
      for (var x = 0; x < segmentCount; x++) {
        // essential details
        var carrierFull = carriersCodeList[carrierCode];
        var flightNumber = data.data[i].itineraries[0].segments[x].number;
        var departureCityCode =
          data.data[i].itineraries[0].segments[x].departure.iataCode;
        var arrivalCityCode =
          data.data[i].itineraries[0].segments[x].arrival.iataCode;
        var departureTime =
          data.data[i].itineraries[0].segments[x].departure.at;
        var arrivalTime = data.data[i].itineraries[0].segments[x].arrival.at;
        var cabin =
          data.data[i].travelerPricings[0].fareDetailsBySegment[x].cabin;
        var grandTotalPrice = data.data[i].price.grandTotal;
        var currencyCode = data.data[i].price.currency;
        var oneWay = data.data[i].oneWay;

        // more details
        var aircraftFull = aircraftCodeList[aircraftCode];
        var departureTerminal =
          data.data[i].itineraries[0].segments[x].departure.terminal;
        var arrivalTerminal =
          data.data[i].itineraries[0].segments[x].arrival.terminal;
        var flightDuration = data.data[i].itineraries[0].segments[x].duration;
        var airClass =
          data.data[i].travelerPricings[0].fareDetailsBySegment[x].class;
        var numberOfBookableSeats = data.data[i].numberOfBookableSeats;
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

        /* ----- writes segment data to index.html ----- */
        /* ----- carrier (ariline) name ----- */
        var carrierFullEl = document.createElement("h4");
        carrierFullEl.className = "black-ops";
        carrierFullEl.textContent = carrierFull;
        itineraryContainerEl.appendChild(carrierFullEl);

        /* ----- carrier (ariline) logo ----- */
        var carrierLogoEl = document.createElement("img");
        carrierLogoEl.className = "frame";
        carrierLogoEl.alt = "airline logo";
        carrierLogoEl.style.width = "70";
        carrierLogoEl.style.height = "70";
        // HARDCODED. NEED TO CHANGE TO GET CORRESPONDING LOGO
        carrierLogoEl.src =
          "https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/DL_sq.svg";
        itineraryContainerEl.appendChild(carrierLogoEl);

        /* ----- flight details ----- */
        var flightDetailsEl = document.createElement("p");

        // city data
        // NEED TO DECLARE departureCityFull & arrivalCityFulls
        var citySpanEl = document.createElement("span");
        // citySpanEl.innerHTML = departureCityFull + " to " + arrivalCityFull + "<br />";
        citySpanEl.innerHTML = "Test City 1" + " to " + "Test City 2" + "<br />";
        flightDetailsEl.appendChild(citySpanEl);

        // airport data
        var airportSpanEl = document.createElement("span");
        airportSpanEl.classList.add("fa", "stronger");
        airportSpanEl.innerHTML =
          departureCityCode + " &#xf072; " + arrivalCityCode;
        flightDetailsEl.appendChild(airportSpanEl);

        // departure and arrival times
        var timeSpanEl = document.createElement("span");
        timeSpanEl.innerHTML =
          "<br />" +
          convertTime(departureTime) +
          " to " +
          convertTime(arrivalTime) +
          "<br />";
        flightDetailsEl.appendChild(timeSpanEl);

        // amenities
        var amenitiesSpanEl = document.createElement("span");
        amenitiesSpanEl.className = "fa";
        amenitiesSpanEl.innerHTML = "&#xf152; &#xf1eb; &#xf5e7;";
        flightDetailsEl.appendChild(amenitiesSpanEl);

        // append flight details to itinerary
        itineraryContainerEl.appendChild(flightDetailsEl);
      }
    }
  }
};
/* -------------------- ENDS METHODS -------------------- */

/* -------------------- BEGINS EVENT HANDLERS -------------------- */
// search form submit event handler
searchFormEl.addEventListener("submit", searchFormHandler);
/* -------------------- ENDS EVENT HANDLERS -------------------- */

/* --------------------------------------------------------------------------------- */
/* ----- CODE BELOW IS NOT PART OF THE APP AND SHOULD BE DELETED BEFORE LAUNCH ----- */
/* --------------------------------------------------------------------------------- */

/* -------------------- BEGINS AMADEUS CREDENTIALS -------------------- */
/* ---------- checks status of access token. expires every 30 minutes ---------- */
/* ----- not related to running of website application. used for testing only ----- */
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

// Calls function to check on status of access token
// accessTokenStatus();
/* -------------------- ENDS AMADEUS CREDENTIALS -------------------- */
