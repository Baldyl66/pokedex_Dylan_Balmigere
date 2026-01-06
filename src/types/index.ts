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
}

export interface Trainer {
  id: number;
  name: string;
}
