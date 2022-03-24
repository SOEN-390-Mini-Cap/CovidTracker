import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import { sendMsg } from "./store";
import {useDispatch, useSelector} from "react-redux";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { MessageSquare, Menu, Image, Send } from "react-feather";
import { Form, Label, Input, Button, InputGroup, InputGroupText } from "reactstrap";

const ChatLog = (props) => {
    // ** Props & Store
    const { handleSidebar, store, userSidebarLeft } = props;
    const { selectedUser } = store;

    // ** Refs & Dispatch
    const chatArea = useRef(null);
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userData.user.account.userId);
    const token = useSelector((state) => state.auth.userData.token);

    // ** State
    const [msg, setMsg] = useState("");

    // ** Scroll to chat bottom
    const scrollToBottom = () => {
        const chatContainer = ReactDOM.findDOMNode(chatArea.current);
        chatContainer.scrollTop = Number.MAX_SAFE_INTEGER;
    };

    // ** If user chat is not empty scrollToBottom
    useEffect(() => {
        const selectedUserLen = Object.keys(selectedUser).length;

        if (selectedUserLen) {
            scrollToBottom();
        }
    }, [selectedUser]);

    // ** Formats chat data based on sender
    const formattedChatData = () => {
        let chatLog = [];
        if (selectedUser.chat) {
            chatLog = selectedUser.chat.chat;
        }

        const formattedChatLog = [];
        let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined;
        let msgGroup = {
            senderId: chatMessageSenderId,
            messages: [],
        };
        chatLog.forEach((msg, index) => {
            if (chatMessageSenderId === msg.senderId) {
                msgGroup.messages.push({
                    msg: msg.message,
                    time: msg.time,
                });
            } else {
                chatMessageSenderId = msg.senderId;
                formattedChatLog.push(msgGroup);
                msgGroup = {
                    senderId: msg.senderId,
                    messages: [
                        {
                            msg: msg.message,
                            time: msg.time,
                        },
                    ],
                };
            }
            if (index === chatLog.length - 1) formattedChatLog.push(msgGroup);
        });
        return formattedChatLog;
    };

    // ** Renders user chat
    const renderChats = () => {
        return formattedChatData().map((item, index) => {
            return (
                <div
                    key={index}
                    className={classnames("chat", {
                        "chat-left": item.senderId !== userId,
                    })}
                >
                    <div className="chat-body">
                        {item.messages.map((chat) => (
                            <div key={chat.msg} className="chat-content">
                                <p>{chat.msg}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    // ** On mobile screen open left sidebar on Start Conversation Click
    const handleStartConversation = () => {
        if (!Object.keys(selectedUser).length && !userSidebarLeft && window.innerWidth < 992) {
            handleSidebar();
        }
    };

    // ** Sends New Msg
    const handleSendMsg = (e) => {
        e.preventDefault();
        if (msg.length) {
            dispatch(sendMsg({ token, to: selectedUser.contact.id, body: msg }));
            setMsg("");
        }
    };

    // ** ChatWrapper tag based on chat's length
    const ChatWrapper = Object.keys(selectedUser).length && selectedUser.chat ? PerfectScrollbar : "div";

    return (
        <div className="chat-app-window">
            <div className={classnames("start-chat-area", { "d-none": Object.keys(selectedUser).length })}>
                <div className="start-chat-icon mb-1">
                    <MessageSquare />
                </div>
                <h4 className="sidebar-toggle start-chat-text" onClick={handleStartConversation}>
                    Start Conversation
                </h4>
            </div>
            {Object.keys(selectedUser).length ? (
                <div className={classnames("active-chat", { "d-none": selectedUser === null })}>
                    <div className="chat-navbar">
                        <header className="chat-header">
                            <div className="d-flex align-items-center">
                                <div className="sidebar-toggle d-block d-lg-none me-1" onClick={handleSidebar}>
                                    <Menu size={21} />
                                </div>
                                <h6 className="mb-0">{selectedUser.contact.fullName}</h6>
                            </div>
                        </header>
                    </div>

                    <ChatWrapper ref={chatArea} className="user-chats" options={{ wheelPropagation: false }}>
                        {selectedUser.chat ? <div className="chats">{renderChats()}</div> : null}
                    </ChatWrapper>

                    <Form className="chat-app-form" onSubmit={(e) => handleSendMsg(e)}>
                        <InputGroup className="input-group-merge me-1 form-send-message">
                            <Input
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                placeholder="Type a message..."
                            />
                        </InputGroup>
                        <Button className="send" color="primary">
                            <Send size={14} className="d-lg-none" />
                            <span className="d-none d-lg-block">Send</span>
                        </Button>
                    </Form>
                </div>
            ) : null}
        </div>
    );
};

export default ChatLog;
