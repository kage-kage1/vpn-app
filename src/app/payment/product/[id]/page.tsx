'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Check, CreditCard, Phone, Mail, User, Copy, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

const products = {
  '1': { name: 'ExpressVPN', duration: '1 Month', price: 15000 },
  '2': { name: 'ExpressVPN', duration: '6 Months', price: 75000 },
  '3': { name: 'ExpressVPN', duration: '12 Months', price: 120000 },
  '4': { name: 'NordVPN', duration: '1 Month', price: 12000 },
  '5': { name: 'NordVPN', duration: '6 Months', price: 45000 },
  '6': { name: 'NordVPN', duration: '12 Months', price: 80000 },
  '7': { name: 'Surfshark', duration: '1 Month', price: 10000 },
  '8': { name: 'Surfshark', duration: '6 Months', price: 35000 },
  '9': { name: 'Surfshark', duration: '12 Months', price: 60000 },
};

export default function DirectPaymentPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = products[productId as keyof typeof products];
  const { isAuthenticated, loading, user } = useAuth();
  const { toasts, removeToast, success, error } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    paymentMethod: '',
    transactionId: '',
    senderName: user?.name || '',
    senderPhone: '',
  });
  const [copiedNumber, setCopiedNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      error('အကောင့်ဝင်ရန် လိုအပ်ပါတယ်', 'Payment လုပ်ရန် အကောင့်ဝင်ပါ');
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 2000);
    }
  }, [isAuthenticated, loading, error]);

  // Fetch payment methods from database
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Update form data when user info is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        senderName: user.name,
      }));
    }
  }, [user]);

  const fetchPaymentMethods = async () => {
    try {
      setLoadingMethods(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        const activeMethods = data.settings?.paymentMethods?.filter((method: any) => method.isActive) || [];
        setPaymentMethods(activeMethods.map((method: any) => ({
          ...method,
          logo: method.name === 'KBZPay' ? '💳' : 
                method.name === 'WavePay' ? '🌊' : 
                method.name === 'AYA Pay' ? '🏦' : 
                method.name === 'CB Pay' ? '💰' : '💳'
        })));
      } else {
        // Fallback to hardcoded methods if API fails
        setPaymentMethods([
          { 
            id: 'kpay', 
            name: 'KBZPay',
            number: '09123456789',
            accountName: 'Kage VPN Store',
            logo: '💳'
          },
          { 
            id: 'wavepay', 
            name: 'WavePay',
            number: '09987654321',
            accountName: 'Kage VPN Store',
            logo: '🌊'
          },
          { 
            id: 'ayapay', 
            name: 'AYA Pay',
            number: '09456789123',
            accountName: 'Kage VPN Store',
            logo: '🏦'
          },
          { 
            id: 'cbpay', 
            name: 'CB Pay',
            number: '09789123456',
            accountName: 'Kage VPN Store',
            logo: '💰'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Fallback to hardcoded methods
      setPaymentMethods([
        { 
          id: 'kpay', 
          name: 'KBZPay',
          number: '09123456789',
          accountName: 'Kage VPN Store',
          logo: '💳'
        },
        { 
          id: 'wavepay', 
          name: 'WavePay',
          number: '09987654321',
          accountName: 'Kage VPN Store',
          logo: '🌊'
        }
      ]);
    } finally {
      setLoadingMethods(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNumber(type);
      success('Copied!', `${type} number copied to clipboard`);
      setTimeout(() => setCopiedNumber(''), 2000);
    } catch (err) {
      error('Copy failed', 'Could not copy to clipboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentMethodSelect = (method: any) => {
    setSelectedPayment(method.id);
    setFormData({
      ...formData,
      paymentMethod: method.id,
    });
    setCurrentStep(2);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate required fields
    if (!formData.transactionId || formData.transactionId.trim().length < 5) {
      error('Transaction ID လိုအပ်ပါတယ်', 'အနည်းဆုံး ၅ လုံး ရှိရမည်');
      return;
    }
    
    if (!formData.senderPhone || !/^(09|\+?959)\d{7,9}$/.test(formData.senderPhone.replace(/\s/g, ''))) {
      error('မှန်ကန်သော ဖုန်းနံပါတ် လိုအပ်ပါတယ်', '09xxxxxxxxx format ဖြင့် ဖြည့်ပါ');
      return;
    }
    
    if (!formData.senderName || formData.senderName.trim().length < 2) {
      error('အမည် လိုအပ်ပါတယ်', 'အနည်းဆုံး ၂ လုံး ရှိရမည်');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      error('လိုအပ်သော အချက်အလက်များ ဖြည့်ပါ', 'အမည်၊ အီးမေးလ်နှင့် ဖုန်းနံပါတ် လိုအပ်ပါတယ်');
      return;
    }

    setIsSubmitting(true);

    try {
      // First create the order
      const orderData = {
        userId: user?._id || 'guest',
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        items: [{
          id: productId,
          name: product.name,
          price: product.price,
          duration: product.duration,
          quantity: 1
        }],
        total: product.price,
        status: 'pending_payment'
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'Order creation failed');
      }

      const orderId = orderResult.orderId;

      // Then submit the payment
      const paymentData = {
        orderId: orderId,
        paymentMethod: selectedPayment,
        transactionId: formData.transactionId.trim(),
        senderName: formData.senderName.trim(),
        senderPhone: formData.senderPhone.trim(),
        amount: product.price,
      };

      const paymentResponse = await fetch('/api/payment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const paymentResult = await paymentResponse.json();

      if (paymentResponse.ok) {
        success('Payment submitted successfully!', 'သင့်ငွေပေးချေမှုကို လက်ခံရရှိပါတယ်');
        setCurrentStep(3);
      } else {
        error('Payment submission failed', paymentResult.error || 'ကျေးဇူးပြု၍ ထပ်မံကြိုးစားပါ');
      }
    } catch (err) {
      const submitError = err as Error;
      console.error('Payment submission error:', submitError);
      error('ကွန်ယက် အမှားအယွင်း ဖြစ်နေပါတယ်', 'အင်တာနက် ချိတ်ဆက်မှုကို စစ်ဆေးပြီး ထပ်မံကြိုးစားပါ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-4">အကောင့်ဝင်ရန် လိုအပ်ပါတယ်</p>
          <p className="text-sm text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-neon-cyan hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/products"
            className="flex items-center text-gray-300 hover:text-neon-cyan transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-orbitron font-bold text-white">
            Buy {product.name} - {product.duration}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 1 ? 'bg-neon-cyan text-primary-dark' : 'bg-gray-600 text-gray-300'
            }`}>
              1
            </div>
            <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-neon-cyan' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 2 ? 'bg-neon-cyan text-primary-dark' : 'bg-gray-600 text-gray-300'
            }`}>
              2
            </div>
            <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-neon-cyan' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 3 ? 'bg-neon-cyan text-primary-dark' : 'bg-gray-600 text-gray-300'
            }`}>
              3
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-primary-secondary rounded-xl p-6 border border-gray-700 sticky top-24">
              <h3 className="text-xl font-orbitron font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.duration}</p>
                    <p className="text-sm text-gray-400">Qty: 1</p>
                  </div>
                  <p className="font-bold text-neon-cyan">
                    {product.price.toLocaleString()} Ks
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-neon-cyan">{product.price.toLocaleString()} Ks</span>
                </div>
              </div>

              {/* Customer Info Form */}
              {currentStep === 1 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-neon-cyan">Customer Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-primary-dark border border-gray-600 rounded-lg focus:outline-none focus:border-neon-cyan text-sm"
                      placeholder="သင့်အမည်"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-primary-dark border border-gray-600 rounded-lg focus:outline-none focus:border-neon-cyan text-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-primary-dark border border-gray-600 rounded-lg focus:outline-none focus:border-neon-cyan text-sm"
                      placeholder="09xxxxxxxxx"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Steps */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-primary-secondary rounded-xl p-8 border border-gray-700"
              >
                <h2 className="text-2xl font-orbitron font-bold mb-6">Choose Payment Method</h2>
                <p className="text-gray-300 mb-8">မြန်မာနိုင်ငံတွင် အသုံးပြုနိုင်သော ငွေပေးချေမှုနည်းလမ်းများ ရွေးချယ်ပါ</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loadingMethods ? (
                    <div className="col-span-2 text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mx-auto mb-4"></div>
                      <p className="text-gray-300">Loading payment methods...</p>
                    </div>
                  ) : (
                    paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (formData.name && formData.email && formData.phone) {
                            handlePaymentMethodSelect(method);
                          } else {
                            error('လိုအပ်သော အချက်အလက်များ ဖြည့်ပါ', 'Customer information ဖြည့်ပြီးမှ payment method ရွေးချယ်ပါ');
                          }
                        }}
                        className="p-6 bg-primary-dark rounded-lg border border-gray-600 hover:border-neon-cyan transition-all duration-300 text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{method.logo}</div>
                          <div>
                            <h3 className="font-bold text-lg">{method.name}</h3>
                            <p className="text-gray-400 text-sm">Mobile Payment</p>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-primary-secondary rounded-xl p-8 border border-gray-700"
              >
                <h2 className="text-2xl font-orbitron font-bold mb-6">Payment Instructions</h2>
                
                {/* Payment Details */}
                <div className="bg-primary-dark rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-bold mb-4 text-neon-cyan">
                    {paymentMethods.find(m => m.id === selectedPayment)?.name} Payment Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Account Name:</span>
                      <span className="font-medium">{paymentMethods.find(m => m.id === selectedPayment)?.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Phone Number:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{paymentMethods.find(m => m.id === selectedPayment)?.number}</span>
                        <button
                          onClick={() => copyToClipboard(
                            paymentMethods.find(m => m.id === selectedPayment)?.number || '',
                            paymentMethods.find(m => m.id === selectedPayment)?.name || ''
                          )}
                          className="p-1 text-neon-cyan hover:bg-neon-cyan/10 rounded"
                        >
                          {copiedNumber === paymentMethods.find(m => m.id === selectedPayment)?.name ? 
                            <CheckCircle className="h-4 w-4" /> : 
                            <Copy className="h-4 w-4" />
                          }
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Amount:</span>
                      <span className="font-bold text-neon-cyan text-lg">{product.price.toLocaleString()} Ks</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-8">
                  <h4 className="font-bold text-yellow-400 mb-2">Payment Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                    <li>အထက်ပါ phone number သို့ {product.price.toLocaleString()} Ks ပေးပို့ပါ</li>
                    <li>Transaction ID ကို မှတ်သားထားပါ</li>
                    <li>အောက်ပါ form တွင် အချက်အလက်များ ဖြည့်သွင်းပါ</li>
                  </ol>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmitPayment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sender Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-primary-dark border rounded-lg focus:outline-none transition-colors ${
                        formData.senderName && formData.senderName.trim().length >= 2
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-gray-600 focus:border-neon-cyan'
                      }`}
                      placeholder="ပေးပို့သူ အမည်"
                      required
                      minLength={2}
                    />
                    {formData.senderName && formData.senderName.trim().length > 0 && formData.senderName.trim().length < 2 && (
                      <p className="text-red-400 text-sm mt-1">အမည်သည် အနည်းဆုံး ၂ လုံး ရှိရမည်</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sender Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-primary-dark border rounded-lg focus:outline-none transition-colors ${
                        formData.senderPhone && /^(09|\+?959)\d{7,9}$/.test(formData.senderPhone.replace(/\s/g, ''))
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-gray-600 focus:border-neon-cyan'
                      }`}
                      placeholder="09xxxxxxxxx"
                      required
                    />
                    {formData.senderPhone && formData.senderPhone.trim().length > 0 && 
                     !/^(09|\+?959)\d{7,9}$/.test(formData.senderPhone.replace(/\s/g, '')) && (
                      <p className="text-red-400 text-sm mt-1">မှန်ကန်သော Myanmar phone number ဖြည့်ပါ (09xxxxxxxxx)</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Transaction ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-primary-dark border rounded-lg focus:outline-none transition-colors ${
                        formData.transactionId && formData.transactionId.trim().length >= 5
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-gray-600 focus:border-neon-cyan'
                      }`}
                      placeholder="Transaction ID ထည့်ပါ (အနည်းဆုံး ၅ လုံး)"
                      required
                      minLength={5}
                    />
                    {formData.transactionId && formData.transactionId.trim().length > 0 && formData.transactionId.trim().length < 5 && (
                      <p className="text-red-400 text-sm mt-1">Transaction ID သည် အနည်းဆုံး ၅ လုံး ရှိရမည်</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting || 
                        !formData.transactionId || 
                        formData.transactionId.trim().length < 5 ||
                        !formData.senderPhone ||
                        !/^(09|\+?959)\d{7,9}$/.test(formData.senderPhone.replace(/\s/g, '')) ||
                        !formData.senderName ||
                        formData.senderName.trim().length < 2
                      }
                      className={`flex-1 py-3 px-6 font-semibold rounded-lg transition-all duration-300 ${
                        isSubmitting || 
                        !formData.transactionId || 
                        formData.transactionId.trim().length < 5 ||
                        !formData.senderPhone ||
                        !/^(09|\+?959)\d{7,9}$/.test(formData.senderPhone.replace(/\s/g, '')) ||
                        !formData.senderName ||
                        formData.senderName.trim().length < 2
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark hover:shadow-lg hover:shadow-neon-cyan/25'
                      }`}
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Purchase'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary-secondary rounded-xl p-8 border border-gray-700 text-center"
              >
                <div className="mb-6">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-orbitron font-bold mb-4">Purchase Completed Successfully!</h2>
                  <p className="text-gray-300 mb-4">
                    သင့်ငွေပေးချေမှုကို လက်ခံရရှိပါတယ်။ ကျွန်တော်တို့က စစ်ဆေးပြီး VPN key များကို ပို့ပေးပါမယ်။
                  </p>
                  <p className="text-sm text-gray-400">
                    Usually takes 5-30 minutes during business hours
                  </p>
                </div>

                <div className="space-y-4">
                  <Link
                    href="/orders"
                    className="block w-full py-3 px-6 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                  >
                    View My Orders
                  </Link>
                  <Link
                    href="/products"
                    className="block w-full py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}