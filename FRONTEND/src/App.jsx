import { useState, useEffect, useRef, useCallback } from "react";
import {
  House, Compass, User, FolderOpen, FileText, MessageSquare, Map as MapIcon, Search, Bell, LogOut,
  ChevronDown, Check, Plus, Send, Download, Eye, Lock, Mail, ArrowRight, ArrowUpRight, X, Minus,
  Code2, BarChart3, ShieldCheck, PenTool, Cloud, Cpu, Award, Briefcase, GraduationCap, MapPin,
  Building2, Bookmark, FileUp, Landmark, Megaphone, Link as LinkIcon, RotateCw, Circle, Loader2,
} from "lucide-react";

// ─── DESIGN TOKENS (mirrors :root in index.css) ───────────────────────────────
const T = {
  bg: "#070810",
  surface: "#0E0F1A",
  surface2: "#13152A",
  line: "#1C1D2E",
  line2: "#2A2B45",
  t1: "#F0F0FA",
  t2: "#9899B8",
  t3: "#5C5D80",
  t4: "#33345A",
  accent: "#5B6EF5",
  accentLight: "#7B8AF8",
  green: "#22D17A",
  amber: "#F5A623",
  red: "#F04D4D",
  purple: "#9B6EF5",
};
const SW = 1.75; // icon stroke width

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const FIELD_SKILLS = {
  "Software Engineering": ["JavaScript", "Python", "React", "Node.js", "Git", "REST APIs", "TypeScript", "Docker", "SQL", "System Design"],
  "Data Science": ["Python", "SQL", "Machine Learning", "Statistics", "Power BI", "Pandas", "NumPy", "Tableau", "R", "Deep Learning"],
  "Cybersecurity": ["Linux", "Ethical Hacking", "Wireshark", "Penetration Testing", "Python", "Network Security", "SIEM", "Cryptography", "Compliance", "Incident Response"],
  "UI/UX Design": ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems", "Adobe XD", "Usability Testing", "Accessibility", "CSS", "Motion Design"],
  "Cloud Computing": ["AWS", "Azure", "GCP", "Terraform", "Docker", "Kubernetes", "CI/CD", "Linux", "Networking", "IAM"],
  "Artificial Intelligence": ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "ML Ops", "Transformers", "Data Engineering", "Statistics", "Research Methods"],
  "Business Administration": ["Business Strategy", "Financial Analysis", "Project Management", "Excel", "Presentation", "Negotiation", "Marketing", "Operations", "Leadership", "CRM"],
  "Digital Marketing": ["SEO/SEM", "Google Analytics", "Social Media", "Content Strategy", "Email Marketing", "Copywriting", "A/B Testing", "Paid Ads", "Analytics", "Brand Strategy"],
};

const FIELD_INTERESTS = {
  "Software Engineering": ["Web Development", "Backend Systems", "DevOps", "Game Development", "Mobile Apps", "Open Source", "FinTech", "SaaS Products"],
  "Data Science": ["Business Intelligence", "Predictive Analytics", "Data Engineering", "Research", "Healthcare Data", "Financial Data", "Sports Analytics", "AI Research"],
  "Cybersecurity": ["Red Teaming", "Blue Teaming", "Threat Intelligence", "Bug Bounty", "Security Research", "Compliance", "Digital Forensics", "Cloud Security"],
  "UI/UX Design": ["Product Design", "Mobile UX", "Design Systems", "User Research", "Interaction Design", "Design Ops", "Creative Direction", "Brand Identity"],
  "Cloud Computing": ["Cloud Architecture", "FinOps", "Platform Engineering", "SRE", "Multi-Cloud Strategy", "Edge Computing", "Serverless", "Cloud Security"],
  "Artificial Intelligence": ["Generative AI", "Computer Vision", "NLP", "Robotics", "AI Ethics", "ML Engineering", "Research", "AI in Healthcare"],
  "Business Administration": ["Entrepreneurship", "Consulting", "Corporate Finance", "Operations", "HR Management", "Product Management", "Strategy", "Startups"],
  "Digital Marketing": ["Growth Hacking", "Brand Building", "Influencer Marketing", "E-Commerce", "Performance Marketing", "Content Creation", "Community Management", "MarTech"],
};

const FIELD_ICONS = {
  "Software Engineering": Code2,
  "Data Science": BarChart3,
  "Cybersecurity": ShieldCheck,
  "UI/UX Design": PenTool,
  "Cloud Computing": Cloud,
  "Artificial Intelligence": Cpu,
  "Business Administration": Landmark,
  "Digital Marketing": Megaphone,
};
const FIELD_SHORT = { "Software Engineering": "Software", "Data Science": "Data", "Cybersecurity": "Security", "UI/UX Design": "Design", "Cloud Computing": "Cloud", "Artificial Intelligence": "AI" };

// What the signed-in user (Ahmad) already has — drives match % and skill gaps
const USER_SKILLS = new Set(["Python", "SQL", "Tableau", "Pandas", "NumPy", "Machine Learning", "Statistics", "Excel", "Git", "Basic SQL", "Data Entry", "Reporting", "Data Cleaning", "Power BI", "Docker"]);

const CAREERS = [
  { id: 1, title: "Software Engineer", level: "Junior–Senior", field: "Software Engineering", salary: "5,000–15,000", demand: 97, description: "Design, develop, and maintain scalable software systems. Work in agile teams shipping products used by thousands.", skills: ["JavaScript", "Python", "React", "Node.js", "Git", "Docker"], companies: ["Grab", "Shopee", "Fusionex", "iPay88", "Revenue Monster", "Axiata Digital"], responsibilities: ["Build and ship features end-to-end", "Code review and technical mentorship", "System design and architecture"], certs: ["AWS Solutions Architect", "Google Cloud Professional", "Meta Frontend Developer"] },
  { id: 2, title: "Data Analyst", level: "Junior–Senior", field: "Data Science", salary: "4,500–10,000", demand: 92, description: "Transform raw data into business intelligence. Build dashboards, run analyses, and drive data-informed decisions.", skills: ["Python", "SQL", "Tableau", "Excel", "Statistics", "Power BI"], companies: ["CIMB", "Petronas", "Shopee", "Grab", "Maxis", "Digi"], responsibilities: ["Build reporting dashboards", "Statistical analysis and A/B testing", "Stakeholder presentations"], certs: ["Google Data Analytics", "Databricks Associate", "Microsoft Power BI"] },
  { id: 3, title: "Cybersecurity Analyst", level: "Junior–Senior", field: "Cybersecurity", salary: "5,000–13,000", demand: 94, description: "Protect digital infrastructure. Monitor threats, respond to incidents, and harden systems against attacks.", skills: ["Linux", "Penetration Testing", "SIEM", "Python", "Network Security", "Compliance"], companies: ["CyberSecurity Malaysia", "Telekom MY", "MIMOS", "RHB Bank", "KPMG MY"], responsibilities: ["Security monitoring and incident response", "Vulnerability assessments", "Threat hunting"], certs: ["CompTIA Security+", "CEH", "CISSP", "OSCP"] },
  { id: 4, title: "UX Designer", level: "Junior–Senior", field: "UI/UX Design", salary: "4,500–11,000", demand: 86, description: "Craft user-centred experiences. Own the full design process from research to final handoff.", skills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"], companies: ["Carsome", "PropertyGuru", "AirAsia", "Lazada MY", "GoGet"], responsibilities: ["User research and persona creation", "Information architecture", "Design system maintenance"], certs: ["Google UX Design", "Interaction Design Foundation", "Nielsen Norman UX"] },
  { id: 5, title: "Cloud Engineer", level: "Mid–Senior", field: "Cloud Computing", salary: "7,000–18,000", demand: 95, description: "Architect and manage cloud infrastructure. Build the foundation that modern products run on.", skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Linux", "CI/CD"], companies: ["TM One", "AWS Malaysia", "Microsoft MY", "Accenture MY"], responsibilities: ["Cloud infrastructure provisioning", "CI/CD pipeline management", "Cost optimisation"], certs: ["AWS Solutions Architect", "CKA Kubernetes", "HashiCorp Terraform"] },
  { id: 6, title: "AI/ML Engineer", level: "Mid–Senior", field: "Artificial Intelligence", salary: "8,000–20,000", demand: 99, description: "Build production AI systems. From model training to deployment, you bridge research and real-world applications.", skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "SQL", "Docker"], companies: ["Carsome AI", "CtrlF+", "DataMicron", "Mindvalley Tech"], responsibilities: ["Model development and training", "ML pipeline engineering", "Production model deployment"], certs: ["Google ML Engineer", "AWS ML Specialty", "DeepLearning.AI"] },
].map(c => ({ ...c, match: Math.round((c.skills.filter(s => USER_SKILLS.has(s)).length / c.skills.length) * 100) }));

const CAREER_PATH_DATA = {
  "Data Analyst": [
    { title: "Data Intern", status: "completed", skills: ["Excel", "Basic SQL", "Data Entry", "Reporting"], timeline: "0–6 mo" },
    { title: "Junior Data Analyst", status: "current", skills: ["Python", "SQL", "Tableau", "Statistics", "Data Cleaning"], timeline: "6 mo–2 yr" },
    { title: "Data Analyst", status: "next", skills: ["Advanced Python", "ML Basics", "Stakeholder Management", "A/B Testing", "dbt"], certs: ["Google Advanced Data Analytics", "Databricks Associate"], timeline: "2–4 yr" },
    { title: "Senior Data Analyst", status: "future", skills: ["Team Leadership", "Cloud Platforms", "Strategy", "ML Integration", "Executive Comms"], certs: ["AWS Data Analytics Specialty"], timeline: "4–6 yr" },
    { title: "Analytics Manager", status: "future", skills: ["People Management", "Budget Planning", "Product Strategy", "Org Design"], certs: [], timeline: "6+ yr" },
  ],
};

const PORTFOLIO_ITEMS = [
  { id: 1, title: "E-Commerce Sales Dashboard", type: "Project", icon: BarChart3, tech: ["Python", "Tableau", "SQL", "Pandas"], desc: "Interactive BI dashboard analysing 500K+ transactions with an automated daily refresh pipeline.", views: 312, github: true, featured: true },
  { id: 2, title: "AWS Cloud Practitioner", type: "Certificate", icon: Award, tech: ["AWS"], desc: "Amazon Web Services · Verified Jun 2024 · Credential AWS-001234", views: 128, featured: true },
  { id: 3, title: "Customer Churn Predictor", type: "Project", icon: Cpu, tech: ["Python", "Scikit-learn", "Pandas", "Flask"], desc: "Classification model at 87% accuracy, deployed as a REST API on AWS Lambda.", views: 245, github: true },
  { id: 4, title: "Google Data Analytics", type: "Certificate", icon: Award, tech: ["SQL", "R", "Tableau", "Spreadsheets"], desc: "Google via Coursera · Verified Mar 2024 · 6-month professional certificate", views: 189 },
  { id: 5, title: "Data Analyst Intern — TechCorp", type: "Experience", icon: Briefcase, tech: ["Python", "SQL", "Tableau"], desc: "ETL pipelines over 500K+ daily records; dashboards that cut reporting time by 40%.", views: 97 },
];

const MESSAGES_DATA = [
  { id: 1, name: "Sarah Lim", role: "Senior Data Scientist, Grab", avatar: "SL", color: T.purple, online: true, unread: 2, time: "2m",
    history: [
      { from: "them", text: "Hi Ahmad! I came across your profile and your customer churn predictor project caught my eye.", time: "Yesterday 2:30 PM" },
      { from: "me", text: "Thank you Sarah! It was a 3-month project where I deployed the model to production using Flask + AWS Lambda.", time: "Yesterday 2:45 PM" },
      { from: "them", text: "Impressive! We actually have an opening for a Junior Data Analyst at Grab. Would you be open to a referral?", time: "Yesterday 3:00 PM" },
      { from: "them", text: "Hey, reviewed your portfolio — your churn model is impressive! Want to chat?", time: "2m ago" },
    ] },
  { id: 2, name: "Wei Chen", role: "Tech Recruiter, Shopee", avatar: "WC", color: T.amber, online: false, unread: 0, time: "1h",
    history: [
      { from: "them", text: "Hi Ahmad, I'm Wei from Shopee's talent team. We have a Data Analyst role that matches your profile.", time: "3 days ago" },
      { from: "me", text: "Hi Wei, thanks for reaching out! I'd be very interested to hear more about the role.", time: "3 days ago" },
      { from: "them", text: "Following up on the Data Analyst position we discussed last week.", time: "1h ago" },
    ] },
  { id: 3, name: "Marcus Tan", role: "Product Manager, StoreHub", avatar: "MT", color: T.green, online: true, unread: 1, time: "3h",
    history: [
      { from: "them", text: "Your portfolio link is impressive. Can you share your resume as well?", time: "3h ago" },
    ] },
];

const AUTO_REPLIES = {
  1: "Sounds great! I'll send the referral link over tonight.",
  2: "Thanks Ahmad. Are you free for a quick call this Thursday at 3 PM?",
  3: "Perfect, received. I'll pass it to our hiring manager today.",
};

const TRENDING = [["Generative AI", 64], ["MLOps", 38], ["dbt", 31], ["AWS", 26], ["Cybersecurity", 22], ["Power BI", 21]];

// ─── MOTION HELPERS ────────────────────────────────────────────────────────────
const d = (ms) => ({ "--d": `${ms}ms` }); // stagger delay for .in / .in-pop / .grow-x

function useMounted(delay = 0) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setM(true), delay + 30);
    return () => clearTimeout(t);
  }, [delay]);
  return m;
}

function useCountUp(target, duration = 1100, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const t = setTimeout(() => {
      const tick = (now) => {
        if (start === undefined) start = now;
        const p = Math.min(1, (now - start) / duration);
        setV(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return v;
}

function CountUp({ value, suffix = "", delay = 0 }) {
  const v = useCountUp(value, 1100, delay);
  return <>{Math.round(v).toLocaleString()}{suffix}</>;
}

// Typewriter reveal; remount with a new key to replay
function TypeText({ text, onTick }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setN(x => {
        if (x >= text.length) { clearInterval(iv); return x; }
        return Math.min(text.length, x + 3);
      });
      onTick?.();
    }, 14);
    return () => clearInterval(iv);
  }, [text, onTick]);
  return <>{text.slice(0, n)}{n < text.length && <span className="caret" />}</>;
}

function Sparkline({ data, delay = 0 }) {
  const w = 76, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} style={{ overflow: "visible", flexShrink: 0 }} aria-hidden="true">
      <path className="spark-line" d={line} fill="none" stroke={T.t3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={d(delay)} />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={T.accent} className="in-pop" style={d(delay + 1000)} />
    </svg>
  );
}

// ─── PRIMITIVES ────────────────────────────────────────────────────────────────
const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 007.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 015.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" /></svg>
);
const GoogleIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.7 14.55 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25c5.34 0 8.88-3.75 8.88-9.04 0-.6-.07-1.06-.15-1.51z" /></svg>
);

function Logo({ small }) {
  const s = small ? 24 : 28;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: s, height: s, borderRadius: 7, background: T.surface2, border: `1px solid ${T.line2}`, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: small ? 4 : 5, borderRadius: "50%", border: "1px solid rgba(240,240,250,0.28)" }} />
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.t1 }} />
        <div className="logo-orbit" style={{ position: "absolute", inset: small ? 4 : 5 }}><span /></div>
      </div>
      <span style={{ fontSize: small ? 14 : 15, fontWeight: 600, letterSpacing: -0.2 }}>CareerOrbit</span>
    </div>
  );
}

// Gumball's mark — a serif "G" on the accent colour
const GMark = ({ size = 24 }) => (
  <div className="serif" style={{ width: size, height: size, borderRadius: Math.round(size / 4), background: T.accent, color: "#fff", display: "grid", placeItems: "center", fontSize: size * 0.68, lineHeight: 1, flexShrink: 0, paddingTop: size * 0.04 }}>G</div>
);

const Avatar = ({ initials, size = 32, color = T.t2, square }) => (
  <div style={{ width: size, height: size, borderRadius: square ? Math.round(size / 4) : "50%", background: `${color}1A`, color, border: `1px solid ${color}33`, display: "grid", placeItems: "center", fontSize: Math.round(size * 0.36), fontWeight: 600, flexShrink: 0, letterSpacing: 0.2 }}>{initials}</div>
);

const Btn = ({ children, variant = "secondary", size = "md", onClick, disabled, style, className = "", type = "button", title }) => {
  const pad = { sm: "6px 11px", md: "8px 14px", lg: "11px 18px" }[size];
  const fs = { sm: 12.5, md: 13, lg: 14 }[size];
  return <button type={type} title={title} onClick={onClick} disabled={disabled} className={`btn btn-${variant} ${className}`} style={{ padding: pad, fontSize: fs, ...style }}>{children}</button>;
};

const IconBtn = ({ icon: I, onClick, title, size = 15 }) => (
  <button onClick={onClick} title={title} aria-label={title} className="btn btn-ghost" style={{ padding: 6, borderRadius: 6 }}><I size={size} strokeWidth={SW} /></button>
);

const Pill = ({ children, color = T.t2, dot }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color, border: `1px solid ${T.line2}`, borderRadius: 99, padding: "2px 9px", whiteSpace: "nowrap", background: T.surface }}>
    {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />}{children}
  </span>
);

const Skill = ({ children, have, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: have === false ? T.t3 : T.t2, background: have === false ? "transparent" : T.surface2, border: `1px ${have === false ? "dashed" : "solid"} ${T.line2}`, borderRadius: 5, padding: "3px 8px", ...style }}>
    {have === true && <Check size={11} strokeWidth={2.5} color={T.green} />}{children}
  </span>
);

const Radio = ({ on }) => (
  <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1px solid ${on ? T.accent : T.line2}`, display: "grid", placeItems: "center", flexShrink: 0, transition: "border-color .2s" }}>
    <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.t1, transform: on ? "scale(1)" : "scale(0)", transition: "transform .25s var(--ease)" }} />
  </span>
);

const Checkbox = ({ on }) => (
  <span style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${on ? T.accent : T.line2}`, background: on ? T.t1 : "transparent", display: "grid", placeItems: "center", flexShrink: 0, transition: "background .2s, border-color .2s" }}>
    {on && <Check size={11} strokeWidth={3} color={T.bg} className="check-pop" />}
  </span>
);

const Bar = ({ value, color = T.t1, height = 4, delay = 0, mounted = true }) => (
  <div style={{ height, background: T.line, borderRadius: 2, overflow: "hidden", flex: 1 }}>
    <div style={{ height: "100%", width: mounted ? `${value}%` : 0, background: color, borderRadius: 2, transition: `width 1s var(--ease) ${delay}ms` }} />
  </div>
);

const CardHead = ({ title, meta, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "13px 18px", borderBottom: `1px solid ${T.line}` }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 }}>
      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</span>
      {meta && <span className="mono" style={{ fontSize: 11.5, color: T.t3 }}>{meta}</span>}
    </div>
    {action}
  </div>
);

function PageHead({ kicker, title, sub, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
      <div>
        {kicker && <div className="label in">{kicker}</div>}
        <h1 className="serif in" style={{ fontSize: 42, lineHeight: 1.05, margin: "10px 0 0", ...d(40) }}>{title}</h1>
        {sub && <p className="in" style={{ color: T.t2, margin: "10px 0 0", fontSize: 14, ...d(80) }}>{sub}</p>}
      </div>
      {right && <div className="in" style={{ display: "flex", gap: 8, ...d(120) }}>{right}</div>}
    </div>
  );
}

function Field({ label, icon: Icon, right, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: T.t2, marginBottom: 6, fontWeight: 500 }}>
        <label htmlFor={props.id}>{label}</label>{right}
      </div>
      <div style={{ position: "relative" }}>
        {Icon && <Icon size={15} strokeWidth={SW} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.t3, pointerEvents: "none" }} />}
        <input className="field" style={{ padding: Icon ? "10px 12px 10px 34px" : "10px 12px" }} {...props} />
      </div>
    </div>
  );
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────
const ORBITS = [
  { r: 95, dur: 42, label: "Data Analyst", accent: true },
  { r: 165, dur: 66, label: "Cloud Engineer", reverse: true },
  { r: 240, dur: 92, label: "UX Designer" },
  { r: 320, dur: 124, label: "AI/ML Engineer", reverse: true },
];

// Thin rings with role labels that stay upright while they orbit "You"
function OrbitDiagram() {
  return (
    <div className="orbit" aria-hidden="true">
      {ORBITS.map(o => (
        <div key={o.label} className="orbit-ring" style={{ width: o.r * 2, height: o.r * 2, animationDuration: `${o.dur}s`, animationDirection: o.reverse ? "reverse" : "normal" }}>
          <div className="orbit-sat" style={{ animationDuration: `${o.dur}s`, animationDirection: o.reverse ? "normal" : "reverse" }}>
            <span className={`orbit-node ${o.accent ? "accent" : ""}`} />
            <span className="orbit-tag">{o.label}</span>
          </div>
        </div>
      ))}
      <div className="orbit-you">You</div>
    </div>
  );
}

const AUTH_COPY = {
  login: ["Welcome back", "Sign in to pick up where you left off."],
  register: ["Create your account", "Takes about two minutes to set up."],
  forgot: ["Reset your password", "We'll email you a link to set a new one."],
};

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errKey, setErrKey] = useState(0);
  const [notice, setNotice] = useState("");
  const formRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const switchMode = (m) => { setMode(m); setError(""); setNotice(""); };

  const fail = (msg) => {
    setError(msg);
    setErrKey(k => k + 1);
    const el = formRef.current;
    if (el) { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (mode === "register") {
      if (!form.name || !form.email || !form.password) return fail("Please fill in all fields.");
      if (form.password !== form.confirm) return fail("Passwords don't match.");
    }
    if (mode === "login" && (!form.email || !form.password)) return fail("Enter your email and password.");
    if (mode === "forgot" && !form.email) return fail("Enter the email you signed up with.");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "forgot") { setMode("login"); setNotice(`Reset link sent to ${form.email}.`); return; }
      onAuth(mode === "register" ? "new" : "existing");
    }, 1100);
  };

  const [title, sub] = AUTH_COPY[mode];
  const cta = { login: "Sign in", register: "Create account", forgot: "Send reset link" }[mode];

  return (
    <div className="auth-grid">
      <aside className="auth-side dotgrid" style={{ position: "relative", overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "36px 48px 44px", background: T.surface, borderRight: `1px solid ${T.line}` }}>
        <div className="in" style={{ position: "relative", zIndex: 1 }}><Logo /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "78%" }}><OrbitDiagram /></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 className="serif in" style={{ fontSize: 58, lineHeight: 0.98, margin: 0, maxWidth: 520, ...d(100) }}>
            Every career has a trajectory. <em style={{ color: T.t3 }}>Find yours.</em>
          </h1>
          <p className="in" style={{ color: T.t2, fontSize: 14.5, lineHeight: 1.6, maxWidth: 420, margin: "18px 0 30px", ...d(180) }}>
            Map your skills to real roles in the Malaysian market, see exactly what's missing, and close the gap with a mentor that knows your profile.
          </p>
          <div className="in" style={{ display: "flex", gap: 36, paddingTop: 22, borderTop: `1px solid ${T.line}`, ...d(260) }}>
            {[["6", "career tracks"], ["60+", "skills mapped"], ["24/7", "AI mentor"]].map(([n, l]) => (
              <div key={l}>
                <div className="mono" style={{ fontSize: 20, color: T.t1 }}>{n}</div>
                <div className="label" style={{ marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div className="auth-mobile-logo" style={{ marginBottom: 40 }}><Logo /></div>

          <div key={mode} className="in-r">
            <h2 className="serif" style={{ fontSize: 38, lineHeight: 1.05, margin: "0 0 8px" }}>{title}</h2>
            <p style={{ color: T.t2, margin: "0 0 28px" }}>{sub}</p>
          </div>

          {error && <div key={errKey} className="in-pop" role="alert" style={{ border: `1px solid ${T.red}40`, background: `${T.red}12`, color: "#FF9A9D", borderRadius: 7, padding: "9px 12px", fontSize: 13, marginBottom: 16 }}>{error}</div>}
          {notice && <div className="in-pop" style={{ border: `1px solid ${T.green}40`, background: `${T.green}12`, color: T.green, borderRadius: 7, padding: "9px 12px", fontSize: 13, marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}><Check size={14} strokeWidth={2.5} /> {notice}</div>}

          <form ref={formRef} onSubmit={submit} noValidate>
            <div key={mode} className="in-fade">
              {mode === "register" && <Field id="name" label="Full name" icon={User} placeholder="Ahmad Razif" autoComplete="name" value={form.name} onChange={e => set("name", e.target.value)} />}
              <Field id="email" label="Email" icon={Mail} type="email" placeholder="you@university.edu.my" autoComplete="email" value={form.email} onChange={e => set("email", e.target.value)} />
              {mode !== "forgot" && (
                <Field id="password" label="Password" icon={Lock} type="password" placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} value={form.password} onChange={e => set("password", e.target.value)}
                  right={mode === "login" && <button type="button" className="link" style={{ fontSize: 12.5 }} onClick={() => switchMode("forgot")}>Forgot?</button>} />
              )}
              {mode === "register" && <Field id="confirm" label="Confirm password" icon={Lock} type="password" placeholder="••••••••" autoComplete="new-password" value={form.confirm} onChange={e => set("confirm", e.target.value)} />}
              {mode === "login" && (
                <button type="button" onClick={() => set("remember", !form.remember)} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.t2, cursor: "pointer", margin: "2px 0 18px", background: "none", border: "none", padding: 0 }}>
                  <Checkbox on={form.remember} /> Keep me signed in
                </button>
              )}
            </div>
            <Btn type="submit" variant="primary" size="lg" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
              {loading ? <><Loader2 size={15} className="spin" /> Please wait</> : <>{cta} <ArrowRight size={15} className="arrow" /></>}
            </Btn>
          </form>

          {mode !== "forgot" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
                <div style={{ flex: 1, height: 1, background: T.line }} />
                <span className="label">or</span>
                <div style={{ flex: 1, height: 1, background: T.line }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Btn variant="secondary" title="Coming soon" disabled><GoogleIcon /> Google</Btn>
                <Btn variant="secondary" title="Coming soon" disabled><GithubIcon size={14} /> GitHub</Btn>
              </div>
            </>
          )}

          <p style={{ marginTop: 28, fontSize: 13, color: T.t3 }}>
            {mode === "login"
              ? <>New to CareerOrbit? <button className="link" style={{ color: T.t1 }} onClick={() => switchMode("register")}>Create an account</button></>
              : <>{mode === "forgot" ? "Remembered it?" : "Already have an account?"} <button className="link" style={{ color: T.t1 }} onClick={() => switchMode("login")}>Sign in</button></>}
          </p>
        </div>
      </main>
    </div>
  );
}

// ─── SETUP (onboarding + resume import) ────────────────────────────────────────
const SETUP_STEPS = [["Status", "Intern or job seeker"], ["Field", "Your area of study"], ["Skills", "What you can do today"], ["Interests", "Where you want to go"], ["Resume", "Import or start fresh"]];

function SetupLayout({ step, children }) {
  const last = SETUP_STEPS.length - 1;
  return (
    <div className="setup-grid">
      <aside className="setup-rail" style={{ background: T.surface, borderRight: `1px solid ${T.line}`, padding: "32px 28px" }}>
        <Logo />
        <div className="label" style={{ margin: "56px 0 20px" }}>Profile setup</div>
        <div>
          {SETUP_STEPS.map(([t, s], i) => {
            const state = i < step ? "done" : i === step ? "active" : "todo";
            return (
              <div key={t} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: i < last ? 26 : 0 }}>
                {i < last && (
                  <div style={{ position: "absolute", left: 11, top: 27, bottom: 3, width: 1, background: T.line2 }}>
                    <div style={{ width: "100%", height: i < step ? "100%" : "0%", background: T.t2, transition: "height .5s var(--ease)" }} />
                  </div>
                )}
                <div className="mono" style={{ width: 23, height: 23, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontSize: 11, border: `1px solid ${state === "todo" ? T.line2 : T.t1}`, background: state === "done" ? T.t1 : "transparent", color: state === "done" ? T.bg : state === "active" ? T.t1 : T.t3, transition: "all .3s" }}>
                  {state === "done" ? <Check size={12} strokeWidth={2.5} className="check-pop" /> : i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: state === "todo" ? T.t3 : T.t1, transition: "color .3s" }}>{t}</div>
                  <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>{s}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "auto", paddingTop: 32, fontSize: 12.5, color: T.t3, lineHeight: 1.6 }}>You can change any of this later from your profile.</div>
      </aside>
      <main style={{ padding: "72px 64px 56px", overflowY: "auto" }}>
        <div style={{ maxWidth: 640 }}>{children}</div>
      </main>
    </div>
  );
}

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState({ status: "", field: "", skills: [], interests: [], customSkill: "", customInterest: "" });

  const steps = [
    { title: "Where are you right now?", sub: "We'll tune recommendations to your stage.", field: "status", kind: "status" },
    { title: "What do you study, or work in?", sub: "This sets which skills and career paths we map for you.", field: "field", kind: "field" },
    { title: "What can you already do?", sub: "Pick everything that applies, and add anything we missed.", field: "skills", kind: "multi", opts: FIELD_SKILLS[data.field] || [], custom: "customSkill" },
    { title: "What pulls you in?", sub: "Your interests decide which roles we show you first.", field: "interests", kind: "multi", opts: FIELD_INTERESTS[data.field] || [], custom: "customInterest" },
  ];

  const s = steps[step];
  const val = data[s.field];
  const canNext = s.kind === "multi" ? val.length > 0 : val !== "";
  const go = (next) => { setDir(next > step ? 1 : -1); setStep(next); };
  const next = () => { if (!canNext) return; if (step < steps.length - 1) go(step + 1); else onDone(data); };

  const pick = (v) => {
    if (s.kind !== "multi") setData(dd => ({ ...dd, [s.field]: v }));
    else setData(dd => ({ ...dd, [s.field]: dd[s.field].includes(v) ? dd[s.field].filter(x => x !== v) : [...dd[s.field], v] }));
  };
  const addCustom = () => {
    const cv = data[s.custom].trim();
    if (cv && !data[s.field].includes(cv)) setData(dd => ({ ...dd, [s.field]: [...dd[s.field], cv], [s.custom]: "" }));
  };
  const multiOpts = s.kind === "multi" ? [...s.opts, ...val.filter(v => !s.opts.includes(v))] : [];

  return (
    <SetupLayout step={step}>
      <div key={step} className={dir > 0 ? "in-r" : "in-l"}>
        <div className="label">Step {step + 1} of {SETUP_STEPS.length}</div>
        <h1 className="serif" style={{ fontSize: 46, lineHeight: 1.04, margin: "12px 0 10px" }}>{s.title}</h1>
        <p style={{ color: T.t2, margin: "0 0 32px", fontSize: 14.5 }}>{s.sub}</p>

        {s.kind === "status" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{ v: "Intern", icon: GraduationCap, desc: "Still studying, or looking for an internship" }, { v: "Job Seeker", icon: Briefcase, desc: "Graduated and ready for a full-time role" }].map((o, i) => {
              const on = val === o.v;
              const I = o.icon;
              return (
                <button key={o.v} onClick={() => pick(o.v)} className={`option in ${on ? "on" : ""}`} style={{ ...d(i * 60), textAlign: "left", padding: 18, borderRadius: 10, border: `1px solid ${on ? T.accent : T.line2}`, background: on ? "rgba(91,110,245,0.10)" : T.surface, color: T.t1, cursor: "pointer", display: "flex", flexDirection: "column", gap: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}><I size={20} strokeWidth={1.5} color={on ? T.accent : T.t2} /><Radio on={on} /></div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{o.v}</div>
                    <div style={{ fontSize: 13, color: T.t3, marginTop: 4, lineHeight: 1.45 }}>{o.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {s.kind === "field" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {Object.keys(FIELD_SKILLS).map((f, i) => {
              const on = val === f;
              const I = FIELD_ICONS[f];
              return (
                <button key={f} onClick={() => pick(f)} className={`option in ${on ? "on" : ""}`} style={{ ...d(i * 30), display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, border: `1px solid ${on ? T.accent : T.line2}`, background: on ? "rgba(91,110,245,0.10)" : "transparent", color: on ? T.accentLight : T.t2, cursor: "pointer", fontSize: 13.5, textAlign: "left" }}>
                  <I size={16} strokeWidth={SW} color={on ? T.accent : T.t3} />
                  <span style={{ flex: 1 }}>{f}</span>
                  <Radio on={on} />
                </button>
              );
            })}
          </div>
        )}

        {s.kind === "multi" && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {multiOpts.map((o, i) => {
                const on = val.includes(o);
                return (
                  <button key={o} onClick={() => pick(o)} className={`toggle in-pop ${on ? "on" : ""}`} style={d(i * 25)}>
                    {on ? <Check size={13} strokeWidth={2.5} className="check-pop" /> : <Plus size={13} strokeWidth={SW} color={T.t3} />}
                    {o}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <input className="field" style={{ padding: "9px 12px", maxWidth: 320 }} value={data[s.custom]} onChange={e => setData(dd => ({ ...dd, [s.custom]: e.target.value }))} onKeyDown={e => e.key === "Enter" && addCustom()} placeholder={`Add another ${s.field === "skills" ? "skill" : "interest"}`} />
              <Btn onClick={addCustom} disabled={!data[s.custom].trim()}>Add</Btn>
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 44, paddingTop: 20, borderTop: `1px solid ${T.line}` }}>
        {step > 0 ? <Btn variant="ghost" onClick={() => go(step - 1)}>Back</Btn> : <span />}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {s.kind === "multi" && <span className="mono" style={{ fontSize: 12, color: T.t3 }}>{val.length} selected</span>}
          <Btn variant="accent" size="lg" disabled={!canNext} onClick={next}>Continue <ArrowRight size={15} className="arrow" /></Btn>
        </div>
      </div>
    </SetupLayout>
  );
}

const PARSE_FIELDS = ["Contact details", "Education", "Experience", "Skills", "Certifications", "Projects"];

function ResumeUpload({ onDone }) {
  const [mode, setMode] = useState(null); // null | uploading | parsed
  const [progress, setProgress] = useState(0);
  const ivRef = useRef(null);

  useEffect(() => () => clearInterval(ivRef.current), []);

  const upload = () => {
    clearInterval(ivRef.current);
    setMode("uploading");
    setProgress(0);
    ivRef.current = setInterval(() => setProgress(p => {
      if (p >= 100) { clearInterval(ivRef.current); setTimeout(() => setMode("parsed"), 300); return 100; }
      return Math.min(100, p + 3);
    }), 70);
  };

  return (
    <SetupLayout step={mode === "parsed" ? 5 : 4}>
      <div className="label in">Step 5 of 5</div>
      <h1 className="serif in" style={{ fontSize: 46, lineHeight: 1.04, margin: "12px 0 10px", ...d(40) }}>Bring your resume along</h1>
      <p className="in" style={{ color: T.t2, margin: "0 0 32px", fontSize: 14.5, lineHeight: 1.6, ...d(80) }}>We'll read it and fill in your profile. You'll review everything before anything is saved.</p>

      {mode === null && (
        <>
          <button className="dropzone in" onClick={upload} style={{ ...d(140), width: "100%", padding: "44px 24px", borderRadius: 10, border: `1px dashed ${T.line2}`, background: T.surface, color: T.t1, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div className="dz-ic" style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${T.line2}`, background: T.bg, display: "grid", placeItems: "center", color: T.t2 }}><FileUp size={20} strokeWidth={1.5} /></div>
            <div style={{ fontSize: 14.5 }}>Drop your resume here, or <span style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>browse</span></div>
            <div className="label">PDF or DOCX · up to 5 MB</div>
          </button>
          <div className="in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, fontSize: 13, ...d(200) }}>
            <span style={{ color: T.t3 }}>Rather type it in yourself?</span>
            <button className="link" onClick={() => onDone()} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: T.t1 }}>Set up manually <ArrowRight size={14} /></button>
          </div>
        </>
      )}

      {mode === "uploading" && (
        <div className="card in-pop" style={{ padding: 24, display: "flex", gap: 28 }}>
          <div className="scan-doc">
            {[90, 55, 100, 80, 95, 45, 85, 70, 60].map((w, i) => <div key={i} className="skel" style={{ height: 4, width: `${w}%` }} />)}
            <div className="scan-line" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
              <span className="mono" style={{ color: T.t1 }}>ahmad-razif-resume.pdf</span>
              <span className="mono" style={{ color: T.t3 }}>{progress}%</span>
            </div>
            <div style={{ height: 2, background: T.line, borderRadius: 2, overflow: "hidden", marginBottom: 18 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: T.accent, transition: "width .12s linear" }} />
            </div>
            {PARSE_FIELDS.map((f, i) => {
              const at = (i + 1) * 15;
              const state = progress >= at ? "done" : progress >= at - 15 ? "active" : "todo";
              return (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", fontSize: 13, color: state === "todo" ? T.t3 : T.t1, transition: "color .2s" }}>
                  {state === "done" ? <Check size={14} strokeWidth={2.5} color={T.green} className="check-pop" /> : state === "active" ? <Loader2 size={14} className="spin" color={T.t2} /> : <Circle size={14} strokeWidth={SW} color={T.t4} />}
                  <span style={{ flex: 1 }}>{f}</span>
                  <span className="mono" style={{ fontSize: 11.5, color: T.t3 }}>{state === "done" ? "found" : state === "active" ? "reading" : ""}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === "parsed" && (
        <div className="card in-pop" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${T.line}` }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${T.green}55`, display: "grid", placeItems: "center", color: T.green }}>
              <svg className="draw" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Here's what we found</div>
              <div style={{ fontSize: 12.5, color: T.t3 }}>6 sections · edit anything later from your profile</div>
            </div>
          </div>
          {[["Name", "Ahmad Razif bin Abdullah"], ["Email", "ahmad.razif@email.com"], ["Education", "B.Sc. Computer Science, UPM (2021–2025)"], ["Experience", "Data Analyst Intern, TechCorp Sdn Bhd"], ["Skills", "Python, SQL, Tableau, Pandas, Machine Learning, Git"]].map(([k, v], i) => (
            <div key={k} className="in" style={{ display: "grid", gridTemplateColumns: "130px 1fr", padding: "11px 20px", borderBottom: `1px solid ${T.line}`, fontSize: 13, ...d(120 + i * 70) }}>
              <span className="label" style={{ paddingTop: 2 }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 20px" }}>
            <Btn variant="ghost" onClick={upload}><RotateCw size={14} strokeWidth={SW} /> Re-upload</Btn>
            <Btn variant="accent" onClick={() => onDone()}>Looks right, continue <ArrowRight size={14} className="arrow" /></Btn>
          </div>
        </div>
      )}
    </SetupLayout>
  );
}

// ─── SHELL ─────────────────────────────────────────────────────────────────────
const NAV = [
  { group: "Workspace", items: [{ id: "dashboard", label: "Dashboard", icon: House }, { id: "discover", label: "Discover", icon: Compass }, { id: "progression", label: "Career map", icon: MapIcon }] },
  { group: "You", items: [{ id: "profile", label: "Profile", icon: User }, { id: "portfolio", label: "Portfolio", icon: FolderOpen }, { id: "resume", label: "Resume builder", icon: FileText }] },
  { group: "Network", items: [{ id: "inbox", label: "Inbox", icon: MessageSquare, badge: 3 }] },
];
const GROUP_H = 34; // label row height
const ITEM_H = 36; // 34px item + 2px gap

function Shell({ onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [favs, setFavs] = useState([2, 6]);
  const [gumballOpen, setGumballOpen] = useState(false);
  const [gumballMin, setGumballMin] = useState(false);

  const openGumball = useCallback(() => { setGumballOpen(true); setGumballMin(false); }, []);

  // Keyboard: "g" opens Gumball, Ctrl/Cmd+K jumps to Discover
  useEffect(() => {
    const onKey = (e) => {
      const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPage("discover"); }
      else if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && e.key === "g") openGumball();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openGumball]);

  // Sliding highlight: compute the active item's offset from the fixed row heights
  let indTop = 0;
  let group = "";
  for (const g of NAV) {
    indTop += GROUP_H;
    const i = g.items.findIndex(x => x.id === page);
    if (i >= 0) { indTop += i * ITEM_H; group = g.group; break; }
    indTop += g.items.length * ITEM_H;
  }
  const current = NAV.flatMap(g => g.items).find(x => x.id === page);
  const fullBleed = page === "inbox";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <nav style={{ width: 232, borderRight: `1px solid ${T.line}`, display: "flex", flexDirection: "column", flexShrink: 0, padding: "18px 12px 14px" }}>
        <div style={{ padding: "0 6px 18px" }}><Logo small /></div>

        <button onClick={() => setPage("discover")} className="field" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", color: T.t3, cursor: "pointer", textAlign: "left", background: T.surface }}>
          <Search size={14} strokeWidth={SW} /><span style={{ flex: 1, fontSize: 13 }}>Search careers</span><span className="kbd">Ctrl K</span>
        </button>

        <div style={{ position: "relative", flex: 1, marginTop: 6, overflowY: "auto" }}>
          <div className="nav-indicator" style={{ transform: `translateY(${indTop}px)` }} />
          {NAV.map(g => (
            <div key={g.group}>
              <div className="label" style={{ height: GROUP_H, display: "flex", alignItems: "flex-end", padding: "0 10px 8px" }}>{g.group}</div>
              {g.items.map(item => {
                const I = item.icon;
                return (
                  <div key={item.id} style={{ height: ITEM_H }}>
                    <button onClick={() => setPage(item.id)} className={`nav-item ${page === item.id ? "active" : ""}`}>
                      <I size={16} strokeWidth={SW} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge > 0 && <span className="mono" style={{ fontSize: 11, color: "#fff", background: T.accent, borderRadius: 4, padding: "0 5px", lineHeight: "16px" }}>{item.badge}</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <button onClick={openGumball} className="nav-item" style={{ height: 40, border: `1px solid ${T.line}`, background: T.surface, marginBottom: 10 }}>
          <GMark size={20} /><span style={{ flex: 1, color: T.t1 }}>Ask Gumball</span><span className="kbd">G</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 6px 0", borderTop: `1px solid ${T.line}` }}>
          <Avatar initials="AR" size={30} color={T.accent} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Ahmad Razif</div>
            <div style={{ fontSize: 11.5, color: T.t3 }}>Job seeker · Data</div>
          </div>
          <IconBtn icon={LogOut} title="Sign out" onClick={onLogout} size={14} />
        </div>
      </nav>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 52, borderBottom: `1px solid ${T.line}`, display: "flex", alignItems: "center", padding: "0 28px", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: T.t3, display: "flex", gap: 8, alignItems: "center" }}>
            <span>{group}</span><span style={{ color: T.t4 }}>/</span>
            <span key={page} className="in-fade" style={{ color: T.t1 }}>{current?.label}</span>
          </div>
          <div style={{ position: "relative" }}>
            <IconBtn icon={Bell} title="Notifications" />
            <span style={{ position: "absolute", top: 6, right: 7, width: 6, height: 6, background: T.accent, borderRadius: "50%", boxShadow: `0 0 0 2px ${T.bg}`, pointerEvents: "none" }} />
          </div>
        </header>

        <div style={{ flex: 1, overflow: fullBleed ? "hidden" : "auto" }}>
          <div key={page} className="in" style={fullBleed ? { height: "100%" } : { maxWidth: 1120, margin: "0 auto", padding: "36px 40px 64px" }}>
            {page === "dashboard" && <DashboardPage favs={favs} onAskGumball={openGumball} onNavigate={setPage} />}
            {page === "discover" && <DiscoverPage favs={favs} setFavs={setFavs} />}
            {page === "profile" && <ProfilePage />}
            {page === "portfolio" && <PortfolioPage />}
            {page === "resume" && <ResumePage />}
            {page === "inbox" && <InboxPage />}
            {page === "progression" && <ProgressionPage onAskGumball={openGumball} />}
          </div>
        </div>
      </main>

      {gumballOpen && <GumballChat minimized={gumballMin} onMinimize={() => setGumballMin(m => !m)} onClose={() => setGumballOpen(false)} />}
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardPage({ favs, onAskGumball, onNavigate }) {
  const mounted = useMounted(120);
  const [tasks, setTasks] = useState([
    { text: "Finish the AWS Cloud Practitioner course", done: false, p: "High", due: "Fri" },
    { text: "Add Churn Predictor to portfolio", done: true, p: "Med", due: "Done" },
    { text: "Reply to Sarah Lim about the Grab referral", done: false, p: "High", due: "Today" },
    { text: "Rewrite LinkedIn headline", done: false, p: "Low", due: "Next wk" },
  ]);
  const toggleTask = (i) => setTasks(ts => ts.map((t, j) => j === i ? { ...t, done: !t.done } : t));
  const pending = tasks.filter(t => !t.done).length;

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const date = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const stats = [
    { label: "Profile views", v: 128, delta: "+23%", spark: [40, 52, 48, 70, 66, 92, 128] },
    { label: "Resume downloads", v: 34, delta: "+8%", spark: [12, 15, 14, 20, 24, 29, 34] },
    { label: "Skill coverage", v: 76, suffix: "%", delta: "+5 pts", spark: [52, 55, 60, 61, 66, 71, 76] },
    { label: "Saved careers", v: favs.length, delta: "tracking", spark: [0, 1, 1, 1, 2, 2, Math.max(2, favs.length)] },
  ];
  const readiness = [["Skills", 82], ["Experience", 60], ["Portfolio", 75], ["Certifications", 45]];
  const certs = [["Google Data Analytics", 78], ["AWS Cloud Practitioner", 42], ["Databricks Associate", 15]];
  const pColor = { High: T.accent, Med: T.amber, Low: T.t3 };
  const maxTrend = TRENDING[0][1];

  return (
    <div>
      <PageHead
        kicker={date}
        title={`${greet}, Ahmad.`}
        sub={`${pending} open action item${pending === 1 ? "" : "s"} · 3 unread messages · 2 recruiters viewed your profile this week`}
        right={<>
          <Btn onClick={() => onNavigate("progression")}><MapIcon size={14} strokeWidth={SW} /> Career map</Btn>
          <Btn variant="accent" onClick={onAskGumball}>Ask Gumball <ArrowRight size={14} className="arrow" /></Btn>
        </>}
      />

      {/* Stats strip */}
      <div className="card in" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 20, ...d(140) }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ padding: "18px 20px", borderLeft: i ? `1px solid ${T.line}` : "none" }}>
            <div className="label">{s.label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginTop: 14 }}>
              <div>
                <div className="mono" style={{ fontSize: 30, fontWeight: 500, letterSpacing: -1.2, lineHeight: 1 }}><CountUp value={s.v} suffix={s.suffix} delay={200 + i * 90} /></div>
                <div className="mono" style={{ fontSize: 11.5, color: s.delta.startsWith("+") ? T.green : T.t3, marginTop: 9 }}>{s.delta} <span style={{ color: T.t4 }}>· 30d</span></div>
              </div>
              <Sparkline data={s.spark} delay={350 + i * 120} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Readiness */}
          <div className="card in" style={d(220)}>
            <CardHead title="Job readiness" meta="Data Analyst" action={<button className="link" style={{ fontSize: 12.5, display: "inline-flex", gap: 4, alignItems: "center" }} onClick={() => onNavigate("progression")}>Breakdown <ArrowUpRight size={13} /></button>} />
            <div style={{ padding: "22px 18px", display: "grid", gridTemplateColumns: "170px 1fr", gap: 28, alignItems: "center" }}>
              <div>
                <div className="mono" style={{ fontSize: 56, fontWeight: 500, letterSpacing: -3, lineHeight: 1 }}>
                  <CountUp value={76} delay={300} /><span style={{ fontSize: 18, letterSpacing: 0, color: T.t3 }}> /100</span>
                </div>
                <div style={{ fontSize: 12.5, color: T.t2, marginTop: 12, lineHeight: 1.5 }}>Two gaps away from interview-ready.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {readiness.map(([k, v], i) => (
                  <div key={k} style={{ display: "grid", gridTemplateColumns: "104px 1fr 28px", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, color: T.t2 }}>{k}</span>
                    <Bar value={v} color={v < 50 ? T.accent : T.t1} mounted={mounted} delay={300 + i * 90} />
                    <span className="mono" style={{ fontSize: 12, color: v < 50 ? T.accent : T.t2, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${T.line}`, padding: "12px 18px", fontSize: 12.5, color: T.t2, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
              Biggest gap is certifications. Finishing Google Data Analytics adds about 9 points.
            </div>
          </div>

          {/* Action items */}
          <div className="card in" style={d(300)}>
            <CardHead title="Action items" meta={`${tasks.length - pending}/${tasks.length}`} />
            {tasks.map((t, i) => (
              <div key={i} onClick={() => toggleTask(i)} className="row" style={{ display: "flex", gap: 12, padding: "12px 18px", alignItems: "center", cursor: "pointer", borderTop: i ? `1px solid ${T.line}` : "none" }}>
                <Checkbox on={t.done} />
                <span style={{ fontSize: 13.5, color: t.done ? T.t3 : T.t1, flex: 1, textDecoration: t.done ? "line-through" : "none", textDecorationColor: T.t4, transition: "color .2s" }}>{t.text}</span>
                {!t.done && <span className="mono" style={{ fontSize: 11, color: pColor[t.p] }}>{t.p}</span>}
                <span className="mono" style={{ fontSize: 11, color: T.t3, width: 52, textAlign: "right" }}>{t.due}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Certifications */}
          <div className="card in" style={d(260)}>
            <CardHead title="Certifications" meta="in progress" />
            <div style={{ padding: "6px 18px 14px" }}>
              {certs.map(([name, pct], i) => (
                <div key={name} style={{ padding: "10px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                    <span>{name}</span>
                    <span className="mono" style={{ color: T.t2, fontSize: 12 }}><CountUp value={pct} suffix="%" delay={400 + i * 120} /></span>
                  </div>
                  <Bar value={pct} mounted={mounted} delay={400 + i * 120} height={3} />
                </div>
              ))}
            </div>
          </div>

          {/* Inbox preview */}
          <div className="card in" style={d(320)}>
            <CardHead title="Inbox" meta="3 unread" action={<button className="link" style={{ fontSize: 12.5 }} onClick={() => onNavigate("inbox")}>Open</button>} />
            {MESSAGES_DATA.map((m, i) => (
              <div key={m.id} onClick={() => onNavigate("inbox")} className="row" style={{ display: "flex", gap: 12, padding: "12px 18px", cursor: "pointer", borderTop: i ? `1px solid ${T.line}` : "none" }}>
                <Avatar initials={m.avatar} size={30} color={m.color} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: m.unread ? 600 : 400 }}>{m.name}</span>
                    <span className="mono" style={{ fontSize: 11, color: T.t3 }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: T.t3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{m.history[m.history.length - 1].text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trending */}
          <div className="card in" style={d(380)}>
            <CardHead title="Rising skills" meta="MY · job posts, QoQ" />
            <div style={{ padding: "6px 0" }}>
              {TRENDING.map(([name, g], i) => (
                <div key={name} style={{ display: "grid", gridTemplateColumns: "24px 1fr 70px 46px", alignItems: "center", gap: 10, padding: "8px 18px", fontSize: 13 }}>
                  <span className="mono" style={{ color: T.t4, fontSize: 11.5 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{name}</span>
                  <Bar value={(g / maxTrend) * 100} color={T.t3} height={3} mounted={mounted} delay={500 + i * 70} />
                  <span className="mono" style={{ color: T.green, fontSize: 12, textAlign: "right" }}>+{g}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DISCOVER ─────────────────────────────────────────────────────────────────
const DISCOVER_COLS = "minmax(0, 1fr) 110px 120px 150px 64px";

function DiscoverPage({ favs, setFavs }) {
  const [expanded, setExpanded] = useState(null);
  const [q, setQ] = useState("");
  const [field, setField] = useState("All");
  const filters = ["All", ...CAREERS.map(c => c.field).filter((f, i, a) => a.indexOf(f) === i)];
  const ql = q.toLowerCase();
  const list = CAREERS
    .filter(c => field === "All" || c.field === field)
    .filter(c => c.title.toLowerCase().includes(ql) || c.skills.some(s => s.toLowerCase().includes(ql)))
    .sort((a, b) => b.match - a.match);

  return (
    <div>
      <PageHead kicker="Discover" title="Careers that fit you" sub="Sorted by how well your current skills match, with demand and salary for Malaysia." />

      <div className="in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap", ...d(140) }}>
        <div className="seg">
          {filters.map(f => <button key={f} className={field === f ? "on" : ""} onClick={() => setField(f)}>{f === "All" ? "All" : FIELD_SHORT[f] || f}</button>)}
        </div>
        <div style={{ position: "relative", width: 260 }}>
          <Search size={14} strokeWidth={SW} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.t3 }} />
          <input className="field" value={q} onChange={e => setQ(e.target.value)} placeholder="Filter by role or skill" style={{ padding: "8px 12px 8px 32px" }} />
        </div>
      </div>

      <div className="card in" style={{ overflow: "hidden", ...d(200) }}>
        <div style={{ display: "grid", gridTemplateColumns: DISCOVER_COLS, gap: 16, padding: "10px 18px", borderBottom: `1px solid ${T.line}` }}>
          {["Role", "Your match", "Demand", "Salary / month", ""].map(h => <span key={h} className="label">{h}</span>)}
        </div>

        {list.length === 0 && (
          <div className="in-fade" style={{ padding: "48px 18px", textAlign: "center", color: T.t3, fontSize: 13.5 }}>
            Nothing matches “{q}”. Try a skill like Python or Figma.
          </div>
        )}

        {list.map((c, idx) => {
          const isFav = favs.includes(c.id);
          const isExp = expanded === c.id;
          const I = FIELD_ICONS[c.field];
          return (
            <div key={c.id} className="in" style={{ borderTop: idx ? `1px solid ${T.line}` : "none", ...d(240 + idx * 50) }}>
              <div onClick={() => setExpanded(isExp ? null : c.id)} className={`row ${isExp ? "active" : ""}`} style={{ display: "grid", gridTemplateColumns: DISCOVER_COLS, gap: 16, alignItems: "center", padding: "14px 18px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${T.line2}`, background: T.bg, display: "grid", placeItems: "center", color: T.t2, flexShrink: 0 }}><I size={17} strokeWidth={SW} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{c.title}</div>
                    <div style={{ fontSize: 12.5, color: T.t3, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.level} · {c.skills.slice(0, 3).join(", ")}</div>
                  </div>
                </div>
                <div className="mono" style={{ fontSize: 13, color: c.match >= 60 ? T.green : c.match >= 30 ? T.t1 : T.t3 }}><CountUp value={c.match} suffix="%" delay={300 + idx * 60} /></div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 56, height: 3, background: T.line, borderRadius: 2, overflow: "hidden" }}><div className="grow-x" style={{ width: `${c.demand}%`, height: "100%", background: T.t2, ...d(380 + idx * 60) }} /></div>
                  <span className="mono" style={{ fontSize: 12, color: T.t2 }}>{c.demand}</span>
                </div>
                <div className="mono" style={{ fontSize: 12.5 }}><span style={{ color: T.t3 }}>RM </span>{c.salary}</div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
                  <button onClick={e => { e.stopPropagation(); setFavs(f => f.includes(c.id) ? f.filter(x => x !== c.id) : [...f, c.id]); }} title={isFav ? "Remove from saved" : "Save"} aria-label={isFav ? "Remove from saved" : "Save"} className="btn btn-ghost" style={{ padding: 6 }}>
                    <Bookmark key={String(isFav)} size={15} strokeWidth={SW} className={isFav ? "check-pop" : ""} fill={isFav ? T.accent : "none"} color={isFav ? T.accent : T.t3} />
                  </button>
                  <ChevronDown size={15} strokeWidth={SW} color={T.t3} style={{ transition: "transform .3s var(--ease)", transform: isExp ? "rotate(180deg)" : "none" }} />
                </div>
              </div>

              <div className={`collapse ${isExp ? "open" : ""}`}>
                <div>
                  <div style={{ padding: "6px 18px 22px 68px", display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 32 }}>
                    <div>
                      <p style={{ fontSize: 13.5, color: T.t2, lineHeight: 1.65, margin: "0 0 14px" }}>{c.description}</p>
                      {c.responsibilities.map(r => <div key={r} style={{ fontSize: 13, color: T.t2, padding: "3px 0", display: "flex", gap: 8 }}><span style={{ color: T.t4 }}>—</span>{r}</div>)}
                    </div>
                    <div>
                      <div className="label" style={{ marginBottom: 10 }}>Skills · you have {c.skills.filter(s => USER_SKILLS.has(s)).length} of {c.skills.length}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{c.skills.map(s => <Skill key={s} have={USER_SKILLS.has(s)}>{s}</Skill>)}</div>
                      <div className="label" style={{ margin: "18px 0 10px" }}>Certifications</div>
                      {c.certs.map(cert => <div key={cert} style={{ fontSize: 13, color: T.t2, padding: "3px 0", display: "flex", gap: 8, alignItems: "center" }}><Award size={13} strokeWidth={SW} color={T.t3} />{cert}</div>)}
                    </div>
                    <div>
                      <div className="label" style={{ marginBottom: 10 }}>Hiring now</div>
                      {c.companies.slice(0, 5).map(co => <div key={co} style={{ fontSize: 13, color: T.t2, padding: "3px 0", display: "flex", gap: 8, alignItems: "center" }}><Building2 size={13} strokeWidth={SW} color={T.t3} />{co}</div>)}
                      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                        <Btn variant="primary" size="sm">Tailor resume</Btn>
                        <Btn size="sm">See skill gaps</Btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage() {
  const mounted = useMounted(200);
  const skills = ["Python", "SQL", "Tableau", "Pandas", "NumPy", "Machine Learning", "Data Visualization", "Git", "Statistics", "Excel"];
  const experience = [
    { r: "Data Analyst Intern", c: "TechCorp Sdn Bhd", p: "Jun – Aug 2024", d: "Built ETL pipelines processing 500K+ daily records using Python and SQL. Created Tableau dashboards that cut reporting time by 40%." },
    { r: "Teaching Assistant", c: "UPM Computer Science", p: "Jan – May 2024", d: "Ran weekly labs for Introduction to Databases, 60+ students." },
  ];
  const checklist = [["Resume uploaded", true], ["3+ portfolio items", true], ["Headline written", true], ["Add a certification", false], ["Link GitHub", false]];

  return (
    <div>
      <div className="in" style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 28, marginBottom: 28, borderBottom: `1px solid ${T.line}`, flexWrap: "wrap" }}>
        <Avatar initials="AR" size={76} color={T.accent} square />
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 className="serif" style={{ fontSize: 40, lineHeight: 1.05, margin: 0 }}>Ahmad Razif bin Abdullah</h1>
          <div style={{ display: "flex", gap: 18, marginTop: 10, fontSize: 13, color: T.t2, flexWrap: "wrap", alignItems: "center" }}>
            <span>Aspiring Data Analyst</span>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><MapPin size={13} strokeWidth={SW} color={T.t3} />Cyberjaya</span>
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><GraduationCap size={13} strokeWidth={SW} color={T.t3} />UPM, Computer Science</span>
            <span style={{ display: "inline-flex", gap: 8, alignItems: "center", color: T.green }}><span className="live" />Open to work</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn><FileUp size={14} strokeWidth={SW} /> Update resume</Btn>
          <Btn variant="primary">Edit profile</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 40 }}>
        <div>
          <section className="in" style={{ marginBottom: 36, ...d(80) }}>
            <div className="label" style={{ marginBottom: 12 }}>About</div>
            <p style={{ fontSize: 15, color: T.t1, lineHeight: 1.7, margin: 0 }}>Final-year Computer Science student who likes turning messy datasets into decisions people can act on. Looking for data analyst roles in the Klang Valley.</p>
          </section>

          <section className="in" style={{ marginBottom: 36, ...d(140) }}>
            <div className="label" style={{ marginBottom: 16 }}>Experience</div>
            {experience.map((e, i) => (
              <div key={e.r} style={{ display: "grid", gridTemplateColumns: "120px 18px 1fr", gap: 12, paddingBottom: i < experience.length - 1 ? 24 : 0 }}>
                <span className="mono" style={{ fontSize: 12, color: T.t3, paddingTop: 2 }}>{e.p}</span>
                <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", border: `1.5px solid ${i === 0 ? T.accent : T.t3}`, background: T.bg, marginTop: 5, zIndex: 1 }} />
                  {i < experience.length - 1 && <span style={{ position: "absolute", top: 16, bottom: -26, width: 1, background: T.line2 }} />}
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{e.r}</div>
                  <div style={{ fontSize: 13, color: T.t2, margin: "2px 0 8px" }}>{e.c}</div>
                  <div style={{ fontSize: 13.5, color: T.t2, lineHeight: 1.6 }}>{e.d}</div>
                </div>
              </div>
            ))}
          </section>

          <section className="in" style={d(200)}>
            <div className="label" style={{ marginBottom: 16 }}>Education</div>
            <div style={{ display: "grid", gridTemplateColumns: "120px 18px 1fr", gap: 12 }}>
              <span className="mono" style={{ fontSize: 12, color: T.t3, paddingTop: 2 }}>2021 – 2025</span>
              <div style={{ display: "flex", justifyContent: "center" }}><span style={{ width: 9, height: 9, borderRadius: "50%", border: `1.5px solid ${T.t3}`, marginTop: 5 }} /></div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>B.Sc. Computer Science</div>
                <div style={{ fontSize: 13, color: T.t2, marginTop: 2 }}>Universiti Putra Malaysia · CGPA 3.72 · Dean's List 2022, 2023</div>
              </div>
            </div>
          </section>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card in" style={{ padding: 18, ...d(120) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>Profile strength</span>
              <span className="mono" style={{ fontSize: 13 }}><CountUp value={76} suffix="%" delay={300} /></span>
            </div>
            <Bar value={76} mounted={mounted} delay={200} />
            <div style={{ marginTop: 14 }}>
              {checklist.map(([t, ok]) => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", padding: "5px 0", fontSize: 13, color: ok ? T.t3 : T.t1 }}>
                  {ok ? <Check size={14} strokeWidth={2.5} color={T.green} /> : <Plus size={14} strokeWidth={SW} color={T.accent} />}
                  <span style={{ textDecoration: ok ? "line-through" : "none", textDecorationColor: T.t4 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="in" style={d(180)}>
            <div className="label" style={{ marginBottom: 12 }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{skills.map((s, i) => <span key={s} className="in-pop" style={d(260 + i * 30)}><Skill>{s}</Skill></span>)}</div>
          </div>

          <div className="in" style={d(240)}>
            <div className="label" style={{ marginBottom: 8 }}>Links</div>
            {[[GithubIcon, "github.com/ahmad-razif"], [LinkIcon, "linkedin.com/in/ahmad-razif"], [Mail, "ahmad.razif@email.com"]].map(([I, t]) => (
              <a key={t} href="#" onClick={e => e.preventDefault()} className="link" style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", fontSize: 13 }}>
                <span style={{ color: T.t3, display: "inline-flex" }}><I size={14} strokeWidth={SW} /></span><span style={{ flex: 1 }}>{t}</span><ArrowUpRight size={13} color={T.t4} />
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── PORTFOLIO ─────────────────────────────────────────────────────────────────
function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(i => i.type === filter);
  const count = (t) => t === "All" ? PORTFOLIO_ITEMS.length : PORTFOLIO_ITEMS.filter(i => i.type === t).length;

  return (
    <div>
      <PageHead kicker="Portfolio" title="Work you can show" sub="Projects, certificates and experience — the evidence behind your resume." right={<Btn variant="primary"><Plus size={14} strokeWidth={2} /> Add item</Btn>} />

      <div className="seg in" style={{ marginBottom: 20, ...d(140) }}>
        {["All", "Project", "Certificate", "Experience"].map(t => (
          <button key={t} className={filter === t ? "on" : ""} onClick={() => setFilter(t)}>{t === "All" ? "All" : `${t}s`} <span className="mono" style={{ color: T.t4, marginLeft: 4 }}>{count(t)}</span></button>
        ))}
      </div>

      <div key={filter} style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        {list.map((item, i) => {
          const I = item.icon;
          return (
            <div key={item.id} className="card card-hover in" style={{ overflow: "hidden", display: "flex", flexDirection: "column", ...d(180 + i * 60) }}>
              <div className="dotgrid" style={{ height: 112, borderBottom: `1px solid ${T.line}`, position: "relative", display: "grid", placeItems: "center", background: T.bg }}>
                <div className="cover-ic" style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${T.line2}`, background: T.surface, display: "grid", placeItems: "center", color: T.t2 }}><I size={20} strokeWidth={1.5} /></div>
                {item.featured && <span style={{ position: "absolute", top: 12, left: 12 }}><Pill color={T.accent} dot>Featured</Pill></span>}
                <span className="label" style={{ position: "absolute", top: 14, right: 14 }}>{item.type}</span>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontSize: 13, color: T.t2, lineHeight: 1.55, margin: "0 0 14px", flex: 1 }}>{item.desc}</p>
                <div className="mono" style={{ fontSize: 11.5, color: T.t3, marginBottom: 14 }}>{item.tech.join(" · ")}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
                  <span className="mono" style={{ fontSize: 11.5, color: T.t3, display: "flex", alignItems: "center", gap: 6 }}><Eye size={13} strokeWidth={SW} /><CountUp value={item.views} delay={300 + i * 60} /></span>
                  <div style={{ display: "flex", gap: 2 }}>
                    {item.github && <IconBtn icon={GithubIcon} title="Source on GitHub" size={14} />}
                    <IconBtn icon={ArrowUpRight} title="Open" size={15} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button className="add-tile in" style={{ ...d(180 + list.length * 60), border: `1px dashed ${T.line2}`, borderRadius: 10, background: "transparent", color: T.t3, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 280, fontSize: 13 }}>
          <span className="plus" style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${T.line2}`, display: "grid", placeItems: "center" }}><Plus size={16} strokeWidth={SW} /></span>
          Add a project, certificate or role
        </button>
      </div>
    </div>
  );
}

// ─── RESUME BUILDER ───────────────────────────────────────────────────────────
const RESUME_STEPS = ["Pulling profile data", "Matching keywords to Data Analyst", "Laying out sections", "Tightening bullet points"];
const TEMPLATES = [["Modern", "Accent rule, compact"], ["ATS-safe", "Plain text, max parse rate"], ["Classic", "Serif, centred header"]];

function ResumePage() {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [template, setTemplate] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [sections, setSections] = useState({ Experience: true, Education: true, Skills: true, Certifications: true });
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const generate = () => {
    timers.current.forEach(clearTimeout);
    setLoading(true); setReady(false); setStepIdx(0);
    timers.current = [
      ...RESUME_STEPS.slice(1).map((_, i) => setTimeout(() => setStepIdx(i + 1), (i + 1) * 500)),
      setTimeout(() => { setLoading(false); setReady(true); }, 2100),
    ];
  };

  const ink = "#16161A";
  const accent = template === 0 ? "#4F5FD8" : ink;
  const classic = template === 2;
  const body = {
    Experience: <div><div style={{ display: "flex", justifyContent: "space-between" }}><strong>Data Analyst Intern — TechCorp Sdn Bhd</strong><span style={{ color: "#777", fontSize: 11 }}>Jun–Aug 2024</span></div><ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: 12, color: "#3a3a40", lineHeight: 1.75 }}><li>Built ETL pipelines processing 500K+ daily records using Python and SQL</li><li>Created Tableau dashboards that cut reporting time by 40%</li></ul></div>,
    Education: <div><div style={{ display: "flex", justifyContent: "space-between" }}><strong>B.Sc. Computer Science</strong><span style={{ color: "#777", fontSize: 11 }}>2021–2025</span></div><div style={{ fontSize: 12, color: "#555" }}>Universiti Putra Malaysia · CGPA 3.72 · Dean's List 2022, 2023</div></div>,
    Skills: <div style={{ fontSize: 12, color: "#3a3a40" }}>Python · SQL · Tableau · Pandas · Machine Learning · Git · Excel · Power BI</div>,
    Certifications: <div style={{ fontSize: 12, color: "#3a3a40" }}>Google Data Analytics Professional Certificate (2024) · AWS Cloud Practitioner (in progress)</div>,
  };

  return (
    <div>
      <PageHead kicker="Resume builder" title="Generate a tailored resume" sub="Built from your profile and portfolio, tuned for the role you pick." />

      <div style={{ display: "grid", gridTemplateColumns: "280px minmax(0, 1fr)", gap: 28, alignItems: "start" }}>
        <div className="in" style={{ display: "flex", flexDirection: "column", gap: 22, ...d(140) }}>
          <div>
            <div className="label" style={{ marginBottom: 8 }}>Target role</div>
            <button className="field" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer", textAlign: "left" }}>
              <BarChart3 size={15} strokeWidth={SW} color={T.t3} /><span style={{ flex: 1 }}>Data Analyst</span><ChevronDown size={15} color={T.t3} />
            </button>
          </div>

          <div>
            <div className="label" style={{ marginBottom: 4 }}>Sections</div>
            {Object.keys(sections).map(s => (
              <button key={s} onClick={() => setSections(x => ({ ...x, [s]: !x[s] }))} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", cursor: "pointer", fontSize: 13.5, color: sections[s] ? T.t1 : T.t3, background: "none", border: "none", width: "100%", textAlign: "left" }}>
                <Checkbox on={sections[s]} />{s}
              </button>
            ))}
          </div>

          <div>
            <div className="label" style={{ marginBottom: 8 }}>Template</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {TEMPLATES.map(([t, sub], i) => (
                <button key={t} onClick={() => setTemplate(i)} className={`option ${template === i ? "on" : ""}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: `1px solid ${template === i ? T.accent : T.line2}`, background: template === i ? T.surface2 : "transparent", color: T.t1, cursor: "pointer", textAlign: "left" }}>
                  <Radio on={template === i} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13.5 }}>{t}</div><div style={{ fontSize: 12, color: T.t3, marginTop: 1 }}>{sub}</div></div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn variant="primary" size="lg" onClick={generate} disabled={loading}>
              {loading ? <><Loader2 size={15} className="spin" /> Generating</> : ready ? <><RotateCw size={14} strokeWidth={SW} /> Regenerate</> : <>Generate resume <ArrowRight size={15} className="arrow" /></>}
            </Btn>
            {ready && <Btn className="in-pop" size="lg"><Download size={14} strokeWidth={SW} /> Download PDF</Btn>}
          </div>
        </div>

        <div className="in" style={d(200)}>
          {!ready && !loading && (
            <div className="dotgrid" style={{ height: 600, border: `1px dashed ${T.line2}`, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: T.t3 }}>
              <FileText size={28} strokeWidth={1.25} />
              <div style={{ fontSize: 13.5 }}>Your preview will appear here</div>
            </div>
          )}
          {loading && (
            <div className="card" style={{ height: 600, padding: "44px 52px", display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
              <div className="skel" style={{ height: 20, width: "52%" }} />
              <div className="skel" style={{ height: 9, width: "34%" }} />
              <div className="skel" style={{ height: 1, width: "100%", margin: "12px 0" }} />
              {[0, 1, 2].map(b => (
                <div key={b} style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
                  <div className="skel" style={{ height: 9, width: "20%" }} />
                  <div className="skel" style={{ height: 7, width: "92%" }} />
                  <div className="skel" style={{ height: 7, width: "78%" }} />
                  <div className="skel" style={{ height: 7, width: "84%" }} />
                </div>
              ))}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "center" }}>
                <div key={stepIdx} className="in mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 6, background: T.bg, border: `1px solid ${T.line2}`, fontSize: 12, color: T.t2 }}>
                  <Loader2 size={12} className="spin" /> {RESUME_STEPS[stepIdx]} <span style={{ color: T.t4 }}>{stepIdx + 1}/{RESUME_STEPS.length}</span>
                </div>
              </div>
            </div>
          )}
          {ready && (
            <div className="paper-in" style={{ background: "#FBFAF7", borderRadius: 6, padding: "44px 52px", color: ink, fontFamily: classic ? "Georgia, serif" : "var(--sans)", boxShadow: "0 20px 60px rgba(0,0,0,0.45)", minHeight: 600 }}>
              <div className="in" style={{ borderBottom: `${template === 1 ? 1 : 2}px solid ${accent}`, paddingBottom: 16, marginBottom: 18, textAlign: classic ? "center" : "left", ...d(250) }}>
                <div style={{ fontSize: classic ? 28 : 24, fontWeight: classic ? 400 : 600, letterSpacing: -0.4 }}>Ahmad Razif bin Abdullah</div>
                <div style={{ fontSize: 12, color: accent, fontWeight: 500, margin: "4px 0 6px" }}>Data Analyst · Python · SQL · Tableau</div>
                <div style={{ fontSize: 11, color: "#666", display: "flex", gap: 16, justifyContent: classic ? "center" : "flex-start" }}>
                  <span>ahmad.razif@email.com</span><span>Cyberjaya, Malaysia</span><span>linkedin.com/in/ahmad-razif</span>
                </div>
              </div>
              {Object.keys(body).filter(k => sections[k]).map((k, i) => (
                <div key={k} className="in" style={{ marginBottom: 18, ...d(350 + i * 110) }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: accent, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 7, textAlign: classic ? "center" : "left" }}>{k}</div>
                  {body[k]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── INBOX ────────────────────────────────────────────────────────────────────
function InboxPage() {
  const [activeId, setActiveId] = useState(1);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState(MESSAGES_DATA.reduce((a, m) => ({ ...a, [m.id]: m.history }), {}));
  const [typing, setTyping] = useState({});
  const [read, setRead] = useState([1]);
  const active = MESSAGES_DATA.find(m => m.id === activeId);
  const msgs = chats[activeId] || [];
  const bottomRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chats, activeId, typing]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = (id) => { setActiveId(id); setRead(r => r.includes(id) ? r : [...r, id]); };

  const send = () => {
    if (!input.trim()) return;
    const id = activeId;
    setChats(c => ({ ...c, [id]: [...(c[id] || []), { from: "me", text: input.trim(), time: "Just now" }] }));
    setInput("");
    timers.current.push(
      setTimeout(() => setTyping(t => ({ ...t, [id]: true })), 700),
      setTimeout(() => {
        setTyping(t => ({ ...t, [id]: false }));
        setChats(c => ({ ...c, [id]: [...(c[id] || []), { from: "them", text: AUTO_REPLIES[id], time: "Just now" }] }));
      }, 2300),
    );
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: 320, borderRight: `1px solid ${T.line}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "22px 18px 14px" }}>
          <h1 className="serif" style={{ fontSize: 30, margin: "0 0 14px" }}>Inbox</h1>
          <div style={{ position: "relative" }}>
            <Search size={14} strokeWidth={SW} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.t3 }} />
            <input className="field" placeholder="Search messages" style={{ padding: "7px 10px 7px 30px", fontSize: 13 }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", borderTop: `1px solid ${T.line}` }}>
          {MESSAGES_DATA.map((m, i) => {
            const isActive = activeId === m.id;
            const unread = read.includes(m.id) ? 0 : m.unread;
            const last = (chats[m.id] || []).slice(-1)[0];
            return (
              <div key={m.id} onClick={() => open(m.id)} className={`row in ${isActive ? "active" : ""}`} style={{ padding: "14px 18px", cursor: "pointer", borderBottom: `1px solid ${T.line}`, position: "relative", ...d(80 + i * 60) }}>
                {isActive && <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: T.accent }} />}
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ position: "relative" }}>
                    <Avatar initials={m.avatar} size={36} color={m.color} />
                    {m.online && <span style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: T.green, border: `2px solid ${isActive ? T.surface2 : T.bg}` }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: unread ? 600 : 500 }}>{m.name}</span>
                      <span className="mono" style={{ fontSize: 11, color: T.t3 }}>{last?.time === "Just now" ? "now" : m.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: T.t3, marginTop: 1 }}>{m.role}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                      <div style={{ flex: 1, fontSize: 12.5, color: typing[m.id] ? T.t1 : T.t2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontStyle: typing[m.id] ? "italic" : "normal" }}>{typing[m.id] ? "typing…" : last?.text}</div>
                      {unread > 0 && <span className="mono in-pop" style={{ fontSize: 11, color: "#fff", background: T.accent, borderRadius: 4, padding: "0 5px", lineHeight: "16px" }}>{unread}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {active && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div key={`h${activeId}`} className="in-fade" style={{ padding: "14px 24px", borderBottom: `1px solid ${T.line}`, display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar initials={active.avatar} size={34} color={active.color} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{active.name}</div>
              <div style={{ fontSize: 12, color: T.t3 }}>{active.role} · {typing[activeId] ? <span style={{ color: T.t1 }}>typing…</span> : active.online ? <span style={{ color: T.green }}>online</span> : "offline"}</div>
            </div>
            <Btn size="sm"><User size={13} strokeWidth={SW} /> View profile</Btn>
          </div>

          <div key={activeId} style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {msgs.map((msg, i) => {
              const me = msg.from === "me";
              return (
                <div key={i} className={me ? "in-r" : "in-l"} style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 14, animationDelay: `${Math.min(i, 5) * 50}ms` }}>
                  <div style={{ maxWidth: "64%" }}>
                    <div style={{ padding: "10px 14px", borderRadius: me ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: me ? `linear-gradient(135deg, ${T.accent}, ${T.purple})` : T.surface2, color: me ? "#fff" : T.t1, border: me ? "none" : `1px solid ${T.line}`, fontSize: 13.5, lineHeight: 1.55 }}>{msg.text}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: T.t4, marginTop: 5, textAlign: me ? "right" : "left" }}>{msg.time}</div>
                  </div>
                </div>
              );
            })}
            {typing[activeId] && (
              <div className="in-l" style={{ display: "flex", marginBottom: 14 }}>
                <div style={{ padding: "12px 14px", background: T.surface2, border: `1px solid ${T.line}`, borderRadius: "12px 12px 12px 3px", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(k => <span key={k} style={{ width: 5, height: 5, borderRadius: "50%", background: T.t2, animation: `bounce 1.1s ${k * 0.15}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "14px 24px", borderTop: `1px solid ${T.line}`, display: "flex", gap: 8 }}>
            <input className="field" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={`Reply to ${active.name.split(" ")[0]}…`} style={{ padding: "10px 14px" }} />
            <Btn variant="accent" onClick={send} disabled={!input.trim()} title="Send"><Send size={15} strokeWidth={SW} /></Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CAREER MAP ───────────────────────────────────────────────────────────────
function ProgressionPage({ onAskGumball }) {
  const path = CAREER_PATH_DATA["Data Analyst"];
  const [sel, setSel] = useState(2);
  const mounted = useMounted(200);
  const stage = path[sel];
  const have = stage.skills.filter(s => USER_SKILLS.has(s));
  const coverage = Math.round((have.length / stage.skills.length) * 100);
  const progressPct = (1.45 / (path.length - 1)) * 100; // between "current" and "next"

  return (
    <div>
      <PageHead kicker="Career map" title="Your path to Analytics Manager" sub="Data analytics track. Pick a stage to see the skills and certifications it asks for." />

      <div className="card in" style={{ padding: "26px 12px 18px", marginBottom: 20, ...d(140) }}>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${path.length}, 1fr)` }}>
          <div style={{ position: "absolute", top: 7, left: `${50 / path.length}%`, right: `${50 / path.length}%`, height: 1, background: T.line2 }}>
            <div style={{ height: "100%", width: mounted ? `${progressPct}%` : 0, background: T.t1, transition: "width 1.2s var(--ease) .3s" }} />
          </div>
          {path.map((p, i) => {
            const isSel = sel === i;
            const done = p.status === "completed";
            const cur = p.status === "current";
            return (
              <button key={p.title} onClick={() => setSel(i)} className="in-pop" style={{ position: "relative", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: T.t1, padding: "0 6px", ...d(250 + i * 100) }}>
                <span style={{ position: "relative", width: 15, height: 15, borderRadius: "50%", display: "grid", placeItems: "center", background: done ? T.t1 : T.bg, border: `1.5px solid ${done ? T.t1 : cur ? T.accent : isSel ? T.t1 : T.line2}`, transform: isSel ? "scale(1.25)" : "scale(1)", transition: "transform .3s var(--ease), border-color .2s" }}>
                  {done && <Check size={9} strokeWidth={3.5} color={T.bg} />}
                  {cur && <span className="live" style={{ background: T.accent }} />}
                </span>
                <div style={{ padding: "8px 10px", borderRadius: 8, background: isSel ? T.surface2 : "transparent", boxShadow: isSel ? `inset 0 0 0 1px ${T.line2}` : "none", transition: "background .2s", width: "100%" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isSel ? T.t1 : p.status === "future" ? T.t3 : T.t2 }}>{p.title}</div>
                  <div className="mono" style={{ fontSize: 11, color: T.t3, marginTop: 4 }}>{p.timeline}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: cur ? T.accent : T.t4, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>{cur ? "You are here" : p.status === "next" ? "Next" : done ? "Done" : ""}&nbsp;</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div key={sel} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", gap: 20 }}>
        <div className="card in">
          <CardHead title={`${stage.title} · skills`} meta={`${have.length} of ${stage.skills.length} covered`} />
          <div style={{ padding: "14px 18px 6px", display: "flex", alignItems: "center", gap: 14 }}>
            <Bar value={coverage} color={coverage >= 60 ? T.green : coverage > 0 ? T.t1 : T.accent} height={4} />
            <span className="mono" style={{ fontSize: 12, color: T.t2 }}>{coverage}%</span>
          </div>
          <div style={{ padding: "6px 0 8px" }}>
            {stage.skills.map((s, i) => {
              const ok = USER_SKILLS.has(s);
              return (
                <div key={s} className="in" style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 18px", fontSize: 13.5, ...d(80 + i * 50) }}>
                  {ok ? <Check size={14} strokeWidth={2.5} color={T.green} /> : <Circle size={14} strokeWidth={SW} color={T.t4} />}
                  <span style={{ flex: 1, color: ok ? T.t2 : T.t1 }}>{s}</span>
                  <span className="mono" style={{ fontSize: 11, color: ok ? T.t3 : T.accent }}>{ok ? "have" : "to learn"}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card in" style={d(80)}>
          <CardHead title="Recommended certifications" />
          {stage.certs?.length ? stage.certs.map((c, i) => (
            <div key={c} className="row in" style={{ display: "flex", gap: 12, padding: "14px 18px", alignItems: "center", borderTop: i ? `1px solid ${T.line}` : "none", ...d(140 + i * 70) }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.line2}`, display: "grid", placeItems: "center", color: T.t2, flexShrink: 0 }}><Award size={15} strokeWidth={SW} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5 }}>{c}</div>
                <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>Closes gaps for {stage.title}</div>
              </div>
              <Btn size="sm">Enroll</Btn>
            </div>
          )) : (
            <div style={{ padding: "28px 18px", fontSize: 13.5, color: T.t3, lineHeight: 1.6 }}>
              {stage.status === "completed" ? "You've cleared this stage." : "No certifications needed here — this stage is about leadership and track record."}
            </div>
          )}
        </div>
      </div>

      <div className="card in" style={{ marginTop: 20, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center", ...d(220) }}>
        <GMark size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Not sure what to tackle first?</div>
          <div style={{ fontSize: 13, color: T.t3, marginTop: 2 }}>Gumball can turn these gaps into a week-by-week plan.</div>
        </div>
        <Btn variant="accent" onClick={onAskGumball}>Make a plan <ArrowRight size={14} className="arrow" /></Btn>
      </div>
    </div>
  );
}

// ─── GUMBALL ──────────────────────────────────────────────────────────────────
// Used when the live API can't be reached (no backend proxy / API key during a demo)
function gumballFallback(msg) {
  const m = msg.toLowerCase();
  if (m.includes("resume") || m.includes("cv")) return "A few quick wins for your resume:\n\n• Lead each bullet with an impact number, e.g. \"cut reporting time 40%\"\n• Move the Churn Predictor near the top — it shows end-to-end ML\n• Mirror keywords from the job post (SQL, dashboards, stakeholder reporting)\n• Keep it to one page and export the ATS-safe template for online portals";
  if (m.includes("skill") || m.includes("learn")) return "For the Data Analyst stage, I'd focus on:\n\n• dbt — analytics engineering is showing up in more job posts\n• Advanced SQL: window functions and CTEs\n• A/B testing and experiment design\n\nPick one and ship a small project with it. That carries more weight than a certificate on its own.";
  if (m.includes("interview")) return "A solid prep plan:\n\n• SQL: joins, GROUP BY and window functions under time pressure\n• Case questions: \"Sales dropped 10% — how would you investigate?\"\n• Walk through your Churn Predictor using STAR\n• Prepare 2–3 questions about their data stack\n\nWant me to run a mock question with you?";
  if (m.includes("cert")) return "For Data Analyst roles in Malaysia, these carry the most weight:\n\n• Google Data Analytics — you're 78% there, finish it first\n• Microsoft Power BI Data Analyst (PL-300)\n• Databricks Data Analyst Associate\n\nAWS Cloud Practitioner is a nice extra if you're aiming at cloud-heavy teams.";
  if (m.includes("plan") || m.includes("week")) return "Here's a 4-week plan based on your gaps:\n\n• Week 1 — finish Google Data Analytics (about 6 hours left)\n• Week 2 — learn dbt basics; rebuild your sales dashboard pipeline in it\n• Week 3 — design and analyse a mock A/B test, write it up\n• Week 4 — update resume and portfolio, reply to Sarah about the Grab referral";
  return "With Python, SQL and Tableau you're in a good spot for Data Analyst roles. What would help most right now — skills, your resume, interviews, or certifications?";
}

const SUGGESTIONS = ["Make me a 4-week plan", "What skills should I learn next?", "How can I improve my resume?", "Which certifications matter most?"];

function GumballChat({ minimized, onMinimize, onClose }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi Ahmad. I'm Gumball, your career mentor. I've read your profile — CS at UPM, aiming for Data Analyst, strong on Python, SQL and Tableau.\n\nWhat would you like to work on?" },
  ]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const scrollDown = useCallback(() => bottomRef.current?.scrollIntoView({ block: "end" }), []);

  useEffect(() => { if (!minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, minimized, loading]);
  useEffect(() => { if (!minimized) inputRef.current?.focus(); }, [minimized]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const systemPrompt = `You are Gumball, a friendly, practical AI career mentor for a platform called CareerOrbit. You're talking with Ahmad Razif, a final-year Computer Science student at UPM Malaysia who is a job seeker targeting Data Analyst roles. His skills include Python, SQL, Tableau, Pandas, and Machine Learning. He has internship experience at TechCorp and is 78% through the Google Data Analytics certificate. Keep responses conversational, specific and encouraging. Use short bullet points for lists. Keep answers under 150 words. Do not use emojis.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.slice(1).map(m => ({ role: m.role, content: m.text })),
            { role: "user", content: msg },
          ],
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const reply = data.content?.[0]?.text;
      if (!reply) throw new Error("Empty reply");
      setMessages(m => [...m, { role: "assistant", text: reply }]);
    } catch {
      await new Promise(r => setTimeout(r, 650));
      setMessages(m => [...m, { role: "assistant", text: gumballFallback(msg), offline: true }]);
    }
    setLoading(false);
  };

  if (minimized) return (
    <button onClick={onMinimize} className="btn btn-secondary in-pop" style={{ position: "fixed", bottom: 20, right: 20, padding: "8px 14px 8px 8px", borderRadius: 99, zIndex: 1000, boxShadow: "0 12px 32px rgba(0,0,0,0.5)", fontSize: 13 }}>
      <GMark size={24} /> Gumball {loading && <Loader2 size={13} className="spin" />}
    </button>
  );

  return (
    <div className="panel-in" style={{ position: "fixed", bottom: 20, right: 20, width: 388, height: 580, background: T.surface, border: `1px solid ${T.line2}`, borderRadius: 12, display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.55)", zIndex: 1000, overflow: "hidden" }}>
      <div style={{ padding: "12px 12px 12px 16px", borderBottom: `1px solid ${T.line}`, display: "flex", gap: 12, alignItems: "center" }}>
        <GMark size={28} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Gumball</div>
          <div style={{ fontSize: 11.5, color: T.t3, display: "flex", alignItems: "center", gap: 7 }}>
            {loading ? <><Loader2 size={11} className="spin" /> thinking</> : <><span className="live" /> Career mentor · knows your profile</>}
          </div>
        </div>
        <IconBtn icon={Minus} title="Minimise" onClick={onMinimize} />
        <IconBtn icon={X} title="Close" onClick={onClose} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px" }}>
        {messages.map((msg, i) => msg.role === "user" ? (
          <div key={i} className="in-r" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <div style={{ maxWidth: "82%", padding: "9px 13px", borderRadius: "12px 12px 3px 12px", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, color: "#fff", fontSize: 13, lineHeight: 1.55 }}>{msg.text}</div>
          </div>
        ) : (
          <div key={i} className="in-fade" style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <GMark size={20} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, lineHeight: 1.65, color: T.t1, whiteSpace: "pre-wrap" }}>
                <TypeText key={i} text={msg.text} onTick={i === messages.length - 1 ? scrollDown : undefined} />
              </div>
              {msg.offline && <div className="mono" style={{ fontSize: 10.5, color: T.t4, marginTop: 6 }}>offline demo reply</div>}
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="in" style={{ marginLeft: 30, border: `1px solid ${T.line}`, borderRadius: 8, overflow: "hidden", ...d(700) }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={s} onClick={() => send(s)} className="row" style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, padding: "9px 12px", background: "transparent", border: "none", borderTop: i ? `1px solid ${T.line}` : "none", color: T.t2, fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                <span style={{ flex: 1 }}>{s}</span><ArrowUpRight size={13} color={T.t3} />
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="in-fade" style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <GMark size={20} />
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map(k => <span key={k} style={{ width: 5, height: 5, borderRadius: "50%", background: T.t2, animation: `bounce 1.1s ${k * 0.15}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${T.line}`, display: "flex", gap: 8 }}>
        <input ref={inputRef} className="field" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about skills, resumes, interviews…" style={{ padding: "9px 12px", fontSize: 13 }} />
        <Btn variant="accent" onClick={() => send()} disabled={!input.trim() || loading} title="Send"><Send size={14} strokeWidth={SW} /></Btn>
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("auth"); // auth | onboarding | resume | app

  return (
    <div key={screen} className="in-fade">
      {screen === "auth" && <AuthPage onAuth={type => setScreen(type === "new" ? "onboarding" : "app")} />}
      {screen === "onboarding" && <Onboarding onDone={() => setScreen("resume")} />}
      {screen === "resume" && <ResumeUpload onDone={() => setScreen("app")} />}
      {screen === "app" && <Shell onLogout={() => setScreen("auth")} />}
    </div>
  );
}
