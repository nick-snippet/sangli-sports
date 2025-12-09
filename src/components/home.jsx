import React from "react";
import Gallery from "../components/gallery";
<section id="home" className="hero">   // 👈 add id here
</section>
export default function Home() {
  return (
    <div>
      <section className="bg-yellow-100 py-16 text-center">
        <h1 className="text-5xl font-bold text-yellow-800">Welcome to Sumeet Sports Academy..</h1>
      
      </section>

      <section className="py-12 px-6 text-center">
        <h2 className="text-3xl font-semibold text-yellow-700 mb-4">Our Experience</h2>
        <p className="max-w-3xl mx-auto text-gray-600">
          From premium accommodations to fine dining and recreational activities, we
          offer a world-class experience to our esteemed members.
        </p>
      </section>

      <Gallery />
    </div>
  );
}
