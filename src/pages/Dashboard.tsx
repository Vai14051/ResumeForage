import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Skeleton,
  SkeletonText,
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdUploadFile,
  MdWork,
  MdAutoAwesome,
  MdHistory,
  MdTrendingUp,
  MdArrowForward,
} from "react-icons/md";
import toast from "react-hot-toast";
import { getResumesAPI } from "../api/resume.api";
import { getJDsAPI } from "../api/jd.api";
import { getATSHistoryAPI } from "../api/ats.api";
import { useAppSelector } from "../store/hooks";
import AppLayout from "../components/layout/AppLayout";
import type { ActionCardProps, ATSHistory, JobDescription, Resume, StatCardProps } from "../types/types";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);



const StatCard = ({
  label,
  value,
  icon,
  color,
  loading,
}: StatCardProps) => (
  <MotionBox whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
    <Box
      bg="gray.900"
      p={6}
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.700"
      _hover={{ borderColor: `${color}.700` }}
      transition="all 0.3s"
    >
      <Flex justify="space-between" align="flex-start">
        <Stat>
          <StatLabel
            color="gray.500"
            fontSize="xs"
            fontWeight={600}
            letterSpacing="wider"
            textTransform="uppercase"
          >
            {label}
          </StatLabel>
          {loading ? (
            <Skeleton h="40px" w="70px" mt={2} borderRadius="lg" />
          ) : (
            <StatNumber
              fontSize="3xl"
              fontWeight={900}
              color="white"
              mt={1}
              bgGradient={`linear(to-r, ${color}.300, ${color}.500)`}
              bgClip="text"
            >
              {value}
            </StatNumber>
          )}
        </Stat>
        <Flex
          w={12}
          h={12}
          bg={`${color}.900`}
          borderRadius="xl"
          align="center"
          justify="center"
          border="1px solid"
          borderColor={`${color}.800`}
        >
          <Icon as={icon} boxSize={5} color={`${color}.400`} />
        </Flex>
      </Flex>
    </Box>
  </MotionBox>
);

const ActionCard = ({
  title,
  description,
  icon,
  color,
  onClick,
}: ActionCardProps) => (
  <MotionBox whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
    <Box
      bg="gray.900"
      p={6}
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.700"
      cursor="pointer"
      onClick={onClick}
      _hover={{ borderColor: `${color}.600` }}
      transition="all 0.3s"
    >
      <VStack align="flex-start" spacing={4}>
        <Flex
          w={12}
          h={12}
          bg={`${color}.900`}
          borderRadius="xl"
          align="center"
          justify="center"
          border="1px solid"
          borderColor={`${color}.800`}
        >
          <Icon as={icon} boxSize={6} color={`${color}.400`} />
        </Flex>
        <VStack align="flex-start" spacing={1}>
          <Text fontWeight={700} color="white" fontSize="md">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500" lineHeight={1.5}>
            {description}
          </Text>
        </VStack>
        <HStack color={`${color}.400`} fontSize="sm" fontWeight={600}>
          <Text>Get started</Text>
          <Icon as={MdArrowForward} boxSize={4} />
        </HStack>
      </VStack>
    </Box>
  </MotionBox>
);

const getScoreColor = (score: number) => {
  if (score >= 70) return "green";
  if (score >= 50) return "yellow";
  return "red";
};

export default function Dashboard() {
  const { user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [history, setHistory] = useState<ATSHistory[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [jdsLoading, setJdsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchResumes = async () => {
      setResumesLoading(true);
      try {
        const res = await getResumesAPI();
    
        setResumes(res.data.data);
      } catch {
        toast.error("Failed to load resumes");
      } finally {
        setResumesLoading(false);
      }
    };

    const fetchJDs = async () => {
      setJdsLoading(true);
      try {
        const res = await getJDsAPI();
        setJds(res.data.data);
      } catch {
        toast.error("Failed to load job descriptions");
      } finally {
        setJdsLoading(false);
      }
    };

    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await getATSHistoryAPI();
        setHistory(res.data.data);
      } catch {
        toast.error("Failed to load history");
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchResumes();
    fetchJDs();
    fetchHistory();
  }, [isAuthenticated]);

  const avgScore = history.length
    ? Math.round(
        history.reduce(
          (sum: number, r) => sum + r.score,
          0
        ) / history.length
      )
    : 0;

  return (
    <AppLayout>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Heading size="lg" color="white" fontWeight={800}>
            Hey, {user?.name?.split(" ")[0]} 👋
          </Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            Here's your resume optimization overview
          </Text>
        </MotionBox>

        {/* Stats */}
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          {[
            {
              label: "Resumes",
              value: resumes.length,
              icon: MdUploadFile,
              color: "blue",
              loading: resumesLoading,
            },
            {
              label: "Job Descriptions",
              value: jds.length,
              icon: MdWork,
              color: "purple",
              loading: jdsLoading,
            },
            {
              label: "Analyses Done",
              value: history.length,
              icon: MdHistory,
              color: "green",
              loading: historyLoading,
            },
            {
              label: "Avg ATS Score",
              value: avgScore,
              icon: MdTrendingUp,
              color: "orange",
              loading: historyLoading,
            },
          ].map((stat, i) => (
            <MotionBox
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <StatCard {...stat} />
            </MotionBox>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Box>
          <Text
            fontWeight={700}
            color="gray.400"
            mb={4}
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="widest"
          >
            Quick Actions
          </Text>
          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            {[
              {
                title: "Upload Resume",
                description: "Add a PDF or DOCX resume",
                icon: MdUploadFile,
                color: "blue",
                path: "/upload",
              },
              {
                title: "Analyze Resume",
                description: "Get your ATS score vs a job",
                icon: MdWork,
                color: "purple",
                path: "/analyze",
              },
              {
                title: "Optimize Resume",
                description: "AI rewrites resume for the job",
                icon: MdAutoAwesome,
                color: "green",
                path: "/optimize",
              },
              {
                title: "View History",
                description: "See all past ATS analyses",
                icon: MdHistory,
                color: "orange",
                path: "/history",
              },
            ].map((action, i) => (
              <MotionBox
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <ActionCard
                  {...action}
                  onClick={() => navigate(action.path)}
                />
              </MotionBox>
            ))}
          </Grid>
        </Box>

        {/* Recent Analyses */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Text
              fontWeight={700}
              color="gray.400"
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="widest"
            >
              Recent Analyses
            </Text>
            <Button
              variant="ghost"
              size="xs"
              color="blue.400"
              rightIcon={<MdArrowForward />}
              _hover={{ color: "blue.300", bg: "transparent" }}
              onClick={() => navigate("/history")}
            >
              View all
            </Button>
          </HStack>

          {historyLoading ? (
            <VStack spacing={3}>
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  w="full"
                  p={5}
                  bg="gray.900"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.700"
                >
                  <SkeletonText noOfLines={2} spacing={3} />
                </Box>
              ))}
            </VStack>
          ) : !history.length ? (
            <Box
              p={10}
              bg="gray.900"
              borderRadius="2xl"
              textAlign="center"
              border="1px dashed"
              borderColor="gray.700"
            >
              <Icon
                as={MdHistory}
                boxSize={10}
                color="gray.700"
                mb={3}
              />
              <Text color="gray.500" fontSize="sm">
                No analyses yet. Upload a resume and analyze it!
              </Text>
            </Box>
          ) : (
            <VStack spacing={3}>
              {history.slice(0, 5).map((item: ATSHistory, i: number) => (
                <MotionFlex
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  w="full"
                  p={5}
                  bg="gray.900"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.700"
                  align="center"
                  justify="space-between"
                  _hover={{ borderColor: "gray.600" }}
                  whileHover={{ x: 3 }}
                  cursor="pointer"
                  onClick={() => navigate("/history")}
                >
                  <VStack align="flex-start" spacing={0.5}>
                    <Text
                      fontWeight={600}
                      color="white"
                      fontSize="sm"
                    >
                      {item.resume?.title}
                    </Text>
                    <HStack spacing={2}>
                      {item.jobDescription?.companyName && (
                        <Badge
                          colorScheme="blue"
                          fontSize="9px"
                          borderRadius="full"
                        >
                          {item.jobDescription.companyName}
                        </Badge>
                      )}
                      <Text color="gray.500" fontSize="xs">
                        {item.jobDescription?.title}
                      </Text>
                    </HStack>
                  </VStack>
                  <Flex
                    w={14}
                    h={14}
                    borderRadius="full"
                    bg={`${getScoreColor(item.score)}.900`}
                    border="2px solid"
                    borderColor={`${getScoreColor(item.score)}.500`}
                    align="center"
                    justify="center"
                    direction="column"
                    flexShrink={0}
                  >
                    <Text
                      fontWeight={900}
                      fontSize="sm"
                      color={`${getScoreColor(item.score)}.400`}
                      lineHeight={1}
                    >
                      {item.score}
                    </Text>
                    <Text
                      fontSize="8px"
                      color="gray.500"
                      fontWeight={600}
                    >
                      ATS
                    </Text>
                  </Flex>
                </MotionFlex>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </AppLayout>
  );
}