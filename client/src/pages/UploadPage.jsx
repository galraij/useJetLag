import { useState } from 'react';
import { Container, Title, Button, Textarea, Text } from '@mantine/core';
import { useUploadStore } from '../store/uploadStore';
import { extractExif }   from '../hooks/useExif';
import { uploadImages }  from '../api/upload.api';
import { generatePost, createPost } from '../api/posts.api';
import FolderDropZone from '../components/upload/FolderDropZone';
import ImageGrid      from '../components/upload/ImageGrid';

export default function UploadPage() {
  const store       = useUploadStore();
  const [step, setStep] = useState('upload'); // upload | preview | done
  const [loading, setLoading] = useState(false);

  async function handleFiles(files) {
    store.setFiles(files);
    const exifData = await Promise.all(files.map(extractExif));
    store.setExifData(exifData);
    setStep('preview');
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const { data: uploadData } = await uploadImages(store.files);
      store.setImageUrls(uploadData.imageUrls);

      const { data: aiData } = await generatePost({
        imageUrls: uploadData.imageUrls,
        exifData:  store.exifData,
      });
      store.setAiResult(aiData);
      setStep('edit');
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    await createPost({
      imageUrls:    store.imageUrls,
      captionAi:    store.aiCaption,
      captionUser:  store.aiCaption,
      locationName: store.locationName,
      lat:          store.lat,
      lng:          store.lng,
      dateTaken:    store.dateTaken,
      weatherSummary: store.weather?.summary,
      temperature:    store.weather?.temperature,
    });
    store.reset();
    setStep('done');
  }

  if (step === 'done') return <Container pt="xl"><Title order={2}>הפוסט פורסם!</Title></Container>;

  return (
    <Container pt="xl" size="md">
      <Title order={2} mb="lg">יצירת פוסט חדש</Title>

      {step === 'upload' && <FolderDropZone onFiles={handleFiles} />}

      {step === 'preview' && (
        <>
          <ImageGrid files={store.files} exifData={store.exifData} />
          <Button mt="lg" loading={loading} onClick={handleGenerate}>
            ✨ נתח עם AI
          </Button>
        </>
      )}

      {step === 'edit' && (
        <>
          <Title order={3}>{store.aiTitle}</Title>
          <Textarea
            mt="sm" minRows={8} autosize
            value={store.aiCaption}
            onChange={(e) => useUploadStore.setState({ aiCaption: e.target.value })}
          />
          {store.locationName && <Text mt="xs" c="dimmed">📍 {store.locationName}</Text>}
          {store.weather && <Text c="dimmed">🌤 {store.weather.summary}, {Math.round(store.weather.temperature)}°C</Text>}
          <Button mt="lg" onClick={handlePublish}>פרסם</Button>
        </>
      )}
    </Container>
  );
}
