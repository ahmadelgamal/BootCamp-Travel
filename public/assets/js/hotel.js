// to avoid getting validation error for using `const` declarations
/*jshint esversion: 6 */

/* -------------------- BEGINS DECLARATIONS OF GLOBAL VARIABLES -------------------- */
var city = ""; // Identifies city to be searched
var checkInDt = ""; //Check-in date
var checkOutDt = ""; // Check-out date
var maxHistoryLength = 100; // History length
let rapidApiKey = ""; // Rapid API Key
const newHotellay = document.getElementById("hotels-grid"); // Get parent element of HTML document from search
const newInitlay = document.getElementById("hotel-favorites-grid");// Get parent element of HTML document during initalization
const searchingMessageEl2 = document.getElementById("searching-message-hotel"); // constant that points to searching message element
const errorgMessageEl2 = document.getElementById("error-message-hotel"); // constant that points to searching message element
var pageNumber = 1; // # of pages to display
var resultMax = 25; // # of hotels to show up in a single request
var adults = 1; // # of adults
var curr = "USD"; // Currency
var sortOrd = "PRICE"; // Sort order
var outcome = false;
var i =0 ;
var k=0;
var hotels = [];
var guestReviews = "";

var hotelsTabEl = document.getElementById("hotels-tab");


/* -------------------- DISPLAYS PROPERTY INFORMATION BASED ON THE PROPERTIES IDs RETURNED WITHIN A CITY -------------------- */
var displayPropertyInfo = function (
  newHotellay1,
  identity,
  checkindate,
  checkoutdate,
  numberofadults,
  currency,
  j,
  urlTh,
  reviewRating,
  propertyName,
  address,
  totalGuestReviews,
  neighbourhoodName,
  pricee
) {


  // Add DOM elements to display the property
  var hotellayvar = "hotellay" + newHotellay1.id + j.toString();
  // the parent element in newHotelallay1 will depend on whether it needs to be displayed as a search result or favorite
  $(newHotellay1).append(
    '<div class = "uk-grid uk-border-rounded uk-width-1-1 uk-background-default uk-padding-remove-horizontal margin-zero" id = "' +
    hotellayvar +
    '">'
  );
  var newHotellay2 = document.getElementById(hotellayvar);


  $(newHotellay2).append(
    '<div class="uk-border-rounded uk-width-1-3@m uk-width1-1@s uk-background-cover responsive-height" style="background-image:url(' + urlTh + ')"> </div>'
  );
  if ((newHotellay1.id) == "hotels-grid") {
    $(newHotellay2).append(
      '<div class="uk-grid uk-width-2-3@m uk-width-1-1@s"> <div class="uk-width-1-2 uk-margin-small"> <h4>' +
      propertyName +
      "<br> </h4> <h6>" +
      address +
      ' </h6>  <p> <span id="neighborhoodName">' +
      neighbourhoodName +
      '</span> <br>  </p>  <span id = "reviewRating" class="uk-position-bottom uk-position-relative">' +
      reviewRating + '</span>' +
      '<span> /5 Rating ( </span>' + '<span id = "totalGuestReviews">' +
      totalGuestReviews + '</span>' +
      '<span> Reviews)</span></div> <div class="uk-border-rounded uk-width-1-2 uk-padding-small uk-padding-remove-horizontal price"> <h2 class="uk-margin-remove-vertical">' +
      pricee +
      '</h2> <b>per Night</b> <button class="reserve uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-large uk-button-primary uk-border-rounded" id="' +
      identity +
      '">Favorites</button> </div> </div>'
    );
  }
  else {
    $(newHotellay2).append(
      '<div class="uk-grid uk-width-2-3@m uk-width-1-1@s"> <div class="uk-width-1-2 uk-margin-small"> <h4>' +
      propertyName +
      "<br> </h4> <h6>" +
      address +
      ' </h6>  <p> <span id="neighborhoodName">' +
      neighbourhoodName +
      '</span> <br>  </p>  <span id = "reviewRating" class="uk-position-bottom uk-position-relative">' +
      reviewRating + '</span>' +
      '<span> /5 Rating ( </span>' + '<span id = "totalGuestReviews">' +
      totalGuestReviews + '</span>' +
      '<span> Reviews)</span></div> <div class="uk-border-rounded uk-width-1-2 uk-padding-small uk-padding-remove-horizontal price"> <p> Check-In: ' + checkindate + '<br> Check-Out: ' + checkoutdate + '<br> Adults: ' + numberofadults + '</p> <h2 class="uk-margin-remove-vertical">' +
      pricee +
      '</h2> <b>per Night</b> <button class="unreserve uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-large uk-button-danger uk-border-rounded"  id="' +
      identity +
      '">Remove</button> </div> </div>' +
      '</div>  </div>'
    );
  }
};

/* -------------------- OBTAIN ID FOR CITY REQUIRED FOR PROPERTY SEARCH-------------------- */
var GetIdhotel = function (City, checkIn, checkOut) {
  
  fetch(
    "https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=" +
    City,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "hotels4.p.rapidapi.com"
      }
    })
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          // Get property information based on city search
          if (data.suggestions[0].entities.length !== 0) {
            if ($(".temporary")) {
              $(".temporary").empty();
            }
            errorgMessageEl2.innerHTML = "";
            searchingMessageEl2.innerHTML = "";

            var ide = data.suggestions[0].entities[0].destinationId;
            pageNumber = 1;
            getProperties(
              ide,
              curr,
              sortOrd,
              pageNumber,
              checkIn,
              checkOut,
              resultMax,
              adults
            );
            var tempHotel = {
              cityIdent: ide,
              checkInDt: checkIn,
              checkOutDt: checkOut,
            };
            localStorage.setItem("tempHotel", JSON.stringify(tempHotel));
          }
          else {
            errorgMessageEl2.innerHTML = "Sorry, there was an error loading the results. Please try again ";
          }
        });
      }
    })
    // Message incase there is an error connecting
    .catch(function (error) {
      errorgMessageEl2.innerHTML = "Sorry, there was an error loading the results. Please try again ";
    });
};

/* -------------------- PROPERTY INFORMATION BASED ON CITY ID -------------------- */
var getProperties = function (
  idcity,
  currency,
  sortOrder,
  pgNumb,
  checkInDate,
  checkOutDate,
  pgSize,
  adultNumber
) {
  searchingMessageEl2.innerHTML = "Searching...";
  var url6 =
    "https://hotels4.p.rapidapi.com/properties/list?currency=" +
    currency +
    "&locale=en_US&sortOrder=" +
    sortOrder +
    "&destinationId=" +
    idcity +
    "&pageNumber=" +
    pgNumb +
    "&checkIn=" +
    checkInDate +
    "&checkOut=" +
    checkOutDate +
    "&pageSize=" +
    pgSize +
    "&adults=" +
    adultNumber;

  fetch(url6, {
    method: "GET",
    headers: {
      "x-rapidapi-key": rapidApiKey,
      "x-rapidapi-host": "hotels4.p.rapidapi.com"
    }
  })
    .then(function (response) {
      // request was successful
      if ($(".temporary")) {
        $(".temporary").empty();
      }

      if (response.ok) {
        response.json().then(function (data6) {
          $("#hotels-container").css("display", ""); // Unhide the document class

          if (data6.data.body.searchResults.results.length !== 0) {
            var propId = [];
            propId = data6.data.body.searchResults.results;
            if ($(".temporary")) {
              $(".temporary").empty();
            }

            // get page number and total count 
            if ((typeof data6.data.body.searchResults.pagination !== "undefined")) {
              var pagen = data6.data.body.searchResults.pagination.currentPage;
              var nextPage = data6.data.body.searchResults.pagination.nextPageNumber;

              if ((pagen > nextPage) && (pagen > 1)) {
                $(newHotellay).append('<div class = "uk-grid uk-inline .uk-width-1-1 uk-margin-medium-bottom"> <button class="previousButton uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-small uk-button-primary uk-border-rounded uk-position-top-center" id="previousButton"> Previous Page </button> </div>');
              }

              if (pagen < nextPage) {
                if (pagen > 1) {
                  $(newHotellay).append('<div class = "uk-grid uk-inline .uk-width-1-1 uk-margin-medium-bottom"> <button class="nextButton uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-small uk-button-primary uk-border-rounded uk-position-top-right" id="nextButton"> Next Page </button> <button class="previousButton uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-small uk-button-primary uk-border-rounded uk-position-top-left uk-margin-medium-left" id="previousButton"> Previous Page </button> </div>');
                }
                else {
                  $(newHotellay).append('<div class = "uk-grid uk-inline .uk-width-1-1 uk-margin-medium-bottom"> <button class="nextButton uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-small uk-button-primary uk-border-rounded uk-position-top-center" id="nextButton"> Next Page </button> </div>');
                }
              }
            }

            // Get remaining information about the hotel properties
            for (let i = 0; i < propId.length; i++) {
              // the if statements account for any information on the server that might be undefined 
              var propIde = [];
              propIde[i] = data6.data.body.searchResults.results[i].id;

              if ((typeof data6.data.body.searchResults.results[i].thumbnailUrl) == "undefined") {
                var url4 = "https://upload.wikimedia.org/wikipedia/commons/0/0a/No-image-available.png";
              }
              else {
                var urlThumb =
                  data6.data.body.searchResults.results[i].thumbnailUrl;
                var url3 = urlThumb.split("_");
                var url4 = url3[0] + "_y.jpg"; // URL for property image
              }

              if ((typeof data6.data.body.searchResults.results[i].starRating) == "undefined") {
                var starRating = "No ratings available";
              }
              else {
                var starRating =
                  data6.data.body.searchResults.results[i].starRating;
              }

              if ((typeof data6.data.body.searchResults.results[i].guestReviews) == "undefined") {
                var totalGuestReviews = "Missing Information About Guest";
              }
              else {
                var totalGuestReviews = data6.data.body.searchResults.results[i].guestReviews.total;
              }

              if ((typeof data6.data.body.searchResults.results[i].name == "undefined")) {
                var propertyName = "Missing Property Information";
              }
              else {
                var propertyName =
                  data6.data.body.searchResults.results[i].name;
              }

              if (((typeof data6.data.body.searchResults.results[i].address.streetAddress) || (typeof data6.data.body.searchResults.results[i].address.locality) || (typeof data6.data.body.searchResults.results[i].address.region) || (typeof data6.data.body.searchResults.results[i].address.postalCode) || (typeof data6.data.body.searchResults.results[i].address.countryName)) == "undefined") {
                var address = "Missing Address Information";
              }
              else {
                var address = data6.data.body.searchResults.results[i].address.streetAddress + "<br>" + data6.data.body.searchResults.results[i].address.locality + ", " + data6.data.body.searchResults.results[i].address.region + " " + data6.data.body.searchResults.results[i].address.postalCode + "<br>" + data6.data.body.searchResults.results[i].address.countryName;
              }

              if ((typeof data6.data.body.searchResults.results[i].neighbourhood) == "undefined") {
                var neighbourhoodName = "Missing Neighbourhood Information";
              }
              else {
                var neighbourhoodName = data6.data.body.searchResults.results[i].neighbourhood;
              }

              if ((typeof data6.data.body.searchResults.results[i].ratePlan == "undefined")) {
                var price = "Missing";
              }
              else {
                var price = data6.data.body.searchResults.results[i].ratePlan.price.current;
              }

              displayPropertyInfo(
                newHotellay,
                propIde[i],
                checkInDate,
                checkOutDate,
                adultNumber,
                currency,
                i,
                url4,
                starRating,
                propertyName,
                address,
                totalGuestReviews,
                neighbourhoodName,
                price
              );

              if (hotels !== null) {

                for (k = 0; k < hotels.length; k++) {

                  if (hotels[k].IdCity == propIde[i]) {
                    $("#" + propIde[i]).html("Remove");
                    $("#" + propIde[i]).removeClass("reserve uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-large uk-button-primary uk-border-rounded").addClass("unreserve uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-large uk-button-danger uk-border-rounded");
                  }
                }
              }
            }
          } else {
            $("#hotels-container").append(
              '<div class = "temporary"> Sorry, information for this property is not available. Coming soon. Please try another city </div'
            ); // Message incase there is no property information or city is not found
          }
        });
      }

      $(".temporary").empty();
      searchingMessageEl2.innerHTML = "";
    })
    .catch(function (error) {
      errorgMessageEl2.innerHTML = "Sorry, there was an error loading the results. Please try again ";  // Message incase there is an error connecting
    });
};

/* -------------------- PULL LOCAL STORAGE DATA AND HOTELS -------------------- */
var setInitial = function () {
  hotels = JSON.parse(localStorage.getItem("hotels"));
  $("#hotels-grid").empty(); // Empties previous display
  $("#hotel-favorites-grid").empty();
  searchingMessageEl2.innerHTML = "";
  errorgMessageEl2.innerHTML = "";
  $("#hotels-sub-menu").hide(); // hide the sorting bar
  var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
  if (tempHotel !== null) {
    localStorage.removeItem("tempHotel");
  }
  setFavData();
};

/* -------------------- SET SORTING ORDER AND DISPLAY -------------------- */
var SortOrderFunction = function (sortSelect) {
  pageNumber = 1;
  var ele = $(sortSelect);
  if (sortSelect == "#sort-hotel-price") {
    var sortPrice = ele[0].innerText;
    var splitPrice = sortPrice.split(" ");
    if (splitPrice[1] == "↓" || splitPrice[1] === undefined) {
      sortOrd = "PRICE";
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      $("#hotels-grid").empty();
      $("#hotel-favorites-grid").empty();
      searchingMessageEl2.innerHTML = "";
      errorgMessageEl2.innerHTML = "";
      getProperties(
        tempHotel.cityIdent,
        curr,
        sortOrd,
        pageNumber,
        tempHotel.checkInDt,
        tempHotel.checkOutDt,
        resultMax,
        adults
      );
      $("#sort-hotel-price").html("<b>PRICE ↑</b>"); // changes display based ascending or descending order
      $("#sort-hotel-rating").html("RATING");
    } else if (splitPrice[1] == "↑") {
      sortOrd = "PRICE_HIGHEST_FIRST";
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      $("#hotels-grid").empty();
      $("#hotel-favorites-grid").empty();
      searchingMessageEl2.innerHTML = "";
      errorgMessageEl2.innerHTML = "";
      getProperties(
        tempHotel.cityIdent,
        curr,
        sortOrd,
        pageNumber,
        tempHotel.checkInDt,
        tempHotel.checkOutDt,
        resultMax,
        adults
      );
      $("#sort-hotel-price").html("<b>PRICE ↓</b>"); // changes display based ascending or descending order
      $("#sort-hotel-rating").html("RATING");
    }
  } else if (sortSelect == "#sort-hotel-rating") {
    var sortRating = ele[0].innerText;
    var splitRating = sortRating.split(" ");
    if (splitRating[1] == "↓" || splitRating[1] === undefined) {
      sortOrd = "STAR_RATING_LOWEST_FIRST";
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      $("#hotels-grid").empty();
      $("#hotel-favorites-grid").empty();
      searchingMessageEl2.innerHTML = "";
      errorgMessageEl2.innerHTML = "";
      getProperties(
        tempHotel.cityIdent,
        curr,
        sortOrd,
        pageNumber,
        tempHotel.checkInDt,
        tempHotel.checkOutDt,
        resultMax,
        adults
      );
      $("#sort-hotel-price").html("PRICE"); // changes display based ascending or descending order
      $("#sort-hotel-rating").html("<b> RATING ↑</b>");
    } else if (splitRating[1] == "↑") {
      sortOrd = "STAR_RATING_HIGHEST_FIRST";
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      $("#hotels-grid").empty();
      $("#hotel-favorites-grid").empty();
      searchingMessageEl2.innerHTML = "";
      errorgMessageEl2.innerHTML = "";
      getProperties(
        tempHotel.cityIdent,
        curr,
        sortOrd,
        pageNumber,
        tempHotel.checkInDt,
        tempHotel.checkOutDt,
        resultMax,
        adults
      );
      $("#sort-hotel-price").html("<b>PRICE</b>"); // changes display based ascending or descending order
      $("#sort-hotel-rating").html("<b>RATING ↓</b>");
    }
  }
};

/*--------------------- CHECK FOR EXISTING FAVORITES ------------------*/
var unReserve = function (propval) {
  hotels = JSON.parse(localStorage.getItem("hotels"));
  if (hotels !== "") {
    for (i = 0; i < hotels.length; i++) {

      if (hotels[i].IdCity == propval) {
        hotels.splice(i, 1);
      }
    }
  }
};

/* --------------------- GET FAVORITES DATA -----------------*/
var setFavData = function () {

  hotels = JSON.parse(localStorage.getItem("hotels"));
  // Display forvorites
  if (hotels !== null) {
    for (i = 0; i < hotels.length; i++) {
      displayPropertyInfo(
        newInitlay,
        hotels[i].IdCity,
        hotels[i].ChkInDate,
        hotels[i].ChkOutDate,
        hotels[i].NumAdults,
        hotels[i].Currcy,
        i,
        hotels[i].UrlThumbNl,
        hotels[i].rating,
        hotels[i].hotelName,
        hotels[i].address,
        hotels[i].guestReviews,
        hotels[i].neighborhood,
        hotels[i].price
      );
    }
  }
};

/* --------------------- GET PROPERTY DATA FUNCTION CALL -----------------*/
var propData = function () {

  var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));

  $("#hotels-grid").empty();
  $("#hotel-favorites-grid").empty();
  $("#hotels-sub-menu").show(); // show the sorting bar
  searchingMessageEl2.innerHTML = "";
  errorgMessageEl2.innerHTML = "";

  if (tempHotel !== null) {

    getProperties(
      tempHotel.cityIdent,
      curr,
      sortOrd,
      pageNumber,
      tempHotel.checkInDt,
      tempHotel.checkOutDt,
      resultMax,
      adults
    );
  }
};

/* -------------------- PULL LOCAL STORAGE-------------------- */


    setInitial();
  

/* -------------------- PROCESS REQUEST FOR HOTEL SEARCH-------------------- */
$("#form").on("submit", function (event) {

  // check if connection in online
  if (!navigator.onLine){
    $("#hotels-grid").empty(); // Empties previous display
    $("#hotel-favorites-grid").empty();
  errorgMessageEl2.innerHTML = "Sorry, something is wrong with the Internet connection. Please reconnect ";
  }

  if (hotelsTabEl.className === "uk-active") {
    event.preventDefault();

    fetch('/api/rapid-api-key', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      rapidApiKey = data;

    $("#hotels-grid").empty(); // Empties previous display
    $("#hotel-favorites-grid").empty();
    $(".temporary").empty();
    errorgMessageEl2.innerHTML = "";
    searchingMessageEl2.innerHTML = "";

    // Read city value from form
    city = $("#hotel-city").val();

    if (city === "" || city.split("")[1] === undefined || !city.split("")[1]) {
      errorgMessageEl2.innerHTML = "Sorry, the city name is missing. Please try again ";
    }
    else {
      city = city.trim();
      var spc2 = city.split("");
      var spc3 = spc2[1].trim();
      city = spc3;
      // Read check-in, check-out and # of guests value from form
      checkInDt = $("#check-in").val();
      checkOutDt = $("#check-out").val();
      checkInDt = moment(checkInDt, "MM-DD-YYYY");
      checkInDt = moment(checkInDt).format("YYYY-MM-DD");
      checkOutDt = moment(checkOutDt, "MM-DD-YYYY");
      checkOutDt = moment(checkOutDt).format("YYYY-MM-DD");
      adults = $("#guests-select").val();

      if (sortOrd == "PRICE") {
        $("#sort-hotel-price").html("<b>PRICE ↑</b>"); // changes display based ascending or descending order
        $("#sort-hotel-rating").html("RATING");
      }
      if (sortOrd == "PRICE_HIGHEST_FIRST") {
        $("#sort-hotel-price").html("<b>PRICE ↓</b>"); // changes display based ascending or descending order
        $("#sort-hotel-rating").html("RATING");
      }
      if (sortOrd == "STAR_RATING_LOWEST_FIRST") {
        $("#sort-hotel-price").html("PRICE"); // changes display based ascending or descending order
        $("#sort-hotel-rating").html("<b>RATING ↑</b>");
      }
      if (sortOrd == "STAR_RATING_HIGHEST_FIRST") {
        $("#sort-hotel-price").html("PRICE"); // changes display based ascending or descending order
        $("#sort-hotel-rating").html("<b>RATING ↓</b>");
      }

      // Make sure check-in date is before the check-out date 
      if (moment(checkOutDt).isAfter(checkInDt)) {
        GetIdhotel(city, checkInDt, checkOutDt);
        $("#hotels-sub-menu").show();
      }
      else {
        errorgMessageEl2.innerHTML = "Sorry, check-in date needs to be before the check-out date ";
      }
    }
  });
  }
});

/* -------------------- PROCESS REQUEST FOR STORING HOTEL INFORMATION------------------- */
$(document).on("click", ".reserve", function () {
  event.preventDefault();
  // Get the values from the item
  var propval = this.getAttribute("id");
  var imageUrlElement = $(this)
    .parent()
    .parent()
    .parent()
    .children()
    .children("style");
  var urlTnTemp = imageUrlElement.prevObject[0].style.backgroundImage;
  var urlTnTemp2 = urlTnTemp.split('"');
  var urlTn = urlTnTemp2[1];
  var prcEl = $(this)
    .parent()
    .children("h2");
  var prc = prcEl[0].innerHTML;
  var neighborEl = $(this)
    .parent()
    .parent()
    .find("#neighborhoodName");
  var neighbor = neighborEl.text();
  var ratingEl = $(this)
    .parent()
    .parent()
    .find("#reviewRating");
  var rating = ratingEl.text();
  var guestReviewEl = $(this)
    .parent()
    .parent()
    .find("#totalGuestReviews");
  guestReviews = guestReviewEl.text();
  var hotelNameEl = $(this)
    .parent()
    .parent()
    .find("h4");
  var hotelName = hotelNameEl[0].innerText;
  var addressEl = $(this)
    .parent()
    .parent()
    .find("h6");
  var address = addressEl[0].innerText;

  $(this).html("Remove");
  $(this).removeClass("reserve uk-button-primaryuk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-large uk-button-primary uk-border-rounded").addClass("unreserve uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-large uk-button-danger uk-border-rounded");
  hotels = JSON.parse(localStorage.getItem("hotels"));

  //sets initial values if null
  if (hotels === null) {
    var hotels = [
      {
        // Object for local storage
        IdCity: "",
        ChkInDate: "",
        ChkOutDate: "",
        NumAdults: "",
        Currcy: "",
        UrlThumbNl: "",
        dateSearch: "",
        price: "",
        neighborhood: "",
        rating: "",
        guestReviews: "",
        hotelName: "",
        address: ""
      },
    ];
    hotels[0].IdCity = propval;
    hotels[0].ChkInDate = checkInDt;
    hotels[0].ChkOutDate = checkOutDt;
    hotels[0].NumAdults = adults;
    hotels[0].Currcy = curr;
    hotels[0].UrlThumbNl = urlTn;
    hotels[0].dateSearch = moment().format("YYYY-MM-DD");
    hotels[0].price = prc;
    hotels[0].neighborhood = neighbor;
    hotels[0].rating = rating;
    hotels[0].guestReviews = guestReviews;
    hotels[0].hotelName = hotelName;
    hotels[0].address = address;
  }
  // first in last out depending on required size of history
  else {
    for (i = 0; i < hotels.length; i++) {
      if (hotels[i].IdCity === propval) {
        outcome = true;
      }
    }

    if (outcome === false) {
      if (hotels.length == maxHistoryLength) {
        hotels.shift();
      }

      hotels.push({
        IdCity: propval,
        ChkInDate: checkInDt,
        ChkOutDate: checkOutDt,
        UrlThumbNl: urlTn,
        Currcy: curr,
        NumAdults: adults,
        dateSearch: moment().format("YYYY-MM-DD"),
        price: prc,
        neighborhood: neighbor,
        rating: rating,
        guestReviews: guestReviews,
        hotelName: hotelName,
        address: address
      });
    }
  }

  localStorage.setItem("hotels", JSON.stringify(hotels));
  outcome = false;
});

/* -------------------- PROCESS REQUEST FOR SORTING BY PRICE ------------------ */
$(document).on("click", "#sort-hotel-price", function () {
  SortOrderFunction("#sort-hotel-price");
});

/* -------------------- PROCESS REQUEST FOR SORTING BY RATINGS------------------ */
$(document).on("click", "#sort-hotel-rating", function () {
  SortOrderFunction("#sort-hotel-rating");
});

/* -------------------- PROCESS REQUEST FOR CLICKING ON FAVORITES------------------ */

$(document).on("click", "#favorites-btn", function () {

  $("#hotels-grid").empty();
  $("#hotel-favorites-grid").empty();
  searchingMessageEl2.innerHTML = "";
  errorgMessageEl2.innerHTML = "";
  $("#hotels-sub-menu").hide(); // hide the sorting bar
  $("#hotel-favorites-grid").parent().show();
  setFavData();
}

);
$(document).on("click", "#hotels-tab", function () {

  var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));

  $("#hotels-grid").empty();
  $("#hotel-favorites-grid").empty();
  $("#hotels-sub-menu").show(); // hide the sorting bar
  searchingMessageEl2.innerHTML = "";
  errorgMessageEl2.innerHTML = "";

  if (tempHotel !== null) {

    getProperties(
      tempHotel.cityIdent,
      curr,
      sortOrd,
      pageNumber,
      tempHotel.checkInDt,
      tempHotel.checkOutDt,
      resultMax,
      adults
    );
  }
}
);

/* -------------------- PROCESS REQUEST FOR DELETING FAVORITES------------------ */
$(document).on("click", ".unreserve", function () {
  var propval = this.getAttribute("id");
  var inFavorites = ($(this).parent().parent().parent().attr("id")).includes("hotel-favorites-grid"); // Check if the request is coming from favorites or a search. 

  unReserve(propval);

  if (inFavorites) {  // if request is coming from the favorite tag, then delete the favorite when user chooses to remove
    localStorage.setItem("hotels", JSON.stringify(hotels));

    $("#hotels-grid").empty();
    $("#hotel-favorites-grid").empty();

    hotels = JSON.parse(localStorage.getItem("hotels"));
    // Display favorites
    setFavData();
  }
  else {  // If request is coming from a search, then you can toggle the button to add or delete the favorite
    localStorage.setItem("hotels", JSON.stringify(hotels));
    $(this).html("FAVORITES");
    $(this).removeClass("unreserve uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-large uk-button-danger uk-border-rounded").addClass("reserve uk-button uk-margin-small-top uk-margin-small-bottom uk-margin-remove-horizontal uk-button-large uk-button-primary uk-border-rounded");
  }
});

/* -------------------- GO TO NEXT PAGE OF SEARCH RESULTS (PAGEINATION)----------------- */
$(document).on("click", "#nextButton", function () {
  hotels = JSON.parse(localStorage.getItem("hotels"));
  pageNumber = pageNumber + 1;
  propData();
});

/* -------------------- GO TO PREVIOUS PAGE OF SEARCH RESULTS (PAGEINATION)----------------- */
$(document).on("click", "#previousButton", function () {
  hotels = JSON.parse(localStorage.getItem("hotels"));
  pageNumber = pageNumber - 1;
  propData();
});
