//sslcommerce integration

// payment session initialization 
const SSLCommerz = require('ssl-commerz-node');
const PaymentSession = SSLCommerz.PaymentSession;
const { Profile } = require('../models/profile');
const { CartItem } = require('../models/cartItem');
const { Order } = require('../models/order');
const { Payment } = require('../models/payment');

module.exports.ipn = async (req, res) => {
    console.log(req.body);
    const payment = new Payment(req.body);
    const tran_id = payment['tran_id'];
    if (payment['status'] === 'VALID') {
        const order = await Order.updateOne({ tarnsaction_Id: tran_id }, { status: 'Completed' });
        await CartItem.deleteMany(order.cartItems);
        // return res.status(200).send('Payment Successful');
    } else {
        await Order.deleteOne({ tarnsaction_Id: tran_id });
    }
    await payment.save();
    return res.status(200).send('Payment Successful from Ipn');
}

module.exports.initPayment = async (req, res) => {

    const userId = req.user._id;
    const cartItems = await CartItem.find({ user: userId });
    const profile = await Profile.findOne({ user: userId });

    const { phone, address1, address2, city, state, postcode, country } = profile

    const total_amount = cartItems.map(item => item.price * item.quantity).reduce((a, b) => a + b, 0);
    const total_quantity = cartItems.map(item => item.quantity).reduce((a, b) => a + b, 0);
    // generate a unique id for the transaction
    const tran_id = '_' + Math.random().toString(36).substr(2, 9) + Date.now();

    // For live payment set first parameter `false` and for sandbox set it `true`

    const payment = new PaymentSession(
        true,
        process.env.SSLCOMMERZ_STORE_ID,
        process.env.SSLCOMMERZ_STORE_PASSWORD
    );

    // Set the urls
    payment.setUrls({
        success: "yoursite.com/success", // If payment Succeed
        fail: "yoursite.com/fail", // If payment failed
        cancel: "yoursite.com/cancel", // If user cancel payment
        ipn: "https://aqueous-fortress-39474.herokuapp.com/api/payment/ipn", // SSLCommerz will send http post request in this link
    });

    // Set order details
    payment.setOrderInfo({
        total_amount: total_amount, // Number field
        currency: "BDT", // Must be three character string
        tran_id: tran_id, // Unique Transaction id
        emi_option: 0, // 1 or 0
        multi_card_name: "internetbank", // Do not Use! If you do not customize the gateway list,
        allowed_bin: "371598,371599,376947,376948,376949", // Do not Use! If you do not control on transaction
        emi_max_inst_option: 3, // Max instalment Option
        emi_allow_only: 0, // Value is 1/0, if value is 1 then only EMI transaction is possible
    });

    // Set customer info
    payment.setCusInfo({
        name: req.user.name, // Customer name
        email: req.user.email, // Customer email
        add1: address1,
        add2: address2,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
        phone: phone,
        fax: phone,
    });

    // Set shipping info
    payment.setShippingInfo({
        method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
        num_item: total_quantity, // Number of item in the order
        name: req.user.name, // Customer name
        add1: address1,
        add2: address2,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
    });

    // Set Product Profile
    payment.setProductInfo({
        product_name: "Computer",
        product_category: "Electronics",
        product_profile: "general",
    });

    let response = await payment.paymentInit();
    console.log(response);
    let order = new Order({
        cartItems: cartItems,
        user: userId,
        tarnsaction_Id: tran_id,
        address: profile, // address fiedls are in profile , can use loadsh to get the address fields or let code handle them automatically
    });

    if (response.status === 'SUCCESS') {
        order.sessionKey = response['session_key'];
        await order.save();
    }
    return res.status(200).send(response);
}
