import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const { id } = await params;
    const { vpnCredentials } = await request.json();
    
    if (!vpnCredentials) {
      return NextResponse.json(
        { error: 'VPN credentials လိုအပ်ပါတယ်' },
        { status: 400 }
      );
    }
    
    // Find the order by _id
    const order = await Order.findById(id)
      .populate('userId', 'name email')
      .populate('paymentId');
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Check if order is in verified status
    if (order.status !== 'verified') {
      return NextResponse.json(
        { error: 'Order must be verified before delivery' },
        { status: 400 }
      );
    }
    
    // Update order with VPN credentials and mark as completed
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      {
        status: 'completed',
        vpnCredentials: {
          username: vpnCredentials.username,
          password: vpnCredentials.password,
          serverInfo: vpnCredentials.serverInfo || 'VPN Server Details',
          expiryDate: vpnCredentials.expiryDate,
          deliveredAt: new Date(),
          deliveredBy: (admin as any).userId || (admin as any).id || 'admin'
        }
      },
      { new: true }
    ).populate('userId', 'name email').populate('paymentId');
    
    return NextResponse.json({
      message: 'VPN credentials delivered successfully',
      order: updatedOrder
    });
    
  } catch (error) {
    console.error('Error delivering VPN:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}