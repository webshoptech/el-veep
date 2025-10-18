import React, { Suspense } from 'react';
import {
  FaBuilding,
  FaShoppingCart,
  FaCalendarAlt,
  FaTint,
  FaUtensils,
  FaBullseye,
  FaPaperPlane,
  FaHandshake,
  FaShieldAlt,
  FaLightbulb,
  FaLeaf,
} from "react-icons/fa";

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

interface CoreValue {
  icon: IconComponent;
  title: string;
  description: string;
}

interface Business {
  name: string;
  icon: IconComponent;
  description: string;
  features?: string[];
}

interface CompanyData {
  name: string;
  tagline: string;
  about: string;
  mission: string;
  vision: string;
  coreValues: CoreValue[];
  businesses: Business[];
  strategicEdge: string[];
}
const COMPANY_DATA: CompanyData = {
  name: "EL-WIFRA VENTURES Ltd.",
  tagline: "Your Trusted Lifestyle Partner.",
  about: "EL-WIFRA VENTURES Ltd. is a dynamic and multi-sectoral enterprise that integrates essential lifestyle and Hospitality services under one trusted brand. With operations spanning Supermarket Retail, Premium Event Hosting, Real Estate Solutions, and Water Production, we are redefining convenience, quality, and value in everyday living for individuals, families, and businesses across Nigeria.",
  mission: "To consistently deliver high-quality products and services with excellence, transparency, and customer satisfaction at the core of everything we do.",
  vision: "To become a leading multi-sectoral enterprise that fosters sustainable development, empowers communities, and creates long-term value through innovation, integrity, and quality service.",
  coreValues: [
    { icon: FaHandshake, title: "Customer-Centricity", description: "Our customers are at the heart of every decision." },
    { icon: FaShieldAlt, title: "Integrity", description: "Honesty, accountability, and ethical practices in all we do." },
    { icon: FaLightbulb, title: "Innovation", description: "Embracing new ideas and technology to drive efficiency and improvement." },
    { icon: FaLeaf, title: "Sustainability", description: "Long-term growth with environmental and social responsibility." },
    { icon: FaBullseye, title: "Quality", description: "Excellence in every product, service, and customer experience." },
  ],
  businesses: [
    {
      name: "EL-VEEP SUPERMARKET",
      icon: FaShoppingCart,
      description: "Our supermarket division offers a modern, seamless, and affordable shopping experience. We provide a wide array of essential groceries, household items, and lifestyle products at competitive prices.",
      features: ["Trusted brands and verified suppliers", "Regular promotions and discounts", "Customer-first shopping experience"]
    },
    {
      name: "EL-VEEP EVENT CENTER",
      icon: FaCalendarAlt,
      description: "Our state-of-the-art event venue is designed to accommodate both private and corporate gatherings from weddings and birthdays to conferences and seminars, buffet and tradeshows. With flexible space and professional support, we make every event unforgettable.",
      features: ["Elegant and modern facilities", "Full service event planning and coordination", "Scalable venue for small to large events"]
    },
    {
      name: "REAL ESTATE",
      icon: FaBuilding,
      description: "We provide innovative property solutions tailored to the needs of individuals, families, and organizations. From affordable housing to commercial properties, we deliver transparency and value in every transaction.",
      features: ["Property development, sales, and rentals", "Affordable and luxury housing solutions", "Transparent, customer first processes"]
    },
    {
      name: "EL-VEEP WATER FACTORY",
      icon: FaTint,
      description: "We produce and distribute premium, hygienic drinking water that meets international quality standards. Our goal is to ensure every household and business has access to safe and affordable water.",
      features: ["International-standard water purification", "Retail and bulk distribution", "Eco-friendly packaging initiatives", "Private label bottled water for events"]
    },
    {
      name: "CATERING AND PASTRY",
      icon: FaUtensils,
      description: "This sector complements our hospitality services, offering premium catering for events hosted at the center and bespoke pastry services for all occasions."
    }
  ],
  strategicEdge: [
    "Diversification: We operate in four complementary industries, ensuring steady revenue streams and operational synergy.",
    "Innovation: Tech-driven systems enhance our operations across all divisions.",
    "Community Impact: We create jobs, support local economies, and contribute to community development.",
    "Customer Loyalty: We prioritize building long-term relationships through service excellence and trust.",
  ]
};

// Type the component props explicitly
const BusinessCard: React.FC<{ business: Business }> = ({ business }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">
    {/* Access the Icon component via the business object */}
    <business.icon className="w-10 h-10 text-emerald-600 mb-4 bg-emerald-50 p-2 rounded-lg" />
    <h3 className="text-xl font-bold text-gray-900 mb-3">{business.name}</h3>
    <p className="text-gray-600 mb-4 text-sm">{business.description}</p>

    {business.features && (
      <ul className="space-y-2 text-sm text-gray-700">
        {/* Type the array map parameters */}
        {business.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start"> 
            <svg className="w-4 h-4 text-emerald-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    )}
  </div>
);

// Type the component props explicitly
const ValueCard: React.FC<{ value: CoreValue }> = ({ value }) => (
  <div className="flex flex-col items-center text-center p-6 bg-emerald-50 rounded-lg shadow-inner">
    <value.icon className="w-8 h-8 text-emerald-700 mb-3" />
    <h4 className="font-semibold text-lg text-gray-900 mb-1">{value.title}</h4>
    <p className="text-sm text-gray-600">{value.description}</p>
  </div>
);
 
const AboutPageContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
 
        <header className="text-center py-16 bg-white rounded-xl shadow-lg mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            About <span className="text-emerald-600">{COMPANY_DATA.name}</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
            {COMPANY_DATA.tagline}
          </p>
          <div className="max-w-4xl mx-auto p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-600">
            <p className="text-md text-gray-800 italic">
              &quot;We are more than just a business; we are your trusted lifestyle partner. From the groceries you buy and the events you celebrate, to the water you drink and the homes you live in, EL-WIFRA VENTURES integrates life&apos;s essentials with reliability and excellence.&quot;
            </p>
          </div>
        </header>

        {/* Core Narrative */}
        <section className="py-12 px-6 bg-white rounded-xl shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-emerald-100 pb-2">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {COMPANY_DATA.about}
          </p>
        </section>

        {/* Vision and Mission */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">

          {/* Vision Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-emerald-500">
            <div className="flex items-center text-emerald-600 mb-4">
              <FaBullseye className="w-6 h-6 mr-3" />
              <h3 className="text-2xl font-bold">OUR VISION</h3>
            </div>
            <p className="text-gray-700">{COMPANY_DATA.vision}</p>
          </div>

          {/* Mission Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-emerald-500">
            <div className="flex items-center text-emerald-600 mb-4">
              <FaPaperPlane className="w-6 h-6 mr-3" />
              <h3 className="text-2xl font-bold">OUR MISSION</h3>
            </div>
            <p className="text-gray-700">{COMPANY_DATA.mission}</p>
          </div>
        </section>

        {/* Our Businesses / Industry Sectors */}
        <section className="py-12">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10">Our Businesses</h2>
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            EL-WIFRA VENTURES Ltd. is a multi-sectoral enterprise operating in the following essential lifestyle and hospitality segments:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COMPANY_DATA.businesses.map((business, index) => (
              <BusinessCard key={index} business={business} />
            ))}
          </div>
        </section>

        {/* Core Values and Strategic Edge */}
        <section className="py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Core Values Block */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Our Core Values</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {COMPANY_DATA.coreValues.map((value, index) => (
                  <ValueCard key={index} value={value} />
                ))}
              </div>
            </div>

            {/* Strategic Edge Block */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Our Strategic Edge</h2>
              <ul className="space-y-4 text-gray-700">
                {COMPANY_DATA.strategicEdge.map((edge, index) => (
                  <li key={index} className="flex items-start"> 
                    <FaShieldAlt className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{edge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>


      </div>
    </div>
  );
};
const AboutPage = () => (
  <Suspense fallback={<div className="p-8 text-center text-lg text-gray-600">Loading company profile...</div>}>
    <AboutPageContent />
  </Suspense>
);

export default AboutPage;
