// to avoid getting validation error for using `const` declarations
/*jshint esversion: 6 */

/* ---------- BEGINS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES ----------- */
/* -- declares constants to point to existing html elements in index.html --- */
// constants that point to search form
const flightsTabEl = document.getElementById("flights-tab");
const searchFormEl = document.getElementById("form");
const goingFromEl = document.getElementById("going-from");
const goingToEl = document.getElementById("going-to");
const dateDepartureEl = document.getElementById("date-departure");
const dateReturnEl = document.getElementById("date-return");
const tripSelectEl = document.getElementById("trip"); // One-way or Roundtrip
const travelClassEl = document.getElementById("travel-class"); // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
const numberOfAdultsEl = document.getElementById("guests-select");

const favoritesBtn = document.getElementById("favorites-btn");
// constants that point to flight sorting elements
const sortFlightsMenuEl = document.querySelector("#flights-sub-menu");
const sortFlightsByPriceBtn = document.querySelector("#sort-flight-price");
const sortFlightsByArrivalBtn = document.querySelector("#sort-flight-arrival");
const sortFlightsByDepartureBtn = document.querySelector(
  "#sort-flight-departure"
);
const priceSortingArrow = document.querySelector("#price-sorting-arrow");
const arrivalSortingArrow = document.querySelector("#arrival-sorting-arrow");
const departureSortingArrow = document.querySelector(
  "#departure-sorting-arrow"
);

// constants that point to other flight search elements
const searchingMessageEl = document.getElementById("searching-message"); // constant that points to searching message element
const errorMessageEl = document.getElementById("error-message"); // constant that points to error message element
const flightsGridEl = document.getElementById("flights-grid"); // constant that points to flights grid
const flightsFavoritesGridEl = document.getElementById("flight-favorites-grid"); // constant that points to flights search history grid
const hotelsFavoritesGridEl = document.getElementById("hotel-favorites-grid"); // constant that points to flights search history grid
const favoriteFlightsBtn = document.getElementById("favorite-flights");
const favoriteHotelsBtn = document.getElementById("favorite-hotels");

/*  declares variables for user input for "flight offers search" amadeus api  */
var originCode;
var destinationCode;
var departureDate = dateDepartureEl.value; // Format: YYYY-MM-DD
var returnDate = dateReturnEl.value; // Format: YYYY-MM-DD
var numberOfAdults = numberOfAdultsEl.value.charAt(0);
var travelClass = travelClassEl.options[travelClassEl.selectedIndex].value;

const currencyCode = "USD"; // sets currency in fetch request to USD (default in amadeus is euro)

/* -------- declares common constants & variables of amadeus apis url ------- */
const baseUrl = "https://test.api.amadeus.com"; // amadeus for developers testing baseUrl
const flightOffersSearchPath = "/v2/shopping/flight-offers"; // path for flight offers search
const accessTokenPath = "/v1/security/oauth2/token/"; // url for requesting and checking on access token
const accessToken = "2q0GEyyXigKheoYgJfuEy1eQa85N"; // access token must be renewed for 30 minutes at a time
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

/* ---------------- declares constants for daisycon api urls ---------------- */
const daisyconHost = "https://daisycon.io/images/airline/?";
const carrierLogoWidth = "width=300"; // requested logo width in pixels
const carrierLogoHeight = "height=150"; // requested logo height in pixels
const backgroundColor = "color=ffffff"; // Type of a logo: r - for rectangular, s - for square and t - for tail logo
const queryIata = "&iata="; // can change to .svg

// /* ----------------- declares constants for airhex api urls ----------------- */
// const airhexHost = "https://content.airhex.com/content/logos/airlines";
// const carrierLogoWidth = 70; // requested logo width in pixels
// const carrierLogoHeight = 70; // requested logo height in pixels
// const carrierLogoType = "s"; // Type of a logo: r - for rectangular, s - for square and t - for tail logo
// const carrierLogoFormat = ".png"; // can change to .svg
// const queryairhexApi = "?md5apikey=";
// const airhexApiKey = "VDjfGgv8mxiTvvLLwGicD6V2eq";

/* ------------------------ declares other variables ------------------------ */
var amadeusData = []; //declares array to store copy of fetched data from amadeus
var toggleInterval; // timer for toggling "searching" message
/* ----------- ENDS DECLARATIONS OF GLOBAL CONSTANTS & VARIABLES ------------ */

/* ------------------------ BEGINS HANDLER FUNCTIONS ------------------------ */
/* --------------------------- search-form handler -------------------------- */
var searchFormHandler = function (event) {
  if (flightsTabEl.className === "uk-active") {
    event.preventDefault(); // prevents the search-form submit from triggering a refresh of index.html
    collectSearchForm();
    amadeusData = []; // clears previous fetch from memory;
    showFlights(); // calls function in script.js to display id=flights-container (overall flights container)
    searchingMessage(); // informs user that search is running
    errorMessageEl.textContent = ""; // clears error message from previous search
    saveUrl();
    fetchFlightOffersSearch();
  }
};

/* ------------------------ handler for flights tab ------------------------- */
var flightsTabHandler = function () {
  if (flightsGridEl.textContent.trim() === "") {
    sortFlightsMenuEl.style.display = "none";
  } else {
    sortFlightsMenuEl.style.display = "";
  }
};

/* ----------- handler for favorites button on top of search form ----------- */
var favoritesBtnHandler = function (event) {
  var favoriteFlightsLS = getFavoriteFlightsLS();

  // if it's not empty, then create favorites elements from data in localStorage
  if (favoriteFlightsLS !== null) {
    createFavoriteFlightsElements(favoriteFlightsLS);
  }
};

/* ------------- handler for show favorite flights only button -------------- */
var favoriteFlightsBtnHandler = function () {
  flightsFavoritesGridEl.style.display = "";
  hotelsFavoritesGridEl.style.display = "none";
};

/* -------------- handler for show favorite hotels only button -------------- */
var favoriteHotelsBtnHandler = function () {
  flightsFavoritesGridEl.style.display = "none";
  hotelsFavoritesGridEl.style.display = "";
};

/* -------- handler for favorite flight buttons in flights grid ------------- */
var addFavoriteFlightHandler = function (event) {
  var favoriteFlightBtn = event.target.closest(".price-flights");

  var favoriteFlightObject = collectFavoriteFlightData(favoriteFlightBtn);

  if (favoriteFlightBtn.style.backgroundColor !== "rgb(255, 165, 0)") {
    favoriteFlightBtn.style.backgroundColor = "rgb(255, 165, 0)"; // changes background color of favorite to orange
    setFavoriteFlightsLS(favoriteFlightObject);
  } else {
    favoriteFlightBtn.style.backgroundColor = ""; // returns background color to default if unselected
    deleteFavoriteFlightsLS(favoriteFlightObject);
  }
};

/* --------- handler for favorite flight buttons in favorites grid ---------- */
var deleteFavoriteFlightHandler = function (event) {
  var favoriteFlightBtn = event.target.closest(".price-flights");
  favoriteFlightBtn.style.backgroundColor = "rgb(255, 0, 0)"; // turns background color to red
  setTimeout(function () {
    var favoriteFlightObject = collectFavoriteFlightData(favoriteFlightBtn);
    deleteFavoriteFlightsLS(favoriteFlightObject);
  }, 1000); // leaves favorite on screen for 1 second before deleting it.
  var favoriteFlightsLS = getFavoriteFlightsLS();
  createFavoriteFlightsElements(favoriteFlightsLS);
};

/* ----------- handler for sorting flight search results by price ----------- */
var sortByPriceHandler = function () {
  changeArrowDirection(priceSortingArrow);
  removeOtherArrows(arrivalSortingArrow, departureSortingArrow);
  var sortedData = sortByPrice();
  createFlightElements(sortedData);
};

/* handler for sorting flight search results by arrival time of last segment of outbound itinerary */
var sortByArrivalHandler = function () {
  changeArrowDirection(arrivalSortingArrow);
  removeOtherArrows(priceSortingArrow, departureSortingArrow);
  var dataCopy = sortByArrival();
  createFlightElements(dataCopy);
};

/* handler for sorting flight search results by departure of first segment of outbound itinerary */
var sortByDepartureHandler = function () {
  changeArrowDirection(departureSortingArrow);
  removeOtherArrows(priceSortingArrow, arrivalSortingArrow);
  var dataCopy = sortByDeparture();
  createFlightElements(dataCopy);
};
/* ------------------------- ENDS HANDLER FUNCTIONS ------------------------- */

/* -------------------- BEGINS DATA COLLECTION FUNCTIONS -------------------- */
/* ------------------- gets current values in search form ------------------- */
var collectSearchForm = function () {
  originCode = goingFromEl.value.slice(2, 5);
  destinationCode = goingToEl.value.slice(2, 5);
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

/* --------------------- collects favorite flight data ---------------------- */
var collectFavoriteFlightData = function (favoriteFlightBtn) {
  // collects value of "flight-xxx" class name from the classNames list
  var flightIndex = favoriteFlightBtn.className.split(" ")[0];
  var favoriteFlightObject = {};

  var priceHTML = favoriteFlightBtn;
  var outboundHTML = document.querySelector("." + flightIndex); //outbound element is first occurence of class
  // if there's a 3rd element with the same class name, then there's an inbound
  if (document.querySelectorAll("." + flightIndex).length === 3) {
    favoriteFlightObject = {
      flightIndex: flightIndex,
      outbound: outboundHTML.innerHTML,
      inbound: outboundHTML.nextSibling.innerHTML,
      price: priceHTML.innerHTML,
    };
  } else {
    favoriteFlightObject = {
      flightIndex: flightIndex,
      outbound: outboundHTML.innerHTML,
      inbound: "",
      price: priceHTML.innerHTML,
    };
  }
  return favoriteFlightObject;
};

/* ---------------- uses iata airport code to get city name ----------------- */
var collectCity = function (iataAirport) {
  return mainAirports[iataAirport].city;
};

/* -------- insures that return date can't be before departure date --------- */

// $(document).ready(function () {
//   var $dateFrom = $("#date-departure"),
//     $dateTo = $("#date-return");

//   var datepickerFrom = UIkit.datetimepicker($dateFrom, { format: "YYYY-MM-DD" });

//   $dateFrom.on("change", function () {
//     $dateTo.removeAttr("disabled");

//     var datepickerTo = UIkit.datetimepicker($dateTo, {
//       format: "YYYY-MM-DD",
//       minDate: $(this).val(),
//     });
//   });
// });

/* --------------------- ENDS DATA COLLECTION FUNCTIONS --------------------- */

/* ----------------------- BEGINS FETCH API FUNCTIONS ----------------------- */
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

/* --- gets flight search results from "flight offers search" amadeus api --- */
var fetchFlightOffersSearch = function () {
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
        amadeusData.meta.count + " flights available!"; // displays number of matching search results
      priceSortingArrow.textContent = "↑"; // resets sorting order with every new search to price increasing
      createFlightElements(amadeusData);
    })
    .catch(function (error) {
      clearInterval(toggleInterval); // stops toggling searching message
      searchingMessageEl.textContent = ""; // clears searching message
      errorMessageEl.textContent =
        "Error! Please check the dates and airport codes.";
    });
};

/* -------------- gets airline carrier's logo from daisycon api ------------- */
var fetchCarrierLogoDaisycon = function (carrierCode) {
  var logoApiUrl =
    daisyconHost +
    carrierLogoWidth +
    "&" +
    carrierLogoHeight +
    backgroundColor +
    queryIata +
    carrierCode;

  return logoApiUrl;
};

// /* --------------- gets airline carrier's logo from airhex api -------------- */
// can choose between airhex or daisycon by replacing the function name (optional: and commenting/uncommenting functions and variables)
// var fetchCarrierLogoAirhex = function (carrierCode) {
//   var logoApiUrl =
//     airhexHost +
//     "_" +
//     carrierCode +
//     "_" +
//     carrierLogoWidth +
//     "_" +
//     carrierLogoHeight +
//     "_" +
//     carrierLogoType +
//     carrierLogoFormat +
//     queryairhexApi +
//     airhexApiKey;

//   return logoApiUrl;
// };
/* ------------------------ ENDS FETCH API FUNCTIONS ------------------------ */

/* ---------------------- BEGINS LOCALSTORAGE FUNCTIONS --------------------- */
/* ----------------- saves favorite flight to localStorage ------------------ */
var setFavoriteFlightsLS = function (favoriteFlightObject) {
  var favoriteFlightsLS = getFavoriteFlightsLS();

  if (favoriteFlightsLS === null) {
    // if there are no favorites, then it is set to current flight favorite
    favoriteFlightsLS = [favoriteFlightObject];
  } else {
    // checks if it's already in favorites, then it deletes the existing one in order not to duplicate
    for (let i = 0; i < favoriteFlightsLS.length; i++) {
      if (
        favoriteFlightsLS[i].flightIndex === favoriteFlightObject.flightIndex
      ) {
        favoriteFlightsLS.splice(favoriteFlightsLS[i - 1], 1);
        return;
      }
    }
    favoriteFlightsLS.unshift(favoriteFlightObject); // otherwise, if favorites is not empty, then the current favorite is added on top of the list
  }

  // limits favorite flights to five
  if (favoriteFlightsLS.length === 6) {
    favoriteFlightsLS.splice(5, 1);
  }

  localStorage.setItem("favoriteFlights", JSON.stringify(favoriteFlightsLS));
};

/* ----------- loads/gets favorite flight data from localStorage ------------ */
var getFavoriteFlightsLS = function () {
  // get existing search history from localStorage if it exists
  var favoriteFlightsLS = JSON.parse(localStorage.getItem("favoriteFlights"));
  return favoriteFlightsLS;
};

/* ------- deletes favorite flight from localStorage when unselected -------- */
var deleteFavoriteFlightsLS = function (favoriteFlightObject) {
  // gets existing favorites from localStorage
  var favoriteFlightsLS = getFavoriteFlightsLS();

  for (let i = 0; i < favoriteFlightsLS.length; i++) {
    if (favoriteFlightObject.flightIndex === favoriteFlightsLS[i].flightIndex) {
      favoriteFlightsLS.splice(favoriteFlightsLS[i - 1], 1);
    }
  }

  localStorage.setItem("favoriteFlights", JSON.stringify(favoriteFlightsLS));
};
/* ----------------------- ENDS LOCALSTORAGE FUNCTIONS ---------------------- */

/* ------------ BEGINS CONVERT/REFORMAT & SORT/REORDER FUNCTIONS ------------ */
/* -------------- converts time from fetch to 12h time format --------------- */
var convertTime12H = function (timeToConvert) {
  // first change time to proper format
  var convertedTime = timeToConvert.split("");
  convertedTime = convertedTime.slice(11, 16);

  var minutes = convertedTime.slice(2, 5);
  minutes = minutes.join("");

  var hour = convertedTime.slice(0, 2);
  hour = hour.join("");
  hour = parseInt(hour);

  var timeDesignation;

  if (hour === 0) {
    hour = 12;
    timeDesignation = "am";
  } else if (hour < 12) {
    timeDesignation = "am";
  } else if (hour === 12) {
    timeDesignation = "pm";
  } else {
    hour = hour - 12;
    timeDesignation = "pm";
  }

  convertedTime = hour + minutes + timeDesignation;
  return convertedTime;
};

/* ---------------- converts time from fetch to date format ----------------- */
var convertDate = function (timeToConvert) {
  var convertedDate = new Date(timeToConvert);
  var year = convertedDate.getFullYear();
  var month = convertedDate.getMonth() + 1;
  var day = convertedDate.getDate();
  convertedDate = month + "/" + day + "/" + year;
  return convertedDate;
};

/* ---------- converts price from fetch to comma separated format ----------- */
var convertPrice = function (priceToConvert) {
  var stringPrice;
  if (typeof priceToConvert !== "string") {
    stringPrice = priceToConvert.toFixed(2);
  } else {
    stringPrice = priceToConvert;
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

/* -------------------- sorts search results by price ----------------------- */
var sortByPrice = function () {
  // creates a disconnected copy of the data object
  var sortedData = JSON.parse(JSON.stringify(amadeusData));

  if (priceSortingArrow.textContent === "↑") {
    // resets the data to its original order (sorted by price up)
    sortedData = JSON.parse(JSON.stringify(amadeusData));
  } else if (priceSortingArrow.textContent === "↓") {
    // reverses the default sort order to become price down
    var reversedArray = sortedData.data.reverse();
    sortedData.data = reversedArray;
  }

  return sortedData;
};

/* ----------- sorts search results according to arrival time --------------- */
var sortByArrival = function () {
  // creates a disconnected copy of the data object
  var dataCopy = JSON.parse(JSON.stringify(amadeusData));
  var arrayToSort = dataCopy.data;

  function compare(a, b) {
    const timeA = Date.parse(
      a.itineraries[0].segments[
        a.itineraries[a.itineraries.length - 1].segments.length - 1
      ].arrival.at
    );
    const timeB = Date.parse(
      b.itineraries[0].segments[
        b.itineraries[b.itineraries.length - 1].segments.length - 1
      ].arrival.at
    );

    let comparison = 0;
    if (timeA > timeB) {
      comparison = 1;
    } else if (timeA < timeB) {
      comparison = -1;
    }
    if (arrivalSortingArrow.textContent === "↑") {
      return comparison;
    } else if (arrivalSortingArrow.textContent === "↓") {
      return comparison * -1;
    }
  }

  var sortedArray = arrayToSort.sort(compare);
  dataCopy.data = sortedArray;

  return dataCopy;
};

/* ---------- sorts search results according to departure time -------------- */
var sortByDeparture = function () {
  // creates a disconnected copy of the data object
  var dataCopy = JSON.parse(JSON.stringify(amadeusData));
  var arrayToSort = dataCopy.data;

  function compare(a, b) {
    const timeA = Date.parse(a.itineraries[0].segments[0].departure.at);
    const timeB = Date.parse(b.itineraries[0].segments[0].departure.at);

    let comparison = 0;
    if (timeA > timeB) {
      comparison = 1;
    } else if (timeA < timeB) {
      comparison = -1;
    }
    if (departureSortingArrow.textContent === "↑") {
      return comparison;
    } else if (departureSortingArrow.textContent === "↓") {
      return comparison * -1;
    }
  }

  var sortedArray = arrayToSort.sort(compare);
  dataCopy.data = sortedArray;

  return dataCopy;
};
/* ------------- ENDS CONVERT/REFORMAT & SORT/REORDER FUNCTIONS ------------- */

/* ------------------- BEGINS DOM-MANIPULATION FUNCTIONS -------------------- */
/* ------ writes data from "flight offers search" amadeus api to html ------- */
var createFlightElements = function (data) {
  // clears data from previous search
  flightsGridEl.innerHTML = "";

  // shows flights sorting menu
  sortFlightsMenuEl.style.display = "";

  // dictionary of codes. used to convert codes to full names
  var carriersCodeList = data.dictionaries.carriers;

  // number of flights available matching user input
  var flightCount = data.meta.count;

  // each flight (trip) details
  for (var flightCounter = 0; flightCounter < flightCount; flightCounter++) {
    // gets number of itineraries (usually 1 for outbound and 1 for inbound)
    var intineraryCount = data.data[flightCounter].itineraries.length;

    // loops through number of itineraries to create a container element for each
    for (
      var intineraryCounter = 0;
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
        data.data[flightCounter].itineraries[intineraryCounter].segments.length;

      /* ----- allocates data from fetch into variables ----- */
      for (
        var segmentCounter = 0;
        segmentCounter < segmentCount;
        segmentCounter++
      ) {
        createSegmentElements(
          data,
          flightCounter,
          intineraryCounter,
          segmentCounter,
          itineraryContainerEl,
          carriersCodeList
        );
      }
    }
    createPriceElements(data, flightCounter);
  }
};

/* ------------- gets and writes segment data from Amadeus API -------------- */
var createSegmentElements = function (
  data,
  flightCounter,
  intineraryCounter,
  segmentCounter,
  itineraryContainerEl,
  carriersCodeList
) {
  /* ----- creates segment container in index.html ----- */
  var segmentContainerEl = document.createElement("div");
  segmentContainerEl.classList.add(
    "uk-width-1-2",
    "uk-padding-remove-horizontal"
  );
  itineraryContainerEl.appendChild(segmentContainerEl);

  // /* ----- carrier (ariline) name ----- */
  var carrierCode =
    data.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].carrierCode;
  var carrierFull = carriersCodeList[carrierCode];
  var carrierFullEl = document.createElement("h4");
  carrierFullEl.className = "black-ops";
  carrierFullEl.textContent = carrierFull;
  segmentContainerEl.appendChild(carrierFullEl);

  /* ----- carrier (airline) logo ----- */
  var carrierLogoEl = document.createElement("img");
  carrierLogoEl.className = "frame";
  carrierLogoEl.alt = "airline logo";
  carrierLogoEl.style.width = "70";
  carrierLogoEl.style.height = "70";
  carrierLogoEl.setAttribute("loading", "lazy");
  carrierLogoEl.src = fetchCarrierLogoDaisycon(carrierCode); // gets carrier logo from api
  segmentContainerEl.appendChild(carrierLogoEl);

  /* ----- flight details container ----- */
  var flightDetailsEl = document.createElement("p");
  // appends flight details to itinerary
  segmentContainerEl.appendChild(flightDetailsEl);

  // city data
  var departureCityCode =
    data.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].departure.iataCode;
  var arrivalCityCode =
    data.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].arrival.iataCode;
  var citySpanEl = document.createElement("span");
  citySpanEl.innerHTML =
    collectCity(departureCityCode) +
    " to " +
    collectCity(arrivalCityCode) +
    "<br />";
  flightDetailsEl.appendChild(citySpanEl);

  // airport data
  var airportSpanEl = document.createElement("span");
  airportSpanEl.classList.add("fa", "stronger", "margin-small-left");
  airportSpanEl.innerHTML = departureCityCode + " &#xf072; " + arrivalCityCode;
  flightDetailsEl.appendChild(airportSpanEl);

  // departure and arrival times
  var departureTime =
    data.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].departure.at;
  var arrivalTime =
    data.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].arrival.at;
  var timeSpanEl = document.createElement("span");
  timeSpanEl.innerHTML =
    "<br />" +
    convertTime12H(departureTime) +
    " to " +
    convertTime12H(arrivalTime) +
    "<br />" +
    convertDate(departureTime) +
    "&nbsp; &nbsp;" +
    convertDate(arrivalTime) +
    "<br />";
  flightDetailsEl.appendChild(timeSpanEl);

  /* ----- flight number ----- */
  var flightNumber =
    data.data[flightCounter].itineraries[intineraryCounter].segments[
      segmentCounter
    ].number;
  var flightNumberEl = document.createElement("span");
  flightNumberEl.className = "black-ops";
  flightNumberEl.innerHTML = "<br /> Flight #: " + flightNumber + "<br />";
  flightDetailsEl.appendChild(flightNumberEl);
};

/* ---------------- writes price data elements to index.html ---------------- */
var createPriceElements = function (data, flightCounter) {
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

  var grandTotalPrice = data.data[flightCounter].price.grandTotal;
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
  priceContainerEl.addEventListener("click", addFavoriteFlightHandler);
};

/* --------- creates favorite flight elements on visit and refresh ---------- */
var createFavoriteFlightsElements = function (favoriteFlightsLS) {
  showSearchHistory(); // calls function in script.js to show favorites

  flightsFavoritesGridEl.innerHTML = ""; // clears previous favorites

  // creates container elements for each flight (outbound, inbound and price)
  for (let i = 0; i < favoriteFlightsLS.length; i++) {
    var outboundContainerEl = document.createElement("div");
    outboundContainerEl.classList.add(
      favoriteFlightsLS[i].flightIndex,
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
      favoriteFlightsLS[i].flightIndex,
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
      favoriteFlightsLS[i].flightIndex,
      "uk-border-rounded",
      "uk-width-1-1",
      "uk-padding-small",
      "uk-margin-small-top",
      "price-flights"
    );
    priceContainerEl.style.backgroundColor = "rgb(255, 165, 0)";
    priceContainerEl.innerHTML = favoriteFlightsLS[i].price;
    flightsFavoritesGridEl.appendChild(priceContainerEl);

    priceContainerEl.addEventListener("click", deleteFavoriteFlightHandler); // handler to delete favorite flight from localStorage
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
/* -------------------- ENDS DOM-MANIPULATION FUNCTIONS --------------------- */

/* ------------------------ BEGINS INITIAL SETTINGS ------------------------- */
var startInitialSettings = function () {
  favoritesBtnHandler();
};

startInitialSettings(); // loads initial settings for initial visit and refresh
/* ------------------------- ENDS INITIAL SETTINGS -------------------------- */

/* ------------------------- BEGINS EVENT HANDLERS -------------------------- */
searchFormEl.addEventListener("submit", searchFormHandler);
flightsTabEl.addEventListener("click", flightsTabHandler);
favoritesBtn.addEventListener("click", favoritesBtnHandler);
favoriteFlightsBtn.addEventListener("click", favoriteFlightsBtnHandler);
favoriteHotelsBtn.addEventListener("click", favoriteHotelsBtnHandler);
sortFlightsByPriceBtn.addEventListener("click", sortByPriceHandler);
sortFlightsByArrivalBtn.addEventListener("click", sortByArrivalHandler);
sortFlightsByDepartureBtn.addEventListener("click", sortByDepartureHandler);
/* -------------------------- ENDS EVENT HANDLERS --------------------------- */

/* -------------------------- BEGINS TESTING CODE --------------------------- */
/*  CODE BELOW IS NOT PART OF THE APP. IT IS ONLY USED FOR TESTING PURPOSES   */
/* ---------------- begins amadeus credentials status check ----------------- */

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
/* --------------------------- ENDS TESTING CODE ---------------------------- */
