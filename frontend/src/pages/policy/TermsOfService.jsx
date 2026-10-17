import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* ==========================================
   

      {/* ==========================================
          2. PAGE HERO / HEADER BANNER
      ========================================== */}
      <section className="bg-[#0B1220] text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/policies" className="hover:text-white transition-colors">Legal & Policies</Link>
              <span>/</span>
              <span className="text-slate-200">Terms of Service</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              General rules and binding legal agreement for using our website, user portal, and cross-border logistics services between the USA and Bangladesh.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-800/80 border border-slate-700/80 text-slate-300 px-2.5 py-1 rounded">
              v2.1
            </span>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-3 py-1.5 rounded font-medium transition-colors">
              Download PDF
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. MAIN CONTENT LAYOUT
      ========================================== */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR (STICKY TABLE OF CONTENTS) */}
        <aside className="w-full lg:w-56 shrink-0">
          <div className="sticky top-6 bg-white rounded-lg p-4 border border-slate-200/90 shadow-sm space-y-2 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">
              On This Page
            </div>
            <nav className="space-y-2 text-slate-600 font-medium">
              <a href="#section-1" className="block text-[#FF5C00] font-semibold hover:underline">
                1. Acceptance & Priority
              </a>
              <a href="#section-2" className="block hover:text-[#FF5C00] transition-colors">
                2. Customer Eligibility
              </a>
              <a href="#section-3" className="block hover:text-[#FF5C00] transition-colors">
                3. Contracting Entity
              </a>
              <a href="#section-4" className="block hover:text-[#FF5C00] transition-colors">
                4. Liability Framework
              </a>
              <a href="#section-5" className="block hover:text-[#FF5C00] transition-colors">
                5. Dispute Resolution
              </a>
              <a href="#section-6" className="block hover:text-[#FF5C00] transition-colors">
                6. Formal Notices
              </a>
              <a href="#section-7" className="block hover:text-[#FF5C00] transition-colors">
                7. Language of Terms
              </a>
              <a href="#section-8" className="block hover:text-[#FF5C00] transition-colors">
                8. Related Policies
              </a>
            </nav>
          </div>
        </aside>

        {/* RIGHT MAIN DOCUMENT CONTAINER */}
        <main className="flex-1 bg-white rounded-lg p-6 sm:p-8 border border-slate-200/90 shadow-sm text-xs leading-relaxed text-slate-600 space-y-8">
          
          {/* Top Legal Disclaimer Alert Box */}
          <div className="bg-slate-50 border-l-4 border-[#FF5C00] p-4 rounded-r text-slate-700 leading-normal">
            These General Terms of Service establish the general rights, responsibilities and contractual relationship between Dazzling Shipping and its customers in connection with Account Registration, Shipment Booking, Self-Purchase, Assisted Purchase, Export Booking and other authorized services[cite: 1]. Where a separate policy applies to a particular service, both these General Terms and the relevant Service-Specific Policy must be followed[cite: 1].
          </div>

          {/* SECTION 1 */}
          <section id="section-1" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              1. Acceptance and Policy Priority
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">1.1 Acceptance of the Terms</h3>
                <p>
                  A user who completes Account Registration by selecting the 'I agree to the Terms of Service' checkbox will be considered to have read, understood and accepted these Terms, the Privacy Policy and the policies applicable to the services used[cite: 1]. A user who does not accept the applicable Terms may not complete Account Registration, Shipment Booking, a Self-Purchase Pre-Alert, an Assisted Purchase Request, an Export Booking or a similar Service Request[cite: 1]. When confirming a particular Shipment, Quotation or Service Request, the user may also be required to review and accept the applicable charges, shipment information, special terms and Service-Specific Policy[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">1.2 Re-acceptance of Amended Terms</h3>
                <p>
                  Where a change affects customer rights, financial responsibility, service eligibility, compensation, cancellation or another important contractual matter, Dazzling Shipping will notify the user through Dashboard Notification and Registered Email[cite: 1]. Where re-acceptance is required, the user must actively accept the updated Terms through the link provided in the Dashboard or Email[cite: 1]. Until that acceptance is recorded, the user may not be created to create a new Shipment, Purchase Request or Export Booking[cite: 1]. A shipment accepted and confirmed before a change will normally remain subject to the rules in force when it was confirmed, unless applicable law or a government directive requires otherwise[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">1.3 Priority Between Policies and Agreements</h3>
                <p>
                  If an inconsistency exists between multiple policy documents, priority will be given to applicable law and mandatory regulatory requirements, then to an approved shipment-specific quotation, booking confirmation or written special agreement, then to the relevant Service-Specific Policy, and finally to these General Terms[cite: 1]. A quotation or special agreement applies only to the Shipment or Transaction for which it was issued[cite: 1].
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2 */}
          <section id="section-2" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              2. Customer Eligibility, Identity and Account Authority
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">2.1 Age and Eligibility</h3>
                <p>
                  A person must be at least 18 years old to create and operate a Dazzling Shipping Account in their own name[cite: 1]. A person under 18 may receive services only through the Account of a Parent or Legal Guardian, who will be responsible for all related activities, payments, declarations and obligations[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">2.2 Individual Account Verification</h3>
                <p>
                  An Individual Account holder is not required to provide a National ID during ordinary Account Registration[cite: 1]. Dazzling Shipping may request the customer's NID and other necessary identity documents when the customer submits a Self-Purchase Pre-Alert, Assisted Purchase Request, Export Booking or another service request requiring verification[cite: 1]. Identity information must be accurate, valid and belong to the relevant Account Holder[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">2.3 Business Account Authority</h3>
                <p>
                  A Business, Merchant or other institutional Account must provide a valid Trade License during Registration[cite: 1]. The individual creating or operating the Account must be at least 18 years old and properly authorized to act on behalf of the Business or Company[cite: 1]. The Business or Company is responsible for Bookings, Declarations, Payments, Instructions and Communications completed through its Authorized Users[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">2.4 Account Sharing and Transfer</h3>
                <p>
                  An Account may not be sold, transferred, lent, shared or made available for unauthorized use[cite: 1]. An Individual Account Holder is personally responsible for Account activity; a Business or Company is responsible for the activity of its Authorized Users[cite: 1]. Unauthorized login, password compromise, suspicious transactions or Account Misuse must be reported immediately through an Official Support Channel[cite: 1].
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3 */}
          <section id="section-3" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              3. Contracting Legal Entity and Independent Service Providers
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">3.1 Contracting Company</h3>
                <div className="bg-slate-50 p-3 rounded border border-slate-200/80 my-2 text-slate-700 font-mono text-[11px] space-y-0.5">
                  <p><strong>Registered Legal Name:</strong> [To be completed before launch]</p>
                  <p><strong>Registration Number:</strong> [To be completed before launch]</p>
                  <p><strong>Registered Office:</strong> [To be completed before launch]</p>
                  <p><strong>Trading as:</strong> Dazzling Shipping</p>
                </div>
                <p>
                  In these Terms, 'Dazzling Shipping', 'Company', 'we', 'us' and 'our' refer to the registered legal entity identified above[cite: 1]. Dazzling Shipping receives authorized customer payments and acts as the principal contracting party for the customer's Service Contract[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">3.2 USA Partner, Warehouse and Other Service Providers</h3>
                <p>
                  Dazzling Shipping may engage a USA Warehouse Operator, Carrier, Freight Forwarder, Customs Agent, Courier, Payment Processor or another independent Service Provider to perform parts of the service[cite: 1]. The USA Warehouse and USA Partner Company do not enter into a direct contract with the customer under these Terms, and do not receive Dazzling Shipping Service Payments from the customer[cite: 1]. Contractual complaints, payment issues, claims and service instructions must be submitted to Dazzling Shipping[cite: 1]. Using an independent Service Provider does not release Dazzling Shipping from its contractual obligations to the customer[cite: 1].
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4 */}
          <section id="section-4" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              4. General Liability Framework
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.1 Reasonable Care and Professional Skill</h3>
                <p>
                  Dazzling Shipping will provide its accepted services using reasonable care, professional skill and established logistics practices[cite: 1]. This includes proper selection and coordinating approved service providers, using reasonable care in handling goods, following confirmed instructions, retaining appropriate records and taking reasonable measures to prevent or limit loss[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.2 Basis of Company Liability</h3>
                <p>
                  Subject to the applicable policy, liability may arise from failure to provide an accepted service properly, failure to follow a confirmed instruction, a verified operational error, purchase of the wrong product under an approved Assisted Purchase Request, an unauthorized or duplicate payment deduction, or loss of or damage to cargo during a stage for which the Company is responsible[cite: 1]. Assessment will consider the cause and amount of loss, available evidence, the applicable policy and the conduct of both parties[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.3 Service-Specific Liability</h3>
                <p>
                  A claim governed by a Service-Specific Policy will be resolved under that policy[cite: 1]. This includes the Insurance & Compensation Policy, Return & RTO Policy, Shipment Cancellation Policy, Payment & Wallet Policy, Prohibited and Restricted Service Policy and Privacy Policy[cite: 1]. The General Liability Framework does not change compensation formulas, claim deadlines, eligibility requirement, exclusion or settlement process established by a Service-Specific Policy[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.4 Other Company-Caused Service Errors</h3>
                <p>
                  A verified Company error causing direct financial loss, where the matter is not governed by a business policy, may be treated as an Other Company-Caused Service Error[cite: 1]. Examples include incorrect shipment data entry, failure to submit timely documents provided by the customer, use of an wrong confirmed service mode, loss of an original document or a verified additional rebooking or rerouting charge caused by incorrect handling or processing[cite: 1]. General dissatisfaction, minor inconvenience, risk of potential loss or an unsupported financial demand is not sufficient for compensation[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.5 Verified Direct Loss</h3>
                <p>
                  Verified Direct Loss means an actual financial loss directly caused by the relevant Company error, supported by an invoice, Receipt, Transaction Record or other acceptable evidence, and non-speculative, remote or avoidable through reasonable mitigation[cite: 1]. Compensation will not exceed the verified direct loss[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.6 General Service Liability Cap</h3>
                <p>
                  For an Other Company-Caused Service Error, the maximum liability will be the lower of the Verified Direct Loss and the applicable General Service Liability Cap[cite: 1]. The cap is the Service Charge paid to Dazzling Shipping for the affected Transaction[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.7 Exceptions to the Liability Cap</h3>
                <p>
                  The cap does not apply to correction of an incorrect, duplicate or unauthorized deduction; repayment of an approved refund or customer balance; fraud or intentional misconduct; unauthorized use of customer funds; or liability that cannot lawfully be limited[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.8 Indirect and Remote Losses</h3>
                <p>
                  Subject to applicable law, Dazzling Shipping is generally not liable for indirect or remote losses, lost profit, lost revenue, lost opportunity, lost contracts, lost reputation or goodwill, emotional value, undeclared collectible value, market price or exchange rate changes, unsupported potential loss, or inconvenience caused solely by delay[cite: 1]. This exclusion does not limit mandatory consumer rights, responsibility for fraud or intentional misconduct, repayment of customer funds, or liability that cannot legally be excluded[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.9 Independent Service Providers</h3>
                <p>
                  Dazzling Shipping remains responsible for its own accepted obligations when using a Warehouse, Carrier, Freight Forwarder, Courier or other independent provider[cite: 1]. It is not automatically liable for an event completely outside its reasonable control, but may not deny its own error, instruction failure or accepted obligation merely because work was performed by a third party[cite: 1]. Compensation or a refund received from another party for the same loss will be deducted from any amount payable by Dazzling Shipping[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.10 Customer Liability and Limited Indemnity</h3>
                <p>
                  A customer is responsible for direct and reasonable loss, fine, penalty or third-party claim caused by the customer's false information, incorrect declaration, prohibited or dangerous goods, incomplete documents, incorrect address, missing permit, fraudulent chargeback or other material breach[cite: 1]. This responsibility is limited to the part caused by the customer and does not transfer the Company's own error or legally non-excludable liability[cite: 1]. Before requesting payment, the Company will explain the cause, provide relevant evidence and take reasonable steps to reduce loss[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">4.11 Preservation of Evidence and Loss Mitigation</h3>
                <p>
                  In a Claim or Dispute, both parties must preserve relevant documents, packaging, products, invoices, communications and transaction records, and take reasonable steps to prevent unnecessary increase of loss[cite: 1]. The same loss may not be compensated more than once[cite: 1].
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5 */}
          <section id="section-5" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              5. Governing Law and Dispute Resolution
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">5.1 Governing Law</h3>
                <p>
                  These Terms, the service contract and the contractual relationship between Dazzling Shipping and the customer are governed by the laws of Bangladesh[cite: 1]. Nothing in these Terms cancels or unreasonably limits a mandatory consumer or legal right[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">5.2 Initial Complaint</h3>
                <p>
                  A contractual complaint or dispute must first be reported through Official Email, Official WhatsApp Number or Official Phone Number[cite: 1]. A Support Officer will convert the complaint into a written Support Ticket and provide a Ticket ID[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">5.3 Company Response Period</h3>
                <p>
                  Dazzling Shipping will normally acknowledge a complaint within 2 Business Days and provide a substantive response or proposed resolution within 15 Business Days[cite: 1]. If a complex investigation is required, the Company will try to decide the matter within 30 Calendar Days[cite: 1]. If a resolution is not possible within 30 days, the Company will provide written reason for delay and the next expected update date in writing[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">5.4 Mediation</h3>
                <p>
                  If the Support Process does not resolve the dispute, both parties will attempt in good faith to resolve it through Mediation before starting Court Proceedings[cite: 1]. The place, mediator and operational costs will be agreed by the parties[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">5.5 Court Jurisdiction</h3>
                <p>
                  If Mediation does not resolve the dispute, it may be submitted to a court of competent jurisdiction in Dhaka, Bangladesh, subject to applicable subject-matter and territorial jurisdictions[cite: 1]. This does not prevent a customer from using mandatory consumer remedies or other legal remedies available by law[cite: 1].
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6 */}
          <section id="section-6" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              6. Formal Notices and Communications
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.1 Registered Contact Information</h3>
                <p>
                  Dazzling Shipping may use the Registered Email Address, Dashboard Account, Official WhatsApp Contact and Phone Number stored in the customer's Account[cite: 1]. Customers are responsible for keeping their contact information accurate and current[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.2 General Operational Notices</h3>
                <p>
                  A general operational Notice will be published on the Customer Dashboard and sent to the Registered Email[cite: 1]. It is considered received when opened, acknowledged or responded to, or 24 hours after transmission through both channels if no failure message is received[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.3 Important Contractual Notices</h3>
                <p>
                  An important Contractual Notice will be sent through Dashboard Notification and Registered Email, with an Official WhatsApp Alert[cite: 1]. It is considered received when acknowledged, or 48 hours after successful transmission if there is no evidence of delivery failure[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.4 Acceptance of Amended Terms</h3>
                <p>
                  Receipt of a Notice about amended Terms is not the same as acceptance[cite: 1]. Where re-acceptance is required, the customer must actively accept the amended Terms through the Dashboard, Email or relevant link[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.5 Urgent and High-Impact Notices</h3>
                <p>
                  Urgent Legal, Safety, Customs or Regulatory Notices may be sent through all reasonably available channels[cite: 1]. Permanent Account Termination, Parcel Disposal or Auction, Formal Payment Demand, Legal Proceedings or a Change of Contracting Entity will also use WhatsApp or Phone Alert in addition to Dashboard and Email, unless the law requires another delivery method[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.6 Email Delivery Failure</h3>
                <p>
                  An invalid, closed, full or rejected Email is not considered successfully delivered[cite: 1]. Dazzling Shipping will keep the Dashboard Notice active, try to alert the customer through WhatsApp or Phone, request updated contact information and retain a record of the communication attempt[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.7 Customer to Company Formal Communications</h3>
                <div className="bg-slate-50 p-3 rounded border border-slate-200/80 my-2 text-slate-700 font-mono text-[11px] space-y-0.5">
                  <p><strong>Official Email:</strong> [To be completed before launch]</p>
                  <p><strong>Official WhatsApp:</strong> [To be completed before launch]</p>
                  <p><strong>Official Phone:</strong> [To be completed before launch]</p>
                </div>
                <p>
                  An Email is received when it reaches the Company Email System unless the sender receives a Delivery Failure Message[cite: 1]. A WhatsApp or Phone complaint will be converted into a written Support Ticket within 1 Business Day[cite: 1]. The verified original communication time remains the Complaint Submission Time[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.8 Mandatory Website Workflows</h3>
                <p>
                  General Support Channels do not replace the required Dashboard processes for filing an Insurance or Compensation Claim, requesting Shipment Cancellation, or submitting an Export Booking[cite: 1]. An Email, WhatsApp message or Phone Call alone does not complete these requests unless the applicable policy expressly allows an exception[cite: 1].
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">6.9 Communication Records</h3>
                <p>
                  Dazzling Shipping will retain relevant timestamps, delivery status, Ticket ID, Notice version, customer responses and support notes for Formal Notices and Complaints[cite: 1].
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 7 */}
          <section id="section-7" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              7. Language of the Terms
            </h2>

            <div className="space-y-3">
              <p>
                The final Terms of Service and related policies will be prepared and published in English as the official version[cite: 1]. If a Bengali or other translation is provided, it is for convenience only[cite: 1]. If the English version and a translation inconsistency exists, the English version will be the authoritative and controlling version, subject to applicable law[cite: 1].
              </p>
            </div>
          </section>

          {/* SECTION 8 - RELATED POLICIES */}
          <section id="section-8" className="space-y-3 pt-2">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              8. Related Policies
            </h2>
            <p className="text-slate-600">
              The following Service-Specific Policies form part of the applicable contractual framework when the relevant service or transaction is used[cite: 1]:
            </p>
            <ul className="space-y-1.5 text-xs text-[#FF5C00] font-medium pt-1">
              <li><Link to="/return-rto" className="hover:underline">Return & RTO Policy</Link>[cite: 1]</li>
              <li><Link to="/shipment-cancellation" className="hover:underline">Shipment Cancellation Policy</Link>[cite: 1]</li>
              <li><Link to="/insurance-compensation" className="hover:underline">Insurance & Compensation Policy</Link>[cite: 1]</li>
              <li><Link to="/payment-wallet" className="hover:underline">Payment & Wallet Policy</Link>[cite: 1]</li>
              <li><Link to="/prohibited-restricted" className="hover:underline">Prohibited, Restricted and Conditionally Accepted Items Policy</Link>[cite: 1]</li>
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link>[cite: 1]</li>
            </ul>
          </section>

          {/* Contact Support Block */}
          <section className="bg-slate-50 p-4 rounded-lg border border-slate-200/90 space-y-2">
            <h3 className="text-xs font-bold text-slate-900">Contact Support</h3>
            <p className="text-slate-600">
              If you have any questions or require legal clarification regarding our Terms of Service, please reach out to our support team:
            </p>
            <div className="text-slate-700 font-medium space-y-0.5 pt-1">
              <p>Official Email: [To be completed before launch][cite: 1]</p>
              <p>Official WhatsApp: [To be completed before launch][cite: 1]</p>
              <p>Official Phone: [To be completed before launch][cite: 1]</p>
            </div>
          </section>

          {/* Bottom Callout / Back Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-slate-700 text-[11px] font-medium">
              Are you looking for another policy? Visit our <Link to="/policies" className="text-[#FF5C00] hover:underline font-bold">Policy Hub</Link> or contact support.
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

      {/* ==========================================
          4. FOOTER
      ========================================== */}
      
    </div>
  );
};

export default TermsOfService;