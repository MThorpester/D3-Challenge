# D3-Challenge
This project analyzes &amp; visualizes current COVID-19 vaccination and infection rates across the US to better understand state level trends. It uses Javascript, D3.js, D3-tip.js and HTML to build an interactive chart for exploring the relationship between COVID-19 infection rates and vaccination levels for each state in the US for the week ending April 10, 2021. 
The interactive chart with findings can be accessed [here](https://mthorpester.github.io/D3-Challenge/D3_data_journalism/main.html "My Interactive D3 Scatter plot").
## Dataset
Several different datasets were extracted & transformed to produce the dataset used for this project.
-  Vaccination Data came from "Our World in Data" - (https://ourworldindata.org/us-states-vaccinations ):
    - us-covid-number-fully-vaccinated.csv
    - us-covid-share-fully-vaccinated.csv
    - us-total-covid-19-vaccine-doses-administered.csv
    us-state-covid-vaccines-per-100.csv

- COVID Case data came from CDC's COVID Data Tracker at https://data.cdc.gov/Case-Surveillance/United-States-COVID-19-Cases-and-Deaths-by-State-o/9mfq-cb36
    - United_States_COVID_19_Cases_and_Deaths_by_State_over_Time.csv

## Dashboard
The dashboard enables users to explore the COVID-19 cases & vaccinations data for the week ending April 10. They can toggle between different variables on the X axis to see how those variables relate to the recent COVID-19 infection rates for each state by clicking on "People Vaccinated (per 100)" or "People Vaccinated". Upon hovering over a state on the chart, a tooltips displays the values for the state.
The project findings are detailed below the chart.
  
## Project Artifacts
The project consists of:
- a Javascript file (app.js)
- an HTML file (index.html)
- the state data (state_stats.csv)
- Bootstrap, CSS, and Jquery files.

All of the resources used to produce the dataset are in the Resources folder - including COVID_Data_Prep.ipynb

## Getting Started

To run this application simply launch the index.html file using live server or visit the hosted version [here](https://mthorpester.github.io/D3-Challenge/D3_data_journalism/main.html "My Interactive D3 Scatter plot").
