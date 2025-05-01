import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  articleId: string;
}

export const FavoriteButton = ({ articleId }: FavoriteButtonProps) => {
  const { userId } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchFavoriteStatus();
    }
  }, [userId, articleId]);

  const fetchFavoriteStatus = async () => {
    try {
      console.log("Fetching favorite status for article:", articleId);
      const response = await fetch("/api/favorites");
      const favorites = await response.json();
      console.log("Received favorites:", favorites);
      setIsFavorited(favorites.some((fav: any) => fav.articleId === parseInt(articleId)));
    } catch (error) {
      console.error("Error fetching favorite status:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!userId) return;

    try {
      const method = isFavorited ? "DELETE" : "POST";
      console.log(`${method} favorite for article:`, articleId);
      await fetch("/api/favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId: parseInt(articleId) }),
      });
      console.log("Toggle favorite completed");

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (!userId) return null;

  return (
    <button
      onClick={toggleFavorite}
      className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
    >
      <Heart
        className={`w-5 h-5 ${
          isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
      <span className="text-sm">
        {isFavorited ? "お気に入り解除" : "お気に入り"}
      </span>
    </button>
  );
}; 