import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, MessageSquare, Facebook, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";

export function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formspree.io/f/ritishk2004@gmail.com", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }
    } catch (err: any) {
      console.error("Contact form error:", err);
      setError("Failed to send message. Please try again or email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold font-display text-white mb-4 tracking-tight">Get in Touch</h1>
        <p className="text-dark-muted max-w-2xl mx-auto">Have questions or feedback? We'd love to hear from you. Our team is here to help you on your career journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="p-8 bg-dark-surface rounded-3xl border border-dark-border shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-500/10 rounded-2xl">
                <Mail className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Email Us</h3>
                <p className="text-sm text-dark-muted">ritishk2004@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand-500/10 rounded-2xl">
                <Phone className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Call Us</h3>
                <p className="text-sm text-dark-muted">9019854584</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-brand-500/10 rounded-2xl">
                <MapPin className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Visit Us</h3>
                <p className="text-sm text-dark-muted">yedumadu village, bengaluru 562112</p>
              </div>
            </div>

            <div className="pt-6 border-t border-dark-border">
              <h4 className="text-sm font-bold text-dark-muted uppercase tracking-widest mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/ritish.k.7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-dark-bg rounded-xl text-dark-muted hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/ritish1808/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-dark-bg rounded-xl text-dark-muted hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/ritish-kannur-3a20082a6/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-dark-bg rounded-xl text-dark-muted hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-dark-border shadow-sm h-64 relative group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15561.42857142857!2d77.456789!3d12.812345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae4123456789ab%3A0x1234567890abcdef!2sYedumadu%2C%20Karnataka%20562112!5e0!3m2!1sen!2sin!4v1648280000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <a 
              href="https://maps.app.goo.gl/yKSKnpakTX8bm9Xi7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/10 transition-all flex items-center justify-center"
            >
              <span className="bg-white px-4 py-2 rounded-full text-xs font-bold text-brand-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                Open in Google Maps
              </span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="p-8 md:p-12 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-xl">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                <p className="text-dark-muted">Your message has been sent to <strong>ritishk2004@gmail.com</strong>. We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-brand-500 font-bold hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-dark-muted">Full Name</label>
                    <input 
                      required
                      name="name"
                      type="text" 
                      placeholder="John Doe"
                      className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-dark-muted">Email Address</label>
                    <input 
                      required
                      name="email"
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-dark-muted">Subject</label>
                  <input 
                    required
                    name="subject"
                    type="text" 
                    placeholder="How can we help?"
                    className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-dark-muted">Message</label>
                  <textarea 
                    required
                    name="message"
                    rows={5}
                    placeholder="Your message here..."
                    className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50 resize-none"
                  />
                </div>
                {error && (
                  <p className="text-sm font-bold text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>
                )}
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
