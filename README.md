# Angular-Node-Test


use following command to clone the repo. => git clone https://github.com/Hamza2080/Angular-Node-Test.git

Backend: Node, Loopback v3

How to run : open Angular-Node-App/backend run command : npm install node . or nodemon . (to run server) localhost:3000 (server live) localhost:3000/explorer/ (swagger implementation)

Default admin created : 
 credentials  : emai = "admin@gmail.com", password : admin

  backend explanation : 
  Server folder inside backend contain datasources.json 
  1 => edit datasources.json and add your mongo credentials to use mongoDB like 
  "mongo": {
  "host": "localhost",
  "port": 27017,
  "url": "",
  "database": "TestDB",
  "password": "",
  "name": "mongo",
  "user": "",
  "connector": "mongodb"
  }
   
FrontEnd: open Angular-Node-App/frontend run commands: npm install ng serve

system starts on localhost:4200

following functionalities are in system : 
Login, Signup, google map implementation (geolocation, autocomplete places),
user_profile detail view, update user_profile data (dob, location),
admin dashboard(only view by admin). email verification

on admin_dashboard map shows all users location in the system.
as admin is also a user so he/she also view user_profile page.
