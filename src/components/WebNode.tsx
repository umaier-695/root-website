import { useState, useRef } from 'react';

interface SpatialGlassCardProps {
  children: React.ReactNode;
  className?: string;
}

function SpatialGlassCard({ children, className = '' }: SpatialGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rotateX = -(mouseY / (height / 2)) * 8;
    const rotateY = (mouseX / (width / 2)) * 8;
    setCoords({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${coords.x}deg) rotateY(${coords.y}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`bg-white/[0.02] border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] select-none ${className}`}
    >
      {children}
    </div>
  );
}

export default function WebNode() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12 animate-fadeIn relative">
      <div className="relative z-10 space-y-8">
        
        {/* Header */}
        <div className="mb-2">
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">
            // development node
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-white font-readex">
            full-stack web development
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 font-mono text-white">
          
          {/* Card 1: Frontend (lg:col-span-3) */}
          <SpatialGlassCard className="sm:col-span-1 lg:col-span-3 h-auto min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] text-purple-400 uppercase tracking-widest block">// client-side architect</span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">frontend engineering</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                developing visually stunning, highly interactive, and responsive user interfaces using React, Next.js, and TailwindCSS. optimized for seamless transitions and tactile animations.
              </p>
            </div>

            <div className="space-y-2 bg-[#121214]/60 border border-white/5 p-4 rounded-2xl">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-white">Frameworks & Style</span>
                <span className="text-purple-400 uppercase text-[9px] bg-purple-950/30 px-2 py-0.5 rounded border border-purple-500/20">React / Next.js / CSS</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-white">Animations</span>
                <span className="text-purple-400 uppercase text-[9px] bg-purple-950/30 px-2 py-0.5 rounded border border-purple-500/20">Framer Motion / Canvas</span>
              </div>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-2 uppercase">
              capability: fluid motion UI & layout routing
            </div>
          </SpatialGlassCard>

          {/* Card 2: Backend (lg:col-span-3) */}
          <SpatialGlassCard className="sm:col-span-1 lg:col-span-3 h-auto min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] text-purple-400 uppercase tracking-widest block">// server-side operations</span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">backend & systems</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                architecting scalable backend logic, relational database models, and secure authentication pipelines. specialized in Node.js microservices and REST/GraphQL API systems.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-300">
              <div className="bg-[#121214]/40 border border-white/5 p-2.5 rounded-xl">
                <span className="text-purple-400 block font-bold">Runtimes</span>
                <span>Node.js / Express</span>
              </div>
              <div className="bg-[#121214]/40 border border-white/5 p-2.5 rounded-xl">
                <span className="text-purple-400 block font-bold">Databases</span>
                <span>PostgreSQL / MongoDB</span>
              </div>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-2 uppercase">
              capability: api microservices & secure auth
            </div>
          </SpatialGlassCard>

          {/* Card 3: Optimization & CDNs (lg:col-span-4) */}
          <SpatialGlassCard className="sm:col-span-2 lg:col-span-4 h-auto min-h-[180px] sm:min-h-[220px] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] text-purple-400 uppercase tracking-widest block">// performance & routing</span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">deployment & seo optimization</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                auditing core web vitals to secure optimal Lighthouse scores. implementing Server-Side Rendering (SSR), Static Site Generation (SSG), caching strategies, and global CDN deployments.
              </p>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-3 uppercase">
              optimization standard: LCP & INP alignment
            </div>
          </SpatialGlassCard>

          {/* Card 4: Stats (lg:col-span-2) */}
          <SpatialGlassCard className="sm:col-span-2 lg:col-span-2 h-auto min-h-[180px] sm:min-h-[220px] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">// tech stack indicators</span>
              <h3 className="text-sm font-bold font-readex uppercase text-white leading-none">development specs</h3>
            </div>

            <div className="bg-[#121214]/60 border border-white/5 p-3.5 rounded-2xl space-y-1.5 text-[9px] text-neutral-400">
              <div className="flex justify-between">
                <span>Frontend:</span>
                <span className="text-white font-bold">React & TS</span>
              </div>
              <div className="flex justify-between">
                <span>Backend:</span>
                <span className="text-white">Node.js API</span>
              </div>
              <div className="flex justify-between">
                <span>Hosting:</span>
                <span className="text-white">Vercel / GCP</span>
              </div>
            </div>

            <div className="text-[8px] text-neutral-600 uppercase leading-none">
              monitoring workspace indexes
            </div>
          </SpatialGlassCard>

        </div>

      </div>
    </div>
  );
}
