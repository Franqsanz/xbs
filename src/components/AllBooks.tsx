import React, { useEffect } from 'react';
import {
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Text,
} from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';

import { CardProps } from './types';
import { useBooksPaginate } from '../hooks/querys';
import { MySimpleGrid } from './MySimpleGrid';
import { Card } from './card/Card';
import { Aside } from './Aside';

export function AllBooks() {
  const { ref, inView } = useInView();
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    useBooksPaginate();
  let fetchingNextPageUI;

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  if (isLoading) {
    return (
      <Flex justify='center' py={{ base: '25vh', md: '40vh' }}>
        <Spinner size='xl' thickness='4px' speed='0.40s' />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert
        status='error'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='500px'
      >
        <AlertIcon boxSize='50px' />
        <AlertTitle mt='5' fontSize='xl'>
          No se pudieron obtener los datos
        </AlertTitle>
      </Alert>
    );
  }

  if (isFetchingNextPage) {
    fetchingNextPageUI = (
      <Box p='10' textAlign='center'>
        <Spinner size='xl' thickness='4px' speed='0.40s' />
      </Box>
    );
  }

  return (
    <>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        px={{ base: 5, md: 10, '2xl': 16 }}
      >
        <Aside>
          <Box mt={{ base: '7', md: '97px' }}>
            <Flex textAlign={{ base: 'center', lg: 'left' }} direction='column'>
              <Box as='span' fontSize='2xl' fontWeight='bold'>
                Catálogo de Libros
              </Box>
              <Text mt='2'>
                Explora todos los libros publicados y encuentra tu próxima
                lectura favorita.
              </Text>
              <Text mt='5'>
                "Un libro es un sueño que sostienes en tus manos" -{' '}
                <Box as='span' fontWeight='500'>
                  Neil Gaiman
                </Box>
                .
              </Text>
            </Flex>
          </Box>
        </Aside>
        <MySimpleGrid>
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.results.map(
                ({
                  id,
                  title,
                  synopsis,
                  author,
                  category,
                  sourceLink,
                  image,
                }: CardProps) => (
                  <React.Fragment key={id}>
                    <Card
                      id={id}
                      category={category}
                      title={title}
                      author={author}
                      synopsis={synopsis}
                      sourceLink={sourceLink}
                      image={image}
                    />
                  </React.Fragment>
                ),
              )}
            </React.Fragment>
          ))}
        </MySimpleGrid>
      </Flex>
      <Box ref={ref}>{fetchingNextPageUI}</Box>
    </>
  );
}
