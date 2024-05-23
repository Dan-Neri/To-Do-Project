/**
 * The projectInfo route displays details about a specific project and
 * provides the main functionality for the app. It loads the project
 * data from the API and stores it in the state variable lists. All
 * changes made to the project workflow modify this state to keep it in
 * sync with the database. The lists state variable is passed to each 
 * subcomponent with a callback to facilitate these updates.
 */
import React, { useState, useEffect, PointerEvent } from 'react';
import { 
    Flex, 
    HStack,  
    useToast, 
    createStandaloneToast,
    IconButton,
    Editable,
    EditableInput,
    EditableTextarea,
    EditablePreview 
} from '@chakra-ui/react';
import { 
    useNavigate, 
    useLoaderData, 
    redirect
} from 'react-router-dom';
import Page from '../components/page';
import ListComponent from '../components/list-component';
import { FetchData, UpdateData } from '../api/calls';
import { 
    StatusType, 
    Project, 
    UpdateProjectDTO, 
    List, 
    CreateListDTO,
    UpdateListDTO
} from '../types/types';
import { AddIcon } from '@chakra-ui/icons';
import { EditIcon } from '@chakra-ui/icons';
import EditableIcon from '../components/editable-icon';
import ListTargetComponent from '../components/list-target-component';
import { 
    monitorForElements 
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export default function ProjectInfo() {
    const toast = useToast();
    const navigate = useNavigate();
    const project = useLoaderData() as Project;
    /*Track the state all lists which amounts to the entirety of the 
    project workflow data.*/
    const [lists, setLists] = useState<List[]>([]);
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);
    
    //Sort the lists and keep the title and description updated.
    useEffect(() => {
        if (project) {
            const sortedLists = project.lists.slice().sort(
                (a: List, b: List) => a.position - b.position
            );
            setLists(sortedLists);
            setTitle(project.title);
            setDescription(project.description);
        }
    }, [project]);
    
    //Monitor for dragged components.
    useEffect(() => {
        return monitorForElements({
            onDrop: async ({ source, location }) => {
                const destination = location.current.dropTargets[0];
                /*Check to make sure that the list is dropped in a valid
                location.*/
                if (!destination) {
                    return;
                }
                //Index of the drop target.
                let destinationIndex = destination.data.index as number;
                //Index of the grabbed list.
                const sourceIndex = source.data.listIndex as number;
                //Destination index must be adjusted if moving a list forward.
                destinationIndex = (
                    destinationIndex > sourceIndex 
                ) ? (
                    destinationIndex - 1 
                ) : (
                    destinationIndex
                );
                //Create a copy of the lists state.
                const newLists = lists.slice();
                //Remove the source list from the copy.
                const movedList = newLists.splice(sourceIndex, 1)[0];
                //Insert the source list at the chosen destination in the copy.
                newLists.splice(destinationIndex, 0, movedList);
                    /*(destinationIndex > sourceIndex) ? (
                        destinationIndex - 1
                    ) : ( 
                        destinationIndex
                    ), 
                    0, 
                    movedList
                );*/
                /*Update the position of all lists between the source
                and destination on both the front and back end.*/
                for(
                    let i = Math.min(sourceIndex, destinationIndex); 
                    i <= Math.max(sourceIndex, destinationIndex); 
                    i++
                ) {
                    //Update the position of this list in the copy.
                    newLists[i].position = i;
                    //Create a DTO with the updated position for this list.
                    const DTO: UpdateListDTO = {
                        projectID: project.id,
                        id: newLists[i].id,
                        position: i
                    }
                    try {
                        /*Send a request to the API to update the position of
                        this list in the database.*/
                        const response = await UpdateData('/lists/update', DTO);
                    } catch (error: any) {
                        if(error.response) {
                            toast({
                                title: 'Error',
                                description: error.response.data.message,
                                status: 'error' as StatusType,
                                duration: 4000,
                                isClosable: true
                            });
                            if(error.response.data.message.includes(
                                'Authorization'
                            )) {
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
                /*Replace the lists state with the copy once all positions
                have been updated.*/
                setLists(newLists);
            }
        })
    }, [lists]); 
    
    //Add a list to the project.
    const handleAddList = async (event: PointerEvent<HTMLButtonElement>) => {
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
    
    //Update the project title.
    const handleEditTitle = async (nextValue: string) => {
        //Only update the title when it is different from the current title.
        if (nextValue !== project.title) {
            const DTO: UpdateProjectDTO = {
                id: project.id,
                title: nextValue
            }
            try {
                const response = await UpdateData(
                    `/projects/update`,
                    DTO
                );
                if (response) {
                    project.title = response.data.title;
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
    
    //Update the project description.
    const handleEditDescription = async (nextValue: string) => {
        const currentValue = project.description ?? 'Add a description';
        if (nextValue !== currentValue) {
            const DTO: UpdateProjectDTO = {
                id: project.id,
                description: nextValue
            }
            try {
                const response = await UpdateData(
                    `/projects/update`,
                    DTO
                );
                if (response) {
                    project.description = response.data.description;
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
            title={
                <Editable 
                    defaultValue={project? project.title : 'Error'}
                    onSubmit={handleEditTitle}
                >
                    <EditablePreview mr='4px' cursor='pointer' />
                    <EditableInput bg='white' autoFocus={false} />
                    <EditableIcon mb='32px' ariaLabel='Edit Project Title'/>
                </Editable>
            }
        >
            <Flex w='60%' flexGrow={1} justify='center'>
                <Editable 
                    defaultValue={project.description || 'Add a description'}
                    w='100%'
                    onSubmit={handleEditDescription}
                >
                    <EditablePreview 
                        padding='4px'
                        cursor='pointer'
                    />
                    <EditableTextarea
                        w='auto'
                        bg='white' 
                        padding='4px'
                        resize='none'
                    />
                    <EditableIcon ariaLabel='Edit Project Description'/>
                </Editable>
            </Flex>
            <HStack 
                w='100%' 
                h='100%' 
                alignItems='flex-start' 
                spacing={0} 
                ml='4px'
            >
                <ListTargetComponent key={0} index={0}/>
                {lists && lists.length > 0 && lists.map((list, index) => (
                    <React.Fragment key={list.id}>
                        <ListComponent 
                            key={list.id}
                            id={list.id} 
                            projectID={project.id}
                            lists={lists}
                            setLists={setLists}
                            title={list.title}
                            position={list.position}
                        />
                        <ListTargetComponent key={index+1} index={index+1} />
                    </React.Fragment>
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