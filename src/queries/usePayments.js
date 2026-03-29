
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../services/paymentService";

// 🔥 Get Payments Hook
export const usePayments = (filters) => {
    return useQuery({
        queryKey: ["payments", filters],
        queryFn: () => getPayments(filters),
        keepPreviousData: true,
        enabled: !!filters.month
    });
};
