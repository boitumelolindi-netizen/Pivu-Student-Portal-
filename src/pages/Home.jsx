import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Rooms from "../components/Rooms";
import Amenities from "../components/Amenities";
import Gallery from "../components/Gallery";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Rooms />
      <Amenities />
      <Gallery />
      <Contact />
      <Footer />
      
      <a
  href="https://wa.me/27665577414"
  className="whatsapp"
  target="_blank"
>
  💬
</a>
    </>
  );
}

export default Home;