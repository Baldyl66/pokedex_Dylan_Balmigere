import { useState, useEffect } from 'react'
import './App.css'
import type { Trainer, Pokemon } from './types'
import { fetchPokemons } from './services/pokemonService'
import TrainerSection from './components/TrainerSection'
import PokemonList from './components/PokemonList'

function App() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [newName, setNewName] = useState('');
  const [activeTrainerId, setActiveTrainerId] = useState<number | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const data = await fetchPokemons();
        setPokemons(data);
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
      <TrainerSection
        trainers={trainers}
        newName={newName}
        activeTrainerId={activeTrainerId}
        onNameChange={setNewName}
        onAddTrainer={addTrainer}
        onSelectTrainer={setActiveTrainerId}
      />
      <PokemonList pokemons={pokemons} loading={loading} />
    </>
  )
}

export default App
