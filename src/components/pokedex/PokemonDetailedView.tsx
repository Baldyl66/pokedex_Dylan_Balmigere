import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Pokemon } from "../../types";
import { fetchPokemons } from "../../services/pokemonService";
import "../../App.css";

export default function PokemonDetailedView() {
  const { pokeId } = useParams<{ pokeId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShiny, setShowShiny] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>(() => {
    const paramLang = searchParams.get('lang');
    return (paramLang === 'en' || paramLang === 'fr') ? paramLang : 'fr';
  });

  const translations = {
    fr: { 
      hp: 'PV', atk: 'Attaque', def: 'Défense', spe_atk: 'Att. Spé', spe_def: 'Déf. Spé', vit: 'Vitesse', 
      evolution: 'Évolution', shiny: 'Shiny', normal: 'Normal',
      types: 'Types', talents: 'Talents', resistances: 'Résistances'
    },
    en: { 
      hp: 'HP', atk: 'Attack', def: 'Defense', spe_atk: 'Sp. Atk', spe_def: 'Sp. Def', vit: 'Speed', 
      evolution: 'Evolution', shiny: 'Shiny', normal: 'Normal',
      types: 'Types', talents: 'Abilities', resistances: 'Resistances'
    }
  };
  const t = translations[language];

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        const data = await fetchPokemons();
        setAllPokemons(data);
        const found = data.find(p => p.pokedex_id === parseInt(pokeId || '0'));
        setPokemon(found || null);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPokemon();
  }, [pokeId]);

  const getSpriteById = (id?: number) => {
    if (!id) return undefined;
    const found = allPokemons.find((x) => x.pokedex_id === id);
    return found?.sprites?.regular;
  };

  const getNameById = (id?: number) => {
    if (!id) return undefined;
    const found = allPokemons.find((x) => x.pokedex_id === id);
    return found ? found.name[language] : undefined;
  };

  const getEvolutionChain = (p: Pokemon) => {
    const chain: { pokedex_id?: number; name?: string }[] = [];
    const evoObj: any = (p as any).evolution ?? (p as any).evolutions ?? null;
    
    if (!evoObj) return chain;
    
    if (Array.isArray(evoObj)) {
      return evoObj.map((e: any) => ({ pokedex_id: e.pokedex_id }));
    }
    
    if (evoObj.pre && Array.isArray(evoObj.pre)) {
      evoObj.pre.forEach((e: any) => chain.push({ pokedex_id: e.pokedex_id }));
    }
    
    chain.push({ pokedex_id: p.pokedex_id });
    
    if (evoObj.next && Array.isArray(evoObj.next)) {
      evoObj.next.forEach((e: any) => chain.push({ pokedex_id: e.pokedex_id }));
    }
    
    return chain;
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</p>;
  if (!pokemon) return <p style={{ textAlign: 'center', padding: '2rem' }}>Pokémon non trouvé</p>;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
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

      <button onClick={() => navigate(`/?lang=${language}`)} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        ← Retour
      </button>
      
      <section className="selected-pokemon detailed-view">
        <h2>{pokemon.name[language]} (#{pokemon.pokedex_id})</h2>
        <img
          src={showShiny && pokemon.sprites.shiny ? pokemon.sprites.shiny : pokemon.sprites.regular}
          alt={pokemon.name[language]}
        />
        {pokemon.sprites.shiny && (
          <button className="shiny-toggle" onClick={() => setShowShiny(s => !s)} aria-pressed={showShiny}>
            {showShiny ? t.normal : t.shiny}
          </button>
        )}

        {/* Types */}
        {pokemon.types && pokemon.types.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{t.types}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {pokemon.types.map((type: any) => (
                <div key={type.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f4f4f6', padding: '0.5rem 0.8rem', borderRadius: '8px' }}>
                  {type.image && <img src={type.image} alt={type.name} style={{ width: '20px', height: '20px' }} />}
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Talents */}
        {pokemon.talents && pokemon.talents.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{t.talents}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {pokemon.talents.map((talent: any) => (
                <li key={talent.name} style={{ background: '#f4f4f6', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                  {talent.name} {talent.tc && <span style={{ color: '#ff6b6b' }}>*</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="stats">
          {pokemon.stats ? (
            <ul>
              <li><strong>{t.hp}:</strong> {pokemon.stats.hp}</li>
              <li><strong>{t.atk}:</strong> {pokemon.stats.atk}</li>
              <li><strong>{t.def}:</strong> {pokemon.stats.def}</li>
              <li><strong>{t.spe_atk}:</strong> {pokemon.stats.spe_atk}</li>
              <li><strong>{t.spe_def}:</strong> {pokemon.stats.spe_def}</li>
              <li><strong>{t.vit}:</strong> {pokemon.stats.vit}</li>
            </ul>
          ) : (
            <p>Stats non disponibles</p>
          )}
        </div>

        {/* Résistances */}
        {pokemon.resistances && pokemon.resistances.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{t.resistances}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', maxWidth: '600px', margin: '0 auto' }}>
              {pokemon.resistances
                .sort((a: any, b: any) => a.multiplier - b.multiplier)
                .map((res: any) => {
                const colors: { [key: number]: string } = {
                  0.25: '#4caf50',
                  0.5: '#81c784',
                  1: '#9e9e9e',
                  2: '#ff9800',
                  4: '#f44336'
                };
                const color = colors[res.multiplier] || '#9e9e9e';
                return (
                  <div key={res.name} style={{ background: color, color: '#fff', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>
                    <div>{res.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>×{res.multiplier}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(() => {
          const chain = getEvolutionChain(pokemon);
          if (!chain || chain.length === 0) return null;
          return (
            <div className="evolution">
              <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem', fontWeight: '700', color: '#111' }}>{t.evolution}</h4>
              <div className="evolution-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap', padding: '1rem 0.5rem' }}>
                {chain.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                      {step.pokedex_id ? (
                        <img 
                          src={getSpriteById(step.pokedex_id) ?? pokemon.sprites.regular} 
                          alt={String(getNameById(step.pokedex_id) ?? pokemon.name[language])}
                          style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#f9f9f9', borderRadius: '8px', padding: '8px', border: '2px solid #e6e6e9' }}
                        />
                      ) : (
                        <div style={{ width: '80px', height: '80px', background: '#f0f0f0', borderRadius: '8px', border: '2px dashed #ccc' }} />
                      )}
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111', textAlign: 'center', minWidth: '100px' }}>
                        {getNameById(step.pokedex_id) ?? pokemon.name[language]}
                      </div>
                      {step.pokedex_id && (
                        <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: '600' }}>
                          #{step.pokedex_id}
                        </div>
                      )}
                    </div>
                    {idx < chain.length - 1 && (
                      <div style={{ fontSize: '1.8rem', color: '#bdbdf0', fontWeight: '700', marginBottom: '1.5rem' }}>
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
}
