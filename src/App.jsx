import { useState } from 'react';
import Nav from './components/marketing/Nav.jsx';
import Hero from './components/marketing/Hero.jsx';
import MatrixExplainer from './components/marketing/MatrixExplainer.jsx';
import Pillars from './components/marketing/Pillars.jsx';
import Stats from './components/marketing/Stats.jsx';
import CaseStudy from './components/marketing/CaseStudy.jsx';
import Footer from './components/marketing/Footer.jsx';

export default function App() {
  const [activeNav, setActiveNav] = useState('Platform');

  return (
    <div>
      <Nav active={activeNav} onNav={setActiveNav} />
      <main>
        <Hero cellSize={36} density={16} intensity={0} />
        <MatrixExplainer />
        <Pillars />
        <Stats />
        <CaseStudy />
      </main>
      <Footer />
    </div>
  );
}
