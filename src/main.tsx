import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import App from "./App";
import theme from "./theme";
import { store } from "./store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript
            initialColorMode={theme.config.initialColorMode}
          />
          <QueryClientProvider client={queryClient}>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#1a202c",
                  color: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #2d3748",
                  fontSize: "14px",
                },
                success: {
                  iconTheme: {
                    primary: "#48bb78",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#fc8181",
                    secondary: "#fff",
                  },
                },
              }}
            />
            <App />
          </QueryClientProvider>
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);