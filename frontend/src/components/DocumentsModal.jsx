import React from 'react';
import { format } from 'date-fns';

const documentTypeLabels = {
  invoice: 'Invoice',
  packing_list: 'Packing List',
  bill_of_lading: 'Bill of Lading',
  customs_declaration: 'Customs Declaration',
  insurance_certificate: 'Insurance Certificate',
  commercial_invoice: 'Commercial Invoice',
  certificate_of_origin: 'Certificate of Origin',
  shipping_instructions: 'Shipping Instructions',
  delivery_proof: 'Delivery Proof',
  return_authorization: 'Return Authorization',
  rto_document: 'RTO Document',
  insurance_claim: 'Insurance Claim',
  other: 'Other',
};

const getDocumentTypeLabel = (type) => documentTypeLabels[type] || type;

const DocumentsModal = ({ documents, onClose, onDownload }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">All Documents</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">✕</button>
          </div>
          <p className="text-slate-500 text-center py-8">No documents available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">All Documents ({documents.length})</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">✕</button>
        </div>
        <div className="space-y-3">
          {documents.map((doc, idx) => (
            <div key={doc.id || idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{doc.fileName}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-600">
                      {getDocumentTypeLabel(doc.documentType)}
                    </span>
                    {doc.shipmentItemId && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-50 text-amber-600">
                        Item Level
                      </span>
                    )}
                    {doc.fileSize && (
                      <span>({(doc.fileSize / 1024).toFixed(1)} KB)</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(doc);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-[#FF5C00] hover:text-[#e55300] border border-[#FF5C00] rounded-lg transition-colors shrink-0"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;