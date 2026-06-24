import type { ReactNode } from "react";

export const metadata = {
  title: "Client | MAVIRE CODOIR",
  description: "Sign in or create your MAVIRE CODOIR client account.",
};

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <>{children}</>;
}
