import { Card, ActionIcon, TextInput, Textarea, Title, Box } from '@mantine/core';
import { X } from 'lucide-react';

/**
 * TripOverview Component
 * Renders the editable title and summary as separate UI elements.
 */
export default function TripOverview({ trip, setTrip, isPub }) {
  if (!trip.story_summary) return null;

  return (
    <Box mb="xl">
      {/* 1. The Overview Title (Separate from the card) */}
      <TextInput 
        size="xl" 
        variant="unstyled" 
        value={trip.overview_title || "Trip Overview"} 
        readOnly={isPub}
        styles={{ 
          input: { 
            color: 'var(--mantine-preferred-grape-7, #be4bdb)', 
            fontWeight: 800, 
            paddingLeft: 0, 
            fontSize: '1.8rem',
            marginBottom: '0.5rem'
          } 
        }}
        onChange={(e) => setTrip({ ...trip, overview_title: e.currentTarget.value })}
      />

      {/* 2. The Summary Content (In its own card) */}
      <Card shadow="sm" p="lg" radius="md" bg="gray.1" withBorder style={{ position: 'relative' }}>
        {!isPub && (
          <ActionIcon 
            size="sm" color="red" variant="subtle" title="Delete Overview" 
            style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }} 
            onClick={() => setTrip({ ...trip, story_summary: '' })}
          >
            <X size={16} />
          </ActionIcon>
        )}
        
        <Textarea 
          autosize 
          size="lg" 
          variant="unstyled" 
          value={trip.story_summary} 
          readOnly={isPub}
          styles={{ 
            input: { 
              color: '#000', 
              lineHeight: 1.6, 
              paddingLeft: isPub ? '0' : '24px' 
            } 
          }}
          onChange={(e) => setTrip({ ...trip, story_summary: e.currentTarget.value })}
        />
      </Card>
    </Box>
  );
}
