import React from 'react';
import { Container, Box } from '@mantine/core';
import { PortableText } from '@portabletext/react';

interface TextBlockProps {
  content: any[]; // PortableText content
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  return (
    <Container size="md" mb="xl">
      <Box style={{ textAlign: 'left' }}>
        <PortableText value={content} />
      </Box>
    </Container>
  );
};

export default TextBlock;
