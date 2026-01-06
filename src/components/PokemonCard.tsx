import type { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div style={{ 
      textAlign: 'center',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img 
        src={pokemon.sprites?.regular} 
        alt={pokemon.name?.fr}
        style={{ width: '100%', height: 'auto' }}
      />
      <p style={{ margin: '5px 0', fontSize: '12px' }}>
        #{pokemon.pokedex_id}
      </p>
      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
        {pokemon.name?.fr || 'Nom inconnu'}
      </p>
    </div>
  );
}
