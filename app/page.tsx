import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Foreword from "@/components/Foreword";
import AboutDoubleImpact from "@/components/AboutDoubleImpact";
import MemberMarquee from "@/components/MemberMarquee";
import ProgramAccordion from "@/components/ProgramAccordion";
import Footer from "@/components/Footer";
import LatestArticles from "@/components/LatestArticles";

export const revalidate = 60;

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <Navbar />
      <Hero />
      <Foreword />
      <AboutDoubleImpact />
      <div id="programs">
        <ProgramAccordion />
      </div>
      <LatestArticles />
      <div id="members">
        <MemberMarquee />
      </div>
      <Footer />
    </main>
  );
}
