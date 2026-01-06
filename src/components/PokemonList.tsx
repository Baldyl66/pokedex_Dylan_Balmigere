import type { Pokemon } from '../types';
import PokemonCard from './PokemonCard';

interface PokemonListProps {
  pokemons: Pokemon[];
  loading: boolean;
}

export default function PokemonList({ pokemons, loading }: PokemonListProps) {
  return (
    <div>
      <h2>Liste des Pokémons ({pokemons.length})</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : pokemons.length === 0 ? (
        <p>Aucun Pokémon chargé</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '20px',
          maxHeight: '600px',
          overflowY: 'auto',
          padding: '10px'
        }}>
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.pokedex_id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
}
