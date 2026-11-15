
import { Link } from "react-router-dom";
import {
  FileText,
  User,
  ShoppingBag,
  CreditCard,
  Truck,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Mail,
} from "lucide-react";

const TermsAndConditions = () => {
  const lastUpdated = "November 14, 2026";

  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: [
        "Welcome to NEXORA. By accessing or using our website, you agree to follow these Terms & Conditions and any applicable laws.",
        "If you do not agree with these terms, please discontinue using our website and services.",
      ],
    },
    {
      icon: User,
      title: "2. User Accounts",
      content: [
        "Some website features require you to create an account. You agree to provide accurate and up-to-date information when registering.",
        "You are responsible for maintaining the confidentiality of your login credentials and for activities performed through your account.",
        "Please contact us if you believe your account has been accessed or used without your permission.",
        "NEXORA may restrict or suspend accounts involved in misuse, fraudulent activity, or violations of these terms.",
      ],
    },
    {
      icon: ShoppingBag,
      title: "3. Products and Availability",
      content: [
        "NEXORA offers laptops and related technology products through its online store.",
        "We aim to display accurate product descriptions, images, specifications, prices, and availability. However, product information may occasionally contain errors or become outdated.",
        "Product images are provided for illustration. Actual product appearance, packaging, or specifications may vary depending on the manufacturer or supplier.",
        "Product availability is subject to stock and may change without prior notice.",
      ],
    },
    {
      icon: CreditCard,
      title: "4. Pricing and Payments",
      content: [
        "Product prices are displayed on the website and may change without prior notice.",
        "The price applicable to an order should be the price confirmed during checkout, subject to correction of obvious pricing errors.",
        "Any available payment methods and applicable charges should be displayed during checkout.",
        "Where third-party payment providers are used, their own terms and privacy policies may also apply.",
        "NEXORA reserves the right to review or cancel an order where a pricing, payment, or transaction error has occurred, subject to applicable law.",
      ],
    },
    {
      icon: ShoppingBag,
      title: "5. Orders and Order Confirmation",
      content: [
        "Placing an order represents a purchase request. An order confirmation or status update does not necessarily mean that an order has been dispatched.",
        "Orders may be reviewed for product availability, delivery information, payment status, and other verification requirements.",
        "If an order cannot be fulfilled, we will make reasonable efforts to notify the customer and explain the next steps.",
        "Customers should review their cart, quantities, delivery information, and order total carefully before completing checkout.",
      ],
    },
    {
      icon: Truck,
      title: "6. Shipping and Delivery",
      content: [
        "Delivery availability, estimated delivery times, and shipping charges may depend on the customer's location and the selected delivery service.",
        "Any delivery estimates provided on the website are estimates and are not guaranteed unless explicitly stated.",
        "Customers are responsible for providing a complete and accurate delivery address and contact information.",
        "Delays may occur due to circumstances outside our reasonable control, including courier issues, weather, or other unexpected events.",
      ],
    },
    {
      icon: RefreshCw,
      title: "7. Returns, Refunds and Replacements",
      content: [
        "Requests for returns, refunds, or replacements should be submitted through our customer support channels.",
        "Eligibility may depend on the product, its condition, the reason for the request, and any applicable manufacturer or store warranty.",
        "Customers should contact NEXORA before returning a product so that the appropriate instructions can be provided.",
        "Any applicable return window, refund method, shipping responsibility, and product-condition requirements should be confirmed with NEXORA before a purchase.",
        "Nothing in these terms is intended to remove rights that customers may have under applicable law.",
      ],
    },
    {
      icon: MessageSquare,
      title: "8. Reviews and User Content",
      content: [
        "Registered users may be able to submit ratings and reviews for products.",
        "You agree that submitted content should be genuine, relevant, respectful, and based on your own experience.",
        "You must not submit unlawful, misleading, abusive, fraudulent, or otherwise inappropriate content.",
        "NEXORA may remove or restrict content that violates these terms or applicable requirements.",
      ],
    },
    {
      icon: ShieldCheck,
      title: "9. Intellectual Property",
      content: [
        "Website content, branding, logos, graphics, design elements, text, and other materials may be owned by or licensed to NEXORA.",
        "You may browse and use the website for personal, lawful shopping purposes.",
        "You must not copy, reproduce, distribute, modify, or commercially exploit website materials without appropriate authorization.",
      ],
    },
    {
      icon: AlertCircle,
      title: "10. Prohibited Activities",
      content: [
        "You agree not to:",
      ],
      list: [
        "Use the website for unlawful or fraudulent activities.",
        "Attempt to gain unauthorized access to accounts or systems.",
        "Interfere with website security or normal functionality.",
        "Submit false account, order, or contact information.",
        "Upload harmful code or attempt to disrupt website services.",
        "Misuse reviews, customer support, or other website features.",
      ],
    },
    {
      icon: AlertCircle,
      title: "11. Limitation of Liability",
      content: [
        "To the extent permitted by applicable law, NEXORA is not responsible for indirect or unforeseeable losses arising from the use of the website or temporary service interruptions.",
        "We do not guarantee that the website will always be available, error-free, or compatible with every device or browser.",
        "Nothing in these terms excludes liability that cannot legally be excluded under applicable law.",
      ],
    },
    {
      icon: RefreshCw,
      title: "12. Changes to These Terms",
      content: [
        "NEXORA may update these Terms & Conditions when necessary to reflect changes in our website, services, or business practices.",
        "Updated terms will be published on this page with a revised last-updated date.",
        "Your continued use of the website after updated terms are published indicates your acceptance of the revised terms, to the extent permitted by applicable law.",
      ],
    },
    {
      icon: FileText,
      title: "13. Governing Law",
      content: [
        "These Terms & Conditions are intended to be interpreted in accordance with applicable laws of Pakistan, subject to any mandatory consumer protections and other legal requirements that apply.",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B1220] text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-[#263449] bg-[#111C2E] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-500/[0.08] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-blue-600/[0.08] blur-3xl" />

        <div className="relative mx-auto max-w-5xl">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-400 shadow-lg shadow-sky-500/10">
            <FileText size={32} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
            Important Information
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Terms & Conditions
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Please read these terms carefully before using NEXORA.
            They explain the rules, responsibilities, and conditions
            that apply when you use our online store.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-[#263449] bg-[#172338] px-4 py-2">
              Last Updated: {lastUpdated}
            </span>

            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 font-semibold text-sky-400">
              Website Terms
            </span>
          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[260px_1fr]">

          {/* SIDEBAR */}

          <aside className="h-fit rounded-2xl border border-[#263449] bg-[#111C2E] p-5 lg:sticky lg:top-24">

            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              On This Page
            </h2>

            <nav className="mt-5 space-y-2">

              {sections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#terms-${index + 1}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-[#172338] hover:text-sky-400"
                >
                  {section.title}
                </a>
              ))}

            </nav>

            <div className="mt-6 border-t border-[#263449] pt-5">

              <p className="text-xs leading-6 text-slate-400">
                Need help understanding these terms?
              </p>

              <Link
                to="/contact"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-sky-400 transition hover:text-sky-300"
              >
                Contact Support
                <Mail size={15} />
              </Link>

            </div>

          </aside>

          {/* MAIN CONTENT */}

          <div className="min-w-0">

            <div className="mb-8 rounded-2xl border border-sky-400/20 bg-sky-400/[0.05] p-6">

              <div className="flex items-start gap-4">

                <FileText
                  size={24}
                  className="mt-1 shrink-0 text-sky-400"
                />

                <div>

                  <h2 className="font-bold text-white">
                    Using NEXORA
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    These terms apply to visitors and customers who
                    access or use the NEXORA website. Please make
                    sure you understand the conditions before placing
                    an order or creating an account.
                  </p>

                </div>

              </div>

            </div>

            <div className="space-y-6">

              {sections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <article
                    key={section.title}
                    id={`terms-${index + 1}`}
                    className="scroll-mt-24 rounded-2xl border border-[#263449] bg-gradient-to-br from-[#172338] to-[#111C2E] p-6 shadow-xl shadow-black/10 sm:p-8"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-400">
                        <Icon size={21} />
                      </div>

                      <h2 className="text-lg font-black text-white sm:text-xl">
                        {section.title}
                      </h2>

                    </div>

                    <div className="mt-6 space-y-4">

                      {section.content.map((paragraph, paragraphIndex) => (
                        <p
                          key={paragraphIndex}
                          className="text-sm leading-7 text-slate-400"
                        >
                          {paragraph}
                        </p>
                      ))}

                      {section.list && (
                        <ul className="space-y-3">
                          {section.list.map((point) => (
                            <li
                              key={point}
                              className="flex items-start gap-3 text-sm leading-6 text-slate-400"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>

            <div className="mt-8 text-center">

              <Link
                to="/privacy-policy"
                className="text-sm font-bold text-sky-400 transition hover:text-sky-300"
              >
                ← Read Privacy Policy
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default TermsAndConditions;
