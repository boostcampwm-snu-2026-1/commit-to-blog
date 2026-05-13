"use client";

import { useEffect, useState } from "react";
import { api, Repository } from "@/shared/api/client";

export function useRepositories(enabled = true) {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    if (!enabled) return;
    api.repositories().then(setRepositories).catch(() => setRepositories([]));
  }, [enabled]);

  return repositories;
}
