import { GridBackground } from '../components/layout/GridBackground';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero/Hero';
import { About } from '../components/sections/About/About';
import { Competitions } from '../components/sections/Competitions/Competitions';
import { Sponsors } from '../components/sections/Sponsors/Sponsors';
import { FAQ } from '../components/sections/FAQ/FAQ';
import { Chairs } from '../components/sections/Chairs/Chairs';
import { Team } from '../components/sections/Team/Team';

/**
 * Assembles website sections in order.
 * Edit individual section components — do not redesign unrelated sections here.
 */
export default function App() {
  return (
    <>
      <GridBackground />
      <a className="skip-link" href="#hero">
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <About />
        <Competitions />
        <Sponsors />
        <FAQ />
        <Chairs />
        <Team />
      </main>
      <Footer />
    </>
  );
}
