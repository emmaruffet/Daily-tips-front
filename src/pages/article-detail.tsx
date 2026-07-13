import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>(); // Récupération de l'ID depuis l'URL
  const navigate = useNavigate();
  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/article/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError("Erreur lors du chargement de l'article.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Chargement de l'article...</div>;
  }

  if (error || !article) {
    return <div className="text-center py-12 text-red-500">{error || "Article non trouvé"}</div>;
  }

  return (
    <>
      <Helmet>
        <title>{article.title} - Daily Tips</title>
        <meta name="description" content={article.excerpt || article.content} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />
        <div className="max-w-3xl mx-auto">
          <div className="text-sm font-medium text-primary-foreground mb-4">
            {article.category_id} • {new Date(article.updated_at).toLocaleDateString()}
          </div>
          <h1 className="text-4xl font-playfair font-bold mb-6">{article.title}</h1>

          <p>{article.content}</p>
          {/* Affichage des sections détaillées de l'article */}
          <div className="prose prose-lg max-w-none">
            {article.ArticleContents?.map((section: any, index: number) => (
              <div key={index} className="mb-8">
                {section.sectionTitle && <h2 className="text-2xl font-semibold mb-4">{section.sectionTitle}</h2>}
                {section.imageUrl && <img src={section.imageUrl} alt={section.sectionTitle} className="mb-4" />}
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
