import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourses, createCourse, updateCourse } from "../services/courseService";

export const useCourses = () => {
    return useQuery({
        queryKey: ["courses"],
        queryFn: getCourses,
        refetchOnWindowFocus: false
    });
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
};

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
};