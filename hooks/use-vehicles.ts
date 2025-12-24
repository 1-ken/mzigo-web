"use client";

import { useState, useEffect } from "react";
import { Vehicle, VehicleListResponse } from "@/types/vehicles";
import { API_ENDPOINTS, getApiUrl } from "@/lib/constants";
import { useSession } from "next-auth/react";

interface UseVehiclesReturn {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage vehicles list
 * Used for selecting vehicles in the shipment form
 */
export function useVehicles(): UseVehiclesReturn {
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    if (!session?.user) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const url = getApiUrl(API_ENDPOINTS.LIST_VEHICLES);
      const accessToken = (session as any)?.accessToken;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
      }

      const data: VehicleListResponse = await response.json();

      if (data.status === "success" && data.data) {
        setVehicles(data.data);
      } else {
        setError(data.message || "Failed to fetch vehicles");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching vehicles";
      setError(errorMessage);
      console.error("Error fetching vehicles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchVehicles();
    }
  }, [session]);

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchVehicles,
  };
}
