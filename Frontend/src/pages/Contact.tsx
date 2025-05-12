import React, { useState, useEffect } from "react";
import { ArrowRight, Phone, MapPin, Mail, Globe, MessageCircle, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
    phone:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Set animation state after component mounts
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const validate = () => {
    let newErrors = {};
    if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
    }
    if (formData.phone.trim().length < 3) {
      newErrors.phone = "At Least 10 Number(Ex : 0778231121)";
    }
    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Make a POST request to the backend API
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "",phone: "", title: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define the ContactInfoCard component that was missing
  const ContactInfoCard = ({ icon, title, content, delay }) => (
    <div 
      className={`bg-white p-6 rounded-xl shadow-md transition-all duration-700 ${
        animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-4 text-black">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );

  // Define the SocialIcon component that was missing
  const SocialIcon = ({ path, color, hoverColor }) => (
    <a 
      href="#" 
      className={`w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 ${color} hover:${hoverColor} transition-colors duration-300 transform hover:scale-110`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className="w-5 h-5 fill-current"
      >
        <path d={path}></path>
      </svg>
    </a>
  );

  // Define placeholder image URL
  const menJacketImage = "https://i.ibb.co/dDN5B2s/DSC07656.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Parallax effect */}
      <div className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-fixed"
          style={{
            backgroundImage: `url(${menJacketImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: animateIn ? 'scale(1)' : 'scale(1.1)',
            transition: 'transform 1.5s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 
            className={`text-6xl md:text-7xl font-bold tracking-tight transition-all duration-1000 ${
              animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Get in Touch
          </h1>
          <p 
            className={`mt-4 text-xl md:text-2xl max-w-2xl text-center text-gray-200 transition-all duration-1000 delay-300 ${
              animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            We'd love to hear from you. Let's start a conversation.
          </p>
        </div>
        
        {/* Animated wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,96L60,85.3C120,75,240,53,360,53.3C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
              className={`transition-all duration-1500 ${
                animateIn ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
            ></path>
          </svg>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <ContactInfoCard 
            icon={<Phone className="w-6 h-6" />}
            title="Call Us"
            content="+9478 289 8993"
            delay={100}
          />
          <ContactInfoCard 
            icon={<Mail className="w-6 h-6" />}
            title="Email Us"
            content="support@cannible.co"
            delay={200}
          />
          <ContactInfoCard 
            icon={<MapPin className="w-6 h-6" />}
            title="Visit Us"
            content="Suramya, Dewagoda, Madampe, Ambalangoda, Sri Lanka"
            delay={300}
          />
          <ContactInfoCard 
            icon={<Globe className="w-6 h-6" />}
            title="Website"
            content="www.cannible.co"
            delay={400}
          />
        </div>

        {/* Social Media + Form Section */}
        <div 
          className={`grid grid-cols-1 lg:grid-cols-3 gap-12 transition-all duration-1000 ${
            animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {/* Left Column - Social + Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-xl h-full">
              <h2 className="text-3xl font-bold mb-8 relative">
                Connect With Us
                <span className="absolute bottom-0 left-0 w-20 h-1 bg-black"></span>
              </h2>
              
              {/* Social media links */}
              <div className="flex justify-between mb-12">
                {/* Facebook */}
                <SocialIcon 
                  path="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  color="text-blue-600"
                  hoverColor="text-blue-800"
                />
                {/* Instagram */}
                <SocialIcon 
                  path="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"
                  color="text-pink-600"
                  hoverColor="text-pink-800"
                />
                {/* Twitter */}
                <SocialIcon 
                  path="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  color="text-blue-400"
                  hoverColor="text-blue-600"
                />
              </div>
              
              {/* Contact photo */}
              <div className="relative overflow-hidden rounded-xl mb-8 shadow-lg">
                <img 
                  src={menJacketImage}
                  alt="Our team" 
                  className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <p className="font-medium">Customer Support Team</p>
                    <p className="text-sm text-gray-300">Available 24/7</p>
                  </div>
                </div>
              </div>
              
              {/* Live chat button */}
              <a
                href="https://wa.me/message/W4RVIOGO2CS7G1"
                className="group flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-lg w-full transition-all duration-300 hover:bg-gray-800 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
                <span>Start WhatApp Chat</span>
              </a>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
  <div className="bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
    {/* Animated background pattern */}
    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-black opacity-5 rounded-full"></div>
    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-5 rounded-full"></div>
    
    <h2 className="text-3xl font-bold mb-2 relative">
      Send Us a Message
      <span className="absolute bottom-0 left-0 w-20 h-1 bg-black"></span>
    </h2>
    <p className="text-gray-600 mb-8">We'll get back to you as soon as possible</p>
    
    {submitted ? (
      <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg flex items-center">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg">Message Sent!</h3>
          <p>Thank you for contacting us. We'll respond shortly.</p>
        </div>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
              placeholder="John Doe"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
              placeholder="john@example.com"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
              placeholder="(123) 456-7890"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Subject
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
              placeholder="How can we help you?"
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
            rows="6"
            placeholder="Please let us know how we can assist you..."
            required
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send Message <ArrowRight className="inline w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    )}
  </div>
</div>
        </div>
      </div>

      {/* Map Section */}
      <div 
        className={`max-w-7xl mx-auto px-4 py-16 transition-all duration-1000 ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{ transitionDelay: "700ms" }}
      >
        <div className="bg-white p-4 rounded-2xl shadow-xl overflow-hidden">
          <div className="relative pb-[56.25%] h-0">
            {/* Replace with your preferred map iframe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31736.89392361245!2d80.00922082402344!3d6.249688499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae17c87ac93f759%3A0xd8343414dab3fe23!2sAmbalangoda!5e0!3m2!1sen!2slk!4v1716419390983!5m2!1sen!2slk" 
              className="absolute top-0 left-0 w-full h-full border-0 rounded-xl"
              allowFullScreen=""
              loading="lazy"
              title="Location Map"
            ></iframe>
          </div>
        </div>
      </div>

      {/* FAQ Section (Optional) */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          {[
            { question: "How quickly do you respond to inquiries?", answer: "We aim to respond to all inquiries within 24 hours during business days." },
            { question: "Do you offer international shipping?", answer: "Yes, we ship to most countries worldwide. Shipping rates vary by location." },
            { question: "What payment methods do you accept?", answer: "We accept credit cards, PayPal, and bank transfers for all orders." }
          ].map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-xl shadow-md transition-all duration-700 ${
                animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${800 + (index * 100)}ms` }}
            >
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}