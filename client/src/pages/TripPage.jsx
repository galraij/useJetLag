import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Loader, Center, Text, Button, Card, List, ThemeIcon, Grid, Box, SimpleGrid } from '@mantine/core';
import { Sparkles, MapPin } from 'lucide-react';
import { getTripBySlug, generateTripStory } from '../api/trips.api';
import { deletePicture } from '../api/upload.api';
import PictureItem from '../components/upload/PictureItem';

export default function TripPage() {
  const { slug } = useParams();
  
  const [trip, setTrip] = useState({});
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await getTripBySlug(slug);
        setTrip(data.trip || {});
        setPictures(data.pictures || []);
      } catch (error) {
        console.error("Failed to load trip", error);
        alert("Trip not found");
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchData();
    }
  }, [slug]);

  async function handleDeletePicture(id) {
    // Delete from DB and update state instantly
    try {
      await deletePicture(id);
      setPictures(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete picture');
    }
  }

  async function handleGenerateStory() {
    setGenerating(true);
    try {
      const { data } = await generateTripStory(slug);
      setTrip(data.trip || {});
      setPictures(data.pictures || []);
    } catch (err) {
      console.error(err);
      alert('Failed to generate story. Check your Gemini API Key!');
    } finally {
      setGenerating(false);
    }
  }

  const pois = trip.points_of_interest ? (typeof trip.points_of_interest === 'string' ? JSON.parse(trip.points_of_interest) : trip.points_of_interest) : null;

  // Group pictures into chunks of 1 or 2 for a dynamic magazine layout
  const groupedPictures = [];
  let i = 0;
  while (i < pictures.length) {
    // Alternate 1 and 2, but if there's only 1 left, naturally it just takes 1
    const size = (groupedPictures.length % 2 === 0) ? 1 : 2;
    groupedPictures.push(pictures.slice(i, i + size));
    i += size;
  }

  return (
    <Container pt="xl" size="xl">
      <Title order={1} mb="xl" ta="center">{trip.title}</Title>

      {loading ? (
        <Center mt="xl"><Loader /></Center>
      ) : pictures.length === 0 ? (
        <Center mt="xl"><Text c="dimmed">No pictures found for this trip.</Text></Center>
      ) : (
        <Grid gutter="xl">
          {/* Timeline and Pictures column */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {trip.story_summary && (
              <Box mb="xl">
                <Title order={3} c="grape.7" mb="sm">Trip Overview</Title>
                <Text size="lg">{trip.story_summary}</Text>
              </Box>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {groupedPictures.map((group, groupIndex) => {
                // Combine story segments of the group if they differ, or just show the first
                const segment1 = group[0].story_segment;
                const segment2 = group[1]?.story_segment;
                const combinedSegment = segment1 && segment2 && segment1 !== segment2 
                  ? `${segment1} ${segment2}` 
                  : segment1 || segment2;

                return (
                  <div key={`group-${groupIndex}`}>
                    {combinedSegment && (
                      <Card shadow="xs" p="md" radius="md" mb="md" bg="blue.0" withBorder>
                        <Text size="md" c="dark.5">{combinedSegment}</Text>
                      </Card>
                    )}
                    <SimpleGrid cols={{ base: 1, sm: group.length }} spacing="lg">
                      {group.map((pic) => (
                        <PictureItem key={pic.id} picture={pic} onDelete={handleDeletePicture} />
                      ))}
                    </SimpleGrid>
                  </div>
                );
              })}
            </div>
          </Grid.Col>

          {/* POI Sidebar Column */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            {pois && pois.length > 0 && (
              <Card shadow="sm" p="lg" radius="md" withBorder style={{ position: 'sticky', top: '20px' }}>
                <Title order={4} mb="md">Key Highlights (POIs)</Title>
                <List
                  spacing="md"
                  size="sm"
                  icon={
                    <ThemeIcon color="orange" size={24} radius="xl">
                      <MapPin size={14} />
                    </ThemeIcon>
                  }
                >
                  {pois.map((poi, index) => (
                    <List.Item key={index}>
                      <b>{poi.name}</b><br/>
                      <Text size="xs" c="dimmed" mt={4}>{poi.description}</Text>
                    </List.Item>
                  ))}
                </List>
              </Card>
            )}
          </Grid.Col>
        </Grid>
      )}

      {/* Put generate button at the bottom of everything */}
      <Center mt="xl" pb="xl">
        <Button 
          onClick={handleGenerateStory} 
          loading={generating} 
          leftSection={<Sparkles size={16} />} 
          color="grape" 
          size="lg"
        >
          useJetLag
        </Button>
      </Center>
    </Container>
  );
}
