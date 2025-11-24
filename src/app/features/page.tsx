"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Monitor, Bot, BarChart2, FileText, Zap, Users, Settings, Trophy, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

// --- VISUALS ---
// Reusing the CSS-only visuals or creating simplified variants for the features page

const VisualCard = ({ icon, color = "#DAFF7C" }: { icon: any, color?: string }) => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center relative overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
     <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full opacity-50" />
     
     <div className="relative z-10 w-24 h-24 rounded-2xl bg-white border border-gray-100 shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
        <div className="text-[#0a0a0a] w-10 h-10" style={{ color }}>
           {icon}
        </div>
     </div>
     
     {/* Decor */}
     <div className="absolute bottom-4 left-4 w-full h-1 bg-gray-100 rounded overflow-hidden w-1/3">
        <div className="h-full bg-[#DAFF7C] w-2/3 animate-[shimmer_2s_infinite]" />
     </div>
  </div>
);

const features = [
  {
    id: "forms",
    title: "Custom Application Forms",
    description: "Create branded application portals without writing code. Drag and drop fields to collect exactly what you need: Twitch Link, Region, Language, Discord ID.",
    icon: <FileText className="w-full h-full" />,
    color: "#DAFF7C",
    benefits: ["Twitch/YouTube API Validation", "Prevent Duplicate Applications", "Custom Branding"],
  },
  {
    id: "queue",
    title: "Centralized Review Queue",
    description: "Say goodbye to spreadsheets. Review all applicants in a unified dashboard. Sort by follower count, language, or region.",
    icon: <Users className="w-full h-full" />,
    color: "#9381FF",
    benefits: ["Sort & Filter Candidates", "Bulk Actions", "One-click Approve/Reject"],
  },
  {
    id: "automation",
    title: "Discord Automation",
    description: "The moment you click 'Approve', our bot goes to work. It automatically assigns the correct role in your server and sends a DM with the stream key.",
    icon: <Bot className="w-full h-full" />,
    color: "#FF9350",
    benefits: ["Instant Role Assignment", "Automated DMs with Assets", "Zero Manual Work"],
  },
  {
    id: "monitoring",
    title: "Live Command Center",
    description: "See exactly who is live during your tournament. Our dashboard tracks real-time viewership and flags streams with incorrect titles or categories.",
    icon: <Monitor className="w-full h-full" />,
    color: "#DAFF7C",
    benefits: ["Real-time Viewership Matrix", "Compliance Alerts (Wrong Game)", "Multi-platform Support"],
  },
  {
    id: "analytics",
    title: "Sponsor-Ready Reports",
    description: "Prove your ROI. Generate comprehensive PDF reports showing total hours watched, peak CCV, and language breakdown across all co-streamers.",
    icon: <BarChart2 className="w-full h-full" />,
    color: "#9381FF",
    benefits: ["Aggregated Reach Stats", "Language & Region Breakdown", "Export to PDF/CSV"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-[#DAFF7C] selection:text-black">
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#DAFF7C]/10 rounded-full blur-[120px]" />
         </div>
         
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 mb-6">
              The Full <span className="text-[#7c3aed]">Feature Suite</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Everything you need to scale your co-streaming program from 10 to 10,000 creators without adding headcount.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features List */}
      <div className="container mx-auto px-4 md:px-6 py-12 space-y-32 max-w-7xl">
        {features.map((feature, index) => (
          <motion.div 
            key={feature.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className={`flex flex-col md:flex-row gap-16 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
          >
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8" style={{ color: feature.color }}>
                   {feature.icon}
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">{feature.title}</h2>
              <p className="text-xl text-gray-500 leading-relaxed">{feature.description}</p>
              
              <ul className="space-y-4 pt-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-700 font-medium">
                    <div className="h-6 w-6 rounded-full bg-[#DAFF7C] flex items-center justify-center text-black shadow-sm">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1 w-full h-[400px]">
               <VisualCard icon={feature.icon} color={feature.color} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <section className="py-32 border-t border-gray-100 mt-20 bg-gray-50/50">
         <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
           <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tighter">Stop working in spreadsheets</h2>
           <p className="text-xl text-gray-500 mb-10">Start your first professional co-streaming campaign today.</p>
           <Link href="/contact">
             <Button size="lg" className="h-16 px-12 text-xl bg-[#DAFF7C] text-black hover:bg-[#c5ef5d] rounded-full font-bold shadow-xl shadow-[#DAFF7C]/20 transition-transform hover:scale-105">
               Get Started Now
             </Button>
           </Link>
         </div>
      </section>
    </div>
  );
}
