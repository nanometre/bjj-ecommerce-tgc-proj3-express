const { CartItem } = require('../models')

// =================================================
// ============ Cart Data Access Layer =============
// =================================================
const getCartItemsByUserId = async (userId) => {
    return await CartItem.collection().where({
        user_id: userId
    }).fetch({
        require: false,
        withRelated: ['variant', 'user', 'variant.product']
    })
}

const getCartItemsByVariantId = async (variantId) => {
    return await CartItem.where({
        variant_id: variantId
    }).fetchAll({
        require: false
    })
}

const getCartItemByUserAndVariant = async (userId, variantId) => {
    return await CartItem.where({
        user_id: userId,
        variant_id: variantId
    }).fetch({
        require: false
    })
}

const createCartItem = async (userId, variantId, quantity) => {
    const cartItem = new CartItem({
        user_id: userId,
        variant_id: variantId,
        quantity
    })
    await cartItem.save()
    return cartItem
}

const removeCartItem = async (userId, variantId) => {
    const cartItem = await getCartItemByUserAndVariant(userId, variantId)
    // only destroy() if cart item exists
    if (cartItem) {
        await cartItem.destroy();
    }
}

const updateCartItemQuantity = async (userId, variantId, newQuantity) => {
    const cartItem = await getCartItemByUserAndVariant(userId, variantId)
    cartItem.set('quantity', newQuantity)
    await cartItem.save()
    return cartItem
}

module.exports = {
    getCartItemsByUserId,
    getCartItemsByVariantId,
    getCartItemByUserAndVariant,
    createCartItem,
    removeCartItem,
    updateCartItemQuantity
}