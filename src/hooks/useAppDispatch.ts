import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";

//--- Hook personnalisé avec typage TypeScript pour dispatcher des actions Redux

export const useAppDispatch = () => useDispatch<AppDispatch>();