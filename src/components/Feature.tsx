
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type FeatureProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
};

const Feature: React.FC<FeatureProps> = ({ title, description, icon, index }) => {
  const featureRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-reveal");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (featureRef.current) {
      observer.observe(featureRef.current);
    }

    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={featureRef}
      className={cn(
        "opacity-0 p-6 md:p-8 rounded-2xl transition-apple",
        "hover:bg-secondary/50 hover:shadow-soft"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

type FeaturesSectionProps = {
  id?: string;
  title: string;
  subtitle: string;
  features: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  id,
  title,
  subtitle,
  features,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-reveal");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const headings = sectionRef.current.querySelectorAll(".section-heading");
      headings.forEach((heading) => {
        observer.observe(heading);
      });
    }

    return () => {
      if (sectionRef.current) {
        const headings = sectionRef.current.querySelectorAll(".section-heading");
        headings.forEach((heading) => {
          observer.unobserve(heading);
        });
      }
    };
  }, []);

  return (
    <section id={id} ref={sectionRef} className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading opacity-0 text-3xl md:text-4xl font-medium mb-4">
            {title}
          </h2>
          <p className="section-heading opacity-0 text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              index={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
