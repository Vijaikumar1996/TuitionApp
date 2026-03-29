import apiClient from "../services/apiClient";

export const getCourses = async () => { 
    const res = await apiClient.get("/GetCourses");
    return res.data;
};

export const createCourse = async (data) => {    
    const res = await apiClient.post("/CreateCourse", data);
    return res.data;
};

export const updateCourse = async (req) => {   
    const res = await apiClient.put(`/courses/${req.id}`, req.data);
    return res.data;
};

export const deleteCourse = async (id) => {
    const res = await apiClient.delete(`/courses/${id}`);
    return res.data;
};