import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

interface Props {
  message?: string;
}

export default function LoadingSpinner({
  message = "Loading...",
}: Props) {
  return (
    <Flex minH="400px" align="center" justify="center">
      <VStack spacing={4}>
        <Spinner
          size="xl"
          color="blue.400"
          thickness="3px"
          speed="0.8s"
        />
        <Text color="gray.400" fontSize="sm">
          {message}
        </Text>
      </VStack>
    </Flex>
  );
}