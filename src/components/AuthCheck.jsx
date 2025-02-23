"use client";
import { useEffect, useState } from "react";
import AppBar from "@/components/siteBar/page";

export default function AuthCheck({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
