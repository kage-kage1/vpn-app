import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';
import { sendVPNCredentialsEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const { orderId, vpnCredentials } = await request.json();
    
    if (!orderId || !vpnCredentials) {
      return NextResponse.json(
        { error: 'Order ID နှင့် VPN credentials လိုအပ်ပါတယ်' },
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

    // Update order with VPN credentials
    await Order.findByIdAndUpdate(orderId, {
      status: 'completed',
      vpnCredentials: {
        username: vpnCredentials.username,
        password: vpnCredentials.password,
        serverInfo: vpnCredentials.serverInfo,
        expiryDate: vpnCredentials.expiryDate,
        deliveredAt: new Date(),
        deliveredBy: admin.userId
      }
    });

    // Send email notification to customer
    try {
      await sendVPNCredentialsEmail(order.customerEmail, vpnCredentials, {
        orderId: order._id,
        customerName: order.customerName,
        total: order.total
      });
      console.log('VPN credentials email sent successfully to:', order.customerEmail);
    } catch (emailError) {
      console.error('Failed to send VPN credentials email:', emailError);
      // Don't fail the entire operation if email fails
    }

    return NextResponse.json({
      message: 'VPN credentials delivered successfully',
      orderId
    });

  } catch (error) {
    console.error('VPN delivery error:', error);
    return NextResponse.json(
      { error: 'Server error ဖြစ်နေပါတယ်' },
      { status: 500 }
    );
  }
}