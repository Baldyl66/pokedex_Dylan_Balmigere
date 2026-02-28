import { useNavigate } from 'react-router-dom';
import type { Trainer, Pokemon } from '../../types';
import './FavoritesList.css';

interface FavoritesListProps {
  trainer: Trainer | null;
  pokemons: Pokemon[];
  onToggleFavorite: (pokemonId: number) => void;
}

export default function FavoritesList({ trainer, pokemons, onToggleFavorite }: FavoritesListProps) {
  const navigate = useNavigate();

  if (!trainer) return null;

  //--- Filtre les Pokémons favoris du dresseur

  const favoritePokemons = pokemons.filter(p => trainer.favorites.includes(p.pokedex_id));

  if (favoritePokemons.length === 0) {
    return (
      <div className="favorites-section">
        <h2>⭐ Favoris de {trainer.name}</h2>
        <p className="empty-message">Aucun Pokémon en favoris pour le moment</p>
      </div>
    );
  }

  return (
    <div className="favorites-section">
      <h2>⭐ Favoris de {trainer.name} ({favoritePokemons.length})</h2>
      <div className="favorites-grid">
        {favoritePokemons.map((pokemon) => (
          <div key={pokemon.pokedex_id} className="favorite-card-container">
            
            <button
              className="favorite-pokemon-card"
              onClick={() => navigate(`/pokemon/${pokemon.pokedex_id}`)}
              aria-label={pokemon.name.fr}
            >
              <img src={pokemon.sprites.regular} alt={pokemon.name.fr} />
              <h3>{pokemon.name.fr}</h3>

               //--- Bouton de suppression du favori

              <button
                className="remove-favorite-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(pokemon.pokedex_id);
                }}
                title="Retirer des favoris"
              >
                ✕
              </button>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
