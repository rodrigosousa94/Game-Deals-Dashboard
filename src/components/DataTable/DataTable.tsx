import { useState } from "react";
import { motion } from "framer-motion";

interface GameDeal {
  id: string;
  title: string;
  store: string;
  storeName: string;
  price: string;
  originalPrice: string;
  discount: string;
  dealRating: string;
  favorite: boolean;
  banner: string;
  link: string;
}

interface DataTableProps {
  data: GameDeal[];
  onRowClick: (game: GameDeal) => void;
  onFavoriteClick: (id: string) => void;
}

function DataTable({ data, onRowClick, onFavoriteClick }: DataTableProps) {
  const [visible, setVisible] = useState(10);

  const showMore = () => {
    setVisible((prev) => prev + 10);
  };

  return (
    <div className="w-full">
      {/* Mobile layout: Cards */}
      <div className="block md:hidden space-y-4">
        {data.slice(0, visible).map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="bg-gray-800 p-4 rounded-lg shadow"
          >
            <img
              src={game.banner}
              alt={game.title}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <div className="font-semibold text-white">{game.title}</div>
            <div className="text-sm text-gray-400 mt-1">Loja: {game.storeName}</div>
            <div className="text-sm text-green-400 mt-1">Preço: {game.price}</div>
            <div className="text-sm text-gray-500 line-through">De: {game.originalPrice}</div>
            <div className="text-sm text-yellow-400 mt-1">Desconto: {game.discount}</div>
            <div className="text-sm text-blue-400 mt-1">Rating: {game.dealRating}</div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => onRowClick(game)}
                className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition"
              >
                Ver detalhes
              </button>
              <button
                onClick={() => onFavoriteClick(game.id)}
                className={`text-xl transition ${
                  game.favorite ? "text-yellow-400" : "text-gray-400"
                } hover:scale-110`}
                title="Favoritar"
              >
                {game.favorite ? "⭐" : "☆"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop layout: Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg mt-4">
        <table className="min-w-full table-auto text-sm text-left text-gray-300">
          <thead className="bg-gray-700 text-gray-200 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Store</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Original</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3 text-center">Fav</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, visible).map((game, index) => (
              <motion.tr
                key={game.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                onClick={() => onRowClick(game)}
                className="border-b border-gray-600 hover:bg-gray-700 transition cursor-pointer"
              >
                <td className="px-4 py-2">{game.title}</td>
                <td className="px-4 py-2">{game.storeName}</td>
                <td className="px-4 py-2 text-green-400 font-semibold">{game.price}</td>
                <td className="px-4 py-2 line-through text-gray-400">{game.originalPrice}</td>
                <td className="px-4 py-2 text-yellow-400">{game.discount}</td>
                <td className="px-4 py-2 text-blue-400">{game.dealRating}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavoriteClick(game.id);
                    }}
                    className={`text-lg transition-all ${
                      game.favorite ? "text-yellow-400" : "text-gray-400"
                    } hover:scale-110`}
                    title="Favoritar"
                  >
                    {game.favorite ? "⭐" : "☆"}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ver mais */}
      {visible < data.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={showMore}
            className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition"
          >
            Ver mais
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
