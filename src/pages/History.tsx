import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  SimpleGrid,
  Divider,
  Skeleton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdHistory, MdLightbulb } from "react-icons/md";
import { getATSHistoryAPI } from "../api/ats.api";
import { useAppSelector } from "../store/hooks";
import AppLayout from "../components/layout/AppLayout";
import toast from "react-hot-toast";
import type { ATSHistory } from "../types/types";

const MotionBox = motion(Box);

const getScoreColor = (score: number) => {
  if (score >= 70) return "green";
  if (score >= 50) return "yellow";
  return "red";
};

export default function History() {
  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [history, setHistory] = useState<ATSHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await getATSHistoryAPI();
        setHistory(res.data.data);
      } catch {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isAuthenticated]);

  return (
    <AppLayout>
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HStack justify="space-between">
            <Box>
              <Heading size="lg" color="white" fontWeight={800}>
                Analysis History
              </Heading>
              <Text color="gray.500" mt={1} fontSize="sm">
                All your past ATS analyses and results
              </Text>
            </Box>
            {history.length > 0 && (
              <Badge
                colorScheme="blue"
                borderRadius="full"
                px={4}
                py={1.5}
                fontSize="sm"
                fontWeight={700}
              >
                {history.length} total
              </Badge>
            )}
          </HStack>
        </MotionBox>

        {loading ? (
          <VStack spacing={4}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                h="220px"
                borderRadius="2xl"
              />
            ))}
          </VStack>
        ) : !history.length ? (
          <Flex
            minH="400px"
            bg="gray.900"
            borderRadius="2xl"
            border="1px dashed"
            borderColor="gray.700"
            align="center"
            justify="center"
            direction="column"
            gap={4}
          >
            <Icon
              as={MdHistory}
              boxSize={16}
              color="gray.700"
            />
            <VStack spacing={1} textAlign="center">
              <Text
                color="gray.400"
                fontWeight={600}
                fontSize="md"
              >
                No analyses yet
              </Text>
              <Text color="gray.600" fontSize="sm">
                Go to Analyze page to get your first ATS score
              </Text>
            </VStack>
          </Flex>
        ) : (
          <VStack spacing={4}>
            {history.map((item, i) => {
              const color = getScoreColor(item.score);
              return (
                <MotionBox
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                  w="full"
                >
                  <Box
                    bg="gray.900"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="gray.700"
                    overflow="hidden"
                    _hover={{ borderColor: "gray.600" }}
                    transition="all 0.2s"
                  >
                    {/* Header Row */}
                    <Flex p={6} align="center" justify="space-between">
                      <VStack align="flex-start" spacing={1.5}>
                        <Text
                          fontWeight={800}
                          color="white"
                          fontSize="md"
                        >
                          {item.resume?.title}
                        </Text>
                        <HStack spacing={2}>
                          {item.jobDescription
                            ?.companyName && (
                            <Badge
                              colorScheme="blue"
                              fontSize="10px"
                              borderRadius="full"
                              px={2}
                            >
                              {item.jobDescription.companyName}
                            </Badge>
                          )}
                          <Text
                            color="gray.400"
                            fontSize="sm"
                          >
                            {item.jobDescription?.title}
                          </Text>
                        </HStack>
                        <Text color="gray.600" fontSize="xs">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Text>
                      </VStack>

                      <Flex
                        w={20}
                        h={20}
                        borderRadius="full"
                        bg={`${color}.900`}
                        border="3px solid"
                        borderColor={`${color}.500`}
                        align="center"
                        justify="center"
                        direction="column"
                        flexShrink={0}
                      >
                        <Text
                          fontSize="2xl"
                          fontWeight={900}
                          color={`${color}.400`}
                          lineHeight={1}
                        >
                          {item.score}
                        </Text>
                        <Text
                          fontSize="8px"
                          color="gray.500"
                          fontWeight={700}
                          letterSpacing="wider"
                        >
                          ATS
                        </Text>
                      </Flex>
                    </Flex>

                    <Divider borderColor="gray.800" />

                    {/* Score Breakdown */}
                    <SimpleGrid
                      columns={5}
                      px={6}
                      py={4}
                      gap={2}
                    >
                      {[
                        {
                          label: "Skills",
                          value: item.skillScore,
                          color: "blue",
                        },
                        {
                          label: "Keywords",
                          value: item.keywordScore,
                          color: "purple",
                        },
                        {
                          label: "Experience",
                          value: item.experienceScore,
                          color: "green",
                        },
                        {
                          label: "Education",
                          value: item.educationScore,
                          color: "yellow",
                        },
                        {
                          label: "Formatting",
                          value: item.formattingScore,
                          color: "orange",
                        },
                      ].map((s) => (
                        <VStack
                          key={s.label}
                          spacing={0.5}
                          textAlign="center"
                        >
                          <Text
                            fontSize="9px"
                            color="gray.500"
                            textTransform="uppercase"
                            letterSpacing="wider"
                            fontWeight={600}
                          >
                            {s.label}
                          </Text>
                          <Text
                            fontSize="lg"
                            fontWeight={800}
                            color={`${s.color}.400`}
                          >
                            {s.value}
                          </Text>
                        </VStack>
                      ))}
                    </SimpleGrid>

                    <Divider borderColor="gray.800" />

                    {/* Skills + Tip */}
                    <Box px={6} py={4}>
                      <HStack spacing={6} align="flex-start">
                        <Box flex={1}>
                          <Text
                            fontSize="9px"
                            color="green.500"
                            fontWeight={700}
                            textTransform="uppercase"
                            letterSpacing="wider"
                            mb={2}
                          >
                            Matched Skills
                          </Text>
                          <HStack flexWrap="wrap" spacing={1}>
                            {(
                              item.matchedSkills as string[]
                            )
                              ?.slice(0, 4)
                              .map((s) => (
                                <Badge
                                  key={s}
                                  colorScheme="green"
                                  fontSize="9px"
                                  borderRadius="full"
                                  px={2}
                                >
                                  {s}
                                </Badge>
                              ))}
                            {(item.matchedSkills as string[])
                              ?.length > 4 && (
                              <Badge
                                colorScheme="gray"
                                fontSize="9px"
                                borderRadius="full"
                              >
                                +
                                {(
                                  item.matchedSkills as string[]
                                ).length - 4}{" "}
                                more
                              </Badge>
                            )}
                          </HStack>
                        </Box>

                        <Box flex={1}>
                          <Text
                            fontSize="9px"
                            color="red.500"
                            fontWeight={700}
                            textTransform="uppercase"
                            letterSpacing="wider"
                            mb={2}
                          >
                            Missing Skills
                          </Text>
                          <HStack flexWrap="wrap" spacing={1}>
                            {(
                              item.missingSkills as string[]
                            )
                              ?.slice(0, 4)
                              .map((s) => (
                                <Badge
                                  key={s}
                                  colorScheme="red"
                                  fontSize="9px"
                                  borderRadius="full"
                                  px={2}
                                >
                                  {s}
                                </Badge>
                              ))}
                            {(item.missingSkills as string[])
                              ?.length > 4 && (
                              <Badge
                                colorScheme="gray"
                                fontSize="9px"
                                borderRadius="full"
                              >
                                +
                                {(
                                  item.missingSkills as string[]
                                ).length - 4}{" "}
                                more
                              </Badge>
                            )}
                          </HStack>
                        </Box>

                        <Box flex={1}>
                          <Text
                            fontSize="9px"
                            color="yellow.500"
                            fontWeight={700}
                            textTransform="uppercase"
                            letterSpacing="wider"
                            mb={2}
                          >
                            Top Tip
                          </Text>
                          <HStack align="flex-start" spacing={1.5}>
                            <Icon
                              as={MdLightbulb}
                              color="yellow.400"
                              flexShrink={0}
                              mt={0.5}
                              boxSize={3.5}
                            />
                            <Text
                              fontSize="xs"
                              color="gray.400"
                              lineHeight={1.5}
                            >
                              {
                                (
                                  item.recommendations as string[]
                                )?.[0]
                              }
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>
                  </Box>
                </MotionBox>
              );
            })}
          </VStack>
        )}
      </VStack>
    </AppLayout>
  );
}