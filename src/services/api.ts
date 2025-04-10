import axios from "axios";

const api = axios.create({
    baseURL: "https://www.cheapshark.com/api/1.0"
})

export function fetchDeals() {
    return api.get("/deals")
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching deals:", error);
            throw error;
        });
}

export default api