/* -------------------- BEGINS DECLARATIONS OF GLOBAL VARIABLES -------------------- */
var city = ""; // Identifies city to be searched
var checkInDt = ""; //Check-in date
var checkOutDt = ""; // Check-out date
var id = 0;
var urls = []; // URLs of the images
var maxHistoryLength = 5; // History length
var urlKey = "083f233336mshc03be33994e1ed0p1698afjsnc157beab7f7c"; // URL Key
var newHotellay = document.getElementById("hotels-grid"); // Get parent element of HTML document from search
var newInitlay = document.getElementById("hotel-favorites-grid");// Get parent element of HTML document during initalization
var pageNumber = 1; // # of pages to display
var resultMax = 20; // # of hotels to show up in a single request
var adults = 1; // # of adults
curr = "USD"; // Currency
var sortOrd = "PRICE"; // Sort order
var outcome = false;
var symbol = "↑";

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
  
  var hotellayvar = "hotellay" + newHotellay1.id+ j.toString();
  // the parent element in newHotelallay1 will depend on whether it needs to be displayed as a search result or favorite
  $(newHotellay1).append(
    '<div class = "uk-grid uk-border-rounded uk-width-1-1 uk-background-default uk-padding-remove-horizontal margin-zero" id = "' +
    hotellayvar +
    '">'
  );
  var newHotellay2 = document.getElementById(hotellayvar);


  $(newHotellay2).append(
    '<div class="uk-border-rounded uk-width-1-3@m uk-width1-1@s uk-background-cover" style="background-image:url('+ urlTh +')"> </div>'
  );
  if ((newHotellay1.id)=="hotels-grid") {
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
      '<span> Reviews)</span></div> <div class="uk-border-rounded uk-width-1-2 uk-padding-small uk-padding-remove-horizontal price"> <h2 class="uk-margin-remove-vertical">' +
      pricee +
      '</h2> <b>per Night</b>'+ '<br> <p> Check-In: ' +checkindate+'<br> Check-Out: ' +checkoutdate+'<br> Adults: ' +numberofadults+'</p> </div>  </div>'
    );
  }
}

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
              propertyId: ide,
              checkInDt: checkIn,
              checkOutDt: checkOut,
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
          $("#hotels-container").css("display", ""); // Unhide the document class

          if (data6.data.body.searchResults.results.length !== 0) {
            var propId = [];
            propId = data6.data.body.searchResults.results;
            if ($(".temporary")) {
              $(".temporary").empty();
            }
            for (i = 0; i < propId.length; i++) {
              // the if statements account for any information on the server that might be undefined 
              var propIde = [];
              propIde[i] = data6.data.body.searchResults.results[i].id;
             
              if ((typeof data6.data.body.searchResults.results[i].thumbnailUrl) == "undefined"){
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

                var address= "Missing Address Information"

              }
              else {

                var address = data6.data.body.searchResults.results[i].address.streetAddress + "<br>" + data6.data.body.searchResults.results[i].address.locality + ", " + data6.data.body.searchResults.results[i].address.region + " " + data6.data.body.searchResults.results[i].address.postalCode + "<br>" + data6.data.body.searchResults.results[i].address.countryName;

              }

              if ((typeof data6.data.body.searchResults.results[i].neighbourhood)== "undefined") {
                var neighbourhoodName = "Missing Neighbourhood Information";
              }
              else {
                var neighbourhoodName = data6.data.body.searchResults.results[i].neighbourhood;
              }

              if ((typeof data6.data.body.searchResults.results[i].ratePlan.price == "undefined")) {
                price = "Missing Price Information";
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
  $("#hotels-sub-menu").hide();
  if (!(hotels == null)) {
    for (i = 0; i < hotels.length; i++) {
      sortOrd = "PRICE";
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
        tempHotel.propertyId,
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
      getProperties(
        tempHotel.propertyId,
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
    if (splitRating[1] == "↓" || splitRating[1] == undefined) {
      sortOrd = "STAR_RATING_LOWEST_FIRST";
      var tempHotel = JSON.parse(localStorage.getItem("tempHotel"));
      $("#hotels-grid").empty();
      getProperties(
        tempHotel.propertyId,
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
      getProperties(
        tempHotel.propertyId,
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

/* -------------------- PULL LOCAL STORAGE-------------------- */

setInitial();

/* -------------------- PROCESS REQUEST FOR HOTEL SEARCH-------------------- */
$("#form").on("submit", function (event) {
  if (hotelsTabEl.className === "uk-active") {
    event.preventDefault();
    // Read city value from form
    city = $("#hotel-city").val();
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

    GetIdhotel(city, checkInDt, checkOutDt);
    $("#hotels-sub-menu").show();
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
    .children("img");
  var urlTn = imageUrlElement[0].currentSrc;
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


  hotels = JSON.parse(localStorage.getItem("hotels"));

  //sets initial values if null

  if (hotels == null) {
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
  // Add the new favorite to favorite display
  displayPropertyInfo(
    newInitlay,
    hotels[hotels.length-1].IdCity,
    hotels[hotels.length-1].ChkInDate,
    hotels[hotels.length-1].ChkOutDate,
    hotels[hotels.length-1].NumAdults,
    hotels[hotels.length-1].Currcy,
    hotels.length-1,
    hotels[hotels.length-1].UrlThumbNl,
    hotels[hotels.length-1].rating,
    hotels[hotels.length-1].hotelName,
    hotels[hotels.length-1].address,
    hotels[hotels.length-1].guestReviews,
    hotels[hotels.length-1].neighborhood,
    hotels[hotels.length-1].price
  );

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
