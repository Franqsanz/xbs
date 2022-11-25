import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Box, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { Helmet } from 'react-helmet';

import { useBook } from '../hooks/querys';
import { Title } from '../components/Title';
import { categoryLinks } from '../components/links';
import { TagComponent } from '../components/TagComponent';

export function Book() {
  const { id } = useParams();
  const borderCard = useColorModeValue('gray.200', 'gray.600');

  const { data } = useBook(id);

  return (
    <>
      <Title title={`${data.title} | XBuniverse`} />
      <Flex
        w='full'
        maxW='1300px'
        m='auto'
        mb='28'
        align='flex-start'
        direction={{ base: 'column', lg: 'row' }}
      >
        <Flex
          w='full'
          maxW='920px'
          direction='column'
          justify='center'
          p={{ base: 5, md: 14 }}
          m='2rem auto'
        >
          <Box>
            <TagComponent name={data.category} />
          </Box>
          <Box
            as='h1'
            fontSize={{ base: '3xl', md: '4xl' }}
            my='5'
            textTransform='uppercase'
          >
            {data.title}
          </Box>
          <Box
            my='1'
            fontSize={{ base: 'lg', md: '2xl' }}
            textTransform='uppercase'
          >
            {data.author}
          </Box>
          <Box mt='5'>
            <Box as='span' fontSize='xl'>
              Sinopsis
            </Box>
            <Text mt='3' mb='14'>
              {data.synopsis}
            </Text>
          </Box>
          {data.description === undefined ? (
            <Box mt='5' display='none'>
              <Box as='span' fontSize='xl'>
                Descripción
              </Box>
              <Text mt='3' mb='14'>
                {data.description}
              </Text>
            </Box>
          ) : (
            <Box mt='5'>
              <Box as='span' fontSize='xl'>
                Descripción
              </Box>
              <Text mt='3' mb='14'>
                {data.description}
              </Text>
            </Box>
          )}
          <Box
            bg={useColorModeValue('gray.100', 'gray.700')}
            p='4'
            rounded='lg'
          >
            <Box>
              <Box as='span' fontSize='lg'>
                Año:
              </Box>{' '}
              {data.year}
            </Box>
            <Box>
              <Box as='span' fontSize='lg'>
                N° paginas:
              </Box>{' '}
              {data.numberPages}
            </Box>
            <Box>
              <Box as='span' fontSize='lg'>
                Idioma:
              </Box>{' '}
              {data.language}
            </Box>
          </Box>
          <Box mt='10' mb='10px'>
            <Link
              w={{ base: '100%', md: '115px' }}
              display='block'
              href={data.sourceLink}
              isExternal
              bg='#2de000'
              color='black'
              p='3'
              rounded='10'
              textAlign='center'
              _hover={{ outline: 'none', bg: '#28c900' }}
            >
              <Flex align='center'>
                Ver Libro
                <FiExternalLink style={{ marginLeft: '6px' }} />
              </Flex>
            </Link>
          </Box>
        </Flex>
        <Flex w={{ base: 'full', lg: '400px' }} px='3'>
          <Box
            maxW={{ base: '920px', lg: '300px' }}
            p={{ base: 5, md: 10 }}
            m='2rem auto'
            rounded='10'
            border='1px'
            borderColor={borderCard}
            boxShadow='lg'
          >
            <Box mb='4' fontSize='2xl' textAlign='center'>
              Categorias
            </Box>
            {categoryLinks.map(({ name }) => (
              <Link
                key={name}
                as={NavLink}
                to={`/categories/${name}`}
                _hover={{ outline: 'none' }}
              >
                <TagComponent name={name} m='1' />
              </Link>
            ))}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
