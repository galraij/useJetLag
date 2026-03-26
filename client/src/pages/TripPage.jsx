import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Loader, Center, Text, Button, Card, List, ThemeIcon, Grid, Box, SimpleGrid, TextInput, Textarea, ActionIcon, Group } from '@mantine/core';
import { Sparkles, MapPin, X, Check } from 'lucide-react';
import { getTripBySlug, generateTripStory, publishTripStory } from '../api/trips.api';
import { deletePicture } from '../api/upload.api';
import PictureItem from '../components/upload/PictureItem';

export default function TripPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState({});
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await getTripBySlug(slug);
        
        let loadedTrip = data.trip || {};
        // Ensure POIs are always parsed
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
  }, [slug]);

  async function handleDeletePicture(id) {
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
      navigate(`/trip/${data.trip.slug}`);
    } catch (err) {
      console.error(err);
      alert('Failed to publish story');
    } finally {
      setPublishing(false);
    }
  }

  const pois = trip.points_of_interest || [];

  // Group pictures into chunks of 1 or 2 for a dynamic magazine layout
  const groupedPictures = [];
  let idx = 0;
  while (idx < pictures.length) {
    const size = (groupedPictures.length % 2 === 0) ? 1 : 2;
    groupedPictures.push(pictures.slice(idx, idx + size));
    idx += size;
  }

  return (
    <Container pt="xl" size="xl">
      {/* Title only shows if it's genuinely generated or not 'trip1' */}
      {trip.title && trip.title !== 'trip1' && (
        <Textarea
          autosize
          mb="xl"
          size="xl"
          variant="unstyled"
          styles={{ input: { fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', lineHeight: 1.3 } }}
          value={trip.title}
          onChange={(e) => setTrip({ ...trip, title: e.currentTarget.value })}
          placeholder="Your Trip Title"
        />
      )}

      {loading ? (
        <Center mt="xl"><Loader /></Center>
      ) : pictures.length === 0 ? (
        <Center mt="xl"><Text c="dimmed">No pictures found for this trip.</Text></Center>
      ) : (
        <Grid gutter="xl">
          {/* Timeline and Pictures column */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {trip.story_summary && (
              <Card shadow="sm" p="lg" radius="md" mb="xl" bg="gray.1" withBorder style={{ position: 'relative' }}>
                <ActionIcon 
                  size="sm" 
                  color="red" 
                  variant="subtle" 
                  title="Delete Overview" 
                  style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }} 
                  onClick={() => setTrip({ ...trip, story_summary: '' })}
                >
                  <X size={16} />
                </ActionIcon>
                <Title order={3} c="grape.7" mb="sm" pl={24}>Trip Overview</Title>
                <Textarea 
                  autosize 
                  size="lg" 
                  variant="unstyled" 
                  value={trip.story_summary} 
                  styles={{ input: { color: '#000', lineHeight: 1.6, paddingLeft: '8px' } }}
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
                        <ActionIcon 
                          size="sm" 
                          color="red" 
                          variant="subtle" 
                          title="Delete Paragraph"
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
                        <Textarea
                          autosize
                          size="lg"
                          variant="unstyled"
                          value={combinedSegment}
                          styles={{ input: { color: '#000', border: 'none', background: 'transparent', lineHeight: 1.6, paddingLeft: '24px' } }}
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

          {/* POI Sidebar Column */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            {pois.length > 0 && (
              <Card shadow="sm" p="lg" radius="md" withBorder style={{ position: 'sticky', top: '20px' }}>
                <Title order={4} mb="md">Key Highlights</Title>
                <List
                  spacing="lg"
                  size="sm"
                  icon={
                    <ThemeIcon color="orange" size={24} radius="xl" mt={4}>
                      <MapPin size={14} />
                    </ThemeIcon>
                  }
                >
                  {pois.map((poi, idxPoi) => (
                    <List.Item key={idxPoi}>
                      <Group justify="flex-start" align="flex-start" wrap="nowrap" gap="xs">
                        <ActionIcon size="sm" color="red" variant="subtle" mt={2} onClick={() => {
                          setTrip({ ...trip, points_of_interest: pois.filter((_, i) => i !== idxPoi) });
                        }}>
                          <X size={16} />
                        </ActionIcon>
                        <Box style={{ flex: 1 }}>
                          <TextInput 
                            variant="unstyled" 
                            fw="bold" 
                            value={poi.name} 
                            onChange={(e) => {
                              const newPois = [...pois];
                              newPois[idxPoi].name = e.currentTarget.value;
                              setTrip({ ...trip, points_of_interest: newPois });
                            }}
                          />
                          <Textarea
                            autosize
                            variant="unstyled"
                            size="xs"
                            c="dimmed"
                            value={poi.description}
                            onChange={(e) => {
                              const newPois = [...pois];
                              newPois[idxPoi].description = e.currentTarget.value;
                              setTrip({ ...trip, points_of_interest: newPois });
                            }}
                          />
                        </Box>
                      </Group>
                    </List.Item>
                  ))}
                </List>
              </Card>
            )}
          </Grid.Col>
        </Grid>
      )}

      {/* Dynamic Button Area */}
      <Center mt="xl" pb="xl">
        {!isDraft ? (
          <Button 
            onClick={handleGenerateStory} 
            loading={generating} 
            leftSection={<Sparkles size={16} />} 
            color="grape" 
            size="lg"
          >
            useJetLag
          </Button>
        ) : (
          <Button 
            onClick={handlePublish} 
            loading={publishing} 
            leftSection={<Check size={16} />} 
            color="green" 
            size="lg"
          >
            Publish Final Story!
          </Button>
        )}
      </Center>
    </Container>
  );
}







// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import {
//   Container, Title, Text, Button, Grid, Card, Image, Badge,
//   Group, Stack, TextInput, Textarea, Checkbox, Modal,
//   FileInput, AspectRatio, ActionIcon
// } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { Plus, MapPin, Calendar, Upload, Eye, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react';
// import { useTravel } from '../context/TravelContext';

// export default function TripPage() {
//   const { trips, user, createTrip, deleteTrip } = useTravel();
//   const [opened, { open, close }] = useDisclosure(false);
//   const [newTrip, setNewTrip] = useState({
//     coverImage: '',
//     isPublic: true,
//   });
//   const [imagePreview, setImagePreview] = useState('');

//   const userTrips = trips.filter(trip => trip.userId === user?.id);

//   const handleImageUpload = (file) => {
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//         setNewTrip({ ...newTrip, coverImage: reader.result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreateTrip = (e) => {
//     e.preventDefault();
//     const tripId = createTrip(newTrip);
//     close();
//     setNewTrip({ coverImage: '', isPublic: true });
//     setImagePreview('');
//     window.location.href = `/trip/${tripId}/upload`;
//   };

//   return (
//     <Container size="xl" py="xl">

//       {/* Header */}
//       <Stack mb="xl" gap="xs">
//         <Title order={1}>My Trips</Title>
//         <Text c="dimmed">Manage your travel stories and adventures</Text>
//       </Stack>

//       {/* Create Trip Button */}
//       <Button
//         leftSection={<Plus size={18} />}
//         mb="xl"
//         component={Link}
//         to="/get-started-upload"
//         onClick={open}

//       >
//         Create New Trip
//       </Button>

      
//       {/* Trips Grid */}
//       {
//         userTrips.length === 0 ? (
//           <Stack align="center" py={80}>
//             <Card withBorder radius="lg" p="xl" maw={400} w="100%">
//               <Stack align="center" gap="md">
//                 <Upload size={48} color="gray" />
//                 <Title order={3}>No trips yet</Title>
//                 <Text c="dimmed" ta="center">
//                   Create your first trip and start building your travel story
//                 </Text>
//                 <Button leftSection={<Plus size={18} />} onClick={open}>
//                   Create Trip
//                 </Button>
//               </Stack>
//             </Card>
//           </Stack>
//         ) : (
//           <Grid>
//             {userTrips.map(trip => (
//               <Grid.Col key={trip.id} span={{ base: 12, sm: 6, lg: 4 }}>
//                 <Card withBorder radius="lg" shadow="sm" h="100%">

//                   <Card.Section>
//                     <AspectRatio ratio={16 / 9}>
//                       <Image
//                         src={trip.coverImage}
//                         alt={trip.title}
//                         fallbackSrc="https://placehold.co/400x225?text=No+Image"
//                       />
//                     </AspectRatio>
//                   </Card.Section>

//                   <Stack mt="md" gap="xs">
//                     <Group justify="space-between">
//                       <Title order={4}>{trip.title}</Title>
//                       <Badge color={trip.isPublic ? 'green' : 'gray'} leftSection={trip.isPublic ? <Eye size={12} /> : null}>
//                         {trip.isPublic ? 'Public' : 'Private'}
//                       </Badge>
//                     </Group>

//                     <Group gap="xs">
//                       <MapPin size={14} />
//                       <Text size="sm" c="dimmed">{trip.region}, {trip.country}</Text>
//                     </Group>

//                     <Group gap="xs">
//                       <Calendar size={14} />
//                       <Text size="sm" c="dimmed">{new Date(trip.createdAt).toLocaleDateString()}</Text>
//                     </Group>

//                     <Group gap="xs">
//                       <Upload size={14} />
//                       <Text size="sm" c="dimmed">{trip.images.length} photos</Text>
//                     </Group>
//                   </Stack>

//                   <Group mt="md" gap="xs">
//                     {trip.images.length === 0 ? (
//                       <Button component={Link} to={`/trip/${trip.id}/upload`} flex={1} size="sm">
//                         Upload Photos
//                       </Button>
//                     ) : trip.blogContent ? (
//                       <Button component={Link} to={`/trip/${trip.id}`} flex={1} size="sm">
//                         View Story
//                       </Button>
//                     ) : (
//                       <Button component={Link} to={`/trip/${trip.id}/generate`} flex={1} size="sm" color="orange">
//                         Generate Blog
//                       </Button>
//                     )}

//                     <ActionIcon
//                       color="red"
//                       variant="light"
//                       size="lg"
//                       onClick={() => { if (confirm('Delete this trip?')) deleteTrip(trip.id); }}
//                     >
//                       <Trash2 size={16} />
//                     </ActionIcon>
//                   </Group>

//                 </Card>
//               </Grid.Col>
//             ))}
//           </Grid>
//         )
//       }

//     </Container >
//   );
// }