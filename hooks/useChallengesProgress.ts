import { useEffect, useState } from "react";
import { challengesService } from "../services/challengesService";
import type { ChallengesProgressData } from "../types/challenges";

export const useChallengesProgress = () => {
  const [progress, setProgress] = useState<ChallengesProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await challengesService.getChallengesProgress();
      setProgress(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch challenges progress");
      console.error("Error fetching challenges progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    progress,
    loading,
    error,
    refetch: fetchProgress,
  };
};
