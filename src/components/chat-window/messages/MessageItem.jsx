import React, { memo } from 'react'
import TimeAgo from 'timeago-react';
import { Button } from 'rsuite';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover } from '../../../misc/customHooks';


const MessageItem = ({ message, handleAdmin }) => {
  const { author, createdAt, text } = message;

  const [selfRef, isHovered] = useHover()

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAccess = isAdmin && !isAuthor;



  return (
    <li className= {`padded mb-1 cursor-pointer ${isHovered} ? 'bg-black-02':''`} ref={selfRef}>
      <div className='d-flex align-items-center font-bolder mb-1'>

        <PresenceDot uid={author.uid} />

        <ProfileAvatar src={author.avatar} name={author.name} className='ml-1' size="xs" />
        <ProfileInfoBtnModal profile={author} appearance="link" className='p-0 ml-1 text-black'>
        {canGrantAccess && 
          <Button block onClick={()=>handleAdmin(author.uid)} color="blue">
{isMsgAuthorAdmin ? 'Remove admin permission' : 'Give admin in this room'}
        </Button>
        }
        </ProfileInfoBtnModal>
        &nbsp;&nbsp;<TimeAgo datetime={createdAt} className='font-normal text-black-45' />
      </div>
      <div>
        <span className='word-break-all'>{text}</span>
      </div>
    </li>
  )
}

export default memo(MessageItem)  