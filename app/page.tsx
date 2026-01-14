import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  CheckCircle2,
  Shield,
  Clock,
  ArrowRight,
  PlayCircle,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">FBR Invoice Pro</span>
            </div>
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors text-sm lg:text-base">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors text-sm lg:text-base">
                How It Works
              </a>
              <Link href="/contact" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors text-sm lg:text-base">
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/login" className="text-slate-700 hover:text-emerald-600 font-semibold transition-colors text-sm sm:text-base">
                Sign In
              </Link>
              <Link href="/contact" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all shadow-sm hover:shadow-md text-sm sm:text-base">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 lg:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                FBR Portal Integrated
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                Create & Validate FBR Digital Invoices
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                Seamlessly create FBR-compliant digital invoices and validate them directly 
                with the FBR portal. Simple, fast, and fully integrated.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Link href="/contact" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 text-sm sm:text-base">
                  Start Creating Invoices
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <a href="#how-it-works" className="border-2 border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-600 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all inline-flex items-center justify-center gap-2 text-sm sm:text-base">
                  <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  See How It Works
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>FBR Validated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Instant Creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Secure Platform</span>
                </div>
              </div>
            </div>
            
            {/* Invoice Preview Placeholder */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                  <div>
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg mb-2"></div>
                    <div className="text-xs text-slate-500">INVOICE</div>
                    <div className="font-bold text-slate-900">#INV-2026-001</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-1">FBR Status</div>
                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <div className="h-3 bg-slate-200 rounded w-32"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div className="h-3 bg-slate-200 rounded w-40"></div>
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-slate-200 rounded w-36"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">Total Amount</span>
                    <span className="text-2xl font-bold text-slate-900">PKR 125,000</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-blue-900 text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="text-xs opacity-90">Integrated with</div>
                <div className="font-bold">FBR Portal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FBR Integration Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Direct FBR Portal Integration
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Create digital invoices that are automatically validated with Pakistan's 
              Federal Board of Revenue (FBR) portal in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                What are FBR Digital Invoices?
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                FBR Digital Invoices are electronically generated, verified invoices that comply 
                with Pakistan's tax regulations. Each invoice is validated through the FBR portal, 
                ensuring authenticity and legal compliance.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Real-time Validation</h4>
                    <p className="text-slate-600">Every invoice is verified instantly with FBR systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Legal Compliance</h4>
                    <p className="text-slate-600">Fully compliant with Pakistan tax laws and regulations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Digital Records</h4>
                    <p className="text-slate-600">Secure storage and easy access to all your invoices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FBR Logo Placeholder */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
              <div className="w-full h-64 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                <div className="text-slate-400 text-center">
                  <FileText className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">FBR Portal Integration</p>
                  <p className="text-sm">(Add FBR logo/screenshot here)</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Validated and verified through official FBR systems
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need for FBR Invoicing
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Simple, powerful tools to create and manage FBR-compliant digital invoices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Create Digital Invoices
              </h3>
              <p className="text-slate-600">
                Generate professional FBR-compliant invoices with our easy-to-use interface in minutes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                FBR Portal Validation
              </h3>
              <p className="text-slate-600">
                Automatic validation with FBR portal ensures your invoices are legally compliant and verified.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Instant Processing
              </h3>
              <p className="text-slate-600">
                Create and validate invoices instantly. No waiting, no delays, just fast results.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Track & Manage
              </h3>
              <p className="text-slate-600">
                Keep all your invoices organized in one place with easy search and filtering options.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                PDF Export
              </h3>
              <p className="text-slate-600">
                Download your validated invoices as professional PDF documents for sharing and printing.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Secure Storage
              </h3>
              <p className="text-slate-600">
                Your invoice data is encrypted and securely stored with regular backups for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Creating FBR-validated invoices is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Create Your Invoice</h3>
              <p className="text-slate-600">
                Fill in your client details, add invoice items, and generate your digital invoice with our intuitive form.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Validate with FBR</h3>
              <p className="text-slate-600">
                Our system automatically validates your invoice with the FBR portal, ensuring compliance and authenticity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Download & Share</h3>
              <p className="text-slate-600">
                Get your validated invoice as a PDF and share it with your clients. All records are saved for future access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice Screenshot Placeholder */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Professional FBR-Compliant Invoices
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Generate clean, professional invoices that meet all FBR requirements
          </p>
          
          {/* Large Invoice Preview Placeholder */}
          <div className="bg-slate-800 rounded-2xl p-12 border-2 border-dashed border-slate-700">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto p-12">
              <div className="text-slate-400 text-center">
                <FileText className="w-32 h-32 mx-auto mb-6 opacity-30" />
                <p className="text-2xl font-semibold text-slate-500 mb-2">Invoice Preview Area</p>
                <p className="text-slate-600">Add screenshot of your invoice template here</p>
                <p className="text-sm text-slate-500 mt-4">Recommended size: 1200x800px</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Creating FBR Invoices?
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join businesses across Pakistan who trust our platform for FBR-compliant digital invoicing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold py-4 px-10 rounded-lg transition-all shadow-lg hover:shadow-xl text-lg">
              Contact Us to Get Started
            </Link>
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold py-4 px-10 rounded-lg transition-all text-lg">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">FBR Invoice Pro</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                The leading platform for creating and validating FBR-compliant digital invoices in Pakistan. 
                Simple, secure, and integrated with FBR portal.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a></li>
                <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">Email:</span>
                  <span>support@fbrinvoice.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">Phone:</span>
                  <span>+92 300 1234567</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">WhatsApp:</span>
                  <span>+92 300 1234567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 FBR Invoice Pro. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
