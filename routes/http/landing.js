const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/orders')
    } else {
        res.redirect('/login')
    }
})

module.exports = router