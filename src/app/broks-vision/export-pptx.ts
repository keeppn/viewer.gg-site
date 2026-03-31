import PptxGenJS from "pptxgenjs";

// ─── BRAND TOKENS (no # prefix for pptxgenjs) ───
const C = {
  orange: "EF8316",
  orangeLight: "FF9F43",
  gray: "44454A",
  blue: "2841D1",
  blueLight: "4A63E8",
  black: "0A0A0F",
  white: "FAFAFA",
  cream: "FDF9F0",
};

// ─── CONTRAST-SAFE TEXT COLORS FOR EACH CHAPTER ───
// Each chapter explicitly defines all text colors tested for readability
const CHAPTERS = [
  {
    num: "01",
    label: "Creative",
    title: "Ideas That\nIgnite",
    desc: "From campaign concepts to brand identity systems, we design every visual and verbal element of your brand — motion graphics, POSM production, space branding, and video content, all crafted under one roof.",
    bullets: [
      "Campaign Design & Art Direction",
      "Brand Identity & Visual Systems",
      "Motion Graphics & Video Production",
      "POSM & Spatial Branding",
      "Copywriting & Verbal Identity",
    ],
    // Orange bg → dark text
    bg: C.orange,
    titleColor: C.black,
    labelColor: C.black,
    descColor: "3D2200",     // Very dark brown — readable on orange
    bulletColor: "1A1A1A",   // Near-black
    bulletDotColor: C.black,
    pillBg: "00000015",
    pillBorder: C.black,
    numCircleBg: C.black,
    numCircleText: C.orange,
    bgNumberColor: C.black,
    capHeaderColor: "2A1500", // Dark brown
  },
  {
    num: "02",
    label: "PR & Communications",
    title: "Stories That\nSpread",
    desc: "Strategic media relations, crisis management, and reputation building across earned, owned, and shared channels. We turn company milestones into industry headlines — backed by 33 years of journalist relationships.",
    bullets: [
      "Media Relations & Press Distribution",
      "Crisis Communication & Response",
      "Corporate & Executive Communications",
      "Influencer Strategy & Management",
      "Digital PR & Online Reputation",
    ],
    // Blue bg → white/light text
    bg: C.blue,
    titleColor: C.white,
    labelColor: C.white,
    descColor: "C0C0DD",     // Light lavender — readable on blue
    bulletColor: "D8D8EE",   // Light
    bulletDotColor: C.white,
    pillBg: "FFFFFF10",
    pillBorder: "FFFFFF",
    numCircleBg: C.white,
    numCircleText: C.blue,
    bgNumberColor: C.white,
    capHeaderColor: "9090BB",
  },
  {
    num: "03",
    label: "Digital",
    title: "Performance\nEngineered",
    desc: "Full-funnel performance across Google, Meta, TikTok, and LinkedIn. We pair data-driven PPC and SEO with AI-powered content, generative engine optimization, and real-time analytics.",
    bullets: [
      "PPC & Paid Social Advertising",
      "SEO & Technical Optimization",
      "AI-Powered Marketing & GEO",
      "Social Media Management",
      "Data Analysis & Conversion Optimization",
    ],
    // Black bg → orange/white text
    bg: C.black,
    titleColor: C.orange,
    labelColor: C.orange,
    descColor: "999999",     // Medium gray — readable on near-black
    bulletColor: "AAAAAA",   // Light gray
    bulletDotColor: C.orange,
    pillBg: "EF831615",
    pillBorder: C.orange,
    numCircleBg: C.orange,
    numCircleText: C.black,
    bgNumberColor: "1A1A25",
    capHeaderColor: "666666",
  },
  {
    num: "04",
    label: "BTL & Activations",
    title: "Experiences\nThat Move",
    desc: "On-ground activations that create genuine human connections. From concept and 3D visualization through logistics and digital integration — experiential campaigns that turn audiences into advocates.",
    bullets: [
      "Event Planning & Execution",
      "Activation Design & Mechanics",
      "Promo Teams & Logistics",
      "Media Buying & Planning",
      "Experiential & Spatial Design",
    ],
    // Gray bg → cream/white text
    bg: C.gray,
    titleColor: C.cream,
    labelColor: C.cream,
    descColor: "B8B8B0",     // Light warm gray — readable on dark gray
    bulletColor: "CCCCCC",   // Light gray
    bulletDotColor: C.cream,
    pillBg: "FFFFFF10",
    pillBorder: C.cream,
    numCircleBg: C.cream,
    numCircleText: C.gray,
    bgNumberColor: "555560",
    capHeaderColor: "8E8E88",
  },
];

export async function generateBroksVisionPPTX() {
  const pptx = new PptxGenJS();

  pptx.author = "Broks Vision";
  pptx.company = "Broks Vision EAD";
  pptx.subject = "360 Marketing Services";
  pptx.title = "Broks Vision — 360 Marketing Services";
  pptx.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"

  // ═══════════════════════════════════════════
  // SLIDE 1: TITLE
  // ═══════════════════════════════════════════
  const slide1 = pptx.addSlide();
  slide1.background = { fill: C.black };

  // Decorative gradient circles
  slide1.addShape("ellipse", {
    x: 8.5, y: -1.5, w: 6, h: 6,
    fill: { type: "solid", color: C.orange, alpha: 15 },
  });
  slide1.addShape("ellipse", {
    x: -1.5, y: 4, w: 5, h: 5,
    fill: { type: "solid", color: C.blue, alpha: 12 },
  });

  // Badge pill
  slide1.addShape("roundRect", {
    x: 4.4, y: 1.2, w: 4.5, h: 0.45,
    rectRadius: 0.25,
    fill: { type: "solid", color: "FFFFFF", alpha: 5 },
    line: { color: "FFFFFF", width: 0.5, alpha: 10 },
  });
  slide1.addText("●  360 MARKETING SERVICES", {
    x: 4.4, y: 1.2, w: 4.5, h: 0.45,
    fontSize: 10, fontFace: "Arial",
    color: "888888", align: "center", charSpacing: 3,
  });

  // BROKS
  slide1.addText("BROKS", {
    x: 0, y: 2.0, w: "100%", h: 1.6,
    fontSize: 96, fontFace: "Arial Black", bold: true,
    color: C.white, align: "center", charSpacing: -2,
  });

  // VISION with orange O
  slide1.addText(
    [
      { text: "VISI", options: { color: C.white, fontSize: 96, fontFace: "Arial Black", bold: true } },
      { text: "O", options: { color: C.orange, fontSize: 96, fontFace: "Arial Black", bold: true } },
      { text: "N", options: { color: C.white, fontSize: 96, fontFace: "Arial Black", bold: true } },
    ],
    { x: 0, y: 3.3, w: "100%", h: 1.6, align: "center", charSpacing: -2 }
  );

  // Gradient accent line
  slide1.addShape("rect", {
    x: 3.5, y: 4.85, w: 6.3, h: 0.04,
    fill: { type: "solid", color: C.orange },
  });

  // Subtitle — light gray on dark = good contrast
  slide1.addText("We build brands that resonate, campaigns that convert,\nand experiences people remember.", {
    x: 2, y: 5.2, w: 9.3, h: 0.9,
    fontSize: 16, fontFace: "Arial",
    color: "888888", align: "center", lineSpacingMultiple: 1.4,
  });

  // Contact
  slide1.addText("hello@broksvision.com", {
    x: 0, y: 6.5, w: "100%", h: 0.4,
    fontSize: 11, fontFace: "Arial",
    color: "666666", align: "center",
  });

  // ═══════════════════════════════════════════
  // SLIDE 2: ABOUT / INTRO
  // ═══════════════════════════════════════════
  const slide2 = pptx.addSlide();
  slide2.background = { fill: C.black };

  slide2.addText("ABOUT US", {
    x: 0.8, y: 0.5, w: 3, h: 0.4,
    fontSize: 11, fontFace: "Arial",
    color: C.orange, charSpacing: 4,
  });

  slide2.addText(
    "Your brand is more than a logo. It's every touchpoint, every interaction, every impression. We engineer the full 360 — so nothing falls through the cracks.",
    {
      x: 0.8, y: 1.2, w: 11, h: 2.5,
      fontSize: 36, fontFace: "Arial", bold: true,
      color: C.white, lineSpacingMultiple: 1.15, charSpacing: -1,
    }
  );

  // Divider
  slide2.addShape("rect", {
    x: 0.8, y: 4.5, w: 11.7, h: 0.015,
    fill: { type: "solid", color: "333333" },
  });

  // Stats — orange numbers on dark bg = good contrast
  const stats = [
    { num: "150+", label: "PROJECTS" },
    { num: "50+", label: "BRAND PARTNERS" },
    { num: "12", label: "YEARS" },
    { num: "98%", label: "RETENTION" },
  ];
  stats.forEach((stat, i) => {
    const xPos = 0.8 + i * 3.1;
    slide2.addText(stat.num, {
      x: xPos, y: 4.9, w: 2.8, h: 1,
      fontSize: 48, fontFace: "Arial Black", bold: true,
      color: C.orange, align: "center", charSpacing: -1,
    });
    slide2.addText(stat.label, {
      x: xPos, y: 5.8, w: 2.8, h: 0.4,
      fontSize: 10, fontFace: "Arial",
      color: "777777", align: "center", charSpacing: 3,
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 3: 360° OVERVIEW
  // ═══════════════════════════════════════════
  const slide3 = pptx.addSlide();
  slide3.background = { fill: C.black };

  // Orange glow
  slide3.addShape("ellipse", {
    x: 3.5, y: 0.8, w: 6.3, h: 6.3,
    fill: { type: "solid", color: C.orange, alpha: 8 },
  });

  // Circle rings
  slide3.addShape("ellipse", {
    x: 4.0, y: 1.1, w: 5.3, h: 5.3,
    fill: { type: "solid", color: "000000", alpha: 0 },
    line: { color: "333333", width: 1.5 },
  });
  slide3.addShape("ellipse", {
    x: 4.0, y: 1.1, w: 5.3, h: 5.3,
    fill: { type: "solid", color: "000000", alpha: 0 },
    line: { color: C.orange, width: 2.5 },
  });

  // Center text — white on dark = good
  slide3.addText("360°", {
    x: 0, y: 2.5, w: "100%", h: 1.8,
    fontSize: 80, fontFace: "Arial Black", bold: true,
    color: C.white, align: "center",
  });
  slide3.addText("MARKETING SERVICES", {
    x: 0, y: 4.1, w: "100%", h: 0.5,
    fontSize: 14, fontFace: "Arial",
    color: "888888", align: "center", charSpacing: 4,
  });

  // Service labels around circle — orange on dark pills
  const circleLabels = [
    { text: "CREATIVE", x: 2.0, y: 2.2 },
    { text: "PR", x: 10.2, y: 2.2 },
    { text: "DIGITAL", x: 2.0, y: 5.0 },
    { text: "BTL", x: 10.2, y: 5.0 },
  ];
  circleLabels.forEach((lbl) => {
    slide3.addShape("roundRect", {
      x: lbl.x, y: lbl.y, w: 1.6, h: 0.45,
      rectRadius: 0.25,
      fill: { type: "solid", color: "1A1A25" },
      line: { color: "333333", width: 0.5 },
    });
    slide3.addText(lbl.text, {
      x: lbl.x, y: lbl.y, w: 1.6, h: 0.45,
      fontSize: 10, fontFace: "Arial", bold: true,
      color: C.orange, align: "center", charSpacing: 2,
    });
  });

  // ═══════════════════════════════════════════
  // SLIDES 4-7: SERVICE CHAPTERS
  // Each uses explicit, contrast-tested colors
  // ═══════════════════════════════════════════
  CHAPTERS.forEach((ch) => {
    const slide = pptx.addSlide();
    slide.background = { fill: ch.bg };

    // Large background number (very subtle)
    slide.addText(ch.num, {
      x: 7, y: 3.5, w: 7, h: 5,
      fontSize: 250, fontFace: "Arial Black", bold: true,
      color: ch.bgNumberColor, align: "right", valign: "bottom",
    });

    // Chapter number pill
    slide.addShape("roundRect", {
      x: 0.8, y: 0.6, w: 3.2, h: 0.55,
      rectRadius: 0.3,
      fill: { type: "solid", color: ch.numCircleBg, alpha: 12 },
      line: { color: ch.pillBorder, width: 0.5, alpha: 25 },
    });

    // Number circle
    slide.addShape("ellipse", {
      x: 0.9, y: 0.67, w: 0.4, h: 0.4,
      fill: { type: "solid", color: ch.numCircleBg },
    });
    slide.addText(ch.num, {
      x: 0.9, y: 0.67, w: 0.4, h: 0.4,
      fontSize: 10, fontFace: "Arial", bold: true,
      color: ch.numCircleText, align: "center", valign: "middle",
    });

    // Label text in pill
    slide.addText(ch.label.toUpperCase(), {
      x: 1.45, y: 0.6, w: 2.5, h: 0.55,
      fontSize: 11, fontFace: "Arial", bold: true,
      color: ch.labelColor, valign: "middle", charSpacing: 2,
    });

    // Title — large, high contrast
    slide.addText(ch.title, {
      x: 0.8, y: 1.5, w: 8, h: 2.8,
      fontSize: 64, fontFace: "Arial Black", bold: true,
      color: ch.titleColor, lineSpacingMultiple: 0.95, charSpacing: -2,
    });

    // Description — carefully chosen for readability
    slide.addText(ch.desc, {
      x: 0.8, y: 4.4, w: 6, h: 1.2,
      fontSize: 14, fontFace: "Arial",
      color: ch.descColor, lineSpacingMultiple: 1.5,
    });

    // Key capabilities header
    slide.addText("KEY CAPABILITIES", {
      x: 8.2, y: 1.5, w: 4.5, h: 0.4,
      fontSize: 10, fontFace: "Arial", bold: true,
      color: ch.capHeaderColor, charSpacing: 3,
    });

    // Bullet points — fully opaque, readable colors
    ch.bullets.forEach((bullet, bi) => {
      slide.addShape("ellipse", {
        x: 8.2, y: 2.2 + bi * 0.65, w: 0.12, h: 0.12,
        fill: { type: "solid", color: ch.bulletDotColor },
      });
      slide.addText(bullet, {
        x: 8.55, y: 2.05 + bi * 0.65, w: 4, h: 0.45,
        fontSize: 13, fontFace: "Arial",
        color: ch.bulletColor, valign: "middle",
      });
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 8: WHY BROKS VISION
  // ═══════════════════════════════════════════
  const slide8 = pptx.addSlide();
  slide8.background = { fill: C.black };

  slide8.addText("WHY BROKS VISION", {
    x: 0.8, y: 0.5, w: 5, h: 0.4,
    fontSize: 11, fontFace: "Arial",
    color: C.orange, charSpacing: 4,
  });

  slide8.addText("Built on Quality.\nDriven by Trust.\nPowered by Innovation.", {
    x: 0.8, y: 1.2, w: 11, h: 3,
    fontSize: 48, fontFace: "Arial Black", bold: true,
    color: C.white, lineSpacingMultiple: 1.1, charSpacing: -1,
  });

  const values = [
    { title: "Quality", desc: "Every detail matters. We obsess over craft so your audience doesn't question your credibility." },
    { title: "Trust", desc: "Transparent processes, honest reporting, and partnerships built on mutual respect." },
    { title: "Innovation", desc: "We don't follow trends — we identify them early and help you lead the conversation." },
    { title: "Professionalism", desc: "Deadlines met. Budgets respected. Communication clear. Every single time." },
  ];

  values.forEach((val, i) => {
    const xPos = 0.8 + i * 3.1;

    // Card bg — subtle dark card on black
    slide8.addShape("roundRect", {
      x: xPos, y: 4.6, w: 2.8, h: 2.4,
      rectRadius: 0.15,
      fill: { type: "solid", color: "1A1A25" },
      line: { color: "2A2A35", width: 0.75 },
    });

    // Number — dim gray on dark card
    slide8.addText(String(i + 1).padStart(2, "0"), {
      x: xPos + 0.15, y: 4.75, w: 1, h: 0.35,
      fontSize: 10, fontFace: "Arial",
      color: "555555",
    });

    // Title — white on dark card = great contrast
    slide8.addText(val.title, {
      x: xPos + 0.15, y: 5.15, w: 2.5, h: 0.45,
      fontSize: 18, fontFace: "Arial", bold: true,
      color: C.white,
    });

    // Desc — medium gray on dark card = readable
    slide8.addText(val.desc, {
      x: xPos + 0.15, y: 5.6, w: 2.5, h: 1.2,
      fontSize: 10, fontFace: "Arial",
      color: "999999", lineSpacingMultiple: 1.4,
    });

    // Bottom accent line on each card
    slide8.addShape("rect", {
      x: xPos, y: 6.97, w: 2.8, h: 0.03,
      fill: { type: "solid", color: i === 0 ? C.orange : i === 1 ? C.blue : i === 2 ? C.orange : C.gray },
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 9: CONTACT / CTA
  // ═══════════════════════════════════════════
  const slide9 = pptx.addSlide();
  slide9.background = { fill: C.black };

  // Glow
  slide9.addShape("ellipse", {
    x: 3, y: 1, w: 7.3, h: 5.5,
    fill: { type: "solid", color: C.orange, alpha: 6 },
  });

  slide9.addText("LET'S CREATE TOGETHER", {
    x: 0, y: 1.5, w: "100%", h: 0.4,
    fontSize: 11, fontFace: "Arial",
    color: C.orange, align: "center", charSpacing: 4,
  });

  slide9.addText("Ready to Build\nSomething Great?", {
    x: 0, y: 2.2, w: "100%", h: 2.5,
    fontSize: 64, fontFace: "Arial Black", bold: true,
    color: C.white, align: "center", lineSpacingMultiple: 0.95, charSpacing: -2,
  });

  slide9.addText("Whether you need a full rebrand or a targeted campaign,\nwe're ready to make it happen.", {
    x: 2.5, y: 4.5, w: 8.3, h: 0.8,
    fontSize: 16, fontFace: "Arial",
    color: "888888", align: "center", lineSpacingMultiple: 1.4,
  });

  // CTA button — orange pill, dark text
  slide9.addShape("roundRect", {
    x: 4.8, y: 5.6, w: 3.7, h: 0.7,
    rectRadius: 0.35,
    fill: { type: "solid", color: C.orange },
    shadow: { type: "outer", blur: 20, color: C.orange, opacity: 0.3, offset: 0 },
  });
  slide9.addText("hello@broksvision.com  →", {
    x: 4.8, y: 5.6, w: 3.7, h: 0.7,
    fontSize: 14, fontFace: "Arial", bold: true,
    color: C.black, align: "center", valign: "middle",
  });

  // Footer
  slide9.addText("© 2026 Broks Vision  |  360 Marketing Services", {
    x: 0, y: 6.8, w: "100%", h: 0.35,
    fontSize: 9, fontFace: "Arial",
    color: "555555", align: "center",
  });

  // ─── GENERATE & DOWNLOAD ───
  const fileName = "Broks_Vision_360_Marketing_Services.pptx";
  await pptx.writeFile({ fileName });
  return fileName;
}
