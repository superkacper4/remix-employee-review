import { Link } from "@remix-run/react";
import React from "react";

interface ButtonProps {
  to: string;
  children: React.ReactNode;
}

export default function LinkButton({ to, children }: ButtonProps) {
  return (
    <Link
      to={to}
      className="flex h-full grow items-center justify-center px-2 py-1 text-white transition hover:bg-[#22357E]"
    >
      {children}
    </Link>
  );
}
