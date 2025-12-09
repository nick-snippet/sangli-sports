import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import CoachCard from "../components/CoachCard";

export default function AboutPage() {
  const { user } = useAuth();

  // Animation
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.5 },
    }),
  };

  // Expert Coaches
  const coaches = [
    {
      name: "Sumeet Chavan",
      title: "Former Maharashtra Ranji Player • Head Coach",
      description:
        "With more than 15 years of coaching experience, Sumeet Sir focuses on technical precision, shot selection, and discipline. His training methods have shaped several district and state-level players.",
      image:"/images/coaches/sumeetsir.jpg",
    },
    {
      name: "Prashaant Kore",
      title: "Former Maharashtra Ranji Player • Senior Coach",
      description:
        "Known for his strategic mindset and strong fundamentals coaching, Prashaant Sir builds the match temperament and mental strength of players, preparing them for high-pressure tournaments.",
      image:"../images/coaches/prashantsir.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-gray-900">

      {/* INTRO SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          custom={0}
          variants={fadeUp}
          className="text-4xl font-bold text-center text-[#0f2547] mb-6"
        >
          About Sumeet Sports Academy
        </motion.h1>

        <motion.p
          initial="hidden"
          whileInView="visible"
          custom={1}
          variants={fadeUp}
          className="text-lg text-center text-gray-800 leading-relaxed max-w-3xl mx-auto"
        >
          Sumeet Sports Cricket Academy, Sangli has become one of the finest
          platforms for budding cricketers. Under the guidance of former
          Maharashtra Ranji players <b>Sumeet Chavan</b> and{" "}
          <b>Prashaant Kore</b>, the academy focuses on disciplined,
          structured training and match exposure to build future champions.
        </motion.p>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-block px-5 py-2 bg-linear-to-r from-sky-500 to-pink-500 text-white rounded-full shadow-md hover:scale-105 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      {/* COACHES SECTION (Shifted to top as requested) */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-20">

          <h2 className="text-3xl font-bold text-center text-[#0f2547] mb-10">
            Our Expert Coaches
          </h2>

          {coaches.map((coach, index) => (
            <CoachCard
              key={index}
              name={coach.name}
              title={coach.title}
              description={coach.description}
              image={coach.image}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
