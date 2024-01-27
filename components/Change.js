import React from "react";

const Change = ({ handleChange }) => {
  return (
    <div className="flex items-center justify-center  ">
      <button
        onClick={() => handleChange()}
        className="rounded-full h-10 w-10 border bg-white border-[rgb(210,216,244)] hover:border-[rgb(195,195,195)] flex items-center justify-center"
      >
        <svg
          width="11"
          height="14"
          viewBox="0 0 11 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 1C5.5 2 5.5 13 5.5 13M5.5 13L10 8.5M5.5 13L1 8.5"
            stroke="#7578B5"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Change;
