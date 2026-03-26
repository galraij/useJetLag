import { BackgroundImage, Center, Title, Text, Button, Group, Stack } from '@mantine/core';
import { Sparkles, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomeImage() {
    return (
        <BackgroundImage
            src="https://images.unsplash.com/photo-1631535152690-ba1a85229136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0JTIwdHJhdmVsfGVufDF8fHx8MTc3NDE4ODIyMXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Travel Hero"
            h={600}
            radius="md"
        >
            <Center h="100%" bg="rgba(0, 0, 0, 0.5)">
                <Stack align="center" gap="md">
                    <Title order={1} c="white" ta="center" fz={48}>
                        Turn Your Travel Photos<br />Into Stories
                    </Title>

                    <Text c="white" size="xl" ta="center" maw={600}>
                        Upload your travel photos and let AI create beautiful, engaging blog posts that capture your adventures
                    </Text>

                    <Group justify="center" mt="xl">
                        <Button
                            size="lg"
                            component={Link} // הופך את הכפתור ללינק
                            to="/explore"
                            variant="default"
                            rightSection={<Globe2 size={20} />}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            Explore Trips
                        </Button>
                        <Button
                            size="lg"
                            color="orange"
                            component={Link}
                            to="/trip"
                            //to="/get-started-upload"
                            rightSection={<Sparkles size={20} />}
                        >
                            Get Started Free
                        </Button>

                    </Group>
                </Stack>
            </Center>
        </BackgroundImage>
    );
}