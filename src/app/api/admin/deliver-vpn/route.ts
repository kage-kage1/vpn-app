import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';

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

    // TODO: Send email notification to customer
    // await sendVPNCredentialsEmail(order.customerEmail, vpnCredentials);

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