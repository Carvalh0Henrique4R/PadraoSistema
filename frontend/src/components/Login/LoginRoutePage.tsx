import React from "react";
import { LoginFormCard } from "./LoginFormCard";
import { useLoginFlow } from "./useLoginFlow";

type Props = {
  redirectAfterLogin: string | undefined;
};

export const LoginRoutePage: React.FC<Props> = ({ redirectAfterLogin }) => {
  const flow = useLoginFlow(redirectAfterLogin);

  if (flow.status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-muted-foreground">
        Carregando sessão…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(180deg,var(--background),var(--muted))] px-4 py-12 text-foreground">
      <LoginFormCard
        email={flow.email}
        handleCredentialsSubmit={flow.handleCredentialsSubmit}
        handleGoogleClick={flow.handleGoogleClick}
        message={flow.message}
        mode={flow.mode}
        name={flow.name}
        password={flow.password}
        pending={flow.pending}
        setEmail={flow.setEmail}
        setName={flow.setName}
        setPassword={flow.setPassword}
        toggleMode={flow.toggleMode}
      />
    </div>
  );
};
