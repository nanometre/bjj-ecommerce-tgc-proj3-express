// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const { bootstrapField, createLoginForm } = require('../../forms')

router.get('/', async (req, res) => {
    const loginForm = createLoginForm()

    res.render('../views/login/index', {
        loginForm: loginForm.toHTML(bootstrapField)
    })
})

module.exports = router