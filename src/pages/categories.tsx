import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Coffee, Utensils, Shirt, Smile, Home, Book, Palette, Plane, DollarSign, Briefcase, Dumbbell, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  description: string;
  articleCount: number;
  color: string;
}

export function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://192.168.1.106:3000/categories');
        console.log(response.data);

        const categoriesWithDetails = response.data.map((category: any) => {
          const details = getCategoryDetails(category.name);
          return {
            ...category,
            icon: details.icon,
            color: details.color
          };
        });

        setCategories(categoriesWithDetails);
      } catch (err) {
        setError('Erreur lors du chargement des catégories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryDetails = (name: string) => {
    switch (name) {
      case 'Beauté':
        return { icon: <Heart className="h-8 w-8" />, color: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-300' };
      case 'Voyage':
        return { icon: <Plane className="h-8 w-8" />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300' };
      case 'Lifestyle':
        return { icon: <Coffee className="h-8 w-8" />, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300' };
      case 'Nutrition':
        return { icon: <Utensils className="h-8 w-8" />, color: 'bg-lime-50 text-lime-600 dark:bg-lime-950 dark:text-lime-300' };
      case 'Mode':
        return { icon: <Shirt className="h-8 w-8" />, color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300' };
      case 'Bien-être':
        return { icon: <Smile className="h-8 w-8" />, color: 'bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300' };
      case 'Décoration':
        return { icon: <Home className="h-8 w-8" />, color: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300' };
      case 'Culture':
        return { icon: <Book className="h-8 w-8" />, color: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300' };
      case 'Créativité':
        return { icon: <Palette className="h-8 w-8" />, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300' };
      case 'Finance':
        return { icon: <DollarSign className="h-8 w-8" />, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300' };
      case 'Entrepreneuriat':
        return { icon: <Briefcase className="h-8 w-8" />, color: 'bg-gray-50 text-gray-600 dark:bg-gray-950 dark:text-gray-300' };
      case 'Sport & Fitness':
        return { icon: <Dumbbell className="h-8 w-8" />, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300' };
      case 'Technologie':
        return { icon: <Cpu className="h-8 w-8" />, color: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300' };
      default:
        return { icon: null, color: 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300' };
    }
  };

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    navigate(`/articles?category=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`); // Encode category name
  };

  if (loading) {
    return <div>Chargement des catégories...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Helmet>
        <title>Catégories - Daily Tips</title>
        <meta name="description" content="Explorez nos différentes catégories d'articles lifestyle." />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold mb-4">Catégories</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explorez nos différentes catégories et trouvez l'inspiration qui vous correspond
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleCategoryClick(category.id, category.name)} // Pass category name
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${category.color}`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-playfair font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {category.articleCount} articles
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}


