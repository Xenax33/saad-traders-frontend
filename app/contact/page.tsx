'use client';

import { useState } from 'react';
import { Send, Mail, MessageSquare, Phone, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Replace these with your actual EmailJS credentials
      // Get them from https://www.emailjs.com/
      const SERVICE_ID = 'YOUR_SERVICE_ID';
      const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
      const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
        PUBLIC_KEY
      );

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error('Email error:', err);
      setError('Failed to send message. Please try again or contact us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Message Sent Successfully!
            </h2>
            <p className="text-slate-600 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="btn-primary"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Get in Touch</h1>
          <p className="text-base sm:text-lg lg:text-xl text-emerald-100 max-w-2xl mx-auto">
            Ready to streamline your FBR invoice management? Contact us to create your account.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
                Send us a Message
              </h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label className="label">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="Account Request">New Account Request</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="input-field resize-none"
                    rows={6}
                    placeholder="Tell us about your requirements..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Quick Contact
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:support@fbrinvoice.com"
                  className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-900" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <p className="text-sm text-slate-600">support@fbrinvoice.com</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">WhatsApp</p>
                    <p className="text-sm text-slate-600">+92 300 1234567</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Phone</p>
                    <p className="text-sm text-slate-600">+92 300 1234567</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Monday - Friday</span>
                  <span className="font-semibold text-slate-900">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Saturday</span>
                  <span className="font-semibold text-slate-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Sunday</span>
                  <span className="font-semibold text-slate-900">Closed</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Need an Account?
              </h3>
              <p className="text-sm text-blue-800">
                We manually verify and create all accounts to ensure security and compliance. 
                Please provide your business details in the message above, and we'll set up 
                your account within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
