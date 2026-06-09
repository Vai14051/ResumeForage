import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  IconButton,
  Skeleton,
} from "@chakra-ui/react";
import { useCallback, useState, useEffect } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdUploadFile,
  MdDelete,
  MdPictureAsPdf,
  MdDescription,
  MdCloudUpload,
  MdCheckCircle,
} from "react-icons/md";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hooks";
import AppLayout from "../components/layout/AppLayout";
import type { Resume } from "../types/types";
import { deleteResumeApi, getResumeAPI, uploadResumeAPi } from "../api/resume.api";

const MotionBox = motion(Box);

export default function Upload() {
  const { isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(
    null
  );
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const res = await getResumeAPI();
        setResumes(res.data.data);
      } catch {
        toast.error("Failed to fetch resumes");
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, [isAuthenticated]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      const res = await uploadResumeAPi(formData);
      setResumes((prev) => [res.data.data, ...prev]);
      setSelectedFile(null);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
        if(error instanceof Error)
        {
            toast.error(
        error.message || "Upload failed"
      );
        }

    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    console.log("Delete id", id);
    try {
      await deleteResumeApi(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        toast.error("Only PDF or DOCX under 5MB allowed");
        return;
      }
      if (accepted[0]) setSelectedFile(accepted[0]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024,
    });

  return (
    <AppLayout>
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Heading size="lg" color="white" fontWeight={800}>
            Upload Resume
          </Heading>
          <Text color="gray.500" mt={1} fontSize="sm">
            Upload your PDF or DOCX — parsed and stored instantly
          </Text>
        </MotionBox>

        {/* Drop Zone */}
        <Box
          {...getRootProps()}
          p={14}
          borderRadius="2xl"
          border="2px dashed"
          borderColor={
            isDragActive
              ? "blue.400"
              : selectedFile
              ? "green.500"
              : "gray.700"
          }
          bg={
            isDragActive
              ? "blue.900"
              : selectedFile
              ? "green.900"
              : "gray.900"
          }
          cursor="pointer"
          textAlign="center"
          transition="all 0.3s ease"
          _hover={{ borderColor: "blue.500", bg: "gray.800" }}
        >
          <input {...getInputProps()} />
          <VStack spacing={4}>
            <motion.div
              animate={{
                y: isDragActive ? -8 : 0,
                scale: isDragActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon
                as={
                  isDragActive
                    ? MdCloudUpload
                    : selectedFile
                    ? MdCheckCircle
                    : MdUploadFile
                }
                boxSize={16}
                color={
                  isDragActive
                    ? "blue.400"
                    : selectedFile
                    ? "green.400"
                    : "gray.600"
                }
              />
            </motion.div>

            {selectedFile ? (
              <VStack spacing={1}>
                <Text
                  fontWeight={700}
                  color="green.400"
                  fontSize="lg"
                >
                  {selectedFile.name}
                </Text>
                <Text color="gray.400" fontSize="sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                  MB — ready to upload
                </Text>
              </VStack>
            ) : (
              <VStack spacing={1}>
                <Text
                  fontWeight={700}
                  color="white"
                  fontSize="lg"
                >
                  {isDragActive
                    ? "Drop it here!"
                    : "Drag & drop your resume"}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  or click to browse files
                </Text>
                <HStack mt={2} spacing={2}>
                  <Badge
                    colorScheme="blue"
                    borderRadius="full"
                    px={3}
                  >
                    PDF
                  </Badge>
                  <Badge
                    colorScheme="purple"
                    borderRadius="full"
                    px={3}
                  >
                    DOCX
                  </Badge>
                  <Badge
                    colorScheme="gray"
                    borderRadius="full"
                    px={3}
                  >
                    Max 5MB
                  </Badge>
                </HStack>
              </VStack>
            )}
          </VStack>
        </Box>

        {/* Upload Button */}
        <AnimatePresence>
          {selectedFile && (
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HStack spacing={3}>
                <Button
                  size="lg"
                  h="52px"
                  px={10}
                  borderRadius="xl"
                  bgGradient="linear(to-r, blue.500, purple.600)"
                  color="white"
                  isLoading={uploading}
                  loadingText="Uploading & parsing..."
                  onClick={handleUpload}
                  leftIcon={<MdCloudUpload />}
                  _hover={{
                    bgGradient:
                      "linear(to-r, blue.600, purple.700)",
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 12px 30px rgba(66,153,225,0.35)",
                  }}
                >
                  Upload Resume
                </Button>
                <Button
                  size="lg"
                  h="52px"
                  variant="ghost"
                  color="gray.500"
                  borderRadius="xl"
                  _hover={{ color: "white", bg: "gray.800" }}
                  onClick={() => setSelectedFile(null)}
                >
                  Cancel
                </Button>
              </HStack>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Resume List */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Text
              fontWeight={700}
              color="gray.400"
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="widest"
            >
              Your Resumes
            </Text>
            <Badge
              colorScheme="blue"
              borderRadius="full"
              px={3}
            >
              {resumes.length} total
            </Badge>
          </HStack>

          {loading ? (
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {[1, 2].map((i) => (
                <Skeleton
                  key={i}
                  h="90px"
                  borderRadius="xl"
                />
              ))}
            </Grid>
          ) : !resumes.length ? (
            <Box
              p={10}
              bg="gray.900"
              borderRadius="2xl"
              textAlign="center"
              border="1px dashed"
              borderColor="gray.700"
            >
              <Icon
                as={MdUploadFile}
                boxSize={10}
                color="gray.700"
                mb={3}
              />
              <Text color="gray.500" fontSize="sm">
                No resumes yet. Upload your first one above!
              </Text>
            </Box>
          ) : (
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {resumes.map((resume: Resume, i: number) => (
                <MotionBox
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                >
                  <Flex
                    p={5}
                    bg="gray.900"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.700"
                    align="center"
                    justify="space-between"
                    _hover={{ borderColor: "gray.600" }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={4}>
                      <Flex
                        w={11}
                        h={11}
                        borderRadius="xl"
                        align="center"
                        justify="center"
                        bg={
                          resume.fileType === ".pdf"
                            ? "red.900"
                            : "blue.900"
                        }
                        border="1px solid"
                        borderColor={
                          resume.fileType === ".pdf"
                            ? "red.800"
                            : "blue.800"
                        }
                      >
                        <Icon
                          as={
                            resume.fileType === ".pdf"
                              ? MdPictureAsPdf
                              : MdDescription
                          }
                          color={
                            resume.fileType === ".pdf"
                              ? "red.400"
                              : "blue.400"
                          }
                          boxSize={5}
                        />
                      </Flex>
                      <VStack align="flex-start" spacing={0.5}>
                        <Text
                          fontWeight={600}
                          color="white"
                          fontSize="sm"
                          noOfLines={1}
                          maxW="160px"
                        >
                          {resume.title}
                        </Text>
                        <HStack spacing={2}>
                          <Badge
                            colorScheme={
                              resume.fileType === ".pdf"
                                ? "red"
                                : "blue"
                            }
                            fontSize="9px"
                            borderRadius="full"
                          >
                            {resume.fileType
                              .replace(".", "")
                              .toUpperCase()}
                          </Badge>
                          <Text color="gray.600" fontSize="10px">
                            {new Date(
                              resume.createdAt
                            ).toLocaleDateString("en-IN")}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <IconButton
                      aria-label="Delete resume"
                      icon={<MdDelete />}
                      size="sm"
                      variant="ghost"
                      color="gray.600"
                      borderRadius="lg"
                      _hover={{
                        color: "red.400",
                        bg: "red.900",
                      }}
                      isLoading={deletingId === resume.id}
                      onClick={() => handleDelete(resume.id)}
                    />
                  </Flex>
                </MotionBox>
              ))}
            </Grid>
          )}
        </Box>
      </VStack>
    </AppLayout>
  );
}