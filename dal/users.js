const {
    User 
} = require('../models');
const crypto = require('crypto')

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

const getUser = async (email, password) => {
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

module.exports = { getUser }