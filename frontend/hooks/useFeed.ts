import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, FeedCard } from "@/lib/api";

const MIN_BUFFER_SIZE = 3; // Always keep 3 cards ahead in the buffer

export function useFeed(userId: string) {
  const router = useRouter();

  const [cardBuffer, setCardBuffer] = useState<FeedCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  // Track how many fetches are currently in flight so we don't over-fetch
  const fetchingCountRef = useRef(0);
  // Ensure we only initialize once
  const initializedRef = useRef(false);

  const fetchCardsToFillBuffer = useCallback(async () => {
    // We want the buffer array to ideally have currentIndex + 1 + MIN_BUFFER_SIZE items
    // So if currentIndex is 0, we want items at index 0, 1, 2 (length 3).
    setCardBuffer((currentBuffer) => {
      const neededTotal = currentIndex + 1 + MIN_BUFFER_SIZE;
      const deficit = neededTotal - currentBuffer.length - fetchingCountRef.current;

      if (deficit > 0) {
        // Trigger parallel fetches to make up the deficit
        for (let i = 0; i < deficit; i++) {
          fetchingCountRef.current += 1;
          
          api.getNextCard(userId)
            .then((newCard) => {
              setCardBuffer((prev) => [...prev, newCard]);
            })
            .catch((err) => {
              const msg = err instanceof Error ? err.message : String(err);
              if (msg.includes("404") || msg.includes("not found")) {
                localStorage.clear();
                router.replace("/onboarding");
              }
              console.error("Failed to fetch next card:", err);
            })
            .finally(() => {
              fetchingCountRef.current -= 1;
              // Check if we still need more (in case a fetch failed or index advanced)
              // But avoiding recursive call directly here to prevent deep stacks.
              // A slight timeout allows state to settle.
              setTimeout(() => {
                // To avoid infinite loops on strict errors, we could add exponential backoff here,
                // but for this implementation we rely on the component re-render to trigger again.
              }, 100);
            });
        }
      }
      return currentBuffer;
    });
  }, [currentIndex, userId, router]);

  // Initial load
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      setLoadingInitial(true);
      await fetchCardsToFillBuffer();
      setLoadingInitial(false);
    };
    init();
  }, [fetchCardsToFillBuffer]);

  // Refill buffer whenever index or buffer changes
  useEffect(() => {
    if (!loadingInitial) {
      fetchCardsToFillBuffer();
    }
  }, [currentIndex, cardBuffer.length, loadingInitial, fetchCardsToFillBuffer]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const currentCard = cardBuffer[currentIndex] || null;
  const nextCardReady = cardBuffer.length > currentIndex + 1;

  return {
    currentCard,
    currentIndex,
    loadingInitial,
    nextCardReady,
    goNext,
    goPrev,
    cardBuffer,
    bufferLength: cardBuffer.length,
  };
}
