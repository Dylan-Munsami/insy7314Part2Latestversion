import { useEffect } from "react";

export default function useHttpsCheck() {
  useEffect(() => {
    if (window.location.protocol !== "https:" && process.env.NODE_ENV === "production") {
      alert("⚠️ You are not using a secure connection (HTTPS). Please switch to HTTPS.");
    }
  }, []);
}
