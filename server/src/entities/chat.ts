export type UserChat = {
    chat: Chat;
    contact: ChatContact;
};

export type Chat = {
    id: number; // chatId
    userId: number;
    unseenMsg: number;
    chat: ChatMessage[];
};

type ChatMessage = {
    senderId: number;
    message: string;
    time: Date;
};

export type ChatContacts = {
    chats: ChatContact[];
};

export type ChatContact = {
    id: number; // chatId
    fullName: string; // otherPerson
    chat: PartialChat;
};

type PartialChat = {
    id: number; // chatId
    lastMessage: ChatMessage;
    unseenMsg: number;
};
