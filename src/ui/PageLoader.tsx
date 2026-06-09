import { Flex, Spinner, Text} from "@chakra-ui/react";

export default function PageLoader() {
  return (
    <Flex
      position="fixed"
      inset={0}
      bg="blackAlpha.800"
      align="center"
      justify="center"
      zIndex={9999}
      backdropFilter="blur(6px)"
      direction="column"
      gap={4}
    >
      <Spinner
        size="xl"
        color="blue.400"
        thickness="3px"
        speed="0.8s"
      />
      <Text color="gray.300" fontSize="sm" fontWeight={500}>
        Please wait...
      </Text>
    </Flex>
  );
}