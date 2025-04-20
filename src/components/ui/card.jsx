// components/ui/card.jsx
import React from "react";

export function Card({ children }) {
  return <div style={{ border: "1px solid #ccc", borderRadius: "12px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: "1rem", marginBottom: "1rem" }}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
