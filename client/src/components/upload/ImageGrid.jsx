import { SimpleGrid, Card, Image, Text, Badge } from '@mantine/core';

export default function ImageGrid({ files, exifData }) {
  return (
    <SimpleGrid cols={3} spacing="sm">
      {files.map((file, i) => {
        const exif = exifData?.[i] || {};
        return (
          <Card key={i} shadow="xs" radius="md" withBorder>
            <Card.Section>
              <Image src={URL.createObjectURL(file)} height={120} fit="cover" alt={file.name} />
            </Card.Section>
            <Text size="xs" fw={500} mt="xs" truncate>{file.name}</Text>
            {exif.date && <Text size="xs" c="dimmed">{exif.date}</Text>}
            {exif.lat
              ? <Badge size="xs" color="green" mt={4}>📍 GPS</Badge>
              : <Badge size="xs" color="gray"  mt={4}>אין מיקום</Badge>
            }
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
