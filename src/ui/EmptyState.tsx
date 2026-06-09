import { VStack, Icon, Text, Button, Box } from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface Props {
    icon: IconType;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon, title, description, actionLabel, onAction
}: Props) {

    return (
        <Box
      py= { 16}
    px = { 8}
    textAlign = "center"
    bg = "gray.800"
    borderRadius = "2xl"
    border = "1px dashed"
    borderColor = "gray.600"
        >
        <VStack spacing={ 4 }>
            <Icon as={ icon } boxSize = { 14} color = "gray.600" />
                <VStack spacing={ 1 }>
                    <Text fontWeight={ 700 } fontSize = "lg" color = "gray.300" >
                        { title }
                        </Text>
                        < Text color = "gray.500" fontSize = "sm" maxW = "300px" >
                            { description }
                            </Text>
                            </VStack>
    {
        actionLabel && onAction && (
            <Button
            size="sm"
        colorScheme = "blue"
        onClick = { onAction }
        mt = { 2}
            >
            { actionLabel }
            </Button>
        )
    }
    </VStack>
        </Box>
    )


}
