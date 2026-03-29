
import apiClient from "./apiClient";

export const getDashboard = async () => {
    const res = await apiClient.get("/dashboard");
    return res.data;
};