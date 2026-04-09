import { useRef, useEffect } from "react";
import ThemeCard from "../components/ThemeCard";

function ThemesSection() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 350,
          behavior: "smooth",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const themesData = [
    {
      title: "Sustainable Development",
      image:
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=60",
      description:
        "Green technologies and renewable energy solutions for sustainable national growth.",
    },
    {
      title: "Cyber Security",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=60",
      description:
        "Advanced systems to protect digital infrastructure and national cybersecurity.",
    },
    {
      title: "Smart Education",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=60",
      description:
        "AI-powered learning platforms and future-ready digital classrooms.",
    },
    {
      title: "Healthcare Innovation",
      image:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=60",
      description:
        "Smart healthcare access, telemedicine, and rural diagnostic innovations.",
    },
    {
      title: "Agriculture & Rural Tech",
      image:
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=60",
      description:
        "IoT-driven smart farming and modern agricultural transformation.",
    },
  ];

  return (
    <section className="themes">
      <h2 className="section-title">Themes</h2>
      <p className="themes-sub">
        Driving innovation across critical sectors of the nation.
      </p>

      <div className="slider-wrapper">
        <button className="arrow left" onClick={scrollLeft}>
          ‹
        </button>

        <div className="themes-slider" ref={scrollRef}>
          {themesData.map((theme, index) => (
            <ThemeCard key={index} theme={theme} />
          ))}
        </div>

        <button className="arrow right" onClick={scrollRight}>
          ›
        </button>
      </div>
    </section>
  );
}

export default ThemesSection;