
var city = "";
var checkin = "";
var checkout = "";
var id = 0;
var urls = [];
var maxHistoryLength = 3;
var urlKey = "3b66244881msh6022e37d9964003p1a70a4jsn2f3d77454263";
var newHotellay1 = document.getElementById("hotels-grid");
var pageNumber = 1;
var resultMax = 1;
var adults = 1;
curr = "USD";
var sortOrd = "PRICE";
var hotels = {
    IdCity: [],
    ChkInDate: [],
    ChkOutDate: [],
    NumAdults: [],
    Currcy: [],
    UrlThumbNl: [],
    dateSearch: []
}


var displayPropertyInfo = function (identity, checkindate, checkoutdate, numberofadults, currency, j, urlTh) {


    formurl = "https://hotels4.p.rapidapi.com/properties/get-details?locale=en_US&currency=" + currency + "&checkOut=" + checkoutdate + "&adults1=" + numberofadults + "&checkIn=" + checkindate + "&id=" + identity;

    fetch(formurl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "hotels4.p.rapidapi.com",
            "x-rapidapi-key": urlKey
        }
    })
        .then(function (response) {

            response.json().then(function (data3) {

                var reviewRating = data3.data.body.guestReviews.brands.rating;
                var totalReviews = data3.data.body.guestReviews.brands.total;
                var propertyName = data3.data.body.propertyDescription.name;
                //  var cityName = data3.data.body.propertyDescription.address.cityName;
                var price = data3.data.body.propertyDescription.featuredPrice.currentPrice.formatted;
                var tagline = data3.data.body.propertyDescription.tagline;
                var neighborhood = data3.neighborhood.neighborhoodName;

                var hotellayvar = "hotellay" + j.toString();
                console.log("urrrl: " + urlTh);
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

var GetIdhotel = function (City, checkIn, checkOut) {

    console.log("cc " + City + "check  " + checkIn + "cehck ot" + checkOut);

    fetch("https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=" + City, {
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

                    console.log(data);
                    var ide = data.suggestions[0].entities[0].destinationId;

                    getProperties(ide, curr, sortOrd, pageNumber, checkIn, checkOut, resultMax, adults);

                })
            }
        })
        .catch(function (error) {
            console.log(err);
        })

}
var getProperties = function (idcity, currency, sortOrder, pgNumb, checkInDate, checkOutDate, pgSize, adultNumber) {

    var url6 = "https://hotels4.p.rapidapi.com/properties/list?currency=" + currency + "&locale=en_US&sortOrder=" + sortOrder + "&destinationId=" + idcity + "&pageNumber=" + pgNumb + "&checkIn=" + checkInDate + "&checkOut=" + checkOutDate + "&pageSize=" + pgSize + "&adults=" + adultNumber

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
                    console.log(data6);

                    $("#hotels-container").css('display', 'flex');

                    var propId = [];
                    propId = data6.data.body.searchResults.results;

                    for (i = 0; i < propId.length; i++) {
                        for (k = 0; k < 1000000000; k++) { };
                        var propIde = [];
                        propIde[i] = data6.data.body.searchResults.results[i].id;
                        var urlThumb = data6.data.body.searchResults.results[i].thumbnailUrl;
                        var url3 = urlThumb.split('_');
                        var url4 = url3[0] + "_y.jpg";
                        displayPropertyInfo(propIde[i], checkInDate, checkOutDate, adultNumber, currency, i , url4);

                    }
                })
            }
        })

        .catch(function (error) {
            console.log(err);
        })

}

var setInitial = function() {

    hotels.IdCity = JSON.parse(localStorage.getItem("cityId"));
    hotels.ChkInDate = JSON.parse(localStorage.getItem("checkInDate"));
    hotels.ChkOutDate = JSON.parse(localStorage.getItem("checkOutDate"));
    hotels.NumAdults = JSON.parse(localStorage.getItem("numberAdults"));
    hotels.UrlThumbNl = JSON.parse(localStorage.getItem("urlThumbNail"));
    hotels.dateSearch = JSON.parse(localStorage.getItem("dateSearch"));
    hotels.Currcy = JSON.parse(localStorage.getItem("currency"));


    for (i=0; i<hotels.IdCity.length; i++){

        displayPropertyInfo(hotels.IdCity[i], hotels.ChkInDate[i], hotels.ChkOutDate[i], hotels.NumAdults[i], hotels.Currcy[i], i, hotels.UrlThumbNl[i]);
    }
  
}

setInitial();

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


$(document).on("click", ".reserve", function () {

    event.preventDefault();

    var propval = this.getAttribute("id");
    var imageUrlElement = $(this).parent().parent().parent().children().children("img");
    var urlTn = imageUrlElement[0].currentSrc

    if ((hotels.IdCity == "")) {
        hotels.IdCity[0] = propval;
        hotels.ChkInDate[0] = checkin;
        hotels.ChkOutDate[0] = checkout;
        hotels.NumAdults[0] = adults;
        hotels.Currcy[0] = curr;
        hotels.UrlThumbNl[0] = urlTn;
        hotels.dateSearch[0] = moment().format("YYYY-MM-DD");
        console.log(hotels);
    }

    else if (!(hotels.IdCity.includes(propval))) {

        console.log("hotelcity:  " + hotels.IdCity);
        if (hotels.IdCity.length == maxHistoryLength) {
            hotels.IdCity.shift();
            hotels.ChkInDate.shift();
            hotels.ChkOutDate.shift();
            hotels.UrlThumbNl.shift();
            hotels.Currcy.shift();
            hotels.NumAdults.shift();
            hotels.dateSearch.shift();
        }

        hotels.IdCity.push(propval);
        hotels.ChkInDate.push(checkin);
        hotels.ChkOutDate.push(checkout);
        hotels.UrlThumbNl.push(urlTn);
        hotels.Currcy.push(curr);
        hotels.NumAdults.push(adults);
        hotels.dateSearch.push(moment().format("YYYY-MM-DD"));
        console.log(hotels);

    }

    localStorage.setItem("cityId", JSON.stringify(hotels.IdCity));
    localStorage.setItem("checkInDate", JSON.stringify(hotels.ChkInDate));
    localStorage.setItem("checkOutDate", JSON.stringify(hotels.ChkOutDate));
    localStorage.setItem("numberAdults", JSON.stringify(hotels.NumAdults));
    localStorage.setItem("urlThumbNail", JSON.stringify(hotels.UrlThumbNl));
    localStorage.setItem("dateSearch", JSON.stringify(hotels.dateSearch));
    localStorage.setItem("currency", JSON.stringify(hotels.Currcy));
});

