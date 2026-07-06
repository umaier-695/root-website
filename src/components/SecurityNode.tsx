import { useState, useRef, useEffect } from 'react';

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
                 hover:shadow-[12px_12px_0px_rgba(255,255,255,0.9)] hover:border-emerald-500 transition-all duration-300"
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
    'SEC_PT: low-noise reconnaissance pipeline operational.',
    'type "help" for a list of available custom interactive commands.'
  ]);
  const [cmdInput, setCmdInput] = useState('');
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      // Direct internal container scrolling (zero side effects on main window scroll)
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    const cleanCmd = cmdInput.trim().toLowerCase();
    const newLogs = [...logs, `root@shell:~$ ${cmdInput}`];
    
    if (cleanCmd === 'clear') {
      setLogs([]);
    } else if (cleanCmd === 'help') {
      setLogs([
        ...newLogs,
        'AVAILABLE SHELL COMMANDS:',
        '  - help    : Renders the active interactive command menu helper.',
        '  - scan    : Initiates offensive vulnerability footprint scans.',
        '  - about   : Prints professional summary & business statement.',
        '  - skills  : Outlines core DevOps, cloud architecture & security stacks.',
        '  - contact : Displays credentials details & emails.',
        '  - fiverr  : Coordinates for hiring contracts.',
        '  - clear   : Flushes active terminal shell buffers.'
      ]);
    } else if (cleanCmd === 'scan') {
      setLogs([
        ...newLogs,
        'SCAN: initiating automated threat footprint scan...',
        'SCAN: external attack surfaces mapped using Maigret.',
        'SCAN: 0 vulnerabilities found on active routes.'
      ]);
    } else if (cleanCmd === 'about') {
      setLogs([
        ...newLogs,
        'SUMMARY STATEMENT:',
        '  Systems & Cloud Engineer specializing in enterprise cloud architecture,',
        '  vulnerability auditing, and localized private AI pipelines.',
        '  Building resilient GKE workloads, zero-trust cloud network security,',
        '  and hardware edge nodes.'
      ]);
    } else if (cleanCmd === 'skills') {
      setLogs([
        ...newLogs,
        'CAPABILITIES ARCHITECTURE:',
        '  [1] CLOUD DEV&OPS : GCP, Kubernetes (GKE), Cloud Run, VPC IAM routing',
        '  [2] CYBERSECURITY : Vulnerability audits, OWASP threat modeling',
        '  [3] APPLIED AI    : Self-hosted LLM clusters, local vLLM RAG networks',
        '  [4] EDGE NODES    : Embedded C++ mechatronics, off-grid telemetry gateway'
      ]);
    } else if (cleanCmd === 'contact') {
      setLogs([
        ...newLogs,
        'COMMUNICATION PATHWAYS:',
        '  - Email Address : umaierjavid391@gmail.com',
        '  - Fiverr Profile: https://www.fiverr.com/umaierjavid392',
        '  - Credly Badge  : https://www.credly.com/users/umaier-javid'
      ]);
    } else if (cleanCmd === 'fiverr') {
      setLogs([
        ...newLogs,
        'FIVERR ESCROW HIRE CONTRACTS:',
        '  Available for custom consulting contracts, penetration tests, private AI configurations,',
        '  or edge microservice telemetry gateways. Book details at:',
        '  https://www.fiverr.com/umaierjavid392'
      ]);
    } else {
      setLogs([...newLogs, `command execution complete. status: 200`]);
    }
    setCmdInput('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12 animate-fadeIn select-none">
      
      {/* Section Header */}
      <div className="border-b-4 border-white pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-black uppercase bg-white text-black px-2 py-1 inline-block mb-3">
            // security operations
          </span>
          <h2 className="text-4xl font-extrabold tracking-tighter uppercase font-mono text-white leading-none">
            cybersecurity & compliance audits
          </h2>
        </div>
        <div className="font-mono text-xs text-white/50 text-right">
          VULNERABILITY ASSESSMENT & RISK REMEDIATION
        </div>
      </div>

      {/* Grid displaying the Spatial UI tilt cards (using Brutalism design: flat white cards, thick black border, harsh contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
        <SpatialCard
          category="assessment"
          title="penetration testing"
          description="executing application penetration tests to locate and patch critical structural issues such as Injection, SSRF, and Access Control flaws before malicious actors exploit them."
          points={[
            'OWASP framework compliance',
            'Defensive code remediation',
            'Actionable risk mitigation reports'
          ]}
        />
        
        <SpatialCard
          category="recon"
          title="threat surface mapping"
          description="advanced threat modeling and external surface analysis to identify exposed databases, leaked credentials, and network perimeter vulnerabilities."
          points={[
            'Perimeter hardening audits',
            'Digital footprint discovery',
            'External attack surface analysis'
          ]}
        />
        
        <SpatialCard
          category="automation"
          title="continuous monitoring"
          description="scripting and deploying customized continuous vulnerability monitoring dashboards and low-noise threat detection sensors."
          points={[
            'Automated security scanning',
            'Real-time compliance checks',
            'Secure CI/CD pipe integrations'
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

        <div ref={logsContainerRef} className="h-44 overflow-y-auto font-mono text-xs text-neutral-400 space-y-2 select-text leading-tight scroll-smooth">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed whitespace-pre-wrap break-all">
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
            placeholder="type 'help', 'scan', 'about', 'clear'..."
            className="flex-1 bg-transparent border-b-2 border-white/20 text-xs font-mono text-white focus:outline-none focus:border-white py-1"
          />
        </form>
      </div>

    </div>
  );
}
