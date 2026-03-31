"use client";

import { useRef, useEffect, useState, useCallback, FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { generateBroksVisionPPTX } from "./export-pptx";

gsap.registerPlugin(ScrollTrigger);

// ─── BRAND TOKENS ───
const B = {
  orange: "#EF8316",
  orangeLight: "#FF9F43",
  gray: "#44454A",
  blue: "#2841D1",
  blueLight: "#4A63E8",
  black: "#0A0A0F",
  blackAlt: "#111118",
  white: "#FAFAFA",
  cream: "#FDF9F0",
};

// ─── DEMO CREDENTIALS ───
const VALID_CREDENTIALS = [
  { user: "client", pass: "broksvision2026" },
  { user: "admin", pass: "admin" },
  { user: "demo", pass: "demo" },
];

// ═══════════════════════════════════════════
// ─── INTERACTIVE CANVAS BACKGROUND ───
// Neural network / constellation mesh that follows the mouse
// ═══════════════════════════════════════════
function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Particle system
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 150;
    const MOUSE_RADIUS = 200;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      baseX: number; baseY: number;
      size: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];
    const colors = [B.orange, B.blue, B.orangeLight, B.blueLight, "rgba(255,255,255,0.6)"];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x, y, baseX: x, baseY: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 1.5 + Math.random() * 2.5,
        color: colors[i % colors.length],
        alpha: 0.3 + Math.random() * 0.5,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update and draw particles
      particles.forEach((p) => {
        // Drift movement
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse attraction/repulsion
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.x -= dx * force * 0.02;
          p.y -= dy * force * 0.02;
        }

        // Draw particle with glow
        ctx!.save();
        ctx!.globalAlpha = p.alpha;
        ctx!.shadowBlur = 15;
        ctx!.shadowColor = p.color;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;

            // Connections near mouse are brighter and orange
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const mouseDist = Math.sqrt((mx - midX) ** 2 + (my - midY) ** 2);
            const mouseInfluence = Math.max(0, 1 - mouseDist / (MOUSE_RADIUS * 1.5));

            ctx!.save();
            ctx!.globalAlpha = alpha + mouseInfluence * 0.2;
            ctx!.strokeStyle = mouseInfluence > 0.3 ? B.orange : "rgba(255,255,255,0.5)";
            ctx!.lineWidth = 0.5 + mouseInfluence;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
            ctx!.restore();
          }
        }
      }

      // Draw mouse glow
      if (mx > 0 && my > 0) {
        const gradient = ctx!.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS);
        gradient.addColorStop(0, `${B.orange}15`);
        gradient.addColorStop(0.5, `${B.blue}08`);
        gradient.addColorStop(1, "transparent");
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, width, height);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        zIndex: 1,
      }}
    />
  );
}

// ═══════════════════════════════════════════
// ─── IMMERSIVE LOGIN SCREEN ───
// ═══════════════════════════════════════════
function LoginScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const letters = titleRef.current.querySelectorAll(".login-letter");
        gsap.fromTo(
          letters,
          { opacity: 0, y: 50, rotateX: -90, scale: 0.5 },
          {
            opacity: 1, y: 0, rotateX: 0, scale: 1,
            stagger: 0.06, duration: 1,
            ease: "elastic.out(1, 0.5)", delay: 0.5,
          }
        );

        // Subtitle
        gsap.fromTo(
          titleRef.current.querySelector(".login-sub"),
          { opacity: 0, y: 20, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out", delay: 1.2 }
        );

        // Accent line grow
        gsap.fromTo(
          titleRef.current.querySelector(".login-line"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power3.inOut", delay: 1.0 }
        );
      }

      if (formContainerRef.current) {
        gsap.fromTo(
          formContainerRef.current,
          { opacity: 0, y: 60, scale: 0.9, filter: "blur(20px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out", delay: 1.0 }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const valid = VALID_CREDENTIALS.some(
      (c) => c.user.toLowerCase() === username.toLowerCase() && c.pass === password
    );

    if (!valid) {
      setError("Invalid credentials");
      if (formRef.current) {
        gsap.fromTo(formRef.current, { x: -12 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      }
      return;
    }

    setIsExiting(true);

    const tl = gsap.timeline({ onComplete: () => onAuthenticated() });

    // Success flash
    if (formRef.current) {
      tl.to(formRef.current, {
        borderColor: "#22c55e",
        boxShadow: "0 0 80px rgba(34,197,94,0.4), inset 0 0 40px rgba(34,197,94,0.1)",
        duration: 0.4,
      });
    }

    // Screen exits with a dramatic reveal
    if (screenRef.current) {
      tl.to(screenRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1.2,
        ease: "power3.inOut",
      }, "+=0.2");
    }
  };

  return (
    <div
      ref={screenRef}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: B.black,
        display: "flex", alignItems: "center", justifyContent: "center",
        clipPath: "circle(150% at 50% 50%)",
        willChange: "clip-path",
      }}
    >
      {/* Interactive canvas background */}
      <InteractiveBackground />

      {/* Aurora gradient blobs */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: "60vw", height: "60vw", maxWidth: "600px", maxHeight: "600px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${B.orange}20, transparent 70%)`,
          filter: "blur(60px)",
          animation: "auroraFloat1 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", right: "-10%",
          width: "50vw", height: "50vw", maxWidth: "500px", maxHeight: "500px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${B.blue}18, transparent 70%)`,
          filter: "blur(60px)",
          animation: "auroraFloat2 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "20%",
          width: "30vw", height: "30vw", maxWidth: "300px", maxHeight: "300px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${B.orangeLight}12, transparent 70%)`,
          filter: "blur(40px)",
          animation: "auroraFloat3 6s ease-in-out infinite",
        }} />
      </div>

      {/* Noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "460px", padding: "0 24px" }}>
        {/* Title */}
        <div ref={titleRef} style={{ textAlign: "center", marginBottom: "48px", perspective: "800px" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "4px" }}>
            {"BROKS".split("").map((l, i) => (
              <span key={`a${i}`} className="login-letter" style={{
                display: "inline-block", fontSize: "clamp(40px, 7vw, 60px)",
                fontWeight: 900, letterSpacing: "-0.03em", color: B.white, opacity: 0,
                textShadow: `0 0 40px ${B.orange}40`,
              }}>{l}</span>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "2px" }}>
            {"VISION".split("").map((l, i) => (
              <span key={`b${i}`} className="login-letter" style={{
                display: "inline-block", fontSize: "clamp(40px, 7vw, 60px)",
                fontWeight: 900, letterSpacing: "-0.03em",
                color: l === "O" ? B.orange : B.white, opacity: 0,
                textShadow: l === "O" ? `0 0 60px ${B.orange}80` : `0 0 40px ${B.orange}40`,
              }}>{l}</span>
            ))}
          </div>
          <div className="login-line" style={{
            width: "80px", height: "3px", margin: "20px auto 0",
            background: `linear-gradient(90deg, ${B.orange}, ${B.blue})`,
            borderRadius: "2px", transformOrigin: "center", transform: "scaleX(0)",
          }} />
          <div className="login-sub" style={{
            marginTop: "16px", fontSize: "13px", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.3)", opacity: 0,
          }}>
            Client Presentation Portal
          </div>
        </div>

        {/* Glassmorphic form */}
        <div ref={formContainerRef} style={{ opacity: 0 }}>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${error ? "#ef4444" : isExiting ? "#22c55e" : focusedField ? `${B.orange}40` : "rgba(255,255,255,0.08)"}`,
              borderRadius: "24px",
              padding: "40px 36px",
              backdropFilter: "blur(24px)",
              boxShadow: `0 20px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
              transition: "border-color 0.4s, box-shadow 0.4s",
            }}
          >
            {/* Username */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: focusedField === "user" ? B.orange : "rgba(255,255,255,0.3)",
                marginBottom: "10px", transition: "color 0.3s",
              }}>Username</label>
              <div style={{
                position: "relative",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "14px",
                border: `1px solid ${focusedField === "user" ? `${B.orange}50` : "rgba(255,255,255,0.06)"}`,
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxShadow: focusedField === "user" ? `0 0 30px ${B.orange}10, inset 0 0 20px ${B.orange}05` : "none",
              }}>
                <input
                  type="text" value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  onFocus={() => setFocusedField("user")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="username"
                  placeholder="Enter username"
                  style={{
                    width: "100%", padding: "16px 18px",
                    background: "transparent", border: "none", borderRadius: "14px",
                    color: B.white, fontSize: "15px", fontFamily: "inherit", outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: focusedField === "pass" ? B.orange : "rgba(255,255,255,0.3)",
                marginBottom: "10px", transition: "color 0.3s",
              }}>Password</label>
              <div style={{
                position: "relative",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "14px",
                border: `1px solid ${focusedField === "pass" ? `${B.orange}50` : "rgba(255,255,255,0.06)"}`,
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxShadow: focusedField === "pass" ? `0 0 30px ${B.orange}10, inset 0 0 20px ${B.orange}05` : "none",
              }}>
                <input
                  type="password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onFocus={() => setFocusedField("pass")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  style={{
                    width: "100%", padding: "16px 18px",
                    background: "transparent", border: "none", borderRadius: "14px",
                    color: B.white, fontSize: "15px", fontFamily: "inherit", outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                fontSize: "13px", color: "#ef4444", marginBottom: "16px",
                textAlign: "center", fontWeight: 500,
                animation: "fadeInUp 0.3s ease-out",
              }}>{error}</div>
            )}

            {/* Submit button with gradient border */}
            <button
              type="submit" disabled={isExiting}
              style={{
                width: "100%", padding: "18px",
                background: `linear-gradient(135deg, ${B.orange}, ${B.orangeLight})`,
                border: "none", borderRadius: "14px",
                color: B.black, fontSize: "15px", fontWeight: 700,
                fontFamily: "inherit",
                cursor: isExiting ? "wait" : "pointer",
                boxShadow: `0 8px 32px ${B.orange}40`,
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!isExiting) {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${B.orange}50`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = `0 8px 32px ${B.orange}40`;
              }}
            >
              <span style={{ position: "relative", zIndex: 2 }}>
                {isExiting ? "Entering..." : "Enter Presentation →"}
              </span>
            </button>
          </form>

          {/* Bottom text */}
          <div style={{
            textAlign: "center", marginTop: "28px",
            fontSize: "11px", color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.05em",
          }}>
            Contact your account manager for access credentials
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes auroraFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5vw, 3vh) scale(1.1); }
          66% { transform: translate(-3vw, -2vh) scale(0.95); }
        }
        @keyframes auroraFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-4vw, -3vh) scale(1.05); }
          66% { transform: translate(3vw, 4vh) scale(1.1); }
        }
        @keyframes auroraFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(2vw, -2vh) scale(1.15) rotate(10deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── MAIN PAGE ───
// ═══════════════════════════════════════════

export default function BroksVisionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroScaleRef = useRef<HTMLDivElement>(null);
  const heroTopRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  const introRef = useRef<HTMLElement>(null);
  const introWordsRef = useRef<HTMLDivElement>(null);
  const introStatsRef = useRef<HTMLDivElement>(null);

  const circleRef = useRef<HTMLElement>(null);
  const circleRingRef = useRef<SVGCircleElement>(null);
  const circleTextRef = useRef<HTMLDivElement>(null);
  const circleCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const chapterStickyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterNumRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterHeadRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterDescRefs = useRef<(HTMLDivElement | null)[]>([]);

  const ctaRef = useRef<HTMLElement>(null);
  const ctaContentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const handleExportPPTX = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    setExportDone(false);
    try {
      await generateBroksVisionPPTX();
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    } catch (err) { console.error("PPTX export failed:", err); }
    finally { setExporting(false); }
  }, [exporting]);

  // ─── LENIS ───
  useEffect(() => {
    if (!authenticated) return;
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // @ts-expect-error - Lenis types
      direction: "vertical", smooth: true,
    });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    setMounted(true);
    return () => { lenis.destroy(); gsap.ticker.remove((time) => lenis.raf(time * 1000)); };
  }, [authenticated]);

  // ─── GSAP ANIMATIONS ───
  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();

      // ═══ HERO ═══
      if (heroRef.current && heroScaleRef.current && heroTopRef.current && heroBgRef.current) {
        const heroTl = gsap.timeline({
          scrollTrigger: { trigger: heroRef.current, start: "33% top", end: "bottom top", scrub: true },
        });
        heroTl.addLabel("start")
          .to(heroTopRef.current, { opacity: 0, y: -80, ease: "none", duration: 0.5 }, "start")
          .to(heroScaleRef.current, { scale: 0.3, ease: "power2.inOut", duration: 1 }, "start+=0.1")
          .to(heroBgRef.current, { opacity: 0, duration: 0.001 }, "start+=0.8");
      }

      // ═══ INTRO ═══
      if (introRef.current && introWordsRef.current) {
        const words = introWordsRef.current.querySelectorAll(".intro-word");
        const placeholders = introWordsRef.current.querySelectorAll(".intro-placeholder");
        const spans = introWordsRef.current.querySelectorAll(".intro-span");
        const introTl = gsap.timeline({
          scrollTrigger: { trigger: introRef.current, start: "top 60%", end: "top -20%", scrub: true },
        });
        introTl.addLabel("placeholder")
          .fromTo(words, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.03 }, "placeholder")
          .addLabel("reveal", "+=0.3")
          .to(placeholders, { autoAlpha: 0, stagger: 0.03 }, "reveal")
          .fromTo(spans, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.03 }, "reveal");
        if (introStatsRef.current) {
          gsap.fromTo(introStatsRef.current.querySelectorAll(".stat-item"),
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
              scrollTrigger: { trigger: introStatsRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
        }
      }

      // ═══ 360° CIRCLE — DRAMATIC VERSION ═══
      if (circleRef.current && circleRingRef.current && circleTextRef.current) {
        const circumference = 2 * Math.PI * 140;
        gsap.set(circleRingRef.current, { strokeDasharray: circumference, strokeDashoffset: circumference });

        const circleTl = gsap.timeline({
          scrollTrigger: { trigger: circleRef.current, start: "top top", end: "bottom top", scrub: 0.3 },
        });

        // Ring fills (0–35%)
        circleTl.to(circleRingRef.current, { strokeDashoffset: 0, ease: "none", duration: 0.35 }, 0);

        // Center text scales in (15–35%)
        circleTl.fromTo(circleTextRef.current,
          { opacity: 0, scale: 0.3 },
          { opacity: 1, scale: 1, ease: "back.out(1.7)", duration: 0.2 }, 0.15);

        // Service cards fly in from outside, land at their positions (35–65%)
        circleCardsRef.current.forEach((card, i) => {
          if (!card) return;
          const directions = [
            { x: 0, y: -120 },   // top: comes from above
            { x: 120, y: 0 },    // right: comes from right
            { x: 0, y: 120 },    // bottom: comes from below
            { x: -120, y: 0 },   // left: comes from left
          ];
          const dir = directions[i];
          circleTl.fromTo(card,
            { opacity: 0, x: dir.x, y: dir.y, scale: 0.3, rotation: (i % 2 === 0 ? -15 : 15) },
            { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: 0.12, ease: "back.out(1.5)" },
            0.35 + i * 0.08);
        });

        // Hold everything visible (65–75%)
        // ... just timeline duration gap

        // Exit: everything scales down and fades (75–100%)
        circleTl.to(circleRef.current.querySelector(".circle-content"), {
          opacity: 0, scale: 0.8, duration: 0.25, ease: "power2.in",
        }, 0.75);
      }

      // ═══ CHAPTERS ═══
      chapterRefs.current.forEach((chapter, i) => {
        if (!chapter) return;
        const sticky = chapterStickyRefs.current[i];
        const content = chapterContentRefs.current[i];
        const num = chapterNumRefs.current[i];
        const head = chapterHeadRefs.current[i];
        const desc = chapterDescRefs.current[i];
        if (!sticky || !content) return;

        gsap.timeline({
          scrollTrigger: { trigger: chapter, start: "top bottom", end: "top top", scrub: true },
        }).fromTo(sticky, { clipPath: "inset(8% round 40px)" }, { clipPath: "inset(0% round 0px)", ease: "none" });

        const contentTl = gsap.timeline({
          scrollTrigger: { trigger: chapter, start: "top 50%", end: "top -10%", scrub: true },
        });
        contentTl
          .fromTo(num, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" })
          .fromTo(head ? head.querySelectorAll(".ch-word") : [], { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 }, "-=0.1")
          .fromTo(desc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");

        gsap.to(content, { opacity: 0, y: -40, ease: "none",
          scrollTrigger: { trigger: chapter, start: "60% top", end: "bottom top", scrub: true } });
        gsap.to(sticky, { y: "-20lvh", ease: "none",
          scrollTrigger: { trigger: chapter, start: "bottom bottom", end: "bottom top", scrub: true } });
      });

      // ═══ CTA ═══
      if (ctaRef.current && ctaContentRef.current) {
        gsap.fromTo(ctaContentRef.current.querySelectorAll(".cta-word"),
          { opacity: 0, y: 60, rotateX: -15 },
          { opacity: 1, y: 0, rotateX: 0, stagger: 0.08, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: ctaRef.current, start: "top 60%", toggleActions: "play none none reverse" } });
        const ctaSub = ctaContentRef.current.querySelector(".cta-sub");
        const ctaBtn = ctaContentRef.current.querySelector(".cta-btn");
        if (ctaSub) gsap.fromTo(ctaSub, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5,
          scrollTrigger: { trigger: ctaRef.current, start: "top 50%", toggleActions: "play none none reverse" } });
        if (ctaBtn) gsap.fromTo(ctaBtn, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.7,
          scrollTrigger: { trigger: ctaRef.current, start: "top 50%", toggleActions: "play none none reverse" } });
      }

      // ═══ FOOTER ═══
      if (footerRef.current) {
        gsap.fromTo(footerRef.current.querySelectorAll(".footer-card"),
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: footerRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [mounted]);

  const chapters = [
    { num: "01", label: "Creative", title: "Ideas That Ignite",
      desc: "From bold campaign concepts to scroll-stopping visuals — we craft creative that doesn't just get seen, it gets remembered. Every asset is designed to amplify your brand's voice across every touchpoint.",
      bg: B.orange, accent: B.black },
    { num: "02", label: "PR & Communications", title: "Stories That Spread",
      desc: "Strategic media relations, crisis management, and narrative building that positions your brand where it matters. We turn company milestones into industry headlines and brand values into public trust.",
      bg: B.blue, accent: B.white },
    { num: "03", label: "Digital", title: "Performance Engineered",
      desc: "Data-driven campaigns across search, social, and programmatic channels. Every impression tracked, every conversion optimized, every dollar working harder than the last.",
      bg: B.black, accent: B.orange },
    { num: "04", label: "BTL & Activations", title: "Experiences That Move",
      desc: "Below-the-line activations that create genuine human connections. Experiential events, guerrilla campaigns, and on-ground executions that transform audiences into brand advocates.",
      bg: B.gray, accent: B.cream },
  ];

  const introText = "Your brand is more than a logo. It's every touchpoint, every interaction, every impression. We engineer the full 360 — so nothing falls through the cracks.";
  const introWords = introText.split(" ");

  // 360° service cards — positioned diagonally for visual interest
  const serviceCards = [
    { text: "Creative", icon: "✦", desc: "Campaign & Visual Design", pos: { top: "2%", left: "50%", transform: "translateX(-50%)" } },
    { text: "PR", icon: "◎", desc: "Media & Communications", pos: { top: "50%", right: "2%", transform: "translateY(-50%)" } },
    { text: "Digital", icon: "⬡", desc: "Performance Marketing", pos: { bottom: "2%", left: "50%", transform: "translateX(-50%)" } },
    { text: "BTL", icon: "◈", desc: "Events & Activations", pos: { top: "50%", left: "2%", transform: "translateY(-50%)" } },
  ];

  if (!authenticated) {
    return <LoginScreen onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <div ref={containerRef} className="relative -mt-20"
      style={{ background: B.black, color: B.white, fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <style>{`
        nav, .navbar, header > nav { display: none !important; }
        footer:not(.bv-footer) { display: none !important; }
        main { padding-top: 0 !important; }
        :root { --ease-out: cubic-bezier(0.22,1,0.36,1); --ease-in-out: cubic-bezier(0.84,0,0.16,1); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${B.black}; }
        ::-webkit-scrollbar-thumb { background: ${B.gray}; border-radius: 3px; }
        .intro-placeholder { background: rgba(255,255,255,0.08); border-radius: 100px; position: absolute; inset: 10% 0; pointer-events: none; }
        .ch-word { display: inline-block; will-change: transform, opacity; }
        .bv-btn { position: relative; overflow: hidden; transition: border-radius 0.4s var(--ease-out), transform 0.3s var(--ease-out); }
        .bv-btn:hover { border-radius: 12px !important; transform: scale(1.02); }
        .bv-btn::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,0.1); opacity:0; transition:opacity 0.3s; }
        .bv-btn:hover::after { opacity: 1; }
        .footer-card { transition: transform 0.5s var(--ease-out), border-color 0.3s; }
        .footer-card:hover { transform: translateY(-4px); }
        ::selection { background: ${B.orange}; color: ${B.black}; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.2)} }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes scrollPulse { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} style={{ height: "300svh", position: "relative", width: "100%" }}>
        <div ref={heroBgRef} style={{ background: B.black, position: "absolute", inset: 0, willChange: "opacity", zIndex: 1 }} />
        <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "-15%", right: "-10%", width: "700px", height: "700px", borderRadius: "50%", background: `radial-gradient(circle, ${B.orange}30, transparent 70%)`, filter: "blur(80px)" }} />
            <div style={{ position: "absolute", bottom: "-15%", left: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${B.blue}25, transparent 70%)`, filter: "blur(60px)" }} />
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)`, backgroundSize: "80px 80px" }} />
          </div>
          <div ref={heroScaleRef} style={{ willChange: "transform", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", height: "100%", position: "relative" }}>
            <div ref={heroTopRef} style={{ position: "relative", zIndex: 10 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", borderRadius: "100px", border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", backdropFilter: "blur(10px)", marginBottom: "48px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.orange, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}>360 Marketing Services</span>
              </div>
              <h1 style={{ fontSize: "clamp(60px,12vw,160px)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .85, margin: 0 }}>
                BROKS<br/><span>VISI</span><span style={{ color: B.orange }}>O</span><span>N</span>
              </h1>
              <div style={{ width: "60%", height: "3px", margin: "24px auto 0", background: `linear-gradient(90deg,${B.orange},${B.blue})`, borderRadius: "2px" }} />
              <p style={{ fontSize: "clamp(16px,1.8vw,22px)", color: "rgba(255,255,255,.45)", maxWidth: "480px", margin: "32px auto 0", lineHeight: 1.5 }}>
                We build brands that resonate, campaigns that convert, and experiences people remember.
              </p>
              <div style={{ marginTop: "48px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="#services" className="bv-btn" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "16px 36px", borderRadius: "100px", background: B.orange, color: B.black, fontWeight: 700, fontSize: "15px", textDecoration: "none" }}>
                  Explore Our Work <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                <a href="mailto:hello@broksvision.com" className="bv-btn" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "16px 36px", borderRadius: "100px", background: "transparent", color: "rgba(255,255,255,.6)", fontWeight: 500, fontSize: "15px", textDecoration: "none", border: "1px solid rgba(255,255,255,.1)" }}>
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: .4, pointerEvents: "none" }}>
          <span style={{ fontSize: "10px", letterSpacing: ".3em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: "1px", height: "32px", background: `linear-gradient(to bottom,${B.orange},transparent)`, animation: "scrollPulse 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ═══ INTRO ═══ */}
      <section ref={introRef} style={{ minHeight: "100svh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "160px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
          <div ref={introWordsRef} style={{ fontSize: "clamp(28px,5vw,56px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.15, display: "flex", flexWrap: "wrap", gap: "0 .3em" }}>
            {introWords.map((word, i) => (
              <span key={i} className="intro-word" style={{ position: "relative", display: "inline-block", opacity: 0 }}>
                <span className="intro-placeholder" />
                <span className="intro-span" style={{ position: "relative", opacity: 0, display: "inline-block" }}>{word}</span>
              </span>
            ))}
          </div>
          <div ref={introStatsRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "32px", marginTop: "80px", paddingTop: "48px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
            {[{ num: "150+", label: "Projects" }, { num: "50+", label: "Brand Partners" }, { num: "12", label: "Years" }, { num: "98%", label: "Retention" }].map((s) => (
              <div key={s.label} className="stat-item" style={{ textAlign: "center", opacity: 0 }}>
                <div style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-.03em", color: B.orange }}>{s.num}</div>
                <div style={{ fontSize: "12px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginTop: "8px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 360° CIRCLE — DRAMATIC with large service cards ═══ */}
      <section ref={circleRef} style={{ height: "350svh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100svh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle,${B.orange}12,transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />

          <div className="circle-content" style={{ position: "relative", width: "min(85vw,600px)", height: "min(85vw,600px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* SVG Ring */}
            <svg viewBox="0 0 300 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1.5" />
              <circle ref={circleRingRef} cx="150" cy="150" r="140" fill="none" stroke={B.orange} strokeWidth="3" strokeLinecap="round" style={{ willChange: "stroke-dashoffset" }} />
            </svg>

            {/* Center text */}
            <div ref={circleTextRef} style={{ position: "absolute", textAlign: "center", zIndex: 3, opacity: 0 }}>
              <div style={{ fontSize: "clamp(60px,10vw,110px)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .85, color: B.white, textShadow: `0 0 60px ${B.orange}30` }}>360°</div>
              <div style={{ fontSize: "clamp(12px,1.4vw,16px)", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginTop: "12px" }}>Marketing Services</div>
            </div>

            {/* Service cards — large, visually distinct, positioned outside the ring */}
            {serviceCards.map((card, i) => (
              <div
                key={card.text}
                ref={(el) => { circleCardsRef.current[i] = el; }}
                style={{
                  position: "absolute", ...card.pos, opacity: 0, zIndex: 5,
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: "20px", padding: "20px 28px",
                  backdropFilter: "blur(12px)",
                  minWidth: "160px", textAlign: "center",
                  boxShadow: `0 8px 32px rgba(0,0,0,.3)`,
                  transition: "border-color .3s, box-shadow .3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${B.orange}50`;
                  e.currentTarget.style.boxShadow = `0 8px 40px ${B.orange}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,.3)";
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px", filter: `drop-shadow(0 0 8px ${B.orange}60)` }}>{card.icon}</div>
                <div style={{ fontSize: "16px", fontWeight: 800, letterSpacing: ".05em", color: B.orange, marginBottom: "4px" }}>{card.text}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,.4)", letterSpacing: ".03em" }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CHAPTERS ═══ */}
      <div id="services">
        {chapters.map((ch, i) => (
          <section key={ch.num} ref={(el) => { chapterRefs.current[i] = el; }} style={{ height: "200svh", position: "relative" }}>
            <div ref={(el) => { chapterStickyRefs.current[i] = el; }} style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: ch.bg, willChange: "clip-path,transform", clipPath: "inset(8% round 40px)" }}>
              <div style={{ position: "absolute", inset: 0, opacity: .03, backgroundImage: `radial-gradient(circle at 50% 50%,${ch.accent}40 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
              <div ref={(el) => { chapterContentRefs.current[i] = el; }} style={{ position: "relative", zIndex: 2, padding: "0 clamp(24px,8vw,128px)", maxWidth: "1000px", width: "100%" }}>
                <div ref={(el) => { chapterNumRefs.current[i] = el; }} style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "8px 20px", borderRadius: "100px", background: `${ch.accent}15`, border: `1px solid ${ch.accent}25`, marginBottom: "32px", opacity: 0 }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: ch.accent, color: ch.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900 }}>{ch.num}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: ch.accent }}>{ch.label}</span>
                </div>
                <div ref={(el) => { chapterHeadRefs.current[i] = el; }} style={{ fontSize: "clamp(40px,8vw,100px)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .9, color: ch.accent, marginBottom: "24px" }}>
                  {ch.title.split(" ").map((w, wi) => (<span key={wi} className="ch-word" style={{ opacity: 0, marginRight: ".25em" }}>{w}</span>))}
                </div>
                <p ref={(el) => { chapterDescRefs.current[i] = el; }} style={{ fontSize: "clamp(16px,1.5vw,20px)", lineHeight: 1.6, color: `${ch.accent}99`, maxWidth: "600px", opacity: 0 }}>{ch.desc}</p>
              </div>
              <div style={{ position: "absolute", right: "5%", bottom: "-5%", fontSize: "clamp(200px,30vw,400px)", fontWeight: 900, lineHeight: 1, color: `${ch.accent}06`, letterSpacing: "-.05em", pointerEvents: "none", userSelect: "none" }}>{ch.num}</div>
            </div>
          </section>
        ))}
      </div>

      {/* ═══ CTA ═══ */}
      <section ref={ctaRef} style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "120px 24px" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "800px", borderRadius: "50%", background: `radial-gradient(circle,${B.orange}10,transparent 60%)`, filter: "blur(100px)", pointerEvents: "none" }} />
        <div ref={ctaContentRef} style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "900px" }}>
          <div className="cta-word" style={{ fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: B.orange, fontWeight: 600, marginBottom: "24px", opacity: 0 }}>Let&apos;s Create Together</div>
          <div style={{ fontSize: "clamp(44px,8vw,100px)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .9, marginBottom: "32px" }}>
            {"Ready to Build Something Great?".split(" ").map((w, i) => (<span key={i} className="cta-word" style={{ display: "inline-block", marginRight: ".25em", opacity: 0 }}>{w}</span>))}
          </div>
          <p className="cta-sub" style={{ fontSize: "clamp(16px,1.5vw,20px)", color: "rgba(255,255,255,.4)", maxWidth: "500px", margin: "0 auto 48px", lineHeight: 1.6, opacity: 0 }}>
            Whether you need a full rebrand or a targeted campaign, we&apos;re ready to make it happen.
          </p>
          <a href="mailto:hello@broksvision.com" className="bv-btn cta-btn" style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "20px 48px", borderRadius: "100px", background: `linear-gradient(135deg,${B.orange},${B.orangeLight})`, color: B.black, fontWeight: 700, fontSize: "17px", textDecoration: "none", boxShadow: `0 0 60px ${B.orange}30`, opacity: 0 }}>
            Get in Touch <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer ref={footerRef} className="bv-footer" style={{ background: B.cream, color: B.black, padding: "clamp(40px,6vw,80px)", overflow: "hidden" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div className="footer-card" style={{ background: B.orange, borderRadius: "clamp(24px,4vw,56px)", padding: "clamp(32px,4vw,56px)", aspectRatio: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", border: `1.5px solid ${B.black}`, overflow: "hidden", position: "relative" }}>
              <div style={{ fontSize: "clamp(32px,5vw,72px)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .9, color: B.black }}>BR<span style={{ opacity: .6 }}>O</span>KS<br/>VISI<span style={{ opacity: .6 }}>O</span>N</div>
              <div style={{ fontSize: "clamp(12px,1.2vw,16px)", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: B.black, opacity: .6 }}>360° Marketing</div>
              <div style={{ position: "absolute", bottom: "-20%", right: "-20%", width: "60%", height: "60%", borderRadius: "50%", border: `3px solid ${B.black}15` }} />
            </div>
            <div className="footer-card" style={{ background: B.blue, borderRadius: "clamp(24px,4vw,56px)", padding: "clamp(32px,4vw,56px)", display: "flex", flexDirection: "column", justifyContent: "space-between", border: `1.5px solid ${B.black}` }}>
              <div>
                <div style={{ fontSize: "clamp(24px,3.5vw,48px)", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1, color: B.cream, marginBottom: "16px" }}>Let&apos;s start<br/>your project</div>
                <p style={{ fontSize: "clamp(13px,1.2vw,16px)", color: "rgba(253,249,240,.6)", lineHeight: 1.5, maxWidth: "300px" }}>Ready to transform your brand? Reach out and let&apos;s build something extraordinary.</p>
              </div>
              <a href="mailto:hello@broksvision.com" className="bv-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px 32px", borderRadius: "100px", background: B.cream, color: B.black, fontWeight: 700, fontSize: "14px", textDecoration: "none", border: `1px solid ${B.black}`, width: "fit-content", marginTop: "24px" }}>
                Contact Us <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
            <div className="footer-card" style={{ background: `${B.blue}15`, borderRadius: "clamp(24px,4vw,48px)", padding: "clamp(24px,3vw,40px) clamp(32px,4vw,56px)", border: `1.5px solid ${B.black}10`, display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
              {["Creative","PR","Digital","BTL","Branding","Strategy"].map((link) => (
                <span key={link} style={{ fontSize: "clamp(16px,2vw,24px)", fontWeight: 900, letterSpacing: "-.02em", color: B.black, opacity: .7, cursor: "pointer", transition: "opacity .3s" }}
                  onMouseEnter={(e)=>(e.currentTarget.style.opacity="1")} onMouseLeave={(e)=>(e.currentTarget.style.opacity="0.7")}>{link}</span>
              ))}
            </div>
            <div className="footer-card" style={{ background: B.black, borderRadius: "clamp(24px,4vw,48px)", padding: "clamp(24px,3vw,40px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", border: `1.5px solid ${B.black}` }}>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,.4)", letterSpacing: ".1em", textTransform: "uppercase" }}>&copy; {new Date().getFullYear()}</div>
              <div style={{ fontSize: "15px", color: "rgba(255,255,255,.6)", fontWeight: 600, marginTop: "4px" }}>Broks Vision</div>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ EXPORT BUTTON ═══ */}
      <button onClick={handleExportPPTX} disabled={exporting} style={{
        position: "fixed", bottom: "32px", right: "32px", zIndex: 9999,
        display: "flex", alignItems: "center", gap: "10px",
        padding: "16px 24px", borderRadius: "100px",
        border: `1px solid ${exportDone ? "#22c55e" : "rgba(255,255,255,.12)"}`,
        background: exportDone ? "rgba(34,197,94,.15)" : exporting ? "rgba(239,131,22,.1)" : "rgba(10,10,15,.85)",
        backdropFilter: "blur(16px)", color: exportDone ? "#22c55e" : B.white,
        fontSize: "13px", fontWeight: 600, fontFamily: "inherit",
        cursor: exporting ? "wait" : "pointer",
        transition: "all .4s cubic-bezier(.22,1,.36,1)",
        boxShadow: exportDone ? "0 0 30px rgba(34,197,94,.2)" : "0 4px 24px rgba(0,0,0,.4)",
      }}
        onMouseEnter={(e)=>{ if(!exporting){e.currentTarget.style.transform="translateY(-2px)";if(!exportDone)e.currentTarget.style.borderColor=B.orange;} }}
        onMouseLeave={(e)=>{ e.currentTarget.style.transform="translateY(0)";if(!exportDone)e.currentTarget.style.borderColor="rgba(255,255,255,.12)"; }}
      >
        {exporting ? (<><svg width="16" height="16" viewBox="0 0 24 24" style={{animation:"spin 1s linear infinite"}}><circle cx="12" cy="12" r="10" fill="none" stroke={B.orange} strokeWidth="2.5" strokeDasharray="31.4 31.4" strokeLinecap="round"/></svg>Generating...</>)
        : exportDone ? (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Downloaded!</>)
        : (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export PPTX</>)}
      </button>
    </div>
  );
}
