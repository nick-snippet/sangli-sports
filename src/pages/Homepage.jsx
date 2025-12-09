  // src/pages/Homepage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import HeroSection from "../components/herosection";
import { motion, AnimatePresence } from "framer-motion";
import CoachCard from "../components/CoachCard";
import AwardPlayercard from "../components/AwardPlayercard";
import AddPlayerModal from "../components/modals/AddPlayerModal.jsx";

import AddCoachCard from "../components/AddCoachCard.jsx";
import AddCoachModal from "../components/modals/AddCoachModal.jsx";

import { storage } from "../firebase/client.js";
import { FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";
//players
import { fetchPlayers, deletePlayer,updatePlayer,replacePlayerImage } from "../firebase/players.js";
import EditTextModal from "../components/admin/EditTextModal.jsx";
import ReplaceImageModal from "../components/admin/ReplaceImageModal.jsx";
//gallery
import { fetchGallery, addGalleryImage, deleteGallery } from "../firebase/gallery.js";
import AddGalleryModal from "../components/modals/AddGalleryModal.jsx";


//coaches
import { fetchCoaches } from "../firebase/coaches.js";
import { deleteCoach } from "../firebase/coaches.js";

//import { useAuth } from "../context/AuthContext.jsx"; 

export default function HomePage() {
  const { user } = useAuth();
  const [selectedCard, setSelectedCard] = useState(null);

  //temp debug
  console.log("CURRENT USER =>", user);
//gallery
// 🖼️ Load dynamic gallery images once
useEffect(() => {
  fetchGallery().then(setGalleryImages);
}, []);

//players useeffect
useEffect(() => {
  fetchPlayers().then(setDynamicPlayers);
}, []);

useEffect(() => {
  if (user?.role==="admin") 
    {
      fetchPlayers().then(setDynamicPlayers);
    }
}, [user]);

async function handleDeletePlayer(id) {
  if (!confirm("Delete this player permanently?")) return;
  try {
    await deletePlayer(id);
    fetchPlayers().then(setDynamicPlayers);
  } catch {
    alert("Failed to delete player!");
  }
}


 //const state coaches
 const [dynamicCoaches, setDynamicCoaches] = useState([]);
useEffect(() => {
  fetchCoaches().then(setDynamicCoaches);
}, []);

async function handleDeleteCoach(id) {
  if (!window.confirm("Delete this coach permanently?")) return;

  try {
    await deleteCoach(id);

    // Refresh list from Firestore
    const updated = await fetchCoaches();
    setDynamicCoaches(updated);

    console.log("✅ Coach deleted from UI + Firestore + Storage");
  } catch (err) {
    console.error("❌ Failed to delete coach:", err);
    alert("Failed to delete coach. Check console for details.");
  }
}

  
//coach states
const [addCoachOpen, setAddCoachOpen] = useState(false);
//players states
const [dynamicPlayers, setDynamicPlayers] = useState([]);
const [addPlayerOpen, setAddPlayerOpen] = useState(false);
const [editingPlayer, setEditingPlayer] = useState(null);
const [replacingImagePlayer, setReplacingImagePlayer] = useState(null);

// Load players once

// Vision/Mission/Goals modal state  
const [selectedVision, setSelectedVision] = useState(null);
 
  // Converts any input into bullet lines
const normalizeBullets = (input) => {
  if (!input) return [];

  if (Array.isArray(input)) return input;

  if (typeof input === "string") {
    if (input.includes("\n")) {
      return input.split("\n").map((t) => t.trim()).filter(Boolean);
    }
    if (input.includes(",")) {
      return input.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return [input];
  }

  return [];
};

  
  // Contact form state + popup
  const [contactForm, setContactForm] = useState({
  first: "",
  last: "",
  phone: "",
  email: "",
  message: "",
});

  const [showContactPopup, setShowContactPopup] = useState(false);

  // ensure smooth-scroll behavior on mount
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  // ---- GALLERY STATES ----
const [modalOpen, setModalOpen] = useState(false);
const [modalImage, setModalImage] = useState(null);
const [currentIndex, setCurrentIndex] = useState(0);
 
const [visibleCount, setVisibleCount] = useState(12);
// 📌 GALLERY STATES (dynamic from firebase)
const [galleryImages, setGalleryImages] = useState([]);
const [loadingGallery, setLoadingGallery] = useState(false);
const [addGalleryOpen, setAddGalleryOpen] = useState(false);

// Gallery Images
const staticGallery = [
  // ROW 1 → MPL
  { url: "/images/GLphotos/mpl1.jpeg", category: "row1", title: "Junior players" },
  { url: "/images/GLphotos/mpl2.jpeg", category: "row1", title: "Coach Guidance" },
  { url: "/images/football/roller.jpeg", category: "row1", title: "Turf Rollers" },
  { url: "/images/GLphotos/tropy1.jpeg", category: "row1", title: "Flood Light Training" },

  // ROW 2 → Women Cricket
  { url: "/images/football1.jpeg", category: "row2", title: "Early Morning Practice" },
  { url: "/images/ng.jpeg", category: "row2", title: "Guidance to Juniors" },
  { url: "/images/compT2.jpg", category: "row2", title: "Match Moment" },
  { url: "/images/Agewisecard.jpeg", category: "row2", title: "Juniors Spirit" },

  // ROW 3 → Trophy & Fitness
  { url: "/images/fitness.jpeg", category: "row3", title: "Fitness Session & Mentoring " },
  { url: "/images/GLphotos/trophy3.jpeg", category: "row3", title: "Warm-up" },
  { url: "/images/balling.jpeg", category: "row3", title: "Balling Machine" },
  { url: "/images/GLphotos/trophy2.jpeg", category: "row3", title: "Night Match" },

  // ROW 4 → Camps
  { url: "/images/camp1.jpeg", category: "row4", title: "Pull Shot Moment" },
  { url: "/images/football/strike.jpeg", category: "row4", title: "Intense Training" },
  { url: "/images/camp3.jpeg", category: "row4", title: "Net Practice" },
  { url: "/images/senior.jpeg", category: "row4", title: "Team Unity" },
];


// Filtering Logic
const filteredImages = staticGallery;


// Modal functions
const openImage = (img, index) => {
  setModalImage(img.url);
  setModalTitle("Gallery image");
  setModalOpen(true);
};

const closeModal = () => setModalOpen(false);

// ESC key support
useEffect(() => {
  const esc = (e) => e.key === "Escape" && closeModal();
  window.addEventListener("keydown", esc);
  return () => window.removeEventListener("keydown", esc);
}, []);
//

// ---------- Programs & Facilities: states & handlers ----------
const [programModalOpen, setProgramModalOpen] = useState(false);
const [activeProgram, setActiveProgram] = useState(null); // "ageWise","ground","night","residential","competitions","seasonal"
const [activeInner, setActiveInner] = useState(null); // e.g. "beginner","timings","night-gallery", etc.

// scroll to CTA (contact-section)
const scrollToCTA = () => {
  const el = document.getElementById("contact-section");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// keyboard & inner-card arrow nav while modal open
useEffect(() => {
  const onKey = (e) => {
    if (!programModalOpen) return;
    if (e.key === "Escape") {
      setProgramModalOpen(false);
      setActiveProgram(null);
      setActiveInner(null);
    }
    const orderMap = {
      ageWise: ["beginner", "intermediate", "advanced"],
      residential: ["accommodation", "food", "safety"],
      competitions: ["weekly", "premier", "awards"],
      ground: ["timings", "facilities"],
    };
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const keys = orderMap[activeProgram] || [];
      if (keys.length) {
        const idx = Math.max(0, keys.indexOf(activeInner ?? keys[0]));
        const nextIdx = e.key === "ArrowLeft" ? Math.max(0, idx - 1) : Math.min(keys.length - 1, idx + 1);
        setActiveInner(keys[nextIdx]);
      }
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [programModalOpen, activeProgram, activeInner]);



  // Coaches (dynamic; can add more later)
 const coaches = [
    {
      name: "Sumeet Chavan",
      title: "Senior Coach • Former Maharashtra Ranji Player",
      instagram:"https://www.instagram.com/sumeetchavan9?igsh=MW5tczBocGl0d3hwNw==",
      Facebook:"",
      description: (
  <div className="space-y-3 text-gray-800 leading-relaxed">
    <p className="text-2xl font-bold text-[#0f2547]">🔥 *Highlights*</p> 

    <ul className="list-disc text-l pl-5 space-y-1 font-medium">
      <li>Co-Owner — Sumeet Sports Cricket Academy, Sangli</li>
      <li>Professional Cricketer • Maharashtra State Player</li>
      <li>U-16 Maharashtra Team Selector</li>
      <li>Syed Mushtaq Ali & Vijay Hazare Trophy Cricketer</li>
      <li>Coaching Experience: <b>10+ Years</b></li>
    </ul>

    <p className="italic text-gray-700">
      “Dedicated to shaping cricketers who compete with skill, discipline, and character.”
    </p>

    <h4 className="font-semibold text-lg mt-4">📘 About Sumeet Sir</h4>

    <p>
      Sumeet Chavan is a respected cricketer, coach, and selector from Sangli.
      As co-owner of Sumeet Sports Cricket Academy at Appasaheb Birnale Public School,
      he mentors young and emerging players with a structured, high-discipline training style.
    </p>

    <p>
      He represented Maharashtra across all major age categories and played in India’s
      premier domestic tournaments — the <b>Syed Mushtaq Ali Trophy</b> and the
      <b> Vijay Hazare Trophy</b>.
    </p>

    <p>
      Sumeet currently serves as the <b>U-16 Maharashtra Selector</b> and previously spent
      two years as the U-14 selector. His deep technical knowledge and talent-identification
      skills make him one of Sangli’s strongest cricketing mentors.
    </p>
  </div>
),
      image: "/images/coaches/sumeetsir.jpg",
    },

    {
      name: "Prashaant Kore",
      title: "Head Coach • Former Maharashtra Ranji Player",
      instagram:"https://www.instagram.com/prashaant_kore",
      description: (
  <div className="space-y-3 text-gray-800 leading-relaxed">
    <p className="text-xl font-bold text-[#0f2547]">🔥 *Highlights*</p>

    <ul className="list-disc text-l pl-5 space-y-1 font-medium">
      <li>Co-Owner & Head Coach — Sumeet Sports Cricket Academy</li>
      <li>Professional Cricketer • Maharashtra Representative</li>
      <li>Played Vijay Hazare Trophy</li>
      <li>Coaching Experience: <b>7+ Years</b></li>
    </ul>

    <p className="italic text-gray-700">
      “Building the next generation of cricketers in Sangli, one session at a time.”
    </p>

    <h4 className="font-semibold text-lg mt-4">📘 About Prashaant Sir</h4>

    <p>
      Prashaant Kore is a professional cricketer and a passionate coach known for
      his high-intensity training style and focus on discipline, technique, and match temperament.
    </p>

    <p>
      He has represented Maharashtra in multiple age-group levels and competed in the
      prestigious <b>Vijay Hazare Trophy</b> — making him one of the few players from
      Sangli to reach this stage.
    </p>

    <p>
      With 7+ years of coaching experience, Prashaant blends professional experience with
      modern cricketing methods to help players grow technically, mentally, and physically.
    </p>
  </div>
  
),
            
            image: "/images/coaches/prashaantsir.jpg",
            
          },
        ];
//dynamic coaches

   

  // modal details map (complete set so modal never shows undefined)
  const detailsMap = {
    // Programs
    "Junior Coaching Program": [
      "Training designed for ages 6–12.",
      "Focus on fundamentals: batting, bowling, fielding.",
      "Fun drills to build engagement and discipline.",
    ],
    "Spacious Ground with Advanced Functionalities": [
      "Tactical match-scenario coaching.",
      "Video analysis & technique refinement.",
      "Personalised sessions for state-level aspirants.",
    ],
    "Fitness & Conditioning": [
      "Strength & endurance routines for cricketers.",
      "Agility & speed training with progress tracking.",
      "Weekly assessments and tailored plans.",
    ],
    "Tournaments & Exposure": [
      "Regular practice matches and tournaments.",
      "Selection trial preparation & exposure.",
      "Performance feedback & pathway guidance.",
    ],
    "Women’s Cricket Training": [
      "Skill-specific training & mentorship.",
      "Strength conditioning for women athletes.",
      "Tournament & trial support.",
    ],
    "Seasonal Camps": [
      "Intensive camps during holidays.",
      "Guest coaches & focused skill-building.",
      "Match practice and fitness routines.",
    ],


    // Why Choose Us / Highlights
    "🏆 Professional Coaching": [
      "Coaching from ex-professionals and certified trainers.",
      "Individual attention and progress tracking.",
    ],
    "🏟️ Modern Facilities": [
      "Turf & mat wickets, practice nets, and fitness area.",
      "Performance analysis tools for continuous improvement.",
    ],
    "🤝 Growth Opportunities": [
      "Tournament exposure and selection pathways.",
      "Support for trials & higher-level placements.",
    ],
    "Residential Facilities": [
      "Safe, hygienic hostel with monitored routines.",
      "Nutritious meals and supervised training schedules.",
    ],
    // Generic fallback
    default: ["Detailed information coming soon. Please contact the academy for more info."],
  };

  // small motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.5 },
    }),
  };

  // drag logic for carousel: detect end direction
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    if (offset < -50) {
      goNext();
    } else if (offset > 50) {
      goPrev();
    }
  };

  // Contact submit (show popup)
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate backend call later
    setShowContactPopup(true);
    setContactForm({ first: "", last: "", email: "", message: "" });
    // auto hide after 4s
    setTimeout(() => setShowContactPopup(false), 4000);
  };

  // Vision / Mission / Goals content
  const vision =
    "To become Sangli’s leading cricket development hub that nurtures talented athletes with strong values, advanced skills, and a champion mindset.";
  const missionBullets = [
    "Provide high-quality, structured cricket coaching supported by modern training methods and certified coaches.",
    "Create a positive, disciplined, and growth-oriented sporting environment for players of all ages.",
    "Develop athletes holistically — physically, technically, mentally, and ethically.",
  ];
  const goalsShort = [
    "Strengthen basic & advanced skill development programs.",
    "Organize regular practice matches and fitness sessions.",
    "Build strong parent–coach communication.",
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section id="home-section">
        <HeroSection />
      </section>

      {/* ABOUT */}
      <section id="about-section" className="relative -mt-12 md:-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white rounded-3xl shadow-xl p-8 md:p-12 -mt-8">
            <div className="md:flex md:items-center gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f2547] mb-4">Enhancement Beyond Limits</h2>
                <p className="text-gray-700 mb-6">
                  Under the expert guidance of former Maharashtra Ranji players <strong>Sumeet Chavan</strong> and <strong>Prashaant Kore</strong>, Sumeet Sports Cricket Academy shapes the next generation of cricketers with focused training, discipline, and match exposure.
                </p>

                <div className="flex gap-4 flex-wrap">
                  <a className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition" href="#programs-section">
                    Learn More
                  </a>
                  <a className="px-6 py-3 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 transition" href="#contact-section">
                    Contact Us
                  </a>
                </div>
              </div>

              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src="/images/team.jpeg" className="w-full h-64 object-cover" alt="academy team" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats-section" className="py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 ">
          {[
            { value: "150+", label: "Active Players" },
            { value: "20+", label: "Tournament Hosted" },
            { value: "8+", label: "Certified Coaches" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} className="bg-sky-100 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all">
              <div className="text-3xl font-bold text-[#0f1724]">{s.value}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
{/* ABOUT US  SECTION  */} 
<section id="about-extra" className="py-12 bg-gradient-to-r from-pink-200 to-sky-200">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl md:text-4xl font-extrabold text-[#0f2547] mb-4">
      About Us
    </h2>

    

    <p className="text-gray-900 leading-relaxed text-lg md:text-xl">
      At <b>Sumeet Sports Cricket Academy</b>, We Believe Every Athlete Deserves A 
      Structured Path To Unlock Their Highest Potential. With The Guidance 
      Of Former Maharashtra Ranji Players And Qualified Professional Coaches, 
      We Ensure That Each Player Receives Modern Technical Training, Cricket 
      Intelligence Development, Disciplined Conditioning Routines, And 
      Real Match Exposure.  
      <br />
      <br />
      <p className="text-2xl md:text-4xl font-extrabold text-[#0f2547] mb-4"><b>  How We Started - </b></p>
      Our Academy Was <b>Proudly Established on 1st October 2020</b>, With the Valuable Support and Encouragement of <b>Appasaheb Birnale Public School, Sangli.</b>
       Their Co-Operation Played A Significant Role In Laying The Strong Foundation Of Our Academy.
      Our Academy Focuses On Shaping Players Not Just As Athletes, 
      But As Confident, Responsible, <br />And Mentally Strong Individuals Prepared 
      For District, State, And National-Level Selections.
      <br /> <br />
      The Academy Frequently Arranges Practice Matches And Tournaments,
       Giving Players Real-Time Match Experience And Building Confidence. 
      These Initiatives Ensure Players Are Well-Prepared For Higher-Level Challenges
    </p>
    <br />
    <h3 className="text-4xl font-bold text-[#0f2547] mb-3 px-0">⏱️Timing Sessions: </h3>
    <br />
  <p className="text-gray-800 leading-relaxed text-lg">
    The Weekly Session Timings Are given below: 
 <ul className="list-disc pl-5 text-gray-800 space-y-2">
        <li>Morning 7 to 9 AM</li>
        <li>Night 4 to 6 PM</li>
        <li>Night 6 to 8 PM</li>
        <p className="text-gray-800 leading-sm text-lg">-Under Flood Light Session</p>
      </ul>  
 </p>
    </div>

    </section>
      {/* COACHES */}
      <section id="coaches-section" className="py-12 bg-gradient-to-r from-pink-200 to-sky-200">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-8 text-[#0f2547]">Expert Coaches</h3>

          <div className="flex flex-col gap-12">
  
  
  {/* EXISTING COACHES */}
  {coaches.map((c, i) => (
    <CoachCard
      key={i}
      name={c.name}
      title={c.title}
      description={c.description}
      image={c.imageurl||c.image}
      instagram={c.instagram}
    />
  ))}
{/* DYNAMIC COACHES */}
{dynamicCoaches.map((c) => (
  <div key={c.id} className="relative">
    <CoachCard
      name={c.name}
      title={c.title}
      description={c.description}
      image={c.imageUrl}
    />

    {user?.role === "admin" && (
      <button
        onClick={() => handleDeleteCoach(c.id)}
        className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded shadow hover:bg-red-700"
      >
        Delete
      </button>
    )}
  </div>
))} 
{/* ADD NEW COACH CARD (visible only for admin) */} 
      {user?.role === "admin" && (
        <AddCoachCard onClick={() => setAddCoachOpen(true)} />
      )}

{/* ADD COACH MODAL */}
<AddCoachModal
  open={addCoachOpen}
  onClose={() => setAddCoachOpen(false)}
  onSuccess={() => fetchCoaches().then(setDynamicCoaches)}
/>





</div>
        </div>
      </section>

 
  
 {/* PROUD PLAYERS SECTION */}
<section id="players-section" className="py-20 bg-gradient-to-r from-pink-200 to-sky-200">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-5xl font-extrabold text-[#0f2547] text-center mb-12">
      Our Proud Players
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">


      {/* 📌 STATIC PLAYERS – ALL 8 */}
      {[
        {
          name: "Nikhil Kadam",
          tournament:
            "Maharshtra Premiere League 2024 & 2025 \n Syed Mustak Ali T20 Maharashtra Camp",
          image: "/images/players/player1.jpg",
        },
        {
          name: "Bhakti Mirajkar",
          tournament: "Maharashtra U-19, U-23 & Open Team",
          image: "/images/players/player2.jpg",
        },
        {
          name: "Soham Chavan",
          tournament: "Maharashtra U-14 Team",
          image: "/images/players/player3.jpeg",
        },
        {
          name: "Aneesh Joshi",
          tournament: "Maharashtra U-19 , Maharashtra U-16 Team",
          image: "/images/players/player4.jpg",
        },
        {
          name: "Aryan Desai",
          tournament: "U-19 Maharashtra Camp",
          image: "/images/players/player5.jpeg",
        },
        {
          name: "Soham Sargar",
          tournament: "U-16 Maharashtra Camp",
          image: "/images/players/player7.jpeg",
        },
        {
          name: "Nidhi Shambhawani",
          tournament: "U-19 Women's Maharashtra Camp",
          image: "/images/women3.jpeg",
        },
        {
          name: "Madhushree Uplavikar",
          tournament: "U-15 Women's Maharashtra Camp",
          image: "/images/women7.jpeg",
        },
      ].map((p, i) => (
        <AwardPlayercard
          key={i}
          name={p.name}
          tournament={p.tournament}
          image={p.image}
         // isAdmin={user?.role === "admin"}
        />
      ))}

      {/* 🆕 DYNAMIC PLAYERS FROM FIREBASE/BACKEND */}
     {/* 📌 DYNAMIC PLAYERS */}
{/* 📌 DYNAMIC PLAYERS */}
{dynamicPlayers.map((p) => (
  <div key={p.id} className="relative">

    <AwardPlayercard
      name={p.name}
      tournament={p.tournament}
      image={p.imageUrl}
      isAdmin={user?.role === "admin"}
      onEdit={() => setEditingPlayer(p)}             // 👈 use existing
      onReplaceImage={() => setReplacingImagePlayer(p)}  // 👈 use existing
      onDelete={() => handleDeletePlayer(p.id)}
    />
    
  </div>
))}
{/* ➕ ADD PLAYER CARD (Admin only) */}
{user?.role === "admin" && (
  <div
    onClick={() => setAddPlayerOpen(true)}
    className="cursor-pointer flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition p-8"
  >
    <div className="text-5xl text-[#0f2547] font-bold">+</div>
    <p className="text-lg font-semibold text-[#0f2547] mt-2">
      Add Player
    </p>
  </div>
)}

    
   {/* 🏆 ADD PLAYER MODAL */}
<AddPlayerModal
  open={addPlayerOpen}
  onClose={() => setAddPlayerOpen(false)}
  onSuccess={() => fetchPlayers().then(setDynamicPlayers)}
/>

{/* ✏ EDIT PLAYER TEXT MODAL */}
<EditTextModal
  isOpen={!!editingPlayer}
  initialText={{
    title: editingPlayer?.name || "",
    desc: editingPlayer?.tournament || ""
  }}
  onSave={async (data) => {
    await updatePlayer(editingPlayer.id, {
      name: data.title,
      tournament: data.desc
    });
    setEditingPlayer(null);
    fetchPlayers().then(setDynamicPlayers);
  }}
  onClose={() => setEditingPlayer(null)}
/>


{/* 🖼 REPLACE IMAGE MODAL */}
<ReplaceImageModal
  open={!!replacingImagePlayer}
  currentUrl={replacingImagePlayer?.imageUrl}
  onSave={async (file) => {
    await replacePlayerImage(replacingImagePlayer.id, file);
    setReplacingImagePlayer(null);
    fetchPlayers().then(setDynamicPlayers);
  }}
  onClose={() => setReplacingImagePlayer(null)}
/>


   
  </div>
  </div>
</section>

     
{/* VISION / MISSION / GOALS – NEW SECTION */}
<section id="vision-section" className="py-20 bg-gradient-to-r from-pink-200 to-sky-200">
  <div className="max-w-5xl mx-auto px-6">
    

    {/* VISION */}
    <div
      onClick={() =>
        setSelectedVision({
          title: "Vision",
          paragraphs: [
            "To become Sangli’s leading cricket development hub that nurtures talented athletes with strong values, advanced skills, and a champion mindset—empowering them to excel at district, state, national, and international levels.",
            "Our vision is to nurture world-class cricketers by providing elite coaching and facilities. We aim to instill discipline, teamwork, and a relentless winning mindset. We strive to be the premier launchpad for future international stars. "
          ],
        })
      }
      className="bg-gradient-to-r from-pink-100 to-sky-100 rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-[1.02] transition mb-10"
    >
      <h3 className="text-4xl font-bold text-[#0f2547] mb-3">🌟 Vision</h3>
      <p className="text-gray-800 leading-relaxed text-1xl">
        To Become Sangli’s Leading Cricket Development Hub That Nurtures Talented Athletes…
      </p>
      <p className="text-gray-900 leading-relaxed text-1xl mt-2">Our Vision Is To Nurture World-Class Cricketers By Providing Elite Coaching And Facilities. We Aim To Instill Discipline, Teamwork, And A Relentless Winning Mindset. We Strive To Be The Premier Launchpad For Future International Stars. "
      </p>
      
    </div>

    {/* MISSION */}
    <div
      onClick={() =>
        setSelectedVision({
          title: "Mission",
          paragraphs: [
            "To provide high-quality, structured cricket coaching supported by modern training methods, technology, and certified coaches.",
            "To create a positive, disciplined, and growth-oriented sporting environment for players of all age groups.",
            "To develop athletes holistically—physically, technically, mentally, and ethically.",
            "To promote cricket culture in Sangli by identifying grassroots talent and giving them opportunities to compete and shine."
          ],
        })
      }
      className="bg-gradient-to-r from-sky-100 to-pink-100 rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-[1.02] transition mb-10"
    >
      <h3 className="text-4xl font-bold text-[#0f2547] mb-3">🎯 Mission</h3>

      <ul className="list-disc pl-5 text-gray-800 space-y-2">
        <li>High-quality, structured cricket coaching with technology.</li>
        <li>Positive & disciplined sporting environment.</li>
        <li>Holistic player development: physical + mental + ethical.</li>
        <li>Grassroots talent identification & exposure.</li>
      </ul>

      
    </div>

    {/* GOALS */}
    <div
      onClick={() =>
        setSelectedVision({
          title: "Goals",
          paragraphs: [
            "• Strengthen basic & advanced skill development programs.",
            "• Organize regular matches, fitness sessions, and evaluations.",
            "• Build strong parent–coach communication.",
            "",
            "• Produce players who qualify for district & state selections.",
            "• Host inter-academy tournaments to improve competition.",
            "• Upgrade equipment & training infrastructure.",
            "",
            "• Establish academy as a cricket excellence center.",
            "• Create IPL/state-level pathways for athletes.",
            "• Expand into multiple training centers."
          ],
        })
      }
      className="bg-gradient-to-r from-pink-100 to-sky-200 rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-[1.02] transition"
    >
      <h3 className="text-4xl font-bold text-[#0f2547] mb-3">🏆 Goals</h3>

      <p className="text-gray-800 mb-2 font-semibold">Short-Term Goals</p>
      <ul className="list-disc pl-5 text-gray-800 space-y-1 mb-4">
        <li>Skill development programs</li>
        <li>Fitness sessions & performance evaluation</li>
        <li>Parent–coach communication</li>
      </ul>

      <p className="text-gray-800 mb-2 font-semibold">Mid-Term Goals</p>
      <ul className="list-disc pl-5 text-gray-800 space-y-1 mb-4">
        <li>State-level selections</li>
        <li>Inter-academy tournaments</li>
        <li>Upgrade infrastructure</li>
      </ul>

      <p className="text-gray-800 mb-2 font-semibold">Long-Term Goals</p>
      <ul className="list-disc pl-5 text-gray-800 space-y-1">
        <li>Become a cricket excellence center</li>
        <li>Pathway for professional cricket / IPL</li>
        <li>Expand into multiple centers</li>
      </ul>

      
    </div>
  </div>
</section>
{/* END NEW VMG SECTION */}
      
          
{/* PROGRAMS & FACILITIES */}
<section id="programs-section" className="py-12 bg-gradient-to-r from-pink-200 to-sky-200">
  <div className="max-w-6xl mx-auto px-6">
    <h3 className="text-5xl font-bold text-sky-900 text-center mb-12">Programs & Facilities</h3>

    {/* Program Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { key: "ageWise", title: "Age Wise Coaching", desc: "Age-specific training for young talent.", img: "/images/Agewisecard.jpeg" },
        { key: "ground", title: "Spacious Ground For Booking", desc: "Available for matches & practice.", img: "/images/advanced.jpeg" },
        { key: "night", title: "Night Practice Sessions Under Flood Light", desc: "Intense Practice", img: "/images/nightfc/nightflood.jpeg" },
        { key: "residential", title: "Residential Facilities", desc: "Comfortable stay & nutrition for outstation students.", img: "/images/hostelss.png" },
        { key: "competitions", title: "Competitions & Exposure", desc: "Real match exposure & tournaments.", img: "/images/compT.jpeg" },
        { key: "seasonal", title: "Seasonal Camps", desc: "Intensive holiday camps with guest coaches.", img: "/images/seasonal/season1.jpeg" },
      ].map((p) => (
        <motion.div
          key={p.key}
          onClick={() => { setActiveProgram(p.key); setProgramModalOpen(true); setActiveInner(null); }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03, y: -6 }}
          transition={{ duration: 0.28 }}
          className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl overflow-hidden cursor-pointer"
        >
          <div className="w-full h-48 overflow-hidden rounded-t-3xl">
            <motion.img src={p.img} className="w-full h-full object-cover" whileHover={{ scale: 1.12 }} transition={{ duration: 0.5 }} alt={p.title} />
          </div>

          <div className="p-5 text-center">
            <h4 className="font-bold text-lg text-[#0f1724]">{p.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{p.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>

  </div>

  {/* PROGRAM MODAL */}
  <AnimatePresence>
    {programModalOpen && activeProgram && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => { setProgramModalOpen(false); setActiveProgram(null); setActiveInner(null); }}
      >
        {/* Backdrop */}
        <motion.div className="absolute inset-0 bg-black/60" />

        {/* MODAL BOX */}
        <motion.div
          className="relative z-10 w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-4xl bg-white rounded-2xl overflow-auto"
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 10, opacity: 0, scale: 0.98 }}
        >
          {/* HEADER */}
          <div className="flex items-start justify-between p-2 border-b">
            <div> 
              <h3 className="text-2xl font-bold text-[#0f2547]">
                {{
                  ageWise: "Age Wise Coaching",
                  ground: "Ground Booking Facility",
                  night: "Night Practice Sessions",
                  residential: "Residential Facilities",
                  competitions: "Competitions & Exposure",
                  seasonal: "Seasonal Camps", 
                }[activeProgram]}
              </h3>

              <p className="text-gray-800 mt-1">
                {{
                  ageWise: "Our Academy Provides Structured Coaching Programs Based On Age, Skill Level And Physical Ability.Each Batch Is Designed To Help Players Progress Step-By-Step Toward Professional Cricket",
                  ground: "Book our academy ground for matches and practice.",
                  night: "Night training under flood lights.",
                  residential: "Stay + food for outstation students.",
                  competitions: "Match experience and tournaments.",
                  seasonal: "Sumeet Sports Cricket Academy is pleased to announce its Summer Coaching Camp and Residential Summer Camp for the months of April and May.",
                }[activeProgram]}
              </p>
            </div>

            <button
              onClick={() => { setProgramModalOpen(false); setActiveProgram(null); setActiveInner(null); }}
              className="px-3 py-2 bg-red-500 rounded-full shadow text-white"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="p-6">

            {/* ─────────────────────────────────────────────────────────
                AGE WISE COACHING CARDS (3 inner cards with bullets)
            ───────────────────────────────────────────────────────── */}
            {activeProgram === "ageWise" && (
              <div className="flex flex-col md:flex-row gap-6 justify-center">

                {/* Beginner */}
                <motion.div className="w-full md:w-1/3 bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer" onClick={() => setActiveInner("beginner")}>
                    <img src="/images/GLphotos/mpl1.jpeg" className="w-full h-40 object-cover rounded-md mb-3" />
                    <h4 className="font-semibold text-lg">Beginner (6–10 yrs)</h4>

                    <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1">
                      {normalizeBullets(`
                        Introduction to fundamentals,
                        Coordination + discipline drills,
                        Soft leather ball practice,
                        Regular confidence-building matches
                      `).map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                </motion.div>

                {/* Intermediate */}
                <motion.div className="w-full md:w-1/3 bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer" onClick={() => setActiveInner("intermediate")}>
                    <img src="/images/senior.jpeg" className="w-full h-40 object-cover rounded-md mb-3" />
                    <h4 className="font-semibold text-lg">Intermediate (10–14 yrs)</h4>

                    <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1">
                      {normalizeBullets(`
                        Advanced batting/bowling/fielding,
                        Leather ball net sessions,
                        Tournament participation,
                        Technical polishing drills
                      `).map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                </motion.div>

                {/* Advanced */}
                <motion.div className="w-full md:w-1/3 bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="p-4 cursor-pointer" onClick={() => setActiveInner("advanced")}>
                    <img src="/images/compT.jpeg" className="w-full h-40 object-cover rounded-md mb-3" />
                    <h4 className="font-semibold text-lg">Advanced (15+ yrs)</h4>

                    <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1">
                      {normalizeBullets(`
                        High-performance sessions,
                        Leather-ball competitive matches,
                        Tactical + mental training,
                        District/state prep support
                      `).map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                </motion.div>

              </div>
            )}

            {/* ───────────────────────────────────────────────
                GROUND BOOKING (2 CARDS)
            ─────────────────────────────────────────────── */}
            {activeProgram === "ground" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Timings */}
                <motion.div className="bg-white rounded-xl border shadow-sm p-4">
                  <h4 className="font-semibold text-lg mb-2">Timings</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {normalizeBullets(`
                      Saturday — Half Day,
                      Sunday — Full Day,
                      Weekdays — On Request
                    `).map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </motion.div>

                {/* Facilities */}
                <motion.div className="bg-white rounded-xl border shadow-sm p-4">
                  <h4 className="font-semibold text-lg mb-2">Facilities</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {normalizeBullets(`
                      Leather & Tennis-ball pitches,
                      Practice nets,
                      Changing rooms & first-aid,
                      Match setup + scorers (optional)
                    `).map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </motion.div>

              </div>
            )}

            {/* ───────────────────────────────────────────────
                NIGHT PRACTICE (1 Card)
            ─────────────────────────────────────────────── */}
            {activeProgram === "night" && (
              <motion.div className="bg-white rounded-xl border shadow-sm p-4 space-y-4">

                <h4 className="font-semibold text-lg">Night Practice</h4>

                <p className="text-sm text-gray-700">
                  Night sessions for Students Better Growth.
                </p>
                <br />
                <p className="text-1x font-bold">To Support Students With A Busy School And Class Schedule, <br />The Academy Provides:</p>
                <ul>
                  <li>-Night Sessions From 6:00 PM To 8:00 PM</li>
                  <li>-1st Ever Night Cricket Practice Facility In Sangli</li>              
                  <li>-Complete Flood-Light Setup For Safe And Professional Training Experience</li>
                </ul>
                {/* Images */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "/images/nightfc/night1.jpeg",
                    "/images/nightfc/night2.jpeg",
                    "/images/nightfc/night3.jpeg",
                    "/images/nightfc/night4.jpeg",
                    "/images/nightfc/night5.jpeg",
                  ].map((src, i) => (
                    <img key={i} src={src} className="w-full h-40 object-cover rounded-md" />
                  ))}
                </div>

              </motion.div>
            )}

            {/* ───────────────────────────────────────────────
                RESIDENTIAL (3 Cards)
            ─────────────────────────────────────────────── */}
            {activeProgram === "residential" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Accommodation */}
                <motion.div className="bg-white rounded-xl border shadow-sm p-4">
                  <img src="/images/hostel.jpeg" className="w-full h-28 object-cover rounded-md mb-3" />
                  <h4 className="font-semibold text-lg">Accommodation</h4>
                  <p className="text-sm text-gray-700 mt-2">
                    Tie-up with Shri Babanrao Birnale Hostel for safe and comfortable stay.
                  </p>
                </motion.div>

                {/* Food */}
                <motion.div className="bg-white rounded-xl border shadow-sm p-4">
                  <img src="/images/food.jpg" className="w-full h-28 object-cover rounded-md mb-3" />
                  <h4 className="font-semibold text-lg">Food</h4>
                  <p className="text-sm text-gray-700 mt-2">
                    Healthy, sports-oriented meals prepared daily.
                  </p>
                </motion.div>

                {/* Safety */}
                <motion.div className="bg-white rounded-xl border shadow-sm p-4">
                  <img src="/images/safeT.png" className="w-full h-28 object-cover rounded-md mb-3" />
                  <h4 className="font-semibold text-lg">Safety</h4>
                  <p className="text-sm text-gray-700 mt-2">
                    CCTV, monitored entry & wardens for total security.
                  </p>
                </motion.div>

              </div>
            )}

            {/* ───────────────────────────────────────────────
                COMPETITIONS
            ─────────────────────────────────────────────── */}
            {activeProgram === "competitions" && (
              <div className="flex flex-col md:flex-row justify-center gap-6">

                {/* Weekly Matches */}
                <motion.div className="w-full md:w-1/3 bg-white rounded-xl border shadow-sm p-4">
                  <h4 className="font-semibold text-lg">Weekly Matches</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mt-2">
                    {normalizeBullets(`
                      Weekend matches,
                      Match fitness improvement,
                      Skill confidence practice
                    `).map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </motion.div>

                {/* Premier League */}
                <motion.div className="w-full md:w-1/3 bg-white rounded-xl border shadow-sm p-4">
                  <h4 className="font-semibold text-lg">Premier League</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mt-2">
                    {normalizeBullets(`
                      Annual U-13 league,
                      Annual U-16 league,
                      Knockout + league format
                    `).map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </motion.div>

                {/* Awards */}
                <motion.div className="w-full md:w-1/3 bg-white rounded-xl border shadow-sm p-4">
                  <h4 className="font-semibold text-lg">Awards</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mt-2">
                    {normalizeBullets(`
                      Best batsman awards,
                      Best bowler awards,
                      Recognition ceremonies
                    `).map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </motion.div>

              </div>
            )}


 
            {/* ───────────────────────────────────────────────
                SEASONAL CAMPS (3 CARDS)
            ─────────────────────────────────────────────── */}
           {activeProgram === "seasonal" && (
  <div className="flex flex-col md:flex-row justify-center gap-6">

    {/* Summer Camp */}
    <motion.div className="w-full md:w-1/2 bg-white rounded-xl border shadow-sm">
      <img
        src="/images/seasonal/summerCamp.jpg"
        className="w-full h-45 object-cover rounded-t-md"
      />
      <div className="p-4">
        <h4 className="font-semibold text-xl mb-2">
          Summer Cricket Camp (April–May)
        </h4>

        {/* Training Program Includes */}
        <h5 className="font-semibold text-md mt-3 mb-1 text-[#0f2547]">
          🔹 Training Program Includes:
        </h5>

        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {normalizeBullets(`
            Professional coaching in batting, bowling & fielding,
            Regular net practice sessions,
            Physical fitness & stamina training,
            Match practice & tournament exposure,
            Personal skill evaluation and feedback,
            Mental conditioning & game strategy sessions
          `).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </motion.div>

    {/* Residential Summer Camp */}
    <motion.div className="w-full md:w-1/2 bg-white rounded-xl border shadow-sm">
      <img
        src="/images/football1.jpeg"
        className="w-full h-40 object-cover rounded-t-md"
      />
      <div className="p-4">
        <h4 className="font-semibold text-xl mb-2">
          Residential Summer Camp (April–May)
        </h4>

        {/* Residential Facilities */}
        <h5 className="font-semibold text-md mt-3 mb-1 text-[#0f2547]">
          🔹 Residential Camp Facilities:
        </h5>
 
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {normalizeBullets(`
            Safe and secure accommodation,
            Nutritious meals,
            24/7 supervision,
            Daily structured training schedule
          `).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>

        {/* Extra Info */}
        <div className="mt-4 text-sm text-gray-800 leading-relaxed">
          <p><b>📅 Camp Duration:</b> April & May</p>
          <p><b>📍 Venue:</b> Sumeet Sports Cricket Academy</p>
          <p><b> 🔰 Eligibility:</b> Beginner to advanced players</p>

          <p className="mt-3">
            This camp is ideal for players who want to use their summer
            holidays productively and take their cricketing skills to
            the next level.
          </p>
        </div>
      </div>
    </motion.div>

  </div>
)}

    
{/* ---------- SHOP CATEGORIES (Improved 3x2 layout) ---------- */}
{activeProgram === "shopCategories" && (
  <div className="flex flex-col gap-10">

    {/* ----- CATEGORY CARD ----- */}
    {[
      {
        title: "Cricket Equipments : ",
        items: [
          { label: "English & Kashmir Willow Bats", img: "/images/shop2/baTs.jpeg" },
          { label: "Leather & Tennis Balls for Cricket", img: "/images/shop2/balls.jpg" },
          { label: "Batting Pads, Gloves & Guards", img: "/images/shop2/pads.jpg" },
          { label: "Helmets & Accessories", img: "/images/shop2/helmet.jpg" },
          { label: "Spikes & Cricket Shoes", img: "/images/shop2/shoes.jpg" },
          { label: "Full Cricket Kits for Training", img: "/images/shop2/kits.png" },
        ]
      },
      {
        title: "Fitness & Gym Equipment:",
        items: [
          { label: "Dumbbells & Plates", img: "/images/shop1/dumble.png" },
          { label: "Resistance Bands", img: "/images/shop1/band.png" },
          { label: "Skipping Ropes", img: "/images/shop2/ropes.png" },
          { label: "Training Mats", img: "/images/shop2/mats.png" },
          { label: "Gloves & Grips", img: "/images/shop1/gloves.jpg" },
          { label: "Agility Accessories", img: "/images/shop2/agility.png" },
        ]
      },
      {
        title: "Indoor & Outdoor Sports:",
        items: [
          { label: "Badminton Racquets", img: "/images/shop2/racket.png" },
          { label: "Football / Volleyball", img: "/images/shop2/football.png" },
          { label: "Basketballs Acsessories", img: "/images/shop2/basket.png" },
          { label: "Carrom Boards", img: "/images/shop2/carrom.png" },
          { label: "Table Tennis Kits", img: "/images/shop2/table_tenis.png" },
          { label: "Swimming Gear", img: "/images/shop2/swims.png" },
          { label: "Skating Gear", img: "/images/shop2/skate.png" },
        ]
      },
      {
        title: "Sportswear & Accessories:",
        items: [
          { label: "T-Shirts & Jerseys", img: "/images/shop1/tshirts.jpeg" },
          { label: "Shorts & Lowers", img: "/images/shop1/shorts.png" },
          { label: "Hoodies & Warmups", img: "/images/shop1/hoodies.jpg" },
          { label: "Cricket Caps ", img: "/images/shop1/caps.jpeg" },
          { label: "Track Suits For Sports", img: "/images/shop2/TrackN.png" },
          { label: "Arm Sleeves ", img: "/images/shop1/hand.png" },
        ]
      }
    ].map((cat, idx) => (
      <motion.div
        key={idx}
        className="bg-white rounded-2xl border shadow-md p-6"
      >
        <h3 className="text-2xl font-bold text-[#0f2547] mb-4">{cat.title}</h3>

        {/* 3×2 GRID */}
        <div className="grid grid-cols-1 mx-auto sm:grid-cols-4 gap-6">
          {cat.items.map((item, i) => (
            <div key={i}>
              <h4 className="font-semibold text-black mb-2">• {item.label}</h4>

              <div className="relative h-35 w-full rounded-xl overflow-hidden shadow-md">
                <img
                  src={item.img}
                  className="w-full h-full object-cover"
                  alt={item.label}
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs py-1 text-center">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    ))}

  </div>
)}

          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</section>


 
      {/* GALLERY */}
<section id="gallery-section" className="py-20 bg-gradient-to-r from-sky-200 to-pink-200">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-4xl md:text-5xl font-extrabold text-[#0f2547] text-center mb-3"
    >
      Gallery Highlights
    </motion.h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="mt-3 text-gray-600 max-w-2xl mx-auto text-center mb-8"
    >
      Moments that define our academy — passion, teamwork, and excellence captured in every frame.
    </motion.p>


    {/* IMAGE GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {filteredImages.slice(0, visibleCount).map((img, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03, duration: 0.4 }}
          className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
          onClick={() => {
            setCurrentIndex(index);
            openImage(img);
          }}
        >
          {/* Image */}
          <img src={img.url} alt="Gallery" className="w-full h-56 object-cover" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
            transition flex items-center justify-center">
            <p className="text-white text-lg font-semibold">View</p>
          </div>
        </motion.div>
      ))}

    </div>

    {/* LOAD MORE */}
    <div className="text-center mt-10">
      {visibleCount < filteredImages.length && (
        <button
          onClick={() => setVisibleCount(prev => prev + 8)}
          className="px-6 py-3 bg-[#0f2547] text-white rounded-full shadow hover:bg-[#1b396a] transition"
        >
          Load More
        </button>
      )}
    </div>

    {/* MODAL PREVIEW */}
    
<AnimatePresence>
  {modalOpen && modalImage && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
    >
      {/* Background overlay */}
      <motion.div
        className="absolute inset-0 bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* MODAL CONTENT */}
      <motion.div
        className="relative max-w-[90vw] max-h-[90vh] z-10 rounded-lg overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE */}
        <img
          src={modalImage}
          alt="Preview"
          className="max-h-[80vh] w-auto object-contain bg-black rounded-xl"
        />

        {/* TITLE */}
        <p className="text-center text-white mt-3 text-lg font-semibold">
          {filteredImages[currentIndex]?.title || "Gallery Image"}
        </p>

        {/* PREVIOUS */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const prev = currentIndex - 1;
              setCurrentIndex(prev);
              setModalImage(filteredImages[prev].url);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-black p-3 rounded-full shadow text-xl"
          >
            ‹
          </button>
        )}

        {/* NEXT */}
        {currentIndex < filteredImages.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const next = currentIndex + 1;
              setCurrentIndex(next);
              setModalImage(filteredImages[next].url);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white text-black p-3 rounded-full shadow text-xl"
          >
            ›
          </button>
        )}

        {/* CLOSE */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 bg-white/90 text-black p-2 rounded-full shadow text-xl"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  </div>
</section>



{/* ⭐ START SHOP SECTION ⭐ */}
<section id="shop-section" className="py-20 bg-gradient-to-r from-sky-200 to-pink-200">
  <div className="max-w-6xl mx-auto px-6">

    <h2 className="text-5xl font-extrabold text-center text-[#0f2547] mb-12">
      Sumeet Sports shop and Exclusive Sportswear
    </h2>

    <p className="text-center max-w-2xl mx-auto text-gray-700 mb-12 text-lg">
      Explore professional sports clothing and equipment — everything in one place at our academy store.
    </p>

{/* NEW INFO CARD */}
<div
  onClick={() =>
    setSelectedVision({
      title: "About Our Stores",
      paragraphs: [
        "Your detailed paragraph 1 goes here. It will appear inside the popup modal.",
        "You can add as many paragraphs as needed inside this array.",
      ],
    })
  }
  className="bg-gradient-to-r from-pink-100 to-sky-100 rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-[1.02] transition mb-10"
>
  <h3 className="text-4xl font-bold text-[#0f2547] mb-3">🔥 About Our Stores</h3>

  <p className="text-gray-800 leading-relaxed text-lg">  
<b>Sumeet Sports </b>Shop Is The Most Trusted And Established Sports Equipment Outlet In The Region,
<br /> 
Proudly Completing 10 Successful Years In The Sports Business. 
<br />
Founded By Passionate Sportsperson<b> Mr. Sumeet Chavan,</b> The Shop Has Been Built With A Mission To Make Quality Sports Gear Affordable And Easily Accessible To Every Athlete — From Beginners To Professional Players.
<br />
With A Decade Of Experience, Sumeet Sports Shoppe Has Become A One-Stop Solution For All Sporting Needs, Supporting Athletes, Students And Clubs With Premium Products And Personalized Guidance.
<br />
<p> 📍🛒<b>Address- Varad Morya Apt, Behind Chetana Petrol Pump, 100ft Road,sangli.</b></p>
☎️<b>Contact</b> - 9403230200/8830807879
</p>
</div>
    {/* Grid – Two Big Cards */}
   {/* ⭐ MAIN SHOP HERO CARD ⭐ */}
<div
  className="
    relative rounded-3xl overflow-hidden shadow-xl mb-12
    h-110 w-full bg-cover bg-center
  "
  style={{ backgroundImage: "url('/images/ro45n.png')" }} // your RO45 image here
>
  {/* Black overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Card Content */}
  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
    <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
      Official Sumeet Sports Shop
    </h2>

    <p className="text-gray-200 text-lg max-w-2xl mt-4">
      Premium Sports kits, Equipment & Clothing Trusted by Athletes.
    </p>

    <div className="flex gap-4 mt-8 flex-wrap justify-center">
      {/* Explore Categories */}
      <button
        onClick={() => {
          setActiveProgram("shopCategories");
          setProgramModalOpen(true);
        }}
        className="
          px-6 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 
          text-white font-semibold hover:bg-white/30 transition
        "
      >
        Explore Categories
      </button>

      {/* Contact Shop */}
      <button
        onClick={() => {
          const el = document.getElementById("contact-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className="
          px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-pink-500
          text-white font-semibold shadow-md hover:opacity-90 transition
        "
      >
        Contact Shop
      </button>
    </div>
  </div>
</div>
  </div>
</section>
{/* ⭐ END SHOP SECTION ⭐ */}
      
      {/* CONTACT */}
  <section id="contact-section" className="py-20 bg-gradient-to-r from-sky-200 to-pink-200">
  <div className="container mx-auto px-6">

    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#0f2547]">
        Get In <span className="bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">
          Touch
        </span>
      </h2>
      <p className="text-xl text-gray-800 max-w-3xl mx-auto">
        Have questions about admissions, programs or training?
        <br />  
        -just connect with us on <b>whatsapp</b> via given form.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

      {/* LEFT – FORM */}
      <div>
        <div className="rounded-2xl border border-gray-200 shadow-md bg-white hover:border-pink-400 transition">
          <div className="p-8">

            <h3 className="text-2xl font-semibold mb-6 text-[#0f2547]">
              Send us a Message
            </h3>

           <form
  className="space-y-6"
  onSubmit={(e) => {
    e.preventDefault();

    const msg = `Hello Sumeet Sports Academy,%0A%0AName: ${contactForm.first} ${contactForm.last}%0AContact: ${contactForm.phone}%0AEmail: ${contactForm.email}%0AMessage: ${contactForm.message}`;

    const whatsappURL = `https://wa.me/9657923492?text=${msg}`;
    window.open(whatsappURL, "_blank");
  }}
>
  {/* First + Last Name */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="text-gray-800">First Name</label>
      <input
        value={contactForm.first}
        onChange={(e) =>
          setContactForm({ ...contactForm, first: e.target.value })
        }
        placeholder="Enter your first name"
        className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
      />
    </div>

    <div>
      <label className="text-gray-800">Last Name</label>
      <input
        value={contactForm.last}
        onChange={(e) =>
          setContactForm({ ...contactForm, last: e.target.value })
        }
        placeholder="Enter your last name"
        className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
      />
    </div>
  </div>

  {/* Contact Number */}
  <div>
    <label className="text-gray-800">Contact Number</label>
    <input
      value={contactForm.phone}
      onChange={(e) =>
        setContactForm({ ...contactForm, phone: e.target.value })
      }
      placeholder="Enter your contact number"
      type="tel"
      className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
    />
  </div>

  {/* Email */}
  <div>
    <label className="text-gray-800">Email</label>
    <input
      value={contactForm.email}
      onChange={(e) =>
        setContactForm({ ...contactForm, email: e.target.value })
      }
      placeholder="Enter your email address"
      type="email"
      className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
    />
  </div>

  {/* Message */}
  <div>
    <label className="text-gray-800">Message</label>
    <textarea
      value={contactForm.message}
      onChange={(e) =>
        setContactForm({ ...contactForm, message: e.target.value })
      }
      rows="6"
      placeholder="Write your message here"
      className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white"
    ></textarea>
  </div>

  {/* Submit — WhatsApp Redirect */}
  <button
    type="submit"
    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium bg-green-500 hover:bg-green-600 transition"
  >
    💬 Send on WhatsApp
  </button>
</form>

          </div>
        </div>
        <p className="text-xl text-gray-900 max-w-3xl mt-5 mx-auto">* We Will Reach Out Instantly..!!</p>
      </div>

      {/* RIGHT – CONTACT INFO */}
      <div className="space-y-8">

        <div>
          <h3 className="text-4xl font-semibold px-3 mb-6 text-[#0f2547]">
            Contact Information
          </h3>
          <p className="text-gray-900 mb-8 leading-relaxed">
            Reach out to us anytime. We usually respond within 24 hours.
          </p>
        </div>

        {/* Phone */}
        <div className="rounded-2xl border border-gray-200 shadow-sm bg-white hover:border-pink-400 transition">
          <div className="p-8 flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-sky-300 to-pink-300 rounded-full flex items-center justify-center text-white">
              📞
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-[#0f2547]">Phone</h4>
              <p className="text-gray-900">+91 9403230200</p>
              <p className="text-gray-900">+91 7507878219</p>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="rounded-2xl border border-gray-200 shadow-sm bg-white hover:border-pink-400 transition">
          <div className="p-8 flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-pink-500 rounded-full flex items-center justify-center text-white">
              ✉️
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-[#000000]">Email</h4>
              <p className="text-gray-900">info@sumeetsportsacademy.com</p>
            </div>
          </div>
        </div>

        {/* Address */} 
        <div className="rounded-2xl border mt-4 border-gray-200 shadow-sm bg-white hover:border-pink-400 transition">
          <div className="p-8 flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-pink-500 rounded-full flex items-center justify-center text-white">
              📍
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-[#0f2547]">Address</h4>
              <p className="text-gray-900">
                Sumeet Sports Cricket Academy,  
                Appasaheb Birnale Public School, Sangli, Maharashtra
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
      {/* FOOTER */}
      <footer className="bg-[#0b1020] text-gray-300 rounded-t-[40px] pt-12">
        <div className="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/images/logobg.png" className="w-20 h-20  mx-7 md:mx-4  mb-3  border-gray-400" alt="logo" />
            <p className=" text-2xl"><b>Sumeet Sports</b> </p> <p>Cricket Academy — Sangli</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white text-2xl">Contact</h4>
            <p className="text-sm">info@sumeetsportsacademy.com</p>
            <p className="text-lg text-gray-200 font-semibold">📞 +91 9403230200</p>
            <p className="text-lg text-gray-200 font-semibold">📞 +91 7507878219</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white text-2xl">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#home-section" className="hover:underline">Home</a></li>
              <li><a href="#about-section" className="hover:underline">About</a></li>
              <li><a href="#gallery-section" className="hover:underline">Gallery</a></li>
              <li><a href="#contact-section" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white text-2xl">Follow Us</h4>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/sumeetsports_cricket_academy  " className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center hover:scale-110 transition" aria-label="Instagram"><FaInstagram className="text-white" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center hover:scale-110 transition" aria-label="LinkedIn"><FaLinkedin className="text-white" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:scale-110 transition" aria-label="Website"><FaGlobe className="text-white" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center hover:scale-110 transition" aria-label="Cricket"><GiCricketBat className="text-white" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-sm">© {new Date().getFullYear()} Sumeet Sports Cricket Academy — All rights reserved.</div>
        <h6  className="text-sm"><p className="text-sm text-gray-900"> D.B.Nadim </p></h6>     
      </footer>

      {/* SELECTED CARD MODAL */} 
      <AnimatePresence>
        {selectedCard && (
          <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50" onClick={() => setSelectedCard(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="rounded-3xl max-w-3xl w-full p-4">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                {selectedCard.img && <img src={selectedCard.img} className="w-full h-64 object-cover rounded-xl mb-6" alt={selectedCard.title || selectedCard.name || "detail"} />}
                <h2 className="text-3xl font-bold mb-4 text-[#0f1724]">{selectedCard.title || selectedCard.name}</h2>

                <ul className="list-disc pl-6 text-gray-800 space-y-2 text-lg mb-8">
                  {(detailsMap[selectedCard.title] || detailsMap[selectedCard.name] || detailsMap.default).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>

                <button onClick={() => setSelectedCard(null)} className="w-full py-3 bg-gradient-to-r from-sky-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg">Close</button>
              </div>
                    {/* Vision / Mission / Goals Modal */}
     ////
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT SUBMIT POPUP */}
      <AnimatePresence>
        {showContactPopup && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50">
            <div className="bg-white rounded-xl px-6 py-4 shadow-xl border border-gray-200">
              <p className="font-semibold">Enquiry delivered, we will respond to you asap..!!!!</p>
              <div className="mt-2 text-right">
                <button className="text-sm text-sky-600 font-semibold" onClick={() => setShowContactPopup(false)}>Close</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}