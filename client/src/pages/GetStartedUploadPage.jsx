import { useState } from 'react';
import { Container, Title, Button, Text, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import FolderDropZone from '../components/upload/FolderDropZone';
import { uploadWithExif } from '../api/upload.api';

export default function GetStartedUploadPage() {
  const [loading, setLoading] = useState(false);
  const [uploadedPictures, setUploadedPictures] = useState(null);
  const navigate = useNavigate();

  async function handleFiles(files) {
    setLoading(true);
    try {
      const { data } = await uploadWithExif(files);
      setUploadedPictures(data.pictures);
    } catch (err) {
      console.error(err);
      alert('Failed to upload pictures');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container pt="xl" size="md">
      <Title order={2} mb="lg">Upload Your Adventure</Title>
      
      {!uploadedPictures ? (
        <>
          <Text mb="md">Upload multiple pictures to get started. We will extract EXIF data such as geolocation and timestamps automatically.</Text>
          {loading ? (
            <Text>Uploading and processing images, please wait...</Text>
          ) : (
            <FolderDropZone onFiles={handleFiles} />
          )}
        </>
      ) : (
        <>
          <Title order={3} color="green" mb="md">Successfully Uploaded!</Title>
          <Text mb="lg">Your pictures and their EXIF data have been saved to the database.</Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {uploadedPictures.map((pic, idx) => (
              <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                <img src={pic.url} alt={`Uploaded ${idx}`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                <Text size="sm" mt="sm"><b>Taken:</b> {pic.date_taken ? new Date(pic.date_taken).toLocaleDateString() : 'Unknown'}</Text>
                <Text size="sm"><b>Lat:</b> {pic.latitude || 'Unknown'}</Text>
                <Text size="sm"><b>Lng:</b> {pic.longitude || 'Unknown'}</Text>
              </div>
            ))}
          </div>
          <Group mt="xl">
            <Button onClick={() => setUploadedPictures(null)} variant="outline">Upload More</Button>
            <Button onClick={() => navigate('/trip')} color="orange">View Trip</Button>
          </Group>
        </>
      )}
    </Container>
  );
}
