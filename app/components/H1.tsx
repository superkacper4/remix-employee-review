import React from "react";

export default function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="px-6 py-4 text-xl font-bold">{children}</h1>;
}
