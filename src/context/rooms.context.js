/* eslint-disable no-unused-vars */


import React, { useState, createContext, useEffect } from "react";
import { database } from "../misc/firebase";
import { transFormToArrWithId } from "../misc/helpers";

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
    const [rooms, setRooms] = useState(null);

    useEffect(() => {
        const roomListRef = database.ref('rooms');
        roomListRef.on('value',(snap)=>{
            const data =transFormToArrWithId(snap.val());
            setRooms(data);
        })

        return ()=>{
            roomListRef.off();
        }
    },[]);

    return <RoomsContext.Provider value={rooms}>
        {children}
    </RoomsContext.Provider>

}