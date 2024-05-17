/**
 * The EditableIcon component is a component designed to be used with
 * Editable components throughout the app. It provides an edit icon
 * button which can be clicked to edit the Editable and disappears while
 * in editing mode.
 */
import { useEditableControls, IconButton } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

export default function EditableIcon(
    { ariaLabel, mb }: { ariaLabel? : string, mb?: string }
) {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();
    
    let props = {
        'aria-label': ariaLabel ?? 'Edit Button',
        'mb': mb ?? '12px'
    };

    return isEditing ? (<></>
    ) : (
        <IconButton
            size='xxs'
            maxH='16px'
            maxW='10px'
            bg={{ bg: '' }}
            _hover={{ bg: '' }}
            icon={<EditIcon boxSize='10px' />} 
            {...getEditButtonProps()} 
            {...props}
        />
    );
}
