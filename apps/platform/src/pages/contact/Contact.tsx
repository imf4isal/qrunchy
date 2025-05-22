// src/pages/contact/Contact.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-bold rounded-2xl mb-6">
                Q
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions about Qrunchy? We'd love to hear from you. Send
                us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    {[
                      {
                        icon: (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        ),
                        label: "Email",
                        value: "hello@qrunchy.com",
                        link: "mailto:hello@qrunchy.com",
                      },
                      {
                        icon: (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        ),
                        label: "Phone",
                        value: "+1 (555) 123-4567",
                        link: "tel:+15551234567",
                      },
                      {
                        icon: (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        ),
                        label: "Address",
                        value: "123 Tech Street, Digital City, DC 12345",
                        link: null,
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {item.label}
                          </h3>
                          {item.link ? (
                            <a
                              href={item.link}
                              className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-gray-600">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t">
                    <h3 className="font-semibold text-gray-800 mb-4">
                      Follow Us
                    </h3>
                    <div className="flex gap-3">
                      {[
                        { name: "Twitter", icon: "📱" },
                        { name: "LinkedIn", icon: "💼" },
                        { name: "Instagram", icon: "📸" },
                      ].map((social, index) => (
                        <button
                          key={index}
                          className="w-10 h-10 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                          title={social.name}
                        >
                          {social.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg border p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for reaching out. We'll get back to you within
                        24 hours.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Send us a Message
                      </h2>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Full Name *
                            </label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your full name"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Email Address *
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your@email.com"
                              className="w-full"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Subject *
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="What's this about?"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Message *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            required
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us more about your question or how we can help..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <p className="text-sm text-gray-500">
                            * Required fields
                          </p>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                          >
                            {isSubmitting ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              "Send Message"
                            )}
                          </Button>
                        </div>
                      </form>
                    </>
                  )}
                </div>

                {/* FAQ Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        question: "How quickly can I create a menu?",
                        answer:
                          "Most restaurants complete their first menu in under 10 minutes.",
                      },
                      {
                        question: "Do I need technical skills?",
                        answer:
                          "Not at all! Qrunchy is designed to be simple and intuitive for everyone.",
                      },
                      {
                        question: "Can I update my menu after creating it?",
                        answer:
                          "Yes, you can update your menu anytime through your dashboard.",
                      },
                      {
                        question: "Is there a limit to menu items?",
                        answer:
                          "No limits! Add as many categories and items as you need.",
                      },
                    ].map((faq, index) => (
                      <div key={index} className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
