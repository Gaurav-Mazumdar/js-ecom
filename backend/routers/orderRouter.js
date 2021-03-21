import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel';
import { isAuth } from '../utils';

const orderRouter = express.Router();

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    try{
        const order = new Order({
            orderItems: req.body.orderItems,
            user: req.user._id,
            shipping: req.body.shipping,
            payment: req.body.payment,
            itemPrice: req.body.itemPrice,
            taxPrice: req.body.taxPrice,
            shippingPrice: req.body.shippingPrice,
            totalPrice: req.body.totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).send(
            {
                message:'New Order Created!!',
                order: createdOrder,
            }
        )
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}));

orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if(order){
    order.isPaid = true;
    order.paidAt = Date.now();
    order.payment.paymentResult = {
      payerId: req.body.payerId,
      paymentId: req.body.paymentId,
      orderId: req.body.orderId,
    };
    const updatedOrder = await order.save();
    res.send(
      {
          message:'Order Paid',
          order: updatedOrder,
      }
    )
  }else{
    res.status(404).send({message: 'Order not found!!'});
  }
}))

export default orderRouter;