import { useState } from "react";
import contactService from "../../services/contactService";
import Button from "../../components/common/Button";

/* =========================================
   CONTACT PAGE
========================================= */

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear messages while user is typing
    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  /* =========================================
     SUBMIT FORM
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    try {
      setLoading(true);

      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      await contactService.createContact(contactData);

      setSuccess(
        "Thank you! Your message has been sent successfully."
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05080d] text-white">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#05080d] px-4 py-20 sm:px-6 lg:px-8">

        {/* Background Glow */}

        <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">

          <span className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Get In Touch
          </span>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Contact NEXORA
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Have a question about our laptops, orders, or services?
            Our team is here to help.
          </p>

        </div>
      </section>

      {/* =========================================
          CONTACT CONTENT
      ========================================= */}

      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

        {/* Background Glow */}

        <div className="pointer-events-none absolute left-1/4 top-20 h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-3xl" />

        <div className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-blue-600/[0.04] blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-10">

          {/* =========================================
              LEFT SIDE
          ========================================= */}

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-8 shadow-2xl shadow-black/30 sm:p-10">

            {/* Card Glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative">

              <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                NEXORA Support
              </span>

              <h2 className="mt-4 text-3xl font-black text-white">
                We're here to help.
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                Whether you need help choosing the right laptop,
                have a question about your order, or simply want
                to learn more about NEXORA, feel free to contact us.
              </p>

              {/* Contact Information */}

              <div className="mt-10 space-y-7">

                {/* Email */}

                <div className="group flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg text-cyan-400 transition-all duration-300 group-hover:border-cyan-400/40 group-hover:bg-cyan-400 group-hover:text-black">
                    ✉
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Email
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      support@nexora.com
                    </p>
                  </div>

                </div>

                {/* Phone */}

                <div className="group flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg text-cyan-400 transition-all duration-300 group-hover:border-cyan-400/40 group-hover:bg-cyan-400 group-hover:text-black">
                    ☎
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Phone
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      +92 300 1234567
                    </p>
                  </div>

                </div>

                {/* Support */}

                <div className="group flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg text-cyan-400 transition-all duration-300 group-hover:border-cyan-400/40 group-hover:bg-cyan-400 group-hover:text-black">
                    💬
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Customer Support
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Monday - Saturday, 9:00 AM - 6:00 PM
                    </p>
                  </div>

                </div>

              </div>

              {/* Bottom Accent */}

              <div className="mt-10 h-px w-full bg-gradient-to-r from-cyan-400/40 via-cyan-400/10 to-transparent" />

            </div>
          </div>

          {/* =========================================
              CONTACT FORM
          ========================================= */}

          <div className="rounded-3xl border border-white/10 bg-[#0b1119] p-6 shadow-2xl shadow-black/30 sm:p-10">

            <div className="mb-8">

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                Contact Form
              </span>

              <h2 className="mt-3 text-2xl font-black text-white">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Fill out the form below and our team will get
                back to you as soon as possible.
              </p>

            </div>

            {/* =========================================
                SUCCESS MESSAGE
            ========================================= */}

            {success && (
              <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-400">
                {success}
              </div>
            )}

            {/* =========================================
                ERROR MESSAGE
            ========================================= */}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-400">
                {error}
              </div>
            )}

            {/* =========================================
                FORM
            ========================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* =====================================
                  NAME + EMAIL
              ===================================== */}

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-300"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                  />

                </div>

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-300"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                  />

                </div>

              </div>

              {/* =====================================
                  PHONE
              ===================================== */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* =====================================
                  SUBJECT
              ===================================== */}

              <div>

                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* =====================================
                  MESSAGE
              ===================================== */}

              <div>

                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-300"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-[#0a1119] focus:ring-2 focus:ring-cyan-400/10"
                />

              </div>

              {/* =====================================
                  SUBMIT
              ===================================== */}

              <div className="pt-2">

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Sending..." : "Send Message →"}
                </Button>

              </div>

            </form>

          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
