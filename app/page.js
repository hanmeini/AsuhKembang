"use client";

import React from "react";
import Testimonials from "../components/testimonial";
import CommunityCtaSection from "../components/community";
import FeaturesSection from "../components/About";
import JournalAi from "../components/JurnalAi";
import HeroSection from "../components/HeroSection";
import FoodAi from "../components/FoodAi";




export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection/>
      <FoodAi />
      <JournalAi/>
      <Testimonials/>
      <CommunityCtaSection/>
    </main>
  );
}
