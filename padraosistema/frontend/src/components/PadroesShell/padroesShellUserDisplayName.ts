import type { Session } from "@auth/core/types";

const userLabelFromSessionUser = (user: NonNullable<Session["user"]>): string => {
  const name = user.name?.trim();
  if (name != null && name.length > 0) {
    return name;
  }
  const email = user.email?.trim();
  if (email != null && email.length > 0) {
    return email;
  }
  return "Conta";
};

export const padroesShellUserDisplayName = (
  status: string,
  session: Session | null | undefined,
): string | null => {
  if (status !== "authenticated") {
    return null;
  }
  const user = session?.user;
  if (user == null) {
    return null;
  }
  return userLabelFromSessionUser(user);
};
