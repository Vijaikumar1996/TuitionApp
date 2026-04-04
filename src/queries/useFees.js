
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMonthlyFees, payFee } from "../services/feeService";

// 🔥 Get Fees Hook (Updated for filters)
export const useFees = (filters) => {
  const { month, batchId, enrollmentId, status, search } = filters;

  return useQuery({
    queryKey: ["fees", filters], // 🔥 important for caching
    queryFn: () =>
      getMonthlyFees({
        month,
        batchId,
        enrollmentId,
        status,
        search,
      }),
    keepPreviousData: true, // smooth UI while refetching
  });
};

// 🔥 Pay Fee Hook (Updated)
export const usePayFee = (filters) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payFee,
    onSuccess: () => {
      // 🔥 refresh based on filters
      queryClient.invalidateQueries({
        queryKey: ["fees"],
      });
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
  });
};
