import { Helmet } from "react-helmet-async";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArticleCard } from "../components/article-card";
import Masonry from "react-masonry-css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "@/data/articles";
import axios from "axios";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export function Articles() {
  const navigate = useNavigate();
  const query = useQuery();
  const categoryIdFromUrl = query.get("category"); // On garde juste le categoryId depuis l'URL
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryIdFromUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null); // Réinitialiser les erreurs
    try {
      const url = categoryIdFromUrl 
      ? `http://localhost:3000/articles?category=${categoryIdFromUrl}` 
      : "http://localhost:3000/articles";
          const response = await axios.get(url);

      if (Array.isArray(response.data)) {
        const formattedArticles = response.data.map((article: any) => ({
          ...article,
          category: article.Category || { id: null, name: "Catégorie inconnue" },
        }));
        setArticles(formattedArticles);
      } else {
        throw new Error("Format des données invalide");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des articles :", err);
      setError("Impossible de charger les articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [categoryIdFromUrl]);

  const categories = useMemo(() => {
    const categoryMap = new Map<number, string>();
    articles.forEach((article) => {
      if (article.category?.id && article.category?.name) {
        categoryMap.set(article.category.id, article.category.name);
      }
    });
    return Array.from(categoryMap.entries());
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(
      (article) =>
        (!categoryIdFromUrl || String(article.category?.id) === categoryIdFromUrl) &&
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, categoryIdFromUrl, searchQuery]);

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <>
      <Helmet>
        <title>Articles - Daily Tips</title>
        <meta name="description" content="Découvrez notre collection d'articles lifestyle." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 font-playfair text-center">Articles</h1>

        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un article..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <Button
            variant={!categoryIdFromUrl ? "default" : "outline"}
            onClick={() => {
              setSelectedCategory(null);
              navigate('/articles');
            }}
            className="rounded-full"
          >
            Tous
          </Button>
          {categories.map(([id, name]) => (
            <Button
              key={id}
              variant={categoryIdFromUrl === String(id) ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory(String(id));
                navigate(`/articles?category=${id}`);
              }}
              className="rounded-full"
            >
              {name}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Chargement des articles...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory || "all"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ minHeight: '300px' }}
            >
              <Masonry
                breakpointCols={breakpointColumns}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
              >
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => <ArticleCard key={article.id} article={article} />)
                ) : (
                  <p className="text-center w-full">Aucun article trouvé.</p>
                )}
              </Masonry>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
