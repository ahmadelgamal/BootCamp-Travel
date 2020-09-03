// DECLARE GLOBAL VARIABLES
var flightsListEl = document.getElementById("flights-list");
var flightCountEl = document.getElementById("flight-count");

// gets "flight offers search" amadeus api
var getFlightOffersSearch = function () {
  // HARDCODING. MUST BE CHANGED TO USER INPUT
  var originCode = "CDG";
  var destinationCode = "LAX";
  var departureDate = "2020-10-10";
  var numberOfAdults = "1";
  var currencyCode = "USD";

  // amadeus variables
  var host = "https://test.api.amadeus.com/";
  var flightOffersSearchPath = "v2/shopping/flight-offers";
  var queryOrigin = "?originLocationCode=";
  var queryDestination = "&destinationLocationCode=";
  var queryDepartureDate = "&departureDate=";
  var queryNumberOfAdults = "&adults=";
  var queryCurrency = "&currencyCode=";

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
    numberOfAdults +
    queryCurrency +
    currencyCode;

  // access token must be renewed for 30 minutes at a time
  var accessToken = "b44xfsgmZPwWe0lQYyJUOdYt03i1";
  var authorizationValue = "Bearer " + accessToken;

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
    });
};

getFlightOffersSearch();

// write first 20 flight options
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
    // vital details
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

    // hidden details
    var currencyFull = currenciesCodeList[currencyCode];
    var aircraftCode = data.data[i].itineraries[0].segments[0].aircraft.code;
    var carrierCode = data.data[i].itineraries[0].segments[0].carrierCode;

    // additional details
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

    // combine above data
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
