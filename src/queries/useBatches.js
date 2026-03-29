import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBatches, getBatchesByCourse, createBatch, updateBatch } from "../services/batchService";

export const useBatches = () => {
    return useQuery({
        queryKey: ["batches"],
        queryFn: getBatches,
    });
};

/* ---------------- Get Batches By Course ---------------- */

export const useBatchesByCourse = (courseId) => {
    return useQuery({
        queryKey: ["batches", courseId],
        queryFn: () => getBatchesByCourse(courseId),
        enabled: !!courseId, // only run when courseId exists    
    });
};

export const useCreateBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBatch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["batches"] });
        },
    });
};

export const useUpdateBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBatch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["batches"] });
        },
    });
};