// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const { bootstrapField, createUserForm } = require('../../forms')
const userDataLayer = require('../../dal/users')

// =================================================
// ================== Set Routes ===================
// =================================================
router.get('/', async (req, res) => {
    const users = await userDataLayer.getAllUsers()
    res.render('users', {
        users: users.toJSON(),
    })
})

router.get('/:user_id/update', async (req, res) => {
    const user = await userDataLayer.getUserById(req.params.user_id)
    const userTypes = await userDataLayer.getAllUserTypes()
    const userForm = createUserForm(userTypes)

    for (field in userForm.fields) {
        userForm.fields[field].value = user.get(field)
    }
    res.render('users/update', {
        user: user,
        userForm: userForm.toHTML(bootstrapField)
    })
})

router.post('/:user_id/update', async (req, res) => {
    const user = await userDataLayer.getUserById(req.params.user_id)
    const userTypes = await userDataLayer.getAllUserTypes()
    const userForm = createUserForm(userTypes)

    userForm.handle(req, {
        'success': async (form) => {
            user.set(form.data)
            user.save()
            req.flash('success_messages', ` User details for "${user.get('email')}" has been updated.`)
            res.redirect('/users')
        },
        'error': async (form) => {
            res.render('users/update', {
                user: user,
                userForm: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:user_id/delete', async (req, res) => {
    const user = await userDataLayer.getUserById(req.params.user_id)
    res.render('users/delete', {
        user: user.toJSON()
    })
})

router.post('/:user_id/delete', async (req, res) => {
    const user = await userDataLayer.getUserById(req.params.user_id)
    req.flash('success_messages', `User details for "${user.get('email')}" has been deleted.`)
    await user.destroy()
    res.redirect('/users')
})

module.exports = router