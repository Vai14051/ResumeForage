import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "#0f1117",
        color: "gray.100",
      },
      "*": {
        borderColor: "gray.700",
      },
    },
  },
  colors: {
    brand: {
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "xl",
        fontWeight: 600,
        transition: "all 0.2s",
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: "gray.800",
            borderRadius: "xl",
            border: "1px solid",
            borderColor: "gray.600",
            color: "white",
            _placeholder: { color: "gray.600" },
            _hover: { borderColor: "gray.500", bg: "gray.800" },
            _focus: {
              bg: "gray.800",
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px #4299e1",
            },
          },
        },
      },
      defaultProps: { variant: "filled" },
    },
    Textarea: {
      variants: {
        filled: {
          bg: "gray.800",
          borderRadius: "xl",
          border: "1px solid",
          borderColor: "gray.600",
          color: "white",
          _placeholder: { color: "gray.600" },
          _hover: { borderColor: "gray.500", bg: "gray.800" },
          _focus: {
            bg: "gray.800",
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px #4299e1",
          },
        },
      },
      defaultProps: { variant: "filled" },
    },
  },
});

export default theme;