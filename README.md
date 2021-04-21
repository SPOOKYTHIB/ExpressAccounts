# ExpressAccounts
A simple app that lets you register, login, and access a page only when you are logged in.

# Prerequisites

You will need to have **Node.js** installed on your computer. Grab it from the [official website](https://nodejs.org/en/) if necessary.

# Installation

Simply open the project's root in a terminal window and enter `npm install`. This will install all the required dependencies, assuming **Node.js** is installed. Some warnings might appear; ignore them, as they will not be a problem.

Then, enter `npm start` and you will be able to access the app at [localhost:3000](http://localhost:3000).

# How to use

Simply try to register, then log in using the credentials you just created. Then, try to access the restricted page. If you are logged in, you will be able to do so. Then, wait a minute and try to access the page again; it should be denied.

# How it works / Technical side

*Express Accounts* is using the **Express.js** framework to create routes (with **PUG** for HTML templates), as well as **Node.js** for the server side.

Whenever a submit button is pressed on a form, the user accesses a **POST** route which retrieves input information and checks the content of the `user.json` file, and writes it in the case of the **create** route. When logging in, a JWT token is created and saved as a cookie.

Then, when trying to access the restricted route, the app checks if the token is valid, and if so, access is granted. If the user is not logged in, or if the token has expired (it lasts one minute), an error message will be displayed.

## How it could be improved

The register aspect of the app could be improved by checking if the email input contains a "@" and a ".", and if the username or the email are already taken. This is something that I tried to do, but the asynchronous aspect of the `fs.readFile` and `fs.writeFile` functions prevented me from doing so.

This asynchronous aspect also prevented me from implementing the unitary test. I still left what I tried to do (simulating a registration and a login and checking if the token is valid) in the `test.js` and `testFile.js` files, but it is not working. You can check the result of this test by entering `npm run test` in a terminal window.

I would also like to improve the global design of the app and make it a bit more intuitive and user-friendly. For now, however, I think it is still pretty easy to use and understand.

## How long did it take?

I would say I took about six or seven hours to make the app as it is now. I had to set up the JSON file instead of using a database, and the asynchronous `fs` functions made the job harder. I also had to work more with routes, which I am not really used to do in JavaScript.

## Conclusion

This project allowed me to improve my skills in Express and routes, as well as retrieving and writing data from / to a file / the browser. It was really interesting setting up a register / login system, since I had not done it yet in JS!