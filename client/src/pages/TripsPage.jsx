import { Link } from 'react-router-dom';
import { Container, Title, Text, Button, Grid, Card, Image, Badge, Group, Stack, AspectRatio, ActionIcon } from '@mantine/core';
import { Plus, MapPin, Calendar, Upload, Eye, Trash2 } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export default function TripsPage() {
  const { trips, user, deleteTrip } = useTravel();
  const userTrips = trips.filter(trip => trip.userId === user?.id);

  return (
    <Container size="xl" py="xl">
      <Stack mb="xl" gap="xs">
        <Title order={1}>My Trips</Title>
        <Text c="dimmed">Manage your travel stories and adventures</Text>
      </Stack>

      <Button
        leftSection={<Plus size={18} />}
        mb="xl"
        component={Link}
        to="/get-started-upload"
      >
        Add Trip
      </Button>

      {userTrips.length === 0 ? (
        <Stack align="center" py={80}>
          <Card withBorder radius="lg" p="xl" maw={400} w="100%">
            <Stack align="center" gap="md">
              <Upload size={48} color="gray" />
              <Title order={3}>No trips yet</Title>
              <Text c="dimmed" ta="center">
                Create your first trip and start building your travel story
              </Text>
              <Button leftSection={<Plus size={18} />} component={Link} to="/get-started-upload">
                Add Trip
              </Button>
            </Stack>
          </Card>
        </Stack>
      ) : (
        <Grid>
          {userTrips.map(trip => (
            <Grid.Col key={trip.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card withBorder radius="lg" shadow="sm" h="100%">
                <Card.Section>
                  <AspectRatio ratio={16 / 9}>
                    <Image src={trip.coverImage} alt={trip.title} fallbackSrc="https://placehold.co/400x225?text=No+Image" />
                  </AspectRatio>
                </Card.Section>
                <Stack mt="md" gap="xs">
                  <Group justify="space-between">
                    <Title order={4}>{trip.title}</Title>
                    <Badge color={trip.isPublic ? 'green' : 'gray'} leftSection={trip.isPublic ? <Eye size={12} /> : null}>
                      {trip.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </Group>
                  <Group gap="xs">
                    <MapPin size={14} />
                    <Text size="sm" c="dimmed">{trip.region}, {trip.country}</Text>
                  </Group>
                  <Group gap="xs">
                    <Calendar size={14} />
                    <Text size="sm" c="dimmed">{new Date(trip.createdAt).toLocaleDateString()}</Text>
                  </Group>
                  <Group gap="xs">
                    <Upload size={14} />
                    <Text size="sm" c="dimmed">{trip.images?.length || 0} photos</Text>
                  </Group>
                </Stack>
                <Group mt="md" gap="xs">
                  {!trip.images || trip.images.length === 0 ? (
                    <Button component={Link} to={`/get-started-upload`} flex={1} size="sm">
                      Upload Photos
                    </Button>
                  ) : trip.blogContent ? (
                    <Button component={Link} to={`/trip/${trip.id}`} flex={1} size="sm">
                      View Story
                    </Button>
                  ) : (
                    <Button component={Link} to={`/trip/${trip.id}/generate`} flex={1} size="sm" color="orange">
                      Generate Blog
                    </Button>
                  )}
                  <ActionIcon color="red" variant="light" size="lg" onClick={() => { if (confirm('Delete this trip?')) deleteTrip(trip.id); }}>
                    <Trash2 size={16} />
                  </ActionIcon>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}
