import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useAdminMetrics = (accessToken) => {
    return useQuery({
        queryKey: ['admin', 'metrics'],
        queryFn: async () => {
            const { data } = await api.get('/admin/metrics', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return data;
        },
        enabled: !!accessToken,
    });
};