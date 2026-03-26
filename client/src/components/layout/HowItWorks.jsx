import React from "react";
import FeatureCard from "./FeatureCard";
import "../../CSS/HowItWorks.css";

import { Camera, Sparkles, Globe2 } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="how-container">
      <h2>How It Works</h2>
      <p className="subtitle">
        Simple steps to create your travel story
      </p>

      <div className="cards">
        <FeatureCard
          icon={<Camera size={32} />}
          title="Upload Photos"
          description="Upload your travel photos with dates and locations"
          colorClass="blue"
        />

        <FeatureCard
          icon={<Sparkles size={32} />}
          title="AI Generates Story"
          description="Our AI creates a compelling blog post from your photos"
          colorClass="orange"
        />

        <FeatureCard
          icon={<Globe2 size={32} />}
          title="Share & Explore"
          description="Share your story or keep it private, explore others' adventures"
          colorClass="beige"
        />
      </div>
    </section>
  );
}