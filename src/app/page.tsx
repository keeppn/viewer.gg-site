"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  Check, 
  Bot, 
  Settings, 
  FileEdit, 
  ThumbsUp, 
  UserPlus, 
  MonitorPlay, 
  BarChart3, 
  FileText,
  ArrowRight,
  AlertCircle
} from "lucide-react";

// --- VISUALS (CSS-ONLY MOCKUPS) ---

const VisualSpreadsheet = () => (
  <div className="relative w-full h-full bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-2xl">
    {/* Mac Header */}
    <div className="h-10 bg-[#F3F4F6] border-b border-gray-200 flex items-center px-4 gap-2 select-none">
      <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
      <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
      <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
      <div className="ml-4 h-4 w-32 bg-gray-200 rounded text-[10px] flex items-center px-2 text-gray-400 font-mono">
        co-streamers-v24.csv
      </div>
    </div>
    
    {/* Spreadsheet Grid */}
    <div className="flex-1 bg-white overflow-hidden relative font-mono text-[10px]">
      {/* Header Row */}
      <div className="flex h-8 border-b border-gray-200 bg-gray-50">
         <div className="w-10 border-r border-gray-200 flex items-center justify-center text-gray-400">#</div>
         <div className="flex-1 border-r border-gray-200 flex items-center px-2 text-gray-500 font-semibold">Twitch Channel</div>
         <div className="w-24 border-r border-gray-200 flex items-center px-2 text-gray-500 font-semibold">Discord ID</div>
         <div className="w-24 border-r border-gray-200 flex items-center px-2 text-gray-500 font-semibold">Status</div>
      </div>

      {/* Rows Container - Animated */}
      <div className="absolute inset-x-0 top-8 bottom-0 overflow-hidden">
         <div className="animate-[scrollUp_20s_linear_infinite]">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`flex h-8 border-b border-gray-100 ${i === 4 || i === 12 ? "bg-red-50" : "bg-white"}`}>
                 <div className="w-10 border-r border-gray-100 flex items-center justify-center text-gray-400">{i + 1}</div>
                 <div className="flex-1 border-r border-gray-100 flex items-center px-2 text-gray-700 truncate">
                    {i % 3 === 0 ? "twitch.tv/user_" + i : i % 3 === 1 ? "youtube.com/c/gamer" + i : "kick.com/stream" + i}
                 </div>
                 <div className="w-24 border-r border-gray-100 flex items-center px-2 text-gray-500 truncate">
                    {i === 4 ? "MISSING" : "User#" + (4000 + i)}
                 </div>
                 <div className="w-24 border-r border-gray-100 flex items-center px-2">
                    {i === 4 || i === 12 ? (
                       <span className="text-red-600 font-bold bg-red-100 px-1 rounded">ERROR</span>
                    ) : (
                       <span className="text-yellow-600 bg-yellow-50 px-1 rounded">PENDING</span>
                    )}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>

    {/* Error Toast Overlay */}
    <div className="absolute bottom-6 right-6 bg-white border border-red-100 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.3)] rounded-lg p-4 flex items-start gap-3 max-w-[240px] animate-in slide-in-from-bottom-10 duration-700">
       <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
       <div>
          <h4 className="text-xs font-bold text-gray-900 mb-1">Data Mismatch Error</h4>
          <p className="text-[10px] text-gray-500 leading-tight">
             Row 42: Discord ID format invalid. Cannot assign role manually.
          </p>
       </div>
    </div>
  </div>
);

const VisualBotConfig = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 p-8 flex flex-col justify-center items-center relative overflow-hidden shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-br from-[#DAFF7C]/20 to-transparent" />
    <div className="flex items-center gap-6 z-10">
      <div className="w-16 h-16 rounded-full bg-[#5865F2] flex items-center justify-center text-white shadow-lg">
        <Bot className="w-8 h-8" />
      </div>
      <div className="h-[3px] w-24 bg-gray-200 rounded-full relative overflow-hidden">
         <div className="absolute inset-0 bg-[#DAFF7C] animate-[shimmer_2s_infinite]" />
      </div>
      <div className="w-16 h-16 rounded-full bg-white border-2 border-[#DAFF7C] flex items-center justify-center text-[#DAFF7C] shadow-lg">
        <Check className="w-8 h-8" />
      </div>
    </div>
    <div className="mt-6 px-4 py-1.5 rounded-full bg-[#DAFF7C] text-black text-sm font-bold shadow-sm">
      Bot Connected
    </div>
  </div>
);

// Re-using other visual components from previous logic, just ensuring imports work
const VisualFormBuilder = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 relative overflow-hidden shadow-xl">
     <div className="h-10 w-full bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center px-4 text-sm text-gray-400">
       Drag fields here...
     </div>
     <div className="space-y-3">
        <div className="h-12 w-3/4 bg-white rounded-lg border border-gray-200 flex items-center px-4 gap-3 shadow-sm">
            <div className="w-5 h-5 rounded bg-[#9381FF]/20" />
            <div className="h-2.5 w-24 bg-gray-100 rounded" />
        </div>
        <div className="h-12 w-full bg-white rounded-lg border border-gray-200 flex items-center px-4 gap-3 shadow-sm">
            <div className="w-5 h-5 rounded bg-[#DAFF7C]" />
            <div className="h-2.5 w-32 bg-gray-100 rounded" />
        </div>
     </div>
     <div className="absolute bottom-6 right-6">
        <div className="w-10 h-10 rounded-full bg-[#DAFF7C] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
           <span className="text-black font-bold text-lg">+</span>
        </div>
     </div>
  </div>
);

const VisualApprove = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center relative shadow-xl">
     <div className="w-56 bg-white rounded-xl border border-gray-100 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
        <div className="flex items-center gap-4 mb-4">
           <div className="w-10 h-10 rounded-full bg-gray-100" />
           <div className="space-y-1.5">
              <div className="h-2.5 w-20 bg-gray-200 rounded" />
              <div className="h-2 w-12 bg-gray-100 rounded" />
           </div>
        </div>
        <div className="flex gap-3 mt-2">
           <div className="flex-1 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
              <span className="text-sm">✕</span>
           </div>
           <div className="flex-1 h-10 rounded-lg bg-[#DAFF7C] border border-[#DAFF7C] flex items-center justify-center text-black shadow-md hover:bg-[#c5ef5d] transition-colors">
              <span className="text-sm font-bold">✓</span>
           </div>
        </div>
     </div>
  </div>
);

const VisualAutoRole = () => (
  <div className="w-full h-full bg-[#121212] rounded-xl border border-white/10 flex items-center justify-center p-6 relative overflow-hidden">
     <div className="w-full max-w-[220px] bg-[#2B2D31] rounded p-3 shadow-lg border border-black/20">
        <div className="flex items-center gap-2 mb-2">
           <div className="w-6 h-6 rounded-full bg-[#5865F2] flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
           </div>
           <span className="text-[10px] text-white font-bold">viewer.gg Bot</span>
           <span className="text-[8px] text-gray-400">Today at 4:20 PM</span>
        </div>
        <div className="text-[10px] text-gray-300 leading-relaxed">
           <span className="text-[#DAFF7C]">@StreamerName</span> has been granted the <span className="bg-[#9381FF]/20 text-[#9381FF] px-1 rounded">Co-streamer</span> role.
        </div>
     </div>
  </div>
);

const VisualMonitoring = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 p-6 grid grid-cols-2 gap-4 relative shadow-xl">
     {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-900 rounded-lg border border-gray-200 relative overflow-hidden group">
           <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 rounded text-[10px] font-bold text-white shadow-sm">LIVE</div>
           {i === 2 && (
              <div className="absolute inset-0 border-4 border-red-500 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                 <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-1 rounded-full shadow-lg">WRONG TITLE</span>
              </div>
           )}
        </div>
     ))}
  </div>
);

const VisualAnalytics = () => (
  <div className="w-full h-full bg-[#121212] rounded-xl border border-white/10 p-6 flex items-end gap-2 relative">
     {[30, 50, 40, 70, 55, 80, 60].map((h, i) => (
        <div key={i} className="flex-1 bg-[#9381FF]/20 rounded-t border-t border-x border-[#9381FF]/30 relative group" style={{ height: h + "%" }}>
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {h}k
           </div>
           <div className="absolute inset-0 bg-[#9381FF] opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
     ))}
  </div>
);

const VisualReports = () => (
  <div className="w-full h-full bg-[#121212] rounded-xl border border-white/10 flex items-center justify-center relative">
     <div className="w-32 h-40 bg-white rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center gap-2 relative rotate-3 hover:rotate-0 transition-transform duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#DAFF7C]" />
        <FileText className="w-8 h-8 text-gray-400" />
        <div className="h-1 w-16 bg-gray-200 rounded" />
        <div className="h-1 w-12 bg-gray-200 rounded" />
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-[#DAFF7C] rounded-full flex items-center justify-center text-black shadow-lg">
           <ArrowRight className="w-3 h-3" />
        </div>
     </div>
  </div>
);

const BenefitCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="p-8 rounded-3xl bg-white border border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl space-y-4">
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <div className="text-gray-500 space-y-2 leading-relaxed">
      {children}
    </div>
  </div>
);

// --- MAIN PAGE ---

const steps = [
  {
    id: "01",
    title: "Easy Configure Discord Bot",
    description: "Link your Discord server in seconds. Select which roles to assign and which channels to notify.",
    visual: <VisualBotConfig />,
    icon: <Settings className="w-6 h-6" />
  },
  {
    id: "02",
    title: "Create Custom Application Forms",
    description: "Build branded forms asking for Twitch links, region, or language. No coding required.",
    visual: <VisualFormBuilder />,
    icon: <FileEdit className="w-6 h-6" />
  },
  {
    id: "03",
    title: "Approve or Reject Applications",
    description: "Review all applicants in a centralized dashboard. Filter by followers, region, or trust score.",
    visual: <VisualApprove />,
    icon: <ThumbsUp className="w-6 h-6" />
  },
  {
    id: "04",
    title: "Assign Roles Automatically",
    description: "The moment you click approve, our bot updates their Discord role and sends a welcome DM.",
    visual: <VisualAutoRole />,
    icon: <UserPlus className="w-6 h-6" />
  },
  {
    id: "05",
    title: "Easily Monitor Live Events",
    description: "See exactly who is live. Our system flags streamers using the wrong game title or category.",
    visual: <VisualMonitoring />,
    icon: <MonitorPlay className="w-6 h-6" />
  },
  {
    id: "06",
    title: "Detailed Analytics",
    description: "Track aggregated concurrent viewership (CCV), hours watched, and peak traffic across all streams.",
    visual: <VisualAnalytics />,
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: "07",
    title: "Custom Sponsor Ready Reports",
    description: "Generate white-labeled PDF reports to prove ROI to your sponsors instantly after the event.",
    visual: <VisualReports />,
    icon: <FileText className="w-6 h-6" />
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-[#DAFF7C] selection:text-black">
      
      {/* --- HERO --- */}
      <section className="relative min-h-[95vh] flex flex-col justify-center pt-24 overflow-hidden">
        {/* Soft Gradient Backgrounds */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[900px] h-[900px] bg-[#9381FF]/5 rounded-full blur-[120px]" />
           <div className="absolute bottom-[10%] right-[-5%] w-[700px] h-[700px] bg-[#DAFF7C]/15 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 text-center max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* H1: Strictly 2 lines */}
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-900 mb-8 leading-[1.05] max-w-[1100px] mx-auto">
              One platform for <br className="hidden md:block" />
              tournament co-streaming
            </h1>
            
            {/* Description: Strictly 2 lines on desktop */}
            <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Viewer.gg centralizes co-streamer applications, approvals, and coordination for your tournaments. Track performance in real time, dive into detailed analytics, and export sponsor-ready reports in just a few clicks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/contact">
                <Button size="lg" className="h-14 px-10 text-lg bg-[#DAFF7C] text-black hover:bg-[#c5ef5d] font-bold rounded-full shadow-xl shadow-[#DAFF7C]/20 hover:shadow-[#DAFF7C]/30 hover:-translate-y-1 transition-all">
                  Get Started
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black rounded-full transition-all">
                  Explore Features <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-300 animate-bounce"
        >
          <ArrowRight className="w-6 h-6 rotate-90" />
        </motion.div>
      </section>

      {/* --- PROBLEM SECTION --- */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                The "Spreadsheet Method" <br />
                <span className="text-red-500">is the bottleneck.</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed">
                Manually copying 500 Twitch links into Google Sheets, cross-referencing Discord IDs, 
                and DMing stream keys one-by-one isn't management. It's chaos.
              </p>
              
              <div className="pt-8 border-t border-gray-100">
                <p className="text-gray-900 font-bold mb-4">The viewer.gg difference:</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 text-gray-600 text-lg">
                    <div className="w-8 h-8 rounded-full bg-[#DAFF7C]/30 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    Centralized Application Queue
                  </li>
                  <li className="flex items-center gap-4 text-gray-600 text-lg">
                    <div className="w-8 h-8 rounded-full bg-[#DAFF7C]/30 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    Automated Permissions & Onboarding
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Visual */}
            <div className="relative h-[500px] w-full">
               <div className="absolute inset-0 bg-gradient-to-tr from-red-50 to-white rounded-[3rem] transform rotate-2" />
               <div className="relative h-full w-full transform -rotate-2 hover:rotate-0 transition-all duration-700">
                  <VisualSpreadsheet />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SCROLLYTELLING WORKFLOW --- */}
      <section className="py-32 bg-gray-50/50 border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-32">
             <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Automated Workflow</h2>
             <p className="text-xl text-slate-500">You make the decisions. We handle the execution.</p>
          </div>

          <div className="space-y-40 relative">
             {/* Connecting Line */}
             <div className="absolute left-1/2 top-20 bottom-20 w-[2px] bg-gray-200 hidden md:block" />

             {steps.map((step, index) => (
               <motion.div 
                 key={step.id}
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 0.7 }}
                 className={`flex flex-col md:flex-row gap-16 items-center relative ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
               >
                 {/* Text */}
                 <div className={`flex-1 space-y-6 ${index % 2 === 1 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-[#7c3aed] shadow-lg border border-gray-100 mb-2 ${index % 2 === 1 ? "ml-auto" : ""}`}>
                       {step.icon}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                      <span className="text-[#7c3aed] text-xl block mb-2 font-mono">STEP {step.id}</span>
                      {step.title}
                    </h3>
                    <p className="text-xl text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                 </div>

                 {/* Visual */}
                 <div className="flex-1 w-full aspect-[4/3] relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br from-[#9381FF]/5 to-[#DAFF7C]/5 rounded-[2rem] transform ${index % 2 === 0 ? "rotate-2" : "-rotate-2"} group-hover:rotate-0 transition-transform duration-500`} />
                    <div className="relative h-full w-full bg-white rounded-[2rem] border border-gray-200 shadow-2xl overflow-hidden">
                       {step.visual}
                    </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tighter">
            Ready to Launch?
          </h2>
          <p className="text-xl text-slate-500 mb-12">
             Join the platform that powers the world's biggest tournament co-streaming programs.
          </p>
          <Link href="/contact">
            <Button className="h-16 px-12 text-xl bg-[#DAFF7C] text-black hover:bg-[#c5ef5d] rounded-full font-bold shadow-xl shadow-[#DAFF7C]/20 hover:shadow-2xl hover:scale-105 transition-all">
              Start Now
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
