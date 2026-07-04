import { useState, useRef } from 'react';

// Spatial Tilt Panel (Minimalist: dark matte, thin white borders, zero clutter)
interface SpatialPanelProps {
  children: React.ReactNode;
  className?: string;
}

function SpatialPanel({ children, className = '' }: SpatialPanelProps) {
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
      className={`bg-white/[0.02] border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-white/20 select-none ${className}`}
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
            // mechatronics
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-white font-readex">
            embedded systems & iot specifications
          </h2>
        </div>

        {/* Minimalist Bento Grid Layout (Spatial UI, No interactive levers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 sm:gap-6 font-mono text-white">
          
          {/* Card 1: Microcontrollers Deployed (md:col-span-3) */}
          <SpatialPanel className="sm:col-span-1 md:col-span-3 h-auto min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                // microcontrollers
              </span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">
                esp8266 & nodemcu v3
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                engineering custom firmware routines in C++ for localized sensory arrays. handles real-time DHT22 telemetry, low-power sleep profiling, and local network packet transmissions.
              </p>
            </div>

            <div className="bg-[#121214]/60 border border-white/5 p-4 rounded-2xl text-[9px] text-neutral-400 space-y-1">
              <div>&bull; Compiler: ESP8266 Core for Arduino / C++</div>
              <div>&bull; Telemetry Channels: DHT22, I2C, SPI Bus</div>
              <div>&bull; OTA Flash Mechanism: Local HTTP Server updates</div>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-2 uppercase">
              hardware stack: Tensilica L106 32-bit RISC processor
            </div>
          </SpatialPanel>

          {/* Card 2: Edge Gateways (md:col-span-3) */}
          <SpatialPanel className="sm:col-span-1 md:col-span-3 h-auto min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                // edge systems
              </span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">
                raspberry pi edge gateways
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                orchestrating offline gateways that parse incoming microcontroller streams. records sensor databases locally, runs custom telemetry daemons, and secures edge firewalls.
              </p>
            </div>

            <div className="bg-[#121214]/60 border border-white/5 p-4 rounded-2xl text-[9px] text-neutral-400 space-y-1">
              <div>&bull; Architecture: Raspberry Pi 4 Model B (Debian)</div>
              <div>&bull; Local Storage: SQLite query logs, partition pools</div>
              <div>&bull; Daemons: Custom systemd system service loops</div>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-2 uppercase">
              os pipeline: local linux systems daemon
            </div>
          </SpatialPanel>

          {/* Card 3: Mesh Topologies (md:col-span-4) */}
          <SpatialPanel className="sm:col-span-2 md:col-span-4 h-auto min-h-[180px] sm:min-h-[220px] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                // topology layer
              </span>
              <h3 className="text-lg font-bold font-readex uppercase text-white leading-none">
                esp-now peer-to-peer mesh
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                implementing decentralized, off-grid communication topologies. uses ESP-NOW protocols for point-to-point data packets transmission without external router dependencies, securing transmissions through local hardware-level payload encryption.
              </p>
            </div>

            <div className="text-[8px] text-neutral-500 border-t border-white/5 pt-3 uppercase">
              network parameters: point-to-point packet delivery
            </div>
          </SpatialPanel>

          {/* Card 4: Antennas & RF Bands (md:col-span-2) */}
          <SpatialPanel className="sm:col-span-2 md:col-span-2 h-auto min-h-[180px] sm:min-h-[220px] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
                // radio frequency
              </span>
              <h3 className="text-sm font-bold font-readex uppercase text-white leading-none">
                sub-ghz bands
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                configured long-range telemetry bands on custom sub-GHz antennas.
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
