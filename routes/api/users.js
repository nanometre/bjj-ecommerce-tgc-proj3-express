const express = require('express');
const router = express.Router();
const { verifyUserJWT } = require('../../dal/users')
const { checkIfAuthenticatedJWT } = require('../../middleware')

router.post('/login', async (req, res) => {
    await verifyUserJWT(req.body.email, req.body.password, req, res)
})

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user
    res.send(user)
})

module.exports = router