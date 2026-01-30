import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-stone-300">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-amber-500 to-blue-900"></div>
      
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                <img src="/logos/company-logo.png" alt="Saad Traders" className="h-10 w-10 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl text-white">Saad Traders</span>
                <span className="text-[10px] text-stone-400 -mt-1 font-medium tracking-wider uppercase">Excellence in Service</span>
              </div>
            </div>
            <p className="text-sm leading-7 text-stone-400 max-w-md mb-6">
              Your trusted partner for FBR-compliant digital invoicing solutions and premium quality stitching threads and dyeing materials. Serving businesses with excellence and reliability across Pakistan.
            </p>
            
            {/* Social/WhatsApp */}
            <a
              href="https://wa.me/923184489249"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg group"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-white mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-emerald-600"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-stone-400 hover:text-emerald-400 transition-colors inline-flex items-center group">
                  <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/digital-invoice" className="text-sm text-stone-400 hover:text-emerald-400 transition-colors inline-flex items-center group">
                  <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Digital Invoice
                </Link>
              </li>
              <li>
                <Link href="/stitching-services" className="text-sm text-stone-400 hover:text-emerald-400 transition-colors inline-flex items-center group">
                  <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Stitching Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-stone-400 hover:text-emerald-400 transition-colors inline-flex items-center group">
                  <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-white mb-5 relative inline-block">
              Services
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-emerald-600"></span>
            </h3>
            <ul className="space-y-3">
              <li className="text-sm text-stone-400">FBR Invoicing</li>
              <li className="text-sm text-stone-400">Stitching Threads</li>
              <li className="text-sm text-stone-400">Dyeing Materials</li>
              <li className="text-sm text-stone-400">Textile Supplies</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-base font-semibold text-white mb-5 relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-emerald-600"></span>
            </h3>
            <ul className="space-y-4">
              <li className="text-sm flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a 
                  href="https://wa.me/923184489249" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-emerald-400 transition-colors"
                >
                  +92 318 4489249
                </a>
              </li>
              <li className="text-sm flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-stone-400">Pakistan</span>
              </li>
              <li className="text-sm flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-stone-400">24/7 Support Available</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-500 text-center md:text-left">
              © {new Date().getFullYear()} Saad Traders. All rights reserved. Built with excellence for quality service.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>Powered by</span>
              <span className="text-emerald-500 font-semibold">Innovation & Trust</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </footer>
  );
}
