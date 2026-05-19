"use client";

import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <main className="relative min-h-screen">

      {/* Background Animation */}
        
           <div className="relative z-10 pointer-events-none">
         <div className="pointer-events-auto">
      {/* Content */}
      <div className="relative z-10">

        <div className="grow container mx-auto px-4 py-8">

          {/* HERO */}
          <section id="hero" className="text-center py-20 animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-bold text-dental-dark mb-6">
              Revolutionize Your{" "}
              <span className="text-dental">Dental Health</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              AI-powered dental analysis and virtual consultations with certified professionals.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/analysis"
                className="bg-foreground text-white font-bold py-3 px-6 rounded-full transition transform hover:scale-105 hover:shadow-lg"
              >
                Scan My Teeth
              </Link>

              <a
                href="#doctors"
                className="bg-white text-dental-dark border border-dental-dark font-bold py-3 px-6 rounded-full transition transform hover:scale-105 hover:shadow-lg"
              >
                Find a Dentist
              </a>
            </div>
          </section>
        </div>

        {/* WHY SECTION */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">
              Why DentalAI?
            </h2>

            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-14">
              Smart AI tools built for dentists, clinics, and patients to improve accuracy,
              speed, and diagnostic confidence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* CARD */}
              <div className="p-6 bg-white/70 backdrop-blur-lg border border-white/40 rounded-xl shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="w-12 h-12 bg-dental/10 text-dental flex items-center justify-center rounded-lg mb-4">
                  🔍
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Scans</h3>
                <p className="text-slate-600 text-sm">
                  Detect caries, calculus, bone loss, lesions, and more using advanced neural models.
                </p>
              </div>

              <div className="p-6 bg-white/70 backdrop-blur-lg border border-white/40 rounded-xl shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="w-12 h-12 bg-dental/10 text-dental flex items-center justify-center rounded-lg mb-4">
                  📄
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Reports</h3>
                <p className="text-slate-600 text-sm">
                  Export clean diagnostic reports for clinic workflows & patient education.
                </p>
              </div>

              <div className="p-6 bg-white/70 backdrop-blur-lg border border-white/40 rounded-xl shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="w-12 h-12 bg-dental/10 text-dental flex items-center justify-center rounded-lg mb-4">
                  ⚡
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast & Reliable</h3>
                <p className="text-slate-600 text-sm">
                  Runs smoothly on any device — optimized for speed, accuracy, and simplicity.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">
              Security & Compliance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="p-6 bg-white/70 backdrop-blur-lg border border-white/40 rounded-xl shadow-xl">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-lg font-semibold">Secure Uploads</h3>
                <p className="text-slate-600 text-sm">
                  All images are processed securely using encrypted data flows.
                </p>
              </div>

              <div className="p-6 bg-white/70 backdrop-blur-lg border border-white/40 rounded-xl shadow-xl">
                <div className="text-3xl mb-3">🧑‍⚕</div>
                <h3 className="text-lg font-semibold">Clinical Standards</h3>
                <p className="text-slate-600 text-sm">
                  Designed with dentists to ensure accuracy and reliability.
                </p>
              </div>

              <div className="p-6 bg-white/70 backdrop-blur-lg border border-white/40 rounded-xl shadow-xl">
                <div className="text-3xl mb-3">📁</div>
                <h3 className="text-lg font-semibold">Secure Storage</h3>
                <p className="text-slate-600 text-sm">
                  Data is never shared without permission.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center bg-gradient-to-r from-dental to-dental-dark text-slate-600rounded-t-3xl mt-10">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Dental Practice?
          </h2>

          <p className="mb-8">
            Try AI-powered diagnosis for free. No credit card required.
          </p>

          <Link
            href="/analysis"
            className="px-8 py-4 bg-white text-dental font-semibold rounded-lg shadow hover:opacity-90 transition"
          >
            Start Free Scan →
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="backdrop-blur-sm border-t mt-12">
          <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0eb4d8] to-[#0a8bb0] flex items-center justify-center text-white font-bold">
                  D
                </div>
                <div>
                  <div className="font-semibold">DentalAI</div>
                  <div className="text-xs text-slate-500">
                    Smart dental image analysis
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Product</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><Link href="/analysis">Analysis</Link></li>
                  <li><Link href="/features">Features</Link></li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Contact</h4>
              <div className="text-sm text-slate-600">
                support@dentalai.example
              </div>
            </div>
           
          </div>
        </footer>
        </div>
      </div>
      </div>
    </main>
  );
};

export default Page;