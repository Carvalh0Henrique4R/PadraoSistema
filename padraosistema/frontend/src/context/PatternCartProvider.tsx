import React from "react";
import { useSession } from "~/hooks/useSession";
import { PatternCartStore } from "./PatternCartStore";

export const PatternCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const userId =
    status === "authenticated" && session.user.id.length > 0 ? session.user.id : undefined;

  return (
    <PatternCartStore key={userId ?? "guest"} userId={userId}>
      {children}
    </PatternCartStore>
  );
};
