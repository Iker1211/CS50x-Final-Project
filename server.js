if (process.env.NODE_ENV !== "production") {
    import("dotenv").config()
}

import express from 'express';
const app = express()
import bcrypt from 'bcrypt'
import passport from 'passport';
const initializePassport = require("./passport-config.js")
import flash from 'express-flash';
import session from 'express-session';
import path from 'path';
import { fileURLToPath} from 'url';
const port = 3000;

// Get current directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set correct MIME type for CSS
app.use('/styles', (req, res, next) => {
    res.type('text/css');
    next();
  });

initializePassport
(passport,
 email => users.find(user => user.email === email),
 id => users.find(user => user.id === id)
)

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_development_secret',
    resave: false, // Wont resave the session variable if nothing is changed
    saveUnitilialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//MySQL must use!!!
const users = []

app.use(express.urlencoded({extended: false}))

//Configuring the register post functionality
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))
app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        console.log(users);

        res.redirect("/login")
    } catch {
        console.log(e);
        res.redirect("/register")
    }
})

//Home route
app.get('/', (req, res) => {
    res.render("index.ejs")
})

//write Post route
app.get('/write', (req, res) => {
    res.render("write-post.ejs")
})

//register route
app.get('/register', (req, res) => {
    res.render("register.ejs")
})

//login route
app.get('/login', (req, res) => {
    res.render("login.ejs")
})

app.listen(port, () => {
    console.log('Server running at http://localhost:3000');
})