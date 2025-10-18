'use client';
import contactUs from '@/lib/api/contact';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaBuilding, FaPhoneAlt, FaPaperPlane } from 'react-icons/fa';


const COMPANY_CONTACT_INFO = {
    address: "43, Fagbile Estate Road Ijegun",
    phone: "07078849739",
    email: "info@elwifra.com",
    companyName: "EL-WIFRA VENTURES Ltd."
};

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await contactUs(formData);

      if (response.success) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setStatus("idle");
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-gray-700"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Send Us a Message
      </h3>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
        />
      </div>

      {/* Two columns for contact info and subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Subject
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition duration-150 shadow-md"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </>
        ) : (
          <>
            <FaPaperPlane className="w-5 h-5 mr-2" />
            Submit Message
          </>
        )}
      </button>
    </form>
  );
};

const ContactUsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <header className="text-center py-16 bg-white rounded-xl shadow-lg mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Contact <span className="text-emerald-600">EL-WIFRA</span>
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        We are here to help! Reach out to us for inquiries related to any of our business sectors: Supermarket, Event Center, Real Estate, or Water Factory.
                    </p>
                </header>

                {/* Contact Content Grid */}
                <div className="grid lg:grid-cols-3 gap-10">

                    {/* Contact Info Sidebar (2/3) */}
                    <div className="lg:col-span-1 space-y-8 p-6 lg:p-0">

                        <div className="bg-emerald-50 p-6 rounded-xl shadow-md border-l-4 border-emerald-600">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                            <p className="text-gray-600 mb-6">
                                Connect with our team directly via phone or email for specific inquiries.
                            </p>

                            {/* Address */}
                            <div className="flex items-start mb-4">
                                <FaBuilding className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900">Physical Address</p>
                                    <p className="text-gray-700">{COMPANY_CONTACT_INFO.address}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start mb-4">
                                <FaPhoneAlt className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900">Contact Number</p>
                                    <p className="text-gray-700">{COMPANY_CONTACT_INFO.phone}</p>
                                </div>
                            </div>

                            {/* Email (Derived) */}
                            <div className="flex items-start">
                                <FaPaperPlane className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-900">Email Address</p>
                                    <p className="text-gray-700">{COMPANY_CONTACT_INFO.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white p-6 rounded-xl shadow-xl h-68 flex items-center justify-center text-gray-400 border border-gray-100">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.046802224197!2d3.265855599999999!3d6.515760599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8f7b217a748f%3A0x9784f11837aca67e!2s43%20Fagbile%20Rd%2C%20Ijegun%2C%20Lagos%20102213%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2ske!4v1760771157327!5m2!1sen!2ske" width="350" height="230" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
