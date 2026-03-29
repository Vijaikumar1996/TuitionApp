import axios from "axios";
import apiClient from "./apiClient";

const API = "/students";

export const getStudents = async () => {
  const res = await apiClient.get(API);
  return res.data;
};

export const createStudent = async (data) => {
  const res = await apiClient.post(API, data);
  return res.data;
};

export const updateStudent = async ({ id, data }) => {
  const res = await apiClient.put(`${API}/${id}`, data);
  return res.data;
};