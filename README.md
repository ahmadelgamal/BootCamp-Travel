# BootCamp Travel

![GitHub repo size](https://img.shields.io/github/repo-size/gtankha/bootcamptravel?style=plastic)
![GitHub code size](https://img.shields.io/github/languages/code-size/gtankha/bootcamptravel?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/gtankha/bootcamptravel?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/gtankha/bootcamptravel?style=plastic)

![GitHub last commit](https://img.shields.io/github/last-commit/gtankha/bootcamptravel?style=plastic)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed-raw/gtankha/bootcamptravel?color=green&style=plastic)
![GitHub open pull requests](https://img.shields.io/github/issues-pr-raw/gtankha/bootcamptravel?color=red&style=plastic)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/gtankha/bootcamptravel?color=green&style=plastic)
![GitHub open issues](https://img.shields.io/github/issues-raw/gtankha/bootcamptravel?color=red&style=plastic)

![GitHub stars](https://img.shields.io/github/stars/gtankha/bootcamptravel?style=social)
![GitHub forks](https://img.shields.io/github/forks/gtankha/bootcamptravel?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/gtankha/bootcamptravel?style=social)
![GitHub followers](https://img.shields.io/github/followers/gtankha?style=social)

![GitHub version](https://img.shields.io/github/package-json/v/gtankha/bootcamptravel?color=red&style=plastic)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description
Do you travel? If yes, and you want to compare prices for airfare and lodging to make a more informed decision when you are ready to pay, then BootCamp Travel can help you search, save favorites, and retreive them as needed!

## Table of Contents
- [Deployment URL](#Heroku-Deployment-URL)
- [Repo URL](#GitHub-Repo-URL)
- [Features](#Features)
- [Version](#version)
- [Installation](#Installation)
- [Cloning](#Cloning)
- [Usage](#Usage)
- [Demo](#Demo)
- [Technologies Used](#Technologies-Used)
- [Credits](#Credits)
- [Roadmap](#Roadmap)
- [Questions](#Questions)
- [License](#License)

### Heroku Deployment URL
https://bootcamp-travel.herokuapp.com/

### GitHub Repo URL
https://github.com/gtankha/bootcamptravel/

## Features
1. As a frequent traveler, I want to be able to:
   1. get quick quotes for airfare and lodging costs
   1. and save my favorite results
1. So that I can:
   1. budget for my trip more accurately
   1. and access my favorites list in the future

## Version
The main updates from version 1.0.0 to this version number 1.1.0 are:
- The access token for the Amadeus API, that generates the flight search information, is now dynamically generated, instead of being hardcoded.
- The Rapid API key, that generates the hotel search information, has been moved to the backend for better security.
- Fixes an error when deleting a favorite flight.
- Adds an error message if the internet is disconnected.
- Adds an error message if the search form is submitted without being filled up.

## Installation
No installation necessary. Simply visit the website.

## Cloning
If you wish to clone this app, you will need to:

1. Generate your own API credentials for flights, from Amadeus (flight offers search).
1. Generate your own API Key for hotels, from RapidApi.
1. For testing on your local machine, there is a sample file in `lib/v2-assets` named `dotenv`:
   1. Rename that file to `.env`.
   1. Move it to the root directory.
   1. Enter your Amadeus API credentials in the corresponding variables.
   1. Enter your Rapid API Key in the corresponding variable.
1. For production, set the API credentials manually in `heroku` configurations, or whatever other host you use.

## Usage
1. Fill up the search-form (either hotels or flights)
1. Hit enter or click the search button
1. You may sort the results as follows:
   1. For hotels: by price or ratings
   1. For flights: by price, departure time, or arrival time
1. Scroll through the list of search results
1. Pick your favorite hotel or flight
1. Click on the favorite icon to save it to memory
1. Revisit the website at any time to see your favorite items, or make new searches!
1. To delete a favorite from the favorites list, simply click on remove

## Demo
### Flights Search
![Flights Search Gif Animation](./public/assets/images/flights-animation.gif)

### Hotel Search
![Hotel Search Gif Animation](./public/assets/images/hotels-animation.gif)

## Technologies Used
1. HTML5
1. CSS3
1. Javascript
1. JSON
1. AJAX
1. jQuery
1. UI Kit (CSS Framework)
1. Node.js
1. Express.js
1. Heroku

## Credits
### Collaborators
Bootcamp Travel is group 7's project 1 at the University of California, Berkeley, extension, blended-online full-stack web-development part-time bootcamp. The group is:

| Name              | GitHub Page                     | Main Responsibilities                | Main Files                               |
| ----------------- | ------------------------------- | ------------------------------------ | ---------------------------------------- |
| Gautam Tankha     | https://github.com/gtankha      | Project Manager & Hotel search       | `hotel.js`                               |
| Marco Evangelista | https://github.com/marcobjj     | User Interface (Structure & Styling) | `index.html`, `style.css`, & `script.js` |
| Ahmad El Gamal    | https://github.com/ahmadelgamal | Flights search, routing & deployment | `flights.js` & `server.js`               |

## Roadmap
1. Perform flight fetch requests on the backend to hide the Amadeus access token.
1. Perform hotel fetch requests on the backend to hide the Rapid API Key.
1. Use the same error messages for flights and hotels search.

## Questions
For questions and / or comments, please contact any of the developers listed in the [Collaborators](#collaborators) section above.
## License
This project is licensed under the terms of the [MIT](https://opensource.org/licenses/MIT) license.
