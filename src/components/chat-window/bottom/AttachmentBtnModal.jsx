import React, { useState } from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite'
import { useModalState } from '../../../misc/customHooks'
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttachmentBtnModal = ({ afterUpload }) => {
    const { chatId } = useParams();
    const { isOpen, closeDrawer, openDrawer } = useModalState();
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (fileArr) => {
        const filtered = fileArr.filter(el => el.blobFile.size <= MAX_FILE_SIZE).slice(0, 5);
        setFileList(filtered);
    }

    const onUpload = async () => {

        try {
            const uploadPromises = fileList.map(f => (
                storage.ref(`/chat/${chatId}`).child(Date.now + f.name).put(f.blobFile, { cacheControl: `public, max-age=${3600 * 24 * 3}` })
            ));

            const uploadSnapshots = await Promise.all(uploadPromises);


            // getDownloadURL also returns promise that is why using await and async to store the promises in shapePromises array

            const shapePromises = uploadSnapshots.map(async snap => {
                return {
                    contentType: snap.metadata.contentType,
                    name: snap.metadata.name.replace("function now() { [native code] }",""),
                    url: await snap.ref.getDownloadURL()
                }
            })

            const files = await Promise.all(shapePromises);
            await afterUpload(files);
            setIsLoading(false);
            closeDrawer();

        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message);
        }
    }

    return (
        <>
            <InputGroup.Button onClick={openDrawer}>
                <Icon icon="attachment" />
            </InputGroup.Button>
            <Modal show={isOpen} onHide={closeDrawer}>
                <Modal.Header>
                    <Modal.Title>
                        Upload files
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Uploader
                        className='w-100'
                        autoUpload={false}
                        action=""
                        fileList={fileList}
                        onChange={onChange}
                        multiple
                        listType='picture-text'
                        disabled={isLoading}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button block disabled={isLoading} onClick={onUpload}>
                        Send to chat
                    </Button>
                    <div className='text-right mt-2'>
                        <small>* only files less than 5 MB are allowed</small>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AttachmentBtnModal