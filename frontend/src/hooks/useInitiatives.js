import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const fetchInitiatives = async () => {
    const { data } = await api.get("/initiatives");
    return data;
};

export const useInitiatives = () => {
    return useQuery({
        queryKey: ["initiatives"],
        queryFn: fetchInitiatives,
    });
};