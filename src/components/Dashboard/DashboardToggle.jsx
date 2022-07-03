/* eslint-disable arrow-body-style */
import React from 'react'
import { Button, Drawer, Icon } from 'rsuite'
import Dashboard from '.'
import { useMediaQuery, useModalState } from '../../misc/customHooks'

const DashboardToggle = () => {

    const { isOpen, closeDrawer, openDrawer } = useModalState()
    const isMobile = useMediaQuery('(max-width:992px)')
    
    return (
        <>
            <Button block color="blue" onClick={openDrawer}>
                <Icon icon="dashboard" />
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={closeDrawer} placement="left">
                <Dashboard />
            </Drawer>
        </>
    )
}

export default DashboardToggle