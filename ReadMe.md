# Dan's Project Planner
This is a project planning application which was created for the To-Do 
list fullstack development workshop at [coding with callie](http://coding-with-callie.com). 
It consists of a front-end UI, a back-end API, and a database. The UI is
built with React, TypeScript, and ChakraUI. The API is built with NestJS
utilizing TypeORM. I am using a Trello board which will track the status
of the project and where I am with development. I will keep this board
updated as I work through the project. You can find this board with the
most recent project information [here](https://trello.com/b/Yb5IJhSJ/to-do-list).

## The status of the project right now:

#### Account_Creation branch:
    - Pull request merged
    - Users are able to create an account, sign-in and sign out.
    - If you are reviewing this for feature 1, check that the project
        can be installed and run with the provided instructions and that
        you are able to create an account, login to that account, and 
        view your username in the menu bar at the top. Then check to
        make sure that you an sign out of the account and the name
        changes to 'Guest'.

#### Account Update branch:
    - Pull request open
    - Users are able to request a password reset email. They can then
        use the link in that email to reset the password for their 
        account.
    - Account information page has been created. Users can view and
        update account information from this page.
    - If you are reviewing this for feature 2, make sure to follow the
        setup instructions if you haven't already done so from a
        previous review. If you have already installed the project from
        a previous release you will only need to install NodeMailer.
        ie. cd to /to-do-api and run npm install.
        Update your .env file with email provider info and database 
        information if not done already. Check to make sure that you are
        able to reset your password using the forgot password link on 
        the sign-in page and the resulting email that you are sent. 
        Check to make sure that you are able to view and update each 
        piece of information on the My Account page and that it persists
        after logging out and coming back.

Check **'Setup Instructions'** below for details on how to install and 
configure the project. Then follow **'Running Instructions'** to test 
out the app for yourself. Feel free message me at 
[DanMNeri@gmail.com](mailto:DanMNeri@gmail.com) with any feedback for this project. 

## Setup Instructions:

#### Download the repository:
##### **Option 1: Clone the latest version of the repository.**
    - Open git and run the following command:
        1. git clone https://github.com/Dan-Neri/To-Do-Project.git
    
##### **Option 2: Fetch the version of the code you want to review from that specific pull request:**
    - Open git and run the following commands:
        1. cd ${path}
            --where ${path} is the name of the directory you would
            like to use for this project
        2. git init ${name}
            --where ${name} is the name you would like to give to
            this project. I used 'to-do project'.
        3. cd ${name}
        4. git remote add origin https://github.com/Dan-Neri/To-Do-Project.git
        5. git fetch origin refs/pull/${PR}/head
            --where ${PR} is the pull request number. You can find
            the number at the top of the pull request page. If you
            are reviewing feature 1, this should be 1.
        6. git checkout -b ${branch} FETCH_HEAD
            --where ${branch} is the name of the new branch that you
            want to create.

#### Download and install Node.js v20.11.1 and npm 10.2.4:
    1. Download NodeJS: https://nodejs.org/en/download
    2. install on your system
        
#### Download PostgreSQL, Install, and Create the Database:
    1. Download PostgresSQL: https://www.postgresql.org/download/
    2. install on your system
    3. Open PgAdmin 4: ~PostgreSQL\16\pgAdmin 4\runtime\pgAdmin4.exe
    4. Click the server connection in the Object Explorer on the left 
      - ex. PostgreSQL 16
    5. Enter your admin password
    6. Right click on Databases > Create > Database...
    7. Name the Database To-DoDB
    8. Select the account that you want to use as the owner 
      - ex. postgres
    9. Click Save
        
#### Install Front-End Dependecies:
    1. Open the terminal on your pc, navigate to the location of this
        repository and enter the following commands:
      - cd /to-do-app
      - npm install
        
#### Install Back-End Dependencies:
      - cd ../to-do-api
      - npm install
          
#### Configure the .env file:
    The .env file contains details on how to connect to the Database.
    This will be specific to your configuration. I have included an
    example file called '.envcopy' which shows how this file should
    look. You will need to edit this file, provide the connection 
    details for your Database server, and then save the file as '.env'
    in the /to-do-api folder. 
    
    If you are planning to use a different type of database, you will 
    also need to edit the app.module.ts file and change the type to your
    database type.
    
    - DB_HOST - The host that your server is running on
        - ex. localhost
    - DB_PORT - The port that your server is running on
        - ex. 5432
    - DB_USERNAME - The username of the database owner account
        - ex. postgres 
    - DB_PASSWORD - The password of the database owner account
    - DB_NAME - The name of the database. Set this as 'To-DoDB' unless
        you have a different database that you are using.
    - JWT_SECRET - This is the secret key that will be used to generate
        JWTs. I recommend generating a random key. I used
        crypto.randomBytes(length).toString('hex').
            
    **New** As of the Feature 2 update, Account-update, the .env file
    must also contain information for a valid SMTP server in order to
    send password reset emails. Without this information, the password
    reset functionality will not work as expected. 
    
    If you are looking to use a free personal email address to send the
    messages, I've found that Gmail works the best. You will need to
    generate an app password for Gmail and most personal email
    eproviders. You can find instructions for how to do this with Gmail
    here: https://support.google.com/mail/answer/185833?hl=en
    
    Theoretically you should be able to use any email provider. However,
    some provide extra security features which make sending API emails
    more difficult. 
    
    If using an email service which requires email to be sent with TLS,
    such as outlook, make sure to set the 'EMAIL_SERVICE' variable to 
    'outlook' this will automatically add the TLS property to the 
    NodeMailer transporter object.
    - EMAIL_SERVICE - The name of the email provider you are using.
        Make sure to set this to 'outlook' if your email provider 
        requires TLS.
        - ex. Gmail
    - EMAIL_HOST - The SMTP server that the mail should be sent to.
        - ex. smtp.gmail.com
    - EMAIL_PORT - The port listed in the configuration settings for
        your email address.
        - ex. 465
    - EMAIL_USERNAME - The username for the email address you are using.
        - ex. youremail@gmail.com
    - EMAIL_PASSWORD - The password for the email address you are using.
        - ex. EmailPassword
    
## Running Instructions:

#### Start the API:
    1. Open the terminal on your pc, navigate to the location of this
        repository and enter the following commands:
      - cd /to-do-api
      - npm start
    2. Leave the terminal window open, open a browser window, and
        navigate to http://localhost:3001/api
    3. You should see a message 'The API is running' if everything is
        working correctly
            
#### Start the App:
    1. Open a new terminal window, navigate to the location of this
        repository and enter the following commands:
      - cd /to-do-app
      - npm start
    2. A new browser tab should open with the App running.