import { useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../store/store";

// Hook personnalisé avec typage TypeScript pour accéder à l'état Redux
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;