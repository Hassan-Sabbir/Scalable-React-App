import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, getData, patchData, postData } from "../services/apiService";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    total?: number;
    pageCount?: number;
}

interface ErrorResponse {
    error: boolean;
    message: string;
}

export interface MutationProps {
    url: string;
    token?: string | null;
    body?: Record<string, unknown>;
    status?: number;
}

interface HandleMutationProps<T> {
    mutation: UseMutationResult<T, any, { url: string; body?: any }>;
    url: string;
    body?: any;
    invalidateQueryKey?: string[];
    showSuccessMessage?: boolean;
    showErrorMessage?: boolean;
    requiredFields?: Array<{ key: string; label?: string }>;
}

const isSuccessfulResponse = (response: any): boolean => {
    return response?.token || response?.statusCode === 200 || response?.statusCode === 201;
};

const handleErrorMessage = (error: any) => {
    const errorMessage = error?.response?.data?.message || error?.data?.message || error?.message;
    if (errorMessage) {
        Array.isArray(errorMessage) ? errorMessage.forEach(showErrorToast) : showErrorToast(errorMessage);
    }
};

interface GetResponseProps {
    queryKey: string[];
    url: string;
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    refetchInterval?: number;
    showToast?: boolean;
    staleTime?: number;
}

export interface ValidationProps {
    body: Record<string, any>;
    requiredFields: Array<{ key: string; label?: string }>;
}

export const useAPI = () => {
    const token = '';
    const queryClient = useQueryClient();

    const getMutation = useMutation({
        mutationFn: ({ url }: MutationProps) => getData({ url, token })
    });

    const deleteMutation = useMutation({
        mutationFn: ({ url }: MutationProps) => deleteData({ url, token })
    });

    const postMutation = useMutation({
        mutationFn: ({ url, body }: MutationProps) => postData({ url, body: (body as Record<string, any>), token })
    });

    const patchMutation = useMutation({
        mutationFn: ({ url, body }: MutationProps) => patchData({ url, body: (body as Record<string, any>), token })
    });

    const usePaginatedQuery = ({
        queryKey,
        url,
        enabled = true,
        refetchOnWindowFocus = false,
        refetchOnMount = false,
        refetchInterval,
        showToast = true,
        staleTime = 0
    }: GetResponseProps) => {
        const {
            data: response,
            error,
            isLoading,
            isFetching,
            ...queryProps
        } = useQuery<ApiResponse<any> | ErrorResponse, Error, ApiResponse<any>>({
            queryKey,
            queryFn: () => getData({ url, token }),
            refetchOnWindowFocus,
            refetchOnMount,
            staleTime,
            refetchInterval,
            enabled
        });

        let data: any = [];
        let totalItems = 0;
        let pageCount = 1;

        if (response?.statusCode === 200 && response?.data) {
            const { data: apiData, total, pageCount: apiPageCount } = response;
            data = apiData;
            totalItems = total ?? 0;
            pageCount = apiPageCount ?? 1;
        } else if (error) {
            const errorMessage = (error as any)?.response?.data?.message ?? error?.message;
            if (showToast) {
                showErrorToast(errorMessage);
            } else {
                console.error(errorMessage);
            }
        }

        return { data, totalItems, pageCount, response: response?.data, isLoading, isFetching, ...queryProps };
    };

    const validateFormData = ({
        body,
        requiredFields
    }: ValidationProps): boolean => {
        if (requiredFields?.length > 0) {
            for (const { key: fieldKey, label: fieldLabel } of requiredFields) {
                const fieldName = fieldLabel || fieldKey;
                const fieldValue = body[fieldKey];

                if (!fieldValue || fieldValue?.length == 0) {
                    const action = fieldKey === "file" ? "upload" : "enter";
                    showErrorToast(`Please ${action} ${fieldName}.`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleApiMutation = async ({
        mutation,
        url,
        body = {},
        invalidateQueryKey = [],
        showSuccessMessage = true,
        showErrorMessage = true,
        requiredFields = []
    }: HandleMutationProps<any>) => {
        try {
            if (validateFormData({ body, requiredFields })) {
                const response = await mutation.mutateAsync({ url, body });
                if (isSuccessfulResponse(response)) {
                    if (showSuccessMessage) showSuccessToast(response?.message);
                    if (invalidateQueryKey.length > 0) {
                        await queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
                    }
                    return { success: true, data: response };
                } else if (response?.message && showErrorMessage) {
                    handleErrorMessage(response);
                }
            }
        } catch (e: any) {
            if (showErrorMessage) handleErrorMessage(e);
            return { success: false, error: e };
        }
    
        return { success: false };
    };

    return {
        getMutation,
        deleteMutation,
        postMutation,
        patchMutation,
        usePaginatedQuery,
        handleApiMutation
    };
}