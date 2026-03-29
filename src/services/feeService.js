
import apiClient from "../services/apiClient";

// 🔥 Updated to support filters
export const getMonthlyFees = async (filters) => {
    const { month, batchId, enrollmentId, status, search } = filters;

    const res = await apiClient.get("/fees/month", {
        params: {
            month,
            batchId,
            enrollmentId,
            status,
            search,
        },
    });

    return res.data;
};

// 🔥 No change needed here
export const payFee = async (data) => {
    const res = await apiClient.post("/fees/pay", data);
    return res.data;
};
