interface HomeNodeProps {
  onNavigate: (page: string) => void;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Core Profile Card (Large Glassmorphism) */}
        <div className="sm:col-span-2 md:col-span-2 bg-neutral-900/40 border border-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-white/10 transition-colors">
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
        </div>

        {/* Company Node Card (Frosted Glassmorphism) */}
        <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-white/10 transition-colors">
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
        </div>

        {/* Cloud & DevSecOps Bento Link */}
        <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-white/10 transition-colors cursor-pointer group"
             onClick={() => onNavigate('cloud')}>
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">// gcp cloud architecture</span>
            <h3 className="text-xl font-medium font-readex text-white">cloud & devsecops</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              engineering secure GKE environments, provisioning VPC networks, hardening firewalls, and managing cloud compute models.
            </p>
          </div>
          
          <div className="mt-6 flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
            <span>access monitor</span>
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>

        {/* Tactical Competencies Bento Link */}
        <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-white/10 transition-colors cursor-pointer group"
             onClick={() => onNavigate('security')}>
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
        </div>

        {/* AI Control Room Bento Link */}
        <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-white/10 transition-colors cursor-pointer group"
             onClick={() => onNavigate('ai')}>
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">// localized intelligence</span>
            <h3 className="text-xl font-medium font-readex text-white group-hover:text-white transition-colors">localized ai</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              optimizing quantized deep-learning models (DeepSeek, Qwen) on resource-constrained hardware using Ollama, LM Studio, and MCP.
            </p>
          </div>
          
          <div className="mt-6 flex items-center gap-1.5 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
            <span>access pipeline</span>
            <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </div>

        {/* Verified Credentials Matrix - Full-Width Bento Card */}
        <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl sm:col-span-2 md:col-span-3 hover:border-white/10 transition-colors">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>

      </div>
    </div>
  );
}
