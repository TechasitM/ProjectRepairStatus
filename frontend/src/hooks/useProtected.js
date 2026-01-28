"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export function useProtected() {
  const router = useRouter();

  useEffect(() => {
    authService.profile().catch(() => {
      router.push("/login");
    });
  }, []);
}
