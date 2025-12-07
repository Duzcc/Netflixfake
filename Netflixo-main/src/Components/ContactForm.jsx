import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaUser, FaEnvelope, FaComment } from "react-icons/fa";

function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // TODO: Replace with actual API call
            console.log("Form submitted:", formData);

            setSubmitStatus("success");
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

            // Clear success message after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputFields = [
        {
            name: "name",
            label: "Your Name",
            type: "text",
            icon: FaUser,
            placeholder: "Enter your name",
        },
        {
            name: "email",
            label: "Email Address",
            type: "email",
            icon: FaEnvelope,
            placeholder: "Enter your email",
        },
        {
            name: "subject",
            label: "Subject",
            type: "text",
            icon: FaComment,
            placeholder: "What's this about?",
        },
    ];

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="glass-card backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
            <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
            <p className="text-text-secondary mb-8">
                Have a question or feedback? We'd love to hear from you.
            </p>

            <div className="space-y-6">
                {/* Input Fields */}
                {inputFields.map((field) => {
                    const Icon = field.icon;
                    const isFocused = focusedField === field.name;
                    const hasValue = formData[field.name].length > 0;
                    const hasError = errors[field.name];

                    return (
                        <div key={field.name} className="relative">
                            <div
                                className={`relative flex items-center glass-dark backdrop-blur-md rounded-lg border-2 transition-all duration-300 ${hasError
                                        ? "border-error"
                                        : isFocused
                                            ? "border-subMain shadow-glow"
                                            : "border-white/20 hover:border-white/40"
                                    }`}
                            >
                                <Icon className="absolute left-4 text-text-secondary text-lg" />
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField(field.name)}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder=" "
                                    className="w-full bg-transparent text-white pl-12 pr-4 py-4 outline-none peer"
                                />
                                <label
                                    className={`absolute left-12 transition-all duration-200 pointer-events-none ${isFocused || hasValue
                                            ? "-top-2 text-xs bg-main px-2 text-subMain"
                                            : "top-4 text-sm text-text-secondary"
                                        }`}
                                >
                                    {field.label}
                                </label>
                            </div>
                            {hasError && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-error text-xs mt-1 ml-1"
                                >
                                    {hasError}
                                </motion.p>
                            )}
                        </div>
                    );
                })}

                {/* Message Textarea */}
                <div className="relative">
                    <div
                        className={`relative glass-dark backdrop-blur-md rounded-lg border-2 transition-all duration-300 ${errors.message
                                ? "border-error"
                                : focusedField === "message"
                                    ? "border-subMain shadow-glow"
                                    : "border-white/20 hover:border-white/40"
                            }`}
                    >
                        <FaComment className="absolute left-4 top-4 text-text-secondary text-lg" />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("message")}
                            onBlur={() => setFocusedField(null)}
                            placeholder=" "
                            rows="5"
                            className="w-full bg-transparent text-white pl-12 pr-4 py-4 outline-none resize-none peer"
                        />
                        <label
                            className={`absolute left-12 transition-all duration-200 pointer-events-none ${focusedField === "message" || formData.message.length > 0
                                    ? "-top-2 text-xs bg-main px-2 text-subMain"
                                    : "top-4 text-sm text-text-secondary"
                                }`}
                        >
                            Your Message
                        </label>
                        {formData.message.length > 0 && (
                            <div className="absolute bottom-2 right-4 text-xs text-text-secondary">
                                {formData.message.length} / 500
                            </div>
                        )}
                    </div>
                    {errors.message && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-error text-xs mt-1 ml-1"
                        >
                            {errors.message}
                        </motion.p>
                    )}
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full bg-subMain text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 ${isSubmitting
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:bg-subMain/90 shadow-glow"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <FaPaperPlane />
                            <span>Send Message</span>
                        </>
                    )}
                </motion.button>

                {/* Status Messages */}
                {submitStatus === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass bg-success/20 border border-success/50 text-success px-4 py-3 rounded-lg text-sm"
                    >
                        ✓ Message sent successfully! We'll get back to you soon.
                    </motion.div>
                )}

                {submitStatus === "error" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass bg-error/20 border border-error/50 text-error px-4 py-3 rounded-lg text-sm"
                    >
                        ✗ Something went wrong. Please try again later.
                    </motion.div>
                )}
            </div>
        </motion.form>
    );
}

export default ContactForm;
