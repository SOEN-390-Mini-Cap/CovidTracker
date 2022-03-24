import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import { sendMsg } from "./store";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { MessageSquare, Menu, Send } from "react-feather";
import { Form, Input, Button, InputGroup} from "reactstrap";

const ChatLog = (props) => {
    const { handleSidebar, store, userSidebarLeft } = props;
    const { selectedUser } = store;

    const chatArea = useRef(null);
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.auth.userData.user.account.userId);
    const token = useSelector((state) => state.auth.userData.token);

    const [msg, setMsg] = useState("");

    const scrollToBottom = () => {
        const chatContainer = ReactDOM.findDOMNode(chatArea.current);
        chatContainer.scrollTop = Number.MAX_SAFE_INTEGER;
    };

    useEffect(() => {
        const selectedUserLen = Object.keys(selectedUser).length;

        if (selectedUserLen) {
            scrollToBottom();
        }
    }, [selectedUser]);

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

    const handleStartConversation = () => {
        if (!Object.keys(selectedUser).length && !userSidebarLeft && window.innerWidth < 992) {
            handleSidebar();
        }
    };

    const handleSendMsg = (e) => {
        e.preventDefault();
        if (msg.length) {
            dispatch(sendMsg({ token, to: selectedUser.contact.id, body: msg }));
            setMsg("");
        }
    };

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
