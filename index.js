// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

require('dotenv').config();

// =================================================
// ===== Express Application Setup & Middleware ====
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
// ============ Custom Handlebar Helpers ===========
// =================================================
hbs.registerHelper('centsToDollars', (cents) => {
    return (parseInt(cents) / 100).toFixed(2)
})
hbs.registerHelper('gramsToKilograms', (grams) => {
    return (parseInt(grams) / 1000).toFixed(2)
})

// =================================================
// =============== Route Middlewares ===============
// =================================================
app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear()
    next()
})

// =================================================
// ================= Import Routes =================
// =================================================
const httpRoutes = {
    landing: require('./routes/landing'),
    login: require('./routes/login'),
    products: require('./routes/products')
}

async function main() {
    app.use('/', httpRoutes.landing)
    app.use('/login', httpRoutes.login)
    app.use('/products', httpRoutes.products)
}

main()

app.listen(3000, function(){
    console.log('Server has started.');
})
