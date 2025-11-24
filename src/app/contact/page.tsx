"use client";

import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-[#DAFF7C] selection:text-black">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
           <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#DAFF7C]/10 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 mb-6"
          >
            Get in <span className="text-[#7c3aed]">Touch</span>
          </motion.h1>
          <p className="text-xl text-gray-500 max-w-[800px] mx-auto">
            Have questions about the platform or need a custom enterprise plan?
          </p>
        </div>
      </section>

      <section className="pb-24 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-gray-900">Contact Channels</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-6 p-8 rounded-3xl border border-gray-200 bg-white hover:border-[#7c3aed]/30 hover:shadow-lg transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
                  <Mail className="h-7 w-7 text-[#7c3aed]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-base text-gray-500 mb-3 leading-relaxed">For enterprise inquiries, partnerships, and general support questions.</p>
                  <a href="mailto:hello@viewer.gg" className="text-[#7c3aed] hover:text-[#6025c0] font-bold text-lg flex items-center gap-2 group">
                    hello@viewer.gg 
                    <span className="transform group-hover:translate-x-1 transition-transform">?</span>
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-6 p-8 rounded-3xl border border-gray-200 bg-white hover:border-[#5865F2]/30 hover:shadow-lg transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-[#5865F2]/10 flex items-center justify-center shrink-0">
                   {/* Discord Color Hex */}
                  <MessageSquare className="h-7 w-7 text-[#5865F2]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Join our Discord</h3>
                  <p className="text-base text-gray-500 mb-3 leading-relaxed">Get real-time help from our community and direct access to developers.</p>
                  <Link href="https://discord.gg/viewergg" className="text-[#5865F2] hover:text-[#404eed] font-bold text-lg flex items-center gap-2 group">
                    discord.gg/viewergg
                    <span className="transform group-hover:translate-x-1 transition-transform">?</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-gray-200 bg-white p-10 shadow-2xl shadow-gray-100"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-semibold text-gray-700 ml-1">First Name</label>
                  <input id="first-name" className="flex h-14 w-full rounded-xl border border-gray-200 bg-gray-50 px-5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-semibold text-gray-700 ml-1">Last Name</label>
                  <input id="last-name" className="flex h-14 w-full rounded-xl border border-gray-200 bg-gray-50 px-5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Work Email</label>
                <input id="email" type="email" className="flex h-14 w-full rounded-xl border border-gray-200 bg-gray-50 px-5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all" placeholder="jane@company.com" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-gray-700 ml-1">How can we help?</label>
                <textarea id="message" className="flex min-h-[160px] w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all resize-none" placeholder="Tell us about your tournament needs..." />
              </div>
              
              <Button type="submit" className="w-full h-14 bg-[#7c3aed] hover:bg-[#6025c0] text-white font-bold text-lg rounded-xl shadow-lg shadow-[#7c3aed]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Send Message <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
