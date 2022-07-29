import React, { memo } from 'react'
import { useParams } from 'react-router';
import { Button, Drawer, Alert } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery, useModalState } from '../../../misc/customHooks';
import EditableInput from '../../EditableInput';
import { database } from '../../../misc/firebase';

const EditRoomBtnDrawer = () => {

    const {isOpen, openDrawer, closeDrawer} = useModalState();
    const { chatId } = useParams();
    const isMobile = useMediaQuery('(max-width:992px)')


    const name = useCurrentRoom(v => v.name)
    const description = useCurrentRoom(v => v.description)

    const updateData = (key,value)=>{
        database.ref(`rooms/${chatId}`).child(key).set(value).then(()=>{
            Alert.success('Successfully updated',4000);
        }).catch((error)=>{
            Alert.error(error.message, 4000);
        })
    }
    const onNameSave = (newName) =>{
        updateData('name',newName)
    }
    const onDescriptionSave = (newDesc) =>{
        updateData('description',newDesc)
    }
    return (
        <div>
            <Button className='br-circle' size="sm" onClick={openDrawer}>
                A
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={closeDrawer} placement='right'>

                <Drawer.Header>
                    <Drawer.Title>
                        Edit Room
                    </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <EditableInput
                        initialValue={name}
                        onSave={onNameSave}
                        label={<h6 className='mb-2'>Name</h6>}
                        emptyMsg="Name can not be empty"
                    />
                    <EditableInput
                        componentClass="textarea"
                        rows={5}
                        initialValue={description}
                        onSave={onDescriptionSave}
                        emptyMsg="Description can not be empty"
                        wrapperClassName='mt-3'
                    />
                </Drawer.Body>
                <Drawer.Footer>
                    <Button block onClick={closeDrawer}>
                        Close
                    </Button>
                </Drawer.Footer>


            </Drawer>
        </div>
    )
}

export default memo(EditRoomBtnDrawer)