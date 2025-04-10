import { motion, AnimatePresence } from "framer-motion";

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
}

interface GameModalProps {
  game: GameDeal | null;
  onClose: () => void;
}

function GameModal({ game, onClose }: GameModalProps) {
  return (
    <AnimatePresence>
      {game && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4 text-purple-400">{game.title}</h2>
            <img
              src={game.banner}
              alt={game.title}
              className="w-full h-auto mb-4 rounded-lg shadow"
            />

            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-semibold text-purple-400">🛒 Loja:</span>{" "}
                <span className="text-white">{game.store}</span>
              </p>
              <p>
                <span className="font-semibold text-green-400">💰 Preço Atual:</span>{" "}
                <span className="text-white">{game.price}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-400">💸 Preço Original:</span>{" "}
                <span className="line-through text-red-400">{game.originalPrice}</span>
              </p>
              <p>
                <span className="font-semibold text-yellow-400">🔥 Desconto:</span>{" "}
                <span className="text-white">{game.discount}</span>
              </p>
              <p>
                <span className="font-semibold text-blue-400">⭐ Avaliação:</span>{" "}
                <span className="text-white">{game.dealRating}</span>
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <a
                href={game.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg"
              >
                💸 Compre aqui
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-white cursor-pointer bg-red-500 rounded-lg hover:bg-red-600 transition-all"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GameModal;
