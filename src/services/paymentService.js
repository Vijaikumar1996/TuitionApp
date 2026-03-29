
import apiClient from "./apiClient";

// 🔥 Get Payments API
export const getPayments = async (filters) => {
    const { month, batchId, enrollmentId, mode, search } = filters;

    const params = {};

    if (month) params.month = month;
    if (batchId) params.batchId = batchId;
    if (enrollmentId) params.enrollmentId = enrollmentId;
    if (mode) params.mode = mode;
    if (search) params.search = search;

    const res = await apiClient.get("/payments", { params });

    return res.data;
};
