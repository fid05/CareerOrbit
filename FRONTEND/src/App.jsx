import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: "#070810",
  surface: "#0E0F1A",
  surfaceHover: "#13152A",
  border: "#1C1D2E",
  borderAccent: "#2A2B45",
  accent: "#5B6EF5",
  accentLight: "#7B8AF8",
  accentGlow: "rgba(91,110,245,0.15)",
  accentGlow2: "rgba(91,110,245,0.08)",
  green: "#22D17A",
  greenDim: "rgba(34,209,122,0.12)",
  amber: "#F5A623",
  amberDim: "rgba(245,166,35,0.12)",
  red: "#F04D4D",
  redDim: "rgba(240,77,77,0.1)",
  purple: "#9B6EF5",
  purpleGlow: "rgba(155,110,245,0.12)",
  t1: "#F0F0FA",
  t2: "#9899B8",
  t3: "#5C5D80",
  t4: "#33345A",
};

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

const CAREERS = [
  { id: 1, title: "Software Engineer", icon: "💻", level: "Junior–Senior", field: "Software Engineering", salary: "RM 5,000–15,000", demand: 97, description: "Design, develop, and maintain scalable software systems. Work in agile teams shipping products used by thousands.", skills: ["JavaScript", "Python", "React", "Node.js", "Git", "Docker"], tools: ["VS Code", "GitHub", "Jira", "Postman"], companies: ["Grab", "Shopee", "Fusionex", "iPay88", "Revenue Monster", "Axiata Digital"], responsibilities: ["Build and ship features end-to-end", "Code review and technical mentorship", "System design and architecture", "Performance optimization"], certs: ["AWS Solutions Architect", "Google Cloud Professional", "Meta Frontend Developer"] },
  { id: 2, title: "Data Analyst", icon: "📊", level: "Junior–Senior", field: "Data Science", salary: "RM 4,500–10,000", demand: 92, description: "Transform raw data into business intelligence. Build dashboards, run analyses, and drive data-informed decisions.", skills: ["Python", "SQL", "Tableau", "Excel", "Statistics", "Power BI"], tools: ["Tableau", "Power BI", "Jupyter", "PostgreSQL"], companies: ["CIMB", "Petronas", "Shopee", "Grab", "Maxis", "Digi"], responsibilities: ["Build reporting dashboards", "Statistical analysis and A/B testing", "Data pipeline management", "Stakeholder presentations"], certs: ["Google Data Analytics", "Databricks Associate", "Microsoft Power BI"] },
  { id: 3, title: "Cybersecurity Analyst", icon: "🔐", level: "Junior–Senior", field: "Cybersecurity", salary: "RM 5,000–13,000", demand: 94, description: "Protect digital infrastructure. Monitor threats, respond to incidents, and harden systems against attacks.", skills: ["Linux", "Penetration Testing", "SIEM", "Python", "Network Security", "Compliance"], tools: ["Splunk", "Wireshark", "Metasploit", "Nmap"], companies: ["CyberSecurity Malaysia", "Telekom MY", "MIMOS", "RHB Bank", "KPMG MY"], responsibilities: ["Security monitoring and incident response", "Vulnerability assessments", "Security policy implementation", "Threat hunting"], certs: ["CompTIA Security+", "CEH", "CISSP", "OSCP"] },
  { id: 4, title: "UX Designer", icon: "🎨", level: "Junior–Senior", field: "UI/UX Design", salary: "RM 4,500–11,000", demand: 86, description: "Craft user-centered experiences. Own the full design process from research to final handoff.", skills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"], tools: ["Figma", "Maze", "Hotjar", "Notion"], companies: ["Carsome", "PropertyGuru", "AirAsia", "Lazada MY", "GoGet"], responsibilities: ["User research and persona creation", "Information architecture", "Hi-fi prototyping", "Design system maintenance"], certs: ["Google UX Design", "Interaction Design Foundation", "Nielsen Norman UX"] },
  { id: 5, title: "Cloud Engineer", icon: "☁️", level: "Mid–Senior", field: "Cloud Computing", salary: "RM 7,000–18,000", demand: 95, description: "Architect and manage cloud infrastructure. Build the foundation that modern products run on.", skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Linux", "CI/CD"], tools: ["AWS Console", "Terraform", "ArgoCD", "Grafana"], companies: ["TM One", "AWS Malaysia", "Microsoft MY", "Accenture MY"], responsibilities: ["Cloud infrastructure provisioning", "CI/CD pipeline management", "Cost optimization", "Reliability engineering"], certs: ["AWS Solutions Architect", "CKA Kubernetes", "HashiCorp Terraform"] },
  { id: 6, title: "AI/ML Engineer", icon: "🤖", level: "Mid–Senior", field: "Artificial Intelligence", salary: "RM 8,000–20,000", demand: 99, description: "Build production AI systems. From model training to deployment, you bridge research and real-world applications.", skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "SQL", "Docker"], tools: ["Jupyter", "MLflow", "Hugging Face", "Weights & Biases"], companies: ["Carsome AI", "CtrlF+", "DataMicron", "Mindvalley Tech"], responsibilities: ["Model development and training", "ML pipeline engineering", "Production model deployment", "Experimentation infrastructure"], certs: ["Google ML Engineer", "AWS ML Specialty", "DeepLearning.AI"] },
];

const CAREER_PATH_DATA = {
  "Data Analyst": [
    { title: "Data Intern", status: "completed", skills: ["Excel", "Basic SQL", "Data Entry", "Reporting"], timeline: "0–6 months" },
    { title: "Junior Data Analyst", status: "current", skills: ["Python", "SQL", "Tableau", "Statistics", "Data Cleaning"], timeline: "6mo–2yr" },
    { title: "Data Analyst", status: "next", skills: ["Advanced Python", "ML Basics", "Stakeholder Management", "A/B Testing", "dbt"], certs: ["Google Advanced Data Analytics", "Databricks Associate"], timeline: "2–4 years" },
    { title: "Senior Data Analyst", status: "future", skills: ["Team Leadership", "Cloud Platforms", "Strategy", "ML Integration", "Executive Comms"], certs: ["AWS Data Analytics Specialty"], timeline: "4–6 years" },
    { title: "Analytics Manager", status: "future", skills: ["People Management", "Budget Planning", "Product Strategy", "Org Design"], certs: [], timeline: "6+ years" },
  ],
};

const PORTFOLIO_ITEMS = [
  { id: 1, title: "E-Commerce Sales Dashboard", type: "Project", tech: ["Python", "Tableau", "SQL", "Pandas"], desc: "Interactive BI dashboard analyzing 500K+ transactions with automated daily refresh pipeline.", emoji: "📈", views: 312, github: "github.com/ahmad/sales-dash", featured: true },
  { id: 2, title: "AWS Cloud Practitioner", type: "Certificate", tech: ["AWS"], desc: "Issued by Amazon Web Services • Verified Jun 2024 • Credential ID: AWS-001234", emoji: "🏅", views: 128, featured: true },
  { id: 3, title: "Customer Churn Predictor", type: "Project", tech: ["Python", "Scikit-learn", "Pandas", "Flask"], desc: "ML classification model achieving 87% accuracy. Deployed as REST API on AWS Lambda.", emoji: "🤖", views: 245, github: "github.com/ahmad/churn-model" },
  { id: 4, title: "Google Data Analytics", type: "Certificate", tech: ["SQL", "R", "Tableau", "Spreadsheets"], desc: "Issued by Google via Coursera • Verified Mar 2024 • 6-month professional certificate", emoji: "🏆", views: 189 },
];

const MESSAGES_DATA = [
  { id: 1, name: "Sarah Lim", role: "Senior Data Scientist @ Grab", avatar: "SL", color: "#5B6EF5", online: true, unread: 2, lastMsg: "Hey, reviewed your portfolio — your churn model is impressive! Want to chat?", time: "2m ago",
    history: [
      { from: "them", text: "Hi Ahmad! I came across your profile and your customer churn predictor project caught my eye.", time: "Yesterday 2:30 PM" },
      { from: "me", text: "Thank you Sarah! It was a 3-month project where I deployed the model to production using Flask + AWS Lambda.", time: "Yesterday 2:45 PM" },
      { from: "them", text: "Impressive! We actually have an opening for a Junior Data Analyst at Grab. Would you be open to a referral?", time: "Yesterday 3:00 PM" },
      { from: "them", text: "Hey, reviewed your portfolio — your churn model is impressive! Want to chat?", time: "2m ago" },
    ]
  },
  { id: 2, name: "Wei Chen", role: "Tech Recruiter @ Shopee", avatar: "WC", color: "#F04D4D", online: false, unread: 0, lastMsg: "Following up on the Data Analyst position we discussed last week.", time: "1h ago",
    history: [
      { from: "them", text: "Hi Ahmad, I'm Wei from Shopee's talent team. We have a Data Analyst role that matches your profile.", time: "3 days ago" },
      { from: "me", text: "Hi Wei, thanks for reaching out! I'd be very interested to hear more about the role.", time: "3 days ago" },
      { from: "them", text: "Following up on the Data Analyst position we discussed last week.", time: "1h ago" },
    ]
  },
  { id: 3, name: "Marcus Tan", role: "Product Manager @ StoreHub", avatar: "MT", color: "#22D17A", online: true, unread: 1, lastMsg: "Your portfolio link is impressive. Can you share your resume as well?", time: "3h ago",
    history: [
      { from: "them", text: "Your portfolio link is impressive. Can you share your resume as well?", time: "3h ago" },
    ]
  },
];

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const icons = {
  home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  compass: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  folder: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  message: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  map: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  bot: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  star: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  starFill: <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  chevUp: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>,
  chevRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  send: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  upload: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  eye: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  lock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  mail: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>,
  person: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  sparkle: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  bell: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  settings: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  github: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>,
  minimize: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};
const Ic = ({ n, size }) => {
  const el = icons[n];
  if (!el) return null;
  if (size) return <span style={{ display: "inline-flex", width: size, height: size }}>{el}</span>;
  return <span style={{ display: "inline-flex" }}>{el}</span>;
};

// ─── SHARED UI COMPONENTS ──────────────────────────────────────────────────────
const Btn = ({ children, variant = "primary", onClick, disabled, style = {}, size = "md" }) => {
  const pad = size === "sm" ? "7px 14px" : size === "lg" ? "13px 28px" : "10px 20px";
  const fs = size === "sm" ? 11 : size === "lg" ? 14 : 12;
  const styles = {
    primary: { background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, color: "#fff", border: "none" },
    secondary: { background: "transparent", color: T.t2, border: `1px solid ${T.border}` },
    ghost: { background: "transparent", color: T.accent, border: `1px solid ${T.accentGlow}` },
    danger: { background: T.redDim, color: T.red, border: `1px solid ${T.red}33` },
    success: { background: T.greenDim, color: T.green, border: `1px solid ${T.green}33` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding: pad, borderRadius: 8, fontSize: fs, fontWeight: 600, cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s, transform 0.1s", opacity: disabled ? 0.45 : 1, ...styles[variant], ...style }}>
      {children}
    </button>
  );
};

const Tag = ({ children, color = T.accent }) => (
  <span style={{ fontSize: 11, fontWeight: 500, color, background: `${color}18`, border: `1px solid ${color}28`, padding: "3px 9px", borderRadius: 5 }}>{children}</span>
);

const Badge = ({ n }) => n > 0 ? <span style={{ background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99, minWidth: 18, textAlign: "center" }}>{n}</span> : null;

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, ...style }}>{children}</div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, icon, style = {} }) => (
  <div style={{ marginBottom: 16, ...style }}>
    {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.t3, marginBottom: 6, letterSpacing: 0.3 }}>{label}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.t3, pointerEvents: "none" }}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", padding: icon ? "10px 12px 10px 36px" : "10px 12px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.t1, fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
    </div>
  </div>
);

// ─── PAGE SECTIONS ─────────────────────────────────────────────────────────────
function PageHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.accent, marginBottom: 6 }}>{eyebrow}</div>}
      <h1 style={{ fontSize: 24, fontWeight: 800, color: T.t1, letterSpacing: -0.6, margin: 0, marginBottom: sub ? 6 : 0 }}>{title}</h1>
      {sub && <p style={{ fontSize: 13, color: T.t3, margin: 0 }}>{sub}</p>}
    </div>
  );
}

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = () => {
    setError("");
    if (mode === "register") {
      if (!form.name || !form.email || !form.password) return setError("Please fill in all fields.");
      if (form.password !== form.confirm) return setError("Passwords do not match.");
    }
    if (mode === "login" && (!form.email || !form.password)) return setError("Enter your email and password.");
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth(mode === "register" ? "new" : "existing"); }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, background: "radial-gradient(circle, rgba(91,110,245,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(155,110,245,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>C</div>
            <span style={{ fontSize: 20, fontWeight: 800, color: T.t1, letterSpacing: -0.5 }}>CareerPath</span>
          </div>
          <p style={{ fontSize: 13, color: T.t3, margin: 0 }}>Your AI-powered career companion</p>
        </div>

        <Card style={{ padding: "32px 28px" }}>
          {/* Mode Tabs */}
          {mode !== "forgot" && (
            <div style={{ display: "flex", background: T.bg, borderRadius: 9, padding: 3, marginBottom: 24 }}>
              {[["login", "Sign In"], ["register", "Create Account"]].map(([m, l]) => (
                <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "8px", borderRadius: 7, border: "none", background: mode === m ? T.surface : "transparent", color: mode === m ? T.t1 : T.t3, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{l}</button>
              ))}
            </div>
          )}

          {mode === "forgot" && (
            <div style={{ marginBottom: 24 }}>
              <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: T.t3, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 16 }}>← Back to sign in</button>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.t1, marginBottom: 4 }}>Reset Password</div>
              <div style={{ fontSize: 12, color: T.t3 }}>Enter your email and we'll send a reset link.</div>
            </div>
          )}

          {error && <div style={{ background: T.redDim, border: `1px solid ${T.red}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: T.red, marginBottom: 16 }}>{error}</div>}

          {mode === "register" && <Input label="Full Name" placeholder="Ahmad Razif" value={form.name} onChange={e => set("name", e.target.value)} icon={<Ic n="person" />} />}
          <Input label="Email Address" type="email" placeholder="you@email.com" value={form.email} onChange={e => set("email", e.target.value)} icon={<Ic n="mail" />} />
          {mode !== "forgot" && <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} icon={<Ic n="lock" />} />}
          {mode === "register" && <Input label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set("confirm", e.target.value)} icon={<Ic n="lock" />} />}

          {mode === "login" && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: -4 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: T.t3, cursor: "pointer" }}>
                <input type="checkbox" checked={form.remember} onChange={e => set("remember", e.target.checked)} style={{ accentColor: T.accent }} />
                Remember me
              </label>
              <button onClick={() => setMode("forgot")} style={{ background: "none", border: "none", color: T.accent, fontSize: 12, cursor: "pointer", padding: 0 }}>Forgot password?</button>
            </div>
          )}

          <Btn onClick={handle} disabled={loading} size="lg" style={{ width: "100%", justifyContent: "center" }}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Send Reset Link"}
            {!loading && <Ic n="arrow" />}
          </Btn>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 11, color: T.t4 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {[["G", "Google", "#EA4335"], ["", "GitHub", "#fff"]].map(([ico, lbl, clr]) => (
              <button key={lbl} style={{ flex: 1, padding: "9px 12px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, color: T.t2, fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                {lbl === "Google" ? <span style={{ color: clr, fontWeight: 800, fontSize: 13 }}>G</span> : <Ic n="github" />}
                {lbl} <span style={{ fontSize: 10, color: T.t4 }}>(Soon)</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── ONBOARDING ────────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ status: "", field: "", skills: [], interests: [], customSkill: "", customInterest: "" });

  const steps = [
    { title: "What's your current status?", sub: "This helps us tailor your career recommendations.", field: "status", opts: [{ v: "Intern", e: "🎓", d: "Currently interning or seeking internship roles" }, { v: "Job Seeker", e: "💼", d: "Looking for full-time employment opportunities" }], single: true },
    { title: "What's your study or career field?", sub: "We'll use this to map skills and career paths.", field: "field", opts: Object.keys(FIELD_SKILLS).map(f => ({ v: f, e: "📚" })), single: true },
    { title: "Select your skills", sub: "Pick all that apply — you can add custom ones too.", field: "skills", opts: (FIELD_SKILLS[data.field] || []).map(s => ({ v: s })), single: false, custom: "customSkill" },
    { title: "What are your interests?", sub: "We'll match you with careers that fit your passions.", field: "interests", opts: (FIELD_INTERESTS[data.field] || []).map(s => ({ v: s })), single: false, custom: "customInterest" },
  ];

  const s = steps[step];
  const val = data[s.field];
  const canNext = s.single ? val !== "" : val.length > 0;

  const toggle = (v) => {
    if (s.single) { setData(d => ({ ...d, [s.field]: v })); }
    else { setData(d => ({ ...d, [s.field]: d[s.field].includes(v) ? d[s.field].filter(x => x !== v) : [...d[s.field], v] })); }
  };

  const addCustom = () => {
    const cv = data[s.custom].trim();
    if (cv && !data[s.field].includes(cv)) {
      setData(d => ({ ...d, [s.field]: [...d[s.field], cv], [s.custom]: "" }));
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(91,110,245,0.07), transparent)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 580, padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
          {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? T.accent : T.border, transition: "background 0.3s" }} />)}
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: T.accent, textTransform: "uppercase", marginBottom: 8 }}>Step {step + 1} of {steps.length}</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: T.t1, letterSpacing: -0.5, marginBottom: 8 }}>{s.title}</h2>
        <p style={{ fontSize: 13, color: T.t3, marginBottom: 28 }}>{s.sub}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: s.custom ? 16 : 32 }}>
          {s.opts.map(opt => {
            const active = s.single ? val === opt.v : val.includes(opt.v);
            return (
              <button key={opt.v} onClick={() => toggle(opt.v)} style={{ padding: s.single ? "12px 18px" : "9px 16px", borderRadius: 10, border: `1.5px solid ${active ? T.accent : T.border}`, background: active ? T.accentGlow : T.surface, color: active ? T.accentLight : T.t2, fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: opt.e ? 8 : 6 }}>
                {opt.e && <span>{opt.e}</span>}
                {active && !s.single && <Ic n="check" />}
                <span>{opt.v}</span>
                {s.single && opt.d && <span style={{ fontSize: 11, color: T.t3, marginLeft: 4 }}>— {opt.d}</span>}
              </button>
            );
          })}
        </div>

        {s.custom && (
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            <input value={data[s.custom]} onChange={e => setData(d => ({ ...d, [s.custom]: e.target.value }))} onKeyDown={e => e.key === "Enter" && addCustom()} placeholder={`Add custom ${s.field === "skills" ? "skill" : "interest"}…`} style={{ flex: 1, padding: "9px 12px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.t1, fontSize: 13, outline: "none" }} />
            <Btn onClick={addCustom} variant="ghost" size="sm"><Ic n="plus" /> Add</Btn>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {step > 0 ? <Btn variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Btn> : <div />}
          <Btn onClick={() => canNext && (step < steps.length - 1 ? setStep(s => s + 1) : onDone(data))} disabled={!canNext} size="lg">
            {step === steps.length - 1 ? "Set Up Profile" : "Continue"} <Ic n="arrow" />
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── RESUME UPLOAD ─────────────────────────────────────────────────────────────
function ResumeUpload({ onDone }) {
  const [mode, setMode] = useState(null); // null | uploading | parsed | manual
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    setMode("uploading");
    const iv = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(iv); setMode("parsed"); return 100; } return p + 8; }), 120);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 560, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: T.accent, textTransform: "uppercase", marginBottom: 8 }}>Profile Setup</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: T.t1, letterSpacing: -0.5, marginBottom: 8 }}>Initialize Your Profile</h2>
          <p style={{ fontSize: 13, color: T.t3 }}>Upload your resume for automatic setup, or build manually.</p>
        </div>

        {mode === null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card style={{ padding: "28px", cursor: "pointer", border: `1.5px solid ${T.accent}`, background: T.accentGlow2 }} onClick={handleUpload}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: T.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📄</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.t1, marginBottom: 4 }}>Upload Resume (PDF)</div>
                  <div style={{ fontSize: 12, color: T.t3, lineHeight: 1.6 }}>AI automatically extracts your name, education, skills, experience, and projects to build your profile instantly.</div>
                  <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["Name", "Education", "Skills", "Experience", "Certifications", "Projects"].map(t => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
              </div>
            </Card>
            <Card style={{ padding: "20px", cursor: "pointer" }} onClick={() => onDone()}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✏️</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.t1, marginBottom: 2 }}>Set Up Manually</div>
                  <div style={{ fontSize: 12, color: T.t3 }}>Fill in your profile details step by step.</div>
                </div>
                <div style={{ marginLeft: "auto", color: T.t3 }}><Ic n="chevRight" /></div>
              </div>
            </Card>
          </div>
        )}

        {mode === "uploading" && (
          <Card style={{ padding: "36px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>⚙️</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.t1, marginBottom: 6 }}>Parsing your resume…</div>
            <div style={{ fontSize: 12, color: T.t3, marginBottom: 20 }}>Extracting skills, experience, and education</div>
            <div style={{ height: 6, background: T.border, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${T.accent}, ${T.purple})`, borderRadius: 99, transition: "width 0.1s" }} />
            </div>
            <div style={{ fontSize: 11, color: T.t3, marginTop: 8 }}>{progress}%</div>
          </Card>
        )}

        {mode === "parsed" && (
          <Card style={{ padding: "28px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, background: T.greenDim, display: "flex", alignItems: "center", justifyContent: "center", color: T.green }}><Ic n="check" /></div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>Resume parsed successfully!</div>
                <div style={{ fontSize: 12, color: T.t3 }}>Review the extracted data below</div>
              </div>
            </div>
            {[["Name", "Ahmad Razif bin Abdullah"], ["Email", "ahmad.razif@email.com"], ["Education", "B.Sc. Computer Science, UPM (2021–2025)"], ["Skills extracted", "Python, SQL, Tableau, Pandas, Machine Learning, Git"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", padding: "8px 0", borderBottom: `1px solid ${T.border}`, gap: 12 }}>
                <span style={{ fontSize: 12, color: T.t3, minWidth: 120 }}>{k}</span>
                <span style={{ fontSize: 12, color: T.t1 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 20 }}><Btn onClick={() => onDone()} size="lg" style={{ width: "100%", justifyContent: "center" }}>Confirm & Enter Dashboard <Ic n="arrow" /></Btn></div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── MAIN SHELL ────────────────────────────────────────────────────────────────
function Shell({ onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [favs, setFavs] = useState([1, 2]);
  const [gumballOpen, setGumballOpen] = useState(false);
  const [gumballMin, setGumballMin] = useState(false);
  const [unreadMsgs] = useState(3);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "discover", label: "Discover", icon: "compass" },
    { id: "profile", label: "Profile", icon: "user" },
    { id: "portfolio", label: "Portfolio", icon: "folder" },
    { id: "resume", label: "Resume", icon: "file" },
    { id: "inbox", label: "Inbox", icon: "message", badge: unreadMsgs },
    { id: "progression", label: "Career Map", icon: "map" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: T.t1, overflow: "hidden" }}>
      {/* SIDEBAR */}
      <nav style={{ width: 210, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "22px 18px 18px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff" }}>C</div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.4 }}>CareerPath</div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {nav.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer", background: page === item.id ? T.accentGlow : "transparent", color: page === item.id ? T.accentLight : T.t3, fontSize: 13, fontWeight: page === item.id ? 600 : 400, borderLeft: `2px solid ${page === item.id ? T.accent : "transparent"}`, transition: "all 0.15s", textAlign: "left", width: "100%", justifyContent: "flex-start" }}>
              <Ic n={item.icon} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && <Badge n={item.badge} />}
            </button>
          ))}
        </div>

        {/* Gumball button */}
        <div style={{ padding: "12px 10px", borderTop: `1px solid ${T.border}` }}>
          <button onClick={() => { setGumballOpen(true); setGumballMin(false); }} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 10px", borderRadius: 8, border: `1px solid ${T.accent}44`, background: T.accentGlow2, color: T.accentLight, fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", justifyContent: "flex-start" }}>
            <span style={{ fontSize: 16 }}>🤖</span> Ask Gumball
          </button>
        </div>

        {/* User */}
        <div style={{ padding: "12px 10px 16px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: T.bg, borderRadius: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>A</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Ahmad Razif</div>
              <div style={{ fontSize: 10, color: T.t3 }}>Job Seeker</div>
            </div>
            <button onClick={onLogout} style={{ background: "none", border: "none", color: T.t4, cursor: "pointer", padding: 2 }}><Ic n="settings" /></button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ height: 54, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 28px", justifyContent: "space-between", flexShrink: 0, background: T.surface }}>
          <div style={{ fontSize: 13, color: T.t3 }}>
            {nav.find(n => n.id === page)?.label}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button style={{ background: "none", border: "none", color: T.t3, cursor: "pointer", position: "relative" }}>
              <Ic n="bell" />
              <span style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, background: T.accent, borderRadius: "50%", border: `1px solid ${T.surface}` }} />
            </button>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>A</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
          {page === "dashboard" && <DashboardPage favs={favs} />}
          {page === "discover" && <DiscoverPage favs={favs} setFavs={setFavs} />}
          {page === "profile" && <ProfilePage />}
          {page === "portfolio" && <PortfolioPage />}
          {page === "resume" && <ResumePage />}
          {page === "inbox" && <InboxPage />}
          {page === "progression" && <ProgressionPage />}
        </div>
      </main>

      {/* GUMBALL AI CHAT */}
      {gumballOpen && <GumballChat minimized={gumballMin} onMinimize={() => setGumballMin(m => !m)} onClose={() => setGumballOpen(false)} />}
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardPage({ favs }) {
  const stats = [
    { label: "Profile Views", v: "128", delta: "+23%", color: T.accent, e: "👁" },
    { label: "Resume Downloads", v: "34", delta: "+8%", color: T.green, e: "📄" },
    { label: "Skill Coverage", v: "76%", delta: "+5pts", color: T.amber, e: "⚡" },
    { label: "Saved Careers", v: favs.length, delta: "Active", color: T.purple, e: "⭐" },
  ];
  const tasks = [
    { text: "Complete AWS Cloud Practitioner course", done: false, p: "high" },
    { text: "Add portfolio project — Churn Predictor", done: true, p: "done" },
    { text: "Follow up with Grab recruiter", done: false, p: "medium" },
    { text: "Update LinkedIn profile headline", done: false, p: "low" },
  ];
  const pColor = { high: T.red, medium: T.amber, low: T.t3, done: T.green };

  return (
    <div style={{ maxWidth: 1060 }}>
      <PageHeader eyebrow="Overview" title="Good morning, Ahmad 👋" sub="You have 3 unread messages and 3 action items pending" />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding: "20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, background: `${s.color}10`, borderRadius: "0 14px 0 50px" }} />
            <div style={{ fontSize: 22, marginBottom: 10 }}>{s.e}</div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: T.t3, marginBottom: 8 }}>{s.label}</div>
            <Tag color={s.color}>{s.delta}</Tag>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        {/* Action Items */}
        <Card style={{ padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Action Items</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {tasks.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: T.bg, borderRadius: 9, alignItems: "flex-start", opacity: t.done ? 0.5 : 1 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${t.done ? T.green : T.border}`, background: t.done ? T.greenDim : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, color: T.green }}>
                  {t.done && <Ic n="check" />}
                </div>
                <span style={{ fontSize: 12, color: t.done ? T.t3 : T.t2, flex: 1, textDecoration: t.done ? "line-through" : "none", lineHeight: 1.5 }}>{t.text}</span>
                {!t.done && <span style={{ fontSize: 10, fontWeight: 700, color: pColor[t.p] }}>{t.p}</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* Career Progress */}
        <Card style={{ padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Certification Progress</div>
          {[
            { name: "Google Data Analytics", pct: 78, color: T.accent },
            { name: "AWS Cloud Practitioner", pct: 42, color: T.amber },
            { name: "Databricks Associate", pct: 15, color: T.purple },
          ].map(c => (
            <div key={c.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: T.t2 }}>{c.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.pct}%</span>
              </div>
              <div style={{ height: 4, background: T.border, borderRadius: 99 }}>
                <div style={{ width: `${c.pct}%`, height: "100%", background: c.color, borderRadius: 99, transition: "width 0.8s ease" }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── DISCOVER ─────────────────────────────────────────────────────────────────
function DiscoverPage({ favs, setFavs }) {
  const [expanded, setExpanded] = useState(null);
  const [q, setQ] = useState("");
  const filtered = CAREERS.filter(c => c.title.toLowerCase().includes(q.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(q.toLowerCase())));

  return (
    <div style={{ maxWidth: 900 }}>
      <PageHeader eyebrow="Career Discovery" title="Find Your Path" sub="AI-matched careers based on your skills and interests" />

      <div style={{ position: "relative", maxWidth: 440, marginBottom: 24 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.t3, pointerEvents: "none" }}><Ic n="search" /></span>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search careers or skills…" style={{ width: "100%", padding: "10px 12px 10px 36px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 9, color: T.t1, fontSize: 13, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(c => {
          const isFav = favs.includes(c.id);
          const isExp = expanded === c.id;
          return (
            <div key={c.id} style={{ background: T.surface, border: `1.5px solid ${isExp ? T.accent : T.border}`, borderRadius: 13, overflow: "hidden", transition: "border-color 0.2s" }}>
              <div onClick={() => setExpanded(isExp ? null : c.id)} style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: T.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{c.title}</span>
                    <Tag color={T.accent}>{c.level}</Tag>
                  </div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {c.skills.slice(0, 4).map(s => <span key={s} style={{ fontSize: 11, color: T.t3, background: T.bg, padding: "2px 7px", borderRadius: 4 }}>{s}</span>)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: T.t3, marginBottom: 3 }}>Market Demand</div>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <div style={{ width: 52, height: 3, background: T.border, borderRadius: 99 }}><div style={{ width: `${c.demand}%`, height: "100%", background: T.accent, borderRadius: 99 }} /></div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T.accent }}>{c.demand}%</span>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setFavs(f => f.includes(c.id) ? f.filter(x => x !== c.id) : [...f, c.id]); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <Ic n={isFav ? "starFill" : "star"} />
                  </button>
                  <div style={{ color: T.t3 }}>{isExp ? <Ic n="chevUp" /> : <Ic n="chevDown" />}</div>
                </div>
              </div>

              {isExp && (
                <div style={{ borderTop: `1px solid ${T.border}`, padding: "20px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
                  <p style={{ fontSize: 13, color: T.t2, lineHeight: 1.7, margin: 0 }}>{c.description}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Salary Range</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.green }}>{c.salary}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Hiring Companies</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {c.companies.slice(0, 4).map(co => <Tag key={co} color={T.purple}>{co}</Tag>)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Certifications</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {c.certs.map(cert => <div key={cert} style={{ fontSize: 11, color: T.amber }}>🏅 {cert}</div>)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="primary">Generate Resume for Role</Btn>
                    <Btn size="sm" variant="ghost">View Skill Gaps</Btn>
                    <Btn size="sm" variant="secondary">Save Career Path</Btn>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage() {
  const skills = ["Python", "SQL", "Tableau", "Pandas", "NumPy", "Machine Learning", "Data Visualization", "Git", "Statistics", "Excel"];
  return (
    <div style={{ maxWidth: 840 }}>
      {/* Cover */}
      <div style={{ height: 130, background: `linear-gradient(135deg, #1a1b3a, #2D1B69, #4C1D95)`, borderRadius: 14, marginBottom: 0, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.3, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(91,110,245,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(155,110,245,0.3) 0%, transparent 50%)" }} />
      </div>
      <div style={{ padding: "0 24px" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "#fff", border: `3px solid ${T.bg}`, marginTop: -36, marginBottom: 12 }}>A</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4, margin: "0 0 4px" }}>Ahmad Razif bin Abdullah</h1>
            <div style={{ fontSize: 13, color: T.t3, marginBottom: 6 }}>@ahmad.razif · Aspiring Data Analyst</div>
            <div style={{ display: "flex", gap: 14 }}>
              {["📍 Cyberjaya, MY", "🎓 UPM Computer Science", "💼 Open to Work"].map(t => <span key={t} style={{ fontSize: 12, color: T.t3 }}>{t}</span>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn size="sm" variant="ghost"><Ic n="upload" /> Upload Resume</Btn>
            <Btn size="sm" variant="secondary">Edit Profile</Btn>
          </div>
        </div>

        {[
          { title: "About", content: <p style={{ fontSize: 13, color: T.t2, lineHeight: 1.8, margin: 0 }}>Final-year Computer Science student passionate about data analytics and visualization. I transform complex datasets into actionable insights. Seeking data analyst roles in the Klang Valley area.</p> },
          { title: "Education", content: (
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎓</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>B.Sc. Computer Science</div>
                <div style={{ fontSize: 12, color: T.accent, marginBottom: 2 }}>Universiti Putra Malaysia · 2021–2025</div>
                <div style={{ fontSize: 12, color: T.t3 }}>CGPA 3.72 · Dean's List 2022, 2023</div>
              </div>
            </div>
          )},
          { title: "Skills", content: <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{skills.map(s => <Tag key={s} color={T.accent}>{s}</Tag>)}</div> },
          { title: "Experience", content: (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[{ r: "Data Analyst Intern", c: "TechCorp Sdn Bhd", p: "Jun–Aug 2024", d: "Built ETL pipelines processing 500K+ daily records using Python and SQL. Created Tableau dashboards reducing reporting time by 40%." }, { r: "Teaching Assistant", c: "UPM CS Department", p: "Jan–May 2024", d: "Assisted in teaching Introduction to Databases for 60+ students." }].map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i === 0 ? 16 : 0, borderBottom: i === 0 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🏢</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{e.r}</div>
                    <div style={{ fontSize: 12, color: T.accent, marginBottom: 4 }}>{e.c} · {e.p}</div>
                    <div style={{ fontSize: 12, color: T.t3, lineHeight: 1.6 }}>{e.d}</div>
                  </div>
                </div>
              ))}
            </div>
          )},
        ].map(sec => (
          <Card key={sec.title} style={{ padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: T.t1 }}>{sec.title}</div>
            {sec.content}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── PORTFOLIO ─────────────────────────────────────────────────────────────────
function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(i => i.type === filter);

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <PageHeader eyebrow="Portfolio" title="Projects & Certificates" />
        <div style={{ display: "flex", gap: 9 }}>
          <Btn size="sm" variant="ghost"><Ic n="plus" /> Add New Item</Btn>
          <Btn size="sm" variant="secondary"><Ic n="plus" /> Add Certificate</Btn>
          <Btn size="sm" variant="primary"><Ic n="plus" /> Add Experience</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 7, marginBottom: 22 }}>
        {["All", "Project", "Certificate", "Experience"].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding: "7px 15px", borderRadius: 7, border: `1.5px solid ${filter === t ? T.accent : T.border}`, background: filter === t ? T.accentGlow : "transparent", color: filter === t ? T.accentLight : T.t3, fontSize: 12, fontWeight: filter === t ? 600 : 400, cursor: "pointer" }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {filtered.map(item => (
          <Card key={item.id} style={{ padding: "20px", position: "relative", overflow: "hidden" }}>
            {item.featured && <div style={{ position: "absolute", top: 14, right: 14 }}><Tag color={T.amber}>⭐ Featured</Tag></div>}
            <div style={{ fontSize: 30, marginBottom: 12 }}>{item.emoji}</div>
            <Tag color={item.type === "Certificate" ? T.amber : item.type === "Experience" ? T.green : T.accent}>{item.type}</Tag>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "10px 0 6px" }}>{item.title}</h3>
            <p style={{ fontSize: 12, color: T.t3, lineHeight: 1.6, margin: "0 0 12px" }}>{item.desc}</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
              {item.tech.map(t => <span key={t} style={{ fontSize: 11, color: T.t3, background: T.bg, padding: "2px 7px", borderRadius: 4 }}>{t}</span>)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: T.t3, display: "flex", alignItems: "center", gap: 4 }}><Ic n="eye" /> {item.views} views</span>
              <div style={{ display: "flex", gap: 7 }}>
                {item.github && <Btn size="sm" variant="secondary"><Ic n="github" /></Btn>}
                <Btn size="sm" variant="ghost">View</Btn>
              </div>
            </div>
          </Card>
        ))}

        {/* Add placeholder */}
        <div style={{ background: T.bg, border: `2px dashed ${T.border}`, borderRadius: 13, padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", minHeight: 180 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: T.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent }}><Ic n="plus" /></div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.t3 }}>Add New Item</div>
          <div style={{ fontSize: 11, color: T.t4, textAlign: "center" }}>Project, certificate, or experience</div>
        </div>
      </div>
    </div>
  );
}

// ─── RESUME ────────────────────────────────────────────────────────────────────
function ResumePage() {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [template, setTemplate] = useState(0);

  const generate = () => {
    setLoading(true); setReady(false);
    setTimeout(() => { setLoading(false); setReady(true); }, 2000);
  };

  return (
    <div style={{ maxWidth: 1060, display: "flex", gap: 28 }}>
      {/* Controls panel */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <PageHeader eyebrow="Resume Builder" title="Generate" />

        <Card style={{ padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Data Sources</div>
          {["Profile & Experience", "Skills", "Portfolio Projects", "Certifications"].map(s => (
            <div key={s} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Ic n="check" /></div>
              <span style={{ fontSize: 12, color: T.t2 }}>{s}</span>
            </div>
          ))}
        </Card>

        <Card style={{ padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Template</div>
          {["Modern Clean", "ATS Optimized", "Creative"].map((t, i) => (
            <div key={t} onClick={() => setTemplate(i)} style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", borderRadius: 7, background: template === i ? T.accentGlow : "transparent", cursor: "pointer", marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${template === i ? T.accent : T.border}`, background: template === i ? T.accent : "transparent" }} />
              <span style={{ fontSize: 12, color: template === i ? T.accentLight : T.t3 }}>{t}</span>
            </div>
          ))}
        </Card>

        <Btn onClick={generate} disabled={loading} size="lg" style={{ width: "100%", justifyContent: "center", marginBottom: 9 }}>
          {loading ? "⚙️ Generating…" : "✨ Generate Resume"}
        </Btn>
        {ready && <Btn variant="success" size="md" style={{ width: "100%", justifyContent: "center" }}><Ic n="download" /> Download PDF</Btn>}
      </div>

      {/* Preview */}
      <div style={{ flex: 1 }}>
        {!ready && !loading && (
          <div style={{ height: 580, border: `2px dashed ${T.border}`, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ fontSize: 40 }}>📄</div>
            <div style={{ fontSize: 14, color: T.t3 }}>Click "Generate Resume" to build your resume</div>
          </div>
        )}
        {loading && (
          <div style={{ height: 580, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 40, height: 40, border: `3px solid ${T.border}`, borderTop: `3px solid ${T.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <div style={{ fontSize: 13, color: T.t3 }}>Compiling profile data…</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          </div>
        )}
        {ready && (
          <div style={{ background: "#fff", borderRadius: 14, padding: "40px 48px", color: "#1a1a1a", fontFamily: "Georgia, serif", boxShadow: "0 24px 80px rgba(0,0,0,0.5)", minHeight: 580 }}>
            <div style={{ borderBottom: `3px solid ${T.accent}`, paddingBottom: 18, marginBottom: 18 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px", color: "#111", letterSpacing: -0.5 }}>Ahmad Razif bin Abdullah</h1>
              <div style={{ fontSize: 12, color: T.accent, fontWeight: 600, marginBottom: 6 }}>Data Analyst · Python · SQL · Tableau</div>
              <div style={{ fontSize: 11, color: "#666", display: "flex", gap: 18 }}>
                <span>📧 ahmad.razif@email.com</span>
                <span>📍 Cyberjaya, Malaysia</span>
                <span>🔗 linkedin.com/in/ahmad-razif</span>
              </div>
            </div>
            {[
              { h: "Experience", body: <div><div style={{ display: "flex", justifyContent: "space-between" }}><strong>Data Analyst Intern — TechCorp Sdn Bhd</strong><span style={{ color: "#888", fontSize: 11 }}>Jun–Aug 2024</span></div><ul style={{ margin: "6px 0 0 16px", fontSize: 12, color: "#444", lineHeight: 1.8 }}><li>Built ETL pipelines processing 500K+ daily records using Python and SQL</li><li>Created Tableau dashboards reducing reporting time by 40%</li></ul></div> },
              { h: "Education", body: <div><div style={{ display: "flex", justifyContent: "space-between" }}><strong>B.Sc. Computer Science</strong><span style={{ color: "#888", fontSize: 11 }}>2021–2025</span></div><div style={{ fontSize: 12, color: "#666" }}>Universiti Putra Malaysia · CGPA 3.72 · Dean's List 2022, 2023</div></div> },
              { h: "Skills", body: <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{["Python", "SQL", "Tableau", "Pandas", "Machine Learning", "Git", "Excel", "Power BI"].map(s => <span key={s} style={{ fontSize: 11, background: "#EEF2FF", color: T.accent, padding: "3px 9px", borderRadius: 4 }}>{s}</span>)}</div> },
              { h: "Certifications", body: <div style={{ fontSize: 12, color: "#444" }}>🏅 Google Data Analytics Professional Certificate (2024) &nbsp;|&nbsp; 🏅 AWS Cloud Practitioner (In Progress)</div> },
            ].map(sec => (
              <div key={sec.h} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>{sec.h}</div>
                {sec.body}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INBOX ────────────────────────────────────────────────────────────────────
function InboxPage() {
  const [activeId, setActiveId] = useState(1);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState(MESSAGES_DATA.reduce((a, m) => ({ ...a, [m.id]: m.history }), {}));
  const active = MESSAGES_DATA.find(m => m.id === activeId);
  const msgs = chats[activeId] || [];
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setChats(c => ({ ...c, [activeId]: [...(c[activeId] || []), { from: "me", text: input.trim(), time: "Just now" }] }));
    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 82px)", margin: "-28px -32px", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 300, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 18px 14px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Inbox</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.t3 }}><Ic n="search" /></span>
            <input placeholder="Search messages…" style={{ width: "100%", padding: "8px 10px 8px 30px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 7, color: T.t1, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {MESSAGES_DATA.map(m => (
            <div key={m.id} onClick={() => setActiveId(m.id)} style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}00`, cursor: "pointer", background: activeId === m.id ? T.accentGlow2 : "transparent", borderLeft: `2px solid ${activeId === m.id ? T.accent : "transparent"}` }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{m.avatar}</div>
                  {m.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: T.green, border: `2px solid ${T.surface}` }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: m.unread > 0 ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
                    <span style={{ fontSize: 10, color: T.t3, flexShrink: 0, marginLeft: 6 }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.t3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.lastMsg}</div>
                </div>
                {m.unread > 0 && <Badge n={m.unread} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat window */}
      {active && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: active.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{active.avatar}</div>
              {active.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: T.green, border: `2px solid ${T.surface}` }} />}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{active.name}</div>
              <div style={{ fontSize: 11, color: T.t3 }}>{active.role} · {active.online ? <span style={{ color: T.green }}>Online</span> : "Offline"}</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            {msgs.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div style={{ maxWidth: "68%" }}>
                  <div style={{ padding: "10px 14px", borderRadius: msg.from === "me" ? "14px 14px 2px 14px" : "14px 14px 14px 2px", background: msg.from === "me" ? `linear-gradient(135deg, ${T.accent}, ${T.purple})` : T.surface, color: T.t1, fontSize: 13, lineHeight: 1.6 }}>{msg.text}</div>
                  <div style={{ fontSize: 10, color: T.t4, marginTop: 4, textAlign: msg.from === "me" ? "right" : "left" }}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={`Message ${active.name}…`} style={{ flex: 1, padding: "10px 14px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 9, color: T.t1, fontSize: 13, outline: "none" }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
            <Btn onClick={send} disabled={!input.trim()}><Ic n="send" /></Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROGRESSION ──────────────────────────────────────────────────────────────
function ProgressionPage() {
  const path = CAREER_PATH_DATA["Data Analyst"];
  const [sel, setSel] = useState(1);
  const statusColor = { completed: T.green, current: T.accent, next: T.amber, future: T.t4 };

  return (
    <div style={{ maxWidth: 1000 }}>
      <PageHeader eyebrow="Career Map" title="Your Growth Path" sub="Data Analytics track — AI-powered skill gap analysis" />

      {/* Timeline */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32, gap: 0, overflowX: "auto", paddingBottom: 8 }}>
        {path.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < path.length - 1 ? 1 : "none" }}>
            <div onClick={() => setSel(i)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", minWidth: 120, padding: "0 8px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: sel === i ? statusColor[step.status] : `${statusColor[step.status]}20`, border: `2px solid ${statusColor[step.status]}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", marginBottom: 8, color: sel === i ? "#fff" : statusColor[step.status], fontSize: 14 }}>
                {step.status === "completed" && <Ic n="check" />}
                {step.status === "current" && "●"}
                {step.status === "next" && "→"}
                {step.status === "future" && "○"}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: statusColor[step.status], textAlign: "center", lineHeight: 1.3, marginBottom: 4 }}>{step.title}</div>
              <div style={{ fontSize: 10, color: T.t4, textAlign: "center" }}>{step.timeline}</div>
            </div>
            {i < path.length - 1 && <div style={{ flex: 1, height: 2, background: i < 1 ? T.green : T.border, minWidth: 24, marginBottom: 24 }} />}
          </div>
        ))}
      </div>

      {/* Detail */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card style={{ padding: "22px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{path[sel].title}</h3>
            <Tag color={statusColor[path[sel].status]}>{path[sel].status}</Tag>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Required Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {path[sel].skills.map(s => <Tag key={s} color={T.accent}>{s}</Tag>)}
          </div>
        </Card>

        {path[sel].certs?.length > 0 ? (
          <Card style={{ padding: "22px", borderColor: `${T.amber}33` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>🏅</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>AI-Recommended Certs</div>
                <div style={{ fontSize: 11, color: T.amber }}>To bridge skill gaps for this level</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {path[sel].certs.map(c => (
                <div key={c} style={{ display: "flex", gap: 12, padding: "12px 14px", background: T.amberDim, border: `1px solid ${T.amber}22`, borderRadius: 9, alignItems: "center" }}>
                  <span style={{ fontSize: 16 }}>📋</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c}</div>
                    <div style={{ fontSize: 11, color: T.t3 }}>Recommended for next career level</div>
                  </div>
                  <Btn size="sm" variant="secondary">Enroll</Btn>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card style={{ padding: "22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontSize: 32 }}>🤖</span>
            <div style={{ fontSize: 13, color: T.t3, textAlign: "center" }}>
              {path[sel].status === "completed" ? "You've mastered this level! Great work." : "No specific certifications required for this level."}
            </div>
          </Card>
        )}
      </div>

      {/* Gumball prompt */}
      <div style={{ marginTop: 20, background: T.accentGlow2, border: `1px solid ${T.accent}30`, borderRadius: 14, padding: "18px 22px", display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Ask Gumball about your career path</div>
          <div style={{ fontSize: 12, color: T.t3 }}>Get personalized advice on skills, certifications, and career strategies — tailored to your profile.</div>
        </div>
        <Btn size="sm" variant="ghost">Open Chat</Btn>
      </div>
    </div>
  );
}

// ─── GUMBALL AI CHAT ──────────────────────────────────────────────────────────
function GumballChat({ minimized, onMinimize, onClose }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey Ahmad! 👋 I'm Gumball, your AI career mentor. I know your profile — you're a CS student aiming for Data Analyst roles, with skills in Python, SQL, and Tableau.\n\nHow can I help you today? Here are some things I can do:", time: "now" },
  ]);
  const suggestions = ["How can I improve my resume?", "What skills should I learn next?", "How do I prepare for a data analyst interview?", "Which certifications matter most?"];
  const bottomRef = useRef(null);

  useEffect(() => { if (!minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, minimized]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: msg, time: "now" }]);
    setLoading(true);

    try {
      const systemPrompt = `You are Gumball, a friendly and encouraging AI career mentor for a platform called CareerPath. You're talking with Ahmad Razif, a final-year Computer Science student at UPM Malaysia who is a job seeker targeting Data Analyst roles. His skills include Python, SQL, Tableau, Pandas, and Machine Learning. He has internship experience at TechCorp and has completed the Google Data Analytics certificate. Keep responses conversational, practical, and encouraging. Use bullet points for lists. Keep answers concise (under 200 words). Add relevant emojis occasionally.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.filter(m => m.role === "user" || (m.role === "assistant" && m !== messages[0])).map(m => ({ role: m.role, content: m.text })),
            { role: "user", content: msg }
          ],
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again.";
      setMessages(m => [...m, { role: "assistant", text: reply, time: "now" }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", text: "I'm having trouble connecting right now. Please try again in a moment!", time: "now" }]);
    }
    setLoading(false);
  };

  if (minimized) return (
    <button onClick={onMinimize} style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", boxShadow: "0 8px 32px rgba(91,110,245,0.4)", zIndex: 1000 }}>
      🤖
    </button>
  );

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, width: 380, height: 560, background: T.surface, border: `1px solid ${T.borderAccent}`, borderRadius: 18, display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.6)", zIndex: 1000, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", background: `linear-gradient(135deg, ${T.accent}20, ${T.purple}15)`, borderBottom: `1px solid ${T.border}`, display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Gumball</div>
          <div style={{ fontSize: 10, color: T.green, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green }} /> AI Career Mentor · Online
          </div>
        </div>
        <button onClick={onMinimize} style={{ background: "none", border: "none", color: T.t3, cursor: "pointer", padding: 4 }}><Ic n="minimize" /></button>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.t3, cursor: "pointer", padding: 4 }}><Ic n="x" /></button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            {msg.role === "assistant" && (
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, marginRight: 8, marginTop: 2 }}>🤖</div>
            )}
            <div style={{ maxWidth: "80%", padding: "10px 12px", borderRadius: msg.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px", background: msg.role === "user" ? `linear-gradient(135deg, ${T.accent}, ${T.purple})` : T.bg, color: T.t1, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>🤖</div>
            <div style={{ padding: "10px 14px", background: T.bg, borderRadius: "14px 14px 14px 2px", display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.t3, animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
        <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: "0 12px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => send(s)} style={{ padding: "5px 10px", background: T.accentGlow, border: `1px solid ${T.accent}33`, borderRadius: 6, color: T.accentLight, fontSize: 11, cursor: "pointer" }}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !loading && send()} placeholder="Ask Gumball anything…" style={{ flex: 1, padding: "9px 12px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.t1, fontSize: 12, outline: "none" }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
        <Btn onClick={() => send()} disabled={!input.trim() || loading} size="sm"><Ic n="send" /></Btn>
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("auth"); // auth | onboarding | resume | app

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {screen === "auth" && <AuthPage onAuth={type => setScreen(type === "new" ? "onboarding" : "app")} />}
      {screen === "onboarding" && <Onboarding onDone={() => setScreen("resume")} />}
      {screen === "resume" && <ResumeUpload onDone={() => setScreen("app")} />}
      {screen === "app" && <Shell onLogout={() => setScreen("auth")} />}
    </div>
  );
}
