import React from "react";

const Events = ({ events = [] }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((ev, idx) => (
        <div key={idx} className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-green-700 mb-2">{ev.title}</h3>
          {ev.description && <p className="text-gray-600">{ev.description}</p>}
          {ev.image && <img src={ev.image} alt={ev.title} className="w-full h-40 object-cover rounded mt-4" />}
        </div>
      ))}
    </div>
  );
};

export default Events;
