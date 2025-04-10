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
  storeName: string
}

function HomePage() {
  const [gameDeals, setGameDeals] = useState<GameDeal[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [visibleCount, setVisibleCount] = useState(8);
  const [filters, setFilters] = useState({
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
        const data = await fetchDealsWithStores(); // já vem formatado com storeName incluso
        setGameDeals(data);
      } catch (error) {
        console.error("Error fetching game deals:", error);
      } finally {
        setLoading(false);
      }
    }
  
    getDeals();
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteGames");
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      setGameDeals((prevDeals) =>
        prevDeals.map((game) => ({
          ...game,
          favorite: favoriteIds.includes(game.id),
        }))
      );
    }
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

  function handleFilterChange(updatedFilters: typeof filters) {
    setFilters(updatedFilters);
  }

  const filteredDeals = gameDeals
    .filter((deal) => {
      const matchesStore = filters.storeID ? deal.store === filters.storeID : true;
      const price = parseFloat(deal.price.replace("$", ""));
      const discount = parseInt(deal.discount.replace("%", ""));
      const matchesLower = filters.lowerPrice ? price >= Number(filters.lowerPrice) : true;
      const matchesUpper = filters.upperPrice ? price <= Number(filters.upperPrice) : true;
      const matchesDiscount = filters.minDiscount ? discount >= Number(filters.minDiscount) : true;
      const matchesSearch = filters.searchTerm
        ? deal.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
        : true;
      return matchesStore && matchesLower && matchesUpper && matchesDiscount && matchesSearch;
    })
    .sort((a, b) => {
      if (filters.sortBy === "favorite") {
        return (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1;
      }
    
      const getValue = (deal: typeof a) => {
        switch (filters.sortBy) {
          case "price":
            return parseFloat(deal.price.replace("$", ""));
          case "savings":
            return parseInt(deal.discount.replace("%", ""));
          case "dealRating":
            return parseFloat(deal.dealRating);
          default:
            return 0;
        }
      };
    
      return getValue(a) - getValue(b);
    });
    

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-6 text-purple-500">Game Deals Dashboard</h1>
        <button
          onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition flex items-center gap-2"
        >
          {viewMode === "table" ? <LayoutGrid size={20} /> : <List size={20} />}
          {viewMode === "table" ? "Card View" : "Table View"}
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
                  onClick={() => setSelectedGame(game)}
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
