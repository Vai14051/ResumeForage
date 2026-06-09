import {
  Flex,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  HStack,
  MenuDivider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/auth";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <Flex
      as="nav"
      h="64px"
      px={8}
      align="center"
      justify="space-between"
      bg="gray.900"
      borderBottom="1px solid"
      borderColor="gray.700"
      position="sticky"
      top={0}
      zIndex={100}
      backdropFilter="blur(10px)"
    >
      {/* Logo */}
      <HStack spacing={3} cursor="pointer" onClick={() => navigate("/dashboard")}>
        <Text
          fontSize="xl"
          fontWeight={800}
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
        >
          ResumeForge
        </Text>
        <Badge
          colorScheme="blue"
          fontSize="9px"
          borderRadius="full"
          px={2}
          py={0.5}
        >
          AI
        </Badge>
      </HStack>

      {/* User Menu */}
      <Menu>
        <MenuButton>
          <HStack spacing={2} cursor="pointer">
            <Text fontSize="sm" color="gray.300" display={{ base: "none", md: "block" }}>
              {user?.name}
            </Text>
            <Avatar
              size="sm"
              name={user?.name || "User"}
              bg="blue.500"
              color="white"
              cursor="pointer"
            />
          </HStack>
        </MenuButton>
        <MenuList
          bg="gray.800"
          borderColor="gray.700"
          boxShadow="0 10px 40px rgba(0,0,0,0.4)"
          borderRadius="xl"
          py={2}
        >
          <MenuItem
            bg="gray.800"
            _hover={{ bg: "gray.700" }}
            isDisabled
            borderRadius="lg"
          >
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="sm" color="white" fontWeight={600}>
                {user?.name}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {user?.email}
              </Text>
            </VStack>
          </MenuItem>
          <MenuDivider borderColor="gray.700" />
          <MenuItem
            bg="gray.800"
            _hover={{ bg: "red.900", color: "red.300" }}
            color="red.400"
            borderRadius="lg"
            onClick={handleLogout}
            fontWeight={500}
            fontSize="sm"
          >
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

// Need VStack in Navbar
import { VStack } from "@chakra-ui/react";