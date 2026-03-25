import { Card, Text, Group, Badge, Image, Box, ActionIcon } from '@mantine/core';
import { X } from 'lucide-react';

export default function PictureItem({ picture, onDelete }) {
  // Format the date taken
  const formattedDate = picture.date_taken 
    ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(picture.date_taken))
    : 'Unknown Date';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ position: 'relative' }}>
      
      {/* Delete Picture Button */}
      {onDelete && (
        <ActionIcon 
          color="red" 
          variant="filled" 
          radius="xl"
          style={{ position: 'absolute', top: 5, left: 5, zIndex: 10 }}
          onClick={() => onDelete(picture.id)}
        >
          <X size={16} />
        </ActionIcon>
      )}

      {/* Header section with Date and Weather */}
      <Group justify="space-between" mb="xs" align="flex-start">
        <Text fw={500} size="sm">{formattedDate}</Text>
        {picture.weather_temp !== null && picture.weather_temp !== undefined ? (
          <Group gap="xs" align="center">
            <Text fw={500} size="sm">{Math.round(picture.weather_temp)}°C</Text>
            {picture.weather_icon && (
              <Image 
                src={`https://openweathermap.org/img/wn/${picture.weather_icon}.png`} 
                alt="Weather" 
                w={30} 
                h={30} 
              />
            )}
          </Group>
        ) : (
          <Badge color="blue" variant="light">No weather data</Badge>
        )}
      </Group>

      {/* Center Image */}
      <Card.Section>
        <Image
          src={picture.url}
          alt="Trip photo"
          height={400} // Made bigger because the single column timeline layout gives it more width!
          fit="cover"
        />
      </Card.Section>

      {picture.punchy_description && (
        <Text mt="md" fw={500} size="md">
          {picture.punchy_description}
        </Text>
      )}

      {/* Footer section with Location */}
      <Box mt="md" ta="right">
        {picture.poi || picture.city || picture.country ? (
          <>
            {picture.poi && (
              <Text size="sm" fw={600}>
                📍 {picture.poi}
              </Text>
            )}
            <Text size="xs" c="dimmed">
              {[picture.city, picture.country].filter(Boolean).join(', ')}
            </Text>
          </>
        ) : (
          <Text size="sm" c="dimmed">
            📍 Unknown Location
          </Text>
        )}
      </Box>
    </Card>
  );
}
