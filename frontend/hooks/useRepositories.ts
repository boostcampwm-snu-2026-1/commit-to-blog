"use client";

import { useEffect, useState } from "react";
import { api, Repository } from "@/lib/api";

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    api.repositories().then(setRepositories).catch(() => setRepositories([]));
  }, []);

  return repositories;
}
