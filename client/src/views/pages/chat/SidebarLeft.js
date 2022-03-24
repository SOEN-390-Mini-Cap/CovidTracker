import { useState, useEffect } from "react";
import Avatar from "@components/avatar";
import { selectChat } from "./store";
import { useDispatch } from "react-redux";
import { formatDateToMonthShort, isObjEmpty } from "@utils";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { X, Search } from "react-feather";
import { CardText, InputGroup, InputGroupText, Badge, Input } from "reactstrap";

const SidebarLeft = (props) => {
    // ** Props & Store
    const { store, sidebar, handleSidebar } = props;
    const { chats } = store;

    // ** Dispatch
    const dispatch = useDispatch();

    // ** State
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const [filteredChat, setFilteredChat] = useState([]);

    // ** Handles User Chat Click
    const handleUserClick = (id) => {
        dispatch(selectChat(id));
        setActive(id);
        if (sidebar === true) {
            handleSidebar();
        }
    };

    useEffect(() => {
        if (!isObjEmpty(store.selectedUser)) {
            if (store.selectedUser.chat) {
                setActive(store.selectedUser.chat.id);
            } else {
                setActive(store.selectedUser.contact.id);
            }
        }
    }, []);

    // ** Renders Chat
    const renderChats = () => {
        if (chats && chats.length) {
            if (query.length && !filteredChat.length) {
                return (
                    <li className="no-results show">
                        <h6 className="mb-0">No Chats Found</h6>
                    </li>
                );
            } else {
                const arrToMap = query.length && filteredChat.length ? filteredChat : chats;

                return arrToMap.map((item) => {
                    const time = formatDateToMonthShort(
                        item.chat.lastMessage ? item.chat.lastMessage.time : new Date(),
                    );

                    return (
                        <li
                            key={item.id}
                            onClick={() => handleUserClick(item.id)}
                            className={classnames({
                                active: active === item.id,
                            })}
                        >
                            <Avatar img={item.avatar} imgHeight="42" imgWidth="42" status={item.status} />
                            <div className="chat-info flex-grow-1">
                                <h5 className="mb-0">{item.fullName}</h5>
                                <CardText className="text-truncate">
                                    {item.chat.lastMessage
                                        ? item.chat.lastMessage.message
                                        : chats[chats.length - 1].message}
                                </CardText>
                            </div>
                            <div className="chat-meta text-nowrap">
                                <small className="float-end mb-25 chat-time ms-25">{time}</small>
                                {item.chat.unseenMsgs >= 1 ? (
                                    <Badge className="float-end" color="danger" pill>
                                        {item.chat.unseenMsgs}
                                    </Badge>
                                ) : null}
                            </div>
                        </li>
                    );
                });
            }
        } else {
            return null;
        }
    };

    const handleFilter = (e) => {
        setQuery(e.target.value);
        const searchFilterFunction = (contact) => contact.fullName.toLowerCase().includes(e.target.value.toLowerCase());
        const filteredChatsArr = chats.filter(searchFilterFunction);
        setFilteredChat([...filteredChatsArr]);
    };

    return store ? (
        <div className="sidebar-left">
            <div className="sidebar">
                <div
                    className={classnames("sidebar-content", {
                        show: sidebar === true,
                    })}
                >
                    <div className="sidebar-close-icon" onClick={handleSidebar}>
                        <X size={14} />
                    </div>
                    <div className="chat-fixed-search">
                        <div className="d-flex align-items-center w-100">
                            <InputGroup className="input-group-merge w-100">
                                <InputGroupText className="round">
                                    <Search className="text-muted" size={14} />
                                </InputGroupText>
                                <Input
                                    value={query}
                                    className="round"
                                    placeholder="Search or start a new chat"
                                    onChange={handleFilter}
                                />
                            </InputGroup>
                        </div>
                    </div>
                    <PerfectScrollbar
                        className="chat-user-list-wrapper list-group"
                        options={{ wheelPropagation: false }}
                    >
                        <h4 className="chat-list-title">Chats</h4>
                        <ul className="chat-users-list chat-list media-list">{renderChats()}</ul>
                    </PerfectScrollbar>
                </div>
            </div>
        </div>
    ) : null;
};

export default SidebarLeft;
