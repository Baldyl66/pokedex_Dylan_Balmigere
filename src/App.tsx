import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import type { Trainer } from './types'
import { useGetPokemonQuery } from './store/slices/pokemonApi'
import TrainerSection from './components/TrainerSection'

function App() {
  const navigate = useNavigate()
  const { data: pokemons = [], isLoading, isFetching } = useGetPokemonQuery()
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [newName, setNewName] = useState('');
  const [activeTrainerId, setActiveTrainerId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const displayedPokemons = pokemons.filter(p =>
    p.name.fr.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const addTrainer = () => {
    if (newName.trim() && trainers.length < 2) {
      const newTrainer = { id: Date.now(), name: newName };
      setTrainers([...trainers, newTrainer]);
      setNewName('');
      if (trainers.length === 0) setActiveTrainerId(newTrainer.id);
    }
  };

  return (
    <>
      <div className="search-bar">
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <input
            type="search"
            placeholder="Rechercher un Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Rechercher un Pokémon"
          />
          {!isFetching && pokemons.length > 0 && (
            <span style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.75rem',
              backgroundColor: '#00D9FF',
              color: '#1a1f2e',
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>
              ✓ Cache
            </span>
          )}
          {isFetching && (
            <span style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.75rem',
              backgroundColor: '#FF2E5E',
              color: '#ffffff',
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              animation: 'pulse 1.5s infinite'
            }}>
              ⟳ Chargement...
            </span>
          )}
        </div>
      </div>

      <TrainerSection
        trainers={trainers}
        newName={newName}
        activeTrainerId={activeTrainerId}
        onNameChange={setNewName}
        onAddTrainer={addTrainer}
        onSelectTrainer={setActiveTrainerId}
      />

      <section className="pokemon-list">
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <div className="grid">
            {displayedPokemons.map((pokemon) => (
               <button
                 key={pokemon.pokedex_id}
                 className="pokemon-card"
                 onClick={() => navigate(`/pokemon/${pokemon.pokedex_id}`)}
                 aria-label={pokemon.name.fr}
               >
                <img src={pokemon.sprites.regular} alt={pokemon.name.fr} />
                <h3>{pokemon.name.fr}</h3>
               </button>
             ))}
          </div>
        )}
      </section>
    </>
  )
}

export default App
