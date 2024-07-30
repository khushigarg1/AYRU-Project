"use strict";
// import Razorpay from "razorpay";
// const handlePayment = async () => {
//   const response = await fetch("/create-order", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ userId, amount, currency, paymentMethodId }),
//   });
//   const { orderId } = await response.json();
//   const options = {
//     key: "YOUR_RAZORPAY_KEY_ID",
//     amount: amount * 100,
//     currency,
//     order_id: orderId,
//     handler: async (response) => {
//       const verifyResponse = await fetch("/verify-payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(response),
//       });
//       const data = await verifyResponse.json();
//       // Handle success or failure
//     },
//   };
//   const rzp1 = new Razorpay(options);
//   rzp1.open();
// };
// fastify.post("/verify-payment", async (request, reply) => {
//   const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
//     request.body;
//   const generatedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//     .digest("hex");
//   if (generatedSignature !== razorpaySignature) {
//     return reply.code(400).send({ error: "Invalid signature" });
//   }
//   try {
//     const transaction = await prisma.transaction.update({
//       where: { razorpayOrderId },
//       data: {
//         razorpayPaymentId,
//         status: "paid",
//       },
//     });
//     // Update order status or perform other actions
//     reply.send({ success: true, transaction });
//   } catch (error) {
//     reply.code(500).send({ error: "Failed to verify payment" });
//   }
// });
// fastify.post("/create-order", async (request, reply) => {
//   const { userId, amount, currency, paymentMethodId } = request.body;
//   const options = {
//     amount: amount * 100, // amount in the smallest currency unit
//     currency,
//     receipt: `receipt_${Date.now()}`,
//   };
//   try {
//     const order = await razorpay.orders.create(options);
//     const newTransaction = await prisma.transaction.create({
//       data: {
//         paymentMethodId,
//         razorpayOrderId: order.id,
//         status: "created",
//         amount,
//         currency,
//         method: "razorpay",
//         transactionDate: new Date(),
//       },
//     });
//     reply.send({ orderId: order.id, transactionId: newTransaction.id });
//   } catch (error) {
//     reply.code(500).send({ error: "Failed to create order" });
//   }
// });
