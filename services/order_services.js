const orderDataLayer = require('../dal/orders')

class OrderServices {
    constructor() {}
    async getAllOrders() {
        return await orderDataLayer.getAllOrders()
    }

    async addOrder(stripeSession) {
        const address = await orderDataLayer.createAddress(
            stripeSession.customer_details.address
            )
        const order = await orderDataLayer.createOrder(
            stripeSession, 
            address.toJSON().address_id
            )
        const orderItems = JSON.parse(stripeSession.metadata.orders)
        for (let orderItem of orderItems) {
            await orderDataLayer.createOrderItem(
                order.toJSON().order_id, 
                orderItem['variant_id'], 
                orderItem['quantity']
                )
        }
    }
}

module.exports = OrderServices