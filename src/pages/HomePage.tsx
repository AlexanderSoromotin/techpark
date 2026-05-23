import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About';
import ResidentsGrid from '../sections/ResidentsGrid';
import WhyUs from '../sections/WhyUs';
// import Gallery from '../sections/Gallery';
import ForWhom from '../sections/ForWhom';
import Vacancies from '../sections/Vacancies';
import CTASection from '../sections/CTASection';
import Contacts from '../sections/Contacts';
import FAQSection from '../sections/FAQSection';
import PartnersCarousel from '../sections/PartnersCarousel';
import { organizationSchema, websiteSchema, toJsonLd, SITE_URL } from '../utils/schema';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Технопарк 1219 — Промышленный технопарк в Троицке | Аренда цехов и производств</title>
        <meta name="description" content="Промышленный технопарк полного цикла в Троицке, Челябинская область. Аренда производственных помещений от 50 м². 9 актуальных направлений производства. Готовая инфраструктура, поддержка бизнеса. ☎ +7 (908) 047-70-30" />
        <link rel="canonical" href={`${SITE_URL}/`} />
        {/* Open Graph */}
        <meta property="og:title" content="Технопарк 1219 — Промышленный технопарк в Троицке" />
        <meta property="og:description" content="Аренда производственных помещений от 50 м² в Троицке. Готовые цеха с коммуникациями, поддержка бизнеса, 9 актуальных направлений производства." />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Технопарк 1219 — Промышленный технопарк в Троицке" />
        <meta name="twitter:description" content="Аренда производственных помещений от 50 м² в Троицке, Челябинская область." />
        <meta name="twitter:image" content={`${SITE_URL}/logo.png`} />
        {/* JSON-LD */}
        <script type="application/ld+json">{toJsonLd(organizationSchema())}</script>
        <script type="application/ld+json">{toJsonLd(websiteSchema())}</script>
      </Helmet>

      <Header />
      <main>
        <Hero />
        <About />
        <ResidentsGrid />
        <WhyUs />
        {/*<Gallery />*/}
        <ForWhom />
        <Vacancies />
        <FAQSection />
        <PartnersCarousel />
        <CTASection />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
