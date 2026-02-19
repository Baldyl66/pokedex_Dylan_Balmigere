import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Pokemon } from "../../types";
import { useGetPokemonQuery } from "../../store/slices/pokemonApi";
import "./PokemonDetailedView.css";

export default function PokemonDetailedView() {
  const { pokeId } = useParams<{ pokeId: string }>();
  const navigate = useNavigate();
  const { data: allPokemons = [], isLoading } = useGetPokemonQuery();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [showShiny, setShowShiny] = useState(false);

  const translations: Record<string, string> = {
    hp: 'PV',
    atk: 'Attaque',
    def: 'Défense',
    spe_atk: 'Att. Spé',
    spe_def: 'Déf. Spé',
    vit: 'Vitesse'
  };

  const getTypeColor = (typeName: string): string => {
    const map: Record<string, string> = {
      normal: '#A8A868',
      fire: '#FF6B35',
      water: '#6890F0',
      electric: '#FFD700',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#FF2E5E',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
      eau: '#6890F0',
      feu: '#FF6B35',
      plante: '#78C850',
      électrik: '#FFD700',
      combat: '#FF2E5E',
      sol: '#E0C068',
      vol: '#A890F0',
      psy: '#F85888',
      insecte: '#A8B820',
      roche: '#B8A038',
      spectre: '#705898',
      tenebre: '#705848',
      acier: '#B8B8D0',
      fée: '#EE99AC'
    };
    return map[(typeName || '').toLowerCase()] || '#9e9e9e';
  };

  // Première charge seulement
  useEffect(() => {
    if (allPokemons.length === 0) return;

    const pokeIdNum = parseInt(pokeId || '0');
    const found = allPokemons.find(p => p.pokedex_id === pokeIdNum);
    
    if (found) {
      console.log('Pokemon trouvé:', found);
      console.log('Evolution data:', found.evolution);
    }
    
    setPokemon(found || null);
  }, [pokeId, allPokemons]);

  if (isLoading || !pokemon) {
    return (
      <div className="pokemon-detailed-page">
        <h2 style={{ fontSize: '2rem', textShadow: '0 0 20px rgba(255, 46, 94, 0.8)' }}>
          SYSTÈME EN DÉMARRAGE...
        </h2>
      </div>
    );
  }

  // Construire la chaîne complète d'évolutions (pré-évolutions + actuel + post-évolutions)
  const getEvolutions = () => {
    const evos: Pokemon[] = [];
    
    // Chercher les pré-évolutions
    if (pokemon.evolution?.pre && Array.isArray(pokemon.evolution.pre)) {
      pokemon.evolution.pre.forEach((evoId: any) => {
        const id = typeof evoId === 'object' ? evoId.pokedex_id || evoId.id : evoId;
        const preEvo = allPokemons.find(p => p.pokedex_id === id);
        if (preEvo) evos.push(preEvo);
      });
    }
    
    // Ajouter le pokémon actuel au milieu
    evos.push(pokemon);
    
    // Chercher les post-évolutions
    if (pokemon.evolution?.next && Array.isArray(pokemon.evolution.next)) {
      pokemon.evolution.next.forEach((evoId: any) => {
        const id = typeof evoId === 'object' ? evoId.pokedex_id || evoId.id : evoId;
        const postEvo = allPokemons.find(p => p.pokedex_id === id);
        if (postEvo) evos.push(postEvo);
      });
    }

    console.log('Evolutions trouvées:', evos);
    
    // Retourner seulement si plus d'un pokémon dans la chaîne
    return evos.length > 1 ? evos : null;
  };

  const evolutions = getEvolutions();
  const mainColor = getTypeColor(pokemon.types?.[0]?.name || 'normal');

  return (
    <div 
      className="pokemon-detailed-page"
      style={{
        '--main-color': mainColor,
        '--main-color-light': mainColor + '33',
        '--main-color-dark': mainColor + 'cc'
      } as React.CSSProperties}
    >
      <div className="modern-card">
        {/* SECTION GAUCHE - LE SCREEN */}
        <div className="hero-image-container">
          <div className="pokemon-id-bg">#{String(pokemon.pokedex_id).padStart(3, '0')}</div>

          <img
            src={showShiny && pokemon.sprites.shiny ? pokemon.sprites.shiny : pokemon.sprites.regular}
            className="main-sprite"
            alt={pokemon.name.fr}
            key={`${pokemon.pokedex_id}-${showShiny}`}
          />

          <div className="nav-buttons-container">
            <button
              className="nav-console-btn"
              onClick={() => navigate(`/pokemon/${Math.max(1, pokemon.pokedex_id - 1)}`)}
              disabled={pokemon.pokedex_id <= 1}
            >
              ◀
            </button>
            <button
              className="nav-console-btn"
              onClick={() => navigate(`/pokemon/${pokemon.pokedex_id + 1}`)}
            >
              ▶
            </button>
          </div>
        </div>

        {/* SECTION DROITE - DONNÉES */}
        <div className="data-content">
          {/* TITRE ET ID */}
          <div className="pokemon-header">
            <h1>{pokemon.name.fr}</h1>
            <p>LV.{pokemon.pokedex_id}</p>
          </div>

          {/* TYPES */}
          {pokemon.types && pokemon.types.length > 0 && (
            <div className="types-container">
              {pokemon.types.map(t => (
                <span
                  key={t.name}
                  className="type-badge"
                  style={{
                    backgroundColor: getTypeColor(t.name),
                    borderColor: getTypeColor(t.name),
                    boxShadow: `0 0 15px ${getTypeColor(t.name)}99`
                  }}
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}

          {/* TAILLE ET POIDS */}
          <div className="measurements-grid">
            <div className="measurement-item">
              <h4>Taille</h4>
              <p>{pokemon.height ? `${pokemon.height}m` : 'N/A'}</p>
            </div>
            <div className="measurement-item">
              <h4>Poids</h4>
              <p>{pokemon.weight ? `${pokemon.weight}kg` : 'N/A'}</p>
            </div>
          </div>

          {/* STATS */}
          {pokemon.stats && (
            <div className="stats-section">
              <h3>STATISTIQUES</h3>
              {Object.entries(pokemon.stats).map(([key, val]: any) => {
                let statColor = '#FFD700';
                if (key === 'hp') statColor = '#FF2E5E';
                else if (key === 'atk') statColor = '#FF6B35';
                else if (key === 'def') statColor = '#FF9500';
                else if (key === 'spe_atk') statColor = '#00D9FF';
                else if (key === 'spe_def') statColor = '#D946EF';
                else if (key === 'vit') statColor = '#FFD700';

                return (
                  <div key={key} className="stat-item">
                    <div className="stat-label-row">
                      <span className="stat-name">{translations[key] || key}</span>
                      <span className="stat-value">{val}</span>
                    </div>
                    <div className="stat-bar-bg">
                      <div
                        className="stat-bar-fill"
                        style={{
                          width: `${(val / 180) * 100}%`,
                          background: `linear-gradient(90deg, ${statColor}, ${statColor}99)`,
                          color: statColor
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ATTAQUES */}
          {pokemon.talents && pokemon.talents.length > 0 && (
            <div className="moves-section">
              <h3>TALENTS</h3>
              <div className="moves-grid">
                {pokemon.talents.map((talent, idx) => (
                  <div key={idx} className="move-item">
                    <p className="move-name">{talent.name}</p>
                    {talent.tc && (
                      <span className="talent-hidden">Caché</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ÉVOLUTIONS */}
          {evolutions && (
            <div className="evolution-section">
              <h3>ÉVOLUTIONS</h3>
              <div className="evolution-chain">
                {evolutions.map((evo, idx) => (
                  <div key={evo.pokedex_id}>
                    <div 
                      className="evolution-item"
                      onClick={() => navigate(`/pokemon/${evo.pokedex_id}`)}
                      style={{ 
                        border: evo.pokedex_id === pokemon.pokedex_id 
                          ? '2px solid #00D9FF' 
                          : '2px solid rgba(255, 46, 94, 0.3)'
                      }}
                    >
                      <img 
                        src={evo.sprites.regular} 
                        alt={evo.name.fr}
                      />
                      <p>{evo.name.fr}</p>
                    </div>
                    {idx < evolutions.length - 1 && <span className="evolution-arrow">→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOUTONS */}
          <div className="button-group">
            <button className="shiny-button" onClick={() => setShowShiny(!showShiny)}>
              {showShiny ? '✓ NORMAL' : '✨ SHINY'}
            </button>
            <button className="back-button" onClick={() => navigate('/')}>
              ← RETOUR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}