const {
    User,
    UserType 
} = require('../models');
const crypto = require('crypto');

// =================================================
// ================= Hash Password =================
// =================================================
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash
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

const getUserByEmail = async (email) => {
    return await User.where({
        email: email
    }).fetch({
        require: false
    })
}

module.exports = { getAllUsers, getUserById, getAllUserTypes, verifyUser, getUserByEmail }