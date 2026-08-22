// NPM = Node Package Manager

// Used to install, remove, update and manage packages
// in a Node.js project.

// Install a package
// npm install express

// Remove a package
// npm uninstall express

// Install all dependencies mentioned in package.json
// npm install

// Create package.json
// npm init -y

// NPM creates/manages:
// 1. node_modules → downloaded packages
// 2. package.json → project info + dependencies
// 3. package-lock.json → exact versions of installed dependencies



//Express is a lightweight web framework built on Node.js
//  that provides tools for handling HTTP requests, routes, middleware, and responses.
const express = require('express')
const app = express()

// Loads variables from the .env file into process.env
require('dotenv').config()

//listen on this port
const port = process.env.PORT

//get request
app.get("/" , (req , res) => {
    res.send("Hello World")
})

app.get("/instagram",(req, res) => {
    res.send("_ankit_ydv__")
})

app.get('/login' , (req, res) => {
    res.send("<h1>Please login</h1>")
})

//app.listen(port)  //can do this also
//Starts the server and makes it listen for requests on the given port
app.listen(port, () => {
 console.log(`Example app is listening on port ${port}`)
})