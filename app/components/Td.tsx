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
    <TableCell color="white" className={className} align="center">
      {children === 0 ? "-" : children}
    </TableCell>
  );
};

export default Td;
