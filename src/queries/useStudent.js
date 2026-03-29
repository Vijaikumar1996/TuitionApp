import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudents, createStudent, updateStudent } from "../services/studentService";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: getStudents,   
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};