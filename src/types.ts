export interface Trainer {
  id: number;
  name: string;
  favorites: number[]; // IDs des Pokémons en favoris
}

export interface Pokemon {
	pokedex_id: number;
	name: { fr: string; en: string };
	sprites: { regular: string; shiny?: string };
	types?: { name: string; image?: string }[];
	talents?: { name: string; tc?: boolean }[];
	resistances?: { name: string; multiplier: number }[];
	stats?: { hp: number; atk: number; def: number; spe_atk: number; spe_def: number; vit: number };
	height?: number;
	weight?: number;
	description?: string;
	evolutions?: { id: number; name: string; trigger?: string }[];
	evolution?: { pre?: any[]; next?: any[] };
	moves?: { name: string; type?: string; power?: number; accuracy?: number }[];
}