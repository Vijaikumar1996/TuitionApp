import { useQuery } from "@tanstack/react-query";
import { getMessageTemplates } from "../services/messageTemplateService";

export const useMessageTemplates = () => {
    return useQuery({
        queryKey: ["messageTemplates"],
        queryFn: getMessageTemplates,
    });
};