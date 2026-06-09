import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Select,
  Textarea,
  Icon,
  Progress,
  SimpleGrid,
  List,
  ListItem,
  Divider,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAutoAwesome,
  MdAnalytics,
  MdLightbulb,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import toast from "react-hot-toast";
import { getResumesAPI } from "../api/resume.api";
import { pasteJDAPI } from "../api/jd.api";
import { analyzeResumeAPI } from "../api/ats.api";
import { useAppSelector } from "../store/hooks";
import AppLayout from "../components/layout/AppLayout";
import type { ATSHistory, Resume, Scorebar } from "../types/types";

const MotionBox = motion(Box);

const ScoreRing = ({ score }: { score: number }) => {
  const color =
    score >= 70 ? "green" : score >= 50 ? "yellow" : "red";
  return (
    <MotionBox
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
    >
      <Flex
        w={36}
        h={36}
        borderRadius="full"
        bg={`${color}.900`}
        border="4px solid"
        borderColor={`${color}.500`}
        align="center"
        justify="center"
        direction="column"
      >
        <Text
          fontSize="4xl"
          fontWeight={900}
          color={`${color}.400`}
          lineHeight={1}
        >
          {score}
        </Text>
        <Text
          fontSize="xs"
          color="gray.500"
          fontWeight={700}
          mt={0.5}
        >
          ATS SCORE
        </Text>
      </Flex>
    </MotionBox>
  );
};

const ScoreBar = ({ label, value, colorScheme }: Scorebar) => (
  <Box>
    <HStack justify="space-between" mb={1.5}>
      <Text fontSize="xs" color="gray.400" fontWeight={500}>
        {label}
      </Text>
      <Text
        fontSize="xs"
        fontWeight={800}
        color={`${colorScheme}.400`}
      >
        {value}%
      </Text>
    </HStack>
    <Progress
      value={value}
      colorScheme={colorScheme}
      borderRadius="full"
      size="sm"
      bg="gray.700"
      hasStripe
      isAnimated
    />
  </Box>
);

export default function Analyze() {
  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [jdTitle, setJdTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jdContent, setJdContent] = useState("");
  const [report, setReport] = useState<ATSHistory | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchResumes = async () => {
      try {
        const res = await getResumesAPI();
        setResumes(res.data.data);
      } catch {
        toast.error("Failed to load resumes");
      }
    };
    fetchResumes();
  }, [isAuthenticated]);

  const handleAnalyze = async () => {
    if (!resumeId) {
      toast.error("Please select a resume");
      return;
    }
    if (!jdContent.trim()) {
      toast.error("Please paste the job description");
      return;
    }

    setAnalyzing(true);
    try {
      const jdRes = await pasteJDAPI({
        title: jdTitle || "Job Description",
        content: jdContent,
        companyName: companyName || undefined,
      });
      const analysisRes = await analyzeResumeAPI({
        resumeId,
        jobDescriptionId: jdRes.data.data.id,
      });
      setReport(analysisRes.data.data);
      toast.success("Analysis complete!");
    } catch (error) {
        if(error instanceof Error)
        {
            toast.error(error.message);
        }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <AppLayout>
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Heading size="lg" color="white" fontWeight={800}>
            Analyze Resume
          </Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            Get your ATS score against any job description
          </Text>
        </MotionBox>

        <Flex gap={6} align="flex-start">
          {/* LEFT */}
          <VStack flex={1} spacing={5} align="stretch">
            <Box
              bg="gray.900"
              p={6}
              borderRadius="2xl"
              border="1px solid"
              borderColor="gray.700"
            >
              <Text
                fontWeight={700}
                color="white"
                mb={3}
                fontSize="sm"
              >
                Select Resume
              </Text>
              <Select
                placeholder="Choose a resume..."
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                bg="gray.800"
                borderColor="gray.600"
                color="white"
                borderRadius="xl"
                _focus={{ borderColor: "blue.400" }}
                size="lg"
              >
                {resumes.map((r: Resume) => (
                  <option
                    key={r.id}
                    value={r.id}
                    style={{ background: "#1a202c" }}
                  >
                    {r.title} ({r.fileType})
                  </option>
                ))}
              </Select>
              {!resumes.length && (
                <Text color="yellow.500" fontSize="xs" mt={2}>
                  ⚠ No resumes found. Go to Upload page first.
                </Text>
              )}
            </Box>

            <Box
              bg="gray.900"
              p={6}
              borderRadius="2xl"
              border="1px solid"
              borderColor="gray.700"
            >
              <Text
                fontWeight={700}
                color="white"
                mb={4}
                fontSize="sm"
              >
                Job Description
              </Text>
              <VStack spacing={3}>
                <HStack w="full" spacing={3}>
                  <Input
                    placeholder="Job title"
                    value={jdTitle}
                    onChange={(e) => setJdTitle(e.target.value)}
                    bg="gray.800"
                    borderColor="gray.600"
                    color="white"
                    borderRadius="xl"
                    _focus={{ borderColor: "blue.400" }}
                    _placeholder={{ color: "gray.600" }}
                  />
                  <Input
                    placeholder="Company (optional)"
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(e.target.value)
                    }
                    bg="gray.800"
                    borderColor="gray.600"
                    color="white"
                    borderRadius="xl"
                    _focus={{ borderColor: "blue.400" }}
                    _placeholder={{ color: "gray.600" }}
                  />
                </HStack>
                <Textarea
                  placeholder="Paste the full job description here..."
                  value={jdContent}
                  onChange={(e) => setJdContent(e.target.value)}
                  rows={10}
                  bg="gray.800"
                  borderColor="gray.600"
                  color="white"
                  borderRadius="xl"
                  _focus={{ borderColor: "blue.400" }}
                  _placeholder={{ color: "gray.600" }}
                  resize="vertical"
                  fontSize="sm"
                />
              </VStack>
            </Box>

            <Button
              size="lg"
              h="54px"
              bgGradient="linear(to-r, blue.500, purple.600)"
              color="white"
              borderRadius="xl"
              isLoading={analyzing}
              loadingText="AI analyzing..."
              onClick={handleAnalyze}
              leftIcon={<MdAnalytics />}
              _hover={{
                bgGradient:
                  "linear(to-r, blue.600, purple.700)",
                transform: "translateY(-2px)",
                boxShadow:
                  "0 12px 30px rgba(66,153,225,0.35)",
              }}
              transition="all 0.2s"
            >
              Analyze with AI
            </Button>
          </VStack>

          {/* RIGHT */}
          <Box flex={1}>
            <AnimatePresence mode="wait">
              {!report && !analyzing && (
                <MotionBox
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Flex
                    minH="500px"
                    bg="gray.900"
                    borderRadius="2xl"
                    border="1px dashed"
                    borderColor="gray.700"
                    align="center"
                    justify="center"
                    direction="column"
                    gap={4}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    >
                      <Icon
                        as={MdAutoAwesome}
                        boxSize={16}
                        color="gray.700"
                      />
                    </motion.div>
                    <VStack spacing={1} textAlign="center">
                      <Text
                        color="gray.500"
                        fontWeight={600}
                      >
                        Results will appear here
                      </Text>
                      <Text color="gray.600" fontSize="sm">
                        Select a resume and paste a JD
                      </Text>
                    </VStack>
                  </Flex>
                </MotionBox>
              )}

              {analyzing && (
                <MotionBox
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Flex
                    minH="500px"
                    bg="gray.900"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="gray.700"
                    align="center"
                    justify="center"
                    direction="column"
                    gap={5}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Icon
                        as={MdAutoAwesome}
                        boxSize={14}
                        color="blue.400"
                      />
                    </motion.div>
                    <VStack spacing={2} textAlign="center">
                      <Text
                        color="white"
                        fontWeight={700}
                        fontSize="lg"
                      >
                        AI is analyzing your resume...
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Comparing skills, keywords and experience
                      </Text>
                    </VStack>
                    <Progress
                      w="220px"
                      isIndeterminate
                      colorScheme="blue"
                      borderRadius="full"
                      size="xs"
                      bg="gray.700"
                    />
                    <Text color="gray.600" fontSize="xs">
                      Takes about 10–15 seconds
                    </Text>
                  </Flex>
                </MotionBox>
              )}

              {report && !analyzing && (
                <MotionBox
                  key="report"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <VStack
                    bg="gray.900"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="gray.700"
                    p={7}
                    spacing={6}
                    align="stretch"
                  >
                    <Flex
                      direction="column"
                      align="center"
                      gap={4}
                    >
                      <ScoreRing score={report.score} />
                      <Text
                        color="gray.400"
                        fontSize="sm"
                        textAlign="center"
                        maxW="280px"
                        lineHeight={1.6}
                      >
                        {report.summary}
                      </Text>
                    </Flex>

                    <Divider borderColor="gray.700" />

                    <VStack spacing={3} align="stretch">
                      <Text
                        fontWeight={700}
                        color="gray.300"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="widest"
                      >
                        Score Breakdown
                      </Text>
                      <ScoreBar
                        label="Skills Match"
                        value={report.skillScore}
                        colorScheme="blue"
                      />
                      <ScoreBar
                        label="Keyword Density"
                        value={report.keywordScore}
                        colorScheme="purple"
                      />
                      <ScoreBar
                        label="Experience"
                        value={report.experienceScore}
                        colorScheme="green"
                      />
                      <ScoreBar
                        label="Education"
                        value={report.educationScore}
                        colorScheme="yellow"
                      />
                      <ScoreBar
                        label="Formatting"
                        value={report.formattingScore}
                        colorScheme="orange"
                      />
                    </VStack>

                    <Divider borderColor="gray.700" />

                    <SimpleGrid columns={2} spacing={5}>
                      <Box>
                        <Text
                          fontWeight={700}
                          color="green.400"
                          mb={3}
                          fontSize="xs"
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          Matched Skills
                        </Text>
                        <VStack
                          align="flex-start"
                          spacing={1.5}
                        >
                          {report.matchedSkills
                            ?.slice(0, 6)
                            .map((s: string) => (
                              <HStack key={s} spacing={1.5}>
                                <Icon
                                  as={MdCheckCircle}
                                  color="green.500"
                                  boxSize={3.5}
                                />
                                <Text
                                  fontSize="xs"
                                  color="gray.300"
                                >
                                  {s}
                                </Text>
                              </HStack>
                            ))}
                        </VStack>
                      </Box>
                      <Box>
                        <Text
                          fontWeight={700}
                          color="red.400"
                          mb={3}
                          fontSize="xs"
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          Missing Skills
                        </Text>
                        <VStack
                          align="flex-start"
                          spacing={1.5}
                        >
                          {report.missingSkills
                            ?.slice(0, 6)
                            .map((s: string) => (
                              <HStack key={s} spacing={1.5}>
                                <Icon
                                  as={MdCancel}
                                  color="red.500"
                                  boxSize={3.5}
                                />
                                <Text
                                  fontSize="xs"
                                  color="gray.300"
                                >
                                  {s}
                                </Text>
                              </HStack>
                            ))}
                        </VStack>
                      </Box>
                    </SimpleGrid>

                    <Divider borderColor="gray.700" />

                    <Box>
                      <Text
                        fontWeight={700}
                        color="gray.300"
                        mb={3}
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="widest"
                      >
                        Recommendations
                      </Text>
                      <List spacing={3}>
                        {report.recommendations?.map(
                          (rec: string, i: number) => (
                            <ListItem
                              key={i}
                              display="flex"
                              alignItems="flex-start"
                              gap={2}
                            >
                              <Icon
                                as={MdLightbulb}
                                color="yellow.400"
                                mt={0.5}
                                flexShrink={0}
                                boxSize={4}
                              />
                              <Text
                                fontSize="sm"
                                color="gray.300"
                                lineHeight={1.6}
                              >
                                {rec}
                              </Text>
                            </ListItem>
                          )
                        )}
                      </List>
                    </Box>
                  </VStack>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
        </Flex>
      </VStack>
    </AppLayout>
  );
}