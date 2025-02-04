export enum QUERY_KEYS {
    // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  GET_FILE_PREVIEW = "getFilePreview",
  // SAVE KEYS
  GET_SAVE_BY_ID = "getSaveById",
  GET_SAVES_BY_ID = "getSavesById",

  //  SEARCH KEYS
  SEARCH_POSTS = "getSearchPosts",


  // BOOKINGS KEYS
  GET_RECENT_AVAIL = "GetRecentAvailabilities",
  GET_RECENT_BOOKING = "GetRecentBookings",
  GET_AVAIL_BY_PROP_ID = "GetAvailByPropId",

  // CHATS KEYS
  GET_USERCHATS = "GetUserChats",
  GET_UNSEEN_MESSAGES_COUNT = "GetUnseenMessagesCount",
  GET_CHAT_MESSAGES = "GetChatMessages",
  CREATE_NEW_MESSAGE = "CreateNewMessage",
  GET_CHAT_BY_ID = "GetChatById",
  GET_INFINITE_MESSAGES = "GetInfiniteMessages",
  GET_BLOCKED_USERS = "GetBlockedUsers",
  
}