import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Title, Loader, Center, Text, Button, Card, List, ThemeIcon, Grid, Box, SimpleGrid, TextInput, Textarea, ActionIcon, Group } from '@mantine/core';
import { Sparkles, MapPin, X, Check } from 'lucide-react';
import { getTripBySlug, generateTripStory, publishTripStory } from '../api/trips.api';
import { deletePicture } from '../api/upload.api';
import PictureItem from '../components/upload/PictureItem';
import useAuth from '../hooks/useAuth';

export default function TripPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  const [trip, setTrip] = useState({});
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Check for pending publish in local storage
        const pendingDataStr = localStorage.getItem('pendingTripPublish');
        if (pendingDataStr && isLoggedIn) {
          try {
            const { trip: savedTrip, pictures: savedPictures } = JSON.parse(pendingDataStr);
            if (savedTrip.slug === slug) {
              // Restore the edited draft state so the user can review and click Publish
              // Works for both existing-user login AND new-user registration flows
              const restoredTrip = {
                ...savedTrip,
                points_of_interest: typeof savedTrip.points_of_interest === 'string'
                  ? JSON.parse(savedTrip.points_of_interest)
                  : (savedTrip.points_of_interest || [])
              };
              localStorage.removeItem('pendingTripPublish');
              setTrip(restoredTrip);
              setPictures(savedPictures);
              if (restoredTrip.story_summary) setIsDraft(true);
              setLoading(false);
              return; // Skip normal fetch — restored from pending draft
            }
          } catch (err) {
            console.error("Draft restore failed", err);
            localStorage.removeItem('pendingTripPublish');
          }
        }

        const { data } = await getTripBySlug(slug);
        
        let loadedTrip = data.trip || {};
        if (typeof loadedTrip.points_of_interest === 'string') {
          loadedTrip.points_of_interest = JSON.parse(loadedTrip.points_of_interest);
        }
        
        setTrip(loadedTrip);
        setPictures(data.pictures || []);
        if (loadedTrip.story_summary) setIsDraft(true);
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
  }, [slug, isLoggedIn]);

  async function handleDeletePicture(id) {
    // Block delete only when the trip is published AND we're not actively editing it
    if (trip.is_published && !isEditingMode) return;

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
      const geminiJSON = data.geminiJSON;
      
      setTrip(prev => ({
        ...prev,
        title: geminiJSON.catchy_title,
        story_summary: geminiJSON.full_narrative_summary,
        points_of_interest: geminiJSON.points_of_interest
      }));

      setPictures(prev => prev.map(pic => {
        const aiMatch = geminiJSON.photos.find(p => p.image_id === String(pic.id));
        if (aiMatch) {
          return { ...pic, punchy_description: aiMatch.punchy_description, story_segment: aiMatch.associated_story_segment };
        }
        return pic;
      }));

      setIsDraft(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate story. Check your Gemini API Key!');
    } finally {
      setGenerating(false);
    }
  }

  async function handlePublish() {
    if (!isLoggedIn) {
      localStorage.setItem('pendingTripPublish', JSON.stringify({ trip, pictures }));
      navigate('/login', { state: { from: `/trip/${slug}` } });
      return;
    }
    setPublishing(true);
    try {
      const payload = {
        title: trip.title,
        story_summary: trip.story_summary,
        points_of_interest: trip.points_of_interest,
        pictures: pictures.map(p => ({
          id: p.id,
          punchy_description: p.punchy_description,
          story_segment: p.story_segment
        }))
      };
      const { data } = await publishTripStory(slug, payload);
      setTrip(data.trip);
      setPictures(data.pictures || []);
      setIsEditingMode(false);
      // Show the published story immediately
      navigate(`/trip/${data.trip.slug}`, { replace: true });
    } catch (err) {
      console.error(err);
      alert('Failed to publish story');
    } finally {
      setPublishing(false);
    }
  }

  const pois = trip.points_of_interest || [];

  const groupedPictures = [];
  let idx = 0;
  while (idx < pictures.length) {
    const size = (groupedPictures.length % 2 === 0) ? 1 : 2;
    groupedPictures.push(pictures.slice(idx, idx + size));
    idx += size;
  }

  const isPub = trip.is_published && !isEditingMode;

  return (
    <Container pt="xl" size="xl">
      {isLoggedIn && user && (trip.user_id === user.id || user.role === 'admin') && trip.is_published && (
        <Group justify="flex-end" mb="md">
          <Button variant="light" onClick={() => setIsEditingMode(!isEditingMode)}>
            {isEditingMode ? 'Cancel Edit' : 'Edit Trip'}
          </Button>
        </Group>
      )}

      {trip.title && trip.title !== 'trip1' && (
        <Center style={{ flexDirection: 'column' }} mb="xl">
          <Textarea
            autosize
            size="xl"
            variant="unstyled"
            readOnly={isPub}
            styles={{ input: { fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', lineHeight: 1.3 } }}
            value={trip.title}
            onChange={(e) => setTrip({ ...trip, title: e.currentTarget.value })}
            placeholder="Your Trip Title"
          />
          {trip.user_name && (
            <Text c="dimmed" size="lg" mt={-10} fw={500}>By {trip.user_name}</Text>
          )}
        </Center>
      )}

      {loading ? (
        <Center mt="xl"><Loader /></Center>
      ) : pictures.length === 0 ? (
        <Center mt="xl"><Text c="dimmed">No pictures found for this trip.</Text></Center>
      ) : (
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            {trip.story_summary && (
              <Card shadow="sm" p="lg" radius="md" mb="xl" bg="gray.1" withBorder style={{ position: 'relative' }}>
                {!isPub && (
                  <ActionIcon 
                    size="sm" color="red" variant="subtle" title="Delete Overview" 
                    style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }} 
                    onClick={() => setTrip({ ...trip, story_summary: '' })}
                  >
                    <X size={16} />
                  </ActionIcon>
                )}
                <Title order={3} c="grape.7" mb="sm" pl={isPub ? 0 : 24}>Trip Overview</Title>
                <Textarea 
                  autosize size="lg" variant="unstyled" value={trip.story_summary} readOnly={isPub}
                  styles={{ input: { color: '#000', lineHeight: 1.6, paddingLeft: isPub ? '0' : '8px' } }}
                  onChange={(e) => setTrip({ ...trip, story_summary: e.currentTarget.value })}
                />
              </Card>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {groupedPictures.map((group, groupIndex) => {
                const segment1 = group[0].story_segment;
                const segment2 = group[1]?.story_segment;
                const combinedSegment = segment1 && segment2 && segment1 !== segment2 ? `${segment1}\n\n${segment2}` : (segment1 || segment2);

                return (
                  <div key={`group-${groupIndex}`}>
                    {combinedSegment && (
                      <Card shadow="sm" p="lg" radius="md" mb="md" bg="gray.1" withBorder style={{ position: 'relative' }}>
                        {!isPub && (
                          <ActionIcon 
                            size="sm" color="red" variant="subtle" title="Delete Paragraph"
                            style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
                            onClick={() => {
                              setPictures(prev => {
                                const newPics = [...prev];
                                const p1 = newPics.findIndex(p => p.id === group[0].id);
                                if (p1 > -1) newPics[p1].story_segment = '';
                                if (group[1]) {
                                  const p2 = newPics.findIndex(p => p.id === group[1].id);
                                  if (p2 > -1) newPics[p2].story_segment = '';
                                }
                                return newPics;
                              });
                            }}
                          >
                            <X size={14} />
                          </ActionIcon>
                        )}
                        <Textarea
                          autosize size="lg" variant="unstyled" value={combinedSegment} readOnly={isPub}
                          styles={{ input: { color: '#000', border: 'none', background: 'transparent', lineHeight: 1.6, paddingLeft: isPub ? '0' : '24px' } }}
                          onChange={(e) => {
                            const val = e.currentTarget.value;
                            setPictures(prev => {
                              const newPics = [...prev];
                              const picIndex = newPics.findIndex(p => p.id === group[0].id);
                              if (picIndex > -1) newPics[picIndex].story_segment = val;
                              if (group[1]) {
                                const picIndex2 = newPics.findIndex(p => p.id === group[1].id);
                                if (picIndex2 > -1) newPics[picIndex2].story_segment = '';
                              }
                              return newPics;
                            });
                          }}
                        />
                      </Card>
                    )}
                    
                    <SimpleGrid cols={{ base: 1, sm: group.length }} spacing="lg">
                      {group.map((pic) => (
                        <PictureItem 
                          key={pic.id} 
                          picture={pic} 
                          isPublished={isPub}
                          onDelete={handleDeletePicture}
                          onDescChange={(newDesc) => {
                            setPictures(prev => prev.map(p => p.id === pic.id ? { ...p, punchy_description: newDesc } : p));
                          }}
                        />
                      ))}
                    </SimpleGrid>
                  </div>
                );
              })}
            </div>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            {pois.length > 0 && (
              <Card shadow="sm" p="lg" radius="md" withBorder style={{ position: 'sticky', top: '20px' }}>
                <Title order={4} mb="md">Key Highlights</Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {pois.map((poi, idxPoi) => (
                    <div key={idxPoi} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%' }}>
                      <ThemeIcon color="orange" size={24} radius="xl" mt={4} style={{ flexShrink: 0 }}>
                        <MapPin size={14} />
                      </ThemeIcon>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        <Group justify="space-between" align="flex-start" wrap="nowrap" style={{ width: '100%' }}>
                          <TextInput 
                            w="100%"
                            variant="unstyled" fw="bold" value={poi.name} readOnly={isPub}
                            onChange={(e) => {
                              const newPois = [...pois];
                              newPois[idxPoi].name = e.currentTarget.value;
                              setTrip({ ...trip, points_of_interest: newPois });
                            }}
                            styles={{ input: { padding: 0 } }}
                          />
                          {!isPub && (
                            <ActionIcon size="sm" color="red" variant="subtle" onClick={() => {
                              setTrip({ ...trip, points_of_interest: pois.filter((_, i) => i !== idxPoi) });
                            }}>
                              <X size={16} />
                            </ActionIcon>
                          )}
                        </Group>
                        <Textarea
                          w="100%"
                          autosize variant="unstyled" size="sm" c="dimmed" value={poi.description} readOnly={isPub}
                          onChange={(e) => {
                            const newPois = [...pois];
                            newPois[idxPoi].description = e.currentTarget.value;
                            setTrip({ ...trip, points_of_interest: newPois });
                          }}
                          styles={{ input: { padding: 0, lineHeight: 1.5 } }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </Grid.Col>
        </Grid>
      )}

      {!isPub && (
        <Center mt="xl" pb="xl">
          {!isDraft ? (
            <Button onClick={handleGenerateStory} loading={generating} leftSection={<Sparkles size={16} />} color="grape" size="lg">
              useJetLag
            </Button>
          ) : (
            <Button onClick={handlePublish} loading={publishing} leftSection={<Check size={16} />} color="green" size="lg">
              {isEditingMode ? 'Save Changes' : 'Publish My Trip'}
            </Button>
          )}
        </Center>
      )}

      {isPub && (
        <Center mt="xl" pb="xl">
          <Button component={Link} to="/trip" variant="outline" size="lg" color="gray">
            Back to My Trips
          </Button>
        </Center>
      )}
    </Container>
  );
}