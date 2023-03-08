import React from "react";

const Td = ({ children }: { children: React.ReactNode }) => {
  return (
    <td
      style={{
        border: "1px solid black",
      }}
    >
      {children}
    </td>
  );
};

export default Td;
