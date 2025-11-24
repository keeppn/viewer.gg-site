"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? "h-20 bg-white/80 backdrop-blur-xl border-gray-200" 
            : "h-24 bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-8">
          
          {/* Logo - Perfectly Centered Vertically */}
          <Link href="/" className="flex items-center gap-1 group relative z-50">
            <span className="text-2xl font-bold tracking-tighter text-gray-900 leading-none">
              viewer<span className="text-[#7c3aed]">.gg</span>
            </span>
          </Link>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {["Features", "Pricing", "Contact"].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="text-[15px] font-medium text-gray-600 hover:text-[#7c3aed] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Aligned */}
          <div className="hidden md:flex items-center gap-4">
              <Link href="https://app.viewer.gg" target="_blank">
                <Button variant="ghost" className="text-[15px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-10 px-5">
                  Log in
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="h-10 px-6 text-[15px] font-bold bg-[#DAFF7C] text-black hover:bg-[#c5ef5d] rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Get Started
                </Button>
              </Link>
          </div>

          {/* Mobile Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden text-gray-900" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 z-40 bg-white p-6 pt-24 md:hidden border-b border-gray-100"
          >
            <div className="flex flex-col gap-6 text-xl">
              <Link href="/features" className="font-medium text-gray-900" onClick={() => setIsOpen(false)}>
                Features
              </Link>
              <Link href="/pricing" className="font-medium text-gray-900" onClick={() => setIsOpen(false)}>
                Pricing
              </Link>
              <Link href="/contact" className="font-medium text-gray-900" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
              <hr className="border-gray-100" />
              <Link href="https://app.viewer.gg" target="_blank" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-600 text-lg">Log in</Button>
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-12 bg-[#DAFF7C] text-black font-bold hover:bg-[#c5ef5d] text-lg rounded-xl">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
