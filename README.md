# Sarathi Backend

## Overview
Sarathi is a sophisticated backend solution for a taxi-ride application, designed to handle real-time ride requests, driver management, and seamless integration with Google Maps API for geolocation services. This backend system is built using Node.js and Express, leveraging MongoDB for data persistence.

## Features

- **Ride Request Management**: Handle user requests for rides, managing the lifecycle of each ride from initiation to completion.
- **Driver Matching Logic**: Implement advanced algorithms to match ride requests with the best-suited available drivers.
- **Google Maps API Integration**: Utilize Google Maps for accurate geolocation data, route calculation, and estimated time of arrivals.
- **Real-Time Updates**: Facilitate real-time communication between the application and drivers.
- **User and Driver Authentication**: Secure authentication mechanisms for users and drivers.

## Technologies Used

- **Node.js and Express**: For creating a robust and scalable server-side application.
- **MongoDB**: As a NoSQL database for storing user, driver, and ride data.
- **Mongoose**: To model application data in MongoDB.
- **Google Maps API**: For geolocation services.

## Getting Started

To get the backend running locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Thunderk3g/sarathi-backend.git
   cd sarathi-backend

2. **Install Dependencies**
    ```bash
       npm install
   
3. **Setup .env file**
    ```bash
        MONGO_URL=''
        JWT_SECRET=''
        REDIS_PASSWORD=''
        REDIS_HOST=''
        REDIS_PORT=''
        TWILIO_ACCOUNT_SID=''
        TWILIO_AUTH_TOKEN=''
        TWILIO_PHONE_NUMBER=''

4. **Run the application**
      ```bash
          npm start 
          nodemon start
          npm run start


 ## Contributions
  Contributions to the Sarathi backend are welcome. Please ensure that your code adheres to the existing style and all tests pass.


 ## License
   This project is licensed under the MIT License.

 ## Developed with ❤️ by the Sarathi Team
