import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { useGetPokemonQuery } from './store/slices/pokemonApi'
import { addTrainer, setActiveTrainer, toggleFavorite as toggleFavoritAction } from './store/slices/trainers-slices'
import { useAppDispatch } from './hooks/useAppDispatch'
import { useAppSelector } from './hooks/useAppSelector'
import TrainerSection from './components/TrainerSection/TrainerSection'
import TrainerList from './components/TrainerList/TrainerList'
import FavoritesList from './components/FavoritesList/FavoritesList'

function App() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  // Récupère la liste des Pokémons depuis l'API avec gestion du cache
  const { data: pokemons = [], isLoading, isFetching } = useGetPokemonQuery()
  
  // État Redux pour les dresseurs
  const trainers = useAppSelector(state => state.trainers.trainers)
  const activeTrainerId = useAppSelector(state => state.trainers.activeTrainerId)
  
  // État local pour la recherche
  const [newName, setNewName] = useState(''); // Champ saisie nouveau dresseur
  const [searchTerm, setSearchTerm] = useState(''); // Filtre de recherche

  const displayedPokemons = pokemons.filter(p =>
    p.name.fr.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Ajoute un nouveau dresseur avec un maximum de 2
  const handleAddTrainer = () => {
    if (newName.trim() && trainers.length < 2) {
      dispatch(addTrainer(newName));
      setNewName('');
    }
  };

  // Ajoute ou retire un Pokémon des favoris du dresseur actif
  const toggleFavorite = (pokemonId: number) => {
    if (!activeTrainerId) return;
    dispatch(toggleFavoritAction(pokemonId));
  };

  // Vérifie si un Pokémon est en favori chez le dresseur actif
  const isFavorite = (pokemonId: number): boolean => {
    if (!activeTrainerId) return false;
    const trainer = trainers.find(t => t.id === activeTrainerId);
    return trainer ? trainer.favorites.includes(pokemonId) : false;
  };

  return (
    <>
      <div className="navbar-top">
        <div className="navbar-content">
          {/* Logo/Title Pokédex à gauche */}
          <div className="pokedex-title">
            Pokédex
          </div>

          {/* Barre de recherche au centre */}
          <div className="search-bar">
            <div style={{ position: 'relative', width: '100%' }}>
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

          {/* Formulaire trainer à droite OU dresseurs quand il y en a 2 */}
          {trainers.length < 2 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleAddTrainer(); }} className="trainer-form-inline">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom du dresseur"
              />
              <button type="submit">
                Créer {trainers.length + 1}
              </button>
            </form>
          ) : (
            <div className="trainers-navbar">
              <TrainerList
                trainers={trainers}
                activeTrainerId={activeTrainerId}
                onSelectTrainer={(id) => dispatch(setActiveTrainer(id))}
              />
            </div>
          )}
        </div>
      </div>

      <TrainerSection
        trainers={trainers}
        newName={newName}
        activeTrainerId={activeTrainerId}
        onNameChange={setNewName}
        onAddTrainer={handleAddTrainer}
        onSelectTrainer={(id) => dispatch(setActiveTrainer(id))}
      />

      <section className="pokemon-list">
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <>
            {trainers.length > 0 && activeTrainerId && (
              <FavoritesList
                trainer={trainers.find(t => t.id === activeTrainerId) || null}
                pokemons={pokemons}
                onToggleFavorite={toggleFavorite}
              />
            )}
            <div className="grid">
              {displayedPokemons.map((pokemon) => (
                <div
                  key={pokemon.pokedex_id}
                  className="pokemon-card"
                  onClick={() => navigate(`/pokemon/${pokemon.pokedex_id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={pokemon.sprites.regular} alt={pokemon.name.fr} />
                  <h3>{pokemon.name.fr}</h3>
                  {trainers.length > 0 && (
                    <button
                      className={`heart-btn ${isFavorite(pokemon.pokedex_id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(pokemon.pokedex_id);
                      }}
                      aria-label={`${isFavorite(pokemon.pokedex_id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}`}
                      title={`${isFavorite(pokemon.pokedex_id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}`}
                    >
                      {isFavorite(pokemon.pokedex_id) ? '❤️' : '🤍'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}

export default App
