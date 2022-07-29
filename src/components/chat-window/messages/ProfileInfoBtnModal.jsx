import React from 'react'
import { Button, Modal } from 'rsuite'
import { useModalState } from '../../../misc/customHooks';
import ProfileAvatar from '../../ProfileAvatar';


const ProfileInfoBtnModal = ({ profile, ...btnProps }) => {
  const { isOpen, closeDrawer, openDrawer } = useModalState();
  const shortName = profile.name.split(' ')[0];
  const { name, avatar, createdAt } = profile;
  const memberSince =   new Date(createdAt).toLocaleDateString();
  return (
    <>
      <Button {...btnProps} onClick={openDrawer}>
        {shortName}
      </Button>
      <Modal show={isOpen} onHide={closeDrawer}>
        <Modal.Header>
          <Modal.Title>
            {shortName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <ProfileAvatar src={avatar} name={name} className="width-200 height-200 img-fullsize font-huge" />
          <h4 className='mt-2'>{name}</h4>
          <p>Member since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={closeDrawer}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProfileInfoBtnModal