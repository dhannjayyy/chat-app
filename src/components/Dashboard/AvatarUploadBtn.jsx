/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Modal, Button, Alert } from 'rsuite'
import AvatarEditor from 'react-avatar-editor'
import { useModalState } from '../../misc/customHooks';

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);

const AvatarUploadBtn = () => {
    const [image, setImage] = useState(null);

    const { isOpen, closeDrawer, openDrawer } = useModalState();
    const onFileInputChange = (ev) => {
        const currentFiles = ev.target.files;
        if (currentFiles.length === 1) {
            const file = currentFiles[0];
            if (isValidFile(file)) {
                setImage(file);
                openDrawer();
            }
            else {
                Alert.warning(`Wrong file type ${file.type}`, 4000)
            }
        }
    }

    return (
        <div className='mt-3 text-center'>
            <div>
                <label htmlFor='avatar-upload' className='d-block cursor-pointer padded'>
                    Select new avatar
                    <input id='avatar-upload' type="file" className='d-none' accept={fileInputTypes} onChange={onFileInputChange} />
                </label>

                <Modal show={isOpen} onHide={closeDrawer}>
                    <Modal.Header>
                        <Modal.Title>
                            Adjust and upload new avatar
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body><div className='d-flex justify-content-center align-items-center h-100'>

                        {image && <AvatarEditor
                            image={image}
                            width={200}
                            height={200}
                            border={10}
                            borderRadius={100}
                            rotate={0}
                        />}
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance='ghost'>
                            Upload new avatar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default AvatarUploadBtn