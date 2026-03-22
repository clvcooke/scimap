import React from 'react';
import { Box, Title, Text, Container, Image } from '@mantine/core';
import { urlFor } from '../../sanity'; // Assuming urlFor utility exists or will be created

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  image?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, image }) => {
  return (
    <Box
      style={{
        position: 'relative',
        height: '400px', // Adjust as needed
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
        marginBottom: '2rem',
      }}
    >
      {image && urlFor && (
        <Image
          src={urlFor(image).url()}
          alt={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
            filter: 'brightness(50%)', // Darken image for better text readability
          }}
        />
      )}
      <Container size="md" style={{ position: 'relative', zIndex: 1 }}>
        <Title size="h1" c="white">{title}</Title>
        {subtitle && <Text size="xl" mt="md" c="white">{subtitle}</Text>}
      </Container>
    </Box>
  );
};

export default HeroSection;
