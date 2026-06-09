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
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { loginAPI } from "../api/auth.api";
import { useAppDispatch } from "../store/hooks";
import { setAuth } from "../store/slices/auth";


const MotionBox = motion(Box);

interface FormErrors {
  email: string;
  password: string;
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = { email: "", password: "" };
    let isValid = true;

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
      const res = await loginAPI({ email, password });
      const accessToken = res.data.token;
      const user = res.data.user;
      dispatch(setAuth({ user, accessToken }));
      console.log(user,accessToken)
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate("/dashboard");
    } catch (error) {
      if(error instanceof Error)
      {
        toast.error(error.message);
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
      {/* Background glow */}
      <Box
        position="absolute"
        top="-200px"
        left="50%"
        transform="translateX(-50%)"
        w="600px"
        h="600px"
        borderRadius="full"
        bg="blue.900"
        opacity={0.15}
        filter="blur(80px)"
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
          boxShadow="0 30px 60px rgba(0,0,0,0.6)"
        >
          <VStack spacing={7} align="stretch">
            {/* Header */}
            <VStack spacing={2} textAlign="center">
              <Text
                fontSize="2xl"
                fontWeight={900}
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                ResumeForge AI
              </Text>
              <Heading size="md" color="white" fontWeight={700}>
                Sign in to your account
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Welcome back — let's optimize your career
              </Text>
            </VStack>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
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
                    bg="gray.800"
                    border="1px solid"
                    borderColor={errors.email ? "red.500" : "gray.600"}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #4299e1",
                      bg: "gray.800",
                    }}
                    _hover={{ borderColor: "gray.500" }}
                    color="white"
                    _placeholder={{ color: "gray.600" }}
                    borderRadius="xl"
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
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError("password");
                      }}
                      bg="gray.800"
                      border="1px solid"
                      borderColor={errors.password ? "red.500" : "gray.600"}
                      _focus={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 1px #4299e1",
                        bg: "gray.800",
                      }}
                      _hover={{ borderColor: "gray.500" }}
                      color="white"
                      _placeholder={{ color: "gray.600" }}
                      borderRadius="xl"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Toggle password visibility"
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
                        _hover={{ color: "gray.300", bg: "transparent" }}
                        onClick={() => setShowPassword(!showPassword)}
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
                  isLoading={loading}
                  loadingText="Signing in..."
                  bgGradient="linear(to-r, blue.500, purple.600)"
                  color="white"
                  borderRadius="xl"
                  _hover={{
                    bgGradient: "linear(to-r, blue.600, purple.700)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 30px rgba(66,153,225,0.35)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                  mt={1}
                  h="52px"
                  fontSize="md"
                >
                  Sign In
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
              >
                NEW HERE?
              </Text>
              <Divider borderColor="gray.700" />
            </HStack>

            <Text textAlign="center" color="gray.400" fontSize="sm">
              Don't have an account?{" "}
              <Text
                as={Link}
                to="/register"
                color="blue.400"
                fontWeight={600}
                _hover={{ color: "blue.300", textDecoration: "underline" }}
              >
                Create one free
              </Text>
            </Text>
          </VStack>
        </Box>
      </MotionBox>
    </Flex>
  );
}