import React from "react";

const Th = ({ children }: { children: React.ReactNode }) => {
  return (
    <th
      style={{
        border: "1px solid black",
      }}
    >
      {children}
    </th>
  );
};

export default Th;
