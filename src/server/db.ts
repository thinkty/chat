import { database, auth } from "firebase-admin";

// Don't plan on individual messages lookup
type DBMessage = {
  sender: string;           // Sender uid
  content: string;          // Message content
};

// Lookup by uuid allocated during initialization
type DBConversationRecord = {
  members: string[];        // List of uid
  messages: DBMessage[];      // List of messages sent by users
};

type DBUserRecordConversation = {
  uuid: string;                 // Uuid of the conversation record
  memberNames: string[];        // Display name of the members
};

// Lookup by uid
type DBUserRecord = {
  name: string;                             // Display name of the user
  conversations: DBUserRecordConversation[];  // List of conversation uuids the user is in
};

/**
 * Retrieve user information from the Firebase realtime database. If the user
 * does not exist, create the user with empty conversations and return it.
 * 
 * @param {string} uid Uid of the user used for fetching user
 * @param {string} name Name of the user used for creating new user if none
 */
export async function getUser(uid: string, name: string) {
  const db = database();
  const snapshot = await db.ref('users/' + uid).get();

  // Create user if it does not exist
  if (!snapshot.exists()) {

    db.ref('users/' + uid).set({ name, conversations: [] });
    return { name, conversations: [] };
  }

  return snapshot.val() as DBUserRecord;
}

/**
 * Retrieve all users from Firebase. This method is used for letting the user
 * search for others.
 * 
 * Instead of listUsers, this method is used to bypass the 1000 entry limit
 * 
 * @see https://firebase.google.com/docs/auth/admin/manage-users#bulk_retrieve_user_data
 * @see https://firebase.google.com/docs/auth/admin/manage-users#list_all_users
 */
export async function getAllUsers() {

  const { users } = await auth().getUsers([]);

  // Only get the necessary information
  const filteredUsers = users.map((user) => (
    {
      uid: user.uid,
      name: user.displayName || 'Anonymous',
    }
  ));
  
  return filteredUsers;
}

/**
 * Retrieve conversation record.
 * 
 * @param {string} uuid Uuid of the conversation
 */
export async function getConversation(uuid: string) {

  const db = database();
  const snapshot = await db.ref('conversations/' + uuid).get();

  if (!snapshot.exists()) {
    throw new Error(`Conversation with uuid - ${uuid} does not exist`);
  }

  return snapshot.val() as DBConversationRecord;
}