/* eslint-disable arrow-body-style */
import React, { useCallback } from 'react'
import { Alert, Button, Drawer, Icon } from 'rsuite'
import Dashboard from '.'
import { useMediaQuery, useModalState } from '../../misc/customHooks'
import { auth, database } from '../../misc/firebase'
import { isOfflineForDatabase } from '../../context/profile.context'

const DashboardToggle = () => {

    const { isOpen, closeDrawer, openDrawer } = useModalState()
    const isMobile = useMediaQuery('(max-width:992px)')

    const onSignOut = useCallback(() => {

        database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(()=>{
            auth.signOut();
            Alert.info('Signed out',4000);
            closeDrawer();
        }).catch(error=>{
            
            Alert.error(error.message,4000);
        });

        auth.signOut();
        Alert.info("Signed Out",4000);

        closeDrawer();
}, [closeDrawer]);

    return (
        <>
            <Button block color="blue" onClick={openDrawer}>
                <Icon icon="dashboard" />Dashboard
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={closeDrawer} placement="left">
                <Dashboard onSignOut={onSignOut}/>
            </Drawer>
        </>
    )
}

export default DashboardToggle