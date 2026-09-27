import axios from 'axios';
import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";


interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'editor';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  hasAccess: (roles: string[]) => boolean;
}


export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      console.log("Tentative de connexion avec:", { email, password });
      const response = await axios.post('http://192.168.1.106:3000/login', { email, password });
      console.log("Réponse du serveur:", response.data);

      const { token } = response.data;
      if (!token) {
        throw new Error('Token manquant dans la réponse');
      }

      localStorage.setItem('authToken', token);
      const decodedUser: any = jwtDecode(token);

      const mockUser: User = {
        id: decodedUser.userId || decodedUser.sub || 'unknown', // Ajuste selon la structure du token
        name: decodedUser.name || decodedUser.email,
        email: decodedUser.email,
        role: decodedUser.role || 'user', // Valeur par défaut
      };

      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error); // Affiche l'erreur pour le débogage
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        "http://192.168.1.106:3000/register",
        { email, password },  // Pas besoin d'envoyer name ici
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
  
      const { token } = response.data;
      if (!token) {
        throw new Error('Token manquant dans la réponse');
      }
  
      localStorage.setItem('authToken', token);
  
      const decodedUser: any = jwtDecode(token);
  
      const newUser: User = {
        id: decodedUser.userId || decodedUser.sub || 'unknown',
        name: decodedUser.name || decodedUser.email,  // Tu peux définir 'name' comme email si besoin
        email: decodedUser.email,
        role: decodedUser.role || 'user',
      };
  
      set({ user: newUser, isAuthenticated: true });
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('authToken');
    set({ user: null, isAuthenticated: false });
  },
  hasAccess: (roles: string[]) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },

}));

