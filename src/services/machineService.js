import apiClient from "./apiClient";

/* ---------------- Get Machines ---------------- */

export const getMachines = async () => {
    const res = await apiClient.get("/machines");
    return res.data;
};

/* ---------------- Create Machine ---------------- */

export const createMachine = async (data) => {
    const res = await apiClient.post("/machines", data);
    return res.data;
};

/* ---------------- Update Machine ---------------- */

export const updateMachine = async ({ id, data }) => {
    const res = await apiClient.put(`/machines/${id}`, data);
    return res.data;
};

/* ---------------- Update Machine Status ---------------- */

export const updateMachineStatus = async ({ id, status }) => {
    const res = await apiClient.patch(`/machines/${id}/status`, {
        status,
    });
    return res.data;
};

/* ---------------- Get Available Machines ---------------- */
export const getAvailableMachines = async (
    batchId,
    language,
    excludeEnrollmentId
) => {
    const res = await apiClient.get("/machines/available", {
        params: {
            batchId,
            language,
            excludeEnrollmentId,
        },
    });

    return res.data;
};