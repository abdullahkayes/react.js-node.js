import React from 'react';
import { Link } from 'react-router-dom';

const ServicePage = ({ title, description, features }) => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {features.map((f, idx) => (
            <li key={idx}>{f}</li>
          ))}
        </ul>
        <div className="mt-8">
          <Link
            to="/quote"
            className="inline-block px-6 py-3 bg-[#FF6B00] text-white font-semibold rounded-lg hover:bg-orange-600 transition"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export const AssistedPurchase = () => (
  <ServicePage
    title="Assisted Purchase"
    description="Let our team handle your shopping from international stores and ship everything to you in one consolidated package."
    features={[
      'Shop from any global online store',
      'We verify product availability and condition',
      'Consolidation and packaging in our warehouse',
      'Transparent handling fees',
    ]}
  />
);

export const SelfPurchase = () => (
  <ServicePage
    title="Self-Purchase"
    description="Ship your personally purchased items from anywhere in the world with full visibility and control."
    features={[
      'Drop-off at partner locations worldwide',
      'Flexible shipping options',
      'Real-time tracking',
      'Customs support included',
    ]}
  />
);

export const ExportImport = () => (
  <ServicePage
    title="Export Import"
    description="End-to-end export and import solutions for businesses with full documentation and compliance support."
    features={[
      'Export and import documentation',
      'Customs clearance and compliance',
      'Freight forwarding by air and sea',
      'Global trade advisory support',
    ]}
  />
);

export const AirFreight = () => (
  <ServicePage
    title="Air Freight"
    description="Fast, reliable air freight services for time-sensitive shipments across continents."
    features={[
      'Priority cargo handling',
      'Global airline partnerships',
      'Express and standard options',
      'Cargo insurance available',
    ]}
  />
);

export const OceanFreight = () => (
  <ServicePage
    title="Ocean Freight"
    description="Cost-effective ocean shipping for large and heavy cargo with port-to-port and door-to-door options."
    features={[
      'FCL and LCL options',
      'Port-to-port and door-to-door',
      'Container tracking',
      'Customs documentation support',
    ]}
  />
);

export const DoorToDoor = () => (
  <ServicePage
    title="Door to Door"
    description="Complete pickup and final delivery service so you don’t have to worry about local logistics."
    features={[
      'Pickup from sender address',
      'Final-mile delivery to receiver',
      'Real-time tracking updates',
      'Flexible time windows',
    ]}
  />
);

export const ReturnRTO = () => (
  <ServicePage
    title="Return RTO"
    description="Reverse logistics and return-to-origin services for seamless handling of returned or undelivered shipments."
    features={[
      'Pickup for returned items',
      'Return origin processing',
      'Tracking for reverse shipment',
      'Damage inspection support',
    ]}
  />
);

export const ShipmentInsurance = () => (
  <ServicePage
    title="Shipment Insurance"
    description="Protect your shipments with comprehensive cargo insurance coverage tailored to your value and route."
    features={[
      'Full-value and partial coverage options',
      'Easy online claim initiation',
      'Coverage across air, sea, and ground',
      'Transparent premiums',
    ]}
  />
);

export const WarehouseConsolidation = () => (
  <ServicePage
    title="Warehouse Consolidation"
    description="Combine multiple shipments into one optimized package to reduce costs and improve delivery timelines."
    features={[
      'Multiple packages accepted',
      'Inventory visibility',
      'Repackaging and consolidation',
      'Reduced shipping costs',
    ]}
  />
);
