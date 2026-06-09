import { Flex, Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <Flex direction="column" minH="100vh" bg="gray.950">
      <Navbar />
      <Flex flex={1}>
        <Sidebar />
        <Box
          flex={1}
          p={8}
          overflowY="auto"
          maxH="calc(100vh - 64px)"
          bg="#0f1117"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

