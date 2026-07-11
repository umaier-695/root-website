import { useState, useRef } from 'react';
import type { MouseEvent, TouchEvent } from 'react';

interface HomeNodeProps {
  onNavigate: (page: string) => void;
}

function GlowCard({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);

  const updateCoords = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    updateCoords(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    updateCoords(touch.clientX, touch.clientY);
    setIsTouching(true);
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
      className={`relative overflow-hidden group rounded-3xl ${className}`}
    >
      {/* Glow Effect Overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-0"
        style={{
          opacity: isTouching ? 1 : undefined,
          background: `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, rgba(24, 247, 0, 0.095), transparent 80%)`,
        }}
        // Also visible on hover (CSS group-hover handles desktop)
      />
      {/* Outer Border Glow — shown on touch OR hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-10 border border-emerald-400/45"
        style={{
          opacity: isTouching ? 1 : undefined,
          maskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, black, transparent)`,
        }}
      />
      {/* Card Content Wrapper */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

export default function HomeNode({ onNavigate }: HomeNodeProps) {
  const credentials = [
    {
      title: "Deploy Kubernetes Applications on GCP",
      skills: "GKE cluster setup, containerized service scaling, rolling updates",
    },
    {
      title: "Develop & Set Up Google Cloud Networks",
      skills: "VPC configuration, Cloud Firewall rules, Cloud Load Balancing",
    },
    {
      title: "Deploy and Manage Applications on App Engine",
      skills: "Serverless application scaling, traffic splitting, PaaS architecture",
    },
    {
      title: "Build a Website on Google Cloud",
      skills: "Cloud native web deployment, compute instance profiling, storage hooks",
    },
    {
      title: "The Basics of Google Cloud Compute",
      skills: "VM instance provisioning, persistent block storage, identity access management",
    },
    {
      title: "Arcade Adventure: Modern App Deployment",
      skills: "Cloud-native application workflows, rapid deployment debugging",
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10 animate-fadeIn">
      {/* Bento Grid Header */}
      <div className="mb-2">
        <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">// central home node</span>
        <h2 className="text-3xl font-semibold tracking-tight text-white font-readex">systems overview</h2>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Core Profile Card (Large Glassmorphism) */}
        <GlowCard className="sm:col-span-2 lg:col-span-2 bg-neutral-900/40 border border-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">system profiling online</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white leading-tight font-readex">
              umaier javid
            </h1>
            <p className="text-sm font-light text-neutral-300 leading-relaxed max-w-lg">
              systems and cloud engineer specializing in enterprise cloud infrastructure, offensive security auditing, and localized AI orchestration. values empirical execution over abstraction.
            </p>
          </div>
          
          <div className="mt-8 flex gap-3 flex-wrap">
            <span className="bg-neutral-800/60 border border-white/5 rounded-full px-4 py-1.5 text-xs text-neutral-400 font-mono">
              Cloud Engineer (GCP)
            </span>
            <span className="bg-neutral-800/60 border border-white/5 rounded-full px-4 py-1.5 text-xs text-neutral-400 font-mono">
              Cybersecurity Researcher
            </span>
            <span className="bg-neutral-800/60 border border-white/5 rounded-full px-4 py-1.5 text-xs text-neutral-400 font-mono">
              Full-Stack Developer
            </span>
          </div>
        </GlowCard>

        {/* Company Node Card (Frosted Glassmorphism) */}
        <GlowCard className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">// affiliation</span>
            <h3 className="text-xl font-medium font-readex text-white">ROOT Systems</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              architecting resilient, secure multi-tier topologies. specializing in zero-dependency edge architectures and offline-first mesh.
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-500">status</span>
            <span className="text-xs font-mono text-white bg-neutral-800/80 px-3 py-1 rounded-full border border-white/5 font-bold">operational</span>
          </div>
        </GlowCard>

        {/* Cloud & DevSecOps Bento Link */}
        <GlowCard
          onClick={() => onNavigate('cloud')}
          className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl cursor-pointer"
        >
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">// gcp cloud architecture</span>
            <h3 className="text-xl font-medium font-readex text-white">cloud infrastructure</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              engineering secure GKE environments, provisioning VPC networks, hardening firewalls, and managing cloud compute models.
            </p>
          </div>
          
          <div className="mt-6 flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
            <span>access monitor</span>
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </GlowCard>

        {/* Tactical Competencies Bento Link */}
        <GlowCard
          onClick={() => onNavigate('security')}
          className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl cursor-pointer"
        >
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">// offensive security</span>
            <h3 className="text-xl font-medium font-readex text-white group-hover:text-white transition-colors">cybersecurity</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              executing application penetration testing (OWASP), automated OSINT identity mapping via Maigret, and scripting pentest pipelines.
            </p>
          </div>
          
          <div className="mt-6 flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
            <span>access shell</span>
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </GlowCard>

        {/* AI Control Room Bento Link */}
        <GlowCard
          onClick={() => onNavigate('ai')}
          className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl cursor-pointer"
        >
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">// localized intelligence</span>
            <h3 className="text-xl font-medium font-readex text-white group-hover:text-white transition-colors">applied intelligence</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              optimizing quantized deep-learning models (DeepSeek, Qwen) on resource-constrained hardware using Ollama, LM Studio, and MCP.
            </p>
          </div>
          
          <div className="mt-6 flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
            <span>access pipeline</span>
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </GlowCard>

        {/* Edge Computing Bento Link */}
        <GlowCard
          onClick={() => onNavigate('iot')}
          className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl cursor-pointer"
        >
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">// decentralized edge mesh</span>
            <h3 className="text-xl font-medium font-readex text-white group-hover:text-white transition-colors">edge computing</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              developing firmware for low-power microcontrollers (ESP8266, ESP32) and engineering private RF mesh networks.
            </p>
          </div>
          
          <div className="mt-6 flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
            <span>access network</span>
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </GlowCard>

        {/* Web Development Bento Link */}
        <GlowCard
          onClick={() => onNavigate('web')}
          className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl cursor-pointer sm:col-span-2 lg:col-span-2"
        >
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">// full-stack applications</span>
            <h3 className="text-xl font-medium font-readex text-white group-hover:text-white transition-colors">web development</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              developing client-facing web portals, interactive dashboards, and high-performance applications with React, Next.js, and solid API services.
            </p>
          </div>
          
          <div className="mt-6 flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
            <span>access console</span>
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </GlowCard>

        {/* Reviews Bento Link */}
        <GlowCard
          onClick={() => onNavigate('reviews')}
          className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl cursor-pointer sm:col-span-2 lg:col-span-3"
        >
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">// client feedback board</span>
            <h3 className="text-xl font-medium font-readex text-white group-hover:text-white transition-colors">client reviews & testimonials</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              read verified testimonials from tech leads, developers, and project owners. write and submit your own client review directly.
            </p>
          </div>
          
          <div className="mt-6 flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
            <span>access reviews board</span>
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </GlowCard>

        {/* Verified Credentials Matrix - Full-Width Bento Card */}
        <GlowCard className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl sm:col-span-2 lg:col-span-3">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-2">// cloud performance matrix</span>
                <h3 className="text-xl font-medium font-readex text-white">verified professional credentials</h3>
              </div>
              <a 
                href="https://www.credly.com/users/umaier-javid"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-mono py-2.5 px-4 rounded-full self-start md:self-center font-bold"
              >
                view on credly ↗
              </a>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Google Cloud Performance Matrix: Active contributor within the Google Cloud technical ecosystem, demonstrating advanced cloud architecture, deployment velocity, and live-lab infrastructure optimization under strict production constraints.
            </p>

            {/* Grid of badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentials.map((badge, index) => (
                <div key={index} className="bg-neutral-950/50 border border-white/5 rounded-xl p-4 space-y-2 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-white shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                    </span>
                    <span className="text-xs font-semibold text-white font-mono tracking-tight">{badge.title}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono leading-relaxed pl-5">
                    {badge.skills}
                  </p>
                  <div className="pl-5 pt-1">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest bg-neutral-900 px-2 py-0.5 rounded border border-white/5">
                      google cloud
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlowCard>

      </div>
    </div>
  );
}
