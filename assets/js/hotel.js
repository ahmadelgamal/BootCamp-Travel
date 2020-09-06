
/* -------------------- BEGINS DECLARATIONS OF GLOBAL VARIABLES -------------------- */
var city = ""; // Identifies city to be searched
var checkin = ""; //Check-in date
var checkout = ""; // Check-out date
var id = 0;
var urls = []; // URLs of the images
var maxHistoryLength = 3; // History length
var urlKey = "8f0c28b4b3msh8821bf07d58b33ep177991jsn8c90db7e5dc0"; // URL Key
var newHotellay1 = document.getElementById("hotels-grid"); // Get parent element of HTML document
var pageNumber = 1; // # of pages to display
var resultMax = 3; // # of hotels to show up in a single request
var adults = 1; // # of adults
curr = "USD"; // Currency
var sortOrd = "PRICE"; // Sort order
var outcome = false;
// Object for local storage
var hotels = [
    {
        IdCity: "",
        ChkInDate: "",
        ChkOutDate: "",
        NumAdults: "",
        Currcy: "",
        UrlThumbNl: "",
        dateSearch: ""
    }];

/* -------------------- DISPLAYS PROPERTY INFORMATION BASED ON THE PROPERTIES IDs RETURNED WITHIN A CITY -------------------- */

var displayPropertyInfo = function (identity, checkindate, checkoutdate, numberofadults, currency, j, urlTh) {

    formurl = "https://cors-anywhere.herokuapp.com/https://hotels4.p.rapidapi.com/properties/get-details?locale=en_US&currency=" + currency + "&checkOut=" + checkoutdate + "&adults1=" + numberofadults + "&checkIn=" + checkindate + "&id=" + identity;
    fetch(formurl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "hotels4.p.rapidapi.com",
            "x-rapidapi-key": urlKey
        }
    })
        .then(function (response) {

            response.json().then(function (data3) {

                var reviewRating = data3.data.body.guestReviews.brands.rating; // Rating information
                var totalReviews = data3.data.body.guestReviews.brands.total; // Total reviews
                var propertyName = data3.data.body.propertyDescription.name; // Hotel name
                //  var cityName = data3.data.body.propertyDescription.address.cityName;
                var price = data3.data.body.propertyDescription.featuredPrice.currentPrice.formatted; // Hotel price
                var tagline = data3.data.body.propertyDescription.tagline; // Tagline describing hotel
                var neighborhood = data3.neighborhood.neighborhoodName; // Hotel's neighborhood

                // Add DOM elements to display the property
                var hotellayvar = "hotellay" + j.toString();
                $(newHotellay1).append('<div class = "uk-grid uk-border-rounded uk-background-default uk-padding-remove-horizontal" id = "' + hotellayvar + '">');
                var newHotellay2 = document.getElementById(hotellayvar);

                $(newHotellay2).append('<div class="uk-border-rounded uk-width-1-3@m uk-width1-1@s uk-background-muted"> <img class="uk-border-rounded" src=' + urlTh + '> </div>');

                $(newHotellay2).append('<div class="uk-grid uk-width-2-3@m uk-width-1-1@s"> <div class="uk-width-1-2 uk-margin-medium"> <h4>' + propertyName + '<br>' + tagline + ' </h4>  <p>' + neighborhood + ' <br> <span class="uk-text-success">Reserve Now, Pay Later</span><br> <span class="uk-text-success">Free Cancellation</span> </p>  <span class="uk-position-bottom uk-position-relative">' + reviewRating + '/10 Rating (' + totalReviews + ' Reviews)</span></div> <div class="uk-border-rounded uk-width-1-2 uk-padding-small uk-padding-remove-horizontal price"> <h2 class="uk-margin-remove-vertical">' + price + '</h2> <b>per Night</b> <button class="reserve uk-button uk-margin-large-top uk-margin-remove-horizontal uk-button-large uk-button-primary uk-border-rounded" id="' + identity + '">Reserve</button> </div> </div>');
            })
        })
        .catch(err => {
            console.log(err);
        });
}

/* -------------------- Obtain ID for City required for property search-------------------- */

var GetIdhotel = function (City, checkIn, checkOut) {

    console.log("cc " + City + "check  " + checkIn + "cehck ot" + checkOut);

    fetch("https://cors-anywhere.herokuapp.com/https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=" + City, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "hotels4.p.rapidapi.com",
            "x-rapidapi-key": urlKey
        }
    })

        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {

                    // Get property information based on city search
                    if (data.suggestions[0].entities.length !== 0) {
                        if ($(".temporary")) { $(".temporary").empty() };
                        var ide = data.suggestions[0].entities[0].destinationId;
                        getProperties(ide, curr, sortOrd, pageNumber, checkIn, checkOut, resultMax, adults);
                    }
                    else {

                        $("body").append('<div class = "temporary"> Sorry, information for this property is not available. Coming soon. Please try another city </div'); // Message incase there is no property information or city is not found
                    }

                })
            }
        })
        .catch(function (error) {
            console.log(err);

        })

}

/* -------------------- PROPERTY INFORMATION BASED ON CITY ID -------------------- */
var getProperties = function (idcity, currency, sortOrder, pgNumb, checkInDate, checkOutDate, pgSize, adultNumber) {

    var url6 = "https://cors-anywhere.herokuapp.com/https://hotels4.p.rapidapi.com/properties/list?currency=" + currency + "&locale=en_US&sortOrder=" + sortOrder + "&destinationId=" + idcity + "&pageNumber=" + pgNumb + "&checkIn=" + checkInDate + "&checkOut=" + checkOutDate + "&pageSize=" + pgSize + "&adults=" + adultNumber

    fetch(url6, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "hotels4.p.rapidapi.com",
            "x-rapidapi-key": urlKey
        }
    })

        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data6) {

                    $("#hotels-container").css('display', 'flex'); // Unhide the document class

                    var propId = [];
                    propId = data6.data.body.searchResults.results;

                    for (i = 0; i < propId.length; i++) {
                        // for (k = 0; k < 1000000000; k++) { }; // Meant to throttle API call to maintain less that 5 calls in a second
                        var propIde = [];
                        propIde[i] = data6.data.body.searchResults.results[i].id;
                        var urlThumb = data6.data.body.searchResults.results[i].thumbnailUrl;
                        var url3 = urlThumb.split('_');
                        var url4 = url3[0] + "_y.jpg"; // URL for property image
                        displayPropertyInfo(propIde[i], checkInDate, checkOutDate, adultNumber, currency, i, url4);

                    }
                })
            }
        })

        .catch(function (error) {
            console.log(err);
        })

}
/* -------------------- PULL LOCAL STORAGE DATA AND HOTELS -------------------- */
var setInitial = function () {


    hotels = JSON.parse(localStorage.getItem("hotels"));

    if (!(hotels == null)) {
        for (i = 0; i < hotels.length; i++) {
            displayPropertyInfo(hotels[i].IdCity, hotels[i].ChkInDate, hotels[i].ChkOutDate, hotels[i].NumAdults, hotels[i].Currcy, i, hotels[i].UrlThumbNl);
        }
    }
}

/* -------------------- PULL LOCAL STORAGE-------------------- */

setInitial(); 

/* -------------------- PROCESS REUQEST FOR HOTEL SEARCH-------------------- */
$("#form").on("submit", function (event) {
    event.preventDefault();
    city = $("#going-to").val();
    city = city.trim();
    var spc2 = city.split("");
    var spc3 = spc2[1].trim();
    city = spc3;
    checkin = $("#check-in").val();
    checkout = $("#check-out").val();
    checkin = moment(checkin, "MM-DD-YYYY");
    checkin = moment(checkin).format("YYYY-MM-DD")
    checkout = moment(checkout, "MM-DD-YYYY");
    checkout = moment(checkout).format("YYYY-MM-DD")
    $("#hotels-grid").empty();
    GetIdhotel(city, checkin, checkout);
});

/* -------------------- PROCESS REUQEST FOR STORING HOTEL INFORMATION------------------- */
$(document).on("click", ".reserve", function () {

    event.preventDefault();
    var propval = this.getAttribute("id");
    var imageUrlElement = $(this).parent().parent().parent().children().children("img");
    var urlTn = imageUrlElement[0].currentSrc

    hotels = JSON.parse(localStorage.getItem("hotels"));

    if ((hotels == null)) {
        var hotels = [
            {
                IdCity: "",
                ChkInDate: "",
                ChkOutDate: "",
                NumAdults: "",
                Currcy: "",
                UrlThumbNl: "",
                dateSearch: ""
            }];
        hotels[0].IdCity = propval;
        hotels[0].ChkInDate = checkin;
        hotels[0].ChkOutDate = checkout;
        hotels[0].NumAdults = adults;
        hotels[0].Currcy = curr;
        hotels[0].UrlThumbNl = urlTn;
        hotels[0].dateSearch = moment().format("YYYY-MM-DD");
    }

    else {
        for (i = 0; i < hotels.length; i++) {
            if (hotels[i].IdCity === propval) { outcome = true; }
        };

        if (outcome === false) {
            if (hotels.length == maxHistoryLength) {
                hotels.shift();
            }
            hotels.push({ IdCity: propval, ChkInDate: checkin, ChkOutDate: checkout, UrlThumbNl: urlTn, Currcy: curr, NumAdults: adults, dateSearch: moment().format("YYYY-MM-DD") });

        }
    }

    localStorage.setItem("hotels", JSON.stringify(hotels));
    outcome = false;
});

