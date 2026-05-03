import apiClient from "../services/apiClient";

export const getInstitutes = async () => { 
    const res = await apiClient.get("/GetInstitutes");
    return res.data;
};

export const createInstitute = async (data) => {    
    const res = await apiClient.post("/RegisterInstitute", data);
    return res.data;
};

export const updateInstitute = async (req) => {   
    const res = await apiClient.put(`/institutes/${req.id}`, req.data);
    return res.data;
};

export const deleteInstitute = async (id) => {
    const res = await apiClient.delete(`/institutes/${id}`);
    return res.data;
};