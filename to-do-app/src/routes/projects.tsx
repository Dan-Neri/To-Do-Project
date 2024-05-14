/**
 * The projects route displays a user's projects and allows them to
 * create new ones. Clicking on a project will redirect to the 
 * project info page.
 */
import { useRef } from 'react';
import { 
    Box,
    Button,
    Flex,
    VStack, 
    Spacer,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    createStandaloneToast,
    FormControl,
    FormLabel,
    Input,
    IconButton
} from '@chakra-ui/react';
import { useLoaderData, redirect, Form, Link } from 'react-router-dom';
import Page from '../components/page';
import Dialog from '../components/dialog';
import { FetchData, UpdateData } from '../api/calls';
import { StatusType, Project, CreateProjectDTO } from '../types/types';
import { DeleteIcon } from '@chakra-ui/icons';

export default function Projects() {
    //Get the list of projects from the loader function.
    const projectList = useLoaderData() as Project[] | null;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const projectRef = useRef(null);
    
    /*Delete a project and all associated Lists, Features, UserStories, and 
    Tasks.*/
    const handleDelete = () => {
        //TODO: Implement delete functionality
        console.log('handle');
    }
    
    return(
        <Page title='Available Projects'>
            <Flex
                w='30%' 
                h='90%' 
                bg='teal.500'
                boxShadow='dark-lg'
                justifyContent='center'
                alignItems='center'
                borderRadius='2xl'
            >
                <Flex 
                    w='98%' 
                    h='98%' 
                    bg='tan'
                    flexDirection='column'
                    alignItems='center'
                    borderRadius='xl'
                >
                    <Button 
                        mt='6px' 
                        w='95%' 
                        colorScheme='blackAlpha'
                        onClick={onOpen}
                    >
                        Create a Project
                    </Button>
                    <Spacer />
                    <Flex 
                        w='95%'
                        h='90%'
                        bg='teal.100'
                        border='2px'
                        flexDirection='column'
                        alignItems='center'
                        borderRadius='md'
                    >
                        {projectList && projectList.length > 0? 
                            projectList.map((project, index) => (
                                <Flex 
                                    key={project.id} 
                                    bg='cyan.400'
                                    h='32px' 
                                    w='90%' 
                                    mt='4px'
                                    alignItems='center' 
                                    justifyContent='space-between'
                                    borderRadius='md'
                                    ref={projectRef}
                                >
                                    <Link 
                                        to={`info?projectID=${project.id}`} 
                                        style={{ flexGrow: 1 }}
                                        
                                    >
                                        <Box ml='4px' textAlign='left'>
                                            {project.title}
                                        </Box>
                                    </Link>
                                    <Box>
                                        <IconButton 
                                            aria-label='Delete Project'
                                            icon={<DeleteIcon />}
                                            colorScheme='blackAlpha'
                                            size='xs'
                                            mr='4px'
                                            onClick={handleDelete}
                                        />
                                    </Box>
                                </Flex>
                                
                            )) : (
                                <Box>
                                    You don't currently have any projects
                                </Box>
                            )
                        }
                    </Flex>
                    <Spacer />
                </Flex>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <Dialog 
                        title='Create a Project' 
                        h='200px' 
                        exit={onClose}
                    >
                        <ModalBody>
                            <Form 
                                method='post' 
                                onSubmit={(event) => onClose()}
                            >
                                <VStack>
                                    <FormControl isRequired>
                                        <FormLabel>
                                            Title: 
                                        </FormLabel>
                                        <Input 
                                            bg='white'  
                                            name='title' 
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
                                        Create
                                    </Button>
                                </VStack>
                            </Form>
                        </ModalBody>
                    </Dialog>
                </ModalContent>
            </Modal>
        </Page>
    );
}

/*Fetch a list of the user's projects by making a request to the 
back-end API. Redirect to the sign in page if authorization is 
invalid.*/
export async function loader(
    { request }: { request: Request}
): Promise<Project[] | Response> {
    /*Create a toast container which can be displayed outside of our 
    react component.*/
    const { toast } = createStandaloneToast();
    try {
        //Send a request to the API to get the user's projects.
        const response = await FetchData('/projects');
        if (response) {
            //Return a list of projects in the user's account.
            return response.data;
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
                return redirect('/sign-in');
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
            return redirect('/sign-in');
        }
    }
    return redirect('/projects');
}

//Add a new project to the user's account.
export async function action({ request }: { request: Request}) {
    const formData = await request.formData();
    const { toast } = createStandaloneToast();
    /*Get the project data from the form and create an object to send it
    to the API.*/
    const title = formData.get('title') as string;
    const description = formData.get('description') as string ?? undefined;
    const DTO: CreateProjectDTO = { 
        title: title, 
        description: description
    };
    
    try {
        /*Send a request to the API to create a new project with the 
        data in the body.*/
        const response = await UpdateData('/projects/create', DTO);
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
                return redirect('/sign-in');
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
            return redirect('/sign-in');
        }
    }
    return redirect('/projects');
}