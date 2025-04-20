// src/components/ui/button.jsx
import React from "react";

export function Button({ children, onClick, type = "button", size = "md" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: size === "sm" ? "4px 10px" : "6px 16px",
        fontSize: size === "sm" ? "12px" : "14px",
        background: "#4caf50",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        margin: "2px"
      }}
    >
      {children}
    </button>
  );
}
