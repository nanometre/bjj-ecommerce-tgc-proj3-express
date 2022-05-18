const jwt = require('jsonwebtoken')

const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('error_messages', 'You need to sign in to access this page.')
        res.redirect('/login')
    }
}

const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    } else {
        res.sendStatus(401)
    }
}

const checkIfOwner = (req, res, next) => {
    if (req.session.user.user_type_id === 1) {
        next()
    } else {
        req.flash('error_messages', 'You have no access to this page.')
        res.redirect('back')
    }
}

const handleErrors = (err, req, res, next) => {
    if (err && req.url.slice(0,5) === '/api/') {
        next()
    } else if (err) {
        console.log(err)
        res.render('error')
    }
}

module.exports = { 
    checkIfAuthenticated, 
    checkIfAuthenticatedJWT, 
    checkIfOwner, 
    handleErrors 
}