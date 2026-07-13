// src/components/Editor.tsx
import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";

// Types pour l'éditeur
interface EditorProps {
  onChange: (data: any) => void;  // Fonction qui sera appelée quand le contenu change
  initialContent?: any;           // Contenu initial (peut être null ou un objet)
}

const Editor: React.FC<EditorProps> = ({ onChange, initialContent }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      // Initialisation de l'éditeur avec les outils
      editorInstance.current = new EditorJS({
        holder: "editorjs",         // L'élément où l'éditeur sera monté
        data: initialContent || {}, // Données initiales (peut être vide au départ)
        onChange: async () => {
          // Sauvegarde les données à chaque changement
          const savedData = await editorInstance.current?.save();
          onChange(savedData); // Appelle la fonction onChange passée en prop
        },
        tools: {
          header: Header,
          list: List,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "http://localhost:3000/upload", // Ton endpoint d'upload d'image
              },
            },
          },
        },
      });
    }

    return () => {
      // Nettoyage lors de la destruction du composant
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
  }, [initialContent, onChange]);

  return <div id="editorjs" className="border p-4 rounded-lg" />;
};

export default Editor;
