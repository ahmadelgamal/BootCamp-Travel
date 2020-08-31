// view-source:https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json

var flightsBtn = document.querySelector("#flights");

var hotelsBtn = document.querySelector("#hotels");


var flightsHandler = function (event) {

    var goingFrom = document.querySelector("#going-from").parentElement.parentElement;
    goingFrom.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");

    var trip = document.querySelector("#trip");
    trip.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");


    var goingFrom = document.querySelector("#check-in").parentElement.parentElement;
    goingFrom.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");

    var goingFrom = document.querySelector("#check-out").parentElement.parentElement;
    goingFrom.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");



}


var hotelsHandler = function (event) {

    var goingFrom = document.querySelector("#going-from").parentElement.parentElement;
    goingFrom.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");

    var trip = document.querySelector("#trip");
    trip.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical hide");


    var goingFrom = document.querySelector("#check-in").parentElement.parentElement;
    goingFrom.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");

    var goingFrom = document.querySelector("#check-out").parentElement.parentElement;
    goingFrom.setAttribute("class", "uk-margin-small uk-padding-small uk-padding-remove-vertical");


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
                b.innerHTML += arr[i].name.substr(val.length)+", "+arr[i].country;
                if(this.id == "going-from") icon = "&#xf5b0; ";
                if(this.id == "going-to") icon = "&#xf5af; ";
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input class='fa' type='hidden' value='"+icon + arr[i].name+", "+arr[i].subcountry+", " + arr[i].country+"'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/

                    inp.value =  this.getElementsByTagName("input")[0].value;
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