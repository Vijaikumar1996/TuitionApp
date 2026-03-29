import apiClient from "./apiClient";

export const loginApi = (credentials) => {
    return apiClient.post("/Login", credentials);
};