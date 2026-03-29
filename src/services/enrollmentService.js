import apiClient from "./apiClient";


export const enrollmentService = {

  getEnrollments: async () => {
    const res = await apiClient.get("/enrollments");
    return res.data;
  },

  createEnrollment: async (data) => {
    const res = await apiClient.post("/enrollments", data);
    return res.data;
  },

  updateEnrollment: async (id, data) => {
    const res = await apiClient.put(`/enrollments/${id}`, data);
    return res.data;
  }

};