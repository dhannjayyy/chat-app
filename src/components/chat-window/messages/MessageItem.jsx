import React, { memo } from 'react'
import TimeAgo from 'timeago-react';
import { Button } from 'rsuite';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover, useMediaQuery } from '../../../misc/customHooks';
import IconBtnControl from './IconBtnControl';


const MessageItem = ({ message, handleAdmin,handleLike, likes, likeCount,handleDelete }) => {
  const { author, createdAt, text } = message;

  const [selfRef, isHovered] = useHover()
  const isMobile = useMediaQuery('(max-width:992px)')

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAccess = isAdmin && !isAuthor;

  const canShowIcons = isMobile || isHovered;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);


  return (
    <li className={`padded mb-1 cursor-pointer ${isHovered} ? 'bg-black-02':''`} ref={selfRef}>
      <div className='d-flex align-items-center font-bolder mb-1'>

        <PresenceDot uid={author.uid} />

        <ProfileAvatar src={author.avatar} name={author.name} className='ml-1' size="xs" />
        <ProfileInfoBtnModal profile={author} appearance="link" className='p-0 ml-1 text-black'>
          {canGrantAccess &&
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAuthorAdmin ? 'Remove admin permission' : 'Give admin in this room'}
            </Button>
          }
        </ProfileInfoBtnModal>
        &nbsp;&nbsp;<TimeAgo datetime={createdAt} className='font-normal text-black-45' />

        <IconBtnControl
        {...(true ? {color :'red'}: {})}
          isVisible
          iconName="heart"
          tooltip="Like this message"
          onClick={()=>{}}
          badgeContent={5}
        />
        {
          isAuthor &&
          <IconBtnControl
          isVisible={canShowIcons}
          iconName="close"
          tooltip="Delete this message"
          onClick={() => handleDelete(message.id)}
        />
        }
      </div>
      <div>
        <span className='word-break-all'>{text}</span>
      </div>
    </li>
  )
}

export default memo(MessageItem)  