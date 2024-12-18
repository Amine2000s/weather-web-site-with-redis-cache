# Weather Website
This is a simple weather website that retrieves weather information from a third-party API and uses Redis for server-side caching to improve performance and reduce redundant API calls.

## Features
 - Fetches current weather information from a third-party weather API.

 - Implements server-side caching using Redis to store weather data temporarily.
 
 - Displays weather information to users through a clean and user-friendly interface.

## Technologies Used
 - Frontend : HTML , CSS , JAVASCRIPT
 - Backend : Express.js with Typescript
 - Database : Redis for caching
 - API : https://www.visualcrossing.com/

## Prerequisites 
Before running the project, ensure you have the following installed:

 - Node.js (v14 or later)

 - Redis server (redis insight if you are more Comfortable with GUI)
## How it works 

1. Fetching Weather Data : 
     - When a user requests weather information for a specific location, the application checks if the data is available in Redis.
     - If the data exists in Redis, it is retrieved and sent to the user.
     - If the data does not exist in Redis, the application fetches it from the third-party weather API, stores it in Redis, and then sends it to the user.
2. Caching Mechanism :
      - Weather data is cached in Redis with a time-to-live (TTL) to ensure data freshness.
      - The TTL can be configured in the application (default is 10 minutes).


    

