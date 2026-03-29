import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "../services/enrollmentService";

export function useEnrollments() {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: enrollmentService.getEnrollments
  });

}

export function useCreateEnrollment() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: enrollmentService.createEnrollment,

    onSuccess: () => {
      queryClient.invalidateQueries(["enrollments"]);
    }

  });

}

export function useUpdateEnrollment() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: ({ id, data }) =>
      enrollmentService.updateEnrollment(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries(["enrollments"]);
    }

  });

}