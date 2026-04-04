import apiClient from "../services/apiClient";

// 🔥 GET formatted message
export const getMessageTemplates = async () => {
    const res = await apiClient.get("/MessageTemplates");
    return res.data;
};
// 🔥 Save template (optional - for settings page)
export const saveMessageTemplate = async (data) => {
    const res = await apiClient.post("/MessageTemplates", data);
    return res.data;
};