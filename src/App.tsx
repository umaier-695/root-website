import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import HomeNode from './components/HomeNode';
import SecurityNode from './components/SecurityNode';
import AINode from './components/AINode';
import IoTNode from './components/IoTNode';
import CloudNode from './components/CloudNode';
import WebNode from './components/WebNode';

type PageType = 'home' | 'security' | 'ai' | 'iot' | 'cloud' | 'web';

function MeshBackground({ currentPage }: { currentPage: PageType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRenderMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Store currentPage in a ref so the requestAnimationFrame draw loop can read it on every frame
  // without tearing down the canvas context and event listeners on page changes.
  const currentPageRef = useRef(currentPage);
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const cols = width < 640 ? 14 : width < 1024 ? 18 : 22;
    const rows = width < 640 ? 14 : width < 1024 ? 18 : 22;
    const spacing = width < 640 ? 40 : width < 1024 ? 42 : 45;
    const isMobile = width < 1024;

    let rotX = 1.0; // Initial tilt angle (looking down at terrain)
    let rotY = 0.0; // Initial rotation angle
    let targetRotX = 1.0;
    let targetRotY = 0.0;

    let clientX = -9999;
    let clientY = -9999;

    // Click Shockwave physics state
    let clickTime = 0;
    let clickX = -9999;
    let clickY = -9999;

    const handleCanvasClick = (e: MouseEvent) => {
      clickTime = Date.now();
      clickX = e.clientX;
      clickY = e.clientY;
    };
    window.addEventListener('click', handleCanvasClick, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / width) * 2 - 1;
      const mouseY = (e.clientY / height) * 2 - 1;
      targetRotY = mouseX * 0.3;
      targetRotX = 1.0 + mouseY * 0.25;
      clientX = e.clientX;
      clientY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetRotY = 0.0;
      targetRotX = 1.0;
      clientX = -9999;
      clientY = -9999;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const mouseX = (touch.clientX / width) * 2 - 1;
      const mouseY = (touch.clientY / height) * 2 - 1;
      targetRotY = mouseX * 0.3;
      targetRotX = 1.0 + mouseY * 0.25;
      clientX = touch.clientX;
      clientY = touch.clientY;
    };

    const handleTouchEnd = () => {
      targetRotY = 0.0;
      targetRotX = 1.0;
      clientX = -9999;
      clientY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const activePage = currentPageRef.current;
      const isHome = activePage === 'home';
      const baseOpacity = isHome ? 0.25 : 0.12; // Slightly higher base opacity for clear visibility
      const time = Date.now() * 0.0012;

      // Theme-based colors for grid lines
      let themeColor = '255, 255, 255'; // default: cyber white
      if (activePage === 'security') themeColor = '16, 185, 129'; // emerald green
      if (activePage === 'ai') themeColor = '99, 102, 241'; // deep indigo
      if (activePage === 'iot') themeColor = '245, 158, 11'; // amber/orange
      if (activePage === 'cloud') themeColor = '6, 182, 212'; // sky cyan
      if (activePage === 'web') themeColor = '168, 85, 247'; // neon purple/magenta

      // Camera configurations
      const focalLength = 380;
      const cameraDistance = 450;
      const yOffset = isMobile ? height * 0.05 : height * 0.15; // Shift terrain higher on mobile to prevent occlusion

      // Smoothly interpolate rotation angles
      rotY += 0.001 + (targetRotY - rotY) * 0.05;
      rotX += (targetRotX - rotX) * 0.05;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Generate and project 3D points
      const grid: Array<Array<{ x: number; y: number; z: number }>> = [];

      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          // Centered flat coordinates
          const x0 = (c - (cols - 1) / 2) * spacing;
          const z0 = (r - (rows - 1) / 2) * spacing;

          // Compute wave heights using multiple sine/cosine frequencies
          const wave1 = Math.sin(c * 0.35 + time) * Math.cos(r * 0.35 + time);
          const wave2 = Math.sin(c * 0.15 - time * 0.8) * 1.5;
          const y0 = (wave1 + wave2) * 16;

          // Rotate around Y-axis
          let x1 = x0 * cosY - z0 * sinY;
          let z1 = x0 * sinY + z0 * cosY;

          // Rotate around X-axis (tilt)
          let y2 = y0 * cosX - z1 * sinX;
          let z2 = y0 * sinX + z1 * cosX;

          // Perspective projection
          const scale = focalLength / (z2 + cameraDistance);
          let xp = x1 * scale + width / 2;
          let yp = y2 * scale + height / 2 + yOffset;

          // SHOCKWAVE RIPPLE CLICK EVENTS: Emits expanding ring forces on click/tap
          const clickElapsed = (Date.now() - clickTime) * 0.001; // in seconds
          if (clickElapsed < 1.5) {
            const rippleSpeed = 480; // pixels per second
            const rippleRadius = clickElapsed * rippleSpeed;
            const maxRippleWidth = 100; // wavefront thickness in pixels

            const dxClick = xp - clickX;
            const dyClick = yp - clickY;
            const distClick = Math.sqrt(dxClick * dxClick + dyClick * dyClick);

            if (distClick > 0) {
              const distFromWavefront = Math.abs(distClick - rippleRadius);
              if (distFromWavefront < maxRippleWidth) {
                // Wavefront force multiplier (falls off as wavefront expands)
                const force = (1 - distFromWavefront / maxRippleWidth) * (1 - clickElapsed / 1.5) * 55;
                xp += (dxClick / distClick) * force;
                yp += (dyClick / distClick) * force;
              }
            }
          }

          // MAGNETIC WARP: Bends grid coordinates outwards away from mouse pointer (Optimized using Squared Distance)
          const dx = xp - clientX;
          const dy = yp - clientY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 32400) { // 180 * 180
            const dist = Math.sqrt(distSq);
            if (dist > 0) {
              const force = (180 - dist) / 180;
              xp += (dx / dist) * force * 24;
              yp += (dy / dist) * force * 24;
            }
          }

          grid[r].push({ x: xp, y: yp, z: z2 });
        }
      }

      // Draw connection lines
      const drawLine = (p1: any, p2: any, alpha: number) => {
        const dx = (p1.x + p2.x) / 2 - clientX;
        const dy = (p1.y + p2.y) / 2 - clientY;
        const distSq = dx * dx + dy * dy;
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (distSq < 25600) { // 160 * 160 (Optimized using Squared Distance to prevent Math.sqrt on far lines)
          const dist = Math.sqrt(distSq);
          const glowFactor = (160 - dist) / 160;
          ctx.lineWidth = 0.55 + glowFactor * 0.95;
          ctx.strokeStyle = `rgba(${themeColor}, ${alpha * (1 + glowFactor * 3.5)})`;
        } else {
          ctx.lineWidth = 0.55;
          ctx.strokeStyle = `rgba(${themeColor}, ${alpha})`;
        }
        ctx.stroke();
      };

      // Draw connection lines (Horizontal)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const p1 = grid[r][c];
          const p2 = grid[r][c + 1];

          // Fade based on Z depth
          const maxZ = spacing * rows;
          const zDepthFade = Math.max(0, 1 - (p1.z + p2.z) / (maxZ * 1.2));
          const alpha = baseOpacity * zDepthFade * 0.9;

          drawLine(p1, p2, alpha);
        }
      }

      // Draw connection lines (Vertical)
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols; c++) {
          const p1 = grid[r][c];
          const p2 = grid[r + 1][c];

          const maxZ = spacing * rows;
          const zDepthFade = Math.max(0, 1 - (p1.z + p2.z) / (maxZ * 1.2));
          const alpha = baseOpacity * zDepthFade * 0.9;

          drawLine(p1, p2, alpha);
        }
      }

      // Draw grid nodes (dots or custom markers at vertices)
      const dotOpacity = isHome ? 0.45 : 0.22;
      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 2) {
          const p = grid[r][c];
          const maxZ = spacing * rows;
          const zDepthFade = Math.max(0, 1 - p.z / (maxZ * 1.2));
          
          const dx = p.x - clientX;
          const dy = p.y - clientY;
          const distSq = dx * dx + dy * dy;

          // AI Synapse links: Draw fine connecting wires from touch/cursor coordinates directly to closest vertices
          if (activePage === 'ai' && distSq < 22500) { // 150 * 150
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(clientX, clientY);
            ctx.strokeStyle = `rgba(${themeColor}, ${zDepthFade * 0.18})`;
            ctx.lineWidth = 0.45;
            ctx.stroke();
          }

          ctx.beginPath();
          if (activePage === 'security') {
            // Reverted back to clean circle dots
            if (distSq < 22500) {
              const dist = Math.sqrt(distSq);
              const glowFactor = (150 - dist) / 150;
              const size = (1.0 + zDepthFade * 1.2) * (1 + glowFactor * 1.8);
              const alpha = dotOpacity * zDepthFade * (1 + glowFactor * 2.5);
              ctx.fillStyle = `rgba(${themeColor}, ${alpha})`;
              ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            } else {
              const size = 1.0 + zDepthFade * 1.2;
              const alpha = dotOpacity * zDepthFade;
              ctx.fillStyle = `rgba(${themeColor}, ${alpha})`;
              ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            }
            ctx.fill();
          } else if (activePage === 'iot') {
            // Edge Computing (IoT) Node: Binary numbers 0 and 1
            ctx.font = 'bold 8px monospace';
            const alpha = dotOpacity * zDepthFade * (distSq < 22500 ? 1.8 : 1.0);
            ctx.fillStyle = `rgba(${themeColor}, ${alpha})`;
            ctx.fillText((r + c) % 2 === 0 ? '0' : '1', p.x - 3, p.y + 3);
          } else {
            // Default Overview & other pages: circles
            if (distSq < 22500) {
              const dist = Math.sqrt(distSq);
              const glowFactor = (150 - dist) / 150;
              const size = (1.0 + zDepthFade * 1.2) * (1 + glowFactor * 1.8);
              const alpha = dotOpacity * zDepthFade * (1 + glowFactor * 2.5);
              ctx.fillStyle = `rgba(${themeColor}, ${alpha})`;
              ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            } else {
              const size = 1.0 + zDepthFade * 1.2;
              const alpha = dotOpacity * zDepthFade;
              ctx.fillStyle = `rgba(${themeColor}, ${alpha})`;
              ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            }
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full -z-10 pointer-events-none transition-all duration-700 ${
        !isRenderMobile && currentPage !== 'home' ? 'blur-[1.5px]' : 'blur-none'
      }`}
    />
  );
}

function InteractiveLetter({ char, active, isParagraph = false }: { char: string; active: boolean; isParagraph?: boolean }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Pre-calculate animation values
  const hoverScaleY = isParagraph ? (isMobile ? 1.08 : 1.15) : (isMobile ? 1.15 : 1.28);
  const hoverScaleX = isParagraph ? (isMobile ? 1.04 : 1.08) : (isMobile ? 1.08 : 1.15);
  const hoverY = isParagraph ? (isMobile ? -2 : -4) : (isMobile ? -3 : -8);

  const echoX = isParagraph ? (isMobile ? 1 : 2) : (isMobile ? 2 : 4);
  const echoY = isParagraph ? (isMobile ? -0.8 : -1.5) : (isMobile ? -1.5 : -3.5);
  const echoScaleY = isParagraph ? (isMobile ? 1.05 : 1.12) : (isMobile ? 1.1 : 1.2);
  const echoScaleX = isParagraph ? (isMobile ? 1.02 : 1.05) : (isMobile ? 1.05 : 1.1);

  return (
    <motion.span
      className="relative inline-block cursor-default select-none"
      style={{ originX: 0.5, originY: 0.5 }}
      initial="initial"
      whileHover="hover"
      whileTap="hover"
    >
      {/* Ghost Depth Echo */}
      {char !== ' ' && char !== '\u00A0' && (
        <motion.span
          className="absolute inset-0 text-white/20 pointer-events-none"
          variants={{
            initial: { x: 0, y: 0, scaleY: 1, scaleX: 1, opacity: 0, filter: 'blur(0px)' },
            hover: {
              x: echoX,
              y: echoY,
              scaleY: echoScaleY,
              scaleX: echoScaleX,
              opacity: 0.35,
              filter: isMobile ? 'none' : 'blur(1.5px)',
              transition: { type: 'spring', stiffness: 400, damping: 14 }
            }
          }}
        >
          {char}
        </motion.span>
      )}

      {/* Main Letter */}
      <motion.span
        className={`inline-block transition-colors duration-150 ${
          active 
            ? 'text-black hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]' 
            : 'text-inherit hover:text-white hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.75)]'
        }`}
        variants={{
          initial: { scaleY: 1, scaleX: 1, y: 0 },
          hover: {
            scaleY: hoverScaleY,
            scaleX: hoverScaleX,
            y: hoverY,
            transition: { type: 'spring', stiffness: 400, damping: 14 }
          }
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </motion.span>
  );
}

function InteractiveWord({ word, className = '', active = false }: { word: string; className?: string; active?: boolean }) {
  return (
    <span className={`inline-block select-none ${className}`}>
      {word.split('').map((char, index) => (
        <InteractiveLetter 
          key={index} 
          char={char} 
          active={active} 
        />
      ))}
    </span>
  );
}

function InteractiveParagraph({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`inline ${className}`}>
      {text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] select-none">
          {word.split('').map((char, charIndex) => (
            <InteractiveLetter
              key={charIndex}
              char={char}
              active={false}
              isParagraph={true}
            />
          ))}
        </span>
      ))}
    </span>
  );
}


function DecryptText({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayText, setDisplayText] = useState('');
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%-+=*[]{}';

  useEffect(() => {
    if (!isInView) return;
    let active = true;
    const timeout = setTimeout(() => {
      let iteration = 0;
      const interval = setInterval(() => {
        if (!active) return;
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, 30);
    }, delay);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [text, delay, isInView]);

  return <span ref={ref} className="font-mono">{displayText || text.replace(/./g, '_')}</span>;
}


export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [botCheck, setBotCheck] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const navigate = (page: PageType) => {
    setCurrentPage(page);
    setMenuOpen(false);
    const target = document.getElementById(page);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Reset scroll restoration to manual and scroll to top on initial page load / refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    setCurrentPage('home');
  }, []);

  useEffect(() => {
    // 1. Force highlight 'home' when at the very top of page & toggle navbar visibility
    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 100) {
        setCurrentPage('home');
      }

      if (currentScrollY < 50) {
        setNavVisible(true);
        lastScrollY.current = currentScrollY;
      } else if (Math.abs(delta) > 10) {
        if (delta > 0) {
          setNavVisible(false);
        } else {
          setNavVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    // 2. IntersectionObserver for other sections
    const sections: PageType[] = ['home', 'security', 'ai', 'iot', 'cloud'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Only update via observer if we are not at the very top
            if (window.scrollY >= 100 || id === 'home') {
              setCurrentPage(id);
            }
          }
        },
        {
          threshold: 0.05,
          rootMargin: '-20% 0px -40% 0px'
        }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Local client-side rate limiting to prevent spam submission scripts
    const lastSubmission = localStorage.getItem('form_last_submission');
    if (lastSubmission) {
      const timeDiff = Date.now() - parseInt(lastSubmission, 10);
      if (timeDiff < 60000) {
        setFormStatus({ 
          type: 'error', 
          message: `Rate limit active. Please wait ${Math.ceil((60000 - timeDiff) / 1000)} seconds before sending another message.` 
        });
        return;
      }
    }

    setFormSubmitted(true);
    setFormStatus({ type: null, message: '' });

    // Replace the string below with your free Web3Forms access key from web3forms.com
    const ACCESS_KEY = "d3ebcb2b-9ec1-4268-85a0-cfed62657c1c"; // Default temporary registration key, replace with yours if needed

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: alias,
          email: email,
          subject: subject,
          message: message,
          botcheck: botCheck,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        // Automatically dismiss success status notification after 3000ms
        setTimeout(() => {
          setFormStatus(prev => prev.type === 'success' ? { type: null, message: '' } : prev);
        }, 3000);
        localStorage.setItem('form_last_submission', Date.now().toString());
        setAlias('');
        setEmail('');
        setSubject('');
        setMessage('');
        setBotCheck(false);
      } else {
        setFormStatus({ type: 'error', message: data.message });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: 'Transmission failed. Please verify your internet connection.' });
    } finally {
      setFormSubmitted(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full text-white selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      {/* Background Mesh Network Canvas */}
      <MeshBackground currentPage={currentPage} />

      {/* Ambient Glowmorphism Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 transition-all duration-1000">
        <div className={`absolute top-[20%] left-[15%] w-[60vw] h-[60vw] max-w-[650px] rounded-full blur-[160px] transition-all duration-1000 ${
          currentPage === 'home' ? 'bg-white/5' :
          currentPage === 'security' ? 'bg-emerald-500/10' :
          currentPage === 'ai' ? 'bg-indigo-500/10' :
          currentPage === 'iot' ? 'bg-amber-500/10' :
          currentPage === 'web' ? 'bg-purple-500/10' :
          'bg-cyan-500/10'
        }`} />
        <div className={`absolute bottom-[20%] right-[15%] w-[55vw] h-[55vw] max-w-[550px] rounded-full blur-[140px] transition-all duration-1000 ${
          currentPage === 'home' ? 'bg-white/3' :
          currentPage === 'security' ? 'bg-emerald-600/5' :
          currentPage === 'ai' ? 'bg-purple-500/5' :
          currentPage === 'iot' ? 'bg-yellow-500/5' :
          currentPage === 'web' ? 'bg-purple-600/5' :
          'bg-blue-500/5'
        }`} />
      </div>

      {/* Floating Navbar */}
      <motion.nav
        animate={isMobile ? {
          y: navVisible ? 0 : -80,
          opacity: navVisible ? 1 : 0,
        } : {
          y: 0,
          opacity: 1
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-50 px-5 md:px-10 pt-5 md:pt-6 top-0 left-0 right-0 flex items-center justify-between gap-4 backdrop-blur-[2px]"
      >
        {/* Left Pill (Brand) */}
        <div
          onClick={() => navigate('home')}
          className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3 border border-white/5 shadow-lg shadow-black/50 cursor-pointer hover:border-white/10 transition-colors"
        >
          <svg viewBox="0 0 256 256" className="h-5 w-5" fill="#ffffff">
            <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" fill="#ffffff" />
          </svg>
          <span className="text-white text-sm font-normal tracking-tight font-readex">ROOT</span>
        </div>

        <motion.div
          animate={!isMobile ? {
            clipPath: navVisible 
              ? 'inset(0% 0% 0% 0% round 9999px)' 
              : 'inset(0% 50% 0% 50% round 9999px)',
            opacity: navVisible ? 1 : 0,
            scale: navVisible ? 1 : 0.93,
          } : {
            clipPath: 'inset(0% 0% 0% 0% round 9999px)',
            opacity: 1,
            scale: 1,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-2 xl:px-3 py-1.5 xl:py-2 border border-white/5 shadow-lg shadow-black/50"
        >
          {(['home', 'security', 'ai', 'iot', 'cloud', 'web'] as const).map((page) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`px-3 xl:px-5 py-1.5 xl:py-2 rounded-full transition-all font-mono tracking-wider text-[10px] xl:text-xs whitespace-nowrap ${
                currentPage === page
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {page === 'home' && <InteractiveWord word="overview" active={currentPage === 'home'} />}
              {page === 'security' && <InteractiveWord word="security" active={currentPage === 'security'} />}
              {page === 'ai' && <InteractiveWord word="ai" active={currentPage === 'ai'} />}
              {page === 'iot' && <InteractiveWord word="iot" active={currentPage === 'iot'} />}
              {page === 'cloud' && <InteractiveWord word="cloud" active={currentPage === 'cloud'} />}
              {page === 'web' && <InteractiveWord word="web" active={currentPage === 'web'} />}
            </button>
          ))}
        </motion.div>

        {/* Right side — uplink button (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3">
          {/* Uplink button — visible on desktop only */}
          <a
            href="#contact"
            onClick={() => setCurrentPage('home')}
            className="hidden lg:inline-flex bg-white text-black text-xs font-mono font-bold uppercase border-2 border-black px-6 py-3 transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(255,255,255,0.8)]"
          >
            <InteractiveWord word="contact" active={true} />
          </a>

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] bg-neutral-900/90 backdrop-blur rounded-full border border-white/10 shadow-lg shadow-black/50 cursor-pointer hover:border-white/20 transition-colors"
          >
            <span
              style={{ transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none', transition: 'transform 0.25s ease' }}
              className="block w-4 h-[1.5px] bg-white rounded-full"
            />
            <span
              style={{ opacity: menuOpen ? 0 : 1, transition: 'opacity 0.15s ease' }}
              className="block w-4 h-[1.5px] bg-white rounded-full"
            />
            <span
              style={{ transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none', transition: 'transform 0.25s ease' }}
              className="block w-4 h-[1.5px] bg-white rounded-full"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile slide-down menu overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)' }}
      >
        {/* Backdrop — tap to close */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu card */}
        <div className="relative mx-4 mt-20 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">// navigation</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-mono text-neutral-400">{currentPage}</span>
            </div>
          </div>

          {/* Nav items */}
          <div className="p-3 space-y-1">
            {([
              { page: 'home', label: 'overview', sub: 'profile & overview' },
              { page: 'security', label: 'cybersecurity', sub: 'owasp & pentest auditing' },
              { page: 'ai', label: 'applied intelligence', sub: 'ollama & llm pipelines' },
              { page: 'iot', label: 'edge computing', sub: 'esp8266 & iot systems' },
              { page: 'cloud', label: 'cloud infrastructure', sub: 'kubernetes & devsecops' },
              { page: 'web', label: 'web development', sub: 'next.js & full-stack applications' },
            ] as { page: PageType; label: string; sub: string }[]).map(({ page, label, sub }) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                  currentPage === page
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <div className="text-left">
                  <div className={`text-xs font-mono tracking-widest font-semibold ${
                    currentPage === page ? 'text-black' : 'text-white'
                  }`}>
                    <InteractiveWord word={label} active={currentPage === page} />
                  </div>
                  <div className={`text-[10px] mt-0.5 ${
                    currentPage === page ? 'text-black/60' : 'text-neutral-500'
                  }`}>{sub}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                  className={`w-4 h-4 shrink-0 ${ currentPage === page ? 'text-black/40' : 'text-neutral-600' }`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            ))}
          </div>

          {/* Footer — contact */}
          <div className="px-3 pb-3">
            <a
              href="#contact"
              onClick={() => { setCurrentPage('home'); setMenuOpen(false); }}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black text-xs font-mono font-bold tracking-widest uppercase border-2 border-black transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(255,255,255,0.8)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 1 1.242 7.244" />
              </svg>
              <InteractiveWord word="contact me" active={true} />
            </a>
          </div>
        </div>
      </div>
      {/* Main Pages Content (Single Page Scrolling Portfolio) */}
      <div className="relative z-10 pt-28 pb-12 w-full min-h-screen space-y-36">
        
        {/* VIEW 1: HOME PAGE (includes Hero Section & Bento Grid) */}
        <div id="home" className="space-y-12 scroll-mt-28">
          {/* HERO SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex flex-col justify-center items-center overflow-hidden"
          >

            {/* ── MOBILE HERO (< md) ─────────────────────────────────── */}
            <div className="md:hidden w-full px-5 pt-10 pb-24 flex flex-col gap-6 select-none">
              {/* Stacked headline words */}
              <div className="space-y-1 pointer-events-auto">
                <h1 className="hero-title text-white font-medium text-[14vw] leading-none">
                  <InteractiveWord word="engineer" />
                </h1>
                <h1 className="hero-title text-white font-medium text-[14vw] leading-none text-right">
                  <InteractiveWord word="secure" />
                </h1>
                <h1 className="hero-title text-white font-medium text-[11.5vw] leading-none">
                  <InteractiveWord word="orchestrate" />
                </h1>
              </div>

              {/* Description */}
              <p className="text-[13px] leading-relaxed text-white/70 max-w-xs font-light">
                systems &amp; cloud engineer specializing in enterprise cloud infrastructure, offensive security auditing, and localized AI orchestration.
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-6 border-t border-white/10 pt-5">
                <div className="flex flex-col">
                  <span className="text-3xl font-medium tracking-tight text-white font-readex">+6</span>
                  <span className="text-[10px] text-white/50 font-mono">gcp badges</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-medium tracking-tight text-white font-readex">+12</span>
                  <span className="text-[10px] text-white/50 font-mono">gke clusters</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-medium tracking-tight text-white font-readex">+85</span>
                  <span className="text-[10px] text-white/50 font-mono">vulns patched</span>
                </div>
              </div>

              {/* Scroll cue */}
              <div
                className="flex flex-col items-start gap-1 cursor-pointer pointer-events-auto"
                onClick={() => document.getElementById('bento-anchor')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-[10px] uppercase tracking-widest text-white/30">scroll to brief</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-white/30 animate-bounce">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

            {/* ── DESKTOP HERO (md+) ─────────────────────────────────── */}
            <div className="hidden md:block relative h-[90vh] w-full pointer-events-none max-w-5xl mx-auto">
              {/* Three Giant Staggered Headline Words */}
              <h1 className="hero-title absolute text-white font-medium text-[9vw] lg:text-[8vw] left-10 top-[14%] select-none pointer-events-auto">
                <InteractiveWord word="engineer" />
              </h1>
              
              <h1 className="hero-title absolute text-white font-medium text-[9vw] lg:text-[8vw] right-10 top-[38%] select-none pointer-events-auto">
                <InteractiveWord word="secure" />
              </h1>
              
              <h1 className="hero-title absolute text-white font-medium text-[7.5vw] lg:text-[6.5vw] left-[24%] top-[62%] select-none pointer-events-auto">
                <InteractiveWord word="orchestrate" />
              </h1>

              {/* Description Paragraph */}
              <p className="absolute left-12 top-[48%] max-w-[280px] text-[14px] leading-snug text-white/80 select-none pointer-events-auto">
                systems &amp; cloud engineer specializing in enterprise cloud infrastructure, offensive security auditing, and localized AI orchestration.
              </p>

              {/* Stat Block - Top-Right */}
              <div className="absolute right-16 top-[12%] flex flex-col items-end select-none">
                <div className="flex items-center gap-3 justify-end">
                  <div className="h-px w-24 bg-white/40 rotate-[20deg]" />
                  <span className="text-5xl font-medium tracking-tight text-white font-readex">+6</span>
                </div>
                <span className="text-sm text-white/70 mt-1 text-right font-mono">gcp badges verified</span>
              </div>

              {/* Stat Block - Bottom-Left */}
              <div className="absolute left-16 bottom-12 flex flex-col items-start select-none">
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-medium tracking-tight text-white font-readex">+12</span>
                  <div className="h-px w-24 bg-white/40 -rotate-[20deg]" />
                </div>
                <span className="text-sm text-white/70 mt-1 font-mono">gke clusters &amp; services</span>
              </div>

              {/* Stat Block - Bottom-Right */}
              <div className="absolute right-16 bottom-12 flex flex-col items-end select-none">
                <div className="flex items-center gap-3 justify-end">
                  <div className="h-px w-24 bg-white/40 -rotate-[20deg]" />
                  <span className="text-5xl font-medium tracking-tight text-white font-readex">+85</span>
                </div>
                <span className="text-sm text-white/70 mt-1 text-right font-mono">owasp vulns patched</span>
              </div>

              {/* Scroll down indicator */}
              <div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer pointer-events-auto z-20"
                onClick={() => document.getElementById('bento-anchor')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-[10px] uppercase tracking-widest text-white/40">scroll to brief</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-white/40 animate-bounce">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>

          </motion.section>

          {/* Anchor for scroll */}
          <div id="bento-anchor" className="pt-12" />

          {/* BENTO GRID HOME NODE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <HomeNode onNavigate={(page) => navigate(page as PageType)} />
          </motion.div>
        </div>

        {/* VIEW 2: SECURITY COMMAND NODE */}
        <motion.section
          id="security"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-28 py-16 border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto px-6 md:px-12 mb-12 select-none">
            <span className="text-xs font-mono tracking-wider text-neutral-500 block mb-2 console-cursor">// cybersecurity telemetry monitor</span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-readex">
              <DecryptText text="cybersecurity telemetry" />
            </h2>
          </div>
          <SecurityNode />
        </motion.section>

        {/* VIEW 3: AI PIPELINE NODE */}
        <motion.section
          id="ai"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-28 py-16 border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto px-6 md:px-12 mb-12 select-none">
            <span className="text-xs font-mono tracking-wider text-neutral-500 block mb-2 console-cursor">// applied intelligence orchestration</span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-readex">
              <DecryptText text="applied intelligence node" />
            </h2>
          </div>
          <AINode />
        </motion.section>

        {/* VIEW 4: EMBEDDED CONSOLE NODE */}
        <motion.section
          id="iot"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-28 py-16 border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto px-6 md:px-12 mb-12 select-none">
            <span className="text-xs font-mono tracking-wider text-neutral-500 block mb-2 console-cursor">// edge computing & firmware telemetry</span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-readex">
              <DecryptText text="edge computing node" />
            </h2>
          </div>
          <IoTNode />
        </motion.section>

        {/* VIEW 5: CLOUD DEVSECOPS DASHBOARD */}
        <motion.section
          id="cloud"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-28 py-16 border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto px-6 md:px-12 mb-12 select-none">
            <span className="text-xs font-mono tracking-wider text-neutral-500 block mb-2 console-cursor">// cloud infrastructure & devsecops</span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-readex">
              <DecryptText text="cloud infrastructure node" />
            </h2>
          </div>
          <CloudNode />
        </motion.section>

        {/* VIEW 6: WEB DEVELOPMENT NODE */}
        <motion.section
          id="web"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-28 py-16 border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto px-6 md:px-12 mb-12 select-none">
            <span className="text-xs font-mono tracking-wider text-neutral-500 block mb-2 console-cursor">// full-stack development node</span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-readex">
              <DecryptText text="web development node" />
            </h2>
          </div>
          <WebNode />
        </motion.section>

        {/* CONTACT FORM */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-28 py-16 border-t border-white/5 px-6 md:px-12 max-w-5xl mx-auto"
        >
          <div className="mb-12 text-center md:text-left select-none">
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-2 console-cursor">// GET IN TOUCH</span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-readex">
              <DecryptText text="contact me" />
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-base font-medium text-white mb-2">
                  <InteractiveWord word="contact details" />
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  <InteractiveParagraph text="Have a project in mind, want to collaborate, or just want to chat? Fill out the contact form or reach out directly via one of my official channels." />
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs text-neutral-400">
                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <span>
                    <InteractiveWord word="email:" /> <a href="https://mail.google.com/mail/?view=cm&fs=1&to=umaierjavid391@gmail.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline break-all"><InteractiveWord word="umaierjavid391@gmail.com" /></a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </span>
                  <span>
                    <InteractiveWord word="insta:" /> <a href="https://instagram.com/umaier_javid_313" target="_blank" rel="noopener noreferrer" className="text-white hover:underline"><InteractiveWord word="@umaier_javid_313" /></a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  </span>
                  <span>
                    <InteractiveWord word="github:" /> <a href="https://github.com/umaier-695" target="_blank" rel="noopener noreferrer" className="text-white hover:underline"><InteractiveWord word="github.com/umaier-695" /></a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                  </span>
                  <span>
                    <InteractiveWord word="credly:" /> <a href="https://www.credly.com/users/umaier-javid" target="_blank" rel="noopener noreferrer" className="text-white hover:underline"><InteractiveWord word="credly.com/users/umaier-javid" /></a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  </span>
                  <span>
                    <InteractiveWord word="fiverr:" /> <a href="https://www.fiverr.com/umaierjavid392" target="_blank" rel="noopener noreferrer" className="text-white hover:underline"><InteractiveWord word="fiverr.com/umaierjavid392" /></a>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-neutral-950/70 border border-white/5 p-6 rounded-2xl shadow-xl shadow-black">
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Honeypot Spam Protection Field */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  style={{ display: 'none' }}
                  checked={botCheck}
                  onChange={(e) => setBotCheck(e.target.checked)}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-wider text-neutral-400">
                      <InteractiveWord word="your name" />
                    </label>
                    <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      maxLength={100}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-wider text-neutral-400">
                      <InteractiveWord word="your email" />
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      maxLength={150}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-wider text-neutral-400">
                    <InteractiveWord word="subject" />
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Project Inquiry"
                    className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                    maxLength={200}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-wider text-neutral-400">
                    <InteractiveWord word="your message" />
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors resize-none"
                    maxLength={4000}
                    required
                  />
                </div>

                <AnimatePresence>
                  {formStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative p-5 border text-xs font-mono select-none flex flex-col gap-3 rounded-2xl bg-[#0f0f11] transition-all ${
                        formStatus.type === 'success' 
                          ? 'border-emerald-500/20 text-emerald-300 shadow-[6px_6px_15px_rgba(0,0,0,0.7),_-6px_-6px_15px_rgba(16,185,129,0.08)]' 
                          : 'border-rose-500/20 text-rose-300 shadow-[6px_6px_15px_rgba(0,0,0,0.7),_-6px_-6px_15px_rgba(244,63,94,0.08)]'
                      }`}
                    >
                      {/* Top bar with metadata */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full animate-ping ${
                            formStatus.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          <span className="font-extrabold uppercase tracking-widest text-[9px] text-white">
                            [{formStatus.type.toUpperCase()}]
                          </span>
                        </div>
                        <span className="text-[9px] text-neutral-500">
                          {formStatus.type === 'success' ? 'STATUS: 200_OK' : 'STATUS: ERROR_FLAG'}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          {formStatus.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-400">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.74-5.24Z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-rose-400">
                              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-white leading-relaxed">
                          {formStatus.message}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={formSubmitted}
                  className="w-full bg-white text-black py-3 px-6 border-2 border-black text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(255,255,255,0.8)] disabled:opacity-50"
                >
                  {formSubmitted 
                    ? <InteractiveWord word="sending message..." active={true} /> 
                    : <InteractiveWord word="send message" active={true} />
                  }
                </button>
              </form>
            </div>
          </div>
        </motion.section>

      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/60 relative z-10">
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-neutral-500">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <svg viewBox="0 0 256 256" className="h-4 w-4" fill="#666666">
              <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" fill="#666666" />
            </svg>
            <span className="hover:text-white transition-colors">ROOT.</span>
          </div>
          <div className="text-center sm:text-right">
            &copy; 2026 ROOT Systems. Engineered by Umaier Javid. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Floating Contact Action Button */}
      <motion.a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage('home');
          setMenuOpen(false);
          const target = document.getElementById('contact');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        animate={navVisible ? { y: 0, scale: 1, opacity: 1 } : { y: 80, scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center gap-2 bg-white text-black font-mono font-bold text-xs uppercase border-2 border-black px-5 py-3.5 shadow-[4px_4px_0px_rgba(255,255,255,0.85)] hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(255,255,255,0.85)] transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        <InteractiveWord word="contact" active={true} className="text-xs font-mono tracking-wider uppercase" />
      </motion.a>

      {/* Mobile bottom pill nav removed — hamburger menu used instead */}
    </div>
  );
}
