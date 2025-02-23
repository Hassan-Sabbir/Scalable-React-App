import { useMutation } from "@tanstack/react-query";
import { deleteData, getData, patchData, postData } from "../services/apiService";

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

    const deleteMutation = useMutation({
        mutationFn: ({ url }: MutationProps) => deleteData({ url, token })
    })

    const postMutation = useMutation({
        mutationFn: ({ url, body }: MutationProps) => postData({ url, body: (body as Record<string, any>), token })
    })

    const patchMutation = useMutation({
        mutationFn: ({ url, body }: MutationProps) => patchData({ url, body: (body as Record<string, any>), token })
    })

    return {
        getMutation,
        deleteMutation,
        postMutation,
        patchMutation
    };
}