import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useAdminInitiatives = (accessToken) => {
    return useQuery({
        queryKey: ['admin', 'initiatives'],
        queryFn: async () => {
            const { data } = await api.get('/initiatives', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return data;
        },
        enabled: !!accessToken,
    });
};