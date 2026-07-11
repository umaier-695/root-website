import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  name: string;
  company: string;
  rating: number;
  message: string;
  date: string;
}

const DEFAULT_REVIEWS: Review[] = [];

export default function ReviewsNode() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Load reviews from Vercel KV API (or fallback to localStorage) on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const list = await response.json();
          if (Array.isArray(list)) {
            setReviews(list.reverse());
            localStorage.setItem('client_reviews_data', JSON.stringify(list));
            return;
          }
        }
      } catch (err) {
        console.warn("Backend API fetch failed, falling back to localStorage", err);
      }

      // Local storage fallback
      const saved = localStorage.getItem('client_reviews_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Filter out any leftover fake reviews from previous dev runs
          const filtered = Array.isArray(parsed)
            ? parsed.filter((r: any) => r && typeof r.id === 'string' && !r.id.startsWith('default-'))
            : [];
          setReviews(filtered);
          localStorage.setItem('client_reviews_data', JSON.stringify(filtered));
        } catch (e) {
          setReviews(DEFAULT_REVIEWS);
        }
      } else {
        setReviews(DEFAULT_REVIEWS);
        localStorage.setItem('client_reviews_data', JSON.stringify(DEFAULT_REVIEWS));
      }
    };

    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setFormSubmitted(true);
    setFormStatus({ type: null, message: '' });

    const newReview: Review = {
      id: `review-${Date.now()}`,
      name: name.trim(),
      company: company.trim() || 'Independent Client',
      rating,
      message: message.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    // Replace with your Web3Forms access key
    const ACCESS_KEY = "d3ebcb2b-9ec1-4268-85a0-cfed62657c1c";

    try {
      // 1. Send via Web3Forms (email alert)
      const emailResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: newReview.name,
          subject: `New Review submitted by ${newReview.name} (${newReview.rating} Stars)`,
          message: `Company: ${newReview.company}\nRating: ${newReview.rating} Stars\nReview: ${newReview.message}`,
        }),
      });

      const emailData = await emailResponse.json();

      if (emailData.success) {
        // 2. Save in Vercel KV Database via Serverless API
        let dbReview = newReview;
        try {
          const dbResponse = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: newReview.name,
              company: newReview.company,
              rating: newReview.rating,
              message: newReview.message
            })
          });
          if (dbResponse.ok) {
            dbReview = await dbResponse.json();
          }
        } catch (dbErr) {
          console.error("Backend database write failed, using local fallback", dbErr);
        }

        // 3. Update local UI list & localStorage cache
        const updated = [...reviews, dbReview];
        setReviews(updated);
        localStorage.setItem('client_reviews_data', JSON.stringify(updated));

        setFormStatus({ type: 'success', message: 'Thank you! Your review has been saved successfully.' });

        // Reset form fields
        setName('');
        setCompany('');
        setRating(5);
        setMessage('');

        // Close modal and clear success alert after 3 seconds
        setTimeout(() => {
          setModalOpen(false);
          setFormStatus({ type: null, message: '' });
        }, 3000);
      } else {
        setFormStatus({ type: 'error', message: emailData.message });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: 'Transmission failed. Please check your network connection.' });
    } finally {
      setFormSubmitted(false);
    }
  };

  // Sort reviews so newest are shown first, slice to first 3 if not showAll
  const sortedReviews = [...reviews].reverse();
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12 animate-fadeIn relative">
      <div className="relative z-10 space-y-8">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">
              // review node
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-white font-readex">
              client reviews & feedback
            </h2>
          </div>
          
          <button
            onClick={() => setModalOpen(true)}
            className="self-start sm:self-center bg-white text-black py-2.5 px-6 border-2 border-black text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.85)] hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px]"
          >
            write a review
          </button>
        </div>

        {/* Reviews Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-white">
          {reviews.length === 0 ? (
            <div className="col-span-full bg-neutral-900/30 border border-white/5 p-8 rounded-3xl text-center space-y-4 shadow-xl select-none">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">// pending records</span>
              <h3 className="text-base font-semibold text-neutral-400 font-readex uppercase">No reviews logged yet</h3>
              <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto leading-relaxed">
                Be the first satisfied client to document your project completion and service metrics!
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-2 bg-white text-black py-2.5 px-6 border-2 border-black text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.85)] hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px]"
              >
                submit first review
              </button>
            </div>
          ) : (
            displayedReviews.map((review) => (
              <div 
                key={review.id}
                className="bg-neutral-900/40 border border-white/5 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'text-emerald-400' : 'text-neutral-700'}`}
                        >
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-500">{review.date}</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed min-h-[70px]">
                    "{review.message}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="text-xs font-bold text-white leading-none">{review.name}</div>
                  <div className="text-[10px] text-neutral-500 mt-1 uppercase tracking-tight">{review.company}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {reviews.length > 3 && (
          <div className="flex justify-center pt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-neutral-900/60 text-white py-2.5 px-6 border border-white/10 text-xs font-mono font-bold tracking-widest uppercase transition-all hover:bg-white/5 hover:border-white/20 rounded-full"
            >
              {showAll ? 'Show Less' : `Show All Reviews (${reviews.length})`}
            </button>
          </div>
        )}

      </div>

      {/* Review Modal Form (Overlay) */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!formSubmitted) setModalOpen(false); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 font-mono text-white"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-6">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest">// write a review</span>
                <button 
                  onClick={() => setModalOpen(false)}
                  disabled={formSubmitted}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam Henderson"
                    required
                    disabled={formSubmitted}
                    className="w-full bg-neutral-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Company / Title</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. CTO, Apex Global"
                    disabled={formSubmitted}
                    className="w-full bg-neutral-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Rating Stars Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">Rating</label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onTouchStart={() => setHoverRating(star)}
                        onTouchEnd={() => { setRating(star); setHoverRating(null); }}
                        disabled={formSubmitted}
                        className="focus:outline-none transition-transform active:scale-95"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className={`w-7 h-7 transition-all duration-150 ${
                            star <= (hoverRating ?? rating) 
                              ? 'text-emerald-400 filter drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] scale-110' 
                              : 'text-neutral-700 scale-100'
                          }`}
                        >
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Your Testimonial</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your experience collaborating on cloud infrastructure, compliance scans, or full-stack features..."
                    required
                    disabled={formSubmitted}
                    maxLength={1000}
                    className="w-full bg-neutral-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {/* Neomorphic success status panel */}
                <AnimatePresence>
                  {formStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`p-4 border text-xs flex flex-col gap-2 rounded-2xl bg-[#0f0f11] ${
                        formStatus.type === 'success' 
                          ? 'border-emerald-500/20 text-emerald-300 shadow-[4px_4px_12px_rgba(0,0,0,0.65),_-4px_-4px_12px_rgba(16,185,129,0.06)]' 
                          : 'border-rose-500/20 text-rose-300 shadow-[4px_4px_12px_rgba(0,0,0,0.65),_-4px_-4px_12px_rgba(244,63,94,0.06)]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-white border-b border-white/5 pb-1">
                        <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
                          formStatus.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        <span>[{formStatus.type.toUpperCase()}]</span>
                      </div>
                      <p className="text-[10px] text-white leading-relaxed">{formStatus.message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={formSubmitted}
                  className="w-full mt-2 bg-white text-black py-3 px-6 border-2 border-black text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.85)] hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-neutral-100 active:translate-x-[2px] active:translate-y-[2px]"
                >
                  {formSubmitted ? 'Saving Review...' : 'Submit Feedback'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
