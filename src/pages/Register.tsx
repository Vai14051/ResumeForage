import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { registerApi } from "../api/auth.api";


const MotionBox = motion(Box);

interface FormErrors {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    password: "",
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      name: "",
      email: "",
      password: "",
    };
    let isValid = true;

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await registerApi({ name, email, password });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      if(error instanceof Error)
      {
        toast.error(
        error.message ||
          "Registration failed. Try again."
      );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="#0f1117"
      px={4}
      position="relative"
      overflow="hidden"
    >
      {/* Background Glow */}
      <Box
        position="absolute"
        top="-200px"
        left="50%"
        transform="translateX(-50%)"
        w="700px"
        h="700px"
        borderRadius="full"
        bg="purple.900"
        opacity={0.12}
        filter="blur(100px)"
        pointerEvents="none"
      />

      <MotionBox
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w="full"
        maxW="420px"
        position="relative"
        zIndex={1}
      >
        <Box
          bg="gray.900"
          p={8}
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 30px 80px rgba(0,0,0,0.7)"
        >
          <VStack spacing={7} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Text
                fontSize="2xl"
                fontWeight={900}
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
                letterSpacing="tight"
              >
                ResumeForge AI
              </Text>
              <Heading
                size="md"
                color="white"
                fontWeight={700}
              >
                Create your account
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Start optimizing your resume for free
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel
                    color="gray.300"
                    fontSize="sm"
                    fontWeight={500}
                    mb={1.5}
                  >
                    Full Name
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("name");
                    }}
                    size="lg"
                    borderColor={
                      errors.name ? "red.500" : "gray.600"
                    }
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.name}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel
                    color="gray.300"
                    fontSize="sm"
                    fontWeight={500}
                    mb={1.5}
                  >
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                    }}
                    size="lg"
                    borderColor={
                      errors.email ? "red.500" : "gray.600"
                    }
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.email}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel
                    color="gray.300"
                    fontSize="sm"
                    fontWeight={500}
                    mb={1.5}
                  >
                    Password
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError("password");
                      }}
                      borderColor={
                        errors.password ? "red.500" : "gray.600"
                      }
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Toggle password"
                        icon={
                          showPassword ? (
                            <MdVisibilityOff />
                          ) : (
                            <MdVisibility />
                          )
                        }
                        variant="ghost"
                        size="sm"
                        color="gray.500"
                        _hover={{
                          color: "gray.300",
                          bg: "transparent",
                        }}
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">
                    {errors.password}
                  </FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  h="52px"
                  isLoading={loading}
                  loadingText="Creating account..."
                  bgGradient="linear(to-r, blue.500, purple.600)"
                  color="white"
                  borderRadius="xl"
                  fontSize="md"
                  _hover={{
                    bgGradient:
                      "linear(to-r, blue.600, purple.700)",
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 12px 30px rgba(66,153,225,0.35)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  mt={1}
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            <HStack spacing={3}>
              <Divider borderColor="gray.700" />
              <Text
                color="gray.600"
                fontSize="xs"
                whiteSpace="nowrap"
                flexShrink={0}
                letterSpacing="wider"
              >
                HAVE AN ACCOUNT?
              </Text>
              <Divider borderColor="gray.700" />
            </HStack>

            <Text
              textAlign="center"
              color="gray.400"
              fontSize="sm"
            >
              Already registered?{" "}
              <Text
                as={Link}
                to="/login"
                color="blue.400"
                fontWeight={600}
                _hover={{
                  color: "blue.300",
                  textDecoration: "underline",
                }}
              >
                Sign in here
              </Text>
            </Text>
          </VStack>
        </Box>
      </MotionBox>
    </Flex>
  );
}