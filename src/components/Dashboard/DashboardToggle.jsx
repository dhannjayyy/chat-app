/* eslint-disable arrow-body-style */
import React, { useCallback } from 'react'
import { Alert, Button, Drawer, Icon } from 'rsuite'
import Dashboard from '.'
import { useMediaQuery, useModalState } from '../../misc/customHooks'
import { auth } from '../../misc/firebase'

const DashboardToggle = () => {

    const { isOpen, closeDrawer, openDrawer } = useModalState()
    const isMobile = useMediaQuery('(max-width:992px)')

    const onSignOut = useCallback(() => {
        auth.signOut();
        Alert.info("Signed Out",4000);

        closeDrawer();
}, [closeDrawer]);

    return (
        <>
            <Button block color="blue" onClick={openDrawer}>
                <Icon icon="dashboard" />
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={closeDrawer} placement="left">
                <Dashboard onSignOut={onSignOut}/>
            </Drawer>
        </>
    )
}

export default DashboardToggle