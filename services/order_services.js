const orderDataLayer = require('../dal/orders')

class OrderServices {
    constructor(order_id) {
        this.order_id = order_id
    }
    async getAllOrders() {
        return await orderDataLayer.getAllOrders()
    }

    async getOrderByOrderId() {
        return await orderDataLayer.getOrderByOrderId(this.order_id)
    }

    async getOrderItemsByOrderId() {
        return await orderDataLayer.getOrderItemsByOrderId(this.order_id)
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

    async updateOrderStatus(newStatusId) {
        return await orderDataLayer.updateOrderStatus(this.order_id, newStatusId)
    }

    async getAllStatuses() {
        return await orderDataLayer.getAllStatuses()
    }
}

module.exports = OrderServices