/**
 * The ListComponent is the highest level component in the project
 * workflow and is used to express the state of each feature.
 */
import React, { FormEvent, useState, useEffect } from 'react';
import { 
    Button,
    Flex,
    VStack,
    Spacer,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Divider
} from '@chakra-ui/react';
import { useNavigate, Form } from 'react-router-dom';
import { StatusType, List, CreateFeatureDTO } from '../types/types';
import Dialog from '../components/dialog';
import { UpdateData } from '../api/calls';
import FeatureComponent from '../components/feature-component';

interface ListProps {
    id: string;
    projectID: string;
    lists: List[];
    setLists: React.Dispatch<React.SetStateAction<List[]>>;
    w?: string;
    h?: string;
    title?: string;
}

const ListComponent = (props: ListProps) => {
    const { 
        id,
        projectID,
        lists,
        setLists,
        w='20%', 
        h='10%', 
        title='add a title'
    } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();
    /*Find this specific list and create a state variable to hold a list
    of all features associated with it.*/
    const list = lists.find(list => list.id === id);
    const [features, setFeatures] = useState(
        list? list.features : []
    );
    
    //Update features any time the lists state is updated.
    useEffect(() => {
        const list = lists.find(list => list.id === id);
        setFeatures(list? list.features : []);
    }, [lists])
    
    //Add a feature to this list.
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        /*Prevent the form from sending a traditional POST request when
        submitted which would refresh the page needlessly*/
        event.preventDefault();
        //Pull the feature data from the form.
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const featureTitle = formData.get('title') as string;
        const featureDescription = formData.get('description');
        //Create an object with the new feature data.
        const DTO: CreateFeatureDTO = {
            projectID: projectID,
            listID: id, 
            title: featureTitle,
            description: featureDescription as string ?? undefined
        };
        try {
            //Send a POST request to the back-end API to create the feature.
            const response = await UpdateData(
                    `/features/create`,
                    DTO
            );
            if (response) {
                //Find the index of this specific list.
                const listIndex = lists.findIndex(list => list.id === id);
                //Throw an error if the list is not found.
                if (listIndex === -1) {
                    toast({
                        title: 'Error',
                        description: 'Unable to find list',
                        status: 'error' as StatusType,
                        duration: 4000,
                        isClosable: true
                    });
                }
                //Create a copy of the entire lists state.
                const newLists = lists.slice();
                /*Update the list of features for this specific list
                with the new feature added.*/
                newLists[listIndex].features = response.data;
                setLists(newLists);
            }
        } catch (error: any) {
            if(error.response) {
                toast({
                    title: 'Error',
                    description: error.response.data.message,
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
                if(error.response.data.message.includes('Authorization')) {
                    navigate('/sign-in')
                    return;
                }
            } else {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
            }
            if(error.message.includes('Authorization')) {
                navigate('/sign-in');
                return;
            }
        }
    }
    
    return (
        <Flex
            w='20%' 
            ml='4px'
            padding='3px'
            bg='teal.500'
            boxShadow='lg'
            justifyContent='center'
            alignItems='center'
            borderRadius='xl'
        >
            <Flex 
                w='99%'
                bg='teal.100'
                flexDirection='column'
                alignItems='center'
                borderRadius='xl'
            >
                <Flex
                    w='100%'
                    justify='center'
                    align='center' 
                    bg='cyan.300'
                    borderTopRadius='xl'
                >
                    {title}
                </Flex>
                <Spacer />
                <VStack 
                    w='100%' 
                    mt='4px' 
                    mb='4px' 
                    spacing='0' 
                    divider={<Divider />}
                >
                    {features && features.length > 0 && features.map(
                        (feature, index) => (
                            <FeatureComponent 
                                key={feature.id}
                                id={feature.id}
                                projectID={projectID && projectID}
                                listID={id}
                                lists={lists}
                                setLists={setLists}
                                title={feature.title}
                                description={feature.description}
                            />
                        )
                    )}
                </VStack>
                <Button 
                    h='30px'
                    w='100%' 
                    bg='teal.200'
                    borderTopRadius='0'
                    borderBottomRadius='xl'
                    onClick={onOpen}
                >
                    Add a Feature
                </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <Dialog 
                        title='Add a Feature'
                        h='280px'
                        exit={onClose}
                    >
                        <ModalBody>
                            <Form onSubmit={(event) => { 
                                handleSubmit(event); 
                                onClose();
                            }}>
                                <VStack>
                                    <FormControl isRequired>
                                        <FormLabel>
                                            Title: 
                                        </FormLabel>
                                        <Input 
                                            bg='white' 
                                            name='title'
                                            placeholder='Please enter a title'
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>
                                            Description: 
                                        </FormLabel>
                                        <Input 
                                            bg='white' 
                                            name='description' 
                                        />
                                    </FormControl>
                                    <Button 
                                        type='submit' 
                                    >
                                        Create Feature
                                    </Button>
                                </VStack>
                            </Form>
                        </ModalBody>
                    </Dialog>
                </ModalContent>
            </Modal>
        </Flex>
    )
}

export default ListComponent;