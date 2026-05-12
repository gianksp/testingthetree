import type { FC } from "react";
import { vstyles } from "../utils/styles";

export const CardHeader: FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <th onClick={onClick} style={{ ...vstyles.th, cursor: onClick ? "pointer" : "default" }}>{children}</th>
);
