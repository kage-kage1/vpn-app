import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const { paymentId, status, notes } = await request.json();
    
    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Payment ID နှင့် status လိုအပ်ပါတယ်' },
        { status: 400 }
      );
    }

    // Find the payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    await Payment.findByIdAndUpdate(paymentId, {
      status,
      verifiedAt: new Date(),
      verifiedBy: admin.userId,
      verificationNotes: notes
    });

    // Update order status based on payment verification
    let orderStatus = 'payment_verified';
    if (status === 'rejected') {
      orderStatus = 'payment_rejected';
    }

    const order = await Order.findByIdAndUpdate(payment.orderId, {
      status: orderStatus
    }, { new: true });

    // Send confirmation email if payment is approved
    if (status === 'approved' && order) {
      try {
        await sendOrderConfirmationEmail(order.customerEmail, {
          orderId: order._id,
          total: order.total
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    return NextResponse.json({
      message: 'Payment verification completed',
      paymentId,
      status
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Server error ဖြစ်နေပါတယ်' },
      { status: 500 }
    );
  }
}