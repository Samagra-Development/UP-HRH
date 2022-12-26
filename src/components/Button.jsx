import React from "react";

const Button = ({ text, onClick, styles = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-primary hover:bg-white text-white hover:text-primary border-primary border-2 font-medium py-3 mt-6 w-full text-[18px] ${styles}`}
    >
      {text}
    </button>
  );
};

export default Button;
