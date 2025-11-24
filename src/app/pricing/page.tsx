"use client";

import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Community",
    price: "$0",
    description: "Perfect for community cups and small events.",
    features: ["Up to 10 Co-streamers", "Basic Application Form", "Manual Review Queue", "Standard Discord Bot"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For serious TOs who need to save time.",
    features: ["Up to 100 Co-streamers", "Automated Role Assignment", "Live Viewership Dashboard", "Priority Support", "Compliance Alerts"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "White-label solution for major leagues.",
    features: ["Unlimited Co-streamers", "White-label Portal (apply.yoursite.com)", "Custom Analytics Reports", "Dedicated Success Manager", "SLA Support"],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "Does the bot auto-ban streamers?",
    answer: "No. The bot only assigns roles and sends DMs upon approval. You retain full control over moderation.",
  },
  {
    question: "Can I customize the application form?",
    answer: "Yes! Our drag-and-drop builder lets you ask for Discord IDs, Twitch/YouTube links, and custom text questions.",
  },
  {
    question: "What happens if I stop paying?",
    answer: "Your data is safe, but you will lose access to the automated Discord bot and live dashboard. You can downgrade to the Community plan anytime.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-[#DAFF7C] selection:text-black">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
           <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-[#9381FF]/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 mb-6"
          >
            Simple, Transparent <span className="text-[#7c3aed]">Pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-[800px] mx-auto"
          >
            Stop paying with your time. Start paying for automation.
          </motion.p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="pb-24 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-3xl border p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                tier.popular 
                  ? "border-[#DAFF7C] bg-white ring-4 ring-[#DAFF7C]/20 shadow-2xl" 
                  : "border-gray-200 bg-white shadow-lg hover:shadow-xl"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#DAFF7C] text-black text-xs font-bold rounded-full flex items-center gap-1 shadow-lg uppercase tracking-wider">
                  <Zap className="h-3 w-3 fill-black" /> Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                <p className="text-sm text-gray-500 mt-2">{tier.description}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">{tier.price}</span>
                  {tier.period && <span className="text-lg font-medium text-gray-500 ml-1">{tier.period}</span>}
                </div>
              </div>
              
              <ul className="space-y-4 flex-1 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="mr-3 shrink-0 h-5 w-5 rounded-full bg-[#DAFF7C]/30 flex items-center justify-center">
                      <Check className="h-3 w-3 text-black stroke-[3]" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/contact" className="w-full">
                <Button 
                  className={`w-full h-12 font-bold text-base rounded-xl transition-all ${
                    tier.popular 
                      ? "bg-[#DAFF7C] text-black hover:bg-[#c5ef5d] shadow-lg shadow-[#DAFF7C]/20" 
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`} 
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold mb-3 flex items-center text-gray-900">
                  <HelpCircle className="h-5 w-5 text-[#7c3aed] mr-3" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-8 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
