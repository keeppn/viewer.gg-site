"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

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

// ═══════════════════════════════════════════
// ─── MAIN PAGE ───
// ═══════════════════════════════════════════

export default function BroksVisionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroStickyRef = useRef<HTMLDivElement>(null);
  const heroScaleRef = useRef<HTMLDivElement>(null);
  const heroTopRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroTriggerRef = useRef<HTMLDivElement>(null);

  const introRef = useRef<HTMLElement>(null);
  const introStickyRef = useRef<HTMLDivElement>(null);
  const introWordsRef = useRef<HTMLDivElement>(null);
  const introStatsRef = useRef<HTMLDivElement>(null);

  const circleRef = useRef<HTMLElement>(null);
  const circleStickyRef = useRef<HTMLDivElement>(null);
  const circleRingRef = useRef<SVGCircleElement>(null);
  const circleTextRef = useRef<HTMLDivElement>(null);
  const circleLabelRef = useRef<HTMLDivElement>(null);

  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const chapterStickyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterNumRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterHeadRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterDescRefs = useRef<(HTMLDivElement | null)[]>([]);

  const ctaRef = useRef<HTMLElement>(null);
  const ctaStickyRef = useRef<HTMLDivElement>(null);
  const ctaContentRef = useRef<HTMLDivElement>(null);

  const footerRef = useRef<HTMLElement>(null);
  const footerCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [mounted, setMounted] = useState(false);

  // ─── LENIS SMOOTH SCROLL ───
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // @ts-expect-error - Lenis types
      direction: "vertical",
      smooth: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    setMounted(true);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  // ─── GSAP ANIMATIONS ───
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      // Let ScrollTrigger recalculate after mount
      ScrollTrigger.refresh();

      // ═══ HERO ANIMATION ═══
      // Hero is 300svh tall. The sticky viewport stays fixed while we scroll through.
      // The animation triggers on the FULL hero section, starting after 33% scroll (past the first 100svh)
      if (heroRef.current && heroScaleRef.current && heroTopRef.current && heroBgRef.current) {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "33% top",  // Start animating after first 100svh of 300svh
            end: "bottom top",
            scrub: true,
          },
        });

        heroTl
          .addLabel("start")
          .to(heroTopRef.current, { opacity: 0, y: -80, ease: "none", duration: 0.5 }, "start")
          .to(heroScaleRef.current, { scale: 0.3, ease: "power2.inOut", duration: 1 }, "start+=0.1")
          .to(heroBgRef.current, { opacity: 0, duration: 0.001 }, "start+=0.8");
      }

      // ═══ INTRO SECTION: WORD-BY-WORD REVEAL ═══
      if (introRef.current && introWordsRef.current) {
        const words = introWordsRef.current.querySelectorAll(".intro-word");
        const placeholders = introWordsRef.current.querySelectorAll(".intro-placeholder");
        const spans = introWordsRef.current.querySelectorAll(".intro-span");

        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 60%",
            end: "top -20%",
            scrub: true,
          },
        });

        // Phase 1: Show word containers with placeholder bars
        introTl
          .addLabel("placeholder")
          .fromTo(
            words,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.03, ease: "power2.out" },
            "placeholder"
          );

        // Phase 2: Hide placeholders, reveal actual text
        introTl
          .addLabel("reveal", "+=0.3")
          .to(placeholders, { autoAlpha: 0, stagger: 0.03, ease: "power2.inOut" }, "reveal")
          .fromTo(
            spans,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, stagger: 0.03, ease: "power2.out" },
            "reveal"
          );

        // Stats counter animation
        if (introStatsRef.current) {
          gsap.fromTo(
            introStatsRef.current.querySelectorAll(".stat-item"),
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: introStatsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      // ═══ 360° CIRCLE FILL ANIMATION ═══
      if (circleRef.current && circleRingRef.current && circleTextRef.current) {
        const circumference = 2 * Math.PI * 140;

        gsap.set(circleRingRef.current, {
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
        });

        const circleTl = gsap.timeline({
          scrollTrigger: {
            trigger: circleRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: false,
          },
        });

        circleTl
          .addLabel("start")
          .to(
            circleRingRef.current,
            { strokeDashoffset: 0, ease: "none", duration: 1 },
            "start"
          )
          .fromTo(
            circleTextRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, ease: "power2.out", duration: 0.5 },
            "start+=0.3"
          );

        if (circleLabelRef.current) {
          const labels = circleLabelRef.current.querySelectorAll(".circle-label");
          circleTl.fromTo(
            labels,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, stagger: 0.15, ease: "power2.out", duration: 0.3 },
            "start+=0.2"
          );
        }
      }

      // ═══ CHAPTER SECTIONS (SERVICES) ═══
      chapterRefs.current.forEach((chapter, i) => {
        if (!chapter) return;
        const sticky = chapterStickyRefs.current[i];
        const content = chapterContentRefs.current[i];
        const num = chapterNumRefs.current[i];
        const head = chapterHeadRefs.current[i];
        const desc = chapterDescRefs.current[i];

        if (!sticky || !content) return;

        // Clip-path reveal: section expands from rounded inset to full screen
        const chapterTl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });

        chapterTl.fromTo(
          sticky,
          { clipPath: "inset(8% round 40px)" },
          { clipPath: "inset(0% round 0px)", ease: "none" }
        );

        // Content reveal on scroll — scrub-based for smoother control
        const contentTl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top 50%",
            end: "top -10%",
            scrub: true,
          },
        });

        contentTl
          .fromTo(num, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" })
          .fromTo(
            head ? head.querySelectorAll(".ch-word") : [],
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: "power3.out" },
            "-=0.1"
          )
          .fromTo(desc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "-=0.2");

        // Fade out content as chapter scrolls away
        gsap.to(content, {
          opacity: 0,
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: chapter,
            start: "60% top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Parallax out: sticky moves up as section ends
        gsap.to(sticky, {
          y: "-20lvh",
          ease: "none",
          scrollTrigger: {
            trigger: chapter,
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // ═══ CTA SECTION ═══
      if (ctaRef.current && ctaContentRef.current) {
        const ctaWords = ctaContentRef.current.querySelectorAll(".cta-word");
        const ctaBtn = ctaContentRef.current.querySelector(".cta-btn");
        const ctaSub = ctaContentRef.current.querySelector(".cta-sub");

        gsap.fromTo(
          ctaWords,
          { opacity: 0, y: 60, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.08,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: ctaRef.current, start: "top 60%", toggleActions: "play none none reverse" },
          }
        );
        if (ctaSub) {
          gsap.fromTo(ctaSub, { opacity: 0 }, {
            opacity: 1, duration: 1, delay: 0.5,
            scrollTrigger: { trigger: ctaRef.current, start: "top 50%", toggleActions: "play none none reverse" },
          });
        }
        if (ctaBtn) {
          gsap.fromTo(ctaBtn, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.8, delay: 0.7,
            scrollTrigger: { trigger: ctaRef.current, start: "top 50%", toggleActions: "play none none reverse" },
          });
        }
      }

      // ═══ FOOTER GRID ANIMATION ═══
      if (footerRef.current) {
        const cards = footerRef.current.querySelectorAll(".footer-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: footerRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  // ─── CHAPTER DATA ───
  const chapters = [
    {
      num: "01",
      label: "Creative",
      title: "Ideas That Ignite",
      desc: "From bold campaign concepts to scroll-stopping visuals — we craft creative that doesn't just get seen, it gets remembered. Every asset is designed to amplify your brand's voice across every touchpoint.",
      bg: B.orange,
      accent: B.black,
    },
    {
      num: "02",
      label: "PR & Communications",
      title: "Stories That Spread",
      desc: "Strategic media relations, crisis management, and narrative building that positions your brand where it matters. We turn company milestones into industry headlines and brand values into public trust.",
      bg: B.blue,
      accent: B.white,
    },
    {
      num: "03",
      label: "Digital",
      title: "Performance Engineered",
      desc: "Data-driven campaigns across search, social, and programmatic channels. Every impression tracked, every conversion optimized, every dollar working harder than the last. Real-time dashboards included.",
      bg: B.black,
      accent: B.orange,
    },
    {
      num: "04",
      label: "BTL & Activations",
      title: "Experiences That Move",
      desc: "Below-the-line activations that create genuine human connections. Experiential events, guerrilla campaigns, and on-ground executions that transform passive audiences into active brand advocates.",
      bg: B.gray,
      accent: B.cream,
    },
  ];

  // ─── INTRO WORDS ───
  const introText = "Your brand is more than a logo. It's every touchpoint, every interaction, every impression. We engineer the full 360 — so nothing falls through the cracks.";
  const introWords = introText.split(" ");

  return (
    <div
      ref={containerRef}
      className="relative -mt-20"
      style={{ background: B.black, color: B.white, fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      {/* Hide parent navbar/footer for this immersive page */}
      <style>{`
        nav, .navbar, header > nav { display: none !important; }
        footer:not(.bv-footer) { display: none !important; }
        main { padding-top: 0 !important; }

        /* Custom easing curves matching nvg8 */
        :root {
          --ease-out: cubic-bezier(0.22, 1.00, 0.36, 1.00);
          --ease-in-out: cubic-bezier(0.84, 0.00, 0.16, 1.00);
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${B.black}; }
        ::-webkit-scrollbar-thumb { background: ${B.gray}; border-radius: 3px; }

        /* Word reveal placeholder style */
        .intro-placeholder {
          background: rgba(255,255,255,0.08);
          border-radius: 100px;
          position: absolute;
          inset: 10% 0;
          pointer-events: none;
        }

        /* Chapter word reveal */
        .ch-word {
          display: inline-block;
          will-change: transform, opacity;
        }

        /* Button hover animation */
        .bv-btn {
          position: relative;
          overflow: hidden;
          transition: border-radius 0.4s var(--ease-out), transform 0.3s var(--ease-out);
        }
        .bv-btn:hover { border-radius: 12px !important; transform: scale(1.02); }
        .bv-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.1);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .bv-btn:hover::after { opacity: 1; }

        /* Footer card hover */
        .footer-card {
          transition: transform 0.5s var(--ease-out), border-color 0.3s;
        }
        .footer-card:hover { transform: translateY(-4px); }

        /* Selection */
        ::selection { background: ${B.orange}; color: ${B.black}; }
      `}</style>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ HERO — 300svh tall, sticky viewport ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <section ref={heroRef} style={{ height: "300svh", position: "relative", width: "100%" }}>
        {/* Trigger div for ScrollTrigger */}
        <div ref={heroTriggerRef} style={{ height: "100svh", position: "absolute", top: 0, left: 0, width: "100%" }} />

        {/* Black background that fades out */}
        <div
          ref={heroBgRef}
          style={{
            background: B.black,
            position: "absolute",
            inset: 0,
            willChange: "opacity",
            zIndex: 1,
          }}
        />

        {/* Sticky viewport */}
        <div
          ref={heroStickyRef}
          style={{
            position: "sticky",
            top: 0,
            height: "100svh",
            minHeight: "100svh",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          {/* Gradient orbs */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{
              position: "absolute", top: "-15%", right: "-10%",
              width: "700px", height: "700px", borderRadius: "50%",
              background: `radial-gradient(circle, ${B.orange}30, transparent 70%)`,
              filter: "blur(80px)",
            }} />
            <div style={{
              position: "absolute", bottom: "-15%", left: "-10%",
              width: "500px", height: "500px", borderRadius: "50%",
              background: `radial-gradient(circle, ${B.blue}25, transparent 70%)`,
              filter: "blur(60px)",
            }} />
            {/* Grid overlay */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.04,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }} />
          </div>

          {/* Scalable content container */}
          <div
            ref={heroScaleRef}
            style={{
              willChange: "transform",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            {/* Hero content */}
            <div ref={heroTopRef} style={{ position: "relative", zIndex: 10, willChange: "transform, opacity" }}>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "8px 20px", borderRadius: "100px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)", marginBottom: "48px",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.orange, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                  360 Marketing Services
                </span>
              </div>

              {/* Massive title */}
              <h1 style={{
                fontSize: "clamp(60px, 12vw, 160px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 0.85,
                margin: 0,
                color: B.white,
              }}>
                BROKS
                <br />
                <span style={{ color: B.white }}>VISI</span>
                <span style={{ color: B.orange }}>O</span>
                <span style={{ color: B.white }}>N</span>
              </h1>

              {/* Gradient underline */}
              <div style={{
                width: "60%", height: "3px", margin: "24px auto 0",
                background: `linear-gradient(90deg, ${B.orange}, ${B.blue})`,
                borderRadius: "2px",
              }} />

              {/* Subtitle */}
              <p style={{
                fontSize: "clamp(16px, 1.8vw, 22px)",
                color: "rgba(255,255,255,0.45)",
                maxWidth: "480px",
                margin: "32px auto 0",
                lineHeight: 1.5,
                fontWeight: 400,
              }}>
                We build brands that resonate, campaigns that convert, and experiences people remember.
              </p>

              {/* CTA */}
              <div style={{ marginTop: "48px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="#services"
                  className="bv-btn"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px",
                    padding: "16px 36px", borderRadius: "100px",
                    background: B.orange, color: B.black,
                    fontWeight: 700, fontSize: "15px",
                    textDecoration: "none", border: `1px solid ${B.orange}`,
                  }}
                >
                  Explore Our Work
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="mailto:hello@broksvision.com"
                  className="bv-btn"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px",
                    padding: "16px 36px", borderRadius: "100px",
                    background: "transparent", color: "rgba(255,255,255,0.6)",
                    fontWeight: 500, fontSize: "15px",
                    textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Decorative icons grid behind text (like nvg8 hero-icons) */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none", opacity: 0.06,
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", width: "80%", maxWidth: "800px" }}>
                {[...Array(10)].map((_, i) => (
                  <div key={i} style={{
                    aspectRatio: "1", borderRadius: "20%",
                    border: `2px solid ${i % 2 === 0 ? B.orange : B.blue}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{
                      width: "40%", height: "40%", borderRadius: "50%",
                      background: i % 2 === 0 ? B.orange : B.blue,
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator — inside sticky hero so it scrolls away */}
        <div style={{
          position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          opacity: 0.4, pointerEvents: "none",
        }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: B.white }}>Scroll</span>
          <div style={{
            width: "1px", height: "32px",
            background: `linear-gradient(to bottom, ${B.orange}, transparent)`,
            animation: "scrollPulse 2s ease-in-out infinite",
          }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ INTRO — Word-by-word reveal with placeholders ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <section
        ref={introRef}
        style={{
          minHeight: "100svh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "160px 24px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
          {/* Word-by-word text */}
          <div
            ref={introWordsRef}
            style={{
              fontSize: "clamp(28px, 5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              display: "flex",
              flexWrap: "wrap",
              gap: "0 0.3em",
            }}
          >
            {introWords.map((word, i) => (
              <span
                key={i}
                className="intro-word"
                style={{ position: "relative", display: "inline-block", opacity: 0 }}
              >
                <span className="intro-placeholder" />
                <span className="intro-span" style={{ position: "relative", opacity: 0, display: "inline-block" }}>
                  {word}
                </span>
              </span>
            ))}
          </div>

          {/* Stats */}
          <div
            ref={introStatsRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "32px",
              marginTop: "80px",
              paddingTop: "48px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {[
              { num: "150+", label: "Projects" },
              { num: "50+", label: "Brand Partners" },
              { num: "12", label: "Years" },
              { num: "98%", label: "Retention" },
            ].map((s) => (
              <div key={s.label} className="stat-item" style={{ textAlign: "center", opacity: 0 }}>
                <div style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, letterSpacing: "-0.03em", color: B.orange }}>
                  {s.num}
                </div>
                <div style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ 360° CIRCLE FILL — Scroll-driven ring animation ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <section
        ref={circleRef}
        style={{
          height: "250svh",
          position: "relative",
        }}
      >
        <div
          ref={circleStickyRef}
          style={{
            position: "sticky",
            top: 0,
            height: "100svh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Background glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "600px", height: "600px", borderRadius: "50%",
            background: `radial-gradient(circle, ${B.orange}15, transparent 70%)`,
            filter: "blur(60px)", pointerEvents: "none",
          }} />

          {/* SVG Ring */}
          <svg
            viewBox="0 0 300 300"
            style={{ width: "min(70vw, 400px)", height: "min(70vw, 400px)", position: "relative", zIndex: 2, transform: "rotate(-90deg)" }}
          >
            {/* Background ring */}
            <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            {/* Animated fill ring */}
            <circle
              ref={circleRingRef}
              cx="150" cy="150" r="140"
              fill="none"
              stroke={B.orange}
              strokeWidth="4"
              strokeLinecap="round"
              style={{ willChange: "stroke-dashoffset" }}
            />
          </svg>

          {/* Center text */}
          <div
            ref={circleTextRef}
            style={{
              position: "absolute", textAlign: "center", zIndex: 3,
              opacity: 0,
            }}
          >
            <div style={{
              fontSize: "clamp(64px, 10vw, 120px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: B.white,
            }}>
              360°
            </div>
            <div style={{
              fontSize: "clamp(14px, 1.5vw, 18px)",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginTop: "12px",
            }}>
              Marketing Services
            </div>
          </div>

          {/* Orbiting labels */}
          <div
            ref={circleLabelRef}
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4 }}
          >
            {["Creative", "PR", "Digital", "BTL"].map((label, i) => {
              const angle = (i * 90 - 45) * (Math.PI / 180);
              const radius = typeof window !== "undefined" ? Math.min(window.innerWidth * 0.35, 220) : 220;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={label}
                  className="circle-label"
                  style={{
                    position: "absolute",
                    left: "50%", top: "50%",
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    padding: "8px 20px",
                    borderRadius: "100px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: B.orange,
                    whiteSpace: "nowrap",
                    opacity: 0,
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ CHAPTERS — Clip-path revealing service sections ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <div id="services">
        {chapters.map((ch, i) => (
          <section
            key={ch.num}
            ref={(el) => { chapterRefs.current[i] = el; }}
            style={{
              height: "200svh",
              position: "relative",
            }}
          >
            <div
              ref={(el) => { chapterStickyRefs.current[i] = el; }}
              style={{
                position: "sticky",
                top: 0,
                height: "100svh",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: ch.bg,
                willChange: "clip-path, transform",
                clipPath: "inset(8% round 40px)",
              }}
            >
              {/* Subtle texture */}
              <div style={{
                position: "absolute", inset: 0, opacity: 0.03,
                backgroundImage: `radial-gradient(circle at 50% 50%, ${ch.accent}40 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }} />

              {/* Content */}
              <div
                ref={(el) => { chapterContentRefs.current[i] = el; }}
                style={{
                  position: "relative", zIndex: 2,
                  padding: "0 clamp(24px, 8vw, 128px)",
                  maxWidth: "1000px",
                  width: "100%",
                }}
              >
                {/* Chapter number pill */}
                <div
                  ref={(el) => { chapterNumRefs.current[i] = el; }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "12px",
                    padding: "8px 20px", borderRadius: "100px",
                    background: `${ch.accent}15`,
                    border: `1px solid ${ch.accent}25`,
                    marginBottom: "32px", opacity: 0,
                  }}
                >
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: ch.accent, color: ch.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 900,
                  }}>
                    {ch.num}
                  </span>
                  <span style={{
                    fontSize: "13px", fontWeight: 600, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: ch.accent,
                  }}>
                    {ch.label}
                  </span>
                </div>

                {/* Heading (word by word) */}
                <div
                  ref={(el) => { chapterHeadRefs.current[i] = el; }}
                  style={{
                    fontSize: "clamp(40px, 8vw, 100px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.9,
                    color: ch.accent,
                    marginBottom: "24px",
                  }}
                >
                  {ch.title.split(" ").map((word, wi) => (
                    <span key={wi} className="ch-word" style={{ opacity: 0, marginRight: "0.25em" }}>
                      {word}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p
                  ref={(el) => { chapterDescRefs.current[i] = el; }}
                  style={{
                    fontSize: "clamp(16px, 1.5vw, 20px)",
                    lineHeight: 1.6,
                    color: `${ch.accent}99`,
                    maxWidth: "600px",
                    fontWeight: 400,
                    opacity: 0,
                  }}
                >
                  {ch.desc}
                </p>
              </div>

              {/* Large background number */}
              <div style={{
                position: "absolute", right: "5%", bottom: "-5%",
                fontSize: "clamp(200px, 30vw, 400px)",
                fontWeight: 900,
                lineHeight: 1,
                color: `${ch.accent}06`,
                letterSpacing: "-0.05em",
                pointerEvents: "none",
                userSelect: "none",
              }}>
                {ch.num}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ CTA ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        style={{
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "120px 24px",
        }}
      >
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "800px", height: "800px", borderRadius: "50%",
          background: `radial-gradient(circle, ${B.orange}10, transparent 60%)`,
          filter: "blur(100px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)`,
        }} />

        <div ref={ctaContentRef} style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "900px" }}>
          {/* Label */}
          <div className="cta-word" style={{
            fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase",
            color: B.orange, fontWeight: 600, marginBottom: "24px", opacity: 0,
          }}>
            Let&apos;s Create Together
          </div>

          {/* Title words */}
          <div style={{
            fontSize: "clamp(44px, 8vw, 100px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            marginBottom: "32px",
          }}>
            {"Ready to Build Something Great?".split(" ").map((word, i) => (
              <span key={i} className="cta-word" style={{ display: "inline-block", marginRight: "0.25em", opacity: 0 }}>
                {word}
              </span>
            ))}
          </div>

          <p className="cta-sub" style={{
            fontSize: "clamp(16px, 1.5vw, 20px)",
            color: "rgba(255,255,255,0.4)",
            maxWidth: "500px",
            margin: "0 auto 48px",
            lineHeight: 1.6,
            opacity: 0,
          }}>
            Whether you need a full rebrand or a targeted campaign, we&apos;re ready to make it happen.
          </p>

          <a
            href="mailto:hello@broksvision.com"
            className="bv-btn cta-btn"
            style={{
              display: "inline-flex", alignItems: "center", gap: "12px",
              padding: "20px 48px", borderRadius: "100px",
              background: `linear-gradient(135deg, ${B.orange}, ${B.orangeLight})`,
              color: B.black, fontWeight: 700, fontSize: "17px",
              textDecoration: "none",
              border: "none",
              boxShadow: `0 0 60px ${B.orange}30`,
              opacity: 0,
            }}
          >
            Get in Touch
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* ═══ FOOTER — nvg8-style grid ═══ */}
      {/* ═══════════════════════════════════════════ */}
      <footer ref={footerRef} className="bv-footer" style={{
        background: B.cream,
        color: B.black,
        padding: "clamp(40px, 6vw, 80px)",
        overflow: "hidden",
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Top row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            {/* Left card - Brand */}
            <div className="footer-card" style={{
              background: B.orange,
              borderRadius: "clamp(24px, 4vw, 56px)",
              padding: "clamp(32px, 4vw, 56px)",
              aspectRatio: "1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: `1.5px solid ${B.black}`,
              overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                fontSize: "clamp(32px, 5vw, 72px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: B.black,
              }}>
                BR<span style={{ opacity: 0.6 }}>O</span>KS
                <br />
                VISI<span style={{ opacity: 0.6 }}>O</span>N
              </div>
              <div style={{
                fontSize: "clamp(12px, 1.2vw, 16px)",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: B.black,
                opacity: 0.6,
              }}>
                360° Marketing
              </div>
              {/* Background pattern */}
              <div style={{
                position: "absolute", bottom: "-20%", right: "-20%",
                width: "60%", height: "60%", borderRadius: "50%",
                border: `3px solid ${B.black}15`,
              }} />
            </div>

            {/* Right card - CTA */}
            <div className="footer-card" style={{
              background: B.blue,
              borderRadius: "clamp(24px, 4vw, 56px)",
              padding: "clamp(32px, 4vw, 56px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: `1.5px solid ${B.black}`,
            }}>
              <div>
                <div style={{
                  fontSize: "clamp(24px, 3.5vw, 48px)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: B.cream,
                  marginBottom: "16px",
                }}>
                  Let&apos;s start
                  <br />
                  your project
                </div>
                <p style={{
                  fontSize: "clamp(13px, 1.2vw, 16px)",
                  color: "rgba(253,249,240,0.6)",
                  lineHeight: 1.5,
                  maxWidth: "300px",
                }}>
                  Ready to transform your brand? Reach out and let&apos;s build something extraordinary.
                </p>
              </div>
              <a
                href="mailto:hello@broksvision.com"
                className="bv-btn"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  gap: "10px", padding: "16px 32px", borderRadius: "100px",
                  background: B.cream, color: B.black,
                  fontWeight: 700, fontSize: "14px",
                  textDecoration: "none",
                  border: `1px solid ${B.black}`,
                  width: "fit-content",
                  marginTop: "24px",
                }}
              >
                Contact Us
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
            {/* Links */}
            <div className="footer-card" style={{
              background: `${B.blue}15`,
              borderRadius: "clamp(24px, 4vw, 48px)",
              padding: "clamp(24px, 3vw, 40px) clamp(32px, 4vw, 56px)",
              border: `1.5px solid ${B.black}10`,
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}>
              {["Creative", "PR", "Digital", "BTL", "Branding", "Strategy"].map((link) => (
                <span
                  key={link}
                  style={{
                    fontSize: "clamp(16px, 2vw, 24px)",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    color: B.black,
                    opacity: 0.7,
                    cursor: "pointer",
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                >
                  {link}
                </span>
              ))}
            </div>

            {/* Copyright */}
            <div className="footer-card" style={{
              background: B.black,
              borderRadius: "clamp(24px, 4vw, 48px)",
              padding: "clamp(24px, 3vw, 40px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              border: `1.5px solid ${B.black}`,
            }}>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                &copy; {new Date().getFullYear()}
              </div>
              <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: "4px" }}>
                Broks Vision
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes scrollPulse {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </div>
  );
}
