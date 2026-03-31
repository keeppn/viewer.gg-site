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
// Clean web/network with evenly-spaced nodes and elegant connections
// ═══════════════════════════════════════════
function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999, targetX: -999, targetY: -999 });
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    // ─── SETTINGS ───
    const NODE_COUNT = 60;               // fewer = cleaner, more spread out
    const CONNECTION_DISTANCE = 320;      // very wide reach = web-like mesh
    const MOUSE_RADIUS = 300;
    const MIN_NODE_SPACING = 100;         // minimum distance between nodes

    // Center dead zone — nodes stay behind the form
    const DEAD_ZONE_W = 270;
    const DEAD_ZONE_H = 230;
    const DEAD_ZONE_PUSH = 0.3;

    interface Node {
      x: number; y: number;
      homeX: number; homeY: number;     // anchor position for gentle oscillation
      vx: number; vy: number;
      size: number;
      color: string;
      glowColor: string;
      alpha: number;
      phase: number;                    // for oscillation
      speed: number;                    // oscillation speed
      amplitude: number;               // oscillation range
    }

    const nodes: Node[] = [];
    const nodeColors = [B.orange, B.blue, B.orangeLight, B.blueLight, "rgba(255,255,255,0.6)"];

    // Grid-based placement with jitter for even spread
    const cols = Math.ceil(Math.sqrt(NODE_COUNT * (width / height)));
    const rows = Math.ceil(NODE_COUNT / cols);
    const cellW = width / cols;
    const cellH = height / rows;
    let placed = 0;

    for (let row = 0; row < rows && placed < NODE_COUNT; row++) {
      for (let col = 0; col < cols && placed < NODE_COUNT; col++) {
        const cx = width / 2;
        const cy = height / 2;
        // Grid position + random jitter (40% of cell size)
        let px = (col + 0.5) * cellW + (Math.random() - 0.5) * cellW * 0.8;
        let py = (row + 0.5) * cellH + (Math.random() - 0.5) * cellH * 0.8;
        // Skip if inside dead zone
        if (Math.abs(px - cx) < DEAD_ZONE_W * 0.6 && Math.abs(py - cy) < DEAD_ZONE_H * 0.6) {
          // Push to nearest edge of dead zone
          const pushX = px < cx ? cx - DEAD_ZONE_W * 0.7 : cx + DEAD_ZONE_W * 0.7;
          const pushY = py < cy ? cy - DEAD_ZONE_H * 0.7 : cy + DEAD_ZONE_H * 0.7;
          if (Math.abs(px - cx) / DEAD_ZONE_W > Math.abs(py - cy) / DEAD_ZONE_H) {
            px = pushX;
          } else {
            py = pushY;
          }
        }
        // Clamp to viewport
        px = Math.max(20, Math.min(width - 20, px));
        py = Math.max(20, Math.min(height - 20, py));

        const isBrand = Math.random() > 0.4;
        const color = nodeColors[Math.floor(Math.random() * nodeColors.length)];
        nodes.push({
          x: px, y: py, homeX: px, homeY: py,
          vx: 0, vy: 0,
          size: isBrand ? 2.5 + Math.random() * 2 : 1.5 + Math.random() * 1.5,
          color,
          glowColor: color === B.orange || color === B.orangeLight ? B.orange : color === B.blue || color === B.blueLight ? B.blue : "rgba(255,255,255,0.4)",
          alpha: isBrand ? 0.5 + Math.random() * 0.4 : 0.2 + Math.random() * 0.25,
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.005,
          amplitude: 15 + Math.random() * 25,
        });
        placed++;
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    function animate() {
      timeRef.current += 1;
      const time = timeRef.current;

      // Full clear each frame (no motion trails — clean network look)
      ctx!.fillStyle = B.black;
      ctx!.fillRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cx = width / 2;
      const cy = height / 2;

      // ─── Update node positions (gentle oscillation around home) ───
      nodes.forEach((n) => {
        // Smooth oscillation around anchor point
        const t = time * n.speed;
        n.x = n.homeX + Math.sin(t + n.phase) * n.amplitude;
        n.y = n.homeY + Math.cos(t * 0.7 + n.phase * 1.3) * n.amplitude * 0.6;

        // Dead zone push
        const dxC = n.x - cx;
        const dyC = n.y - cy;
        if (Math.abs(dxC) < DEAD_ZONE_W && Math.abs(dyC) < DEAD_ZONE_H) {
          const overlapX = 1 - Math.abs(dxC) / DEAD_ZONE_W;
          const overlapY = 1 - Math.abs(dyC) / DEAD_ZONE_H;
          const overlap = overlapX * overlapY;
          const pushDist = Math.sqrt(dxC * dxC + dyC * dyC) || 1;
          n.x += (dxC / pushDist) * overlap * DEAD_ZONE_PUSH * 40;
          n.y += (dyC / pushDist) * overlap * DEAD_ZONE_PUSH * 40;
        }

        // Mouse interaction: nodes gently pushed away from cursor
        const dx = mx - n.x;
        const dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          n.x -= (dx / dist) * force * 25;
          n.y -= (dy / dist) * force * 25;
        }
      });

      // ─── Draw connections FIRST (behind nodes) ───
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          const connDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

          if (distSq < connDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;

            // Lines near mouse glow orange
            const midX = (nodes[i].x + nodes[j].x) / 2;
            const midY = (nodes[i].y + nodes[j].y) / 2;
            const mDist = Math.sqrt((mx - midX) ** 2 + (my - midY) ** 2);
            const mInfluence = Math.max(0, 1 - mDist / (MOUSE_RADIUS * 1.8));

            ctx!.save();
            ctx!.globalAlpha = alpha + mInfluence * 0.25;
            if (mInfluence > 0.15) {
              // Gradient line near mouse: orange glow
              const grad = ctx!.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
              grad.addColorStop(0, B.orange);
              grad.addColorStop(1, B.orangeLight);
              ctx!.strokeStyle = grad;
              ctx!.shadowBlur = 6;
              ctx!.shadowColor = B.orange;
            } else {
              ctx!.strokeStyle = "rgba(255,255,255,0.25)";
            }
            ctx!.lineWidth = 0.5 + mInfluence * 1.2;
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
            ctx!.restore();
          }
        }
      }

      // ─── Draw nodes (on top of connections) ───
      nodes.forEach((n) => {
        const dx = mx - n.x;
        const dy = my - n.y;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        const mouseProximity = Math.max(0, 1 - mouseDist / MOUSE_RADIUS);

        // Node pulse
        const pulse = 1 + 0.15 * Math.sin(time * 0.03 + n.phase);

        // Draw outer glow ring (subtle)
        if (n.size > 2.5 || mouseProximity > 0.3) {
          ctx!.save();
          ctx!.globalAlpha = (n.alpha * 0.15 + mouseProximity * 0.2) * pulse;
          ctx!.strokeStyle = n.glowColor;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.size * 3 + mouseProximity * 8, 0, Math.PI * 2);
          ctx!.stroke();
          ctx!.restore();
        }

        // Draw node core with glow
        const coreSize = n.size * pulse + mouseProximity * 1.5;
        ctx!.save();
        ctx!.globalAlpha = n.alpha + mouseProximity * 0.3;
        ctx!.shadowBlur = 15 + mouseProximity * 20;
        ctx!.shadowColor = n.glowColor;
        ctx!.fillStyle = n.color;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, coreSize, 0, Math.PI * 2);
        ctx!.fill();
        // Bright center dot
        ctx!.globalAlpha = (n.alpha + mouseProximity * 0.4) * 0.8;
        ctx!.shadowBlur = 0;
        ctx!.fillStyle = "#FFFFFF";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, coreSize * 0.35, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      });

      // ─── Mouse glow ───
      if (mx > 0 && my > 0) {
        const g = ctx!.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS * 0.6);
        g.addColorStop(0, "rgba(239,131,22,0.06)");
        g.addColorStop(0.4, "rgba(40,65,209,0.025)");
        g.addColorStop(1, "transparent");
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, width, height);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    // Initial fill
    ctx.fillStyle = B.black;
    ctx.fillRect(0, 0, width, height);
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

      {/* Aurora gradient blobs — vivid, layered */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
        {/* Primary orange aurora — top-left */}
        <div style={{
          position: "absolute", top: "-25%", left: "-15%",
          width: "70vw", height: "70vw", maxWidth: "800px", maxHeight: "800px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${B.orange}35, ${B.orange}15 40%, transparent 70%)`,
          filter: "blur(80px)",
          animation: "auroraFloat1 8s ease-in-out infinite",
        }} />
        {/* Deep blue aurora — bottom-right */}
        <div style={{
          position: "absolute", bottom: "-25%", right: "-15%",
          width: "65vw", height: "65vw", maxWidth: "700px", maxHeight: "700px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${B.blue}30, ${B.blue}12 40%, transparent 70%)`,
          filter: "blur(80px)",
          animation: "auroraFloat2 10s ease-in-out infinite",
        }} />
        {/* Secondary orange — mid-right */}
        <div style={{
          position: "absolute", top: "25%", right: "10%",
          width: "40vw", height: "40vw", maxWidth: "450px", maxHeight: "450px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${B.orangeLight}25, transparent 70%)`,
          filter: "blur(50px)",
          animation: "auroraFloat3 6s ease-in-out infinite",
        }} />
        {/* Blue accent — mid-left */}
        <div style={{
          position: "absolute", top: "55%", left: "5%",
          width: "35vw", height: "35vw", maxWidth: "400px", maxHeight: "400px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${B.blueLight}20, transparent 70%)`,
          filter: "blur(60px)",
          animation: "auroraFloat4 12s ease-in-out infinite",
        }} />
        {/* Warm center glow — behind form */}
        <div style={{
          position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
          width: "50vw", height: "50vw", maxWidth: "500px", maxHeight: "500px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${B.orange}12, ${B.blue}06 50%, transparent 70%)`,
          filter: "blur(100px)",
          animation: "auroraFloat5 15s ease-in-out infinite",
        }} />
      </div>

      {/* Animated grain texture overlay */}
      <div className="login-grain" style={{
        position: "absolute", inset: "-100%", zIndex: 3, pointerEvents: "none",
        opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }} />

      {/* Scan line effect */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
        opacity: 0.015,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
        backgroundSize: "100% 4px",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "460px", padding: "0 24px" }}>
        {/* Logo Mark + Title */}
        <div ref={titleRef} style={{ textAlign: "center", marginBottom: "48px", perspective: "800px" }}>
          {/* SVG Pac-man Logo Mark */}
          <div className="login-letter" style={{ display: "inline-block", opacity: 0, marginBottom: "20px" }}>
            <svg viewBox="0 0 100 155" width="72" height="112" style={{ filter: `drop-shadow(0 0 25px ${B.orange}40)` }}>
              <path d="M 42 45 L 42 75 A 30 30 0 1 1 72 45 Z" fill={B.orange} />
              <path d="M 58 110 L 58 80 A 30 30 0 1 1 28 110 Z" fill={B.orange} />
            </svg>
          </div>
          {/* Company Name */}
          <div style={{ display: "flex", justifyContent: "center", gap: "3px", flexWrap: "wrap" }}>
            {"BROKS VISION".split("").map((l, i) => (
              <span key={i} className="login-letter" style={{
                display: "inline-block",
                fontSize: "clamp(22px, 4vw, 34px)",
                fontWeight: 900, letterSpacing: "0.2em", color: B.white, opacity: 0,
                textShadow: `0 0 30px ${B.orange}30`,
                ...(l === " " ? { width: "0.4em" } : {}),
              }}>{l === " " ? "\u00A0" : l}</span>
            ))}
          </div>
          <div className="login-line" style={{
            width: "80px", height: "3px", margin: "20px auto 0",
            background: `linear-gradient(90deg, ${B.orange}, ${B.blue})`,
            borderRadius: "2px", transformOrigin: "center", transform: "scaleX(0)",
          }} />
          <div className="login-sub" style={{
            marginTop: "16px", fontSize: "12px", letterSpacing: "0.25em",
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
            className="login-form"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${error ? "#ef4444" : isExiting ? "#22c55e" : focusedField ? `${B.orange}50` : "rgba(255,255,255,0.1)"}`,
              borderRadius: "28px",
              padding: "44px 40px",
              backdropFilter: "blur(30px) saturate(150%)",
              WebkitBackdropFilter: "blur(30px) saturate(150%)",
              boxShadow: focusedField
                ? `0 24px 80px rgba(0,0,0,0.6), 0 0 80px ${B.orange}12, inset 0 1px 0 rgba(255,255,255,0.08)`
                : `0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)`,
              transition: "border-color 0.4s, box-shadow 0.6s cubic-bezier(0.22,1,0.36,1)",
              position: "relative",
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

            {/* Magnetic submit button */}
            <button
              type="submit" disabled={isExiting}
              className="magnetic-btn"
              style={{
                width: "100%", padding: "20px",
                background: `linear-gradient(135deg, ${B.orange}, ${B.orangeLight}, ${B.orange})`,
                backgroundSize: "200% 200%",
                border: "none", borderRadius: "16px",
                color: B.black, fontSize: "15px", fontWeight: 800,
                fontFamily: "inherit", letterSpacing: "0.05em",
                cursor: isExiting ? "wait" : "pointer",
                boxShadow: `0 8px 40px ${B.orange}50, 0 0 60px ${B.orange}15`,
                transition: "box-shadow 0.4s cubic-bezier(0.22,1,0.36,1), background-position 0.3s",
                position: "relative", overflow: "hidden",
              }}
              onMouseMove={(e) => {
                if (isExiting) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                // Magnetic pull: button moves toward cursor
                e.currentTarget.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px) scale(1.02)`;
                // Gradient follows mouse
                const px = ((e.clientX - rect.left) / rect.width) * 100;
                e.currentTarget.style.backgroundPosition = `${px}% 50%`;
                e.currentTarget.style.boxShadow = `0 12px 50px ${B.orange}60, 0 0 80px ${B.orange}20`;
                // Shine spotlight
                const shine = e.currentTarget.querySelector(".btn-shine") as HTMLElement;
                if (shine) { shine.style.left = `${e.clientX - rect.left}px`; shine.style.top = `${e.clientY - rect.top}px`; }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0) scale(1)";
                e.currentTarget.style.backgroundPosition = "0% 50%";
                e.currentTarget.style.boxShadow = `0 8px 40px ${B.orange}50, 0 0 60px ${B.orange}15`;
              }}
            >
              {/* Shine spotlight overlay */}
              <div className="btn-shine" style={{
                position: "absolute", width: "120px", height: "120px",
                borderRadius: "50%", background: "rgba(255,255,255,0.25)",
                filter: "blur(30px)", transform: "translate(-50%, -50%)",
                pointerEvents: "none", transition: "left 0.1s, top 0.1s",
                left: "50%", top: "50%",
              }} />
              <span style={{ position: "relative", zIndex: 2 }}>
                {isExiting ? "✦ Entering..." : "Enter Presentation →"}
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
          25% { transform: translate(8vw, 5vh) scale(1.15); }
          50% { transform: translate(3vw, -3vh) scale(1.05); }
          75% { transform: translate(-5vw, 2vh) scale(1.1); }
        }
        @keyframes auroraFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-6vw, -4vh) scale(1.1); }
          50% { transform: translate(4vw, 6vh) scale(1.15); }
          75% { transform: translate(-2vw, 3vh) scale(0.95); }
        }
        @keyframes auroraFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(4vw, -3vh) scale(1.2) rotate(8deg); }
          66% { transform: translate(-3vw, 2vh) scale(0.95) rotate(-5deg); }
        }
        @keyframes auroraFloat4 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(6vw, 4vh) scale(1.1) rotate(15deg); }
        }
        @keyframes auroraFloat5 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          33% { transform: translate(-48%, -52%) scale(1.1); }
          66% { transform: translate(-52%, -48%) scale(0.9); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes grainShift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
          100% { transform: translate(0, 0); }
        }
        @keyframes formGlow {
          0%, 100% { box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0px transparent, inset 0 1px 0 rgba(255,255,255,0.06); }
          50% { box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(239,131,22,0.06), inset 0 1px 0 rgba(255,255,255,0.08); }
        }
        .login-grain {
          animation: grainShift 4s steps(10) infinite;
        }
        .login-form {
          animation: formGlow 4s ease-in-out infinite;
        }
        .magnetic-btn {
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s, background-position 0.3s !important;
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus::placeholder { color: rgba(239,131,22,0.3); }
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
  const pacmanRef = useRef<HTMLDivElement>(null);
  const pacmanPathRef = useRef<SVGPathElement>(null);

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

      // ═══ SCROLL PAC-MAN — eating dots along S-curve ═══
      if (pacmanRef.current && pacmanPathRef.current) {
        const path = pacmanPathRef.current;
        const pathLength = path.getTotalLength();

        // Set up the dotted trail — dots ahead of pac-man are visible, behind = gone.
        // Technique: dynamically update stroke-dasharray so the eaten portion is one
        // big invisible gap, then the remaining path shows the normal dot pattern.
        const DOT_SIZE = 0.5;
        const DOT_GAP = 1.2;

        // Initial state: all dots visible
        path.style.strokeDasharray = `${DOT_SIZE} ${DOT_GAP}`;
        path.style.strokeDashoffset = "0";

        let prevPoint = { x: 0, y: 0 };

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          onUpdate: (self) => {
            const progress = self.progress;
            const point = path.getPointAtLength(progress * pathLength);
            const svgEl = path.ownerSVGElement;
            if (!svgEl || !pacmanRef.current) return;
            const svgRect = svgEl.getBoundingClientRect();
            const scaleX = svgRect.width / 100;
            const scaleY = svgRect.height / 100;
            const screenX = svgRect.left + point.x * scaleX;
            const screenY = svgRect.top + point.y * scaleY;

            // Calculate rotation based on travel direction
            const dx = point.x - prevPoint.x;
            const dy = point.y - prevPoint.y;
            const angle = Math.atan2(dy * scaleY, dx * scaleX) * (180 / Math.PI);
            prevPoint = { x: point.x, y: point.y };

            pacmanRef.current.style.transform = `translate(${screenX}px, ${screenY}px) rotate(${angle}deg)`;
            pacmanRef.current.style.opacity = progress > 0.01 && progress < 0.99 ? "0.18" : "0";

            // "Eat" the dots — make eaten portion invisible by rebuilding dasharray:
            // Pattern: [0 (invisible dash), eatenLength (invisible gap), 0.5 (dot), 1.2 (gap), ...]
            // This creates a big transparent gap for the already-traveled path,
            // then shows the normal dotted pattern for the remaining path ahead.
            const eatenLength = progress * pathLength;
            if (eatenLength > 0.01) {
              // Build: invisible start gap, then repeating dot pattern
              path.style.strokeDasharray = `0 ${eatenLength} ${DOT_SIZE} ${DOT_GAP}`;
              path.style.strokeDashoffset = "0";
            } else {
              path.style.strokeDasharray = `${DOT_SIZE} ${DOT_GAP}`;
              path.style.strokeDashoffset = "0";
            }
          },
        });
      }

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

          // Animated number counters
          introStatsRef.current.querySelectorAll(".stat-number").forEach((el) => {
            const target = parseInt(el.getAttribute("data-target") || "0");
            const suffix = el.getAttribute("data-suffix") || "";
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target, duration: 2, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
              onUpdate: () => { (el as HTMLElement).textContent = Math.round(obj.val) + suffix; },
            });
          });
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
        const tags = content?.querySelector(".ch-tags");
        contentTl
          .fromTo(num, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" })
          .fromTo(head ? head.querySelectorAll(".ch-word") : [], { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 }, "-=0.1")
          .fromTo(desc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
        if (tags) {
          contentTl.fromTo(tags.children, { opacity: 0, y: 15, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.3, ease: "back.out(1.5)" }, "-=0.15");
        }

        // Draw SVG underlines and circles on chapter titles
        if (head) {
          ScrollTrigger.create({
            trigger: chapter,
            start: "top 30%",
            onEnter: () => {
              head.querySelectorAll(".svg-underline").forEach((el) => el.classList.add("drawn"));
              head.querySelectorAll(".svg-circle").forEach((el) => el.classList.add("drawn"));
            },
            onLeaveBack: () => {
              head.querySelectorAll(".svg-underline").forEach((el) => el.classList.remove("drawn"));
              head.querySelectorAll(".svg-circle").forEach((el) => el.classList.remove("drawn"));
            },
          });
        }

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
      // ═══ ONE-LINER REVEALS ═══
      document.querySelectorAll(".one-liner-section").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          onEnter: () => el.classList.add("in-view"),
          onLeaveBack: () => el.classList.remove("in-view"),
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, [mounted]);

  const chapters = [
    { num: "01", label: "Creative", title: "Ideas That Ignite", underlineWord: "Ignite", circleWord: "",
      desc: "From campaign concepts to brand identity systems, we design every visual and verbal element of your brand — motion graphics, POSM production, space branding, and video content, all crafted under one roof.",
      tags: ["Campaign Design", "Brand Identity", "Motion & Video", "POSM & Spatial", "Copywriting"],
      bg: B.orange, accent: B.black },
    { num: "02", label: "PR & Communications", title: "Stories That Spread", underlineWord: "Spread", circleWord: "Stories",
      desc: "Strategic media relations, crisis management, and reputation building across earned, owned, and shared channels. We turn company milestones into industry headlines — backed by 33 years of journalist relationships.",
      tags: ["Media Relations", "Crisis Comms", "Corporate PR", "Influencer Strategy", "Digital PR"],
      bg: B.blue, accent: B.white },
    { num: "03", label: "Digital", title: "Performance Engineered", underlineWord: "Engineered", circleWord: "",
      desc: "Full-funnel performance across Google, Meta, TikTok, and LinkedIn. We pair data-driven PPC and SEO with AI-powered content, generative engine optimization, and real-time analytics.",
      tags: ["PPC & Paid Social", "SEO & Technical", "AI Marketing", "Social Media", "Analytics"],
      bg: B.black, accent: B.orange },
    { num: "04", label: "BTL & Activations", title: "Experiences That Move", underlineWord: "Move", circleWord: "Experiences",
      desc: "On-ground activations that create genuine human connections. From concept and 3D visualization through logistics and digital integration — experiential campaigns that turn audiences into advocates.",
      tags: ["Event Planning", "Activation Design", "Promo Teams", "Media Buying", "Experiential"],
      bg: B.gray, accent: B.cream },
  ];

  // One-liner interstitials between chapters
  const oneLiners = [
    "Every brand deserves creative that outlives the campaign.",
    "In 33 years, we\u2019ve learned that trust is earned in headlines.",
    "Data doesn\u2019t lie. Neither do results.",
  ];

  const introText = "With 33 years of expertise, we are one of Bulgaria's first and longest-standing communications agencies. We deliver fully integrated, 360° services built on long-term partnerships with international brands and market leaders.";
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
        @keyframes pacmanChomp {
          0%,100% { d: path("M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0"); }
          50% { d: path("M50,15 A50,50 0 1,1 50,85 A50,50 0 1,1 50,15"); }
        }
        @keyframes pacmanMouth {
          0%,100% { clip-path: polygon(100% 50%, 60% 10%, 0% 0%, 0% 100%, 60% 90%); }
          50% { clip-path: polygon(100% 50%, 55% 30%, 0% 0%, 0% 100%, 55% 70%); }
        }
        .pacman-body { animation: pacmanMouth 0.35s ease-in-out infinite; }
        .one-liner-section p { opacity: 0; transform: translateY(40px); }
        .one-liner-section.in-view p { opacity: 1; transform: translateY(0); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.22,1,0.36,1); }
        .svg-underline path { stroke-dashoffset: var(--path-length); transition: stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1); }
        .svg-underline.drawn path { stroke-dashoffset: 0; }
        .svg-circle ellipse { stroke-dashoffset: var(--path-length); transition: stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s; }
        .svg-circle.drawn ellipse { stroke-dashoffset: 0; }
      `}</style>

      {/* ═══ SCROLL PAC-MAN — classic pac-man eating dots along S-curve ═══ */}
      {/* Classic pac-man: big, background layer, eating dots */}
      <div ref={pacmanRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 3,
        width: "80px", height: "80px", pointerEvents: "none",
        opacity: 0, transition: "opacity 0.4s",
        transform: "translate(-50%, -50%)",
      }}>
        {/* Classic pac-man circle with animated mouth */}
        <div className="pacman-body" style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: B.orange,
          filter: `drop-shadow(0 0 20px ${B.orange}40)`,
        }} />
      </div>
      {/* The S-curve path — visible as a dotted trail */}
      <svg className="pacman-trail-svg" style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 2,
      }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Dotted trail path — the dots pac-man eats */}
        <path
          ref={pacmanPathRef}
          d="M 85 1 C 85 12, 15 18, 15 32 S 85 42, 85 52 S 15 62, 15 72 S 85 82, 50 99"
          fill="none"
          stroke={`${B.orange}20`}
          strokeWidth="0.15"
          strokeDasharray="0.5 1.2"
          strokeLinecap="round"
        />
      </svg>

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
              {/* Hero Logo Mark */}
              <div style={{ marginBottom: "24px" }}>
                <svg viewBox="0 0 100 155" width="64" height="100" style={{ filter: `drop-shadow(0 0 30px ${B.orange}35)` }}>
                  <path d="M 42 45 L 42 75 A 30 30 0 1 1 72 45 Z" fill={B.orange} />
                  <path d="M 58 110 L 58 80 A 30 30 0 1 1 28 110 Z" fill={B.orange} />
                </svg>
              </div>
              <h1 style={{ fontSize: "clamp(60px,12vw,160px)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .85, margin: 0 }}>
                BROKS<br/>VISION
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
            {[{ num: 33, suffix: "", label: "Years" }, { num: 150, suffix: "+", label: "Projects" }, { num: 25, suffix: "", label: "Experts" }, { num: 98, suffix: "%", label: "Retention" }].map((s) => (
              <div key={s.label} className="stat-item" style={{ textAlign: "center", opacity: 0 }}>
                <div className="stat-number" data-target={s.num} data-suffix={s.suffix} style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-.03em", color: B.orange }}>0{s.suffix}</div>
                <div style={{ fontSize: "12px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginTop: "8px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VISION ONE-LINER ═══ */}
      <section style={{
        height: "80svh", display: "flex", alignItems: "center", justifyContent: "center",
        background: B.black, position: "relative", overflow: "hidden", padding: "0 clamp(24px,8vw,120px)",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ textAlign: "center", position: "relative", zIndex: 2, maxWidth: "900px" }}>
          <div style={{ fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: B.orange, fontWeight: 600, marginBottom: "24px" }}>Our Vision</div>
          <p style={{ fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.25, color: B.white }}>
            To be the agency clients trust with confidence — for campaigns that spark word of mouth, deliver results, and speak louder than any promotion.
          </p>
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

      {/* ═══ CHAPTERS + ONE-LINERS ═══ */}
      <div id="services">
        {chapters.map((ch, i) => (
          <div key={ch.num}>
            <section ref={(el) => { chapterRefs.current[i] = el; }} style={{ height: "200svh", position: "relative" }}>
              <div ref={(el) => { chapterStickyRefs.current[i] = el; }} style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: ch.bg, willChange: "clip-path,transform", clipPath: "inset(8% round 40px)" }}>
                {/* Dot pattern overlay */}
                <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: `radial-gradient(circle at 50% 50%,${ch.accent}50 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />

                {/* ─── Floating decorative shapes ─── */}
                {/* Large circle outline */}
                <div style={{ position: "absolute", top: "8%", right: "6%", width: "clamp(120px,18vw,240px)", height: "clamp(120px,18vw,240px)", borderRadius: "50%", border: `2px solid ${ch.accent}12`, pointerEvents: "none" }} />
                {/* Filled soft circle */}
                <div style={{ position: "absolute", bottom: "15%", left: "4%", width: "clamp(80px,12vw,160px)", height: "clamp(80px,12vw,160px)", borderRadius: "50%", background: `radial-gradient(circle, ${ch.accent}08, transparent 70%)`, pointerEvents: "none" }} />
                {/* Vertical accent line */}
                <div style={{ position: "absolute", top: "20%", right: "18%", width: "2px", height: "clamp(100px,15vh,200px)", background: `linear-gradient(to bottom, ${ch.accent}15, transparent)`, pointerEvents: "none" }} />
                {/* Horizontal accent line */}
                <div style={{ position: "absolute", bottom: "30%", left: "8%", width: "clamp(60px,10vw,120px)", height: "2px", background: `linear-gradient(to right, ${ch.accent}15, transparent)`, pointerEvents: "none" }} />
                {/* Small decorative dot cluster */}
                <div style={{ position: "absolute", top: "65%", right: "10%", display: "flex", gap: "8px", pointerEvents: "none" }}>
                  {[8, 6, 4].map((s, di) => (
                    <div key={di} style={{ width: s, height: s, borderRadius: "50%", background: `${ch.accent}${15 - di * 4}`, filter: `blur(${di}px)` }} />
                  ))}
                </div>
                {/* Pac-man logo watermark */}
                <div style={{ position: "absolute", top: "10%", left: "5%", opacity: 0.04, pointerEvents: "none" }}>
                  <svg viewBox="0 0 100 155" width="60" height="93">
                    <path d="M 42 45 L 42 75 A 30 30 0 1 1 72 45 Z" fill={ch.accent} />
                    <path d="M 58 110 L 58 80 A 30 30 0 1 1 28 110 Z" fill={ch.accent} />
                  </svg>
                </div>

                {/* ─── Content ─── */}
                <div ref={(el) => { chapterContentRefs.current[i] = el; }} style={{ position: "relative", zIndex: 2, padding: "0 clamp(24px,8vw,128px)", maxWidth: "1000px", width: "100%" }}>
                  <div ref={(el) => { chapterNumRefs.current[i] = el; }} style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "8px 20px", borderRadius: "100px", background: `${ch.accent}15`, border: `1px solid ${ch.accent}25`, marginBottom: "32px", opacity: 0 }}>
                    <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: ch.accent, color: ch.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900 }}>{ch.num}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: ch.accent }}>{ch.label}</span>
                  </div>
                  <div ref={(el) => { chapterHeadRefs.current[i] = el; }} style={{ fontSize: "clamp(40px,8vw,100px)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .95, color: ch.accent, marginBottom: "24px" }}>
                    {ch.title.split(" ").map((w, wi) => {
                      const isUnderlined = w === ch.underlineWord;
                      const isCircled = w === ch.circleWord;
                      return (
                        <span key={wi} className="ch-word" style={{ opacity: 0, marginRight: ".25em", position: "relative", display: "inline-block" }}>
                          {w}
                          {isUnderlined && (
                            <svg className="svg-underline" style={{ position: "absolute", bottom: "-5%", left: "-5%", width: "110%", height: "20%", overflow: "visible", pointerEvents: "none" }} viewBox="0 0 200 20" preserveAspectRatio="none">
                              <path d="M 5 12 Q 40 4, 80 13 T 195 10" fill="none" stroke={ch.accent} strokeWidth="4" strokeLinecap="round" style={{ strokeDasharray: 210, strokeDashoffset: 210, ["--path-length" as string]: 210 }} />
                            </svg>
                          )}
                          {isCircled && (
                            <svg className="svg-circle" style={{ position: "absolute", top: "-15%", left: "-10%", width: "120%", height: "130%", overflow: "visible", pointerEvents: "none" }} viewBox="0 0 200 100" preserveAspectRatio="none">
                              <ellipse cx="100" cy="50" rx="95" ry="42" fill="none" stroke={ch.accent} strokeWidth="3" strokeLinecap="round" style={{ strokeDasharray: 440, strokeDashoffset: 440, ["--path-length" as string]: 440 }} transform="rotate(-2 100 50)" />
                            </svg>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <p ref={(el) => { chapterDescRefs.current[i] = el; }} style={{ fontSize: "clamp(16px,1.5vw,20px)", lineHeight: 1.6, color: `${ch.accent}99`, maxWidth: "600px", opacity: 0, marginBottom: "32px" }}>{ch.desc}</p>
                  {/* Service tags */}
                  <div className="ch-tags" style={{ display: "flex", flexWrap: "wrap", gap: "8px", opacity: 0 }}>
                    {ch.tags.map((tag) => (
                      <span key={tag} style={{
                        padding: "8px 18px", borderRadius: "100px", fontSize: "12px", fontWeight: 600,
                        letterSpacing: ".08em", textTransform: "uppercase",
                        background: `${ch.accent}10`, border: `1px solid ${ch.accent}18`,
                        color: `${ch.accent}CC`,
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Large background number */}
                <div style={{ position: "absolute", right: "5%", bottom: "-5%", fontSize: "clamp(200px,30vw,400px)", fontWeight: 900, lineHeight: 1, color: `${ch.accent}05`, letterSpacing: "-.05em", pointerEvents: "none", userSelect: "none" }}>{ch.num}</div>
              </div>
            </section>

            {/* One-liner interstitial (after chapters 1, 2, 3 — not after the last) */}
            {oneLiners[i] && (
              <section className="one-liner-section" style={{
                height: "80svh", display: "flex", alignItems: "center", justifyContent: "center",
                background: B.black, position: "relative", overflow: "hidden", padding: "0 clamp(24px,8vw,120px)",
              }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${B.orange}06, transparent 60%)`, filter: "blur(80px)", pointerEvents: "none" }} />
                <p style={{
                  fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 800, letterSpacing: "-.03em",
                  lineHeight: 1.15, textAlign: "center", color: B.white, maxWidth: "800px",
                  position: "relative", zIndex: 2,
                }}>
                  <span style={{ color: B.orange }}>&ldquo;</span>
                  {oneLiners[i]}
                  <span style={{ color: B.orange }}>&rdquo;</span>
                </p>
              </section>
            )}
          </div>
        ))}
      </div>

      {/* ═══ TEAM ═══ */}
      <section style={{
        minHeight: "80svh", display: "flex", alignItems: "center", justifyContent: "center",
        background: B.black, position: "relative", overflow: "hidden", padding: "120px clamp(24px,8vw,120px)",
      }}>
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${B.blue}10, transparent 60%)`, filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: B.orange, fontWeight: 600, marginBottom: "20px" }}>Our Team</div>
              <h2 style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .9, color: B.white, marginBottom: "24px" }}>
                25 Experts.<br/><span style={{ color: "rgba(255,255,255,.4)" }}>One Mission.</span>
              </h2>
              <p style={{ fontSize: "clamp(16px,1.4vw,20px)", lineHeight: 1.6, color: "rgba(255,255,255,.45)", maxWidth: "480px" }}>
                We are 25 specialists across PR, creative, digital marketing, and emerging technologies — together driving impact as Bulgaria&apos;s largest independent communications agency.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { num: "33", label: "Years of\nExpertise", color: B.orange },
                { num: "25", label: "Team\nMembers", color: B.blue },
                { num: "150+", label: "Projects\nDelivered", color: B.orangeLight },
                { num: "98%", label: "Client\nRetention", color: B.blueLight },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)",
                  borderRadius: "20px", padding: "28px 24px", textAlign: "center",
                  backdropFilter: "blur(8px)", transition: "border-color .3s, transform .3s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${stat.color}30`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 900, color: stat.color, letterSpacing: "-.03em" }}>{stat.num}</div>
                  <div style={{ fontSize: "11px", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginTop: "8px", whiteSpace: "pre-line", lineHeight: 1.4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
