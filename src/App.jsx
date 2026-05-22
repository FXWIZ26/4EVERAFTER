import { useState, useRef, useCallback } from "react";

// ── Brand Colors ─────────────────────────────────────────────────────
const G = {
  gold: "#C9941A",
  goldLight: "#F5C842",
  goldDark: "#8B6310",
  goldDeep: "#5C3D08",
  black: "#000000",
  nearBlack: "#0a0800",
  darkBrown: "#1a0d00",
  cream: "#FDF8F0",
  parchment: "#F5EDD8",
  charcoal: "#1a1a1a",
  gray: "#888",
  lightGray: "#ddd",
  formBg: "rgba(15,8,0,0.85)",
  inputBg: "rgba(30,15,0,0.9)",
  inputBorder: "rgba(201,148,26,0.4)",
};

// ── Background Themes ────────────────────────────────────────────────
const BASE = "https://4everafter.cloud/wp-content/uploads/2026/base-options";
const backgrounds = [
  { id: "floral",    label: "Soft Florals",     icon: "🌸", image: `${BASE}/soft-floral-life-story-base.jpg`,            paperBg: "rgba(253,246,240,0.93)" },
  { id: "autumn",   label: "Autumn Leaves",     icon: "🍂", image: `${BASE}/autumn-leaves-life-story-base.jpg`,          paperBg: "rgba(253,248,242,0.93)" },
  { id: "ocean",    label: "Ocean & Coast",     icon: "🌊", image: `${BASE}/ocean-coast-life-story-obit-base.jpg`,       paperBg: "rgba(244,250,253,0.93)" },
  { id: "faith",    label: "Faith & Grace",     icon: "✝",  image: `${BASE}/faith-and-grace-lifestory-obit-base.jpg`,   paperBg: "rgba(250,247,242,0.93)" },
  { id: "military", label: "Military Honor",    icon: "🎖", image: `${BASE}/military-honor-life-story-obit-base.jpg`,   paperBg: "rgba(244,247,250,0.93)" },
  { id: "garden",   label: "Garden & Nature",   icon: "🌿", image: `${BASE}/garden-nature-life-story-base.jpg`,         paperBg: "rgba(244,250,242,0.93)" },
  { id: "linen",    label: "Elegant Linen",     icon: "🕊", image: `${BASE}/elegant-linen-life-story-base.jpg`,         paperBg: "rgba(250,249,247,0.93)" },
  { id: "sunset",   label: "Golden Sunset",     icon: "🌅", image: `${BASE}/golden-sunset-life-story-obit-base.jpg`,    paperBg: "rgba(253,248,240,0.93)" },
  { id: "vintage",  label: "Vintage Script",    icon: "📜", image: `${BASE}/vintage-script-life-story-obit-base.jpg`,  paperBg: "rgba(250,247,239,0.93)" },
  { id: "candle",   label: "Candlelight",       icon: "🕯", image: `${BASE}/candles-life-story-obit-base.jpg`,         paperBg: "rgba(253,250,244,0.93)" },
];

// ── Tones ─────────────────────────────────────────────────────────────
const tones = [
  { id: "traditional",  label: "Traditional & Dignified", desc: "Classic, formal, timeless" },
  { id: "warm",         label: "Warm & Personal",         desc: "Intimate, heartfelt, conversational" },
  { id: "celebratory",  label: "Celebratory & Uplifting", desc: "Joyful, life-affirming, hopeful" },
  { id: "faith",        label: "Faith-Based",             desc: "Spiritual, scripturally inspired" },
  { id: "brief",        label: "Brief & Elegant",         desc: "Concise, poetic, understated" },
];

// ── Word Count Limits Per Field ───────────────────────────────────────
const WORD_LIMITS = {
  career: 40, hobbies: 30, memory: 50, missedFor: 30,
  proudest: 30, causes: 25, specialRequests: 40,
};

// ── Form Sections ─────────────────────────────────────────────────────
const sections = [
  { title: "Core Identity", icon: "✦", fields: [
    { id: "fullName",    label: "Full Legal Name",        placeholder: "e.g. Margaret Ann Williams",       required: true },
    { id: "nickname",    label: "Preferred Name / Nickname", placeholder: "e.g. Peggy" },
    { id: "dob",         label: "Date of Birth",          placeholder: "e.g. March 3, 1945",               required: true },
    { id: "dod",         label: "Date of Passing",        placeholder: "e.g. April 18, 2026",              required: true },
    { id: "birthCity",   label: "City / State of Birth",  placeholder: "e.g. Savannah, Georgia" },
    { id: "passingCity", label: "City / State of Passing",placeholder: "e.g. Atlanta, Georgia" },
  ]},
  { title: "Family & Relationships", icon: "❧", fields: [
    { id: "spouse",   label: "Spouse / Partner Name(s)",  placeholder: "e.g. Robert Williams (husband of 42 years)" },
    { id: "children", label: "Children & Grandchildren",  placeholder: "e.g. Son James, daughters Sara and Beth; grandchildren Lily and Noah" },
    { id: "siblings", label: "Surviving Siblings",        placeholder: "e.g. Brother Larry, sister Sandra" },
    { id: "preceded", label: "Preceded in Death By",      placeholder: "e.g. Parents John and Ruth Smith; brother Michael" },
    { id: "parents",  label: "Parents Names",             placeholder: "e.g. John and Ruth Smith" },
  ]},
  { title: "Life & Career", icon: "◈", fields: [
    { id: "education", label: "Education / Degrees",       placeholder: "e.g. B.S. Nursing, University of Georgia, 1967" },
    { id: "career",    label: "Career / Profession",       placeholder: "e.g. Registered Nurse for 35 years at Grady Memorial Hospital", limit: 40 },
    { id: "military",  label: "Military Service",          placeholder: "e.g. U.S. Army, 1968–1972, Vietnam veteran" },
    { id: "faith",     label: "Faith / Religious Affiliation", placeholder: "e.g. Lifelong Baptist" },
    { id: "church",    label: "Church or Congregation",    placeholder: "e.g. First Baptist Church of Atlanta" },
  ]},
  { title: "Personality & Legacy", icon: "✿", fields: [
    { id: "hobbies",      label: "Hobbies & Passions",        placeholder: "e.g. Gardening, quilting, Sunday dinners",      limit: 30 },
    { id: "personality",  label: "Personality in 3–5 Words",  placeholder: "e.g. Kind, stubborn, hilarious, generous" },
    { id: "proudest",     label: "Proudest Accomplishment",   placeholder: "e.g. Raising four children as a single mother", limit: 30 },
    { id: "quote",        label: "Favorite Quote or Saying",  placeholder: "e.g. 'Do unto others...'" },
    { id: "missedFor",    label: "What Will People Miss Most",placeholder: "e.g. Her laugh, her cooking",                   limit: 30 },
    { id: "memory",       label: "A Warm or Funny Memory",    placeholder: "e.g. She once drove four hours to bring soup to a sick friend", limit: 50 },
    { id: "causes",       label: "Causes or Charities",       placeholder: "e.g. American Cancer Society, local food bank", limit: 25 },
  ]},
  { title: "Service Details", icon: "✠", fields: [
    { id: "funeralHome",     label: "Funeral Home Name",           placeholder: "e.g. Eternal Peace Funeral Home" },
    { id: "serviceDate",     label: "Service Date, Time & Location",placeholder: "e.g. Saturday, April 26, 2026 at 2:00 PM" },
    { id: "visitation",      label: "Visitation Details",          placeholder: "e.g. Friday, April 25, 5–8 PM at the funeral home" },
    { id: "specialRequests", label: "Special Requests or Notes",   placeholder: "e.g. In lieu of flowers, donations to St. Jude's", limit: 40 },
  ]},
];

// ── Helpers ──────────────────────────────────────────────────────────
function wordCount(text) {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

// ── Styles ────────────────────────────────────────────────────────────
const labelStyle = {
  display: "block",
  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  fontSize: 12,
  fontWeight: 600,
  color: G.goldLight,
  marginBottom: 5,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
};

function inputStyle(hasWarning) {
  return {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: `1.5px solid ${hasWarning ? "#e67e00" : G.inputBorder}`,
    background: G.inputBg,
    fontFamily: "Georgia, serif",
    fontSize: 13,
    color: G.cream,
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  };
}

// ── Logo ─────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{ textAlign: "center", padding: "32px 20px 16px", background: G.black }}>
      <img
        src="https://4everafter.cloud/wp-content/uploads/2026/05/%C2%A92026-4EVERAFTER-LOGO-HDR517-scaled.png"
        alt="4EverAfter"
        style={{
          maxWidth: "clamp(260px, 65vw, 520px)",
          height: "auto",
          display: "block",
          margin: "0 auto",
          filter: "drop-shadow(0 0 30px rgba(201,148,26,0.5))",
        }}
        onError={e => { e.target.style.display = 'none'; }}
      />
      {/* Fallback text logo if image fails */}
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(32px, 7vw, 58px)",
        fontWeight: 700,
        background: "linear-gradient(135deg, #8B6310 0%, #C9941A 30%, #F5C842 50%, #C9941A 70%, #8B6310 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 0 20px rgba(245,200,66,0.4))",
        lineHeight: 1,
        display: "none",
      }}>4EverAfter™</div>
    </div>
  );
}

// ── Section Divider ───────────────────────────────────────────────────
function SectionDivider({ title, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid rgba(201,148,26,0.25)` }}>
      <span style={{ color: G.gold, fontSize: 16, lineHeight: 1 }}>{icon}</span>
      <h2 style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontSize: 15, color: G.goldLight, margin: 0, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, rgba(201,148,26,0.3), transparent)` }} />
    </div>
  );
}

// ── Field With Word Count Warning ─────────────────────────────────────
function Field({ field, value, onChange }) {
  const limit = field.limit;
  const wc = limit ? wordCount(value) : 0;
  const pct = limit ? (wc / limit) : 0;
  const hasWarning = limit && pct >= 0.8;
  const isOver = limit && wc > limit;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <label style={labelStyle}>
          {field.label}
          {field.required && <span style={{ color: G.gold, marginLeft: 4 }}>*</span>}
        </label>
        {limit && (
          <span style={{
            fontSize: 10,
            fontFamily: "Georgia, serif",
            color: isOver ? "#ff4444" : hasWarning ? "#e67e00" : G.gray,
            fontStyle: "italic",
            transition: "color 0.2s",
          }}>
            {isOver ? `⚠ ${wc - limit} words over limit` : hasWarning ? `⚠ ${wc}/${limit} words` : `${wc}/${limit} words`}
          </span>
        )}
      </div>
      <input
        style={inputStyle(hasWarning || isOver)}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={e => onChange(field.id, e.target.value)}
        onFocus={e => { e.target.style.borderColor = G.goldLight; e.target.style.boxShadow = `0 0 0 3px rgba(201,148,26,0.15)`; }}
        onBlur={e => { e.target.style.borderColor = (hasWarning || isOver) ? "#e67e00" : G.inputBorder; e.target.style.boxShadow = "none"; }}
      />
      {isOver && (
        <div style={{
          marginTop: 4,
          padding: "6px 10px",
          background: "rgba(255,68,68,0.1)",
          border: "1px solid rgba(255,68,68,0.3)",
          borderRadius: 6,
          fontSize: 11,
          color: "#ff6666",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
        }}>
          🔔 Please trim to {limit} words for best results in the final obituary
        </div>
      )}
    </div>
  );
}

// ── Background Selector ───────────────────────────────────────────────
function BackgroundSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <label style={{ ...labelStyle, marginBottom: 10 }}>
        Choose Memorial Background <span style={{ color: G.gold }}>*</span>
      </label>
      <p style={{ fontSize: 11, color: G.gray, fontStyle: "italic", margin: "0 0 12px", fontFamily: "Georgia, serif" }}>
        Select the background that best honors your loved one's spirit
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {backgrounds.map(bg => (
          <button key={bg.id} onClick={() => onChange(bg.id)} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: "100%", height: 75, borderRadius: 10, overflow: "hidden",
              border: value === bg.id ? `3px solid ${G.goldLight}` : "3px solid rgba(201,148,26,0.15)",
              boxShadow: value === bg.id ? `0 0 0 2px ${G.gold}, 0 6px 20px rgba(201,148,26,0.4)` : "0 2px 8px rgba(0,0,0,0.4)",
              transition: "all 0.2s ease", position: "relative",
              background: "rgba(30,15,0,0.5)",
            }}>
              <img src={bg.image} alt={bg.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => { e.target.style.display = "none"; }} />
              {value === bg.id && (
                <div style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: G.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#1a0d00", fontWeight: 700, boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}>✓</div>
              )}
            </div>
            <span style={{ fontSize: 9, fontFamily: "'Cormorant Garamond', serif", fontWeight: value === bg.id ? 700 : 500, color: value === bg.id ? G.goldLight : G.gray, textAlign: "center", lineHeight: 1.3, letterSpacing: "0.3px" }}>{bg.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Tone Selector ─────────────────────────────────────────────────────
function ToneSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ ...labelStyle, marginBottom: 10 }}>Select Obituary Tone <span style={{ color: G.gold }}>*</span></label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
        {tones.map(t => (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            background: value === t.id ? `linear-gradient(135deg, ${G.goldDeep}, ${G.goldDark}, ${G.gold})` : "rgba(255,255,255,0.04)",
            border: value === t.id ? `1.5px solid ${G.goldLight}` : "1.5px solid rgba(201,148,26,0.2)",
            borderRadius: 10, padding: "12px 10px", cursor: "pointer", textAlign: "left",
            transition: "all 0.2s",
            boxShadow: value === t.id ? `0 4px 20px rgba(201,148,26,0.3)` : "none",
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontWeight: 700, color: value === t.id ? G.cream : G.goldLight, marginBottom: 3, letterSpacing: "0.5px" }}>{t.label}</div>
            <div style={{ fontSize: 10, color: value === t.id ? "rgba(253,248,240,0.7)" : G.gray, fontStyle: "italic", fontFamily: "Georgia, serif" }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Photo Upload ──────────────────────────────────────────────────────
function PhotoUpload({ photos, onChange }) {
  const fileRef = useRef();
  const addPhotos = (files) => {
    const newPhotos = [...photos];
    Array.from(files).slice(0, 5 - photos.length).forEach(file => {
      const r = new FileReader();
      r.onload = ev => {
        newPhotos.push(ev.target.result);
        onChange([...newPhotos]);
      };
      r.readAsDataURL(file);
    });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ ...labelStyle, marginBottom: 8 }}>
        Photos of Loved One
        <span style={{ color: G.gray, fontWeight: 400, marginLeft: 8, textTransform: "none", fontSize: 10 }}>Up to 5 photos</span>
      </label>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={p} alt={`Photo ${i+1}`} style={{ width: 72, height: 86, objectFit: "cover", borderRadius: 8, border: `2px solid ${G.gold}`, boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }} />
            <button onClick={() => onChange(photos.filter((_, j) => j !== i))} style={{
              position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%",
              background: "#cc3333", border: "none", cursor: "pointer", color: "#fff",
              fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}>✕</button>
          </div>
        ))}
        {photos.length < 5 && (
          <div onClick={() => fileRef.current.click()} style={{
            width: 72, height: 86, border: `2px dashed rgba(201,148,26,0.4)`, borderRadius: 8,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            cursor: "pointer", background: "rgba(201,148,26,0.05)", gap: 4,
          }}>
            <span style={{ fontSize: 20 }}>📷</span>
            <span style={{ fontSize: 9, color: G.gray, fontFamily: "Georgia, serif" }}>Add Photo</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
        onChange={e => addPhotos(e.target.files)} />
      <p style={{ fontSize: 10, color: G.gray, margin: 0, fontStyle: "italic", fontFamily: "Georgia, serif" }}>
        First photo appears prominently in the memorial. Additional photos are included in the layout.
      </p>
    </div>
  );
}

// ── Editable Paragraph ────────────────────────────────────────────────
function EditableParagraph({ text, index, onEdit, onRewrite, rewriting, isMobile }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const [hovered, setHovered] = useState(false);
  const wc = wordCount(text);

  const save = () => { onEdit(index, draft); setEditing(false); };
  const cancel = () => { setDraft(text); setEditing(false); };

  return (
    <div
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 6,
        padding: isMobile ? "4px 6px 32px" : "4px 6px",
        margin: "0 -6px 12px",
        background: hovered && !editing ? "rgba(201,148,26,0.04)" : "transparent",
        transition: "background 0.2s",
      }}
    >
      {editing ? (
        <div>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} autoFocus style={{
            width: "100%", minHeight: 90, padding: "10px 12px",
            fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.85, color: G.charcoal,
            border: `2px solid ${G.gold}`, borderRadius: 8, resize: "vertical",
            outline: "none", background: "#fffdf7", boxSizing: "border-box",
          }} />
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button onClick={save} style={{
              padding: "7px 18px", background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`,
              border: "none", borderRadius: 7, cursor: "pointer",
              fontFamily: "Georgia, serif", fontSize: 12, color: "#1a0d00", fontWeight: 600,
            }}>✓ Save</button>
            <button onClick={cancel} style={{
              padding: "7px 14px", background: "transparent",
              border: `1px solid rgba(201,148,26,0.3)`, borderRadius: 7,
              cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 12, color: G.gray,
            }}>✕ Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 14, lineHeight: 1.88, color: "#2a2a2a", margin: 0, textAlign: "justify" }}>{text}</p>
          {isMobile ? (
            <div style={{ position: "absolute", bottom: 4, right: 4, display: "flex", gap: 5 }}>
              <button onClick={() => { setDraft(text); setEditing(true); }} style={{ padding: "3px 9px", fontSize: 10, borderRadius: 5, background: "rgba(253,248,240,0.95)", border: `1px solid rgba(201,148,26,0.35)`, cursor: "pointer", color: G.goldDark, fontFamily: "Georgia, serif" }}>✏️</button>
              <button onClick={() => onRewrite(index, text)} disabled={rewriting === index} style={{ padding: "3px 9px", fontSize: 10, borderRadius: 5, background: rewriting === index ? "#eee" : G.gold, border: "none", cursor: "pointer", color: "#1a0d00", fontFamily: "Georgia, serif", fontWeight: 600 }}>{rewriting === index ? "⟳" : "✦"}</button>
            </div>
          ) : (hovered && (
            <div style={{ position: "absolute", top: 2, right: 2, display: "flex", gap: 5 }}>
              <button onClick={() => { setDraft(text); setEditing(true); }} style={{ padding: "3px 10px", fontSize: 10, borderRadius: 5, background: "rgba(253,248,240,0.97)", border: `1px solid rgba(201,148,26,0.35)`, cursor: "pointer", color: G.goldDark, fontFamily: "Georgia, serif", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>✏️ Edit</button>
              <button onClick={() => onRewrite(index, text)} disabled={rewriting === index} style={{ padding: "3px 10px", fontSize: 10, borderRadius: 5, background: rewriting === index ? "#eee" : G.gold, border: "none", cursor: rewriting === index ? "not-allowed" : "pointer", color: "#1a0d00", fontFamily: "Georgia, serif", fontWeight: 600, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>{rewriting === index ? "⟳ Rewriting..." : "✦ AI Rewrite"}</button>
            </div>
          ))}
          {wc > 0 && <span style={{ position: "absolute", bottom: 2, left: 6, fontSize: 9, color: "rgba(0,0,0,0.2)", fontFamily: "Georgia, serif" }}>{wc}w</span>}
        </>
      )}
    </div>
  );
}

// ── Obituary Output ───────────────────────────────────────────────────
function ObituaryOutput({ paragraphs, setParagraphs, formData, photos, bgId, buildContext, isMobile }) {
  const [rewriting, setRewriting] = useState(null);
  const bg = backgrounds.find(b => b.id === bgId) || backgrounds[0];
  const name = formData.fullName || "Beloved";
  const totalWords = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  const wcOk = totalWords >= 420 && totalWords <= 580;
  const wcOver = totalWords > 580;

  const handleEdit = (i, t) => setParagraphs(prev => prev.map((p, j) => j === i ? t : p));

  const handleRewrite = async (index, originalText) => {
    setRewriting(index);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          messages: [{ role: "user", content: `Rewrite this single obituary paragraph with completely fresh wording while preserving all facts and matching the tone. Return ONLY the rewritten paragraph — no preamble, no quotes.\n\nContext:\n${buildContext()}\n\nParagraph to rewrite:\n${originalText}` }],
        }),
      });
      const data = await res.json();
      const newText = data.content?.map(b => b.text || "").join("").trim();
      if (newText) handleEdit(index, newText);
    } catch (e) {}
    setRewriting(null);
  };

  const handlePrint = () => {
    const paras = paragraphs;
    const mainPhoto = photos[0] || null;
    const extraPhotos = photos.slice(1);
    const printContent = `<html><head>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400" rel="stylesheet">
      <style>
        @page { margin: 0; size: 8.5in 11in; }
        body { margin: 0; padding: 0; font-family: 'Cormorant Garamond', Georgia, serif; }
        .bg { background-image: url('${bg.image}'); background-size: cover; background-position: center; min-height: 11in; padding: 0.45in 0.5in; box-sizing: border-box; }
        .paper { background: ${bg.paperBg}; border-radius: 10px; padding: 0.4in 0.45in; min-height: 10in; box-sizing: border-box; }
        .flowers { text-align:center; color:#C9941A; font-size:16px; letter-spacing:6px; margin:0 0 6px; }
        .in-loving { text-align:center; font-size:11px; color:#888; letter-spacing:4px; text-transform:uppercase; font-style:italic; }
        .name { font-family:'Dancing Script',cursive; font-size:46px; text-align:center; color:#8B6310; margin:4px 0 18px; line-height:1.2; }
        .photo-wrap { float:left; margin: 4px 18px 12px 0; }
        .photo-main { width:155px; height:188px; object-fit:cover; border-radius:8px; border:3px solid rgba(201,148,26,0.45); box-shadow: 0 6px 20px rgba(0,0,0,0.15); display:block; }
        .photo-extra { width:72px; height:72px; object-fit:cover; border-radius:6px; border:2px solid rgba(201,148,26,0.35); margin-top:8px; display:inline-block; margin-right:4px; }
        p { font-size:13.5px; line-height:1.88; margin:0 0 12px; text-align:justify; color:#2a2a2a; }
        .clearfix::after { content:""; display:table; clear:both; }
        .footer { text-align:center; margin-top:24px; padding-top:14px; border-top:1px solid rgba(201,148,26,0.22); }
        .f-logo { font-family:'Playfair Display',serif; font-size:16px; color:#8B6310; font-weight:700; }
        .f-tag { font-size:9px; color:#aaa; font-style:italic; margin-top:2px; }
      </style></head><body>
      <div class="bg"><div class="paper">
      <div class="flowers">✿ ✦ ✿</div>
      <div class="in-loving">In Loving Memory of</div>
      <div class="name">${name}</div>
      <div class="clearfix">
        ${mainPhoto ? `<div class="photo-wrap"><img class="photo-main" src="${mainPhoto}" alt="${name}" />${extraPhotos.map(ep => `<img class="photo-extra" src="${ep}" alt="" />`).join("")}</div>` : ""}
        ${paras.map(p => `<p>${p}</p>`).join("")}
      </div>
      <div class="footer"><div class="f-logo">4EverAfter™</div><div class="f-tag">"Turning Farewells Into Meaningful Memories"</div></div>
      </div></div></body></html>`;
    const win = window.open("", "_blank");
    win.document.write(printContent);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 900);
  };

  const mainPhoto = photos[0] || null;
  const extraPhotos = photos.slice(1);
  const paperPad = isMobile ? "24px 18px" : "44px 44px";

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        background: "rgba(15,8,0,0.95)", borderRadius: "14px 14px 0 0",
        padding: isMobile ? "12px 14px" : "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
        border: `1px solid rgba(201,148,26,0.25)`, borderBottom: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 13,
            color: wcOver ? "#ff4444" : wcOk ? "#4ade80" : G.gold,
            fontWeight: 600,
          }}>
            {wcOver ? `⚠ ${totalWords} words — trim needed` : wcOk ? `✓ ${totalWords} words — perfect` : `${totalWords} words`}
          </div>
          {!isMobile && <div style={{ fontSize: 11, color: G.gray, fontStyle: "italic" }}>Hover any paragraph to edit or rewrite</div>}
        </div>
        <button onClick={handlePrint} style={{
          padding: isMobile ? "8px 14px" : "9px 20px",
          background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`,
          border: "none", borderRadius: 9, cursor: "pointer",
          fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 12 : 13, fontWeight: 700,
          color: "#1a0d00", boxShadow: `0 3px 14px rgba(201,148,26,0.4)`,
          letterSpacing: "0.5px",
        }}>⬇ Download / Print PDF</button>
      </div>

      {/* Memorial Card */}
      <div style={{
        backgroundImage: `url(${bg.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "0 0 16px 16px",
        border: `1px solid rgba(201,148,26,0.2)`,
        borderTop: "none",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        padding: isMobile ? "10px" : "18px",
      }}>
        <div style={{
          background: bg.paperBg,
          borderRadius: 10,
          padding: paperPad,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          position: "relative",
          minHeight: isMobile ? "auto" : "9in",
          boxSizing: "border-box",
        }}>
          {/* Corner decorations */}
          {["top-left","top-right","bottom-left","bottom-right"].map(pos => (
            <div key={pos} style={{
              position: "absolute",
              [pos.includes("top") ? "top" : "bottom"]: 10,
              [pos.includes("left") ? "left" : "right"]: 10,
              width: 26, height: 26,
              borderTop: pos.includes("top") ? `2px solid rgba(201,148,26,0.35)` : "none",
              borderBottom: pos.includes("bottom") ? `2px solid rgba(201,148,26,0.35)` : "none",
              borderLeft: pos.includes("left") ? `2px solid rgba(201,148,26,0.35)` : "none",
              borderRight: pos.includes("right") ? `2px solid rgba(201,148,26,0.35)` : "none",
            }} />
          ))}

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span style={{ color: G.gold, fontSize: 16, opacity: 0.65, letterSpacing: 7 }}>✿ ✦ ✿</span>
          </div>
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <div style={{ fontSize: isMobile ? 10 : 12, color: "#888", fontStyle: "italic", letterSpacing: "3px", textTransform: "uppercase" }}>In Loving Memory of</div>
          </div>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 16 : 22 }}>
            <div style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: isMobile ? "clamp(26px, 7vw, 38px)" : "clamp(30px, 5vw, 48px)",
              background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold}, ${G.goldLight})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              lineHeight: 1.2,
            }}>{name}</div>
          </div>

          {/* Photo wraps text — newspaper style */}
          {mainPhoto && !isMobile ? (
            <div>
              <div style={{ float: "left", margin: "4px 20px 12px 0" }}>
                <img src={mainPhoto} alt={name} style={{
                  width: 155, height: 188, objectFit: "cover",
                  borderRadius: 8, border: `3px solid rgba(201,148,26,0.45)`,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)", display: "block",
                }} />
                {extraPhotos.length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap", maxWidth: 155 }}>
                    {extraPhotos.map((ep, i) => (
                      <img key={i} src={ep} alt="" style={{
                        width: 72, height: 72, objectFit: "cover",
                        borderRadius: 6, border: `2px solid rgba(201,148,26,0.35)`,
                      }} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                {paragraphs.map((para, i) => (
                  <EditableParagraph key={i} text={para} index={i} onEdit={handleEdit} onRewrite={handleRewrite} rewriting={rewriting} isMobile={false} />
                ))}
              </div>
              <div style={{ clear: "both" }} />
            </div>
          ) : (
            <>
              {mainPhoto && isMobile && (
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <img src={mainPhoto} alt={name} style={{ width: 120, height: 145, objectFit: "cover", borderRadius: 8, border: `3px solid rgba(201,148,26,0.4)`, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }} />
                </div>
              )}
              {paragraphs.map((para, i) => (
                <EditableParagraph key={i} text={para} index={i} onEdit={handleEdit} onRewrite={handleRewrite} rewriting={rewriting} isMobile={isMobile} />
              ))}
            </>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 28, paddingTop: 16, borderTop: `1px solid rgba(201,148,26,0.2)` }}>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700,
              background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold}, ${G.goldLight})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>4EverAfter™</div>
            <div style={{ fontSize: 9, color: "#aaa", fontStyle: "italic", marginTop: 2 }}>"Turning Farewells Into Meaningful Memories"</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [formData, setFormData] = useState({});
  const [tone, setTone] = useState("");
  const [bgId, setBgId] = useState("floral");
  const [photos, setPhotos] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form");
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 600);

  const updateField = (id, value) => setFormData(p => ({ ...p, [id]: value }));

  const buildContext = useCallback(() => {
    const fields = sections.flatMap(s => s.fields);
    return fields.filter(f => formData[f.id]).map(f => `${f.label}: ${formData[f.id]}`).join("\n");
  }, [formData]);

  const buildPrompt = () => {
    const toneLabel = tones.find(t => t.id === tone)?.label || "Warm & Personal";
    return `You are writing a beautiful, dignified obituary for a printed memorial program sized 8.5 x 11 inches.

Tone: ${toneLabel}

Information provided:
${buildContext()}

Write a heartfelt, flowing obituary of approximately 500 words. Use natural paragraph breaks — separate each paragraph with a blank line. Do not use headers or bullet points. Begin with a warm, memorable opening sentence. Weave in their life story, relationships, career, faith, personality, and legacy naturally. End gracefully with service details if provided. Write as if you truly knew this person — personal, dignified, deeply human. Do not add any commentary, preamble, or closing note — just the obituary itself.`;
  };

  const generate = async () => {
    if (!formData.fullName || !formData.dob || !formData.dod) {
      setError("Please fill in Full Name, Date of Birth, and Date of Passing at minimum.");
      return;
    }
    if (!tone) { setError("Please select a tone for the obituary."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const text = data.content?.map(b => b.text || "").join("\n") || "";
      const paras = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      setParagraphs(paras);
      setStep("result");
    } catch (e) {
      setError("Something went wrong generating the obituary. Please check your API key in Vercel Environment Variables and try again.");
    }
    setLoading(false);
  };

  const cardPad = isMobile ? "22px 16px" : "40px 40px";

  return (
    <div style={{ minHeight: "100vh", background: G.black, fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Dancing+Script:wght@600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(201,148,26,0.3); font-style: italic; }
        textarea { font-family: Georgia, serif; }
        button { transition: transform 0.1s, box-shadow 0.1s; }
        button:active { transform: scale(0.97); }
        input:focus { outline: none; }
        @media (max-width: 500px) { input { font-size: 16px !important; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0800; }
        ::-webkit-scrollbar-thumb { background: #8B6310; border-radius: 3px; }
      `}</style>

      <Logo />

      {/* Gold rule under logo */}
      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${G.gold}, transparent)`, margin: "0 40px 0" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "16px 12px 60px" : "24px 20px 80px" }}>

        {step === "form" && (
          <div style={{
            background: G.formBg,
            borderRadius: 20,
            padding: cardPad,
            boxShadow: `0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(201,148,26,0.15)`,
            border: `1px solid rgba(201,148,26,0.2)`,
            backdropFilter: "blur(10px)",
          }}>
            {/* Form header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? 22 : 28,
                color: G.cream,
                margin: "0 0 8px",
                fontWeight: 600,
                letterSpacing: "1px",
              }}>Create a Meaningful Tribute</h1>
              <div style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(201,148,26,0.4), transparent)`, margin: "10px 0" }} />
              <p style={{ color: G.gray, fontSize: 13, margin: 0, fontStyle: "italic" }}>
                Share what made your loved one extraordinary — we'll craft their story with care and dignity
              </p>
            </div>

            <BackgroundSelector value={bgId} onChange={setBgId} />
            <ToneSelector value={tone} onChange={setTone} />
            <PhotoUpload photos={photos} onChange={setPhotos} />

            {/* Gold divider */}
            <div style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(201,148,26,0.3), transparent)`, margin: "8px 0 28px" }} />

            {sections.map(section => (
              <div key={section.title} style={{ marginBottom: 28 }}>
                <SectionDivider title={section.title} icon={section.icon} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(270px, 1fr))", gap: "0 24px" }}>
                  {section.fields.map(f => <Field key={f.id} field={f} value={formData[f.id]} onChange={updateField} />)}
                </div>
              </div>
            ))}

            {error && (
              <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", fontSize: 13, marginBottom: 20, fontFamily: "Georgia, serif" }}>
                {error}
              </div>
            )}

            {/* Generate button */}
            <button onClick={generate} disabled={loading} style={{
              width: "100%",
              padding: isMobile ? "16px" : "20px",
              background: loading ? "rgba(100,100,100,0.3)" : `linear-gradient(135deg, ${G.goldDeep} 0%, ${G.goldDark} 30%, ${G.gold} 60%, ${G.goldLight} 100%)`,
              border: loading ? "1px solid rgba(100,100,100,0.3)" : `1px solid ${G.goldLight}`,
              borderRadius: 14,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? 16 : 20,
              fontWeight: 700,
              color: loading ? G.gray : G.darkBrown,
              letterSpacing: "2px",
              textTransform: "uppercase",
              boxShadow: loading ? "none" : `0 8px 32px rgba(201,148,26,0.45), inset 0 1px 0 rgba(255,255,255,0.2)`,
              transition: "all 0.3s ease",
            }}>
              {loading ? "✦  Crafting Their Story With Care..." : "✦  Generate Memorial Tribute  ✦"}
            </button>

            <p style={{ textAlign: "center", fontSize: 10, color: G.gray, margin: "12px 0 0", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
              Powered by Claude AI · 4EverAfter™ · Confidential & Secure
            </p>
          </div>
        )}

        {step === "result" && paragraphs.length > 0 && (
          <div>
            <div style={{
              background: "rgba(201,148,26,0.08)", border: `1px solid rgba(201,148,26,0.25)`,
              borderRadius: 10, padding: "11px 16px", marginBottom: 14,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>✏️</span>
              <div style={{ fontFamily: "Georgia, serif", fontSize: isMobile ? 11 : 13, color: G.goldLight }}>
                <strong>Your tribute is ready.</strong> {isMobile ? "Tap Edit or AI below each paragraph." : "Hover any paragraph to edit directly or request an AI rewrite of that paragraph."}
              </div>
            </div>

            <ObituaryOutput
              paragraphs={paragraphs} setParagraphs={setParagraphs}
              formData={formData} photos={photos} bgId={bgId}
              buildContext={buildContext} isMobile={isMobile}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => { setStep("form"); setParagraphs([]); }} style={{
                flex: 1, padding: "13px 8px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid rgba(201,148,26,0.3)`,
                borderRadius: 10, cursor: "pointer",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? 12 : 14,
                color: G.goldLight, letterSpacing: "0.5px",
              }}>← Edit Information</button>
              <button onClick={generate} disabled={loading} style={{
                flex: 2, padding: "13px",
                background: `linear-gradient(135deg, ${G.goldDark}, ${G.gold})`,
                border: "none", borderRadius: 10, cursor: "pointer",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? 13 : 15,
                fontWeight: 700, color: "#1a0d00",
                letterSpacing: "1px",
                boxShadow: `0 4px 20px rgba(201,148,26,0.35)`,
              }}>{loading ? "⟳ Regenerating..." : "↻ Regenerate Entire Tribute"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
