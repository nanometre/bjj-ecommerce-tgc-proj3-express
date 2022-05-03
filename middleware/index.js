const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('error_messages', 'You need to sign in to access this page.')
        res.redirect('/login')
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
    if (err) {
        console.log(err)
        res.render('error')
    }
}

module.exports = { checkIfAuthenticated, checkIfOwner, handleErrors }