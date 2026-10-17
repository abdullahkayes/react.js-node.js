import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/PublicLayout';

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

export default ServicePage;
