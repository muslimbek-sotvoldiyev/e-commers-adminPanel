"use client";
import { useEffect, useState } from "react";
import AppBar from "@/components/siteBar/page";

type AuthCheckProps = {
  children: React.ReactNode;
};

export default function AuthCheck({ children }: AuthCheckProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return token ? <AppBar>{children}</AppBar> : children;
}
