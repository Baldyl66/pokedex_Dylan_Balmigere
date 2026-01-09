import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './App.css'
import type { Trainer, Pokemon } from './types'
import { fetchPokemons } from './services/pokemonService'
import TrainerSection from './components/TrainerSection'

function App() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [newName, setNewName] = useState('');
  const [activeTrainerId, setActiveTrainerId] = useState<number | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'fr' | 'en'>(() => {
    const paramLang = searchParams.get('lang');
    return (paramLang === 'en' || paramLang === 'fr') ? paramLang : 'fr';
  });
  const [searchTerm, setSearchTerm] = useState('');

  const translations = {
    fr: {
      loading: 'Chargement...',
      searchPlaceholder: 'Rechercher un Pokémon...'
    },
    en: {
      loading: 'Loading...',
      searchPlaceholder: 'Search a Pokémon...'
    }
  } as const;
  const t = translations[language];

  const displayedPokemons = pokemons.filter(p =>
    p.name[language].toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const data = await fetchPokemons();
        const filteredData = data.filter(pokemon => pokemon.pokedex_id !== 0);
        setPokemons(filteredData);
      } catch (err) {
        console.error('Erreur lors du chargement des Pokémons:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPokemons();
  }, []);

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
      <div className="lang-toggle" role="tablist" aria-label="Choix de la langue">
        <button
          className={language === 'fr' ? 'active' : ''}
          aria-pressed={language === 'fr'}
          onClick={() => setLanguage('fr')}
          title="Français"
        >
          🇫🇷
        </button>
        <button
          className={language === 'en' ? 'active' : ''}
          aria-pressed={language === 'en'}
          onClick={() => setLanguage('en')}
          title="English"
        >
          🇬🇧
        </button>
      </div>

      <div className="search-bar">
        <input
          type="search"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label={t.searchPlaceholder}
        />
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
        {loading ? (
          <p>{t.loading}</p>
        ) : (
          <div className="grid">
            {displayedPokemons.map((pokemon) => (
               <button
                 key={pokemon.pokedex_id}
                 className="pokemon-card"
                 onClick={() => navigate(`/pokemon/${pokemon.pokedex_id}?lang=${language}`)}
                 aria-label={pokemon.name[language]}
               >
                <img src={pokemon.sprites.regular} alt={pokemon.name[language]} />
                <h3>{pokemon.name[language]}</h3>
               </button>
             ))}
          </div>
        )}
      </section>
    </>
  )
}

export default App
