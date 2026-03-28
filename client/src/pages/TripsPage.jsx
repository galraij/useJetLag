import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Grid, Card, Image, Badge, Group, Stack, AspectRatio, ActionIcon, Loader, Center } from '@mantine/core';
import { Plus, MapPin, Calendar, Upload, Eye, Trash2, Edit } from 'lucide-react';
import { getMyTrips } from '../api/trips.api';
import useAuth from '../hooks/useAuth';
import '../CSS/TripCard.css';

export default function TripsPage() {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    async function fetchTrips() {
      try {
        const { data } = await getMyTrips();
        if (data && data.trips) {
          setUserTrips(data.trips);
        }
      } catch (err) {
        console.error("Failed to load trips", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to permanently delete this trip and all its photos?')) {
      try {
        await import('../api/trips.api').then(m => m.deleteTrip(id));
        setUserTrips(prev => prev.filter(t => t.id !== id));
      } catch (err) {
        console.error("Failed to delete trip:", err);
        alert("Failed to delete trip.");
      }
    }
  };

  const formatDateRange = (earliest, latest) => {
    if (!earliest || !latest) return "Unknown Dates";
    const opts = { day: 'numeric', month: 'short', year: 'numeric' };
    const eStr = new Intl.DateTimeFormat('en-GB', opts).format(new Date(earliest));
    const lStr = new Intl.DateTimeFormat('en-GB', opts).format(new Date(latest));
    return eStr === lStr ? eStr : `${eStr} - ${lStr}`;
  };

  if (loading) {
    return (
      <Center mt={80}>
        <Loader size="xl" />
      </Center>
    );
  }

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
              <Card className="trip-card" withBorder radius="lg" shadow="sm" h="100%">
                <Card.Section style={{ overflow: 'hidden' }}>
                  <AspectRatio ratio={16 / 9}>
                    <Image src={trip.coverImage} alt={trip.title} fallbackSrc="https://placehold.co/400x225?text=No+Image" />
                  </AspectRatio>
                </Card.Section>
                <Stack mt="md" gap="xs">
                  <Group justify="space-between">
                    <Title order={4} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {trip.title}
                    </Title>
                    <Badge color={trip.is_published ? 'green' : 'orange'} leftSection={trip.is_published ? <Eye size={12} /> : <Edit size={12} />}>
                      {trip.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </Group>
                  <Group gap="xs">
                    <MapPin size={14} />
                    <Text size="sm" c="dimmed">{trip.location}</Text>
                  </Group>
                  <Group gap="xs">
                    <Calendar size={14} />
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {formatDateRange(trip.earliestDate, trip.latestDate)}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Upload size={14} />
                    <Text size="sm" c="dimmed">{trip.photosCount} photos</Text>
                  </Group>
                </Stack>
                <Group mt="md" gap="xs">
                  {trip.is_published ? (
                    <Button component={Link} to={`/trip/${trip.slug}`} flex={1} size="sm" color="green">
                      View Story
                    </Button>
                  ) : trip.photosCount > 0 ? (
                    <Button component={Link} to={`/trip/${trip.slug}`} flex={1} size="sm" color="orange">
                      Edit Draft
                    </Button>
                  ) : (
                    <Button component={Link} to={`/get-started-upload`} flex={1} size="sm">
                      Start Uploading
                    </Button>
                  )}
                  <ActionIcon color="red" variant="light" size="lg" onClick={() => handleDelete(trip.id)}>
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
