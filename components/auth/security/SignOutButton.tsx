"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";

/** Cierra la sesión de este dispositivo y vuelve al login. */
export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      const { error } = await authClient.signOut();
      if (error) throw error;
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setPending(false);
      toast.error("No se ha podido cerrar la sesión. Inténtalo de nuevo.");
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} loading={pending} className={className}>
      {!pending && <LogOut className="size-4" aria-hidden />}
      Cerrar sesión
    </Button>
  );
}
