import { useState, useRef } from 'react';

// Interactive Spatial Card Component
interface SpatialCardProps {
  title: string;
  category: string;
  description: string;
  points: string[];
}

function SpatialCard({ title, category, description, points }: SpatialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Map mouse position to max rotation angle (e.g., 12deg)
    const rotateX = -(mouseY / (height / 2)) * 12;
    const rotateY = (mouseX / (width / 2)) * 12;
    
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
      className="bg-white text-black border-4 border-black p-5 sm:p-6 select-none cursor-pointer flex flex-col justify-between h-auto min-h-[300px] sm:min-h-[360px]
                 shadow-[6px_6px_0px_rgba(255,255,255,0.8)] 
                 hover:shadow-[12px_12px_0px_rgba(255,255,255,0.9)] hover:border-white transition-shadow duration-300"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase font-extrabold tracking-widest bg-black text-white px-2 py-1">
            {category}
          </span>
          <span className="font-mono text-[10px] font-bold">NODE: SEC_PT_02</span>
        </div>
        
        <h3 className="text-2xl font-black tracking-tight leading-tight uppercase font-mono">
          {title}
        </h3>
        
        <p className="text-xs font-mono font-medium leading-relaxed text-neutral-800">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t-2 border-black space-y-1.5">
        {points.map((pt, idx) => (
          <div key={idx} className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
            <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.818a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .845-.143Z" clipRule="evenodd" /></svg>
            </span>
            <span>{pt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SecurityNode() {
  const [logs, setLogs] = useState<string[]>([
    'SEC_PT: initializing OWASP pentest vector...',
    'SEC_PT: analyzing target application for SSRF & Access Control vulnerabilities...',
    'SEC_PT: OSINT threat surface mapping via Maigret active.',
    'SEC_PT: low-noise reconnaissance pipeline operational.'
  ]);
  const [cmdInput, setCmdInput] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    const newLogs = [...logs, `root@shell:~$ ${cmdInput}`];
    
    if (cmdInput.toLowerCase() === 'clear') {
      setLogs([]);
    } else if (cmdInput.toLowerCase() === 'scan') {
      setLogs([
        ...newLogs,
        'SCAN: initiating automated threat footprint scan...',
        'SCAN: external attack surfaces mapped using Maigret.',
        'SCAN: 0 vulnerabilities found on active routes.'
      ]);
    } else {
      setLogs([...newLogs, `command execution complete. status: 200`]);
    }
    setCmdInput('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12 animate-fadeIn select-none">
      
      {/* Brutalist Section Header */}
      <div className="border-b-4 border-white pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-black uppercase bg-white text-black px-2 py-1 inline-block mb-3">
            // security node
          </span>
          <h2 className="text-4xl font-extrabold tracking-tighter uppercase font-mono text-white leading-none">
            vulnerability auditing
          </h2>
        </div>
        <div className="font-mono text-xs text-white/50 text-right">
          SHELL TERMINAL: CYBERSECURITY
        </div>
      </div>

      {/* Grid displaying the Spatial UI tilt cards (using Brutalism design: flat white cards, thick black border, harsh contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
        <SpatialCard
          category="assessment"
          title="owasp testing"
          description="executing application penetration tests to locate and patch critical structural issues such as Injection, SSRF, and Access Control flaws."
          points={[
            'OWASP framework compliance',
            'Vulnerability assessments',
            'Defensive code remediation'
          ]}
        />
        
        <SpatialCard
          category="recon"
          title="osint & maigret"
          description="advanced open-source intelligence gathering, threat modeling, and cross-platform identity mapping utilizing Maigret configurations."
          points={[
            'Identity mapping automation',
            'External attack surface mapping',
            'Automated identity discovery'
          ]}
        />
        
        <SpatialCard
          category="automation"
          title="pentest pipelines"
          description="scripting custom automated testing pipelines to perform continuous vulnerability monitoring and low-noise network recon."
          points={[
            'Automated recon pipelines',
            'Continuous threat monitoring',
            'Custom low-noise script setups'
          ]}
        />
      </div>

      {/* Brutalist Monospace Logs Dashboard */}
      <div className="border-4 border-white bg-black p-4 sm:p-6 shadow-[8px_8px_0px_rgba(255,255,255,0.1)] space-y-4 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <span className="font-mono text-xs font-black text-white">LIVE SHELL LOGS</span>
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
        </div>

        <div className="h-44 overflow-y-auto font-mono text-xs text-neutral-400 space-y-2 select-text leading-tight">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommand} className="flex gap-2 pt-3 border-t border-neutral-900">
          <span className="font-mono text-xs text-white self-center">root@shell:~$</span>
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder="type 'scan' or 'clear'..."
            className="flex-1 bg-transparent border-b-2 border-white/20 text-xs font-mono text-white focus:outline-none focus:border-white py-1"
          />
        </form>
      </div>

    </div>
  );
}
