/* ---------------------------------------------------------------------------------------------- */
/* --------------------------------------- UCB EXTENSION ---------------------------------------- */
/* -------------------- BLENDED ONLINE | FULL STACK WEB DEVELOPMENT BOOTCAMP -------------------- */
/* ---------------------------- PROJECT 1 GROUP 7 | BOOTCAMP TRAVEL ----------------------------- */
/* --------------------------------- THIS FILE WAS DEVELOPED BY --------------------------------- */
/* --------------------------------------- AHMAD EL GAMAL --------------------------------------- */
/* ------------------------------------ OTHER GROUP MEMBERS ------------------------------------- */
/* ----------------------------- GAUTAM TANKHA & MARCO EVANGELISTA ------------------------------ */
/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */
/* --------------------- BEGINS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES -------------------- */
/* ---------------------------                                        --------------------------- */

/* ------------ declares constants to point to existing html elements in index.html ------------- */
// constants that point to search form
const flightsTabEl = document.getElementById("flights-tab");
const favoritesTabEl = document.getElementById("favorites-tab");
const searchFormEl = document.getElementById("form");
const goingFromEl = document.getElementById("going-from");
const goingToEl = document.getElementById("going-to");
const dateDepartureEl = document.getElementById("date-departure");
const dateReturnEl = document.getElementById("date-return");
const tripSelectEl = document.getElementById("trip"); // One-way or Roundtrip
const travelClassEl = document.getElementById("travel-class"); // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
const numberOfAdultsEl = document.getElementById("guests-select");

// constants that point to sorting flight search elements
// this time I'm using querySelector for a change :)
const sortFlightsByPriceEl = document.querySelector("#sort-flight-price");
const sortFlightsByHighestPriceEl = document.querySelector(
  "#highest-flight-price"
);
const sortFlightsByLowestPriceEl = document.querySelector(
  "#lowest-flight-price"
);

// constants that point to other flight search elements
const searchingMessageEl = document.getElementById("searching-message"); // constant that points to searching message element
const errorMessageEl = document.getElementById("error-message"); // constant that points to error message element
const flightsPastSearchGridEl = document.getElementById("past-search-grid"); // constant that points to flights search history grid
const favoriteFlightsBtn = document.getElementById("favorite-flights");
const favoriteHotelsBtn = document.getElementById("favorite-hotels");
const flightsGridEl = document.getElementById("flights-grid"); // constant that points to flights grid

// variables that point to favorite items
var favoriteFlights = document.getElementsByClassName("flight");
var favoriteHotels = document.getElementsByClassName("hotel");

/* ---------- declares variables for user input for "flight offers search" amadeus api ---------- */
var originCode = goingFromEl.value; // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
var destinationCode = goingToEl.value; // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
var departureDate = dateDepartureEl.value; // Format: YYYY-MM-DD
var returnDate = dateReturnEl.value; // Format: YYYY-MM-DD
var numberOfAdults = numberOfAdultsEl.value.charAt(0);
var travelClass = travelClassEl.options[travelClassEl.selectedIndex].value;

const currencyCode = "USD"; // sets currency in fetch request to USD (default in amadeus is euro)

/* ------------------ declares common constants & variables of amadeus apis url ----------------- */
const baseUrl = "https://test.api.amadeus.com"; // amadeus for developers testing baseUrl
const flightOffersSearchPath = "/v2/shopping/flight-offers"; // path for flight offers search
const accessTokenPath = "/v1/security/oauth2/token/"; // url for requesting and checking on access token
const accessToken = "i7TbLLOe7oZC2sjUPFWiA9URN2oW"; // access token must be renewed for 30 minutes at a time
const authorizationValue = "Bearer " + accessToken; // `value` of `headers` "Authorization" `key`

/* ---------- declares required query variables for "flight offers search" amadeus api ---------- */
const queryOrigin = "?originLocationCode=";
const queryDestination = "&destinationLocationCode=";
const queryDepartureDate = "&departureDate=";
const queryNumberOfAdults = "&adults=";

/* --------- declares important query variables for "flight offers search" amadeus api ---------- */
const queryReturnDate = "&returnDate="; // required for roundtrip flights
const queryTravelClass = "&travelClass="; // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
const queryCurrency = "&currencyCode="; // default is EUR, so needed for USD

/* ---------- declares optional query variables for "flight offers search" amadeus api ---------- */
const queryChildren = "&children="; // for travelers between 2 and 12 on date of departure with own separate seat
const queryInfants = "&infants="; // for travelers 2 or less on date of departure. infants sit on lap of adult (# of infants must not exceed # of adults)
const nonStop = "&nonStop="; // boolean
const maxPrice = "&maxPrice="; // max price per traveler. no decimals
const max = "&max="; // maximum number of flight options (default is 250)
const includedAirlineCodes = "&includedAirlineCodes="; // multiple airlines allowed, separate with comma (no spaces). cannot be combined with excludedAirlineCodes
const excludedAirlineCodes = "&excludedAirlineCodes="; // multiple airlines allowed, separate with comma (no spaces). cannot be combined with includedAirlineCodes

/* -------------------------- declares variables for amadeus api urls --------------------------- */
var oneWayFlightOffersSearchApiUrl;
var roundTripFlightOffersSearchApiUrl;
var apiUrl;

//declares array to store fetched data from amadeus
var amadeusData = [];

// counters for writing api data to html
var intineraryCounter;
var segmentCounter;
var travelerCounter;

/* --------------------------- declares constants for airhex api urls --------------------------- */
const airhexHost = "https://content.airhex.com/content/logos/airlines";
const carrierLogoWidth = 70; // requested logo width in pixels
const carrierLogoHeight = 70; // requested logo height in pixels
const carrierLogoType = "s"; // Type of a logo: r - for rectangular, s - for square and t - for tail logo
const carrierLogoFormat = ".png"; // can change to .svg
const carrierLogoProportions = "?proportions=keep"; // keeps proportions of logo image
const queryairhexApi = "?md5apikey=";
const airhexApiKey = "VDjfGgv8mxiTvvLLwGicD6V2eq";

/* ---------------------------------- declares other variables ---------------------------------- */
var toggleInterval; // timer for toggling "searching" message
var flightFavoriteCounter = 0; // counter to id flight favorites

/* ---------------------------                                        --------------------------- */
/* --------------------- ENDS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES ---------------------- */
/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */
/* -------------------------------------- BEGINS FETCH APIS ------------------------------------- */
/* ---------------------------                                        --------------------------- */

/* ------------- gets flight search results from "flight offers search" amadeus api ------------- */
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
      amadeusData = data;
      // console.log(amadeusData);
      writeData();
    })
    .catch(function (error) {
      clearInterval(toggleInterval); // stops toggling searching message
      searchingMessageEl.textContent = ""; // clears searching message
      errorMessageEl.textContent =
        "There was an error in this search. Please change the dates or cities.";
    });
};

/* ------------------------- gets airline carrier's logo from airhex api ------------------------ */
var getCarrierLogo = function (carrierCode) {
  logoApiUrl =
    airhexHost +
    "_" +
    carrierCode +
    "_" +
    carrierLogoWidth +
    "_" +
    carrierLogoHeight +
    "_" +
    carrierLogoType +
    carrierLogoFormat +
    // carrierLogoProportions +
    queryairhexApi +
    airhexApiKey;

  return logoApiUrl;
};

/* ---------------------------                                        --------------------------- */
/* -------------------------------------- ENDS FETCH APIS --------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- BEGINS LOCALSTORAGE ------------------------------------ */
/* ---------------------------                                        --------------------------- */

/* ------------------------ saves search-form user-input to localStorage ------------------------ */
var saveFlightFavorite = function () {
  // get today's date (date of search)
  var searchDate = new Date();
  // converts it into ui design format
  var dd = String(searchDate.getDate()).padStart(2, "0");
  var mm = String(searchDate.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = searchDate.getFullYear();
  searchDate = mm + "/" + dd + "/" + yyyy;

  // declares an object to hold user input into flight search form
  var currentFlightSearch = {
    dateOfSearch: searchDate,
    from: originCode,
    to: destinationCode,
    travelClass: travelClass,
    numberOfAdults: numberOfAdults,
    departs: departureDate,
    returns: returnDate,
  };

  // declares an array to be used for localStorage
  var flightSearchLS = [];
  // get existing search history from localStorage if it exists
  flightSearchLS = JSON.parse(localStorage.getItem("flightSearchHistory"));

  // if there was no search history, then it is set to current flight search
  if (flightSearchLS === null) {
    flightSearchLS = [currentFlightSearch];
    // otherwise, if there is a search history, then the current search is added on top of the list
  } else {
    flightSearchLS.unshift(currentFlightSearch);
  }

  // limits search history to five searches
  if (flightSearchLS.length === 6) {
    flightSearchLS.splice(5, 1);
  }

  localStorage.setItem("flightSearchHistory", JSON.stringify(flightSearchLS));
};

/* -------------------- creates search history elements on visit and refresh -------------------- */
var createFavoritesElements = function (flightSearchLS) {
  showSearchHistory(); // calls function in script.js to show favorites

  // clears previous favorites
  flightsPastSearchGridEl.innerHTML = "";

  for (let i = 0; i < flightSearchLS.length; i++) {
    // creates container element for each flight search item
    var flightSearchHistoryContainerEl = document.createElement("div");
    flightSearchHistoryContainerEl.classList.add(
      "flight",
      "uk-grid",
      "uk-width-1-1",
      "uk-background-default",
      "uk-border-rounded",
      "test-border",
      "margin-zero"
    );
    flightSearchHistoryContainerEl.id =
      "flight-favorite-" + flightFavoriteCounter;
    flightsPastSearchGridEl.appendChild(flightSearchHistoryContainerEl);

    // creates container element for left column
    var flightSearchHistoryEl = document.createElement("div");
    flightSearchHistoryEl.classList.add(
      "uk-width-1-2",
      "uk-padding-remove-horizontal"
    );
    flightSearchHistoryContainerEl.appendChild(flightSearchHistoryEl);

    var searchedOnEl = document.createElement("p");
    searchedOnEl.innerHTML = "Searched on " + flightSearchLS[i].dateOfSearch;
    flightSearchHistoryEl.appendChild(searchedOnEl);

    var routeEl = document.createElement("h4");
    routeEl.innerHTML =
      "<span class='fa'>" +
      flightSearchLS[i].from +
      " &#xf072; " +
      flightSearchLS[i].to +
      "</span>";
    flightSearchHistoryEl.appendChild(routeEl);

    var tripDateEl = document.createElement("p");
    tripDateEl.className = "fa";
    if (flightSearchLS[i].returns === "") {
      tripDateEl.innerHTML = "&#xf783; " + flightSearchLS[i].departs + "<br />";
    } else {
      tripDateEl.innerHTML =
        "&#xf783; " +
        flightSearchLS[i].departs +
        "<br />" +
        "&#xf783; " +
        flightSearchLS[i].returns;
    }
    flightSearchHistoryEl.appendChild(tripDateEl);

    // creates container element for right-column
    var flightIconContainerEl = document.createElement("div");
    flightIconContainerEl.classList.add(
      "uk-border-rounded",
      "uk-width-1-2",
      "uk-padding-small",
      "price"
    );
    flightSearchHistoryContainerEl.appendChild(flightIconContainerEl);

    var flightIconEl = document.createElement("h3");
    flightIconEl.classList.add(
      "uk-margin-remove-vertical",
      "uk-text-center",
      "fa"
    );
    if (flightSearchLS[i].returns === "") {
      flightIconEl.innerHTML = "&#xf072;<br />One-way";
    } else {
      flightIconEl.innerHTML = "&#xf072;<br />Roundtrip";
    }
    flightIconContainerEl.appendChild(flightIconEl);
  }
};

/* ---------------------- loads flight favorites from data in localStorage ---------------------- */
var loadFlightsFavorites = function () {
  // get existing search history from localStorage if it exists
  var flightSearchLS = JSON.parse(localStorage.getItem("flightSearchHistory"));

  // if there is a search history, the following creates search history elements from data in localStorage
  if (flightSearchLS !== null) {
    createFavoritesElements(flightSearchLS);
  }
};
/* ---------------------------                                        --------------------------- */
/* -------------------------------------- ENDS LOCALSTORAGE ------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */
/* -------------------------------------- BEGINS FUNCTIONS -------------------------------------- */
/* ---------------------------                                        --------------------------- */
/* ----------------------------------- display/hide functions ----------------------------------- */
var showFavoriteFlights = function () {
  if (favoriteFlights !== null) {
    for (let i = 0; i < favoriteFlights.length; i++) {
      favoriteFlights[i].style.display = "";
    }
  }
  if (favoriteHotels !== null) {
    for (let i = 0; i < favoriteHotels.length; i++) {
      favoriteHotels[i].style.display = "none";
    }
  }
};

var showFavoriteHotels = function () {
  if (favoriteFlights !== null) {
    for (let i = 0; i < favoriteFlights.length; i++) {
      favoriteFlights[i].style.display = "none";
    }
  }
  if (favoriteHotels !== null) {
    for (let i = 0; i < favoriteHotels.length; i++) {
      favoriteHotels[i].style.display = "";
    }
  }
};

/* ------------------------------------- search-form handler ------------------------------------ */
var searchFormHandler = function () {
  if (flightsTabEl.className === "uk-active") {
    // prevents the search-form submit from triggering a refresh of index.html
    event.preventDefault();

    captureSearchForm();
    // clears previous fetch from memory;
    amadeusData = [];
    // calls function in script.js to display id=flights-container (overall flights container)
    showFlights();
    // informs user that search is running
    searchingMessage();
    // clears data from previous search
    flightsGridEl.innerHTML = "";
    // clears error message from previous search
    errorMessageEl.textContent = "";
    saveUrl();
    getFlightOffersSearch();
  }
};

/* ----------------------------- gets current values in search form ----------------------------- */
var captureSearchForm = function () {
  // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
  originCode = goingFromEl.value;
  // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
  destinationCode = goingToEl.value;
  departureDate = dateDepartureEl.value;
  // checks if user selects roundtrip or one-way
  if (tripSelectEl.options[tripSelectEl.selectedIndex].value === "Roundtrip") {
    returnDate = dateReturnEl.value;
  } else {
    returnDate = "";
  }
  numberOfAdults = numberOfAdultsEl.value.charAt(0);
  // if no class is selected, then "economy" is selected as default
  travelClass = travelClassEl.options[travelClassEl.selectedIndex].value;
  if (travelClass === "") {
    travelClass = "ECONOMY";
  }
};

/* -------------------- saves api url depending on one-way or roundtrip input ------------------- */
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
    queryTravelClass +
    travelClass +
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

/* ------------------------- displays "searching" message during search ------------------------- */
var searchingMessage = function () {
  toggleInterval = setInterval(toggleMessage, 500);

  let i = 0;

  function toggleMessage() {
    if (i % 4 === 0) {
      searchingMessageEl.innerHTML = "Searching";
    } else if (i % 4 === 1) {
      searchingMessageEl.innerHTML = "Searching.";
    } else if (i % 4 === 2) {
      searchingMessageEl.innerHTML = "Searching..";
    } else if (i % 4 === 3) {
      searchingMessageEl.innerHTML = "Searching...";
    }
    i++;
  }
};

/* ------------------------- converts time from fetch to ui time format ------------------------- */
var convertTime = function (timeToConvert) {
  // first change time to proper format
  var convertedTime = timeToConvert.split("");
  convertedTime.splice(0, 11);
  convertedTime.splice(5, 3);

  var timeDesignation;

  // then add am or pm and change the numbers accordingly (for example, 18 become 6pm)
  // if 0x:xx, it's am
  if (convertedTime[0] === 0) {
    timeDesignation = "am";
    // if 00:xx, it's 12:xxam
    if (convertedTime[1] === 0) {
      convertedTime[0] = "1";
      convertedTime[1] = "2";
    }
    // if 10:xx or 11:xx, it's am
  } else if (convertedTime[0] == 1 && convertedTime[1] < 2) {
    timeDesignation = "am";
    // if 12:xx, it's 12:xxpm
  } else if (convertedTime[0] == 1 && convertedTime[1] == 2) {
    timeDesignation = "pm";
    // if 1x:xx (other than 10, 11, or 12) or 2x:xx, it's pm
  } else {
    timeDesignation = "pm";
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

  if (convertedTime[0] === 0) {
    convertedTime.splice(0, 1);
  }

  convertedTime = convertedTime.join("");

  convertedTime = convertedTime.concat(timeDesignation);
  // return converted time
  return convertedTime;
};

/* -------------------- converts price from fetch to comma separated format --------------------- */
var convertPrice = function (priceToConvert) {
  if (typeof priceToConvert !== "string") {
    var stringPrice = priceToConvert.toFixed(2);
  } else {
    var stringPrice = priceToConvert;
  }
  var convertedPrice = stringPrice.split("");
  if (convertedPrice.length > 6) {
    convertedPrice.splice(convertedPrice.length - 6, 0, ",");
    convertedPrice = convertedPrice.join("");
  } else {
    convertedPrice = stringPrice;
  }
  return convertedPrice;
};

/* -------------------- gets and writes segment data from Amadeus API --------------------- */
var writeSegmentData = function (
  itineraryContainerEl,
  segmentCount,
  carriersCodeList,
  locationsCityCodeList
) {
  /* ----- creates segment container in index.html ----- */
  var segmentContainerEl = document.createElement("div");
  segmentContainerEl.classList.add(
    "uk-width-1-2",
    "uk-padding-remove-horizontal"
  );
  itineraryContainerEl.appendChild(segmentContainerEl);

  /* ----- carrier (ariline) name ----- */
  var carrierCode =
    amadeusData.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].carrierCode;
  var carrierFull = carriersCodeList[carrierCode];
  var carrierFullEl = document.createElement("h4");
  carrierFullEl.className = "black-ops";
  carrierFullEl.textContent = carrierFull;
  segmentContainerEl.appendChild(carrierFullEl);

  /* ----- carrier (ariline) logo ----- */
  var carrierLogoEl = document.createElement("img");
  carrierLogoEl.className = "frame";
  carrierLogoEl.alt = "airline logo";
  carrierLogoEl.style.width = "70";
  carrierLogoEl.style.height = "70";
  carrierLogoEl.src = getCarrierLogo(carrierCode); // gets carrier logo from airhex api
  segmentContainerEl.appendChild(carrierLogoEl);

  /* ----- flight details container ----- */
  var flightDetailsEl = document.createElement("p");
  // appends flight details to itinerary
  segmentContainerEl.appendChild(flightDetailsEl);

  // city data
  // NEED TO DECLARE departureCityFull & arrivalCityFulls
  var citySpanEl = document.createElement("span");
  // citySpanEl.innerHTML = departureCityFull + " to " + arrivalCityFull + "<br />";
  citySpanEl.innerHTML = "Test City 1" + " to " + "Test City 2" + "<br />";
  flightDetailsEl.appendChild(citySpanEl);

  // airport data
  var departureCityCode =
    amadeusData.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].departure.iataCode;
  var arrivalCityCode =
    amadeusData.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].arrival.iataCode;
  var airportSpanEl = document.createElement("span");
  airportSpanEl.classList.add("fa", "stronger", "margin-small-left");
  airportSpanEl.innerHTML = departureCityCode + " &#xf072; " + arrivalCityCode;
  flightDetailsEl.appendChild(airportSpanEl);

  // departure and arrival times
  var departureTime =
    amadeusData.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].departure.at;
  var arrivalTime =
    amadeusData.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].arrival.at;
  var timeSpanEl = document.createElement("span");
  timeSpanEl.innerHTML =
    "<br />" +
    convertTime(departureTime) +
    " to " +
    convertTime(arrivalTime) +
    "<br />";
  flightDetailsEl.appendChild(timeSpanEl);

  /* ----- flight number ----- */
  var flightNumber =
    amadeusData.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].number;
  var flightNumberEl = document.createElement("span");
  flightNumberEl.className = "black-ops";
  flightNumberEl.innerHTML = "<br /> Flight #: " + flightNumber + "<br />";
  flightDetailsEl.appendChild(flightNumberEl);
};

/* ----------------------- writes price data elements to index.html ------------------------ */
var writePriceData = function () {
  /* ----- price container ----- */
  var priceContainerEl = document.createElement("div");
  priceContainerEl.classList.add(
    "uk-border-rounded",
    "uk-width-1-1",
    "uk-padding-small",
    "uk-margin-small-top",
    "price-flights"
  );
  flightsGridEl.appendChild(priceContainerEl);

  // more details
  var saveEl = document.createElement("span");
  saveEl.classList.add("black-ops", "stronger", "uk-text-emphasis");
  saveEl.innerHTML = "Save to Favorites";
  priceContainerEl.appendChild(saveEl);

  var grandTotalPrice = amadeusData.data[flightCounter].price.grandTotal;
  var priceEl = document.createElement("h2");
  priceEl.classList.add("uk-margin-remove-vertical", "black-ops");
  priceEl.innerHTML = "$" + convertPrice(grandTotalPrice);
  priceContainerEl.appendChild(priceEl);

  // creates button for each element to click on to save flight search favorite
  var saveBtn = document.createElement("button");
  saveBtn.classList.add(
    "uk-button",
    "uk-button-large",
    "uk-button-primary",
    "uk-border-rounded",
    "uk-padding-remove-vertical",
    "xs-size-button",
    "hide"
  );
  saveBtn.innerHTML = "Select";
  priceContainerEl.appendChild(saveBtn);

  // saves flight search favorite to localStorage
  priceContainerEl.addEventListener("click", saveFlightFavorite);
};

/* ---------------- writes data from "flight offers search" amadeus api to html ----------------- */
var writeData = function (data) {
  // sortAmadeusData = amadeusData.data;
  // console.log(sortAmadeusData.sort(compare));

  // dictionary of codes. used to convert codes to full names
  var carriersCodeList = amadeusData.dictionaries.carriers;
  var locationsCityCodeList = amadeusData.dictionaries.locations;

  // number of flights available matching user input
  var flightCount = amadeusData.meta.count;

  clearInterval(toggleInterval); // stops toggling searching message
  searchingMessageEl.innerHTML =
    "There are " + flightCount + " flights available for your selected route!"; // displays number of matching search results

  // each flight (trip) details
  for (flightCounter = 0; flightCounter < flightCount; flightCounter++) {
    // gets number of itineraries (usually 1 for outbound and 1 for inbound)
    var intineraryCount = amadeusData.data[flightCounter].itineraries.length;

    // loops through number of itineraries to create a container element for each
    for (
      intineraryCounter = 0;
      intineraryCounter < intineraryCount;
      intineraryCounter++
    ) {
      var itineraryContainerEl = document.createElement("div");
      itineraryContainerEl.classList.add(
        "uk-grid",
        "uk-width-1-1",
        "uk-background-default",
        "uk-border-rounded",
        "margin-zero",
        "uk-margin-small-top"
      );
      flightsGridEl.appendChild(itineraryContainerEl);

      // number of segments for each itinerary. it is also "number of stops".
      var segmentCount =
        amadeusData.data[flightCounter].itineraries[intineraryCounter].segments
          .length;

      /* ----- allocates data from fetch into variables ----- */
      for (
        segmentCounter = 0;
        segmentCounter < segmentCount;
        segmentCounter++
      ) {
        writeSegmentData(
          itineraryContainerEl,
          segmentCount,
          carriersCodeList,
          locationsCityCodeList
        );
      }
    }
    writePriceData();
  }
};

/* ------------------------- sorts search results according to price ---------------------------- */
function compare(a, b) {
  // if (sortFlightsByLowestPriceEl.className === "active") {

  const priceA = a.price.grandTotal;
  const priceB = b.price.grandTotal;

  let comparison = 0;
  if (priceA > priceB) {
    comparison = 1;
  } else if (priceA < priceB) {
    comparison = -1;
  }

  return comparison * -1;
  // }
}

/* --------------------- sorts search results according to arrival time ------------------------- */
// NOT DONE YET

/* -------------------- sorts search results according to departure time ------------------------ */
// NOT DONE YET

/* ---------------------------                                        --------------------------- */
/* --------------------------------------- ENDS FUNCTIONS --------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------- BEGINS LOAD EVENTS ------------------------------------- */
/* ---------------------------                                        --------------------------- */
loadFlightsFavorites();

/* ---------------------------                                        --------------------------- */
/* -------------------------------------- ENDS LOAD EVENTS -------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------ BEGINS EVENT HANDLERS ----------------------------------- */
/* ---------------------------                                        --------------------------- */
searchFormEl.addEventListener("submit", searchFormHandler);
favoritesTabEl.addEventListener("click", loadFlightsFavorites);
favoriteFlightsBtn.addEventListener("click", showFavoriteFlights);
favoriteHotelsBtn.addEventListener("click", showFavoriteHotels);
// sorts search results by price
// sortFlightsByPriceEl.addEventListener("onchange")
/* ---------------------------                                        --------------------------- */
/* ------------------------------------ ENDS EVENT HANDLERS ------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */
/* ------------------------------------ BEGINS TESTING CODE ------------------------------------- */
/* ---------------------------                                        --------------------------- */
/*  CODE BELOW IS NOT PART OF THE APP. IT IS ONLY USED FOR TESTING PURPOSES   */
/* -------------------------- begins amadeus credentials status check --------------------------- */

// checks status of access token. expires every 30 minutes
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

// UNCOMMENT function below to check on status of access token
// accessTokenStatus();
/* ---------------------------                                        --------------------------- */
/* ------------------------------------- ENDS TESTING CODE -------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */
