import { getDatabase, ref, get, child, set } from "firebase/database";

// Don't plan on individual messages lookup
type Message = {
  sender: string;           // Sender uid
  content: string;          // Message content
};

// Lookup by uuid allocated during initialization
type ConversationRecord = {
  members: string[];        // List of uid
  messages: Message[];      // List of messages sent by users
};

type UserRecordConversation = {
  uuid: string;                 // Uuid of the conversation record
  memberNames: string[];        // Display name of the members
};

// Lookup by uid
type UserRecord = {
  name: string;                             // Display name of the user
  conversations: UserRecordConversation[];  // List of conversation uuids the user is in
};

// type NameRecord = {
//   name: string;     // Display name of the user
//   uid: string;      // Uid of the user
// };

/**
 * Retrieve user information from the Firebase realtime database. If the user
 * does not exist, create the user with empty conversations and return it.
 * 
 * @param {string} uid Uid of the user used for fetching user
 * @param {string} name Name of the user used for creating new user if none
 */
export async function getUser(uid: string, name: string) {

  const dbRef = ref(getDatabase());

  const snapshot = await get(child(dbRef, 'users/' + uid));

  // Create user if it does not exist
  if (!snapshot.exists()) {

    const db = getDatabase();
    set(ref(db, 'users/' + uid), { name, conversations: [] });
    set(ref(db, 'names/' + uid), { name, uid });
    return { name, conversations: [] };
  }

  return snapshot.val() as UserRecord;
}

/**
 * Retrieve all users from the database. This method is used for letting the
 * user search for others.
 */
export async function getAllUsers() {

  const dbRef = ref(getDatabase());

  const snapshot = await get(child(dbRef, 'names'));

  return snapshot.val();
}

/**
 * Retrieve conversation record.
 * 
 * @param {string} uuid Uuid of the conversation
 */
export async function getConversation(uuid: string) {

  const dbRef = ref(getDatabase());

  const snapshot = await get(child(dbRef, 'conversations/' + uuid));

  if (!snapshot.exists()) {
    throw new Error(`Conversation with uuid - ${uuid} does not exist`);
  }

  return snapshot.val() as ConversationRecord;
}