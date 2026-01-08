import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const fetchDashboardData = async () => {
    const [users, initiatives, stats] = await Promise.all([
        api.get('/users'),
        api.get('/initiatives'),
        api.get('/admin/stats'),
    ]);

    return {
        users: users.data,
        initiatives: initiatives.data,
        stats: stats.data,
    };
};

export const useAdminDashboardData = () =>
    useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: fetchDashboardData,
    });