
var id = 0;
var urls = [];
var urlKey = "d351718311msh1c40add783cf9f0p106e07jsn94643e004895";
var newHotellay1 = document.getElementById("hotels-grid");


var pageNumber = 1;
var resultMax = 2;

checkin = moment("09/21/2020", "MM-DD-YYYY");
checkin = moment(checkin).format("YYYY-MM-DD")
checkout = moment("09/26/2020", "MM-DD-YYYY");
checkout = moment(checkout).format("YYYY-MM-DD")
var adults = 1;
curr = "USD";
var sortOrd = "PRICE";








/*var GetId = function(city) {

    fetch("https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query="+city, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "hotels4.p.rapidapi.com",
		"x-rapidapi-key": urlKey
	}
})

.then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
         console.log(data);
             
            
                var ide = [];
                var idc = [];
                ide = data.suggestions[3].entities;
                   for (i=0; i < ide.length; i++){

                    for (k=0 ; k<1000000000; k++){};

                  idc[i] = data.suggestions[3].entities[i].destinationId;
                  urls[i] = "https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id="+idc[i];
                  displayPropertyInfo(idc[i],checkin,checkout,adults,curr)
                  displayImage(urls[i]);     

                   }
          })
      }  
    })

    .catch(function(error) {
        console.log(err);
    })

}
*/

var displayImage = function (url) {

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
                
               $("#hotellay1").append('<div class="uk-border-rounded uk-width-1-3@m uk-width1-1@s uk-background-muted" id="hotellay2"> <img class="uk-border-rounded" src='+url4+'> </div>');
            })
        })
        .catch(err => {
            console.log(err);
        });


}

var displayPropertyInfo = function (identity, checkindate, checkoutdate, numberofadults, currency) {

    formurl = "https://hotels4.p.rapidapi.com/properties/get-details?locale=en_US&currency=" + curr + "&checkOut=" + checkoutdate + "&adults1=" + numberofadults + "&checkIn=" + checkindate + "&id=" + identity;

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
                var cityName = data3.data.body.propertyDescription.address.cityName;
                var cityState = data3.data.body.propertyDescription.address.provinceName;
                var fullAddress = data3.data.body.propertyDescription.address.fullAddress;
                var price = data3.data.body.propertyDescription.featuredPrice.currentPrice.formatted;
                var tagline = data3.data.body.propertyDescription.tagline;
                var freebies = data3.data.body.propertyDescription.freebies;
                var neighborhood = data3.neighborhood.neighborhoodName;
                var features = [];
                var featuresText = "";
                features = data3.data.body.overview.overviewSections[0].content;
                for (i = 0; i < features.length; i++) {
                    featuresText = featuresText + (features[i] + ".");
                }


             
                
                
                $(newHotellay1).append('<div class = "uk-grid uk-border-rounded uk-background-default uk-padding-remove-horizontal" id = "hotellay1">');
                var newHotellay2 = document.getElementById("hotellay1");
                // $(newHotellay2).append('<div class="uk-border-rounded uk-width-1-3@m uk-width1-1@s uk-background-muted" id="hotellay2"> <img class="uk-border-rounded" src="https://images.trvl-media.com/hotels/43000000/42280000/42279900/42279838/4fbd4c93.jpg"> </div>');
                $(newHotellay2).append('<div class="uk-grid uk-width-2-3@m uk-width-1-1@s"> <div class="uk-width-1-2 uk-margin-medium"> <h4>' + propertyName+'<br>' +tagline + ' "</h4>  <p>' + neighborhood + ' <br> <span class="uk-text-success">Reserve Now, Pay Later</span><br> <span class="uk-text-success">Free Cancellation</span> </p>  <span class="uk-position-bottom uk-position-relative">' + reviewRating + '/10 Rating (' + totalReviews + ' Reviews)</span>  </div>');
                $(newHotellay2).append('<div class="uk-border-rounded uk-width-1-2 uk-padding-small uk-padding-remove-horizontal price"> <h2 class="uk-margin-remove-vertical">' + price + '</h2> <b>per Night</b> <button class="uk-button uk-margin-large-top uk-margin-remove-horizontal uk-button-large uk-button-primary uk-border-rounded hide">Reserve</button> </div>');

            })
        })
        .catch(err => {
            console.log(err);
        });

}

var GetIdhotel = function (city) {

    fetch("https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=" + city, {
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



                    var ide = data.suggestions[0].entities[0].destinationId;
                    getProperties(ide, curr, sortOrd, pageNumber, checkin, checkout, resultMax, adults);

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
                        var urlb = "https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id=" + propIde[i];
                        displayImage(urlb);
                        displayPropertyInfo(propIde[i], checkInDate, checkOutDate, adultNumber, currency);

                    }
                })  
            }
        })

        .catch(function (error) {
            console.log(err);
        })

}

var ids = GetIdhotel("Sacramento");
