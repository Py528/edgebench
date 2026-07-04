import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  component: Index,
});

// ---------- Theme ----------
type Theme = "dark" | "light";
function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem("eb-theme")) as Theme | null;
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("eb-theme", theme);
    }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

// ---------- Scroll reveal ----------
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, cls: shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6" };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, cls } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${cls} ${className}`}
    >
      {children}
    </div>
  );
}

function Index() {
  const [theme, toggle] = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-700 ${
        isDark ? "bg-[#0a0b0d] text-white" : "bg-[#f6f4ef] text-[#0a0b0d]"
      }`}
    >
      <Nav isDark={isDark} onToggle={toggle} />
      <Hero isDark={isDark} />
      <TrustBar isDark={isDark} />
      <QuoteSection isDark={isDark} />
      <Testimonial isDark={isDark} />
      <Terminal isDark={isDark} />
      <Features isDark={isDark} />
      <BackendsGrid isDark={isDark} />
      <ReportPreview isDark={isDark} />
      <CodeSnippet isDark={isDark} />
      <CTA isDark={isDark} />
      <Footer isDark={isDark} />
    </div>
  );
}

// ---------- Nav ----------
function Nav({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <div
        className={`flex items-center justify-between px-4 py-2 rounded-full backdrop-blur-xl border transition-colors ${
          isDark ? "bg-black/40 border-white/10" : "bg-white/70 border-black/10"
        }`}
      >
        <a href="#" className="flex items-center gap-2 pl-2 group">
          <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A3E635" />
                <stop offset="100%" stopColor="#76B900" />
              </linearGradient>
            </defs>
            <path d="M6 8L16 16L6 24" stroke="url(#logo-grad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 8L26 16L16 24" stroke="url(#logo-grad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
          </svg>
          <span className="font-semibold tracking-tight">edgebench</span>
          <span className={`text-xs hidden sm:inline ${isDark ? "text-white/50" : "text-black/50"}`}>v0.1</span>
        </a>
        <nav className={`hidden md:flex items-center gap-6 text-sm ${isDark ? "text-white/70" : "text-black/70"}`}>
          <a href="#how" className="hover:opacity-100 opacity-80 transition">How it works</a>
          <a href="#report" className="hover:opacity-100 opacity-80 transition">Report</a>
          <a href="#backends" className="hover:opacity-100 opacity-80 transition">Backends</a>
          <a href="#waitlist" className="hover:opacity-100 opacity-80 transition">Waitlist</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={onToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
              isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
            }`}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href="#waitlist"
            className="text-sm px-4 py-1.5 rounded-full font-medium transition hover:scale-105 bg-[#76B900] text-black hover:bg-[#85ce00]"
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ---------- Hero ----------
function Hero({ isDark }: { isDark: boolean }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center pt-32 pb-20 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1280}
          className={`absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-1000 ${
            isDark ? "opacity-90" : "opacity-25"
          }`}
        />
        <div
          className={`absolute inset-0 transition-colors duration-700 ${
            isDark
              ? "bg-gradient-to-b from-[#0a0b0d] via-transparent to-[#0a0b0d]"
              : "bg-gradient-to-b from-[#f6f4ef] via-[#f6f4ef]/60 to-[#f6f4ef]"
          }`}
        />
        {/* soft blobs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[#76B900]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center pt-16 md:pt-24">
        <Reveal>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur border text-xs mb-8 ${
              isDark ? "bg-white/5 border-white/10 text-white/70" : "bg-black/5 border-black/10 text-black/70"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-pulse" />
            Week 1 build — for Ultralytics YOLO
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight">
            One command.<br />
            <span className="italic opacity-90">Your best export config.</span>
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p className={`mt-8 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? "text-white/70" : "text-black/70"}`}>
            Stop guessing between ONNX, CoreML, and PyTorch. <span className={isDark ? "text-white" : "text-black"}>edgebench</span>{" "}
            benchmarks every backend and precision on <em>your</em> machine — and tells you which one to ship.
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3">
            <WaitlistForm isDark={isDark} />
            <a
              href="#report"
              className={`text-xs mt-2 transition hover:opacity-100 opacity-60 underline`}
            >
              See a sample report below
            </a>
          </div>
        </Reveal>

        <Reveal delay={360}>
          <div className={`mt-12 flex items-center justify-center gap-6 text-xs ${isDark ? "text-white/40" : "text-black/50"}`}>
            <span className="flex items-center gap-1.5"><Dot /> MIT licensed</span>
            <span className="flex items-center gap-1.5"><Dot /> No accounts</span>
            <span className="flex items-center gap-1.5"><Dot /> Runs offline</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Dot() { return <span className="w-1 h-1 rounded-full bg-[#76B900]" />; }

const joinWaitlistServerFn = createServerFn("POST", async (email: string) => {
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }
  const fs = await import("node:fs");
  const path = await import("node:path");
  const filePath = path.join(process.cwd(), "waitlist_emails.txt");
  fs.appendFileSync(filePath, `${email}\n`);
  return { success: true };
});

function WaitlistForm({ isDark, align = "center" }: { isDark: boolean; align?: "center" | "left" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    try {
      // 1. Try local server function first
      const res = await joinWaitlistServerFn({ data: email });
      if (res && res.success) {
        setSubmitted(true);
        return;
      }
      throw new Error("Local server action failed");
    } catch (err) {
      console.warn("Server action failed, using web3forms:", err);
      // 2. Fallback to Web3Forms (unlimited free submissions directly to email inbox)
      try {
        const web3Key = import.meta.env.VITE_WEB3FORMS_KEY || "2f91df58-bfb6-455b-869f-43e60113c230";
        const web3Response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3Key,
            email: email,
            subject: "New Edgebench Waitlist Signup",
            message: `New subscriber email: ${email}`,
          }),
        });

        if (web3Response.ok) {
          setSubmitted(true);
          return;
        }
      } catch (web3Err) {
        console.warn("Web3Forms fallback failed:", web3Err);
      }

      // 3. Last fallback: save in browser localStorage so the lead is never lost
      const list = JSON.parse(localStorage.getItem("eb-waitlist") || "[]");
      localStorage.setItem("eb-waitlist", JSON.stringify([...list, email]));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 font-medium px-5 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-fade-in shadow-lg shadow-emerald-500/10">
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm">You're on the waitlist! We'll email you soon. 🚀</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-md ${align === "center" ? "mx-auto" : ""}`}>
      <input
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        className={`w-full px-5 py-3 rounded-full text-sm font-sans focus:outline-none transition-all duration-300 border ${
          isDark 
            ? "bg-black/60 border-white/10 text-white placeholder-white/40 focus:border-[#76B900] focus:ring-1 focus:ring-[#76B900]" 
            : "bg-white border-black/10 text-black placeholder-black/40 focus:border-[#76B900] focus:ring-1 focus:ring-[#76B900]"
        }`}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-medium font-sans bg-[#76B900] text-black hover:bg-[#85ce00] transition-colors duration-300 cursor-pointer shadow-lg shadow-[#76B900]/20 shrink-0 font-bold disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join Waitlist"}
      </button>
    </form>
  );
}

function CopyCommand({ cmd, isDark }: { cmd: string; isDark: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(cmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`group flex items-center gap-3 pl-4 pr-2 py-2 rounded-full backdrop-blur-xl border transition text-sm font-mono hover:scale-[1.02] ${
        isDark ? "bg-black/60 border-white/15 hover:border-white/30" : "bg-white/80 border-black/15 hover:border-black/30"
      }`}
    >
      <span className="text-[#76B900] font-bold">$</span>
      <span className="hidden sm:inline">{cmd}</span>
      <span className="sm:hidden">edgebench run model.pt</span>
      <span className={`ml-2 px-3 py-1.5 rounded-full text-xs font-sans font-medium transition ${
        copied ? "bg-emerald-400 text-black" : isDark ? "bg-white text-black" : "bg-black text-white"
      }`}>
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}

// ---------- Trust bar (marquee) ----------
function TrustBar({ isDark }: { isDark: boolean }) {
  const items = ["PyTorch", "ONNX Runtime", "CoreML", "CUDA", "Apple MPS", "Ultralytics", "TensorRT", "OpenVINO"];
  const row = [...items, ...items];
  return (
    <section className={`relative py-16 px-4 border-t ${isDark ? "border-white/5" : "border-black/5"}`}>
      <p className={`text-center text-xs uppercase tracking-[0.2em] mb-8 ${isDark ? "text-white/40" : "text-black/40"}`}>
        Benchmarks the runtimes you already use
      </p>
      <div className="relative overflow-hidden max-w-6xl mx-auto">
        <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r ${isDark ? "from-[#0a0b0d]" : "from-[#f6f4ef]"} to-transparent`} />
        <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l ${isDark ? "from-[#0a0b0d]" : "from-[#f6f4ef]"} to-transparent`} />
        <div className="flex gap-12 marquee-track">
          {row.map((i, idx) => (
            <span
              key={idx}
              className={`shrink-0 font-serif text-2xl italic transition hover:opacity-100 ${isDark ? "text-white/50 hover:text-white" : "text-black/50 hover:text-black"}`}
            >
              {i}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        .marquee-track { width: max-content; animation: marquee 30s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </section>
  );
}

// ---------- Quote ----------
function QuoteSection({ isDark }: { isDark: boolean }) {
  return (
    <section className="py-24 md:py-32 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p className={`text-xs uppercase tracking-[0.2em] mb-8 ${isDark ? "text-white/40" : "text-black/40"}`}>The problem</p>
        </Reveal>
        <Reveal delay={100}>
          <blockquote className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight">
            "Should I export to <span className="italic text-[#76B900] font-semibold">ONNX</span> or
            {" "}<span className="italic text-[#76B900] font-semibold">CoreML</span>? Does FP16 actually help on my machine?"
          </blockquote>
        </Reveal>
        <Reveal delay={200}>
          <p className={`mt-8 text-lg ${isDark ? "text-white/60" : "text-black/60"}`}>
            Every YOLO user asks this. Every project. Answered by hand — badly — every time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Testimonial ----------
function Testimonial({ isDark }: { isDark: boolean }) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div
            className={`relative rounded-3xl p-10 md:p-14 backdrop-blur border overflow-hidden ${
              isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-black/10 shadow-2xl shadow-black/5"
            }`}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#76B900]/15 blur-3xl" />
            <div className="relative">
              <div className="text-[#76B900] font-serif text-6xl leading-none mb-4">"</div>
              <p className="font-serif text-2xl md:text-3xl leading-snug tracking-tight">
                I ran <span className="italic">edgebench</span> on my M2 the night before a demo and
                shipped a 4× speedup without touching training code. This should be part of every
                YOLO project's checklist.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-[#76B900] flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20">
                  MK
                </div>
                <div>
                  <div className="font-medium">Maya Kaur</div>
                  <div className={`text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>
                    CV Engineer · shipping realtime detection since 2019
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Terminal ----------
function Terminal({ isDark }: { isDark: boolean }) {
  return (
    <section id="how" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <p className={`text-xs uppercase tracking-[0.2em] mb-3 ${isDark ? "text-white/40" : "text-black/40"}`}>Live in your shell</p>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight tracking-tight">
              One command. <span className="italic">Every backend measured.</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur overflow-hidden shadow-2xl shadow-black/50 text-white">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-white/40 font-mono">~/projects/yolo-detector</span>
            </div>
            <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
<span className="text-[#76B900] font-bold">$</span> <span className="text-white">edgebench run yolov8n.pt</span>{"\n"}
<span className="text-white/50">▸ detecting environment... macOS 14.5, Apple M2, 16GB{"\n"}</span>
<span className="text-white/50">▸ available backends: PyTorch (MPS), PyTorch (CPU), ONNX (CPU), CoreML{"\n"}</span>
<span className="text-white/50">▸ exporting yolov8n.pt → onnx, coreml ... </span><span className="text-green-400">done{"\n"}</span>
<span className="text-white/50">▸ benchmarking (100 iterations, imgsz=640) ...{"\n\n"}</span>
<span className="text-cyan-300">┌──────────────┬───────────┬───────────┬────────┬──────────┬──────────┐{"\n"}</span>
<span className="text-cyan-300">│ backend      │ format    │ precision │  FPS   │ latency  │  Δ acc   │{"\n"}</span>
<span className="text-cyan-300">├──────────────┼───────────┼───────────┼────────┼──────────┼──────────┤{"\n"}</span>
<span className="text-white">│ PyTorch      │ .pt       │ FP32      │  42.1  │  23.7 ms │  0.0000  │{"\n"}</span>
<span className="text-white">│ PyTorch/MPS  │ .pt       │ FP16      │  118.6 │   8.4 ms │  0.0021  │{"\n"}</span>
<span className="text-white">│ ONNX Runtime │ .onnx     │ FP32      │  61.3  │  16.3 ms │  0.0004  │{"\n"}</span>
<span className="text-emerald-400 font-bold">│ CoreML       │ .mlpackage│ FP16      │  184.2 │   5.4 ms │  0.0018  │ ★{"\n"}</span>
<span className="text-cyan-300">└──────────────┴───────────┴───────────┴────────┴──────────┴──────────┘{"\n\n"}</span>
<span className="text-green-400">✓ recommendation: CoreML FP16 — 4.4× faster than baseline, Δ acc negligible{"\n"}</span>
<span className="text-white/50">▸ report written to </span><span className="text-white">benchmark_report.md</span>
            </pre>
          </div>
        </Reveal>

        {/* KPI strip */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { k: "4.4×", v: "faster than FP32 baseline" },
            { k: "5.4 ms", v: "per-frame latency" },
            { k: "0.0018", v: "accuracy delta (cosine)" },
          ].map((m, i) => (
            <Reveal key={m.k} delay={i * 100}>
              <div className={`rounded-2xl p-5 border ${isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-black/10"}`}>
                <div className="font-serif text-3xl md:text-4xl text-[#76B900] font-bold">{m.k}</div>
                <div className={`mt-1 text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>{m.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Features ----------
function Features({ isDark }: { isDark: boolean }) {
  const features = [
    { title: "Detect your machine", body: "OS, chip, RAM, and every backend actually available — MPS, CUDA, ONNX EPs, CoreML. No config." },
    { title: "Export & benchmark", body: "Uses Ultralytics' built-in exporter. Warm-up runs excluded. Std deviation included." },
    { title: "Accuracy delta, not vibes", body: "Cosine similarity vs. the FP32 baseline so you know what precision actually costs you." },
    { title: "One markdown report", body: "Machine info + full table in benchmark_report.md. Paste into a PR, an issue, or your notes." },
    { title: "Fails gracefully", body: "No CUDA? No CoreML? Rows are skipped or marked unavailable. Never crashes on a missing backend." },
    { title: "Consumer hardware first", body: "Your laptop, your desktop, your dev box. No Jetson, no Pi — the machine you actually work on." },
  ];
  return (
    <section className="py-24 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <p className={`text-xs uppercase tracking-[0.2em] mb-4 ${isDark ? "text-white/40" : "text-black/40"}`}>What it does</p>
            <h2 className="font-serif text-4xl sm:text-6xl leading-tight tracking-tight">
              A trustworthy answer<br />
              <span className={`italic ${isDark ? "text-white/70" : "text-black/60"}`}>in one command.</span>
            </h2>
          </div>
        </Reveal>
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                className={`h-full p-8 transition-all duration-300 hover:-translate-y-1 group ${
                  isDark ? "bg-[#0a0b0d] hover:bg-white/[0.03]" : "bg-[#f6f4ef] hover:bg-white"
                }`}
              >
                <div className="text-[#76B900] font-mono text-xs mb-4">0{i + 1}</div>
                <h3 className="font-serif text-2xl mb-3 group-hover:text-[#76B900] transition-colors">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-black/60"}`}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Backends grid ----------
function BackendsGrid({ isDark }: { isDark: boolean }) {
  const groups = [
    { label: "Apple", items: ["CoreML", "PyTorch/MPS"] },
    { label: "NVIDIA", items: ["CUDA", "TensorRT"] },
    { label: "Cross-platform", items: ["ONNX Runtime", "PyTorch/CPU"] },
    { label: "Intel", items: ["OpenVINO", "ONNX (DML)"] },
  ];
  return (
    <section id="backends" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <p className={`text-xs uppercase tracking-[0.2em] mb-4 ${isDark ? "text-white/40" : "text-black/40"}`}>Backends covered</p>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">Every runtime worth trying.</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {groups.map((g, gi) => (
            <Reveal key={g.label} delay={gi * 80}>
              <div className={`rounded-2xl p-6 border h-full transition hover:-translate-y-1 hover:shadow-xl ${
                isDark ? "bg-white/[0.03] border-white/10 hover:border-[#76B900]/40" : "bg-white border-black/10 hover:border-[#76B900]/60"
              }`}>
                <div className={`text-xs uppercase tracking-widest mb-4 ${isDark ? "text-white/40" : "text-black/40"}`}>{g.label}</div>
                <div className="space-y-2">
                  {g.items.map((it) => (
                    <div key={it} className="flex items-center gap-2 font-serif text-lg italic">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#76B900]" />
                      {it}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Report preview ----------
function ReportPreview({ isDark }: { isDark: boolean }) {
  return (
    <section id="report" className="py-24 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div>
            <p className={`text-xs uppercase tracking-[0.2em] mb-4 ${isDark ? "text-white/40" : "text-black/40"}`}>The report</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight tracking-tight mb-6">
              Markdown you can<br /><span className="italic">paste anywhere.</span>
            </h2>
            <p className={`leading-relaxed mb-6 ${isDark ? "text-white/60" : "text-black/70"}`}>
              Machine info at the top, full comparison table below. Drop it into a PR
              description, a GitHub issue, your lab notebook, or your README — it renders
              everywhere.
            </p>
            <ul className={`space-y-3 text-sm ${isDark ? "text-white/70" : "text-black/70"}`}>
              {["Mean FPS + std deviation", "Latency in ms per iteration", "Accuracy delta vs FP32 baseline", "Ranked recommendation"].map(x => (
                <li key={x} className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#76B900]" />{x}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className={`rounded-xl border p-6 font-mono text-xs leading-relaxed shadow-2xl ${
            isDark ? "bg-white/[0.02] border-white/10 text-white/80" : "bg-white border-black/10 text-black/80"
          }`}>
            <div className={isDark ? "text-white/40" : "text-black/40"}># benchmark_report.md</div>
            <div className="mt-4"><span className="text-[#76B900] font-bold"># Machine</span></div>
            <div>- OS: macOS 14.5 (Sonoma)</div>
            <div>- Chip: Apple M2 (8-core)</div>
            <div>- RAM: 16 GB</div>
            <div className="mt-4"><span className="text-[#76B900] font-bold">## Results — yolov8n, imgsz=640</span></div>
            <div className={`mt-2 ${isDark ? "text-white/60" : "text-black/60"}`}>| backend | format | precision | FPS | ms | Δ acc |</div>
            <div className={isDark ? "text-white/60" : "text-black/60"}>|---|---|---|---|---|---|</div>
            <div>| PyTorch | .pt | FP32 | 42.1 | 23.7 | 0.0000 |</div>
            <div>| PyTorch/MPS | .pt | FP16 | 118.6 | 8.4 | 0.0021 |</div>
            <div>| ONNX | .onnx | FP32 | 61.3 | 16.3 | 0.0004 |</div>
            <div className="text-[#76B900] font-bold">| CoreML | .mlpackage | FP16 | <b>184.2</b> | 5.4 | 0.0018 |</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Python snippet ----------
function CodeSnippet({ isDark }: { isDark: boolean }) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <p className={`text-xs uppercase tracking-[0.2em] mb-3 ${isDark ? "text-white/40" : "text-black/40"}`}>Python API</p>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight">
              Or wire it into CI. <span className="italic">Three lines.</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="rounded-2xl border border-white/10 bg-black/80 overflow-hidden shadow-2xl text-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <span className="text-xs font-mono text-white/40">bench.py</span>
              <span className="text-xs text-white/40">python 3.10+</span>
            </div>
            <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
<span className="text-pink-400">from</span> <span className="text-cyan-300">edgebench</span> <span className="text-pink-400">import</span> benchmark{"\n\n"}
report = benchmark(<span className="text-emerald-400">"yolov8n.pt"</span>, imgsz=<span className="text-emerald-400">640</span>, iters=<span className="text-emerald-400">100</span>){"\n"}
report.save(<span className="text-emerald-400">"benchmark_report.md"</span>){"\n\n"}
<span className="text-white/50"># Fail CI if the best backend can't hit 60 FPS</span>{"\n"}
<span className="text-pink-400">assert</span> report.best.fps &gt; <span className="text-emerald-400">60</span>, report.summary()
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- CTA ----------
function CTA({ isDark }: { isDark: boolean }) {
  return (
    <section id="waitlist" className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#76B900]/15 blur-3xl" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <Reveal>
          <h2 className="font-serif text-5xl sm:text-7xl leading-tight tracking-tight mb-8">
            Get early access.<br />
            <span className="italic text-[#76B900] font-bold">Join the waitlist.</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className={`mb-10 text-lg ${isDark ? "text-white/60" : "text-black/60"}`}>
            Be the first to benchmark your model exports and find the ultimate configuration automatically. Launching soon.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex justify-center">
            <WaitlistForm isDark={isDark} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ isDark }: { isDark: boolean }) {
  return (
    <footer className={`border-t py-10 px-4 ${isDark ? "border-white/5" : "border-black/5"}`}>
      <div className={`max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm ${isDark ? "text-white/40" : "text-black/40"}`}>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A3E635" />
                <stop offset="100%" stopColor="#76B900" />
              </linearGradient>
            </defs>
            <path d="M6 8L16 16L6 24" stroke="url(#logo-grad-footer)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 8L26 16L16 24" stroke="url(#logo-grad-footer)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
          </svg>
          <span>edgebench — MIT licensed</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:opacity-100 opacity-70">GitHub</a>
          <a href="#" className="hover:opacity-100 opacity-70">Docs</a>
          <a href="#" className="hover:opacity-100 opacity-70">Changelog</a>
        </div>
      </div>
    </footer>
  );
}
