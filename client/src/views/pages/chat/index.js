import { Fragment, useState, useEffect } from "react";
import Chat from "./Chat";
import Sidebar from "./SidebarLeft";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { getChatContacts } from "./store";

import "@styles/base/pages/app-chat.scss";
import "@styles/base/pages/app-chat-list.scss";

const AppChat = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state.chat);
    const token = useSelector((state) => state.auth.userData.token);

    const [sidebar, setSidebar] = useState(false);
    const [userSidebarRight, setUserSidebarRight] = useState(false);
    const [userSidebarLeft, setUserSidebarLeft] = useState(false);

    const handleSidebar = () => setSidebar(!sidebar);
    const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft);
    const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight);
    const handleOverlayClick = () => {
        setSidebar(false);
        setUserSidebarRight(false);
        setUserSidebarLeft(false);
    };

    useEffect(() => {
        dispatch(getChatContacts({ token }));
    }, [dispatch, token]);

    return (
        <Fragment>
            <Sidebar
                store={store}
                sidebar={sidebar}
                handleSidebar={handleSidebar}
                userSidebarLeft={userSidebarLeft}
                handleUserSidebarLeft={handleUserSidebarLeft}
            />
            <div className="content-right">
                <div className="content-wrapper">
                    <div className="content-body">
                        <div
                            className={classnames("body-content-overlay", {
                                show: userSidebarRight || sidebar || userSidebarLeft,
                            })}
                            onClick={handleOverlayClick}
                        />
                        <Chat
                            store={store}
                            handleSidebar={handleSidebar}
                            userSidebarLeft={userSidebarLeft}
                            handleUserSidebarRight={handleUserSidebarRight}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AppChat;
