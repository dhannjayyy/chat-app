import React from 'react'
import { Badge, Whisper, IconButton, Icon,Tooltip } from 'rsuite'

const ConditionalBadge = ({ condition, children }) => {
    return condition ? <Badge content={children} /> : children;
}


const IconBtnControl = ({
    isVisible,
    iconName,
    tooltip,
    onCLick,
    badgeContent,
    ...props }) => {

    return (
        <div className='ml-2' style={{ visibility: isVisible ? 'visible' : 'hidden' }}>

            <ConditionalBadge condtition={badgeContent}>
                <Whisper
                    placement="top"
                    delay={0}
                    delayShow={0}
                    delayHide={0}
                    trigger="hover"
                speaker={<Tooltip>{tooltip}</Tooltip>}
                >
                    <IconButton
                        {...props}
                        onClick={onCLick}
                        circle
                        size="xs"
                        icon={<Icon icon={iconName} />}
                    />


                </Whisper>
            </ConditionalBadge>

        </div>
    )
}

export default IconBtnControl