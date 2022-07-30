import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Alert } from 'rsuite'
import { database,auth } from '../../../misc/firebase';
import { transFormToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
  const { chatId } = useParams()
  const [messages, setMessages] = useState(null);
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messageRef = database.ref('/messages');
    messageRef.orderByChild('roomId').equalTo(chatId).on('value', (snap) => {

      const data = transFormToArrWithId(snap.val());
      setMessages(data);

    })
    return () => {
      messageRef.off('value');
    }
  }, [chatId])

  const handleAdmin = useCallback(async (uid) => {
    const adminRefs = database.ref(`rooms/${chatId}/admins`);

    let alertMsg;

    await adminRefs.transaction(admins => {
      if (admins) {
        if (admins[uid]) {
          admins[uid] = null;
          alertMsg = 'Admin permission removed'
        } else {
          admins[uid] = true;
          alertMsg = 'Admin permission granted'
        }
      }
      return admins;
    });

    Alert.info(alertMsg,4000)
  }, [chatId])

const handleLike = useCallback(async (msgId )=>{
  const {uid} = auth.currentUser;
  const messageRef = database.ref(`messagess/${msgId}`);

  let alertMsg;
 
  await messageRef.transaction(msg => {
    if (msg) {
      if (msg.likes && msg.likes[uid]) {
        msg.likesCount -= 1;
        msg.likes[uid] = null;
        alertMsg = 'Like Removed'
      } else {
        msg.likesCount += 1;

        if(!msg.likes){
          msg.likes = {};
        }

        msg.likes[uid] = true;
        alertMsg = 'Like added'
      }
    }
    return msg;
  });

  Alert.info(alertMsg,4000)
},[])

  return (
    <ul className='msg-list custom-scroll '>

      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} />)}

    </ul>
  )
}

export default Messages