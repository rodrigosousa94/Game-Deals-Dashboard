import axios from "axios";

const api = axios.create({
  baseURL: "https://www.cheapshark.com/api/1.0",
});

export async function fetchDealsWithStores() {
  try {
    const [dealsRes, storesRes] = await Promise.all([
      api.get("/deals"),
      api.get("/stores"),
    ]);

    const deals = dealsRes.data;
    const stores = storesRes.data;

    const formattedDeals = deals.map((deal: any) => {
      const store = stores.find((s: any) => s.storeID === deal.storeID);

      return {
        id: deal.dealID,
        title: deal.title,
        store: deal.storeID,
        storeName: store?.storeName || "Unknown",
        price: `$${deal.salePrice}`,
        originalPrice: `$${deal.normalPrice}`,
        discount: `${Math.round(deal.savings)}%`,
        dealRating: deal.dealRating,
        favorite: false,
        banner: deal.thumb,
        link: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`,
      };
    });

    return formattedDeals;
  } catch (error) {
    console.error("Error fetching deals with stores:", error);
    throw error;
  }
}

export default api;
