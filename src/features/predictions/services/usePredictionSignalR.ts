import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { predictionQueryKeys } from "@/features/predictions/query/prediction.query";
import {
  getPredictionSignalR,
  initializePredictionSignalR,
} from "@/features/predictions/services/prediction.signalr.service";
import { usePredictionStore } from "@/features/predictions/store/predictionStore";
import type { PredictionRealtimeEvent } from "@/features/predictions/types/prediction.types";

export const usePredictionSignalR = (enabled = true) => {
  const queryClient = useQueryClient();
  const addRealtimeEvents = usePredictionStore(
    (state) => state.addRealtimeEvents,
  );
  const pendingEvents = useRef<PredictionRealtimeEvent[]>([]);
  const flushTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const service = initializePredictionSignalR({
      url:
        import.meta.env.VITE_PREDICTION_SIGNALR_URL ||
        "https://localhost:5000/prediction-hub",
      enableMockStream: import.meta.env.VITE_USE_MOCKS !== "false",
    });

    void Promise.resolve(service.connect()).catch((error) => {
      console.error("Prediction SignalR connection failed:", error);
    });

    const flushEvents = () => {
      if (pendingEvents.current.length === 0) return;
      const events = [...pendingEvents.current];
      pendingEvents.current = [];
      addRealtimeEvents(events);

      queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.analytics.accuracy,
      });
      queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.history.all,
      });
    };

    const unsubscribe = getPredictionSignalR().onEvent((event) => {
      pendingEvents.current.push(event);

      if (event.type === "MARKET_SIGNAL_ALERT") {
        toast.warning("AI Signal Alert", {
          description: String(event.payload.message || "New market signal"),
        });
      }

      if (!flushTimer.current) {
        flushTimer.current = window.setTimeout(() => {
          flushTimer.current = null;
          flushEvents();
        }, 600);
      }
    });

    return () => {
      if (flushTimer.current) {
        window.clearTimeout(flushTimer.current);
        flushTimer.current = null;
      }
      unsubscribe();
      void Promise.resolve(service.disconnect()).catch((error) => {
        console.error("Prediction SignalR disconnect failed:", error);
      });
    };
  }, [enabled, queryClient, addRealtimeEvents]);
};
