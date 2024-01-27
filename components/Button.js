import React from "react";

const Button = ({ onClick, label, disabled = false, outline = false }) => {
  return (
    <button
      onClick={() => onClick()}
      disabled={disabled}
      className={`${
        outline ? "border border-accent text-accent" : "bg-accent text-white"
      } disabled:bg-accent/20 disabled:text-accent-light w-full py-4 rounded-2xl  font-medium `}
    >
      {label}
    </button>
  );
};

export default Button;
