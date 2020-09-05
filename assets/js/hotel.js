
var id = 0;
var urls = [];
var urlKey = "65d33f6388mshf2a0d623af782fdp16ab98jsn692079e3395f";
var newHotellay1 = document.getElementById("hotels-grid");
var pageNumber = 1;
var resultMax = 3;

var adults = 1;
curr = "USD";
var sortOrd = "PRICE";


/* var getImage = function (url, j) {

    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "hotels4.p.rapidapi.com",
            "x-rapidapi-key": urlKey
        }
    })

        .then(function (response) {

            response.json().then(function (data2) {

                var url2 = data2.hotelImages[0].baseUrl;
                var url3 = url2.split('_');
                var url4 = url3[0] + "_y.jpg";
                var hotellayvar = "hotellay" + j.toString();
                console.log("vally:  " + hotellayvar);


                var hotellayvar = "hotellay" + j.toString();
                $(newHotellay1).append('<div class = "uk-grid uk-border-rounded uk-background-default uk-padding-remove-horizontal" id = "' + hotellayvar + '">');
                var newHotellay2 = document.getElementById(hotellayvar);
                $(newHotellay2).append('<div class="uk-border-rounded uk-width-1-3@m uk-width1-1@s uk-background-muted"> <img class="uk-border-rounded" src=' + url4 + '> </div>');
            })
        })
        .catch(err => {
            console.log(err);
        });

}
*/
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
                //  var cityState = data3.data.body.propertyDescription.address.provinceName;
                //  var fullAddress = data3.data.body.propertyDescription.address.fullAddress;
                var price = data3.data.body.propertyDescription.featuredPrice.currentPrice.formatted;
                var tagline = data3.data.body.propertyDescription.tagline;
                //   var freebies = data3.data.body.propertyDescription.freebies;
                var neighborhood = data3.neighborhood.neighborhoodName;
                //    var features = [];
                //    var featuresText = "";
                //     features = data3.data.body.overview.overviewSections[0].content;
                //      for (i = 0; i < features.length; i++) {
                //         featuresText = featuresText + (features[i] + ".");
                //     }


                var hotellayvar = "hotellay" + j.toString();
                // console.log (newHotellay2);
                // if (newHotellay2) {
                //  console.log("okie dokie");
                console.log("urrrl: " + urlTh);
                $(newHotellay1).append('<div class = "uk-grid uk-border-rounded uk-background-default uk-padding-remove-horizontal" id = "' + hotellayvar + '">');
                var newHotellay2 = document.getElementById(hotellayvar);
                // var newHotellay2 = document.getElementById(hotellayvar);
                //  }

                $(newHotellay2).append('<div class="uk-border-rounded uk-width-1-3@m uk-width1-1@s uk-background-muted"> <img class="uk-border-rounded" src=' + urlTh + '> </div>');

                $(newHotellay2).append('<div class="uk-grid uk-width-2-3@m uk-width-1-1@s"> <div class="uk-width-1-2 uk-margin-medium"> <h4>' + propertyName + '<br>' + tagline + ' </h4>  <p>' + neighborhood + ' <br> <span class="uk-text-success">Reserve Now, Pay Later</span><br> <span class="uk-text-success">Free Cancellation</span> </p>  <span class="uk-position-bottom uk-position-relative">' + reviewRating + '/10 Rating (' + totalReviews + ' Reviews)</span></div> <div class="uk-border-rounded uk-width-1-2 uk-padding-small uk-padding-remove-horizontal price"> <h2 class="uk-margin-remove-vertical">' + price + '</h2> <b>per Night</b> <button class="uk-button uk-margin-large-top uk-margin-remove-horizontal uk-button-large uk-button-primary uk-border-rounded">Reserve</button> </div> </div>');

            })
        })
        .catch(err => {
            console.log(err);
        });

}

var GetIdhotel = function (City,checkIn,checkOut) {

    console.log ("cc "+ City + "check  "+ checkIn + "cehck ot"+ checkOut);

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
                    //    var urlb = "https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id=" + propIde[i];
                        //     getImage(urlb, i);
                        displayPropertyInfo(propIde[i], checkInDate, checkOutDate, adultNumber, currency, i, url4);

                    }
                })
            }
        })

        .catch(function (error) {
            console.log(err);
        })

}

//GetIdhotel("Chicago");

$("#form").on("submit", function (event) {
    event.preventDefault();
    var city = $("#going-to").val();
    city = city.trim();
    console.log("cititi  "+ city);
    var spc2 = city.split("");
    var spc3 = spc2[1].trim();
    console.log(spc3);  
    city = spc3;

    var checkin = $("#check-in").val();
    var checkout = $("#check-out").val();
    checkin = moment(checkin, "MM-DD-YYYY");
    checkin = moment(checkin).format("YYYY-MM-DD")
    checkout = moment(checkout, "MM-DD-YYYY");
    checkout = moment(checkout).format("YYYY-MM-DD")
   GetIdhotel(city,checkin,checkout);
});



