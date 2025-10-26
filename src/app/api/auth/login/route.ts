import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { generateToken, checkRateLimit, recordLoginAttempt } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'အီးမေးလ်နှင့် စကားဝှက် လိုအပ်ပါတယ်' },
        { status: 400 }
      );
    }

    // Check rate limiting
    const rateLimit = checkRateLimit(email.toLowerCase());
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `အကြိမ်များစွာ မှားယွင်းစွာ ဝင်ရောက်ခြင်းကြောင့် ${rateLimit.lockoutTime} မိနစ် စောင့်ပါ`,
          lockoutTime: rateLimit.lockoutTime
        },
        { status: 429 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      recordLoginAttempt(email.toLowerCase(), false);
      return NextResponse.json(
        { 
          error: 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားနေပါတယ်',
          remainingAttempts: rateLimit.remainingAttempts ? rateLimit.remainingAttempts - 1 : undefined
        },
        { status: 401 }
      );
    }

    // Check if user is admin - prevent admin login through regular login
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin users သည် admin login page မှ login ဝင်ရပါမည်' },
        { status: 403 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      recordLoginAttempt(email.toLowerCase(), false);
      return NextResponse.json(
        { error: 'သင့်အကောင့်ကို ပိတ်ထားပါတယ်။ ကျေးဇူးပြု၍ admin နှင့် ဆက်သွယ်ပါ' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      recordLoginAttempt(email.toLowerCase(), false);
      return NextResponse.json(
        { 
          error: 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားနေပါတယ်',
          remainingAttempts: rateLimit.remainingAttempts ? rateLimit.remainingAttempts - 1 : undefined
        },
        { status: 401 }
      );
    }

    // Record successful login
    recordLoginAttempt(email.toLowerCase(), true);

    // Return user data (excluding password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    // Generate token with additional security
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      type: 'user',
      sessionId: Date.now().toString(), // Add session identifier
      sub: user._id.toString() // Standard JWT subject claim
    });

    // Create response with user data
    const response = NextResponse.json({
      message: 'အကောင့်ဝင်ခြင်း အောင်မြင်ပါတယ်',
      user: userData,
      token: token, // Include token in response for frontend storage
    });

    // Set secure HTTP-only cookie with additional security flags
    response.cookies.set('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'strict', // CSRF protection
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: '/', // Available for entire site
      domain: process.env.NODE_ENV === 'production' ? '.kagevpn.com' : undefined // Set domain in production
    });

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error ဖြစ်နေပါတယ်' },
      { status: 500 }
    );
  }
}