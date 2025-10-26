import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { orderId, paymentMethod, transactionId, senderName, senderPhone, amount } = body;

    // Validation
    if (!orderId || !paymentMethod || !transactionId || !senderName || !senderPhone) {
      return NextResponse.json(
        { error: 'လိုအပ်သော အချက်အလက်များ ဖြည့်ပါ' },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if payment already exists for this order
    if (order.paymentId) {
      return NextResponse.json(
        { error: 'Payment already submitted for this order' },
        { status: 400 }
      );
    }

    // Check for duplicate transaction ID
    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return NextResponse.json(
        { error: 'Transaction ID already exists. Please use a unique transaction ID.' },
        { status: 400 }
      );
    }

    // Create payment record
    const newPayment = new Payment({
      orderId,
      userId: order.userId,
      paymentMethod,
      transactionId,
      senderName,
      senderPhone,
      amount: amount || order.total,
      status: 'pending_verification',
      submittedAt: new Date(),
    });

    await newPayment.save();
    console.log('Payment saved:', newPayment);

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(orderId, {
      status: 'payment_submitted',
      paymentId: newPayment._id,
    }, { new: true });
    
    console.log('Order updated:', updatedOrder);

    return NextResponse.json({
      message: 'Payment submitted successfully',
      paymentId: newPayment._id,
      transactionId: transactionId,
    }, { status: 201 });

  } catch (error) {
    console.error('Payment submission error:', error);
    return NextResponse.json(
      { error: 'Server error ဖြစ်နေပါတယ်' },
      { status: 500 }
    );
  }
}