This is a to do list application which was created for the To-Do list
fullstack development workshop at http://coding-with-callie.com. It 
consists of a front-end UI, a back-end API, and a database. The UI is
built with React, TypeScript, and ChakraUI. The API is built with NestJS
utilizing TypeORM. I am using a Trello board which will track the status
of the project and where I am with development. I will keep this board
updated as I work through the project. You can find this board with the
most recent project information at:
https://trello.com/b/Yb5IJhSJ/to-do-list.

Check 'Setup Instructions' below for details on how to install and 
configure the project. Then follow 'Running Instructions' to test out 
the app for yourself. Feel free message me at DanMNeri@gmail.com with 
any feedback for this project. 

Setup Instructions:

    Download and install Node.js v20.11.1 and npm 10.2.4:
        1. https://nodejs.org/en/download
        2. install on your system
        
    Download PostgreSQL, Install, and Create the Database:
        1. https://www.postgresql.org/download/
        2. install on your system
        3. Open PgAdmin - 4 PostgreSQL\16\pgAdmin 4\runtime\pgAdmin4.exe
        4. Click the server connection in the Object Explorer on the left 
          - PostgreSQL 16 (default)
        5. Enter your admin password
        6. Right click on Databases > Create > Database...
        7. Name the Database To-DoDB
        8. Select the account that you want to use as the owner 
          - postgres (default)
        9. Click Save
        
    Install Front-End Dependecies:
        1. Open the terminal on your pc, navigate to the location of 
            this repository and enter the following commands:
          - cd /to-do-app
          - npm install
        
    Install Back-End Dependencies:
          - cd ../to-do-api
          - npm install
          
    Configure the .env file:
        The .env file contains details on how to connect to the 
        Database. This will be specific to your configuration. I have
        Included an example file called '.envcopy' which shows how 
        this file should look. You will need to edit this file, provide 
        the connection details for your Database server, and then save
        the file as '.env' in the /to-do-api folder. If you are planning
        to use a different type of database, you will also need to edit
        the app.module.ts file and change the type to your database type
        - DB_HOST - The host that your server is running on
            - localhost (default)
        - DB_PORT - The port that your server is running on
            - 5432 (default)
        - DB_USERNAME - The username of the database owner account
            - postgres (default)
        - DB_PASSWORD - The password of the database owner account
        - DB_NAME - The name of the database. Set this as 'To-DoDB'
            unless you have a different database that you are using.
    
Running Instructions:

    Start the API:
        1. Open the terminal on your pc, navigate to the location of 
            this repository and enter the following commands:
          - cd /to-do-api
          - npm start
        2. Leave the terminal window open, open a browser window, and  
            navigate to http://localhost:3001/api
        3. You should see a message 'The API is running' if everything
            is working correctly
            
    Start the App:
        1. Open a new terminal window, navigate to the location of this
            repository and enter the following commands:
          - cd /to-do-app
          - npm start
        2. A new browser tab should open with the App running