import { Flex, VStack, Text, Icon, Box } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdUploadFile,
  MdWork,
  MdAutoAwesome,
  MdHistory,
} from "react-icons/md";

const navItems = [
  { label: "Dashboard", icon: MdDashboard, path: "/dashboard" },
  { label: "Upload Resume", icon: MdUploadFile, path: "/upload" },
  { label: "Analyze", icon: MdWork, path: "/analyze" },
  { label: "Optimize", icon: MdAutoAwesome, path: "/optimize" },
  { label: "History", icon: MdHistory, path: "/history" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Flex
      as="aside"
      w="220px"
      minH="calc(100vh - 64px)"
      bg="gray.900"
      borderRight="1px solid"
      borderColor="gray.700"
      direction="column"
      py={6}
      px={3}
      position="sticky"
      top="64px"
      h="calc(100vh - 64px)"
    >
      <VStack spacing={1} align="stretch">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Flex
              key={item.path}
              align="center"
              gap={3}
              px={4}
              py={3}
              borderRadius="xl"
              cursor="pointer"
              bg={isActive ? "blue.600" : "transparent"}
              color={isActive ? "white" : "gray.400"}
              _hover={{
                bg: isActive ? "blue.600" : "gray.800",
                color: "white",
                transform: "translateX(3px)",
              }}
              transition="all 0.2s ease"
              onClick={() => navigate(item.path)}
              role="button"
            >
              <Icon
                as={item.icon}
                boxSize={5}
                color={isActive ? "white" : "gray.400"}
              />
              <Text
                fontSize="sm"
                fontWeight={isActive ? 600 : 400}
                letterSpacing={isActive ? "wide" : "normal"}
              >
                {item.label}
              </Text>
              {isActive && (
                <Box
                  ml="auto"
                  w={1.5}
                  h={1.5}
                  borderRadius="full"
                  bg="white"
                />
              )}
            </Flex>
          );
        })}
      </VStack>

      {/* Bottom tag */}
      <Box mt="auto" px={4} py={3}>
        <Text fontSize="10px" color="gray.600" textAlign="center">
          ResumeForge AI v1.0
        </Text>
      </Box>
    </Flex>
  );
}