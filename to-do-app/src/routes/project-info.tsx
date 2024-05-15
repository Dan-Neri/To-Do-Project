/**
 * The projectInfo route displays details about a specific project and
 * provides the main functionality for the app. It loads the project
 * data from the API and stores it in the state variable lists. All
 * changes made to the project workflow modify this state to keep it in
 * sync with the database. The lists state variable is passed to each 
 * subcomponent with a callback to facilitate these updates.
 */
import { useState, useEffect, MouseEvent } from 'react';
import { 
    Flex, 
    HStack,  
    useToast, 
    createStandaloneToast,
    IconButton
} from '@chakra-ui/react';
import { 
    useNavigate, 
    useLoaderData, 
    redirect
} from 'react-router-dom';
import Page from '../components/page';
import ListComponent from '../components/list-component';
import { FetchData, UpdateData } from '../api/calls';
import { StatusType, Project, List, CreateListDTO } from '../types/types';
import { AddIcon } from '@chakra-ui/icons';
//import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export default function ProjectInfo() {
    const toast = useToast();
    const navigate = useNavigate();
    //const featureRef = useRef(null);
    const project = useLoaderData() as Project;
    /*Track the state all lists which amounts to the entirety of the 
    project workflow data.*/
    const [lists, setLists] = useState<List[]>([]);

    /*useEffect(() => {
        const featureDrag = featureRef.current;
        if (featureDrag) {
            return draggable({element: featureDrag});
        }
    }, []);*/
    
    //Sort the lists.
    useEffect(() => {
        if (project) {
            const sortedLists = project.lists.slice().sort(
                (a: List, b: List) => a.position - b.position
            );
            setLists(sortedLists);
        }
    }, [project]);
    
    //Add a list to the project.
    const handleAddList = async (event: MouseEvent<HTMLButtonElement>) => {
        const DTO: CreateListDTO = {
            projectID: project.id,
            title: 'Add a list'
        }
        if (project) {
            try {
                //Send a request to the API to create a new list.
                const response = await UpdateData(
                    `/lists/create`,
                    DTO
                );
                if (response) {
                    //Sort the resulting lists and update the lists state.
                    const sortedData = response.data.slice().sort(
                        (a: List, b: List) => a.position - b.position
                    );
                    setLists(sortedData);
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
                        navigate('/sign-in');
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
    }
    
    return(
        <Page 
            title={project? project.title : 'Error'}
        >
            <Flex w='60%' flexGrow={1} justify='center'>
                {project.description}
            </Flex>
            <HStack 
                w='100%' 
                h='100%' 
                alignItems='flex-start' 
                spacing='6px' 
                ml='4px'
            >
                {lists && lists.length > 0 && lists.map((list, index) => (
                    <ListComponent 
                        key={list.id}
                        id={list.id} 
                        projectID={project.id}
                        lists={lists}
                        setLists={setLists}
                        title={list.title}
                    />
                ))}
                <IconButton 
                    aria-label='Add Column'
                    icon={<AddIcon />}
                    colorScheme='blackAlpha'
                    size='xs'
                    mr='4px'
                    onClick={handleAddList}
                />
            </HStack>
        </Page>
    );
}

//Fetch the project data from the back-end API.
export async function loader(
    { request }: { request: Request}
): Promise<Project | Response | null> {
    /*Create a toast container which can be displayed outside of our 
    react component.*/
    const { toast } = createStandaloneToast();
    const url = new URL(request.url);
    const projectID = url.searchParams.get("projectID");
    if(!projectID) {
        toast({
            title: 'Error',
            description: 'Invalid Project',
            status: 'error' as StatusType,
            duration: 4000,
            isClosable: true
        });
        return redirect('/');
    }
    try {
        //Send a request to the API to get the project data.
        const response = await FetchData(`/projects/${projectID}`);
        if (response) {
            if(!response.data) {
                toast({
                    title: 'Error',
                    description: 'Invalid Project',
                    status: 'error' as StatusType,
                    duration: 4000,
                    isClosable: true
                });
                return redirect('/');
            }
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
    return null;
}