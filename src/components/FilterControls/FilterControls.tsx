import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Store {
  storeID: string;
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

interface FilterControlsProps {
  onFilterChange: (filters: Filters) => void;
}

const FilterControls = ({ onFilterChange }: FilterControlsProps) => {
  const [filters, setFilters] = useState<Filters>({
    storeID: "",
    lowerPrice: "",
    upperPrice: "",
    minDiscount: "",
    sortBy: "",
    searchTerm: "",
  });

  const [stores, setStores] = useState<Store[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
        const data = await res.json();
        setStores(data);
      } catch (error) {
        console.error("Erro ao buscar as lojas:", error);
      }
    }

    fetchStores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-6 px-4 sm:px-6 md:px-8">
      {/* Área do input de busca */}
      <div className="flex sm:flex-row items-center justify-center gap-4 mb-4">
        <input
          type="text"
          name="searchTerm"
          placeholder="Buscar por título"
          value={filters.searchTerm}
          onChange={handleChange}
          className="bg-gray-800 text-white px-4 py-2 rounded w-full sm:max-w-sm md:max-w-md"
        />
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition"
          title="Filtros avançados"
        >
          <Settings size={20} className="text-white" />
        </button>
      </div>

      {/* Filtros avançados com animação */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <select
              name="storeID"
              value={filters.storeID}
              onChange={handleChange}
              className="bg-gray-800 text-white px-4 py-2 rounded w-full"
            >
              <option value="">Todas as lojas</option>
              {stores.map((store) => (
                <option key={store.storeID} value={store.storeID}>
                  {store.storeName}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="lowerPrice"
              placeholder="Preço mínimo"
              value={filters.lowerPrice}
              onChange={handleChange}
              className="bg-gray-800 text-white px-4 py-2 rounded w-full"
            />

            <input
              type="number"
              name="upperPrice"
              placeholder="Preço máximo"
              value={filters.upperPrice}
              onChange={handleChange}
              className="bg-gray-800 text-white px-4 py-2 rounded w-full"
            />

            <input
              type="number"
              name="minDiscount"
              placeholder="Desconto mínimo (%)"
              value={filters.minDiscount}
              onChange={handleChange}
              className="bg-gray-800 text-white px-4 py-2 rounded w-full"
            />

            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              className="bg-gray-800 text-white px-4 py-2 rounded w-full"
            >
              <option value="">Ordenar por</option>
              <option value="price-asc">Preço: Menor para maior</option>
              <option value="price-desc">Preço: Maior para menor</option>
              <option value="savings-asc">Desconto: Menor para maior</option>
              <option value="savings-desc">Desconto: Maior para menor</option>
              <option value="dealRating">Avaliação</option>
              <option value="favorite">Favoritos</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterControls;
