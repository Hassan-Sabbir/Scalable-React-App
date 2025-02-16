import { useMutation } from "@tanstack/react-query";
import { getData } from "../services/apiService";

export interface MutationProps {
    url: string;
    token?: string | null;
    body?: Record<string, unknown>; 
    status?: number;
}

export const useAPI = () => {
    const token = '';

    const getMutation = useMutation({
        mutationFn: ({ url }: MutationProps) => getData({ url, token })
    })

    return {
        getMutation
    };
}