import React, { useEffect, useState } from 'react';
import { client } from '../sanity';
import HeroSection from '../components/PageSections/HeroSection';
import TextBlock from '../components/PageSections/TextBlock';
import { Box, Loader, Center } from '@mantine/core';

// Define interfaces for the Sanity data structure
interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

interface HeroSectionData {
  _type: 'heroSection';
  title: string;
  subtitle?: string;
  image?: SanityImage;
}

interface TextBlockData {
  _type: 'textBlock';
  content: any[]; // PortableText content
}

type Section = HeroSectionData | TextBlockData;

interface HomepageData {
  _id: string;
  _type: 'homepage';
  title: string;
  slug: { current: string };
  sections: Section[];
}

async function fetchHomepage(slug: string): Promise<HomepageData | null> {
  const query = `*[_type == "homepage" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    sections[]{
      _type,
      _key,
      title,
      subtitle,
      image,
      content
    }
  }`;
  const homepage = await client.fetch(query, { slug });
  return homepage;
}

const HomePage: React.FC = () => {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Assuming you want to fetch the homepage with a specific slug, e.g., 'home'
    fetchHomepage('home')
      .then((data) => {
        if (data) {
          setHomepageData(data);
        } else {
          setError('Homepage not found.');
        }
      })
      .catch((err) => {
        console.error("Failed to fetch homepage:", err);
        setError('Failed to load homepage content.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center style={{ height: '100vh' }}>
        <Text color="red">{error}</Text>
      </Center>
    );
  }

  if (!homepageData || !homepageData.sections) {
    return (
      <Center style={{ height: '100vh' }}>
        <Text>No content available for this homepage.</Text>
      </Center>
    );
  }

  return (
    <Box>
      {homepageData.sections.map((section, index) => {
        switch (section._type) {
          case 'heroSection':
            return <HeroSection key={section._key || index} {...section} />;
          case 'textBlock':
            return <TextBlock key={section._key || index} {...section} />;
          default:
            return <Text key={section._key || index} color="red">Unknown section type: {section._type}</Text>;
        }
      })}
    </Box>
  );
};

export default HomePage;
