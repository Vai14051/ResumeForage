import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Progress,
  Select,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  MdAutoAwesome,
  MdDownload,
  MdContentCopy,
  MdRefresh,
} from "react-icons/md";
import toast from "react-hot-toast";
import { getResumesAPI } from "../api/resume.api";
import { getJDsAPI } from "../api/jd.api";
import { generateResumeAPI } from "../api/ats.api";
import { useAppSelector } from "../store/hooks";
import AppLayout from "../components/layout/AppLayout";
import type { GenResume, JobDescription, Resume } from "../types/types";

const MotionBox = motion(Box);

export default function Optimize() {
  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [jdId, setJdId] = useState("");
  const [generated, setGenerated] = useState<GenResume>();
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const [resumeRes, jdRes] = await Promise.all([
          getResumesAPI(),
          getJDsAPI(),
        ]);
        setResumes(resumeRes.data.data);
        setJds(jdRes.data.data);
      } catch {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleGenerate = async () => {
    if (!resumeId || !jdId) {
      toast.error(
        "Please select both a resume and a job description"
      );
      return;
    }
    setGenerating(true);
    try {
      const res = await generateResumeAPI({
        resumeId,
        jobDescriptionId: jdId,
      });
      setGenerated(res.data.data);
      toast.success("Optimized resume is ready!");
    } catch (error) {
        if(error instanceof Error)
        {
             toast.error(
        error.message || "Generation failed"
      );
        }
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated!.content);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([generated!.content], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generated!.title.replace(/ /g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <AppLayout>
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Heading size="lg" color="white" fontWeight={800}>
            Optimize Resume
          </Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            AI rewrites your resume tailored for the job
          </Text>
        </MotionBox>

        {/* Controls */}
        <Box
          bg="gray.900"
          p={6}
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.700"
        >
          <HStack spacing={4} align="flex-end">
            <Box flex={1}>
              <Text
                fontSize="xs"
                color="gray.400"
                mb={2}
                fontWeight={600}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Resume
              </Text>
              <Select
                placeholder="Select your resume..."
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                bg="gray.800"
                borderColor="gray.600"
                color="white"
                borderRadius="xl"
                _focus={{ borderColor: "blue.400" }}
                size="lg"
              >
                {resumes.map((r) => (
                  <option
                    key={r.id}
                    value={r.id}
                    style={{ background: "#1a202c" }}
                  >
                    {r.title} ({r.fileType})
                  </option>
                ))}
              </Select>
            </Box>

            <Box flex={1}>
              <Text
                fontSize="xs"
                color="gray.400"
                mb={2}
                fontWeight={600}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Job Description
              </Text>
              <Select
                placeholder="Select a job description..."
                value={jdId}
                onChange={(e) => setJdId(e.target.value)}
                bg="gray.800"
                borderColor="gray.600"
                color="white"
                borderRadius="xl"
                _focus={{ borderColor: "blue.400" }}
                size="lg"
              >
                {jds.map((j) => (
                  <option
                    key={j.id}
                    value={j.id}
                    style={{ background: "#1a202c" }}
                  >
                    {j.title}
                    {j.companyName ? ` — ${j.companyName}` : ""}
                  </option>
                ))}
              </Select>
            </Box>

            <Button
              h="52px"
              px={8}
              flexShrink={0}
              borderRadius="xl"
              bgGradient="linear(to-r, purple.500, blue.500)"
              color="white"
              isLoading={generating}
              loadingText="AI Rewriting..."
              onClick={handleGenerate}
              leftIcon={<MdAutoAwesome />}
              isDisabled={!resumeId || !jdId}
              _hover={{
                bgGradient:
                  "linear(to-r, purple.600, blue.600)",
                transform: "translateY(-2px)",
                boxShadow:
                  "0 12px 30px rgba(128,90,213,0.35)",
              }}
              _disabled={{
                opacity: 0.4,
                cursor: "not-allowed",
                transform: "none",
              }}
              transition="all 0.2s"
            >
              Generate
            </Button>
          </HStack>

          {!jds.length && (
            <Text color="yellow.500" fontSize="xs" mt={3}>
              ⚠ No job descriptions found. Go to Analyze page
              first to save a JD.
            </Text>
          )}
        </Box>

        {/* Output */}
        <AnimatePresence mode="wait">
          {generating && (
            <MotionBox
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Flex
                minH="400px"
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
                    color="purple.400"
                  />
                </motion.div>
                <VStack spacing={2} textAlign="center">
                  <Text
                    color="white"
                    fontWeight={700}
                    fontSize="lg"
                  >
                    AI is rewriting your resume...
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    Tailoring content for this specific job
                  </Text>
                </VStack>
                <Progress
                  w="250px"
                  isIndeterminate
                  colorScheme="purple"
                  borderRadius="full"
                  size="xs"
                  bg="gray.700"
                />
                <Text color="gray.600" fontSize="xs">
                  This takes 15–30 seconds
                </Text>
              </Flex>
            </MotionBox>
          )}

          {generated && !generating && (
            <MotionBox
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box
                bg="gray.900"
                borderRadius="2xl"
                border="1px solid"
                borderColor="gray.700"
                overflow="hidden"
              >
                {/* Toolbar */}
                <Flex
                  p={4}
                  bg="gray.800"
                  borderBottom="1px solid"
                  borderColor="gray.700"
                  align="center"
                  justify="space-between"
                >
                  <HStack spacing={3}>
                    <Icon
                      as={MdAutoAwesome}
                      color="purple.400"
                      boxSize={5}
                    />
                    <Text
                      fontWeight={600}
                      color="white"
                      fontSize="sm"
                      noOfLines={1}
                      maxW="300px"
                    >
                      {generated.title}
                    </Text>
                    {generated.atsScore && (
                      <Badge
                        colorScheme="purple"
                        borderRadius="full"
                        px={3}
                        fontSize="xs"
                      >
                        Based on ATS: {generated.atsScore}%
                      </Badge>
                    )}
                  </HStack>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="ghost"
                      color="gray.400"
                      leftIcon={<MdRefresh />}
                      borderRadius="lg"
                      _hover={{ color: "white", bg: "gray.700" }}
                      onClick={handleGenerate}
                      isLoading={generating}
                    >
                      Regenerate
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      color="gray.400"
                      leftIcon={<MdContentCopy />}
                      borderRadius="lg"
                      _hover={{ color: "white", bg: "gray.700" }}
                      onClick={handleCopy}
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="purple"
                      leftIcon={<MdDownload />}
                      borderRadius="lg"
                      onClick={handleDownload}
                    >
                      Download .md
                    </Button>
                  </HStack>
                </Flex>

                {/* Markdown Content */}
                <Box
                  p={8}
                  maxH="650px"
                  overflowY="auto"
                  sx={{
                    "&::-webkit-scrollbar": { w: "4px" },
                    "&::-webkit-scrollbar-track": {
                      bg: "gray.800",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      bg: "gray.600",
                      borderRadius: "full",
                    },
                    "& h1": {
                      color: "white",
                      fontSize: "22px",
                      fontWeight: 800,
                      marginBottom: "8px",
                    },
                    "& h2": {
                      color: "#63b3ed",
                      fontSize: "14px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginTop: "24px",
                      marginBottom: "8px",
                      borderBottom: "1px solid #2d3748",
                      paddingBottom: "4px",
                    },
                    "& h3": {
                      color: "#e2e8f0",
                      fontSize: "14px",
                      fontWeight: 700,
                      marginTop: "16px",
                      marginBottom: "4px",
                    },
                    "& p": {
                      color: "#a0aec0",
                      fontSize: "13px",
                      lineHeight: "1.7",
                      marginBottom: "8px",
                    },
                    "& ul": {
                      color: "#a0aec0",
                      fontSize: "13px",
                      paddingLeft: "20px",
                      marginBottom: "8px",
                    },
                    "& li": {
                      marginBottom: "4px",
                      lineHeight: "1.6",
                    },
                    "& strong": {
                      color: "white",
                      fontWeight: 700,
                    },
                    "& hr": {
                      borderColor: "#2d3748",
                      marginTop: "16px",
                      marginBottom: "16px",
                    },
                  }}
                >
                  <ReactMarkdown>{generated.content}</ReactMarkdown>
                </Box>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </VStack>
    </AppLayout>
  );
}