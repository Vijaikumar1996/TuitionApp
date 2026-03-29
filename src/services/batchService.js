import apiClient from "../services/apiClient";

export const getBatches = async () => {
    const res = await apiClient.get("/GetBatches");
    return res.data;
};

export const getBatchesByCourse = async (courseId) => {
    const res = await apiClient.get(`/GetBatches?courseId=${courseId}`);
    return res.data;
};


export const createBatch = async (data) => {
    const res = await apiClient.post("/CreateBatch", data);
    return res.data;
};

export const updateBatch = async (req) => {
    const res = await apiClient.put(`/batches/${req.id}`, req.data);
    return res.data;
};
