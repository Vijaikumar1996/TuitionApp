import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMachines,
  createMachine,
  updateMachine,
  updateMachineStatus,
  getAvailableMachines
} from "../services/machineService";

/* ---------------- Get Machines ---------------- */

export const useMachines = () => {
  return useQuery({
    queryKey: ["machines"],
    queryFn: getMachines,
  });
};

/* ---------------- Create Machine ---------------- */

export const useCreateMachine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
};

/* ---------------- Update Machine ---------------- */

export const useUpdateMachine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
};

/* ---------------- Update Machine Status ---------------- */

export const useUpdateMachineStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMachineStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
};

/* ---------------- Get Available Machines ---------------- */

export const useAvailableMachines = (batchId, language) => {
  return useQuery({
    queryKey: ["availableMachines", batchId, language],
    queryFn: () => getAvailableMachines(batchId, language),
    enabled: !!batchId && !!language, // 👈 only call when ready
  });
};
