import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useApplyForInitiative = (accessToken, options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (initiativeId) => {
            const { data } = await api.post(
                '/applications',
                { initiativeId },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return data;
        },
        onSuccess: (data, initiativeId, context) => {
            queryClient.invalidateQueries(['user-applications']);
            options.onSuccess?.(data, initiativeId, context);
        },
        onError: (error, initiativeId, context) => {
            options.onError?.(error, initiativeId, context);
        },
        onSettled: (data, error, initiativeId, context) => {
            options.onSettled?.(data, error, initiativeId, context);
        },
    });
};