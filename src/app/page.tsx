import { HeroHighlightSection } from "@/components/hero";
import Navbar from "@/components/Navbar";

// const HomeApp = dynamic(() => import("@/components/hero"), { ssr: false });
const Home = () => {
  return (
    <main>
      <Navbar />
      <HeroHighlightSection />
    </main>
  );
};

export default Home;
