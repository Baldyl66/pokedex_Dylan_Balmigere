import type { RouteObject } from "react-router-dom";
import App from "../App";
import PokemonDetailedView from "../components/pokedex/PokemonDetailedView";
import NotFound from "../components/NotFound";
import RootLayout from "./RootLayout";

const myRoutes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "pokemon/:pokeId",
        element: <PokemonDetailedView />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default myRoutes;

