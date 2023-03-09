import React from "react";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen">{children}</main>;
}
