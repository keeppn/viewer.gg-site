import Link from "next/link";
import { Twitter, Disc, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] text-white py-20 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4 mb-16">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-1">
              viewer<span className="text-[#DAFF7C]">.gg</span>
            </Link>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              The complete operating system for tournament co-streaming management. Automate your workflow and prove your value.
            </p>
            <div className="flex gap-4 pt-2">
               <Link href="https://twitter.com/viewergg" className="text-gray-400 hover:text-[#DAFF7C] transition-colors">
                 <Twitter className="h-5 w-5" />
               </Link>
               <Link href="https://discord.gg/viewergg" className="text-gray-400 hover:text-[#5865F2] transition-colors">
                 <Disc className="h-5 w-5" />
               </Link>
               <Link href="https://github.com/keeppn/viewer.gg" className="text-gray-400 hover:text-white transition-colors">
                 <Github className="h-5 w-5" />
               </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-6 text-sm uppercase tracking-wider text-[#9381FF]">Product</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-6 text-sm uppercase tracking-wider text-[#9381FF]">Legal</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} viewer.gg. All rights reserved.</p>
          <p>Designed for Tournament Organizers.</p>
        </div>
      </div>
    </footer>
  );
}
