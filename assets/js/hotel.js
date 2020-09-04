
var id = 0;
var urls = [];
var urlKey = "d351718311msh1c40add783cf9f0p106e07jsn94643e004895";


var pageNumber = 1;
var resultMax = 5;

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
    
        .then(function(response) {
            
            response.json().then(function(data2) {
            console.log(data2);
            var url2 = data2.hotelImages[0].baseUrl;
            var url3 = url2.split('_');
            var url4 = url3[0]+"_y.jpg"; 
            console.log(url4);
        })
    })
        .catch(err => {
            console.log(err);
        });


    }

    var displayPropertyInfo = function (identity,checkindate,checkoutdate,numberofadults,currency) {
        console.log ("identity: "+ identity);
        console.log("check-in: " + checkindate);
        console.log("check-out: " + checkoutdate);
        console.log("number of adults: " + numberofadults);
        console.log("currency: " + curr)
        formurl = "https://hotels4.p.rapidapi.com/properties/get-details?locale=en_US&currency="+curr+"&checkOut="+checkoutdate+"&adults1="+numberofadults+"&checkIn="+checkindate+"&id="+identity;
        console.log(formurl);
        fetch(formurl, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "hotels4.p.rapidapi.com",
		"x-rapidapi-key": urlKey
	}
})
.then(function(response) {
            
    response.json().then(function(data3) {
    console.log(data3);     
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
    for (i=0;i <features.length; i++){
        featuresText = featuresText + (features[i]+ ".");
    }
    console.log(price);
})
})
.catch(err => {
    console.log(err);
});

    }   

    var GetIdhotel = function(city) {

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
                 
            
                    var ide = data.suggestions[0].entities[0].destinationId;
                    getProperties (ide,curr,sortOrd,pageNumber,checkin, checkout,resultMax,adults);
                     
              })
          }  
        })
    
        .catch(function(error) {
            console.log(err);
        })
    
    }
    var getProperties = function(idcity,currency,sortOrder,pgNumb,checkInDate,checkOutDate, pgSize,adultNumber) {

        var url6 = "https://hotels4.p.rapidapi.com/properties/list?currency="+currency+"&locale=en_US&sortOrder="+sortOrder+"&destinationId="+idcity+"&pageNumber="+pgNumb+"&checkIn="+checkInDate+"&checkOut="+checkOutDate+"&pageSize="+pgSize+"&adults="+adultNumber

        fetch(url6, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "hotels4.p.rapidapi.com",
            "x-rapidapi-key": urlKey
        }
    })
    
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data6) {
             console.log(data6);
                 
                   
                   var propId = [];
                   propId = data6.data.body.searchResults.results;
                   for (i=0; i < propId.length; i++){

                    for (k=0 ; k<1000000000; k++){};
                    
                    var propIde = [];
                    console.log(propId[i]);

                    propIde[i] = data6.data.body.searchResults.results[i].id;
                    var urlb = "https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id="+propIde[i];
                    displayImage(urlb);
                    displayPropertyInfo(propIde[i],checkInDate,checkOutDate,adultNumber,currency)

                   }
              })
          }  
        })
    
        .catch(function(error) {
            console.log(err);
        })
    
    }

    var ids = GetIdhotel ("Sacramento");
   