import Hero from "../../components/home/Hero";
import About from "../../components/home/About";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import WhyChooseNexora from "../../components/home/WhyChooseNexora";
import Testimonials from "../../components/home/Testimonials";


const Home = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* =========================================
          HERO SECTION
      ========================================= */}

      <Hero />

      {/* =========================================
          ABOUT NEXORA
      ========================================= */}

      <About />

      {/* =========================================
          FEATURED PRODUCTS
      ========================================= */}

      <FeaturedProducts />

      {/* =========================================
          WHY CHOOSE NEXORA
      ========================================= */}

      <WhyChooseNexora />

      {/* =========================================
          TESTIMONIALS
      ========================================= */}

      <Testimonials />

    </main>
  );
};

export default Home;
