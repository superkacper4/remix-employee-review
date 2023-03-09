import React from "react";

interface ButtonProps {
  title: string;
  type: "button" | "submit" | "reset" | undefined;
  handleClick: () => void;
}

export default function Button({ title, handleClick, type }: ButtonProps) {
  return (
    <button type={type} onClick={handleClick} className="px-2 py-1 text-white">
      {title}
    </button>
  );
}
