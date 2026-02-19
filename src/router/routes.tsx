import type { RouteObject } from "react-router-dom";
import App from "../App";
import PokemonDetailedView from "../components/PokemonDetailed/PokemonDetailedView";
import NotFound from "../components/404/NotFound";
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

