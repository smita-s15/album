import { Box, Text, Flex, Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState, useMemo } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons';

function Album() {
    const [albums, setAlbums] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [search , setSearch] = useState([]);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/albums')
            .then(res => {
                setAlbums(res.data)
            })
            .catch(err => {
            })
           
            axios.get('https://jsonplaceholder.typicode.com/photos')
            .then(res => {
                setPhotos(res.data)
            })
            .catch(err => {
            })
    }, [])

    const data = useMemo(() => {
        if(!search) {
            const resp = albums?.map((album) => {
                const photo = photos?.filter((photo) => photo.albumId === album.id)
                const temp = {
                    ...album,
                    photo
                }
                return temp
            })
            return resp
        }
        else {
            const filteredPhotos = photos?.filter((photo) => photo.title.includes(search))
            const filteredAlbums = albums?.filter((album) => album.title.includes(search) ||
            filteredPhotos.find((photo) => {
                return photo.albumId === album.id
            }))
            const filteredResp = filteredAlbums?.map((album) => {
                const photo = filteredPhotos?.filter((photo) => photo.albumId === album.id)
                const tempResp = {
                    ...album,
                    photo
                }
                return tempResp
            })
            return filteredResp 
        }

    }, [albums, photos, search])




  return (
   <Stack mx="auto">
       <InputGroup mt={3} p={4} bgColor='gray.100' variant='unstyled' borderRadius={10}>
           <Input placeholder='See your financial report' value={search} onChange={(e) => setSearch(e.target.value)} />
           <InputRightElement children ={<ChevronRightIcon color='gray.500' mt={5} />} />
       </InputGroup>
       <Flex direction='column' width='100%' >
           {data?.map((item) => (
               <Box key={item?.id} my={2}>
                   <Text fontSize='20px' fontWeight='bold' borderRadius={1} alignItems='center' color='gray.800' key={item?.id}> { item?.title} </Text>

                   {item?.photo?.slice(0, 5)?.map((photo) => {
                       return (
                           <Flex key={photo.id} m='2' align='center'>
                               <Flex key={photo?.id} w='3rem' h='3rem'>
                                   <img src={photo.url}></img>
                               </Flex>
                               <Flex direction='column' m='2'>
                                   <Text fontSize='20px' fontWeight='bold'>{photo?.title}</Text>
                                   <Text color='blue.500' as='u'> <a href={photo.url} target="_blank" >{photo.url}</a> </Text>
                               </Flex>
                           </Flex>
                       )
                   })}
               </Box>
           ))}
       </Flex>
   </Stack>
  )
}

export default Album