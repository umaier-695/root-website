import { useState, useRef } from 'react';

// Brutalist Spatial Card with heavy borders and offset drop shadows
interface BrutalistCardProps {
  children: React.ReactNode;
  className?: string;
  shadowColor?: string;
}

function BrutalistCard({ children, className = '', shadowColor = '#18f700' }: BrutalistCardProps) {
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
    const rotateX = -(mouseY / (height / 2)) * 6;
    const rotateY = (mouseX / (width / 2)) * 6;
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
      className={`bg-white text-black border-4 border-black p-6 select-none flex flex-col justify-between transition-shadow duration-300 ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${coords.x}deg) rotateY(${coords.y}deg)`,
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isHovered ? `10px 10px 0px ${shadowColor}` : `6px 6px 0px ${shadowColor}`
      }}
    >
      {children}
    </div>
  );
}

export default function CloudNode() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12 animate-fadeIn relative">
      <div className="relative z-10 space-y-8">
        
        {/* Header */}
        <div className="mb-2">
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">
            // cloud deployment
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-white font-readex">
            gcp cloud engineering specifications
          </h2>
        </div>

        {/* Minimalist Brutalist Bento Grid Layout (No interactive mock scaling switches) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 sm:gap-6 items-start font-mono">
          
          {/* Card 1: GKE Workloads Container (md:col-span-3) */}
          <BrutalistCard className="sm:col-span-1 md:col-span-3 h-auto min-h-[220px] sm:min-h-[280px]" shadowColor="#18f700">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider block bg-black text-white px-2 py-0.5 w-fit">
                orchestration
              </span>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">
                kubernetes clusters
              </h3>
            </div>

            <div className="py-2 text-black">
              <div className="text-3xl font-black leading-none uppercase">
                12+ active services
              </div>
              <p className="text-[10px] text-neutral-600 uppercase font-bold mt-1">
                running on Google Kubernetes Engine (GKE). utilizes dynamic pod auto-scaling metrics, load partitioning, and zero-downtime rolling upgrades.
              </p>
            </div>

            <div className="text-[9px] font-bold text-black border-t border-black/10 pt-2 uppercase">
              deployment target: GCP GKE clusters
            </div>
          </BrutalistCard>

          {/* Card 2: VPC Network Rules (md:col-span-3) */}
          <BrutalistCard className="sm:col-span-1 md:col-span-3 h-auto min-h-[220px] sm:min-h-[280px]" shadowColor="#ffffff">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider block bg-black text-white px-2 py-0.5 w-fit">
                networking
              </span>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">
                vpc routing & firewalls
              </h3>
            </div>

            <div className="py-2 text-black">
              <div className="text-3xl font-black leading-none uppercase">
                zero-trust vpc
              </div>
              <p className="text-[10px] text-neutral-600 uppercase font-bold mt-1">
                enforcing firewall routing rules, private subnet isolations, fine-grained Cloud IAM authentication parameters, and global Cloud Load Balancing structures.
              </p>
            </div>

            <div className="text-[9px] font-bold text-black border-t border-black/10 pt-2 uppercase">
              security tier: ingress & egress firewall guard active
            </div>
          </BrutalistCard>

          {/* Card 3: Cloud Badges & Credentials (md:col-span-6) */}
          <BrutalistCard className="sm:col-span-2 md:col-span-6 h-auto min-h-[200px]" shadowColor="#18f700">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider block bg-black text-white px-2 py-0.5 w-fit">
                credentials
              </span>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">
                google cloud badges & verified credentials
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center text-black py-2">
              <div className="md:col-span-2">
                <div className="text-3xl font-black leading-none uppercase">
                  +6 cloud credentials verified
                </div>
                <p className="text-[10px] text-neutral-600 uppercase font-bold mt-2">
                  credential pathways include: google cloud computing foundations, infrastructure, networking, cloud security engineering, and kubernetes deployment.
                </p>
              </div>

              <div className="w-full">
                <a
                  href="https://www.credly.com/users/umaier-javid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-black hover:bg-neutral-800 text-white text-xs uppercase font-bold py-3.5 border-2 border-black transition-all shadow-[4px_4px_0px_#18f700] hover:shadow-[6px_6px_0px_#18f700] active:translate-y-0.5 active:shadow-[2px_2px_0px_#18f700]"
                >
                  view verified credly badges
                </a>
              </div>
            </div>

            <div className="text-[9px] font-bold text-black border-t border-black/10 pt-2 uppercase flex justify-between">
              <span>id: umaierjavid391@gmail.com</span>
              <span>accreditation client: credly verified</span>
            </div>
          </BrutalistCard>

        </div>

      </div>
    </div>
  );
}
