import { useState, useEffect } from 'react';
import { Container, Title, TextInput, SimpleGrid, Loader, Center, Text } from '@mantine/core';
import { getUploadedPictures } from '../api/upload.api';
import PictureItem from '../components/upload/PictureItem';

export default function TripPage() {
  const [title, setTitle] = useState('trip1');
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getUploadedPictures();
        setPictures(data.pictures || []);
      } catch (error) {
        console.error("Failed to load pictures", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Container pt="xl" size="lg">
      <TextInput
        size="xl"
        variant="unstyled"
        styles={{ input: { fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center' } }}
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        mb="xl"
      />

      {loading ? (
        <Center mt="xl"><Loader /></Center>
      ) : pictures.length === 0 ? (
        <Center mt="xl"><Text c="dimmed">No pictures found for this trip.</Text></Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {pictures.map((pic) => (
            <PictureItem key={pic.id} picture={pic} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
