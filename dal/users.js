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

const generateToken = (user, secret, expiresIn) => {
    return jwt.sign({
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type_id: user.user_type_id
    }, secret, {
        expiresIn: expiresIn
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
    const user = await getUserByEmail(email)
    if (user) {
        if (user.get('password') === getHashedPassword(password)) {
            const { password, ...userData } = user.toJSON()
            return userData
        }
    } else {
        return false
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
    getHashedPassword,
    generateToken,
    getAllUsers, 
    getUserById, 
    getAllUserTypes, 
    verifyUser,
    getUserByEmail 
}