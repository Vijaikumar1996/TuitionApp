import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstitutes, createInstitute, updateInstitute } from "../services/instituteService";

export const useInstitutes = () => {
    return useQuery({
        queryKey: ["institutes"],
        queryFn: getInstitutes,
        refetchOnWindowFocus: false
    });
};

export const useCreateInstitute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createInstitute,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutes"] });
        },
    });
};

export const useUpdateInstitute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateInstitute,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutes"] });
        },
    });
};