import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Project } from "./data/projects";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Marquee from "./components/Marquee";
import Contact from "./components/Contact";
import Modal from "./components/Modal";
import ElevatorMusic from "./components/ElevatorMusic";

export default function App() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        דלגו לתוכן
      </a>
      <Nav />
      <main>
        <Hero />
        <Work onOpen={setOpen} />
        <Marquee />
        <Contact />
      </main>
      <ElevatorMusic />
      <AnimatePresence>
        {open && <Modal key={open.id} project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}
