import React from "react";
import { motion } from "framer-motion";
import { FiPhoneCall, FiMapPin, FiMail } from "react-icons/fi";
import { FaClock } from "react-icons/fa";
import Layout from "../Layout/Layout";
import ContactForm from "../Components/ContactForm";

function ContactUs() {
  const contactData = [
    {
      id: 1,
      title: "Email Us",
      description: "Get in touch via email for any inquiries or support.",
      icon: FiMail,
      contact: "vduc31100@gmail.com",
      action: "mailto:vduc31100@gmail.com",
      actionText: "Send Email",
    },
    {
      id: 2,
      title: "Call Us",
      description: "Speak directly with our support team.",
      icon: FiPhoneCall,
      contact: "+1234-567-890",
      action: "tel:+1234567890",
      actionText: "Call Now",
    },
    {
      id: 3,
      title: "Visit Us",
      description: "Find us at our office location.",
      icon: FiMapPin,
      contact: "Dar es salaam, Tanzania",
      subContact: "345 Kigamboni, Street No. 12",
      action: "https://maps.google.com",
      actionText: "Get Directions",
    },
    {
      id: 4,
      title: "Business Hours",
      description: "We're here to help during these hours.",
      icon: FaClock,
      contact: "Monday - Friday",
      subContact: "9:00 AM - 6:00 PM (EST)",
      action: null,
      actionText: null,
    },
  ];

  return (
    <Layout>
      <div className="bg-main min-h-screen">
        {/* Hero Section */}
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-subMain/5 to-transparent" />
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                Have questions or feedback? We'd love to hear from you. Our team is here to help you with anything you need.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="container mx-auto px-4 md:px-8 mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactData.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-card backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-subMain transition-all duration-300 group"
                >
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-subMain/20 mb-4 group-hover:bg-subMain/30 transition-colors">
                    <Icon className="text-2xl text-subMain" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-1 mb-4">
                    <p className="text-white font-medium">{item.contact}</p>
                    {item.subContact && (
                      <p className="text-sm text-text-secondary">{item.subContact}</p>
                    )}
                  </div>

                  {/* Action Button */}
                  {item.action && (
                    <a
                      href={item.action}
                      target={item.id === 3 ? "_blank" : undefined}
                      rel={item.id === 3 ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 text-subMain hover:text-white text-sm font-semibold transition-colors"
                    >
                      {item.actionText}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="container mx-auto px-4 md:px-8 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:sticky lg:top-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Let's Start a Conversation
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-subMain/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-subMain">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Quick Response</h4>
                    <p className="text-text-secondary text-sm">
                      We typically respond within 24 hours on business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-subMain/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-subMain">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Friendly Support</h4>
                    <p className="text-text-secondary text-sm">
                      Our team is here to provide you with the best assistance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-subMain/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-subMain">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Privacy First</h4>
                    <p className="text-text-secondary text-sm">
                      Your information is safe and will never be shared.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ Teaser Section */}
        <div className="container mx-auto px-4 md:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Looking for Quick Answers?
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Check out our FAQ section where we answer the most common questions about our platform, features, and services.
            </p>
            <button className="inline-flex items-center gap-3 glass-dark backdrop-blur-md text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-subMain">
              View FAQ
              <span>→</span>
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default ContactUs;
