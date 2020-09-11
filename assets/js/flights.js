/* -------------------------------------------------------------------------- */
/* ----------------------------- UCB EXTENSION ------------------------------ */
/* ---------- BLENDED ONLINE | FULL STACK WEB DEVELOPMENT BOOTCAMP ---------- */
/* ------------------ PROJECT 1 GROUP 7 | BOOTCAMP TRAVEL ------------------- */
/* ----------------------- THIS FILE WAS DEVELOPED BY ----------------------- */
/* ----------------------------- AHMAD EL GAMAL ----------------------------- */
/* -------------------------- OTHER GROUP MEMBERS --------------------------- */
/* ------------------- GAUTAM TANKHA & MARCO EVANGELISTA -------------------- */
/* -------------------------------------------------------------------------- */

/*jshint esversion: 6 */

/* -------------------------------------------------------------------------- */
/* ---------- BEGINS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES ----------- */
/* ---------------------------                    --------------------------- */

/* -- declares constants to point to existing html elements in index.html --- */
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
/* ----------- BEGINS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES ---------- */
// this time I'm using querySelector for a change :)
const sortFlightsMenuEl = document.querySelector("#flights-sub-menu");
const sortFlightsByPriceBtn = document.querySelector("#sort-flight-price");
const priceSortingArrow = document.querySelector("#price-sorting-arrow");
const sortFlightsByArrivalBtn = document.querySelector("#sort-flight-arrival");
const arrivalSortingArrow = document.querySelector("#arrival-sorting-arrow");
const sortFlightsByDepartureBtn = document.querySelector(
  "#sort-flight-departure"
);
const departureSortingArrow = document.querySelector(
  "#departure-sorting-arrow"
);

// constants that point to other flight search elements
const searchingMessageEl = document.getElementById("searching-message"); // constant that points to searching message element
const errorMessageEl = document.getElementById("error-message"); // constant that points to error message element
const flightsFavoritesGridEl = document.getElementById("flight-favorites-grid"); // constant that points to flights search history grid
const hotelsFavoritesGridEl = document.getElementById("hotel-favorites-grid"); // constant that points to flights search history grid
const favoriteFlightsBtn = document.getElementById("favorite-flights");
const favoriteHotelsBtn = document.getElementById("favorite-hotels");
const flightsGridEl = document.getElementById("flights-grid"); // constant that points to flights grid

/*  declares variables for user input for "flight offers search" amadeus api  */
var originCode = goingFromEl.value; // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
var destinationCode = goingToEl.value; // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
var departureDate = dateDepartureEl.value; // Format: YYYY-MM-DD
var returnDate = dateReturnEl.value; // Format: YYYY-MM-DD
var numberOfAdults = numberOfAdultsEl.value.charAt(0);
var travelClass = travelClassEl.options[travelClassEl.selectedIndex].value;

const currencyCode = "USD"; // sets currency in fetch request to USD (default in amadeus is euro)

/* -------- declares common constants & variables of amadeus apis url ------- */
const baseUrl = "https://test.api.amadeus.com"; // amadeus for developers testing baseUrl
const flightOffersSearchPath = "/v2/shopping/flight-offers"; // path for flight offers search
const accessTokenPath = "/v1/security/oauth2/token/"; // url for requesting and checking on access token
const accessToken = "hlSepXSfWfhP0fNgkWAYCNk8hAgc"; // access token must be renewed for 30 minutes at a time
const authorizationValue = "Bearer " + accessToken; // `value` of `headers` "Authorization" `key`

/*  declares required query variables for "flight offers search" amadeus api  */
const queryOrigin = "?originLocationCode=";
const queryDestination = "&destinationLocationCode=";
const queryDepartureDate = "&departureDate=";
const queryNumberOfAdults = "&adults=";

/* declares important query variables for "flight offers search" amadeus api  */
const queryReturnDate = "&returnDate="; // required for roundtrip flights
const queryTravelClass = "&travelClass="; // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
const queryCurrency = "&currencyCode="; // default is EUR, so needed for USD

/* ---------------- declares variables for amadeus api urls ----------------- */
var oneWayFlightOffersSearchApiUrl;
var roundTripFlightOffersSearchApiUrl;
var apiUrl;

//declares array to store fetched data from amadeus
var amadeusData = [];
// var elementsObject;

// counters for writing api data to html
var intineraryCounter;
var segmentCounter;

/* ----------------- declares constants for airhex api urls ----------------- */
const airhexHost = "https://content.airhex.com/content/logos/airlines";
const carrierLogoWidth = 70; // requested logo width in pixels
const carrierLogoHeight = 70; // requested logo height in pixels
const carrierLogoType = "s"; // Type of a logo: r - for rectangular, s - for square and t - for tail logo
const carrierLogoFormat = ".png"; // can change to .svg
const queryairhexApi = "?md5apikey=";
const airhexApiKey = "VDjfGgv8mxiTvvLLwGicD6V2eq";

/* ------------------------ declares other variables ------------------------ */
var toggleInterval; // timer for toggling "searching" message
var flightFavoriteCounter = 0; // counter to id flight favorites

/* ---------------------------                    --------------------------- */
/* ----------- ENDS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES ------------ */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* ---------------------------- BEGINS FETCH APIS --------------------------- */
/* ---------------------------                    --------------------------- */

/* --- gets flight search results from "flight offers search" amadeus api --- */
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
      clearInterval(toggleInterval); // stops toggling searching message
      searchingMessageEl.innerHTML =
        "There are " +
        amadeusData.meta.count +
        " flights available for your selected route!"; // displays number of matching search results
      writeData();
    })
    .catch(function (error) {
      clearInterval(toggleInterval); // stops toggling searching message
      searchingMessageEl.textContent = ""; // clears searching message
      errorMessageEl.textContent =
        "There was an error in this search. Please change the dates or cities.";
    });
};

/* --------------- gets airline carrier's logo from airhex api -------------- */
var getCarrierLogo = function (carrierCode) {
  var logoApiUrl =
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
    queryairhexApi +
    airhexApiKey;

  return logoApiUrl;
};

/* ---------------------------                    --------------------------- */
/* ---------------------------- ENDS FETCH APIS ----------------------------- */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* --------------------------- BEGINS LOCALSTORAGE -------------------------- */
/* ---------------------------                    --------------------------- */

/* ------------------ handler for favorite flight buttons ------------------- */
var flightFavoriteHandler = function () {
  var favoriteFlightBtn = event.target.closest(".price-flights");

  if (favoriteFlightBtn.style.backgroundColor !== "rgb(255, 165, 0)") {
    favoriteFlightBtn.style.backgroundColor = "rgb(255, 165, 0)"; // change background color of favorite to orange
    getFavoriteFlightData(favoriteFlightBtn);
    saveFlightFavorite(favoriteFlightBtn);
  } else {
    favoriteFlightBtn.style.backgroundColor = ""; // return background color to default if unselected
    getFavoriteFlightData(favoriteFlightBtn);
    deleteFlightFavorite(favoriteFlightBtn);
  }
};

/* ----------------------- gets favorite flight data ------------------------ */
var getFavoriteFlightData = function (favoriteFlightBtn) {
  // takes out the "flight-xx" class name from the classNames list
  var flightIndex = favoriteFlightBtn.className.split(" ")[0];

  var outboundHTML = document.querySelector("." + flightIndex);
  var priceHTML = favoriteFlightBtn;
  if (document.querySelectorAll("." + flightIndex).length === 3) {
    favoriteObject = {
      flightIndex: flightIndex,
      outbound: outboundHTML.innerHTML,
      inbound: outboundHTML.nextSibling.innerHTML,
      price: priceHTML.innerHTML,
    };
  } else {
    favoriteObject = {
      flightIndex: flightIndex,
      outbound: outboundHTML.innerHTML,
      inbound: "",
      price: priceHTML.innerHTML,
    };
  }
  return favoriteObject;
};
/* ----------------- saves favorite flight to localStorage ------------------ */
var saveFlightFavorite = function (favoriteFlightBtn) {
  // declares an array to be used for localStorage
  var favoriteFlightsLS = [];
  // gets existing favorites from localStorage if it exists
  favoriteFlightsLS = JSON.parse(localStorage.getItem("favoriteFlights"));

  // if there was no favorites, then it is set to current flight favorite
  if (favoriteFlightsLS === null) {
    favoriteFlightsLS = [favoriteObject];
    // otherwise, if there is a favorite, then the current favorite is added on top of the list
  } else {
    for (let i = 0; i < favoriteFlightsLS.length; i++) {
      if (favoriteObject.flightIndex === favoriteFlightsLS[i].flightIndex) {
        favoriteFlightsLS.splice(favoriteFlightsLS[i], 1);
      }
    }
    favoriteFlightsLS.unshift(favoriteObject);
  }

  // limits favorite flights to five
  if (favoriteFlightsLS.length === 6) {
    favoriteFlightsLS.splice(5, 1);
  }

  localStorage.setItem("favoriteFlights", JSON.stringify(favoriteFlightsLS));
};

/* ------- deletes favorite flight from localStorage when unselected -------- */
var deleteFlightFavorite = function (favoriteFlightBtn) {
  // gets existing favorites from localStorage
  var favoriteFlightsLS = JSON.parse(localStorage.getItem("favoriteFlights"));

  for (let i = 0; i < favoriteFlightsLS.length; i++) {
    if (favoriteObject.flightIndex === favoriteFlightsLS[i].flightIndex) {
      favoriteFlightsLS.splice(favoriteFlightsLS[i], 1);
    }
  }

  localStorage.setItem("favoriteFlights", JSON.stringify(favoriteFlightsLS));
};

/* --------- creates favorite flight elements on visit and refresh ---------- */
var createFavoritesElements = function (favoriteFlightsLS) {
  showSearchHistory(); // calls function in script.js to show favorites

  // clears previous favorites
  flightsFavoritesGridEl.innerHTML = "";

  for (let i = 0; i < favoriteFlightsLS.length; i++) {
    // creates container element for each flight search item
    var outboundContainerEl = document.createElement("div");
    outboundContainerEl.classList.add(
      "uk-grid",
      "uk-width-1-1",
      "uk-background-default",
      "uk-border-rounded",
      "margin-zero",
      "uk-margin-small-top"
    );
    outboundContainerEl.innerHTML = favoriteFlightsLS[i].outbound;
    flightsFavoritesGridEl.appendChild(outboundContainerEl);

    var inboundContainerEl = document.createElement("div");
    inboundContainerEl.classList.add(
      "uk-grid",
      "uk-width-1-1",
      "uk-background-default",
      "uk-border-rounded",
      "margin-zero",
      "uk-margin-small-top"
    );
    inboundContainerEl.innerHTML = favoriteFlightsLS[i].inbound;
    flightsFavoritesGridEl.appendChild(inboundContainerEl);

    var priceContainerEl = document.createElement("div");
    priceContainerEl.classList.add(
      "uk-border-rounded",
      "uk-width-1-1",
      "uk-padding-small",
      "uk-margin-small-top",
      "price-flights"
    );
    // priceContainerEl.style.backgroundColor = "rgb(255, 165, 0)";
    // saves flight search favorite to localStorage
    priceContainerEl.innerHTML = favoriteFlightsLS[i].price;
    // priceContainerEl.addEventListener("click", flightFavoriteHandler);
    flightsFavoritesGridEl.appendChild(priceContainerEl);
  }
};

/* ------------ loads flight favorites from data in localStorage ------------ */
var loadFlightsFavorites = function () {
  // get existing search history from localStorage if it exists
  var favoriteFlightsLS = JSON.parse(localStorage.getItem("favoriteFlights"));

  // if there is a search history, the following creates search history elements from data in localStorage
  if (favoriteFlightsLS !== null) {
    createFavoritesElements(favoriteFlightsLS);
  }
};
/* ---------------------------                    --------------------------- */
/* ---------------------------- ENDS LOCALSTORAGE --------------------------- */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* ---------------------------- BEGINS FUNCTIONS ---------------------------- */
/* ---------------------------                    --------------------------- */
/* ------------------------- display/hide functions ------------------------- */
var showFavoriteFlights = function () {
  flightsFavoritesGridEl.style.display = "";
  hotelsFavoritesGridEl.style.display = "none";
};

var showFavoriteHotels = function () {
  flightsFavoritesGridEl.style.display = "none";
  hotelsFavoritesGridEl.style.display = "";
};

var hideFlightSortingMenu = function () {
  if (flightsGridEl.textContent.trim() === "") {
    sortFlightsMenuEl.style.display = "none";
  } else {
    sortFlightsMenuEl.style.display = "";
  }
};

/* --------------------------- search-form handler -------------------------- */
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

/* ------------------- gets current values in search form ------------------- */
var captureSearchForm = function () {
  // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
  originCode = goingFromEl.value.toUpperCase();
  // CURRENTLY AIRPORT CODE. NEED TO CHANGE TO CITY NAME
  destinationCode = goingToEl.value.toUpperCase();
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

/* ---------- saves api url depending on one-way or roundtrip input --------- */
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

/* --------------- displays "searching" message during search --------------- */
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

/* --------------- converts time from fetch to ui time format --------------- */
var convertTime = function (timeToConvert) {
  // first change time to proper format
  var convertedTime = timeToConvert.split("");
  convertedTime = convertedTime.slice(11, 16);

  var minutes = convertedTime.slice(2,5);
  minutes = minutes.join("");

  var hour = convertedTime.slice(0, 2);
  hour = hour.join("");
  hour = parseInt(hour);

  if (hour === 00) {
    hour = 12;
    var timeDesignation = "am";
  } else if (hour < 12) {
    var timeDesignation = "am";
  } else if (hour === 12) {
    var timeDesignation = "pm";
  }
  else {
    hour = hour - 12;
    var timeDesignation = "pm";
  }

  convertedTime = hour + minutes + timeDesignation;
  return convertedTime;
};

/* ---------- converts price from fetch to comma separated format ----------- */
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

/* ------------- gets and writes segment data from Amadeus API -------------- */
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
  carrierLogoEl.setAttribute("loading", "lazy");
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

/* ---------------- writes price data elements to index.html ---------------- */
var writePriceData = function () {
  /* ----- price container ----- */
  var priceContainerEl = document.createElement("div");
  priceContainerEl.classList.add(
    "flight-" + flightCounter, // used to store favorites in localStorage
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
  saveEl.innerHTML = "Favorite";
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
  priceContainerEl.addEventListener("click", flightFavoriteHandler);
};

/* ------ writes data from "flight offers search" amadeus api to html ------- */
var writeData = function (data) {
  // sortAmadeusData = amadeusData.data;

  // shows flights sorting menu
  sortFlightsMenuEl.style.display = "";

  // dictionary of codes. used to convert codes to full names
  var carriersCodeList = amadeusData.dictionaries.carriers;
  var locationsCityCodeList = amadeusData.dictionaries.locations;

  // number of flights available matching user input
  var flightCount = amadeusData.meta.count;

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
        "flight-" + flightCounter,
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

/* ------------------- changes direction of sorting arrow ------------------- */
var changeArrowDirection = function (arrowDirection) {
  if (arrowDirection.textContent.trim() === "↑") {
    arrowDirection.textContent = "↓";
  } else {
    arrowDirection.textContent = "↑";
  }
};

/* ------- removes sorting arrows from two other sorting buttons ------------ */
var removeOtherArrows = function (arrowOne, arrowTwo) {
  arrowOne.textContent = "";
  arrowTwo.textContent = "";
};

/* -------------------- sorts search results by price ----------------------- */
var sortByPrice = function () {
  changeArrowDirection(priceSortingArrow);
  removeOtherArrows(arrivalSortingArrow, departureSortingArrow);

  // for (let i = 0; i < amadeusData.data.length; i++) {
  //   amadeusData.data[i].price.sort(function (a, b) {
  //     return a.price.grandTotal - b.price.grandTotal;
  //   });
  // }

  // console.log(amadeusData);
};

/* ----------- sorts search results according to arrival time --------------- */
var sortByArrival = function () {
  changeArrowDirection(arrivalSortingArrow);
  removeOtherArrows(priceSortingArrow, departureSortingArrow);
};
/* ---------- sorts search results according to departure time -------------- */
/* -------- triggers sorting of search results according to price ----------- */
var sortByDeparture = function () {
  changeArrowDirection(departureSortingArrow);
  removeOtherArrows(priceSortingArrow, arrivalSortingArrow);
};
/* -----------------                                        ----------------- */
/* ----------------------------- ENDS FUNCTIONS ----------------------------- */
/* -------------------------------------------------------------------------- */

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
flightsTabEl.addEventListener("click", hideFlightSortingMenu);
favoritesTabEl.addEventListener("click", loadFlightsFavorites);
favoriteFlightsBtn.addEventListener("click", showFavoriteFlights);
favoriteHotelsBtn.addEventListener("click", showFavoriteHotels);

sortFlightsByPriceBtn.addEventListener("click", sortByPrice); // sorts search results by price
sortFlightsByArrivalBtn.addEventListener("click", sortByArrival); // sorts search results by Arrival Time
sortFlightsByDepartureBtn.addEventListener("click", sortByDeparture); // sorts search results by Departure Time
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
      console.log(error);
    });
};

// UNCOMMENT function below to check on status of access token
// accessTokenStatus();
/* ---------------------------                                        --------------------------- */
/* ------------------------------------- ENDS TESTING CODE -------------------------------------- */
/* ---------------------------------------------------------------------------------------------- */
