const express = require('express');
const router = express.Router();
const { getUserByEmail, generateToken, getHashedPassword, createUser } = require('../../dal/users')
const { checkIfAuthenticatedJWT } = require('../../middleware')
const jwt = require('jsonwebtoken');
const { BlacklistedToken } = require('../../models');

router.post('/register', async (req, res) => {
    const newUser = await createUser(
        req.body.email,
        req.body.password,
        req.body.first_name,
        req.body.last_name
    )
    if (newUser) {
        const user = await getUserByEmail(req.body.email)
        const accessToken = generateToken(user.toJSON(), process.env.TOKEN_SECRET, '1h')
        const refreshToken = generateToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, '1d')
        res.send({
            accessToken,
            refreshToken
        })
    } else {
        res.sendStatus(403)
    }
})

router.post('/login', async (req, res) => {
    const user = await getUserByEmail(req.body.email)
    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        const accessToken = generateToken(user.toJSON(), process.env.TOKEN_SECRET, '1h')
        const refreshToken = generateToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, '1d')
        res.send({
            accessToken,
            refreshToken
        })
    } else {
        res.sendStatus(401)
    }
})

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user
    res.send(user)
})

router.post('/refresh', async (req, res) => {
    let refreshToken = req.body.refreshToken
    let blacklistedToken = await BlacklistedToken.where({
        token: refreshToken
    }).fetch({
        require: false
    })

    if (!refreshToken) {
        res.sendStatus(401)
    } else if (blacklistedToken) {
        res.status(401)
        return res.send('Please log in again.')
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            let accessToken = generateToken(user, process.env.TOKEN_SECRET, '1h')
            res.send({
                accessToken
            })
        })
    }
})

router.post('/logout', async (req, res) => {
    let refreshToken = req.body.refreshToken
    if (!refreshToken) {
        res.sendStatus(401)
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            const blacklistedToken = new BlacklistedToken()
            blacklistedToken.set('token', refreshToken)
            blacklistedToken.set('date_created', new Date())
            await blacklistedToken.save()
            res.send({
                message: 'Successfully logged out'
            })
        })
    }
})

module.exports = router