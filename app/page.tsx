import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Awards from '@/components/Awards';
import Portfolio from '@/components/Portfolio';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <div className="bg-background-light min-h-screen text-primary selection:bg-accent-light/30 font-display">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 md:px-6 lg:px-12 pb-24">
        {/* Helper div to push content down for fixed navbar if needed, or rely on Hero padding */}
        <Hero />
        <About />
        <Experience />
        <Awards />
        <Portfolio />
        <Blog />
        <Contact />

        <footer className="mt-20 text-center text-[10px] uppercase tracking-widest font-bold opacity-30">
          © 2026 - mskinasih
        </footer>
      </main>
    </div>
  );
}
