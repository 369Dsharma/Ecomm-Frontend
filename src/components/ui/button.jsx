import React from "react";
export function Button({ className = "", variant = "default", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2";
  const variants = {
    default: "bg-black text-white hover:bg-black/80",
    outline: "border border-black text-black hover:bg-black/5",
    ghost: "text-black hover:bg-black/5",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
