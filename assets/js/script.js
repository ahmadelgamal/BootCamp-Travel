
var flightsBtn = document.querySelector("#flights-btn");

var hotelsBtn = document.querySelector("#hotels-btn");

var flightsContainer = document.querySelector("#flights-container");

var hotelsContainer = document.querySelector("#hotels-container");

var searchContainer = document.querySelector("#past-search-container");



var showFlightsMenu = function () {


    var goingFrom = document.querySelector("#going-from").parentElement.parentElement;
    goingFrom.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");

    var trip = document.querySelector("#trip");
    trip.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");


    var checkIn = document.querySelector("#check-in").parentElement.parentElement;
    checkIn.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");

    var checkOut = document.querySelector("#check-out").parentElement.parentElement;
    checkOut.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");

    var dDeparture = document.querySelector("#date-departure").parentElement.parentElement;
    dDeparture.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");

    var dArrival = document.querySelector("#date-arrival").parentElement.parentElement;
    dArrival.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");




}

var showHotelsMenu = function () {


    var goingFrom = document.querySelector("#going-from").parentElement.parentElement;
    goingFrom.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");

    var trip = document.querySelector("#trip");
    trip.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");


    var checkIn = document.querySelector("#check-in").parentElement.parentElement;
    checkIn.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");

    var checkOut = document.querySelector("#check-out").parentElement.parentElement;
    checkOut.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");


    var dDeparture = document.querySelector("#date-departure").parentElement.parentElement;
    dDeparture.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");

    var dArrival = document.querySelector("#date-arrival").parentElement.parentElement;
    dArrival.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");

  

}


var showFlights = function () {

    searchContainer.style.display = "none";
    hotelsContainer.style.display = "none";
    flightsContainer.style.display = "";

}

var showHotels = function () {


    hotelsContainer.style.display = "";
    flightsContainer.style.display = "none";
    searchContainer.style.display = "none";

}


var showSearchHistory = function (){

    hotelsContainer.style.display = "none";
    flightsContainer.style.display = "none";
    searchContainer.style.display = "";

}



var flightsHandler = function (event) {



    showFlightsMenu();

    showFlights();
}


var hotelsHandler = function (event) {



    showHotelsMenu();

    showHotels();



}

var init = function () {



    showSearchHistory();
}




// source https://www.w3schools.com/howto/howto_js_autocomplete.asp

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        var max = 0;
        var icon = 0;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);


        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                if (max++ >= 4) break;
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].name.substr(val.length) + ", " + arr[i].country;

                if (this.id == "going-from") icon = "&#xf5b0; ";
                if (this.id == "going-to") icon = "&#xf5af; ";
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input class='fa' type='hidden' value='" + icon + arr[i].name + ", " + arr[i].subcountry + ", " + arr[i].country + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    console.log(this.parentNode);
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("going-from"), mainCities);
autocomplete(document.getElementById("going-to"), mainCities);


flightsBtn.addEventListener("click", flightsHandler);
hotelsBtn.addEventListener("click", hotelsHandler);

init();

/*
fetch("https://hotels4.p.rapidapi.com/properties/get-details?locale=en_US&currency=USD&checkOut=2020-01-15&adults1=1&checkIn=2020-01-08&id=424023", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "hotels4.p.rapidapi.com",
		"x-rapidapi-key": "93082b1212mshd3a2c1d12755730p1e1d81jsnb5d712dfa144"
    }})
    .then(function(response){

return response.json();
    })
    .then(function(data)
    {

console.log(data);
    });
    */


   var getFlightOffersSearch = function () {
    // HARDCODING. MUST BE CHANGED TO USER INPUT
    var originCode = "LAX";
    var destinationCode = "CDG";
    var departureDate = "2020-10-10";
    var numberOfAdults = "1";
    var currencyCode = "USD";
  
    // amadeus variables
    var host = "https://test.api.amadeus.com/";
    var flightOffersSearchPath = "v2/shopping/flight-offers";
    var queryOrigin = "?originLocationCode=";
    var queryDestination = "&destinationLocationCode=";
    var queryDepartureDate = "&departureDate=";
    var queryNumberOfAdults = "&adults=";
    var queryCurrency = "&currencyCode=";
  
    var apiUrl =
      host +
      flightOffersSearchPath +
      queryOrigin +
      originCode +
      queryDestination +
      destinationCode +
      queryDepartureDate +
      departureDate +
      queryNumberOfAdults +
      numberOfAdults + 
      queryCurrency +
      currencyCode;
  
  
    // access token must be renewed for 30 minutes at a time
    var accessToken = "pY8hWWrNcbp2dAVEJkseMH0me3it";
    var authorizationValue = "Bearer " + accessToken;
  
    fetch(apiUrl, {
      "method": "GET",
      "headers": {
        "Authorization": authorizationValue,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  };


  getFlightOffersSearch();


