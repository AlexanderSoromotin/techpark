import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About';
import ResidentsGrid from '../sections/ResidentsGrid';
import WhyUs from '../sections/WhyUs';
import Gallery from '../sections/Gallery';
import ForWhom from '../sections/ForWhom';
import Vacancies from '../sections/Vacancies';
import CTASection from '../sections/CTASection';
import Contacts from '../sections/Contacts';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <ResidentsGrid />
        <WhyUs />
        <Gallery />
        <ForWhom />
        <Vacancies />
        <CTASection />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
