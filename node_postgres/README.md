# initialize project
###npm init -y
-This command creates a package.json file in your project directory if it doesn't already exist. The -y flag automatically fills in the default values without prompting you for input.

###npm install express
###npm install pg
###npm install cors

# need to manually create table
run create_records.sql

# api test
curl -X POST http://localhost:3000/addRecord -H "Content-Type: application/json" -d '{"date":"2023-01-01","contributors":[{"name":"John Doe","contribution":100}],"moneyEach":50}' 

# run server
###node server.js

# run app
localhost:3000/
