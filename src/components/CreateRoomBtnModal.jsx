import React, { useCallback, useRef, useState } from 'react'
import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema } from 'rsuite'
import firebase from 'firebase';
import { useModalState } from '../misc/customHooks'
import { database } from '../misc/firebase';


const { StringType } = Schema.Types;

const model = Schema.Model({
    name: StringType().isRequired('Chat room name is required'),
    description: StringType().isRequired('Chat room description is required')
})

const INITIAL_FORM = {
    name: '',
    description: ''
}

const CreateRoomBtnModal = () => {
    const { isOpen, closeDrawer, openDrawer } = useModalState();
    const [formValue, setFormValue] = useState(INITIAL_FORM);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef();

    const onFormChange = useCallback(
        value => {
            setFormValue(value);
        }
    ,[]);

    const onSubmit = async () =>{

        if (!formRef.current.check()){
            return;
        }
        setIsLoading(true);

        const newRoomData = {
            ...formValue,
            createdAt : firebase.database.ServerValue.TIMESTAMP
        }

        try {
            await database.ref('rooms').push(newRoomData);
            setIsLoading(false);
            setFormValue(INITIAL_FORM);
            closeDrawer();
            Alert.info(`${formValue.name} has been created`,4000)
            
        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message,4000)
        }
    }

    return (
        <div className='mt-1'>
            <Button block color="green" onClick={openDrawer}>
                <Icon icon="creative" />
                Create new chat room
            </Button>
            <Modal show={isOpen} onHide={closeDrawer}>
                <Modal.Header>
                    <Modal.Title>
                        New chat room
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formRef}>
                        <FormGroup>
                            <ControlLabel>Room Name </ControlLabel>
                            <FormControl name="name" placeholder="Enter chat room name..." />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Description </ControlLabel>
                            <FormControl componentClass="textarea" rows={5} name="description" placeholder="Enter room description..." />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button block appearance='primary' onClick={onSubmit} disabled={isLoading}>
                        Create new chat room
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateRoomBtnModal