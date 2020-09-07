# BootCamp Travel 

### This travel application allows you to do the following:
### 1. Lookup flight and hotel information based on city, cabin-class, check-in and check-out date
### 2. Save the flight or hotel entry by selecting that search result
### 3. See history before initial search for flight or hotel

### 2 different APIs are used: Amadeus for flights and RapidAPI for hotels
### Limitations: 
### 1. We do not retrieve more than 5 hotels at a time since the RapidAPI APIs will not accept more than 5 APIs in a second. Problem can be solved with a database, but we are not using any in this project
### 2. History is limited to 3 entries to reduce API usage 

### Main functions of hotel.js are as follows:
###  getIdhotel: Obtains ID of the city to be used for hotel search
###  getProperties: Gets property ID information based on ID of city, # of adults, check-in date, check-out date, # of entries and pages to display and sorting order (rating or price)
### displayPropertyInfo. Gets detailed property information based on the ID information from getProperties. Hotel information includes the hotel name, locality, taglines, price, ratings etc..
### setInitial: Used for initial setup. Sets and displays hotel history results

### Main functions of flights.js are as follows:



### Screenshot: 
### URL:


