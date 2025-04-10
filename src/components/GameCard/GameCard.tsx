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

interface GameCardProps {
    game: GameDeal;
    onClick: () => void;
    onFavoriteClick: (id: string) => void;
}

function GameCard({ game, onClick, onFavoriteClick }: GameCardProps) {
    return (
        <div
        onClick={onClick}
        className="bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer"
        >
        <img
            src={game.banner}
            alt={game.title}
            className="w-full h-40 object-cover rounded-lg mb-4 shadow-sm"
        />
        <h3 className="text-lg font-bold text-white mb-3 text-center min-h-[3.5rem] line-clamp-2">
            {game.title}
        </h3>



        <div className="space-y-1 text-lg text-gray-300 w-full">
            <p>
            <span className="font-medium text-purple-400">🛒 Loja:</span>{" "}
            <span className="text-white">{game.storeName}</span>
            </p>
            <p>
            <span className="font-medium text-green-400">💰 Preço:</span>{" "}
            <span className="text-white">{game.price}</span>
            </p>
            <p>
            <span className="font-medium text-gray-400">💸 De:</span>{" "}
            <span className="line-through text-red-400">{game.originalPrice}</span>
            </p>
            <p>
            <span className="font-medium text-yellow-400">🔥 Desconto:</span>{" "}
            {game.discount}
            </p>
            <p>
            <span className="font-medium text-blue-400">⭐ Avaliação:</span>{" "}
            {game.dealRating}
            </p>
        </div>

        <div className="flex justify-between items-center mt-4 w-full">
            <a
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg"
            >
            💸 Comprar
            </a>
            <button
            onClick={(e) => {
                e.stopPropagation();
                onFavoriteClick(game.id);
            }}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                game.favorite
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
            }`}
            >
            {game.favorite ? "★ Favorito" : "☆ Favoritar"}
            </button>
        </div>
        </div>
    )
}

export default GameCard;