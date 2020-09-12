var flightsBtn = document.querySelector("#flights-btn");
var hotelsBtn = document.querySelector("#hotels-btn");
var menuTabs = document.querySelector("#menu-tabs");

var tripSelector = document.querySelector("#trip");

var flightsContainer = document.querySelector("#flights-container");
var hotelsContainer = document.querySelector("#hotels-container");
var searchContainer = document.querySelector("#past-search-container");

var tempAutoCompleteValue = "";

var activeTab = "flights";

var showFlightsMenu = function () {
  var goingFrom = document.querySelector("#going-from").parentElement
    .parentElement;
  goingFrom.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical"
  );

  var goingTo = document.querySelector("#going-to").parentElement.parentElement;
  goingTo.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical"
  );

  var hotelCity = document.querySelector("#hotel-city").parentElement
    .parentElement;
  hotelCity.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical hide"
  );

  var checkIn = document.querySelector("#check-in").parentElement.parentElement;
  checkIn.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical hide"
  );

  var checkOut = document.querySelector("#check-out").parentElement
    .parentElement;
  checkOut.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical hide"
  );

  var travelClass = document.querySelector("#travel-class");
  travelClass.style.display = "";

  var trip = document.querySelector("#trip");
  trip.style.display = "";

  var hotelsBtn = document.querySelector("#hotels-search");
  hotelsBtn.style.display = "none";

  var flightsBtn = document.querySelector("#flights-search");
  flightsBtn.style.display = "";

  var dDeparture = document.querySelector("#date-departure").parentElement
    .parentElement;
  dDeparture.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical"
  );

  var dArrival = document.querySelector("#date-return").parentElement
    .parentElement;
  dArrival.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical"
  );
};

var showHotelsMenu = function () {
  var goingFrom = document.querySelector("#going-from").parentElement
    .parentElement;
  goingFrom.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical hide"
  );
  var goingTo = document.querySelector("#going-to").parentElement.parentElement;
  goingTo.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical hide"
  );

  var hotelCity = document.querySelector("#hotel-city").parentElement
    .parentElement;
  hotelCity.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical"
  );

  var checkIn = document.querySelector("#check-in").parentElement.parentElement;
  checkIn.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical"
  );

  var checkOut = document.querySelector("#check-out").parentElement
    .parentElement;
  checkOut.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical"
  );

  var travelClass = document.querySelector("#travel-class");
  travelClass.style.display = "none";

  var trip = document.querySelector("#trip");
  trip.style.display = "none";

  var hotelsBtn = document.querySelector("#hotels-search");
  hotelsBtn.style.display = "";

  var flightsBtn = document.querySelector("#flights-search");
  flightsBtn.style.display = "none";

  var dDeparture = document.querySelector("#date-departure").parentElement
    .parentElement;
  dDeparture.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical hide"
  );

  var dArrival = document.querySelector("#date-return").parentElement
    .parentElement;
  dArrival.setAttribute(
    "class",
    "uk-margin-small uk-padding-small uk-padding-remove-vertical hide"
  );
};

var showFlights = function () {
  searchContainer.style.display = "none";
  hotelsContainer.style.display = "none";
  flightsContainer.style.display = "";
};

var showHotels = function () {
  hotelsContainer.style.display = "";
  flightsContainer.style.display = "none";
  searchContainer.style.display = "none";
};

var showSearchHistory = function () {
  hotelsContainer.style.display = "none";
  flightsContainer.style.display = "none";
  searchContainer.style.display = "";
};

var flightsHandler = function (event) {
  showFlightsMenu();
  showFlights();
};

var hotelsHandler = function (event) {
  showHotelsMenu();
  showHotels();
};

var toggleTripHandler = function (event) {
  if (this.options[0].selected) {
    document.querySelector("#date-return").style.display = "";
  }

  if (this.options[1].selected) {
    document.querySelector("#date-return").style.display = "none";
  }
};

var tabKeyHandler = function (event) {
  if (event.which == 9 && document.activeElement.tagName == "INPUT") {
    var input = document.activeElement;
   
    if (input.id == "going-to" || input.id == "going-from") {
      // input.value = tempAutoCompleteValue;
      closeAllLists(null, input);
    }
  }
};

var tabsHandler = function(event) {


if (event.target.id == "flights-btn" || event.target.parentElement.id == "flights-btn") {
  
  activeTab = "flights";
}

if (event.target.id == "hotels-btn" || event.target.parentElement.id == "hotels-btn") {
  
  activeTab = "hotels";
}

if (event.target.id == "favorites-btn" || event.target.parentElement.id == "favorites-btn") {

setTimeout(function (){
document.querySelector("#"+activeTab+"-tab").className = "uk-active";

document.querySelector("#favorites-tab").className = "";
},300);

}

}

var inputBlurHandler = function (event) {
  if (tempAutoCompleteValue == "") {
    return;
  }

  var input = event.target;

  if (
     input.id == "going-to" ||
    input.id == "going-from" ||
    input.id == "hotel-city"
  ) {
    input.value = tempAutoCompleteValue;
    tempAutoCompleteValue = "";
    closeAllLists(null, input);
  }
};

var init = function () {
  showSearchHistory();
  showFlightsMenu();
};

// source https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/

  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    var max = 0;
    var icon = 0;
    /*close any already open lists of autocompleted values*/
    closeAllLists(null, inp);
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);

    /*for each item in the array...*/
  //  for (i = 0; i < arr.length; i++) {
    for (i in arr) {
      /*check if the item starts with the same letters as the text field value:*/
      if (
        arr[i].iata.substr(0, val.length).toUpperCase() == val.toUpperCase() ||  arr[i].city.substr(0, val.length).toUpperCase() == val.toUpperCase() 
      ) {
        if (max++ >= 4) break;
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");

        b.clasName = "auto-complete";

        /*make the matching letters bold:*/

        if (this.id == "going-from") icon = "&#xf5b0; ";
        if (this.id == "going-to") icon = "&#xf5af; ";
        if (this.id == "hotel-city") { icon = "&#xf594; "; 

        b.innerHTML =
          "<strong>" + arr[i].city + "</strong> ";
        b.innerHTML +=
          ", "+
          arr[i].country 
  
          +" ("+arr[i].iata+")";
      

        b.innerHTML +=
        "<input class='fa' type='hidden' value='" +
        icon +
        arr[i].city +
        ", "+
        arr[i].country +
        "'>";

      }
      else
{
        /*insert a input field that will hold the current array item's value:*/

        b.innerHTML =
        "<strong>" + arr[i].iata + "</strong> ";
      b.innerHTML +=
        ", "+
        arr[i].name+
        ", "+
        arr[i].city+
        ", "+
        arr[i].country;


        
        b.innerHTML +=
          "<input class='fa' type='hidden' value='" +
          icon +
          arr[i].iata +
          ", "+
          arr[i].name +
          ", "+
          arr[i].city +
          "'>";
    }
        if (max == 1)
          tempAutoCompleteValue = b.getElementsByTagName("input")[0].value;

        var test = b.getElementsByTagName("input");

        // for (var k = 0; k < test.length; k++) {
        //   console.log(test[k].value + k);
        // }

        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("mousedown", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          tempAutoCompleteValue = "";
          /*close the list of autocompleted values
                    (or any other open lists of autocompleted values:*/
          closeAllLists(null, inp);
        });
        a.appendChild(b);
      }
    }
  });


}

function autocompleteCities(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/

  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    var max = 0;
    var icon = 0;
    /*close any already open lists of autocompleted values*/
    closeAllLists(null, inp);
    if (!val) {
      return false;
    }
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
      if (
        arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase() 
      ) {
        if (max++ >= 12) break;
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");

        b.clasName = "auto-complete";

        /*make the matching letters bold:*/

   
        icon = "&#xf594; "; 

        /*insert a input field that will hold the current array item's value:*/

        b.innerHTML =
        "<strong>" + arr[i].name + "</strong> ";
      b.innerHTML +=
        ", "+
        arr[i].subcountry+
        ", "+
        arr[i].country;


        
        b.innerHTML +=
          "<input class='fa' type='hidden' value='" +
          icon +
          arr[i].name +
          ", "+
          arr[i].country +
          "'>";
    
        if (max == 1)
          tempAutoCompleteValue = b.getElementsByTagName("input")[0].value;

        var test = b.getElementsByTagName("input");

        // for (var k = 0; k < test.length; k++) {
        //   console.log(test[k].value + k);
        // }

        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("mousedown", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          tempAutoCompleteValue = "";
          /*close the list of autocompleted values
                    (or any other open lists of autocompleted values:*/
          closeAllLists(null, inp);
        });
        a.appendChild(b);
      }
    }
  });


}

function closeAllLists(elmnt, inp) {
  /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("going-from"), mainAirports); 
autocomplete(document.getElementById("going-to"), mainAirports);
autocompleteCities(document.getElementById("hotel-city"), mainCities);

flightsBtn.addEventListener("click", flightsHandler);
hotelsBtn.addEventListener("click", hotelsHandler);
menuTabs.addEventListener("click",tabsHandler);

tripSelector.addEventListener("change", toggleTripHandler);

document.addEventListener("keydown", tabKeyHandler);
document
  .querySelector("#form")
  .addEventListener("blur", inputBlurHandler, true);

init();
