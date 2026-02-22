import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function useAuth(requiredRole) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/user-profile");
        const user = res.data;

        if (requiredRole && user.role !== requiredRole) {
          router.push("/");
        }
      } catch {
        router.push("/");
      }
    };

    checkAuth();
  }, []);
}