/**
 * The TaskComponent represents one task in the project workflow. This
 * is one thing that needs to be completed in order to implement one
 * user story. Each task starts out uncompleted and can be checked to
 * mark completion as it is finished. Each task contributes to the
 * completion of the entire project and completing every task within The
 * project should signal the completion of the entire project.
 */
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useToast, Checkbox } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { StatusType, List, UpdateTaskDTO } from '../types/types';
import { UpdateData } from '../api/calls';

interface TaskProps {
    id: string;
    projectID: string;
    listID: string;
    featureID: string;
    userStoryID: string;
    lists: List[];
    setLists: React.Dispatch<React.SetStateAction<List[]>>;
}

const TaskComponent = (props: TaskProps) => {
    const {    
        id,
        projectID,
        listID,
        featureID,
        userStoryID,
        lists,
        setLists
    } = props;
    const toast = useToast();
    const navigate = useNavigate();
    //Find this specific task.
    const list = lists.find(list => list.id === listID);
    const feature = list? list.features.find(
        feature => feature.id === featureID
    ) : undefined;
    const userStory = feature? feature.userStories.find(
        userStory => userStory.id === userStoryID
    ) : undefined;
    const task = userStory? userStory.tasks.find(
        task => task.id === id
    ) : undefined
    //Track whether or not this task is completed.
    const [completed, setCompleted] = useState(task? task.completed : false);
    //Track the content or description of this task.
    const [content, setContent] = useState(task? task.content : 'New Task');

    //Keep the content and completion status of this task updated.
    useEffect(() => {
        const list = lists.find(list => list.id === listID);
        const feature = list? list.features.find(
            feature => feature.id === featureID
        ) : undefined;
        const userStory = feature? feature.userStories.find(
            userStory => userStory.id === userStoryID
        ) : undefined;
        const task = userStory? userStory.tasks.find(
            task => task.id === id
        ) : undefined
        setCompleted(task? task.completed : false);
        setContent(task? task.content : 'New Task');
    }, [lists, id, listID, featureID, userStoryID])
    
    //Mark this task completed or uncompleted.
    const handleCheckTask = async (event: ChangeEvent<HTMLInputElement>) => {
        //Create an object with locator data and completion status.
        const DTO: UpdateTaskDTO = {
            projectID: projectID,
            listID: listID,
            featureID: featureID,
            userStoryID: userStoryID,
            id: id,
            completed: event.target.checked
        }
        try {
            /*Send a POST request to the back-end API to update the 
            completion status.*/
            const response = await UpdateData(
                    `/tasks/update`,
                    DTO
            );
            if (response) {
                //Find a path to this specific task from the main lists state.
                const listIndex = lists.findIndex(list => list.id === listID);
                const featureIndex = listIndex > -1? (
                    lists[listIndex].features.findIndex(
                        feature => feature.id === featureID
                    )
                ) : (
                    -1
                );
                const storyIndex = featureIndex > -1? (
                    lists[listIndex].features[
                        featureIndex
                    ].userStories.findIndex(
                        userStory => userStory.id === userStoryID
                    )
                ) : (-1);
                const taskIndex = storyIndex > -1? (
                    lists[listIndex].features[featureIndex].userStories[
                      storyIndex].tasks.findIndex(
                        task => task.id === id
                      )
                ) : (-1);
                //Throw an error if the task is not found.
                if (taskIndex === -1) {
                    toast({
                        title: 'Error',
                        description: 'Unable to find task',
                        status: 'error' as StatusType,
                        duration: 4000,
                        isClosable: true
                    });
                }
                //Create a copy of the entire lists state.
                const newLists = lists.slice();
                //Update the completion status of this specific task.
                newLists[listIndex].features[featureIndex].userStories[
                  storyIndex].tasks[taskIndex] = response.data;
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
        <Checkbox key={id} isChecked={completed} onChange={handleCheckTask}>
            {content}
        </Checkbox>
    )
}

export default TaskComponent;

                                                    