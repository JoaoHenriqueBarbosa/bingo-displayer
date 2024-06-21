import { GeistSans } from "geist/font/sans";
import "./scss/globals.scss";
import "./scss/main.scss";
import Header from "@/components/Header";
import { createContext, useReducer } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "III BINGO CECOM",
  description: "Bingo do CECOM",
};

// Define the layout state type
interface LayoutState {
  layout: string;
}

// Define the action types
type LayoutAction = { type: "SET_LAYOUT"; payload: string };

// Layout reducer
const layoutReducer = (
  state: LayoutState,
  action: LayoutAction
): LayoutState => {
  switch (action.type) {
    case "SET_LAYOUT":
      return { ...state, layout: action.payload };
    default:
      return state;
  }
};

// Initial layout state
const initialState: LayoutState = {
  layout: "main",
};

// Layout context
export const LayoutContext = createContext<{
  state: LayoutState;
  dispatch: React.Dispatch<LayoutAction>;
}>({ state: initialState, dispatch: () => {} }); // Provide a dummy dispatch initially

// Layout provider
export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  return (
    <LayoutContext.Provider value={{ state, dispatch }}>
      {children}
    </LayoutContext.Provider>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <div className="flex-1 flex flex-col gap-12 w-full px-[80px]">
            <Header />
            <main className="flex-1 flex flex-col gap-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
