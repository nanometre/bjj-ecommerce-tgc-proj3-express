const cartDataLayer = require('../dal/cart_items')
const { getVariantById } = require('../dal/products')

class CartServices {
    constructor(user_id) {
        this.user_id = user_id
    }
    // get all cart items of a user
    async getCartItemsByUserId() {
        return await cartDataLayer.getCartItemsByUserId(this.user_id)
    }
    // add product variant to cart
    async addToCart(variantId, quantity) {
        let cartItem = await cartDataLayer.getCartItemByUserAndVariant(this.user_id, variantId)
        const variant = await getVariantById(variantId)
        const variantStock = variant.get('stock')

        if (cartItem && variantStock >= quantity) {
            await cartDataLayer.updateCartItemQuantity(
                this.user_id,
                variantId,
                (parseInt(cartItem.get('quantity')) + parseInt(quantity))
            )
            variant.set('stock', variantStock - quantity)
            await variant.save()
        } else if (!cartItem && variantStock >= quantity) {
            cartItem = await cartDataLayer.createCartItem(this.user_id, variantId, quantity)
            variant.set('stock', variantStock - quantity)
            await variant.save()
            return cartItem
        } else if (variantStock < quantity) {
            // TODO: do what if no stock??
            return false
        }
    }
    // remove product variant from cart. this is NOT checking out cart
    async removeFromCart(variantId) {
        const variant = await getVariantById(variantId)
        const variantStock = variant.get('stock')
        const cartItem = await cartDataLayer.getCartItemByUserAndVariant(this.user_id, variantId)
        const cartItemQuantity = cartItem.get('quantity')

        variant.set('stock', variantStock + cartItemQuantity)
        await variant.save()
        await cartDataLayer.removeCartItem(this.user_id, variantId)
    }
    // checkout items from cart on successful payment/checkout session
    async checkoutCart(stripeSession) {
        const cartItems = JSON.parse(stripeSession.metadata.orders)
        for (let cartItem of cartItems) {
            await cartDataLayer.removeCartItem(this.user_id, cartItem['variant_id'])
        }
    }
    // update product variant quantity in cart
    async updateQuantityInCart(variantId, newQuantity) {
        const cartItem = await cartDataLayer.getCartItemByUserAndVariant(this.user_id, variantId)
        const oldQuantity = cartItem.get('quantity')
        const variant = await getVariantById(variantId)
        const variantStock = variant.get('stock')

        if (newQuantity >= oldQuantity) {
            if (variantStock >= (newQuantity - oldQuantity)) {
                variant.set('stock', variantStock - (newQuantity - oldQuantity))
            } else if (variantStock < (newQuantity - oldQuantity)) {
                // TODO: do what if no stock??
                return false
            }
        } else if (newQuantity < oldQuantity) {
            variant.set('stock', variantStock + (oldQuantity - newQuantity))
        }
        await variant.save()
        await cartDataLayer.updateCartItemQuantity(this.user_id, variantId, newQuantity)
    }
}

module.exports = CartServices