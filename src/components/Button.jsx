import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <button className="bg-primary hover:bg-white text-white hover:text-primary border-primary border-2 font-bold py-3 mt-9 w-full">
      {text}
    </button>
  );
};

export default Button;
