import { TableCell } from "@mui/material";
import React from "react";

const Td = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <TableCell className={className} align="center">
      {children}
    </TableCell>
  );
};

export default Td;
