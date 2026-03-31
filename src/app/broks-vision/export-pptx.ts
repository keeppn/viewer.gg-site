import PptxGenJS from "pptxgenjs";

// ─── BRAND TOKENS ───
const BRAND = {
  orange: "EF8316",
  orangeLight: "FF9F43",
  gray: "44454A",
  blue: "2841D1",
  blueLight: "4A63E8",
  black: "0A0A0F",
  blackAlt: "111118",
  white: "FAFAFA",
  cream: "FDF9F0",
};

// Helper: hex color for pptxgenjs (no #)
function addGradientBg(slide: PptxGenJS.Slide, color1: string, color2: string) {
  slide.background = { fill: color1 };
  // Add subtle gradient overlay via shape
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    fill: {
      type: "solid",
      color: color2,
      alpha: 8,
    },
  });
}

export async function generateBroksVisionPPTX() {
  const pptx = new PptxGenJS();

  // ─── PRESENTATION SETUP ───
  pptx.author = "Broks Vision";
  pptx.company = "Broks Vision EAD";
  pptx.subject = "360 Marketing Services";
  pptx.title = "Broks Vision — 360 Marketing Services";
  pptx.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"

  // ═══════════════════════════════════════════
  // SLIDE 1: TITLE
  // ═══════════════════════════════════════════
  const slide1 = pptx.addSlide();
  slide1.background = { fill: BRAND.black };

  // Decorative gradient circle (top right)
  slide1.addShape("ellipse", {
    x: 8.5,
    y: -1.5,
    w: 6,
    h: 6,
    fill: { type: "solid", color: BRAND.orange, alpha: 15 },
  });

  // Decorative gradient circle (bottom left)
  slide1.addShape("ellipse", {
    x: -1.5,
    y: 4,
    w: 5,
    h: 5,
    fill: { type: "solid", color: BRAND.blue, alpha: 12 },
  });

  // Badge
  slide1.addShape("roundRect", {
    x: 4.4,
    y: 1.2,
    w: 4.5,
    h: 0.45,
    rectRadius: 0.25,
    fill: { type: "solid", color: "FFFFFF", alpha: 5 },
    line: { color: "FFFFFF", width: 0.5, alpha: 10 },
  });
  slide1.addText("●  360 MARKETING SERVICES", {
    x: 4.4,
    y: 1.2,
    w: 4.5,
    h: 0.45,
    fontSize: 10,
    fontFace: "Arial",
    color: "999999",
    align: "center",
    charSpacing: 3,
  });

  // BROKS
  slide1.addText("BROKS", {
    x: 0,
    y: 2.0,
    w: "100%",
    h: 1.6,
    fontSize: 96,
    fontFace: "Arial Black",
    bold: true,
    color: BRAND.white,
    align: "center",
    charSpacing: -2,
  });

  // VISION (with orange O)
  slide1.addText(
    [
      { text: "VISI", options: { color: BRAND.white, fontSize: 96, fontFace: "Arial Black", bold: true } },
      { text: "O", options: { color: BRAND.orange, fontSize: 96, fontFace: "Arial Black", bold: true } },
      { text: "N", options: { color: BRAND.white, fontSize: 96, fontFace: "Arial Black", bold: true } },
    ],
    {
      x: 0,
      y: 3.3,
      w: "100%",
      h: 1.6,
      align: "center",
      charSpacing: -2,
    }
  );

  // Gradient line
  slide1.addShape("rect", {
    x: 3.5,
    y: 4.85,
    w: 6.3,
    h: 0.04,
    fill: { type: "solid", color: BRAND.orange },
  });

  // Subtitle
  slide1.addText("We build brands that resonate, campaigns that convert,\nand experiences people remember.", {
    x: 2,
    y: 5.2,
    w: 9.3,
    h: 0.9,
    fontSize: 16,
    fontFace: "Arial",
    color: "777777",
    align: "center",
    lineSpacingMultiple: 1.4,
  });

  // Contact info
  slide1.addText("hello@broksvision.com", {
    x: 0,
    y: 6.5,
    w: "100%",
    h: 0.4,
    fontSize: 11,
    fontFace: "Arial",
    color: "555555",
    align: "center",
  });

  // ═══════════════════════════════════════════
  // SLIDE 2: ABOUT / INTRO
  // ═══════════════════════════════════════════
  const slide2 = pptx.addSlide();
  slide2.background = { fill: BRAND.black };

  // Section label
  slide2.addText("ABOUT US", {
    x: 0.8,
    y: 0.5,
    w: 3,
    h: 0.4,
    fontSize: 11,
    fontFace: "Arial",
    color: BRAND.orange,
    charSpacing: 4,
  });

  // Main text
  slide2.addText(
    "Your brand is more than a logo. It's every touchpoint, every interaction, every impression. We engineer the full 360 — so nothing falls through the cracks.",
    {
      x: 0.8,
      y: 1.2,
      w: 11,
      h: 2.5,
      fontSize: 36,
      fontFace: "Arial",
      bold: true,
      color: BRAND.white,
      lineSpacingMultiple: 1.15,
      charSpacing: -1,
    }
  );

  // Stats row
  const stats = [
    { num: "150+", label: "PROJECTS" },
    { num: "50+", label: "BRAND PARTNERS" },
    { num: "12", label: "YEARS" },
    { num: "98%", label: "RETENTION" },
  ];

  // Divider line
  slide2.addShape("rect", {
    x: 0.8,
    y: 4.5,
    w: 11.7,
    h: 0.01,
    fill: { type: "solid", color: "FFFFFF", alpha: 8 },
  });

  stats.forEach((stat, i) => {
    const xPos = 0.8 + i * 3.1;
    slide2.addText(stat.num, {
      x: xPos,
      y: 4.9,
      w: 2.8,
      h: 1,
      fontSize: 48,
      fontFace: "Arial Black",
      bold: true,
      color: BRAND.orange,
      align: "center",
      charSpacing: -1,
    });
    slide2.addText(stat.label, {
      x: xPos,
      y: 5.8,
      w: 2.8,
      h: 0.4,
      fontSize: 10,
      fontFace: "Arial",
      color: "666666",
      align: "center",
      charSpacing: 3,
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 3: 360° OVERVIEW
  // ═══════════════════════════════════════════
  const slide3 = pptx.addSlide();
  slide3.background = { fill: BRAND.black };

  // Orange glow
  slide3.addShape("ellipse", {
    x: 3.5,
    y: 0.8,
    w: 6.3,
    h: 6.3,
    fill: { type: "solid", color: BRAND.orange, alpha: 8 },
  });

  // Circle ring (simulated with ellipse outline)
  slide3.addShape("ellipse", {
    x: 4.0,
    y: 1.1,
    w: 5.3,
    h: 5.3,
    fill: { type: "solid", color: "000000", alpha: 0 },
    line: { color: "333333", width: 1.5 },
  });

  // Orange arc (partial ring — simulate with a thicker orange ellipse)
  slide3.addShape("ellipse", {
    x: 4.0,
    y: 1.1,
    w: 5.3,
    h: 5.3,
    fill: { type: "solid", color: "000000", alpha: 0 },
    line: { color: BRAND.orange, width: 2.5 },
  });

  // Center text
  slide3.addText("360°", {
    x: 0,
    y: 2.5,
    w: "100%",
    h: 1.8,
    fontSize: 80,
    fontFace: "Arial Black",
    bold: true,
    color: BRAND.white,
    align: "center",
  });

  slide3.addText("MARKETING SERVICES", {
    x: 0,
    y: 4.1,
    w: "100%",
    h: 0.5,
    fontSize: 14,
    fontFace: "Arial",
    color: "777777",
    align: "center",
    charSpacing: 4,
  });

  // Service labels around the circle
  const circleLabels = [
    { text: "CREATIVE", x: 2.0, y: 2.2 },
    { text: "PR", x: 10.2, y: 2.2 },
    { text: "DIGITAL", x: 2.0, y: 5.0 },
    { text: "BTL", x: 10.2, y: 5.0 },
  ];
  circleLabels.forEach((lbl) => {
    slide3.addShape("roundRect", {
      x: lbl.x,
      y: lbl.y,
      w: 1.6,
      h: 0.45,
      rectRadius: 0.25,
      fill: { type: "solid", color: "FFFFFF", alpha: 5 },
      line: { color: "FFFFFF", width: 0.5, alpha: 12 },
    });
    slide3.addText(lbl.text, {
      x: lbl.x,
      y: lbl.y,
      w: 1.6,
      h: 0.45,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: BRAND.orange,
      align: "center",
      charSpacing: 2,
    });
  });

  // ═══════════════════════════════════════════
  // SLIDES 4-7: SERVICE CHAPTERS
  // ═══════════════════════════════════════════
  const chapters = [
    {
      num: "01",
      label: "Creative",
      title: "Ideas That\nIgnite",
      desc: "From bold campaign concepts to scroll-stopping visuals — we craft creative that doesn't just get seen, it gets remembered. Every asset is designed to amplify your brand's voice across every touchpoint.",
      bullets: [
        "Campaign concepting & art direction",
        "Visual identity & brand assets",
        "Motion graphics & video production",
        "Print & digital design",
        "Packaging & environmental design",
      ],
      bg: BRAND.orange,
      accent: BRAND.black,
      accentLight: "4D3500",
    },
    {
      num: "02",
      label: "PR & Communications",
      title: "Stories That\nSpread",
      desc: "Strategic media relations, crisis management, and narrative building that positions your brand where it matters. We turn company milestones into industry headlines and brand values into public trust.",
      bullets: [
        "Media relations & press outreach",
        "Crisis communication strategy",
        "Corporate narrative & messaging",
        "Influencer partnerships",
        "Event PR & launch campaigns",
      ],
      bg: BRAND.blue,
      accent: BRAND.white,
      accentLight: "BBBBDD",
    },
    {
      num: "03",
      label: "Digital",
      title: "Performance\nEngineered",
      desc: "Data-driven campaigns across search, social, and programmatic channels. Every impression tracked, every conversion optimized, every dollar working harder than the last.",
      bullets: [
        "Paid search & social advertising",
        "Programmatic & display campaigns",
        "SEO & content marketing",
        "Email automation & CRM",
        "Real-time analytics dashboards",
      ],
      bg: BRAND.black,
      accent: BRAND.orange,
      accentLight: "7A4510",
    },
    {
      num: "04",
      label: "BTL & Activations",
      title: "Experiences\nThat Move",
      desc: "Below-the-line activations that create genuine human connections. Experiential events, guerrilla campaigns, and on-ground executions that transform passive audiences into active brand advocates.",
      bullets: [
        "Experiential events & pop-ups",
        "Guerrilla & ambient marketing",
        "Product sampling & demos",
        "Trade shows & exhibitions",
        "Brand activations & sponsorships",
      ],
      bg: BRAND.gray,
      accent: BRAND.cream,
      accentLight: "999995",
    },
  ];

  chapters.forEach((ch) => {
    const slide = pptx.addSlide();
    slide.background = { fill: ch.bg };

    // Subtle dot pattern overlay
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      fill: { type: "solid", color: ch.accent, alpha: 2 },
    });

    // Large background number
    slide.addText(ch.num, {
      x: 7,
      y: 3.5,
      w: 7,
      h: 5,
      fontSize: 250,
      fontFace: "Arial Black",
      bold: true,
      color: ch.accent,
      align: "right",
      valign: "bottom",
      transparency: 94,
    });

    // Chapter number pill
    slide.addShape("roundRect", {
      x: 0.8,
      y: 0.6,
      w: 3.2,
      h: 0.55,
      rectRadius: 0.3,
      fill: { type: "solid", color: ch.accent, alpha: 10 },
      line: { color: ch.accent, width: 0.5, alpha: 15 },
    });

    // Number circle
    slide.addShape("ellipse", {
      x: 0.9,
      y: 0.67,
      w: 0.4,
      h: 0.4,
      fill: { type: "solid", color: ch.accent },
    });
    slide.addText(ch.num, {
      x: 0.9,
      y: 0.67,
      w: 0.4,
      h: 0.4,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: ch.bg,
      align: "center",
      valign: "middle",
    });

    // Label
    slide.addText(ch.label.toUpperCase(), {
      x: 1.45,
      y: 0.6,
      w: 2.5,
      h: 0.55,
      fontSize: 11,
      fontFace: "Arial",
      bold: true,
      color: ch.accent,
      valign: "middle",
      charSpacing: 2,
    });

    // Title
    slide.addText(ch.title, {
      x: 0.8,
      y: 1.5,
      w: 8,
      h: 2.8,
      fontSize: 64,
      fontFace: "Arial Black",
      bold: true,
      color: ch.accent,
      lineSpacingMultiple: 0.95,
      charSpacing: -2,
    });

    // Description
    slide.addText(ch.desc, {
      x: 0.8,
      y: 4.4,
      w: 6,
      h: 1.2,
      fontSize: 14,
      fontFace: "Arial",
      color: ch.accentLight,
      lineSpacingMultiple: 1.5,
    });

    // Bullet points (right side)
    slide.addText("KEY CAPABILITIES", {
      x: 8.2,
      y: 1.5,
      w: 4.5,
      h: 0.4,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: ch.accent,
      charSpacing: 3,
      transparency: 40,
    });

    ch.bullets.forEach((bullet, bi) => {
      // Bullet dot
      slide.addShape("ellipse", {
        x: 8.2,
        y: 2.2 + bi * 0.65,
        w: 0.12,
        h: 0.12,
        fill: { type: "solid", color: ch.accent, alpha: 40 },
      });
      slide.addText(bullet, {
        x: 8.55,
        y: 2.05 + bi * 0.65,
        w: 4,
        h: 0.45,
        fontSize: 13,
        fontFace: "Arial",
        color: ch.accent,
        transparency: 30,
        valign: "middle",
      });
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 8: WHY BROKS VISION
  // ═══════════════════════════════════════════
  const slide8 = pptx.addSlide();
  slide8.background = { fill: BRAND.black };

  slide8.addText("WHY BROKS VISION", {
    x: 0.8,
    y: 0.5,
    w: 5,
    h: 0.4,
    fontSize: 11,
    fontFace: "Arial",
    color: BRAND.orange,
    charSpacing: 4,
  });

  slide8.addText("Built on Quality.\nDriven by Trust.\nPowered by Innovation.", {
    x: 0.8,
    y: 1.2,
    w: 11,
    h: 3,
    fontSize: 48,
    fontFace: "Arial Black",
    bold: true,
    color: BRAND.white,
    lineSpacingMultiple: 1.1,
    charSpacing: -1,
  });

  const values = [
    { title: "Quality", desc: "Every detail matters. We obsess over craft so your audience doesn't question your credibility." },
    { title: "Trust", desc: "Transparent processes, honest reporting, and partnerships built on mutual respect." },
    { title: "Innovation", desc: "We don't follow trends — we identify them early and help you lead the conversation." },
    { title: "Professionalism", desc: "Deadlines met. Budgets respected. Communication clear. Every single time." },
  ];

  values.forEach((val, i) => {
    const xPos = 0.8 + i * 3.1;

    // Card background
    slide8.addShape("roundRect", {
      x: xPos,
      y: 4.6,
      w: 2.8,
      h: 2.4,
      rectRadius: 0.15,
      fill: { type: "solid", color: "FFFFFF", alpha: 3 },
      line: { color: "FFFFFF", width: 0.5, alpha: 6 },
    });

    // Number
    slide8.addText(String(i + 1).padStart(2, "0"), {
      x: xPos + 0.15,
      y: 4.75,
      w: 1,
      h: 0.35,
      fontSize: 10,
      fontFace: "Arial",
      color: "444444",
    });

    // Title
    slide8.addText(val.title, {
      x: xPos + 0.15,
      y: 5.15,
      w: 2.5,
      h: 0.45,
      fontSize: 18,
      fontFace: "Arial",
      bold: true,
      color: BRAND.white,
    });

    // Description
    slide8.addText(val.desc, {
      x: xPos + 0.15,
      y: 5.6,
      w: 2.5,
      h: 1.2,
      fontSize: 10,
      fontFace: "Arial",
      color: "777777",
      lineSpacingMultiple: 1.4,
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 9: CONTACT / CTA
  // ═══════════════════════════════════════════
  const slide9 = pptx.addSlide();
  slide9.background = { fill: BRAND.black };

  // Gradient glow
  slide9.addShape("ellipse", {
    x: 3,
    y: 1,
    w: 7.3,
    h: 5.5,
    fill: { type: "solid", color: BRAND.orange, alpha: 6 },
  });

  slide9.addText("LET'S CREATE TOGETHER", {
    x: 0,
    y: 1.5,
    w: "100%",
    h: 0.4,
    fontSize: 11,
    fontFace: "Arial",
    color: BRAND.orange,
    align: "center",
    charSpacing: 4,
  });

  slide9.addText("Ready to Build\nSomething Great?", {
    x: 0,
    y: 2.2,
    w: "100%",
    h: 2.5,
    fontSize: 64,
    fontFace: "Arial Black",
    bold: true,
    color: BRAND.white,
    align: "center",
    lineSpacingMultiple: 0.95,
    charSpacing: -2,
  });

  slide9.addText("Whether you need a full rebrand or a targeted campaign,\nwe're ready to make it happen.", {
    x: 2.5,
    y: 4.5,
    w: 8.3,
    h: 0.8,
    fontSize: 16,
    fontFace: "Arial",
    color: "666666",
    align: "center",
    lineSpacingMultiple: 1.4,
  });

  // CTA button
  slide9.addShape("roundRect", {
    x: 4.8,
    y: 5.6,
    w: 3.7,
    h: 0.7,
    rectRadius: 0.35,
    fill: { type: "solid", color: BRAND.orange },
    shadow: { type: "outer", blur: 20, color: BRAND.orange, opacity: 0.3, offset: 0 },
  });
  slide9.addText("hello@broksvision.com  →", {
    x: 4.8,
    y: 5.6,
    w: 3.7,
    h: 0.7,
    fontSize: 14,
    fontFace: "Arial",
    bold: true,
    color: BRAND.black,
    align: "center",
    valign: "middle",
  });

  // Footer
  slide9.addText("© 2026 Broks Vision  |  360 Marketing Services", {
    x: 0,
    y: 6.8,
    w: "100%",
    h: 0.35,
    fontSize: 9,
    fontFace: "Arial",
    color: "444444",
    align: "center",
  });

  // ─── GENERATE & DOWNLOAD ───
  const fileName = "Broks_Vision_360_Marketing_Services.pptx";
  await pptx.writeFile({ fileName });
  return fileName;
}
