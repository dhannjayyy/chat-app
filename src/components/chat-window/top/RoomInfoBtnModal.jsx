import React from 'react'
import { Button, Modal } from 'rsuite'
import { useCurrentRoom } from '../../../context/current-room.context'
import { useModalState } from '../../../misc/customHooks'

const RoomInfoBtnModal = () => {
    const { isOpen, openDrawer, closeDrawer } = useModalState()
    const description = useCurrentRoom(value => value.description)
    const name = useCurrentRoom(value => value.name)
    return (
        <>
            <Button appearance="link" onClick={openDrawer} className='px-0'>
                Room Information
            </Button>
            <Modal show={isOpen} onHide={closeDrawer}>
                <Modal.Header>
                    <Modal.Title>
                        About {name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6 className='mb-1'>Description</h6>
                    <p>{description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeDrawer}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RoomInfoBtnModal