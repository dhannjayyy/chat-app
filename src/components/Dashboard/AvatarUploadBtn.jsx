/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react'
import { Modal, Button, Alert } from 'rsuite'
import AvatarEditor from 'react-avatar-editor'
import { useModalState } from '../../misc/customHooks';
import { database,storage } from '../../misc/firebase'
import { useProfile } from '../../context/profile.context';
import ProfileAvatar from '../ProfileAvatar';

const fileInputTypes = ".png, .jpeg, .jpg";
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);
const getBlob = (canvas) =>{
    return new Promise( (resolve,reject)=>{
        canvas.toBlob((blob)=>{
            try {
                if(blob){
                    resolve(blob);
                }
            } catch (error) {
                reject(new Error('File process error'));
            }
        }) 
    } )
}

const AvatarUploadBtn = () => {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const avatarEditoRef = useRef();
    const {profile} = useProfile();

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

    const onUploadClick = async () => {
        const canvas = avatarEditoRef.current.getImageScaledToCanvas();
        setIsLoading(true);
        try {
            const blob = await getBlob(canvas);
            const avatarFileRef = storage.ref(`/profiles/${profile.uid}`).child('avatar');
            
            const uploadAvatarResult = await avatarFileRef.put(blob,{
                cacheControl : `public, max-age=${3600 * 24 * 3}`
            });

            const downloadURL = await uploadAvatarResult.ref.getDownloadURL();
            const userAvatarRef = database.ref(`/profiles/${profile.uid}`).child('avatar');
            await userAvatarRef.set(downloadURL);

            setIsLoading(false);
            Alert.info('Avatar has been uploaded',4000); 
            
        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message,4000); 
        }
    }

    return (
        <div className='mt-3 text-center'>
        <ProfileAvatar src={profile.avatar} name={profile.name} className="width-200 height-200 img-fullsize font-huge"/>
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
                            ref={avatarEditoRef}
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
                        <Button block appearance='ghost' onClick={onUploadClick} disabled={isLoading}>
                            Upload new avatar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default AvatarUploadBtn