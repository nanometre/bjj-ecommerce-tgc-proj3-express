// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const { bootstrapField, createLoginForm } = require('../../forms')
const userDataLayer = require('../../dal/users')
const { checkIfAuthenticated } = require('../../middleware')

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/orders')
    } else {
        const loginForm = createLoginForm()
        res.render('login', {
            loginForm: loginForm.toHTML(bootstrapField)
        })
    }

})

router.post('/', async (req, res) => {
    const loginForm = createLoginForm()

    loginForm.handle(req, {
        'success': async (form) => {
            const user = await userDataLayer.verifyUser(form.data.email, form.data.password)
            if (!user) {
                req.flash("error_messages", "Wrong email or password. Please try again.")
                res.redirect('/login')
            }
            if (user && (user.user_type_id == 1 || user.user_type_id == 2)) {
                req.session.user = user
                req.flash("success_messages", `Welcome back, ${user.first_name}`)
                res.redirect('/orders')
            } else {
                req.flash("error_messages", "Wrong email or password. Please try again.")
                res.redirect('/login')
            }
        },
        'error': async (form) => {
            req.flash("error_messages", "Please login with your email and password.")
            res.render('login', {
                loginForm: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/logout', checkIfAuthenticated, async (req, res) => {
    req.session.user = null;
    req.flash("success_messages", "Logout successfully. Goodbye!")
    res.redirect("/login")
})

module.exports = router