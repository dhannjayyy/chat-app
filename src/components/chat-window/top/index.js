import React, { memo } from 'react'
import { Icon, ButtonToolbar } from 'rsuite';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../../misc/customHooks';
import { useCurrentRoom } from '../../../context/current-room.context'
import RoomInfoBtnModal from './RoomInfoBtnModal';

const ChatTop = () => {
  const name = useCurrentRoom(value => value.name);
  const isMobile = useMediaQuery('(max-width:992px)')
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h4>
          <Icon componentClass={Link} to="/" icon="arrow-circle-left" size="2x" className={isMobile ? 'd-inline-block p-0 mr-2 text-blue link-unstyled' : 'd-none'} />
          <span className='text-disappear'>
            {name}
          </span>
        </h4>
        <ButtonToolbar className='white-space:no-wrap'>todo</ButtonToolbar>
      </div>
      <div className='d-flex justify-content-between align-items-center'>
        <span>todo</span>
        <RoomInfoBtnModal />
      </div>
    </div>
  )
}

export default memo(ChatTop);