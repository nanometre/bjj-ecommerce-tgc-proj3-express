// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf')
require('express-async-errors')
const { checkIfAuthenticated, checkIfOwner, handleErrors } = require('./middleware')

require('dotenv').config();

// =================================================
// =========== Express Application Setup ===========
// =================================================
let app = express();
// set the view engine
app.set('view engine', 'hbs');
// static folder
app.use(express.static('public'));
// setup partials
hbs.registerPartials('./views/partials')
// setup wax-on 
wax.on(hbs.handlebars)
wax.setLayoutPath('./views/layouts');
// enable forms
app.use(express.urlencoded({extended: false}))

// =================================================
// ================= Session Setup =================
// =================================================
app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

// =================================================
// ============== Flash Messages Setup =============
// =================================================
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_messages = req.flash("success_messages")
    res.locals.error_messages = req.flash("error_messages")
    next()
})

// =================================================
// ============ Custom Handlebar Helpers ===========
// =================================================
hbs.registerHelper('centsToDollars', (cents) => {
    return (parseInt(cents) / 100).toFixed(2)
})
hbs.registerHelper('gramsToKilograms', (grams) => {
    return (parseInt(grams) / 1000).toFixed(2)
})
hbs.registerHelper('convertIsoDate', (isoDate) => {
    return (`${isoDate.getDate()}-${isoDate.getMonth() + 1}-${isoDate.getFullYear()}`)
})
hbs.registerHelper('subTotal', (quantity, cost) => {
    return (quantity * cost / 100).toFixed(2)
})

// =================================================
// =============== Global Middlewares ==============
// =================================================
// get current year
app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear()
    next()
})
// share user data from session
app.use((req, res, next) => {
    res.locals.user = req.session.user
    next()
})
// CSRF middleware
const csurfInstance = csrf(); 
app.use((req, res, next) => {
    if (req.url === '/checkout/process_payment') {
    // TOUNCOMMENT WHEN CHANGING TO API
    // if (req.url === '/checkout/process_payment' || req.url.slice(0,5) === '/api/') {
        next();
    } else {
        csurfInstance(req, res, next);
    }
})
app.use((req, res, next) => {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

// CSRF error handling
app.use((err, req, res, next) => {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'The form has expired. Please try again.');
        res.redirect('back');
    } else {
        next()
    }
})

// =================================================
// ================= Import Routes =================
// =================================================
const httpRoutes = {
    landing: require('./routes/http/landing'),
    login: require('./routes/http/login'),
    users: require('./routes/http/users'),
    products: require('./routes/http/products'),
    orders: require('./routes/http/orders'),
    cloudinary: require('./routes/http/cloudinary'),
}
const apiRoutes = {
    cart: require('./routes/api/cart'),
    checkout: require('./routes/api/checkout'),
    
}

async function main() {
    app.use('/', httpRoutes.landing)
    app.use('/login', httpRoutes.login)
    app.use('/users', checkIfAuthenticated, checkIfOwner, httpRoutes.users)
    app.use('/products', checkIfAuthenticated, httpRoutes.products)
    app.use('/orders', checkIfAuthenticated, httpRoutes.orders)
    app.use('/cloudinary', checkIfAuthenticated, httpRoutes.cloudinary)
    // TOCHANGE
    // app.use('/cart', express.json(), apiRoutes.cart)
    app.use('/cart', checkIfAuthenticated, apiRoutes.cart)
    // app.use('/checkout', express.json(). apiRoutes.checkout)
    app.use('/checkout', apiRoutes.checkout)
}

main()

// handle any errors
app.use(handleErrors)

app.listen(8000, function(){
    console.log('Server has started.');
})
