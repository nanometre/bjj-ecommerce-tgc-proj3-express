const {
    User,
    UserType 
} = require('../models');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

// =================================================
// ============= Hash Password and JWT =============
// =================================================
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash
}

const generateToken = (user) => {
    return jwt.sign({
        user_id: user.user_id,
        email: user.email,
        user_type_id: user.user_type_id
    }, process.env.TOKEN_SECRET, {
        expiresIn: '1h'
    })
}

// =================================================
// ============ User Data Access Layer =============
// =================================================

const getAllUsers = async () => {
    return await User.fetchAll({
        withRelated: ['userType']
    })
}

const getUserById = async (userId) => {
    return await User.where({
        user_id: userId
    }).fetch({
        require: true,
        withRelated: ['userType']
    })
}

const getAllUserTypes = async () => {
    return await UserType.fetchAll().map(type => {
        return [type.get('user_type_id'), type.get('user_type')]
    })
}

const verifyUser = async (email, password) => {
    const user = await User.where({
        email: email
    }).fetch({
        require: false
    })
    if (user) {
        if (user.get('password') === getHashedPassword(password)) {
            const { password, ...userData } = user.toJSON()
            return userData
        }
    } else {
        return false
    }
}

const verifyUserJWT = async (email, password, req, res) => {
    const user = await User.where({
        email: email
    }).fetch({
        require: false
    })
    if (user && user.get('password') == getHashedPassword(password)) {
        const accessToken = generateToken(user.toJSON())
        res.send({
            accessToken
        })
    } else {
        res.send({
            error: 'Wrong email or password'
        })
    }
}

const getUserByEmail = async (email) => {
    return await User.where({
        email: email
    }).fetch({
        require: false
    })
}

module.exports = { 
    getAllUsers, 
    getUserById, 
    getAllUserTypes, 
    verifyUser, 
    verifyUserJWT, 
    getUserByEmail 
}