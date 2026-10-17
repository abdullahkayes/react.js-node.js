
  (function () {
    const container = document.getElementById('payments-tab-container');
    if (!container) return;

    /* Selecting a payment swaps the Linked Invoice section to that payment's
       invoice. The server has already sent every payment with its invoice, so
       switching is a local read rather than a second request: the section
       always shows what the database holds for that payment's invoice id. */
    const PAYMENTS_INVOICE = [{"id":9,"ref":"PAY-0000009","invoice":{"invoiceId":"INV-2600010","invoiceType":"Import Final Shipment","dueDate":"19/10/2026","issuedAt":"12/10/2026","total":"BDT 50,000.00"},"paidAt":"12/10/2026","amount":"BDT 20,000.00","provider":"Bank Transfer","status":"Completed"}];

    const linkedPanel = document.getElementById('linkedInvoicePanel');
    const linkedHeaderNote = document.getElementById('linkedInvoiceNote');

    const rows = Array.from(container.querySelectorAll('[data-payment-row]'));
    const buttons = Array.from(container.querySelectorAll('[data-select-payment]'));

    const setActiveRow = (id) => {
      rows.forEach((row) => {
        row.classList.toggle('bg-[#0f1d35]/70', String(row.getAttribute('data-payment-row')) === String(id));
      });
    };

    const renderLinked = (id) => {
      const payment = PAYMENTS_INVOICE.find((p) => String(p.id) === String(id));
      if (!payment || !linkedPanel) return;

      const invoice = payment.invoice;
      if (linkedHeaderNote) linkedHeaderNote.textContent = `Showing invoice ${invoice ? invoice.invoiceId : '—'} for payment ${payment.ref}`;

      const body = linkedPanel.querySelector('[data-linked-body]');
      const empty = linkedPanel.querySelector('[data-linked-empty]');
      if (!body) return;

      if (!invoice) {
        body.classList.add('hidden');
        if (empty) {
          empty.classList.remove('hidden');
          empty.innerHTML = `Payment <span class="font-mono text-slate-300">${payment.ref}</span> has no invoice linked to it.`;
        }
        return;
      }

      if (empty) empty.classList.add('hidden');
      body.classList.remove('hidden');
      body.innerHTML = `
        <div>
          <span class="text-slate-400 block font-medium">Invoice Type</span>
          <span class="text-white font-bold mt-0.5 block">${invoice.invoiceType}</span>
        </div>
        <div>
          <span class="text-slate-400 block font-medium">Invoice ID</span>
          <span class="text-white font-bold mt-0.5 block font-mono">${invoice.invoiceId}</span>
        </div>
        <div>
          <span class="text-slate-400 block font-medium">Due Date</span>
          <span class="text-white font-bold mt-0.5 block">${invoice.dueDate}</span>
        </div>
        <div>
          <span class="text-slate-400 block font-medium">Issued</span>
          <span class="text-white font-bold mt-0.5 block">${invoice.issuedAt}</span>
        </div>
        <div>
          <span class="text-slate-400 block font-medium">Payment Date</span>
          <span class="text-white font-bold mt-0.5 block">${payment.paidAt}</span>
        </div>
        <div>
          <span class="text-slate-400 block font-medium">Invoice Total</span>
          <span class="text-white font-bold mt-0.5 block">${invoice.total}</span>
        </div>
        <div>
          <span class="text-slate-400 block font-medium">Payment Total</span>
          <span class="text-white font-bold mt-0.5 block">${payment.amount}</span>
        </div>
        <div>
          <span class="text-slate-400 block font-medium">Payment Status</span>
          <span class="mt-0.5 block"><span class="px-2 py-0.5 rounded-full border text-[9.5px] font-medium ${payStatusClassOf(payment.status)}">${payment.status}</span></span>
        </div>
        <div>
          <span class="text-slate-400 block font-medium">Payment Method</span>
          <span class="text-white font-bold mt-0.5 block">${payment.provider}</span>
        </div>
      `;
    };

    function payStatusClassOf(label) {
      const PAY_STATUS_STYLES = {
        'Completed': 'bg-[#064e3b]/80 text-[#34d399] border-[#059669]/40',
        'Refunded': 'bg-[#3b2f0b]/80 text-[#fbbf24] border-[#a16207]/40',
        'Partially Refunded': 'bg-[#3b2f0b]/80 text-[#fbbf24] border-[#a16207]/40',
        'Pending': 'bg-[#1e3a8a]/80 text-[#93c5fd] border-[#1d4ed8]/40',
        'Failed': 'bg-[#450a0a]/80 text-[#fca5a5] border-[#b91c1c]/40',
        'Reversed': 'bg-[#450a0a]/80 text-[#fca5a5] border-[#b91c1c]/40',
        'Under Review': 'bg-[#3b2f0b]/80 text-[#fbbf24] border-[#a16207]/40',
      };
      return PAY_STATUS_STYLES[label] || 'bg-slate-800 text-slate-300 border-slate-700';
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-select-payment');
        setActiveRow(id);
        renderLinked(id);
      });
    });

    window.renderLinkedInvoice = renderLinked;
  })();
