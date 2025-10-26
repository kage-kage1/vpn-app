import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Admin orders API called');
    await connectDB();
    
    // Ensure Payment model is registered
    if (!Payment) {
      throw new Error('Payment model not loaded');
    }
    
    // Require admin authentication
    try {
      const admin = requireAdmin(request);
      console.log('Admin authenticated:', admin);
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    console.log('Query params:', { page, limit, status, search });

    const query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    console.log('Database query:', JSON.stringify(query));

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('paymentId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    console.log(`Found ${orders.length} orders out of ${total} total`);
    
    // Debug log to check populated data
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        id: order._id,
        status: order.status,
        paymentId: order.paymentId ? 'Present' : 'Null',
        paymentData: order.paymentId ? {
          transactionId: order.paymentId.transactionId,
          paymentScreenshot: order.paymentId.paymentScreenshot,
          status: order.paymentId.status
        } : null
      });
    });

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    // Handle authentication errors specifically
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const { orderId, status } = await request.json();
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}