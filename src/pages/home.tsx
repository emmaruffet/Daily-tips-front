import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Article } from '@/data/articles';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://strawberry.ruffet.org:3000/articles');

        // Vérification et assignation d'une catégorie par défaut
        const validArticles = response.data.map((article: Article) => ({
          ...article,
          category: article.category || { name: 'Catégorie inconnue' },
        }));

        setArticles(validArticles);
      } catch (err) {
        setError("Erreur lors du chargement des articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const featuredArticles = articles.slice(0, 3);

  return (
    <>
      <Helmet>
        <title>Daily Tips - Lifestyle Tips & Tricks</title>
        <meta name="description" content="Découvrez les meilleurs conseils lifestyle pour une vie plus épanouie." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-primary/10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              Bienvenue sur Daily Tips
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Découvrez nos conseils et astuces pour une vie plus épanouie.
            </p>
            <Link to="/articles">
              <Button size="lg" className="rounded-full">
                Découvrir nos articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold mb-8 text-center">Articles à la une</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link to={`/article/${article.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-primary-foreground mb-2">
                        {article.category?.name || 'Catégorie inconnue'}
                      </div>
                      <h3 className="text-xl font-playfair font-semibold mb-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground">{article.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
