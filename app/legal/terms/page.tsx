"use client"

import * as React from "react"

export default function TermsPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16 border-b border-stone-200 dark:border-white/10 pb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 text-[#1a1a1a] dark:text-white">
            Terms of Service
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-[#AB462F]">
            Last Updated: November 15, 2022
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-base text-stone-600 dark:text-stone-300 leading-relaxed font-light">
          
          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">1. Introduction and Acceptance</h2>
            <p>
              Welcome to <strong>MIA Beauty</strong> ("we," "us," or "our"). These Terms of Service ("Terms") govern your use of our website located at <strong>www.miabeauty.com</strong> (the "Site") and the purchase of our products.
            </p>
            <p className="mt-4">
              By accessing or using our Site, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must discontinue use of the Site immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">2. Modifications to Terms</h2>
            <p>
              We reserve the right to modify or update these Terms at any time without prior notice. Changes will be effective immediately upon posting to the Site. Your continued use of the Site after any changes indicates your acceptance of the new Terms. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">3. Account Access and Security</h2>
            <p className="mb-4">
              You may be required to create an account to access certain features of the Site. Regarding your account, you agree that:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 marker:text-[#AB462F]">
                <li>You are responsible for maintaining the confidentiality of your login credentials (username and password).</li>
                <li>You accept full responsibility for all activities that occur under your account.</li>
                <li>You will notify us immediately of any unauthorized use of your account.</li>
                <li>We reserve the right to terminate accounts, refuse service, or cancel orders at our sole discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">4. Intellectual Property Rights</h2>
            <p>
              All content on this Site—including text, graphics, logos, images, software, and product designs—is the exclusive property of <strong>MIA Beauty Inc.</strong> or its content suppliers and is protected by Philippine and international copyright, trademark, and intellectual property laws.
            </p>
            <div className="mt-4 p-6 bg-[#FAF9F6] dark:bg-white/5 rounded-md border-l-4 border-[#AB462F]">
                <strong className="block text-foreground uppercase text-xs tracking-widest mb-2">Limited License</strong>
                You are granted a limited, non-exclusive license to access and use the Site for personal, non-commercial purposes. You may not reproduce, duplicate, copy, sell, or exploit any portion of the Site without our express written consent.
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">5. Prohibited Conduct</h2>
            <p>By using this Site, you agree not to:</p>
            <ul className="list-disc pl-5 mt-4 space-y-2 marker:text-[#AB462F]">
                <li>Violate any local, national, or international laws or regulations.</li>
                <li>Engage in fraudulent activities or impersonate any person or entity.</li>
                <li>Interfere with the Site’s security features or attempt to gain unauthorized access to our servers.</li>
                <li>Transmit any viruses, malware, or harmful code.</li>
                <li>Post content that is defamatory, obscene, hateful, or infringing on the rights of others.</li>
                <li>Use any data mining, robots, or similar data gathering tools on the Site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">6. User-Generated Content</h2>
            <p>
              If you post reviews, comments, or other content ("User Content") on our Site or social media channels, you grant <strong>MIA Beauty Inc.</strong> a non-exclusive, royalty-free, perpetual, and irrevocable right to use, reproduce, modify, adapt, publish, and display such content throughout the world in any media.
            </p>
            <p className="mt-4">
              You represent that you own the rights to the content you post and that it does not violate the rights of any third party. We reserve the right to remove any User Content at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">7. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites. These links are provided for your convenience only. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites. Accessing these links is done at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">8. Disclaimer of Warranties</h2>
            <div className="border border-stone-200 dark:border-stone-800 p-6 rounded-lg bg-stone-50 dark:bg-white/5 text-sm">
                <p>
                  The Site and all products and services delivered to you are provided 'as is' and 'as available' for your use, without any representation, warranties, or conditions of any kind, either express or implied.
                </p>
                <p className="mt-4">
                  To the fullest extent permissible by law, we disclaim all warranties, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee that the Site will be uninterrupted, secure, or error-free.
                </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">9. Limitation of Liability</h2>
            <p>
              In no case shall <strong>MIA Beauty Inc.</strong>, our directors, officers, employees, affiliates, agents, contractors, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation, lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of the Site or any products procured using the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless <strong>MIA Beauty Inc.</strong> and our affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns, and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third party due to or arising out of your breach of these Terms or the documents they incorporate by reference, or your violation of any law or the rights of a third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">11. Governing Law and Jurisdiction</h2>
            <p>
              These Terms and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the Republic of the Philippines.
            </p>
            <p className="mt-4">
              Any disputes arising out of or regarding these Terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Metro Manila, Philippines</strong>.
            </p>
          </section>

          <section className="bg-[#FAF9F6] dark:bg-white/5 p-8 text-center border border-stone-200 dark:border-stone-800">
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-[#1a1a1a] dark:text-white">12. Contact Information</h2>
            <p className="mb-6">
              Questions about the Terms of Service should be sent to us at:
            </p>
            <div className="space-y-1 text-sm font-medium">
                <p>MIA Beauty Inc.</p>
                <p>Unit 123, Beauty Building, Makati City, Philippines</p>
                <p>Email: <a href="mailto:support@miabeauty.com" className="text-[#AB462F] hover:underline">support@miabeauty.com</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}