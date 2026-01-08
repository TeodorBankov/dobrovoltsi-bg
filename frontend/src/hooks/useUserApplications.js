import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useUserApplications = (accessToken, enabled = false) => {
    return useQuery({
        queryKey: ['user-applications'],
        queryFn: async () => {
            const { data } = await api.get('/applications/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return data;
        },
        enabled: !!accessToken && enabled,
    });
};