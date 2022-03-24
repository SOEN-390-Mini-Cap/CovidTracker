export type UserChat = {
    chat: Chat;
    contact: ChatContact;
};

type Chat = {
    id: number;
    userId: number;
    unseenMsg: number;
    chat: ChatMessage[];
};

type ChatMessage = {
    senderId: number;
    message: string;
    time: Date;
};

export type ChatContacts = ChatContact[];

type ChatContact = {
    id: number;
    fullName: string;
    chat: PartialChat;
};

type PartialChat = {
    id: number;
    lastMessage: ChatMessage;
    unseenMsg: number;
};
