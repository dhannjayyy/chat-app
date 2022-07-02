/* eslint-disable arrow-body-style */
import React from 'react';
import firebase from 'firebase/app';
import { Col, Container, Grid, Panel, Row, Icon, Button,Alert } from 'rsuite';
import { auth, database } from '../misc/firebase';

const SignIn = () => {

    const signinWithProvider = async (provider) => {

        try {
            const {additionalUserInfo,user} = await auth.signInWithPopup(provider)

            if(additionalUserInfo.isNewUser){
                await database.ref(`/profiles/${user.uid}`).set(
                    {
                        name : user.displayName,
                        createdAt : firebase.database.ServerValue.TIMESTAMP
                    }
                )
            }


            Alert.success("Signed in",4000);
        } catch (error) {
            Alert.error(error.message,4000)
        }
    }

    const onFacebookSignin = () => {
        signinWithProvider( new firebase.auth.FacebookAuthProvider() )
    }
    const onGoogleSignin = () => {
        signinWithProvider( new firebase.auth.GoogleAuthProvider() )

    }
    return (
        <Container >
            <Grid className='mt-page'>
                <Row>
                    <Col xs={24} md={12} mdOffset={6}>
                        <Panel>
                            <div className='text-center'>
                                <h2>
                                    Welcome to Chat App
                                </h2>
                                <p>
                                    Progressive Chat application
                                </p>
                            </div>
                            <div className='mt-3'>
                                <Button block color="blue" onClick={onFacebookSignin}>
                                    <Icon icon="facebook" /> Continue with Facebook
                                </Button>
                                <Button block color="green" onClick={onGoogleSignin}>
                                    <Icon icon="google" /> Continue with Google
                                </Button>
                            </div>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        </Container>
    )
}

export default SignIn;
