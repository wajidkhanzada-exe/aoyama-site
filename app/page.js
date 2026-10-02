import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductsGrid from '@/components/ProductsGrid';
import Footer from '@/components/Footer';
import LegacyScripts from '@/components/LegacyScripts';
import InsideRide from '@/components/InsideRide';
import { H } from '@/lib/legacy';

const L = ({ k }) => <div dangerouslySetInnerHTML={{ __html: H[k] }} />;

export default function Home() {
  return (
    <>
      <Navbar home />
      <main>
        <Hero />
        <L k="about" />
        <ProductsGrid />
        <L k="services" />
        <InsideRide />
        <L k="planner" />
        <L k="safety" />
        <L k="faq" />
        <L k="contact" />
      </main>
      <Footer />
      <L k="overlays" />
      <LegacyScripts />
    </>
  );
}
