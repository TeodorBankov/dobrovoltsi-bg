import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const fetchUsers = async () => {
    const { data } = await api.get("/users");
    return data;
};

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });
};