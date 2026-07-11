import { useState, useRef } from 'react';

interface SpatialGlassCardProps {
  children: React.ReactNode;
  className?: string;
}

function SpatialGlassCard({ children, className = '' }: SpatialGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const updateTilt = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = clientX - rect.left - width / 2;
    const mouseY = clientY - rect.top - height / 2;
    const rotateX = -(mouseY / (height / 2)) * 8;
    const rotateY = (mouseX / (width / 2)) * 8;
    setCoords({ x: rotateX, y: rotateY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateTilt(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
    setCoords({ x: 0, y: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    updateTilt(touch.clientX, touch.clientY);
    setIsActive(true);
  };

  const handleTouchEnd = () => {
    setIsActive(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `perspective(1000px) rotateX(${coords.x}deg) rotateY(${coords.y}deg)`,
        transition: isActive ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`bg-white/[0.02] border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] select-none ${className}`}
    >
      {children}
    </div>
  );
}

export default function AINode() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12 animate-fadeIn relative">
      
      {/* Background Liquid Glass flowing radial blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 blur-[120px] animate-[pulse_10s_infinite]" />
        <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-purple-500/15 to-indigo-500/10 blur-[100px] animate-[pulse_8s_infinite]" />
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* Header */}
        <div className="mb-2">
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">
            // intelligence layer
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-white font-readex">
            enterprise ai & llm integration
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 font-mono text-white">
          
          {/* Card 1: Active LLM Models (lg:col-span-3) */}
          <SpatialGlassCard className="sm:col-span-1 lg:col-span-3 h-auto min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] text-cyan-400 uppercase tracking-widest block">// architecture</span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">private ai deployment</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                architecting high-performance private AI inference nodes running on dedicated customer hardware. ensures complete data sovereignty and zero reliance on third-party cloud APIs.
              </p>
            </div>

            <div className="space-y-2 bg-[#121214]/60 border border-white/5 p-4 rounded-2xl">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-white">DeepSeek Coder R1</span>
                <span className="text-cyan-400 uppercase text-[9px] bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">8B (Quant q8_0)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-white">Qwen 2.5 Coder</span>
                <span className="text-cyan-400 uppercase text-[9px] bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">14B (Unquant fp16)</span>
              </div>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-2 uppercase">
              orchestration runtime: Ollama & vLLM local setups
            </div>
          </SpatialGlassCard>

          {/* Card 2: Developer Data Privacy (lg:col-span-3) */}
          <SpatialGlassCard className="sm:col-span-1 lg:col-span-3 h-auto min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] text-purple-400 uppercase tracking-widest block">// zero data egress</span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">enterprise data privacy</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                enforcing strict code and telemetry confidentiality constraints. sensitive corporate files and queries are parsed entirely on localhost sockets.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-300">
              <div className="bg-[#121214]/40 border border-white/5 p-2.5 rounded-xl">
                <span className="text-purple-400 block font-bold">100% OFFLINE</span>
                <span>No telemetry leaks</span>
              </div>
              <div className="bg-[#121214]/40 border border-white/5 p-2.5 rounded-xl">
                <span className="text-purple-400 block font-bold">ZERO CLOUD</span>
                <span>Workspace isolates</span>
              </div>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-2 uppercase">
              compliance parameters: strict corporate data safety
            </div>
          </SpatialGlassCard>

          {/* Card 3: Model Context Protocol (lg:col-span-4) */}
          <SpatialGlassCard className="sm:col-span-2 lg:col-span-4 h-auto min-h-[180px] sm:min-h-[220px] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] text-cyan-400 uppercase tracking-widest block">// context integration</span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">context-aware automation (mcp)</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                integrating the Model Context Protocol (MCP) to map complex internal systems and databases directly into LLM contexts. translates relative file schemas, indexes workspaces, and allows safe localized API agent hooks.
              </p>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-3 uppercase">
              mcp schema integration: healthy &bull; active link
            </div>
          </SpatialGlassCard>

          {/* Card 4: Directory Map details (lg:col-span-2) */}
          <SpatialGlassCard className="sm:col-span-2 lg:col-span-2 h-auto min-h-[180px] sm:min-h-[220px] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">// telemetry targets</span>
              <h3 className="text-sm font-bold font-readex uppercase text-white leading-none">pipeline telemetry</h3>
            </div>

            <div className="bg-[#121214]/60 border border-white/5 p-3.5 rounded-2xl space-y-1.5 text-[9px] text-neutral-400">
              <div className="flex justify-between">
                <span>Deploy mode:</span>
                <span className="text-white font-bold">Private clusters</span>
              </div>
              <div className="flex justify-between">
                <span>Inference:</span>
                <span className="text-white">vLLM & Ollama</span>
              </div>
              <div className="flex justify-between">
                <span>Alignment:</span>
                <span className="text-white">Enterprise SOC2</span>
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
