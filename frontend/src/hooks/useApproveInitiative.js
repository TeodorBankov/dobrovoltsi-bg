import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useApproveInitiative = (accessToken, options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (initiativeId) => {
            await api.put(
                `/initiatives/${initiativeId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
        },
        onSuccess: (...args) => {
            queryClient.invalidateQueries(['admin', 'initiatives']);
            queryClient.invalidateQueries(['admin', 'metrics']);
            options.onSuccess?.(...args);
        },
        onError: options.onError,
    });
};