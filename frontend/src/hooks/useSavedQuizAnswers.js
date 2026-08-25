import { useMemo } from "react";

/* Loads saved bird-quiz answers from localStorage once. */
export default function useSavedQuizAnswers() {
  return useMemo(() => {
    try {
      const raw = localStorage.getItem("ft_quiz_answers");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);
}
