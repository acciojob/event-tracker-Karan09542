import React from "react";
import { Navigate } from "react-big-calendar";

const CustomToolbar = ({ label, onNavigate, setOption }) => {
  return (
    <div
      className="rbc-toolbar"
      style={{
        padding: "10px 0px",
        marginBottom: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* LEFT SIDE: Prev & Next Buttons with custom labels */}
      <div>
        <button
          onClick={() => onNavigate(Navigate.PREVIOUS)}
          style={{ marginRight: 10, backgroundColor: "var(--blue-color)" }}
        >
          ← Prev
        </button>

        <button
          onClick={() => onNavigate(Navigate.NEXT)}
          style={{ backgroundColor: "var(--blue-color)" }}
        >
          Next →
        </button>
      </div>

      {/* CENTER: Current Month/Week Label */}
      <div>
        <span style={{ fontSize: "1.3rem", fontFamily: "sans-serif" }}>
          {label}
        </span>
      </div>

      {/* RIGHT SIDE: Your custom three buttons */}
      <div>
        <button
          onClick={() => setOption("all")}
          style={{ marginRight: 10, backgroundColor: "var(--blue-color)" }}
        >
          All
        </button>
        <button
          onClick={() => setOption("past")}
          style={{ marginRight: 10, backgroundColor: "var(--pink-color)" }}
        >
          Past
        </button>
        <button
          onClick={() => setOption("upcoming")}
          style={{ marginRight: 10, backgroundColor: "var(--green-color)" }}
        >
          Upcoming
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;
