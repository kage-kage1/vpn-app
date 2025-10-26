import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({
        paymentMethods: [
          {
            id: 'kpay',
            name: 'KBZ Pay',
            logo: '💳',
            number: '09123456789',
            accountName: 'Kage VPN Store',
            phoneNumber: '09123456789',
            isActive: true
          },
          {
            id: 'wavepay',
            name: 'Wave Pay',
            logo: '🌊',
            number: '09987654321',
            accountName: 'Kage VPN Store',
            phoneNumber: '09987654321',
            isActive: true
          },
          {
            id: 'ayapay',
            name: 'AYA Pay',
            logo: '🏦',
            number: '09456789123',
            accountName: 'Kage VPN Store',
            phoneNumber: '09456789123',
            isActive: true
          },
          {
            id: 'cbpay',
            name: 'CB Pay',
            logo: '💰',
            number: '09789123456',
            accountName: 'Kage VPN Store',
            phoneNumber: '09789123456',
            isActive: true
          }
        ]
      });
      await settings.save();
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Settings များ ရယူ၍မရပါ' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const body = await request.json();
    const { paymentMethods, siteName, siteDescription, contactEmail, contactPhone } = body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }

    // Update settings
    if (paymentMethods) settings.paymentMethods = paymentMethods;
    if (siteName) settings.siteName = siteName;
    if (siteDescription) settings.siteDescription = siteDescription;
    if (contactEmail) settings.contactEmail = contactEmail;
    if (contactPhone) settings.contactPhone = contactPhone;

    await settings.save();

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Settings update လုပ်၍မရပါ' },
      { status: 500 }
    );
  }
}