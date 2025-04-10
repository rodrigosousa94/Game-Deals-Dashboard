import { useEffect, useState } from "react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <input
        type="text"
        name="searchTerm"
        placeholder="Buscar por título"
        value={filters.searchTerm}
        onChange={handleChange}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      />

      <select
        name="storeID"
        value={filters.storeID}
        onChange={handleChange}
        className="bg-gray-800 text-white px-4 py-2 rounded"
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
        className="bg-gray-800 text-white px-4 py-2 rounded"
      />

      <input
        type="number"
        name="upperPrice"
        placeholder="Preço máximo"
        value={filters.upperPrice}
        onChange={handleChange}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      />

      <input
        type="number"
        name="minDiscount"
        placeholder="Desconto mínimo (%)"
        value={filters.minDiscount}
        onChange={handleChange}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      />

      <select
        name="sortBy"
        value={filters.sortBy}
        onChange={handleChange}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        <option value="">Ordenar por</option>
        <option value="price">Preço</option>
        <option value="savings">Desconto</option>
        <option value="dealRating">Avaliação</option>
        <option value="favorite">Favoritos</option>
      </select>
    </div>
  );
};

export default FilterControls;
