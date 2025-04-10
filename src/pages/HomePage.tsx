import { useState, useEffect } from "react";
import DataTable from "../components/DataTable/DataTable";
import GameCard from "../components/GameCard/GameCard";
import GameModal from "../components/Modal/GameModal";
import FilterControls from "../components/FilterControls/FilterControls";
import { fetchDealsWithStores } from "../services/api";
import { motion } from "framer-motion";
import { List, LayoutGrid } from "lucide-react";
import SkeletonCard from "../components/SkeletonCard/SkeletonCard";

interface GameDeal {
  id: string;
  title: string;
  store: string;
  price: string;
  originalPrice: string;
  discount: string;
  dealRating: string;
  favorite: boolean;
  banner: string;
  link: string;
  storeName: string;
}

interface Filters {
  storeID: string;
  lowerPrice: string;
  upperPrice: string;
  minDiscount: string;
  sortBy: string;
  searchTerm: string;
}

function HomePage() {
  const [gameDeals, setGameDeals] = useState<GameDeal[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [visibleCount, setVisibleCount] = useState(8);
  const [filters, setFilters] = useState<Filters>({
    storeID: "",
    lowerPrice: "",
    upperPrice: "",
    minDiscount: "",
    sortBy: "",
    searchTerm: "",
  });

  useEffect(() => {
    async function getDeals() {
      try {
        setLoading(true);
        const data = await fetchDealsWithStores();
        const savedFavorites = JSON.parse(localStorage.getItem("favoriteGames") || "[]");

        const updatedData = data.map((game: GameDeal) => ({
          ...game,
          favorite: savedFavorites.includes(game.id),
        }));

        setGameDeals(updatedData);
      } catch (error) {
        console.error("Error fetching game deals:", error);
      } finally {
        setLoading(false);
      }
    }

    getDeals();
  }, []);

  function toggleFavorite(id: string) {
    setGameDeals((prevDeals) => {
      const updatedDeals = prevDeals.map((deal) =>
        deal.id === id ? { ...deal, favorite: !deal.favorite } : deal
      );

      const favoriteIds = updatedDeals
        .filter((deal) => deal.favorite)
        .map((deal) => deal.id);

      localStorage.setItem("favoriteGames", JSON.stringify(favoriteIds));

      return updatedDeals;
    });
  }

  function handleFilterChange(updatedFilters: Filters) {
    setFilters(updatedFilters);
  }

  const filteredDeals = gameDeals
    .filter((deal) => {
      const price = parseFloat(deal.price.replace("$", ""));
      const discount = parseInt(deal.discount.replace("%", ""));
      return (
        (!filters.storeID || deal.store === filters.storeID) &&
        (!filters.lowerPrice || price >= Number(filters.lowerPrice)) &&
        (!filters.upperPrice || price <= Number(filters.upperPrice)) &&
        (!filters.minDiscount || discount >= Number(filters.minDiscount)) &&
        (!filters.searchTerm || deal.title.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "favorite") {
        return a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1;
      }
    
      const priceA = parseFloat(a.price.replace("$", ""));
      const priceB = parseFloat(b.price.replace("$", ""));
      const discountA = parseInt(a.discount.replace("%", ""));
      const discountB = parseInt(b.discount.replace("%", ""));
    
      switch (filters.sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "savings-asc":
          return discountA - discountB;
        case "savings-desc":
          return discountB - discountA;
        case "dealRating":
          return parseFloat(b.dealRating) - parseFloat(a.dealRating);
        default:
          return 0;
      }
    })
    

  const handleShowMore = () => setVisibleCount((prev) => prev + 8);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="flex gap-4 justify-center items-center mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-transparent bg-clip-text flex items-center gap-2">
          <span className="text-white text-4xl">🎮</span>
          Game Deals Dashboard
        </h1>
        <button
          onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
          className="hidden sm:flex bg-purple-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-purple-600 transition items-center gap-2"
        >
          {viewMode === "table" ? <LayoutGrid size={18} /> : <List size={18} />}
        </button>
      </div>

      <FilterControls onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-gray-800 shadow-md rounded-lg p-4">
          <DataTable
            data={filteredDeals}
            onRowClick={setSelectedGame}
            onFavoriteClick={toggleFavorite}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDeals.slice(0, visibleCount).map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <GameCard
                  game={game}
                  onFavoriteClick={toggleFavorite}
                />
              </motion.div>
            ))}
          </div>

          {visibleCount < filteredDeals.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleShowMore}
                className="bg-purple-500 hover:bg-purple-600 active:scale-95 transition-all text-white px-6 py-2 rounded shadow"
              >
                Ver mais
              </button>
            </div>
          )}
        </>
      )}

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}

export default HomePage;
