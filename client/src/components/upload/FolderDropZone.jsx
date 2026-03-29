import { useRef } from 'react';
import { Box, Text, Button, Stack } from '@mantine/core';

export default function FolderDropZone({ onFiles }) {
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.items);
    const files = [];
    items.forEach((item) => {
      const f = item.getAsFile();
      if (f && (f.type.startsWith('image/') || f.name.toLowerCase().endsWith('.heic'))) {
        files.push(f);
      }
    });
    if (files.length) onFiles(files);
  }

  return (
    <Box
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #ccc', borderRadius: 12, padding: '3rem',
        textAlign: 'center', cursor: 'pointer',
      }}
      onClick={() => inputRef.current.click()}
    >
      <Stack align="center" gap="sm">
        <Text size="xl">📁</Text>
        <Text fw={500}>Drag & drop your photos here</Text>
        <Text size="sm" c="dimmed">JPG, PNG, HEIC — up to 20 photos</Text>
        <Button variant="outline" onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}>
          Browse Photos
        </Button>
      </Stack>
      <input
        ref={inputRef} type="file" accept="image/*,.heic" multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/') || f.name.toLowerCase().endsWith('.heic'));
          if (files.length) onFiles(files);
        }}
      />
    </Box>
  );
}
