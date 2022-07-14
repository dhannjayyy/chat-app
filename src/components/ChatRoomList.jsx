import React from 'react'
import { Nav } from 'rsuite'
import RoomItem from './RoomItem'

const ChatRoomList = ({ aboveElementHeight }) => {
    return (
        <div className='h-100'>
            <Nav
                appearance='subtle'
                vertical
                reversed
                className='overflow-y-scroll custom-scroll'
                style={{
                    height:`calc(100% - ${aboveElementHeight}px)`,
                }}
                >
                <Nav.Item>
                    <RoomItem />
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default ChatRoomList