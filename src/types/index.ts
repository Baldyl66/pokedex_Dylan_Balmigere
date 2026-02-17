export interface PokemonType {
  name: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonAbility {
  name: string;
  effect?: string;
  tc?: boolean;
}

export interface PokemonResistance {
  name: string;
  multiplier: number;
}

export interface PokemonEvolution {
  id: number;
  name: string;
  trigger: string;
  level?: number;
}

export interface PokemonStats {
  hp: number;
  atk: number;
  def: number;
  spe_atk: number;
  spe_def: number;
  vit: number;
}

export interface Pokemon {
  pokedex_id: number;
  name: {
    fr: string;
    en: string;
    jp: string;
  };
  sprites: {
    regular: string;
    shiny: string;
  };
  description?: string;
  types?: PokemonType[];
  stats?: PokemonStats | null;
  height?: number;
  weight?: number; 
  abilities?: PokemonAbility[];
  talents?: PokemonAbility[];
  evolutions?: PokemonEvolution[];
  evolution?: { pre?: any[]; next?: any[] };
  resistances?: PokemonResistance[];
}

export interface Trainer {
  id: number;
  name: string;
  favorites: number[];
}
