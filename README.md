# WHISPS
Node.js with express authentication boilerplate.
This boilerplate uses express as it's node.js framework, implementing jwt authentication. Database used in this project is mysql.

## Installation
Copy this repository using git clone:

    git clone https://github.com/edrhyt/whisps-api.git
    cd whisps-api
Copy the environment variables from `.env.example` then fill the values in `.env`:

    cp .env.example .env

Install dependencies using yarn:

    yarn install

## Usage
To run this project, use yarn command:

    yarn start
It will run on http://localhost:5000 as it's default setting. You can change the port from the `.env` file.

To build the project, use yarn command:

    yarn build
It will build the project and store it under `/dist/` directory.
