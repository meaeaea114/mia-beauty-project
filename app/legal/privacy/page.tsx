"use client"

import * as React from "react"

export default function PrivacyPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16 border-b border-stone-200 dark:border-white/10 pb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 text-[#1a1a1a] dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-[#AB462F]">
            Last Updated: November 15, 2022
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-base text-stone-600 dark:text-stone-300 leading-relaxed font-light">
          
          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">1. Introduction</h2>
            <p>
              At <strong>MIA Beauty Inc.</strong> ("we," "us," or "our"), we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, maintain, and disclose information when you access or use our website, <strong>www.miabeauty.com</strong> (the "Site"), or interact with us via email, mobile applications, or other electronic means.
            </p>
            <p className="mt-4">
              By using our Site, you consent to the data practices described in this policy. If you do not agree with these terms, please discontinue use of the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">2. Information We Collect</h2>
            <p className="mb-4">
              We collect information to provide better services to our users. This falls into two categories:
            </p>
            
            <div className="pl-6 border-l-2 border-[#AB462F]/30 space-y-6">
                <div>
                    <h3 className="font-bold text-[#AB462F] uppercase text-xs tracking-widest mb-2">A. Information You Provide to Us</h3>
                    <p>We collect information that you voluntarily provide when you:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-[#AB462F]">
                        <li>Register for an account.</li>
                        <li>Purchase products or services (including billing and shipping details).</li>
                        <li>Subscribe to our newsletters.</li>
                        <li>Participate in surveys, contests, or promotions.</li>
                        <li>Contact our customer support team.</li>
                    </ul>
                    <p className="mt-2 text-sm italic">This generally includes your name, email address, phone number, postal address, and payment information.</p>
                </div>

                <div>
                    <h3 className="font-bold text-[#AB462F] uppercase text-xs tracking-widest mb-2">B. Information Collected Automatically</h3>
                    <p>
                        When you navigate our Site, we may use automatic data collection technologies to gather information about your equipment and browsing actions. This includes:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-[#AB462F]">
                        <li><strong>Device Information:</strong> IP address, browser type, operating system, and internet service provider.</li>
                        <li><strong>Usage Data:</strong> Pages visited, time spent on the site, referring URLs, and clickstream data.</li>
                        <li><strong>Cookies:</strong> Small text files stored on your device that help us improve site functionality and remember your preferences.</li>
                    </ul>
                </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">3. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies, web beacons, and similar technologies to analyze trends, administer the website, and track users' movements around the Site.
            </p>
            <ul className="list-none mt-4 space-y-4">
                <li>
                    <strong className="text-foreground">Browser Cookies:</strong> You can control the use of cookies at the individual browser level. If you reject cookies, you may still use our Site, but your ability to use some features may be limited.
                </li>
                <li>
                    <strong className="text-foreground">Third-Party Analytics:</strong> We may use third-party services (such as Google Analytics) that use cookies to help us analyze how users use the Site.
                </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">4. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-[#FAF9F6] dark:bg-white/5 p-4 rounded-md">
                    <span className="block font-bold text-xs uppercase tracking-wider mb-1 text-[#AB462F]">Service Delivery</span>
                    To process transactions, fulfill orders, and manage your account.
                </div>
                <div className="bg-[#FAF9F6] dark:bg-white/5 p-4 rounded-md">
                    <span className="block font-bold text-xs uppercase tracking-wider mb-1 text-[#AB462F]">Communication</span>
                    To send you order confirmations, updates, security alerts, and support messages.
                </div>
                <div className="bg-[#FAF9F6] dark:bg-white/5 p-4 rounded-md">
                    <span className="block font-bold text-xs uppercase tracking-wider mb-1 text-[#AB462F]">Marketing</span>
                    To inform you about new products, special offers, or events (only with your consent, which you can withdraw at any time).
                </div>
                <div className="bg-[#FAF9F6] dark:bg-white/5 p-4 rounded-md">
                    <span className="block font-bold text-xs uppercase tracking-wider mb-1 text-[#AB462F]">Improvement & Compliance</span>
                    To understand user behavior, improve functionality, and comply with legal processes.
                </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">5. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal identification information to others. We may share information in the following situations:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 marker:text-[#AB462F]">
                <li><strong>Service Providers:</strong> We share data with trusted third parties who assist us in operating our website, conducting our business, or serving you (e.g., payment processors, shipping companies), provided those parties agree to keep this information confidential.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</li>
                <li><strong>Business Transfers:</strong> If MIA Beauty Inc. is involved in a merger, acquisition, or sale of all or a portion of its assets, your personal information may be transferred as part of that transaction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. We use Secure Socket Layer (SSL) technology to encrypt sensitive information (such as credit card numbers) during transmission.
            </p>
            <p className="mt-4 bg-red-50 dark:bg-red-900/10 p-4 border-l-2 border-red-400 text-sm">
              However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">7. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of these other sites. We encourage you to read the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">8. Protecting Children</h2>
            <p>
              Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that a child under 16 has provided us with personal information, we will take steps to delete such information from our files immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">9. Your Rights and Choices</h2>
            <p>Depending on your location, you may have specific rights regarding your personal data, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-[#AB462F]">
                <li><strong>Access:</strong> The right to request copies of your personal data.</li>
                <li><strong>Correction:</strong> The right to request that we correct any information you believe is inaccurate.</li>
                <li><strong>Deletion:</strong> The right to request that we erase your personal data under certain conditions.</li>
                <li><strong>Opt-Out:</strong> You may unsubscribe from our marketing emails at any time by following the "unsubscribe" link at the bottom of the email or by contacting us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">10. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated "Last Modified" date. We encourage you to review this policy periodically to stay informed about how we are protecting your information.
            </p>
          </section>

          <section className="bg-[#FAF9F6] dark:bg-white/5 p-8 text-center border border-stone-200 dark:border-stone-800">
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">11. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="space-y-1 text-sm font-medium">
                <p>MIA Beauty Inc.</p>
                <p>Manila, Philippines</p>
                <p>Email: <a href="mailto:support@miabeauty.com" className="text-[#AB462F] hover:underline">support@miabeauty.com</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}