
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Database,
  ShoppingBag,
  Lock,
  Mail,
  Cookie,
  RefreshCw,
} from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "November 14, 2026";

  const sections = [
    {
      icon: User,
      title: "1. Information We Collect",
      content: [
        {
          heading: "Personal Information",
          text: "When you create an account or interact with NEXORA, we may collect information such as your name, email address, phone number, and delivery address.",
        },
        {
          heading: "Account Information",
          text: "We process account and authentication information to help you register, sign in, manage your profile, and access your account securely.",
        },
        {
          heading: "Order Information",
          text: "When you place an order, we may collect order details, purchased products, quantities, delivery information, and order history.",
        },
        {
          heading: "Communication Information",
          text: "If you contact us through our contact form or other communication channels, we may collect the information you provide in your message.",
        },
      ],
    },
    {
      icon: Database,
      title: "2. How We Use Your Information",
      content: [
        {
          text: "We may use collected information to:",
          list: [
            "Create and manage customer accounts.",
            "Process and manage product orders.",
            "Provide order updates and customer support.",
            "Manage shopping carts and checkout activities.",
            "Display and manage product reviews.",
            "Improve website functionality and user experience.",
            "Protect our website against unauthorized activities.",
            "Respond to questions and customer inquiries.",
          ],
        },
      ],
    },
    {
      icon: ShoppingBag,
      title: "3. Orders and Transactions",
      content: [
        {
          text: "When you place an order through NEXORA, relevant information is used to process and manage your purchase, including product details, order totals, and delivery information.",
        },
        {
          text: "If third-party payment services are integrated into our website, payment transactions may be processed according to the privacy policies and terms of those providers.",
        },
        {
          text: "NEXORA does not claim to store complete payment card details unless such processing is explicitly implemented and disclosed.",
        },
      ],
    },
    {
      icon: Lock,
      title: "4. Data Protection and Security",
      content: [
        {
          text: "We take reasonable technical and organizational measures to help protect personal information from unauthorized access, alteration, disclosure, or misuse.",
        },
        {
          text: "However, no website, online service, or electronic storage system can guarantee absolute security. Users should also protect their account credentials and avoid sharing passwords.",
        },
      ],
    },
    {
      icon: Cookie,
      title: "5. Cookies and Website Technologies",
      content: [
        {
          text: "Our website or its hosting and service providers may use cookies, browser storage, or similar technologies to support website functionality, authentication, shopping cart features, and user preferences.",
        },
        {
          text: "You can manage cookies through your browser settings. Disabling certain technologies may affect some website features.",
        },
      ],
    },
    {
      icon: User,
      title: "6. Sharing of Information",
      content: [
        {
          text: "We do not sell personal information to third parties. Information may be shared only when reasonably necessary to:",
          list: [
            "Operate and maintain our website.",
            "Process orders and arrange deliveries.",
            "Provide hosting, infrastructure, or technical services.",
            "Comply with applicable legal requirements.",
            "Protect the rights, security, and property of NEXORA and its users.",
          ],
        },
        {
          text: "Third-party service providers may process information under their own privacy policies and applicable obligations.",
        },
      ],
    },
    {
      icon: RefreshCw,
      title: "7. Data Retention",
      content: [
        {
          text: "We retain personal information only for as long as reasonably necessary for the purposes described in this policy, including account management, order records, customer support, security, and legal obligations.",
        },
        {
          text: "Retention periods may vary depending on the type of information and applicable requirements.",
        },
      ],
    },
    {
      icon: ShieldCheck,
      title: "8. Your Privacy Choices",
      content: [
        {
          text: "Depending on applicable law, you may have the right to request access to, correction of, or deletion of certain personal information.",
        },
        {
          text: "You may also contact us if you have questions about how your information is used. Some information may need to be retained where required for legitimate business or legal purposes.",
        },
      ],
    },
    {
      icon: User,
      title: "9. Children's Privacy",
      content: [
        {
          text: "NEXORA is not intended to knowingly collect personal information from children without appropriate authorization. If you believe a child has provided personal information without appropriate consent, please contact us.",
        },
      ],
    },
    {
      icon: RefreshCw,
      title: "10. Changes to This Privacy Policy",
      content: [
        {
          text: "We may update this Privacy Policy from time to time to reflect changes in our website, services, or applicable requirements.",
        },
        {
          text: "Any updated version will be published on this page with a revised last-updated date.",
        },
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
            <ShieldCheck size={32} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
            Your Privacy Matters
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Your trust matters to us. Learn how NEXORA collects,
            uses, protects, and manages your personal information
            when you use our website and services.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-[#263449] bg-[#172338] px-4 py-2">
              Last Updated: {lastUpdated}
            </span>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 font-semibold text-emerald-400">
              Privacy & Security
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
                  href={`#privacy-${index + 1}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-[#172338] hover:text-sky-400"
                >
                  {section.title}
                </a>
              ))}

            </nav>

            <div className="mt-6 border-t border-[#263449] pt-5">

              <p className="text-xs leading-6 text-slate-400">
                Have questions about your privacy?
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

                <ShieldCheck
                  size={24}
                  className="mt-1 shrink-0 text-sky-400"
                />

                <div>

                  <h2 className="font-bold text-white">
                    Our Privacy Commitment
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    This policy explains the general ways NEXORA
                    handles information. By using our website,
                    you acknowledge that you have read this policy.
                    Please review it carefully.
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
                    id={`privacy-${index + 1}`}
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

                    <div className="mt-6 space-y-5">

                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex}>

                          {item.heading && (
                            <h3 className="mb-2 text-sm font-bold text-slate-200">
                              {item.heading}
                            </h3>
                          )}

                          {item.text && (
                            <p className="text-sm leading-7 text-slate-400">
                              {item.text}
                            </p>
                          )}

                          {item.list && (
                            <ul className="mt-3 space-y-3">
                              {item.list.map((point) => (
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
                      ))}

                    </div>

                  </article>
                );
              })}

            </div>

            <div className="mt-8 text-center">

              <Link
                to="/terms-and-conditions"
                className="text-sm font-bold text-sky-400 transition hover:text-sky-300"
              >
                Read Terms & Conditions →
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default PrivacyPolicy;
