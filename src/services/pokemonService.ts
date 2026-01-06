import type { Pokemon } from '../types';

export const fetchPokemons = async (): Promise<Pokemon[]> => {
  try {
    console.log('Début du chargement...');
    const response = await fetch('https://tyradex.vercel.app/api/v1/pokemon');
    console.log('Statut:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Nombre de pokémons:', data.length);
    console.log('Premier pokémon:', data[0]);
    return data;
  } catch (err) {
    console.error('Erreur complète:', err);
    throw err;
  }
};
