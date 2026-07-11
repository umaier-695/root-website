import { useState, useRef } from 'react';

// Spatial Tilt Panel (Minimalist: dark matte, thin white borders, zero clutter)
interface SpatialPanelProps {
  children: React.ReactNode;
  className?: string;
}

function SpatialPanel({ children, className = '' }: SpatialPanelProps) {
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
      className={`bg-white/[0.02] border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] select-none ${className}`}
    >
      {children}
    </div>
  );
}

export default function IoTNode() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12 animate-fadeIn relative">
      <div className="relative z-10 space-y-8">
        
        {/* Header */}
        <div className="mb-2">
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">
            // edge nodes & iot
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-white font-readex">
            edge computing & telemetry architectures
          </h2>
        </div>

        {/* Minimalist Bento Grid Layout (Spatial UI, No interactive levers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 font-mono text-white">
          
          {/* Card 1: Microcontrollers Deployed (lg:col-span-3) */}
          <SpatialPanel className="sm:col-span-1 lg:col-span-3 h-auto min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                // firmware development
              </span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">
                custom embedded firmware
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                developing highly-optimized C++ microcode for sensor arrays and telemetry devices. focused on low-latency data streams, robust network connectivity, and extreme power efficiency.
              </p>
            </div>

            <div className="bg-[#121214]/60 border border-white/5 p-4 rounded-2xl text-[9px] text-neutral-400 space-y-1">
              <div>&bull; Compiler: C++ / Arduino Framework</div>
              <div>&bull; Interfaces: I2C, SPI Bus, DHT22 sensors</div>
              <div>&bull; Low-Power: Custom sleep cycle profiling</div>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-2 uppercase">
              hardware architecture: ESP8266 & NodeMCU telemetry
            </div>
          </SpatialPanel>

          {/* Card 2: Edge Gateways (lg:col-span-3) */}
          <SpatialPanel className="sm:col-span-1 lg:col-span-3 h-auto min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                // local servers
              </span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">
                edge gateway systems
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                deploying localized edge computer gateways that orchestrate incoming sensor data, maintain offline databases, and host micro-service APIs on local subnets.
              </p>
            </div>

            <div className="bg-[#121214]/60 border border-white/5 p-4 rounded-2xl text-[9px] text-neutral-400 space-y-1">
              <div>&bull; OS Platform: Local Linux Gateway (Debian)</div>
              <div>&bull; Storage Layer: Local SQLite query logging</div>
              <div>&bull; Process Daemon: Custom systemd service loops</div>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-2 uppercase">
              os pipeline: local linux systems daemon
            </div>
          </SpatialPanel>

          {/* Card 3: Mesh Topologies (lg:col-span-4) */}
          <SpatialPanel className="sm:col-span-2 lg:col-span-4 h-auto min-h-[180px] sm:min-h-[220px] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                // mesh networks
              </span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">
                decentralized mesh networking
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                designing off-grid peer-to-peer wireless network topologies using hardware-encrypted point-to-point protocols for secure data delivery without internet reliance.
              </p>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-3 uppercase">
              network parameters: point-to-point packet delivery
            </div>
          </SpatialPanel>

          {/* Card 4: Antennas & RF Bands (lg:col-span-2) */}
          <SpatialPanel className="sm:col-span-2 lg:col-span-2 h-auto min-h-[180px] sm:min-h-[220px] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                // radio frequency
              </span>
              <h3 className="text-sm font-bold font-readex uppercase text-white leading-none">
                long range telemetry
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                configured long-range low-power radio communication pipelines for remote sensor coverage.
              </p>
            </div>

            <div className="bg-[#121214]/60 border border-white/5 p-3 rounded-xl text-center text-[10px] text-neutral-400">
              <div className="font-bold text-white uppercase text-[11px] mb-1">active bands</div>
              868 MHz &bull; 915 MHz
            </div>

            <div className="text-[8px] text-neutral-600 uppercase leading-none">
              low-interference transmission
            </div>
          </SpatialPanel>

        </div>

      </div>
    </div>
  );
}
