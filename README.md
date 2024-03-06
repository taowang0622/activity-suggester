# Activity Suggester

## Overview

This is a nodejs server that provides REST APIs to give activity suggestions that match the current user's requirements.

## Getting Started

### Prerequisites

Ensure the following software is installed on your machine:

- Node.js
- npm
- Docker

### Installation
1. unzip the compressed project file, or clone the project from GitHub, then navigate to the project directory, for example,
   
   ```bash
   cd activity-suggester

2. install dependencies:

   ```bash
   npm install

### Run the server in the development environment

1. Start the database. The server uses MongoDB, and to avoid polluting the local environment, it is recommended to use Docker to create 
a MongoDB container.

   ```bash
   docker run -p 27017:27017 --name some-mongo mongo:latest

2. Start the server

   ```bash
   npm run dev

The server will be accessible at http://localhost:3000 by default.

### Run the server in the production environment

1. Set up the following environment variables

   ```bash
   # MongoDB root user name
   DB_ROOT_USER
   # MongoDB root user password
   DB_ROOT_PASS
   # MongoDB host name
   DB_HOST
   # MongoDB port number
   DB_PORT
   # MongoDB Database name
   DB_NAME
   # The port this server will listen to [Optional and the default value is 8080]
   PORT
   # The log level the server will use [Optional and the default value is info]
   LOG_LEVEL

2. Start the server

   ```bash
   npm run prod

### Run unit tests 

1. Make sure the MongoDB container is running from the section `Run the server in the development environment`

2. Run the command

   ```bash
   npm run test

## API reference

### POST /user

#### Description

Create a new user by providing user details in the request body.

#### Request Body Example

   ```json
   {
      "name": "John",
      "accessibility": "High",
      "price": "Free"
   }
   ```
#### Response Example

   ```json
   {
      "name": "John",
      "accessibility": "High",
      "price": "Free",
      "_id": "65e794821762680b721db524",
      "__v": 0
   }
   ```

### GET /activity

#### Description

Get an activity that matches the current user profile. For simplicity, the current user profile is the last saved user. 
If there's no users saved, you get a random activity. 

#### Response Example

   ```json
    {
        "activity": "Plan a vacation you've always wanted to take",
        "type": "relaxation",
        "participants": 1,
        "price": "Free",
        "link": "",
        "key": "7265395",
        "accessibility": "High"
    }
   ```