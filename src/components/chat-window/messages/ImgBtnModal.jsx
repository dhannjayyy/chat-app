import React from 'react'
import { Modal } from 'rsuite';
import { useModalState } from '../../../misc/customHooks'

const ImgBtnModal = ({src, fileName}) => {
    const { isOpen, closeDrawer, openDrawer } = useModalState();
    return (
        <>
            <input
                type="image"
                src={src}
                alt="file"
                onClick={openDrawer}
                className="mw-100 mh-100 w-auto"
            />
            <Modal show={isOpen} onHide={closeDrawer}>
                <Modal.Header>
                    <Modal.Title>
                        {fileName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <img src={src} height="100%" width="100%" alt="file" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <a href={src} target="_blank" rel="noopener noreferrer"> View Original
                    </a>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ImgBtnModal