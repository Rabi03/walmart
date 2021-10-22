const express=require('express');
const router=express.Router();
const { isUserAuthenticated} = require('../middleware/auth');
const {processPayment, sendStripeApi}=require('../controllers/PaymentControllers')

router.route('/payment/process').post(isUserAuthenticated,processPayment);
router.route('/stripeapi').get(isUserAuthenticated,sendStripeApi);

module.exports = router;