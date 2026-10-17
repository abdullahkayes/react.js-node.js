import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* ==========================================
          1. TOP NAVIGATION BAR
      ========================================== */}
    

      {/* ==========================================
          2. PAGE HERO / HEADER BANNER
      ========================================== */}
      <section className="bg-[#0B1220] text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/policy" className="hover:text-white transition-colors">Legal & Policies</Link>
              <span>/</span>
              <span className="text-slate-200">Privacy Policy</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              How we collect, use, share, transfer and protect personal and shipment information.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-800/80 border border-slate-700/80 text-slate-300 px-2.5 py-1 rounded">
              v2.1
            </span>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. MAIN CONTENT LAYOUT
      ========================================== */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR (STICKY TABLE OF CONTENTS) */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-6 bg-white rounded-lg p-4 border border-slate-200/90 shadow-sm space-y-2 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">
              On This Page
            </div>
            <nav className="space-y-2 text-slate-600 font-medium">
              <a href="#introduction" className="block text-[#FF5C00] font-semibold hover:underline">
                Introduction
              </a>
              <a href="#section-1" className="block hover:text-[#FF5C00] transition-colors">
                1. Information We May Collect
              </a>
              <a href="#section-2" className="block hover:text-[#FF5C00] transition-colors">
                2. How Information is Used
              </a>
              <a href="#section-3" className="block hover:text-[#FF5C00] transition-colors">
                3. Basis for Processing Information
              </a>
              <a href="#section-4" className="block hover:text-[#FF5C00] transition-colors">
                4. When Information May Be Shared
              </a>
              <a href="#section-5" className="block hover:text-[#FF5C00] transition-colors">
                5. International Transfer of Information
              </a>
              <a href="#section-6" className="block hover:text-[#FF5C00] transition-colors">
                6. Cookies, Sessions and Log Information
              </a>
              <a href="#section-7" className="block hover:text-[#FF5C00] transition-colors">
                7. How Long Information is Retained
              </a>
              <a href="#section-8" className="block hover:text-[#FF5C00] transition-colors">
                8. Information Security
              </a>
              <a href="#section-9" className="block hover:text-[#FF5C00] transition-colors">
                9. Customer Privacy Rights
              </a>
              <a href="#section-10" className="block hover:text-[#FF5C00] transition-colors">
                10. Promotional and Service Communications
              </a>
              <a href="#section-11" className="block hover:text-[#FF5C00] transition-colors">
                11. Third-Party Websites and Services
              </a>
              <a href="#privacy-requests" className="block hover:text-[#FF5C00] transition-colors">
                Privacy Requests and Complaints
              </a>
              <a href="#related-policies" className="block hover:text-[#FF5C00] transition-colors">
                Related Policies
              </a>
            </nav>
          </div>
        </aside>

        {/* RIGHT MAIN DOCUMENT CONTAINER */}
        <main className="flex-1 bg-white rounded-lg p-6 sm:p-10 border border-slate-200/90 shadow-sm text-xs leading-relaxed text-slate-600 space-y-8">
          
          {/* INTRODUCTION */}
          <section id="introduction" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              Introduction
            </h2>
            <p className="leading-relaxed text-slate-700">
              Dazzling Shipping values the privacy and security of customers, website users, business partners and other people connected to its services. This Privacy Policy applies to the Dazzling Shipping website, customer portal, mobile interface and related services. It explains how personal and shipment information is collected, used, shared, stored, transferred and protected.
            </p>
          </section>

          {/* SECTION 1 */}
          <section id="section-1" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              1. Information We May Collect
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">1.1 Personal and Business Information</h3>
                <p className="leading-relaxed">
                  To create accounts, verify identity and manage service inquiries, Dazzling Shipping may collect: Full Name, Phone Number, Email Address, Home Address, Delivery Address, Business Address, Business or Page Name, Customer Type, National ID of Individual Customers, and Trade License or business documents.
                </p>
                <p className="mt-1 text-slate-500 italic">
                  A unique Customer ID will be created to identify the customer's account within Dazzling Shipping.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">1.2 Shipment and Product Information</h3>
                <p className="leading-relaxed">
                  For handling, tracking and processing, we may collect: Item Name and Description, Item Source, Store, Seller or Company Name, Product Quantity, Product Value and Purchase Receipts, Package Weight, Dimensions and Freight Mode, USA Warehouse Tracking Number, Delivery Address, Document Details, Document Content Declarations, Document Purpose and Sender/Recipient Information, and Package, Product and Parcel Photos and Videos.
                </p>
                <p className="mt-1 leading-relaxed">
                  Pre-Alert, Assisted Purchase and Return and RTO services may require users to register Item Price, Tracking Number, Purchase Screenshot, Store Details, Merchant Info and supporting evidence.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">1.3 Payment and Financial Information</h3>
                <p className="leading-relaxed">
                  We may collect Invoice and Payment Amounts, Payment Method, Transaction Reference Number, Wallet Balance and Wallet Transactions, Refunds, Customer Credits, Outstanding Payments, Insurance Fees, and Claim Payment Records.
                </p>
                <p className="mt-1 leading-relaxed text-slate-700 font-medium">
                  Dazzling Shipping does not ask for or store payment account passwords, PINs or OTPs. Payment processing through gateways retains only necessary transaction reference details for verification.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">1.4 Insurance and Claim Information</h3>
                <p className="leading-relaxed">
                  We may collect Claim ID and Shipment ID, Reason for Claim, Description of Loss or Damage, Proof of Value and Purchase, Evidence of Loss or Damage, Photos/Videos of damaged packaging, approved compensation and refund records, and decision reports.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">1.5 Technical, Session and Log Information</h3>
                <p className="leading-relaxed">
                  When the website or portal is accessed, systems may automatically log information including IP Address, Device and Browser type, Operating System, Date and Time, Session IDs, Pages visited, Feature Usage, Error Logs, Security Activity Logs, and Cookie or Session Information.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2 */}
          <section id="section-2" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              2. How Information is Used
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">2.1 Service Delivery and Account Management</h3>
                <p className="leading-relaxed">
                  Information may be used to create and manage Accounts, assign Customer IDs, verify identity, process Pre-Alerts and Shipment Bookings, manage Assisted Purchases, handle items received at the USA Warehouse, process Air and Sea Freight, complete customs clearance and delivery, manage Returns, RTOs, Refunds, and Customer Credits, generate invoices, verify payments, provide tracking notices, process Insurance Claims, and provide customer support.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">2.2 Security, Compliance and Communications</h3>
                <p className="leading-relaxed">
                  Information may be used to detect, prevent, and investigate fraud, security risks, unauthorized access, and misuse; comply with applicable customs, trade and legal obligations; and send operational messages and notifications where authorized.
                </p>
                <p className="mt-1 text-slate-500 font-medium italic">
                  Dazzling Shipping will not seek to collect more personal information than necessary or use information outside authorized purposes.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3 */}
          <section id="section-3" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              3. Basis for Processing Information
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">3.1 Processing Grounds</h3>
                <p className="leading-relaxed">
                  Depending on the purpose, personal information may be processed under customer consent, performance of a contract, provision of services, processing of shipments and payments, compliance with legal or regulatory obligations, prevention of fraud and security risks, or Dazzling Shipping's legitimate business interests.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">3.2 Withdrawal of Consent</h3>
                <p className="leading-relaxed">
                  Where processing relies on consent, customers may withdraw consent at any time. Processing completed prior to withdrawal remains valid, and certain services may not be available if necessary operational details cannot be processed.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4 */}
          <section id="section-4" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              4. When Information May Be Shared
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.1 Service Partners and Authorities</h3>
                <p className="leading-relaxed">
                  Where necessary for operations, information may be shared with: USA Warehouse and USA Partner Company, Airlines, Shipping Lines, Freight Forwarders, Customs Brokers and Government Customs Authorities, Local Courier or Delivery Partners in Bangladesh and USA, Sellers, Merchants or Assisted Purchase Partners, Payment Gateways, Banks and MFS Providers, Cloud Hosting, Software, SMS and Email Service Providers, Accountants, Auditors, Lawyers and authorized consultants, and Courts, law enforcement agencies or government authorities where legally required.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.2 Data Minimization and Protection</h3>
                <p className="leading-relaxed">
                  Only the information necessary for the relevant service stage will be disclosed. Service providers are required to maintain strict confidentiality and security. Dazzling Shipping does not sell or rent customer personal information.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5 */}
          <section id="section-5" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              5. International Transfer of Information
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">5.1 Bangladesh and United States Operations</h3>
                <p className="leading-relaxed">
                  Dazzling Shipping provides USA-to-Bangladesh import services and Bangladesh-to-USA export services. Therefore, relevant personal, shipment, item, document and contact details may be transferred between authorized entities, Warehouses, Freight Partners, Customs Brokers, Couriers or Service Providers located in Bangladesh and the United States.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">5.2 Purpose and Scope of Transfer</h3>
                <p className="leading-relaxed">
                  Transferred information may include customer name, Customer ID, Tracking Number, item description, invoice, address and recipient details necessary to complete warehouse receiving, air or ocean freight, customs clearance, delivery management, legal compliance, and security processing. Transfers are limited to what is strictly necessary to fulfill the operational and legal demands of international shipping.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6 */}
          <section id="section-6" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              6. Cookies, Sessions and Log Information
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.1 Purpose and Use of Cookies</h3>
                <p className="leading-relaxed">
                  Cookies or similar technologies may be used for technical operations, maintaining login sessions, user preferences, security protocols, and improving general user experience.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.2 Browser Controls</h3>
                <p className="leading-relaxed">
                  Customers can manage Cookies through browser settings. Disabling necessary cookies may limit functions of the User Portal, Tracking, or Session security features.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 7 */}
          <section id="section-7" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              7. How Long Information is Retained
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">7.1 Retention Period</h3>
                <p className="leading-relaxed">
                  Personal information is retained for as long as necessary to maintain active accounts, process active shipments, fulfill legal obligations, manage Audit, Tax, Commercial and Customs records, and for fraud or security investigations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">7.2 Deletion, Destruction or Anonymization</h3>
                <p className="leading-relaxed">
                  When retention is no longer required, information will be securely deleted, destroyed or anonymized in accordance with legal requirements.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 8 */}
          <section id="section-8" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              8. Information Security
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">8.1 Security Measures</h3>
                <p className="leading-relaxed">
                  Technical and organizational security measures are maintained, including HTTPS and SSL encryption, secure password hashing, OTP verification for key account activities, Role-Based Access Control, administrative MFA, access logs, secure file storage, regular database backups, and network monitoring against unauthorized access.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">8.2 Security Incident Notice</h3>
                <p className="leading-relaxed">
                  While internet transmission is not entirely risk-free, if a verified security incident affects personal data, Dazzling Shipping will take immediate steps to mitigate impact, investigate the breach, and inform affected parties as required by law.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 9 */}
          <section id="section-9" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              9. Customer Privacy Rights
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">9.1 Available Requests</h3>
                <p className="leading-relaxed">
                  Subject to applicable law and identity verification, customers may request access to, or copies of, personal data held by Dazzling Shipping; request correction of inaccurate data; request restriction or deletion of specific data; withdraw consent; or request account closure and file privacy-related complaints.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">9.2 Lawful and Operational Limitations</h3>
                <p className="leading-relaxed">
                  A request may be delayed or refused if required for statutory recordkeeping, customs compliance, legal enforcement, active claims, unresolved customer balances, or ongoing security reviews.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 10 */}
          <section id="section-10" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              10. Promotional and Service Communications
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">10.1 Opt-in and Promotional Communications</h3>
                <p className="leading-relaxed">
                  With customer consent, Dazzling Shipping may send news, offers, service updates and promotional messages through Email, SMS, WhatsApp, or Dashboard Notifications. Users may opt out at any time.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">10.2 Essential Service Notifications</h3>
                <p className="leading-relaxed">
                  Shipment Status updates, Payment Alerts, Security Alerts and mandatory legal notices are operational and cannot be opted out of while an Account or Active Order is open.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 11 */}
          <section id="section-11" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              11. Third-Party Websites and Services
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">11.1 External Links</h3>
                <p className="leading-relaxed">
                  The Dazzling Shipping website may contain links to Seller, Courier, or Payment Gateway websites run by third parties.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">11.2 Independent Privacy Practices</h3>
                <p className="leading-relaxed">
                  Dazzling Shipping is not responsible for privacy practices, terms or content of external websites. Users are advised to review privacy policies on third-party platforms before submitting information.
                </p>
              </div>
            </div>
          </section>

          {/* PRIVACY REQUESTS AND COMPLAINTS */}
          <section id="privacy-requests" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              Privacy Requests and Complaints
            </h2>
            <p className="leading-relaxed">
              Subject to applicable identity verification, customers may submit privacy requests or complaints through Official Email or Official Support Channels. Dazzling Shipping will endeavor to process and respond to legitimate requests within reasonable timeframes in accordance with standard internal workflows.
            </p>
          </section>

          {/* RELATED POLICIES */}
          <section id="related-policies" className="bg-slate-50 p-5 rounded-lg border border-slate-200/90 space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Related Policies</h2>
            <p className="text-slate-600">
              This Privacy Policy should be read together with the Terms of Service and related policies, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium pl-2">
              <li><Link to="/terms" className="text-[#FF5C00] hover:underline">Terms of Service</Link></li>
              <li><Link to="/policies/payment" className="text-[#FF5C00] hover:underline">Payment & Wallet Policy</Link></li>
              <li><Link to="/policies/insurance" className="text-[#FF5C00] hover:underline">Insurance & Compensation Policy</Link></li>
              <li><Link to="/policies/return" className="text-[#FF5C00] hover:underline">Return & RTO Policy</Link></li>
              <li><Link to="/policies/prohibited" className="text-[#FF5C00] hover:underline">Prohibited, Restricted and Conditionally Accepted Items Policy</Link></li>
              <li><Link to="/policies" className="text-[#FF5C00] hover:underline">Legal & Policy Hub</Link></li>
            </ul>
          </section>

          {/* Bottom Back Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-slate-700 text-[11px] font-medium">
              Need assistance? Contact our helpline or visit our support portal.
            </div>
            <div>
              <Link
                to="/contact"
                className="inline-block bg-[#FF5C00] hover:bg-[#e05200] text-white font-bold text-xs px-4 py-2 rounded transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

        </main>
      </div>

      
    </div>
  );
};

export default PrivacyPolicy;