# Exercise Tracker

A comprehensive exercise tracking application built with Node.js, Express, and MongoDB. The application allows users to create profiles, log exercises, and retrieve exercise logs, including filtering and limiting options.

## Overview

The Exercise Tracker is a web application that lets users track their exercise routines. It provides an API for creating users, logging exercises, and retrieving user exercise logs with various filtering options. The application is built using Node.js and Express on the backend, and it utilizes MongoDB for data storage.

## Features

 • User Creation: Users can create a profile by providing a username.
 • Exercise Logging: Users can log exercises with descriptions, durations, and dates.
 • Exercise Log Retrieval: Users can retrieve their exercise logs, with options to filter by date and limit the number of results.
 • Data Storage: Uses MongoDB to store user information and exercise logs.
 • RESTful API: The application exposes a set of RESTful endpoints for interacting with user and exercise data.

## Endpoints

### POST /api/users

 • Description: Creates a new user.
 • Request Body:

{
  "username": "exampleUsername"
}


### • Response:

{
  "username": "exampleUsername",
  "_id": "uniqueUserId"
}


### GET /api/users

 • Description: Retrieves a list of all users.
 • Response:

[
  {
    "username": "exampleUsername",
    "_id": "uniqueUserId"
  }
]



### POST /api/users/:_id/exercises

 • Description: Logs an exercise for a user.
 • Request Parameters:
 • _id: User ID
 • Request Body:

{
  "description": "Running",
  "duration": 30,
  "date": "2024-08-15"
}


### • Response:

{
  "username": "exampleUsername",
  "_id": "uniqueUserId",
  "description": "Running",
  "duration": 30,
  "date": "Thu Aug 15 2024"
}



### GET /api/users/:_id/logs

 • Description: Retrieves a user’s exercise log.
 • Request Parameters:
 • _id: User ID
 • Query Parameters:
 • from: Start date (optional)
 • to: End date (optional)
 • limit: Maximum number of log entries to retrieve (optional)
 • Response:

{
  "username": "exampleUsername",
  "_id": "uniqueUserId",
  "log": [
    {
      "description": "Running",
      "duration": 30,
      "date": "Thu Aug 15 2024"
    }
  ]
}



### Installation and Setup

 #### 1. Clone the Repository:

```
git clone https://github.com/OB-Adams/Exercise-Tracker.git
cd Exercise-Tracker
```


 #### 2. Install Dependencies:

```
npm install
```

 #### 3. Environment Variables:
 • Create a .env file in the root directory.
 • Add the following environment variables:

```
PORT=3000
MONGO_URL=your_mongodb_connection_string
```


 #### 4. Run the Application:

```
npm start
```

The server will start on the port specified in the .env file, or default to port 3000 if not specified.

#### Project Structure

Exercise-Tracker/
├── public/                 # Static files
├── views/                  # HTML views
├── .env                    # Environment variables
├── server.js               # Main server file
└── package.json            # Node.js dependencies and scripts

#### Dependencies

 • Express: Fast, unopinionated, minimalist web framework for Node.js.
 • Mongoose: Elegant MongoDB object modeling for Node.js.
 • Cors: Middleware to enable CORS.
 • Dotenv: Module that loads environment variables from a .env file.

#### Environment Variables

The following environment variables are used in the application:

 • PORT: The port on which the server will run (default: 3000).
 • MONGO_URL: The connection string for your MongoDB database.

#### License

This project is licensed under the MIT License. See the LICENSE file for details.

#### Acknowledgements

Special thanks to the open-source community for the resources and tools that made this project possible.
