/* eslint-disable consistent-return */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite'
import { database, auth, storage } from '../../../misc/firebase';
import { transFormToArrWithId, groupBy } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messagesRef = database.ref('/messages');


const Messages = () => {
  const { chatId } = useParams()
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef()
  
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;
  
  
  
  const loadMessages = useCallback((limitToLast) => {

    const node = selfRef.current;
    messagesRef.off();
    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .limitToLast(limitToLast || PAGE_SIZE)
      .on('value', snap => {
        const data = transFormToArrWithId(snap.val());
        setMessages(data);
        // if(shouldScrollToBottom(node)){
          node.scrollTop = node.scrollHeight;  
        // }
      });
    setLimit(p => p + PAGE_SIZE)
  }, [chatId]);

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;
    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 1000)

  }, [limit, loadMessages])

  useEffect(() => {
    const node = selfRef.current;

    loadMessages();
    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 1000)

    return () => {
      messagesRef.off('value');
    }
  }, [loadMessages])

  const handleAdmin = useCallback(
    async (uid) => {
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

      Alert.info(alertMsg, 4000);
    }, [chatId]);

  const handleLike = useCallback(async (msgId) => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`messages/${msgId}`);

    let alertMsg;

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like removed'
        } else {
          msg.likeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMsg = 'Like Added'
        }
      }
      return msg;
    });

    Alert.info(alertMsg, 4000);
  }, [])

  const handleDelete = useCallback(async (msgId, file) => {
    if (!window.confirm('Delete this message ? ')) {
      return;
    }
    const isLast = messages[messages.length - 1].id === msgId;
    const updates = {};

    updates[`/messages/${msgId}`] = null;

    if (isLast && messages.length > 1) {
      updates[`/rooms/${chatId}/lastMessage`] = {
        ...messages[messages.length - 2],
        msgId: messages[messages.length - 2].id
      }
    }

    if (isLast && messages.length === 1) {
      updates[`/rooms/${chatId}/lastMessage`] = null;
    }

    try {
      await database.ref().update(updates);
      Alert.info('Message has been deleted')
    } catch (error) {
      return Alert.error(error.message)
    }

    if (file) {
      try {
        const fileRef = storage.refFromURL(file.url)
        await fileRef.delete();
      } catch (error) {
        Alert.error(error.message);
      }
    }

  }, [chatId, messages])

  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString());

    // eslint-disable-next-line prefer-const
    let items = [];
    Object.keys(groups).forEach((date) => {
      items.push(<li className='text-center mb-1 padded'>{date}</li>)
      const msgs = groups[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));
      items.push(...msgs);
      // items.concat(msgs);
    });

    return items;
  };



  return (

    <ul ref={selfRef} className='msg-list custom-scroll '>
      {messages && messages.length >= PAGE_SIZE && (
        <li className='text-center mt-2 mb-2'>
          <Button onClick={onLoadMore} color="green">
            Load More
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  )
}

export default Messages