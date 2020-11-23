# BootCamp Travel

Do you travel? If yes, and you want to compare prices for airfare and lodging to make a more informed decision when you are ready to pay, then BootCamp Travel can help you search, save favorites, and retreive them as needed!

## Version

This is version 2 of the app. Version 1 was only frontend. This version (2) includes both frontend and backend development.

## Purpose of App

- As a frequent traveler...
- I want to be able to:
  - get quick quotes for airfare and lodging costs
  - and save my favorite results
- So that I can:
  - budget for my trip more accurately
  - and access my favorites list in the future

## Demo

![Flights Search Gif Animation](./public/assets/images/flights-animation.gif)

## Heroku Deployment URL

https://bootcamp-travel.herokuapp.com/

## GitHub Repo URL

https://github.com/gtankha/bootcamptravel/

## How to Use the App

This app is very simple to use. Just follow these steps:

- Fill up the search-form (either hotels or flights)
- Hit enter or click the search button
- You may sort the results as follows:
  - For hotels: by price or ratings
  - For flights: by price, departure time, or arrival time
- Scroll through the list of search results
- Pick your favorite hotel or flight
- Click on the favorite icon to save it to memory
- Revisit the website at any time to see your favorite items, or make new searches!

## Technologies Used

1. HTML5
2. CSS3
3. JavaScript
4. JSON
5. AJAX
6. jQuery
7. UI Kit (CSS Framework)
8. Node.js
9. Express.js
10. Heroku

## Cloning

If you wish to clone this app, you will need to:

1. Generate your own API credentials for hotels, from RapidApi.
1. Generate your own API credentials for flights, from Amadeus.
1. Include the Amadeus API credentials in a `.env` file for testing. There is a sample `.env` file in `lib/v2-assets` named `dotenv`:
   1. Rename that file to `.env`.
   1. Move it to the root directory.
   1. Enter your Amadeus API credentials in the corresponding variables.
1. Set the Amadeus API credentials in `heroku` configurations, or whatever other host you use.

## Collaborators (Group Members)

Bootcamp Travel is group 7's project 1 at the University of California, Berkeley, extension, blended-online full-stack web-development part-time bootcamp. The group is:

| Name              | GitHub Page                     | Main Responsibilities                      | Main Files                               |
| ----------------- | ------------------------------- | ------------------------------------------ | ---------------------------------------- |
| Gautam Tankha     | https://github.com/gtankha      | Project Manager & Hotel search             | `hotel.js`                               |
| Marco Evangelista | https://github.com/marcobjj     | User Interface (Structure & Styling)       | `index.html`, `style.css`, & `script.js` |
| Ahmad El Gamal    | https://github.com/ahmadelgamal | Flights search& backend (routing & heroku) | `flights.js` & `server.js`               |

## Wiki

For more information, please visit our Wiki page at: https://github.com/gtankha/bootcamptravel/wiki
