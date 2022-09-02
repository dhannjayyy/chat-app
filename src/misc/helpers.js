export function getNameInitials(name) {
    const splitName = name.toUpperCase().split(" ");

    if (splitName.length > 1) {
        return splitName[0][0] + splitName[1][0];
    }

    return splitName[0][0];
}


export function transFormToArr(snapVal){
    return snapVal ? Object.keys(snapVal) : []
}

export function transFormToArrWithId(snapVal) {
    return snapVal ? Object.keys(snapVal).map(value => {
        return { ...snapVal[value], id: value };
    }) : [];
}

export async function getUserUpdates(userId,keyToUpdate,value,db){
    const updates={};

    updates[`/profiles/${userId}/${keyToUpdate}`] = value;

    // Getting the msgs for the updated user
    const getMsgs = db.ref('/messages').orderByChild('author/uid').equalTo(userId).once('value');

    // Getting rooms for the updated user
    const getRooms = db.ref('/rooms').orderByChild('lastMessage/author/uid').equalTo(userId).once('value')

    const [mSnap, rSnap] = await Promise.all([getMsgs, getRooms]);

        // FEtching the message object key to update all the references for the updated user

    mSnap.forEach(msgSnap =>{
        updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
    } )

     // FEtching the rooms object key to update all the references for the updated user
    rSnap.forEach(roomSnap =>{
        updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
    } )

    return updates;
}


// groupBy(messages, (msgItem)=> msgItem.createAt)
   

export function groupBy(array, groupingKeyFn){
    return array.reduce((result, item)=>{

        const groupingKey = groupingKeyFn(item);

        if(!result[groupingKey]){
            result[groupingKey] = [];
        }

        result[groupingKey].push(item);

        return result;
    },{})

}