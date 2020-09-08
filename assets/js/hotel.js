/* -------------------- BEGINS DECLARATIONS OF GLOBAL VARIABLES -------------------- */
var city = ""; // Identifies city to be searched
var checkin = ""; //Check-in date
var checkout = ""; // Check-out date
var id = 0;
var urls = []; // URLs of the images
var maxHistoryLength = 3; // History length
var urlKey = "82aa230269msh2cf9909e3ed2b47p118c19jsn0f399e353b6d"; // URL Key
var newHotellay1 = document.getElementById("hotels-grid"); // Get parent element of HTML document
var pageNumber = 1; // # of pages to display
var resultMax = 1; // # of hotels to show up in a single request
var adults = 1; // # of adults
curr = "USD"; // Currency
var sortOrd = "PRICE"; // Sort order
var outcome = false;
var symbol = "↑";

var hotelsTabEl = document.getElementById("hotels-tab");

// Object for local storage
var hotels = [
  {
    IdCity: "",
    ChkInDate: "",
    ChkOutDate: "",
    NumAdults: "",
    Currcy: "",
    UrlThumbNl: "",
    dateSearch: "",
  },
];

/* -------------------- DISPLAYS PROPERTY INFORMATION BASED ON THE PROPERTIES IDs RETURNED WITHIN A CITY -------------------- */

var displayPropertyInfo = function (
  identity,
  checkindate,
  checkoutdate,
  numberofadults,
  currency,
  j,
  urlTh,
  reviewRating
) {
  formurl =
    "https://cors-anywhere.herokuapp.com/https://hotels4.p.rapidapi.com/properties/get-details?locale=en_US&currency=" +
    currency +
    "&checkOut=" +
    checkoutdate +
    "&adults1=" +
    numberofadults +
    "&checkIn=" +
    checkindate +
    "&id=" +
    identity;
  fetch(formurl, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "hotels4.p.rapidapi.com",
      "x-rapidapi-key": urlKey,
    },
  })
    .then(function (response) {
      response.json().then(function (data3) {
        var guestRv = data3.data.body.guestReviews;
        if (guestRv.brands !== undefined) {
          // var reviewRating = data3.data.body.guestReviews.brands.rating; // Rating information
          var totalReviews = data3.data.body.guestReviews.brands.total; // Total reviews
        } else {
          // var reviewRating = "Insufficient Information ";
          var totalReviews = "Insufficient Information To Show ";
        }

        var propertyName = data3.data.body.propertyDescription.name; // Hotel name
        //  var cityName = data3.data.body.propertyDescription.address.cityName;
        var price =
          data3.data.body.propertyDescription.featuredPrice.currentPrice
            .formatted; // Hotel price
        var tagline = data3.data.body.propertyDescription.tagline; // Tagline describing hotel
        var neighborhood = data3.neighborhood.neighborhoodName; // Hotel's neighborhood

        // Add DOM elements to display the property
        var hotellayvar = "hotellay" + j.toString();
        $(newHotellay1).append(
          '<div class = "uk-grid uk-border-rounded uk-background-default uk-padding-remove-horizontal" id = "' +
            hotellayvar +
            '">'
        );
        var newHotellay2 = document.getElementById(hotellayvar);

        $(newHotellay2).append(
          '<div class="uk-border-rounded uk-width-1-3@m uk-width1-1@s uk-background-muted"> <img class="uk-border-rounded" src=' +
            urlTh +
            "> </div>"
        );

        $(newHotellay2).append(
          '<div class="uk-grid uk-width-2-3@m uk-width-1-1@s"> <div class="uk-width-1-2 uk-margin-medium"> <h4>' +
            propertyName +
            "<br>" +
            tagline +
            " </h4>  <p>" +
            neighborhood +
            ' <br> <span class="uk-text-success">Reserve Now, Pay Later</span><br> <span class="uk-text-success">Free Cancellation</span> </p>  <span class="uk-position-bottom uk-position-relative">' +
            reviewRating +
            "/5 Rating (" +
            totalReviews +
            ' Reviews)</span></div> <div class="uk-border-rounded uk-width-1-2 uk-padding-small uk-padding-remove-horizontal price"> <h2 class="uk-margin-remove-vertical">' +
            price +
            '</h2> <b>per Night</b> <button class="reserve uk-button uk-margin-large-top uk-margin-remove-horizontal uk-button-large uk-button-primary uk-border-rounded" id="' +
            identity +
            '">Reserve</button> </div> </div>'
        );
      });
    })
    .catch((err) => {
      $("body").append(
        '<div class = "temporary"> Sorry, there was an error loading the results. Please try again </div'
      ); // Message incase there is no property information or city is not found
      console.log(err);
    });
};

/* -------------------- OBTAIN ID FOR CITY REQUIRED FOR PROPERTY SEARCH-------------------- */

var GetIdhotel = function (City, checkIn, checkOut) {
  fetch(
    "https://cors-anywhere.herokuapp.com/https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=" +
      City,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "hotels4.p.rapidapi.com",
        "x-rapidapi-key": urlKey,
      },
    }
  )
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          // Get property information based on city search
          if (data.suggestions[0].entities.length !== 0) {
            if ($(".temporary")) {
              $(".temporary").empty();
            }
            var ide = data.suggestions[0].entities[0].destinationId;

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
              cityid: ide,
              checkin: checkIn,
              checkout: checkOut,
            };
            localStorage.setItem("tempHotel", JSON.stringify(tempHotel));
          } else {
            $("body").append(
              '<div class = "temporary"> Sorry, information for this city is not available. Coming soon. Please try another city </div'
            ); // Message incase there is no cityinformation or city is not found
          }
        });
      }
    })
    .catch(function (error) {
      $("body").append(
        '<div class = "temporary"> Sorry, there was an error loading the results. Please try again </div'
      ); // Message incase there is an error connecting
      console.log(err);
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
  var url6 =
    "https://cors-anywhere.herokuapp.com/https://hotels4.p.rapidapi.com/properties/list?currency=" +
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
      "x-rapidapi-host": "hotels4.p.rapidapi.com",
      "x-rapidapi-key": urlKey,
    },
  })
    .then(function (response) {
      // request was successful
      if ($(".temporary")) {
        $(".temporary").empty();
      }

      if (response.ok) {
        response.json().then(function (data6) {
          $("#hotels-container").css("display", "flex"); // Unhide the document class

          if (data6.data.body.searchResults.results.length !== 0) {
            var propId = [];
            propId = data6.data.body.searchResults.results;
            if ($(".temporary")) {
              $(".temporary").empty();
            }
            for (i = 0; i < propId.length; i++) {
              // for (k = 0; k < 1000000000; k++) { }; // Meant to throttle API call to maintain less that 5 calls in a second
              var propIde = [];
              propIde[i] = data6.data.body.searchResults.results[i].id;
              var urlThumb =
                data6.data.body.searchResults.results[i].thumbnailUrl;
              var starRating =
                data6.data.body.searchResults.results[i].starRating;
              if (starRating == "undefined" || starRating == undefined) {
                starRating = "No ratings availabe";
              }
              var url3 = urlThumb.split("_");
              var url4 = url3[0] + "_y.jpg"; // URL for property image

              displayPropertyInfo(
                propIde[i],
                checkInDate,
                checkOutDate,
                adultNumber,
                currency,
                i,
                url4,
                starRating
              );
            }
          } else {
            $("body").append(
              '<div class = "temporary"> Sorry, information for this property is not available. Coming soon. Please try another city </div'
            ); // Message incase there is no property information or city is not found
          }
        });
      }
    })

    .catch(function (error) {
      $("body").append(
        '<div class = "temporary"> Sorry, there was an error loading the results. Please try again </div'
      ); // Message incase there is an error connecting
      console.log(err);
    });
};
/* -------------------- PULL LOCAL STORAGE DATA AND HOTELS -------------------- */
var setInitial = function () {
  hotels = JSON.parse(localStorage.getItem("hotels"));
  $("#hotels-grid").empty(); // Empties previous display

  if (!(hotels == null)) {
    for (i = 0; i < hotels.length; i++) {
      sortOrd = "PRICE";
      displayPropertyInfo(
        hotels[i].IdCity,
        hotels[i].ChkInDate,
        hotels[i].ChkOutDate,
        hotels[i].NumAdults,
        hotels[i].Currcy,
        i,
        hotels[i].UrlThumbNl
      );
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      if (tempHotel !== null) {
        localStorage.removeItem("tempHotel");
      }
    }
  }
};

/* -------------------- SET SORTING ORDER AND DISPLAY -------------------- */
var SortOrderFunction = function (sortSelect) {
  var ele = $(sortSelect);
  if (sortSelect == "#sort-hotel-price") {
    var sortPrice = ele[0].innerText;
    var splitPrice = sortPrice.split(" ");
    if (splitPrice[1] == "↓" || splitPrice[1] == undefined) {
      sortOrd = "PRICE";
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      $("#hotels-grid").empty();
      getProperties(
        tempHotel.cityid,
        curr,
        sortOrd,
        pageNumber,
        tempHotel.checkin,
        tempHotel.checkout,
        resultMax,
        adults
      );
      $("#sort-hotel-price").html("<b>PRICE ↑</b>"); // changes display based ascending or descending order
      $("#sort-hotel-rating").html("RATING");
    } else if (splitPrice[1] == "↑") {
      sortOrd = "PRICE_HIGHEST_FIRST";
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      $("#hotels-grid").empty();
      getProperties(
        tempHotel.cityid,
        curr,
        sortOrd,
        pageNumber,
        tempHotel.checkin,
        tempHotel.checkout,
        resultMax,
        adults
      );
      $("#sort-hotel-price").html("<b>PRICE ↓</b>"); // changes display based ascending or descending order
      $("#sort-hotel-rating").html("RATING");
    }
  } else if (sortSelect == "#sort-hotel-rating") {
    var sortRating = ele[0].innerText;
    var splitRating = sortRating.split(" ");
    if (splitRating[1] == "↓" || splitRating[1] == undefined) {
      sortOrd = "STAR_RATING_LOWEST_FIRST";
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      $("#hotels-grid").empty();
      getProperties(
        tempHotel.cityid,
        curr,
        sortOrd,
        pageNumber,
        tempHotel.checkin,
        tempHotel.checkout,
        resultMax,
        adults
      );
      $("#sort-hotel-price").html("PRICE"); // changes display based ascending or descending order
      $("#sort-hotel-rating").html("<b> RATING ↑</b>");
    } else if (splitRating[1] == "↑") {
      sortOrd = "STAR_RATING_HIGHEST_FIRST";
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      $("#hotels-grid").empty();
      getProperties(
        tempHotel.cityid,
        curr,
        sortOrd,
        pageNumber,
        tempHotel.checkin,
        tempHotel.checkout,
        resultMax,
        adults
      );
      $("#sort-hotel-price").html("<b>PRICE</b>"); // changes display based ascending or descending order
      $("#sort-hotel-rating").html("<b>RATING ↓</b>");
    }
  }
};

/* -------------------- PULL LOCAL STORAGE-------------------- */

setInitial();

/* -------------------- PROCESS REQUEST FOR HOTEL SEARCH-------------------- */
$("#form").on("submit", function (event) {
  if (hotelsTabEl.className === "uk-active") {
    event.preventDefault();
    // Read city value from form
    city = $("#going-to").val();
    city = city.trim();
    var spc2 = city.split("");
    var spc3 = spc2[1].trim();
    city = spc3;
    // Read check-in, check-out and # of guests value from form
    checkin = $("#check-in").val();
    checkout = $("#check-out").val();
    checkin = moment(checkin, "MM-DD-YYYY");
    checkin = moment(checkin).format("YYYY-MM-DD");
    checkout = moment(checkout, "MM-DD-YYYY");
    checkout = moment(checkout).format("YYYY-MM-DD");
    adults = $("#guests-select").val();

    $("#hotels-grid").empty(); // Empties previous display

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

    GetIdhotel(city, checkin, checkout);
  }
});

/* -------------------- PROCESS REQUEST FOR STORING HOTEL INFORMATION------------------- */
$(document).on("click", ".reserve", function () {
  event.preventDefault();
  var propval = this.getAttribute("id");
  var imageUrlElement = $(this)
    .parent()
    .parent()
    .parent()
    .children()
    .children("img");
  var urlTn = imageUrlElement[0].currentSrc;

  hotels = JSON.parse(localStorage.getItem("hotels"));

  //sets initial values if null

  if (hotels == null) {
    var hotels = [
      {
        IdCity: "",
        ChkInDate: "",
        ChkOutDate: "",
        NumAdults: "",
        Currcy: "",
        UrlThumbNl: "",
        dateSearch: "",
      },
    ];
    hotels[0].IdCity = propval;
    hotels[0].ChkInDate = checkin;
    hotels[0].ChkOutDate = checkout;
    hotels[0].NumAdults = adults;
    hotels[0].Currcy = curr;
    hotels[0].UrlThumbNl = urlTn;
    hotels[0].dateSearch = moment().format("YYYY-MM-DD");
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
        ChkInDate: checkin,
        ChkOutDate: checkout,
        UrlThumbNl: urlTn,
        Currcy: curr,
        NumAdults: adults,
        dateSearch: moment().format("YYYY-MM-DD"),
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
