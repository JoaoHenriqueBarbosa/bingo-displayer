"use client";

import React, { createContext, useReducer, Dispatch } from 'react';

// Define o estado inicial
interface LayoutState {
  layout: string;
}

// Define os tipos de ação que podem ser despachados
type LayoutAction = { type: "SET_LAYOUT"; payload: string };

// Reducer para gerenciar as ações de layout
const layoutReducer = (state: LayoutState, action: LayoutAction): LayoutState => {
  switch (action.type) {
    case "SET_LAYOUT":
      return { ...state, layout: action.payload };
    default:
      return state;
  }
};

// Estado inicial para layout
const initialState: LayoutState = {
  layout: "main",
};

// Criando o contexto do layout
type ContextType = {
  state: LayoutState;
  dispatch: Dispatch<LayoutAction>;
};

export const LayoutContext = createContext<ContextType>({
    state: initialState,
    dispatch: () => {},
});

// Provedor do contexto de layout
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  const contextValue: ContextType = {
    state,
    dispatch,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};
