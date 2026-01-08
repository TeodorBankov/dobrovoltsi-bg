import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useDeleteInitiative = (accessToken, options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (initiativeId) => {
            await api.delete(`/initiatives/${initiativeId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        },
        onSuccess: (...args) => {
            queryClient.invalidateQueries(['admin', 'initiatives']);
            queryClient.invalidateQueries(['admin', 'metrics']);
            options.onSuccess?.(...args);
        },
        onError: options.onError,
    });
};