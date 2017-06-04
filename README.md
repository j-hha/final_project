# COFFEE COMPASS

Final Project - by GA WDIR student Hanna Hauck

## SUMMARY

A small web app for keeping track of and analyzing your coffee consumption.

## LIVESITE

Link: https://coffeecompass.herokuapp.com/
Link to API: https://coffee-compass-api.herokuapp.com/

## TECHNOLOGIES USED

Frontend: HTML, CSS, JavaScript, AngularJS, jQuery, NodeJS, Express, ChartJS
Backend: Ruby on Rails
Database: Postgresql

![Screenshot Coffee Compass](public/img/screenshot_coffee_compass.png "Screenshot Coffee Compass")


## APPROACH TAKEN

**RATIONAL**
- drinking coffee is an essential part in the daily lives of Americans
- more than half of Americans aged 18+ drink coffee every day (see: https://www.hsph.harvard.edu/news/multimedia-article/facts/)
- this app allows users to track and analyze their coffee consumption
- the purpose is to allow users to get a better understanding of how much coffee
they drink as well as how their consumer choices impact their own lives (health
  / finances), as well as the world around them (environment / society)

**TECHNICAL DETAILS**
- interactive frontend app, written in HTML, CSS, JavaScript, AngularJS and jQuery
- Express serves static frontend files
- connected to separate backend API via Cross-Origin Resource Sharing (CORS)
- API written in Ruby on Rails
- Users can save their information in database (Postgresql)
- authentication / authorization via JSON Webtoken
- third party API: USDA Food Composition Database (https://ndb.nal.usda.gov/ndb/)
- retrieved nutritional data for several selected ingredients for coffee beverages
 (black coffee, expresso, whole milk, instant coffee) and saved it to table in own database
- set up rake task to check once a day if the content was updated (the largest
  time span heroku allows, otherwise I would have checked for changes to the data once a month)
- when user selects a beverage, nutritional data is calculated based on USDA Food Composition data

**CURRENT STATE**
- still work in progress!
- some functionality is up and running: users can log in, enter save and read
their data
- some functionality is still missing, including: environment section, society
section, custom filters


## PLANNED IMPROVEMENTS
- design (current state does not reflect my vision for the final version)
- responsive design (current state does not reflect my vision for the final version)
- environment section (not currently functional, will include tally of paper cups
  used based on the data user entered, graphs to visualize the data, facts/stats  
  on general problem with paper cup waste)
- society section (not currently functional, will include tally of fair trade products
  purchased, option to filter according by rating)
- custom filters to sift through own data (by rating, by label 'fair trade', etc)
- more charts, more interactive data visualization
- more beverage options when entering data (currently user can only choose from
  a very limited number of beverages)
- more context (currently only basic details are offered in the background section)
