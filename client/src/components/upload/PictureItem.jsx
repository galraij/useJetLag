import { Card, Text, Group, Badge, Image, Box } from '@mantine/core';

export default function PictureItem({ picture }) {
  // Format the date taken
  const formattedDate = picture.date_taken 
    ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(picture.date_taken))
    : 'Unknown Date';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {/* Header section with Date and Weather */}
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="sm">{formattedDate}</Text>
        <Badge color="blue" variant="light">Weather placeholder</Badge>
      </Group>

      {/* Center Image */}
      <Card.Section>
        <Image
          src={picture.url}
          alt="Trip photo"
          height={200}
          fit="cover"
        />
      </Card.Section>

      {/* Footer section with Location */}
      <Box mt="md" ta="right">
        <Text size="sm" c="dimmed">
          📍 Location placeholder
        </Text>
      </Box>
    </Card>
  );
}
