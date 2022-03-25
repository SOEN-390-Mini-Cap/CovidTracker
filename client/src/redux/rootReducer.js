// ** Reducers Imports
import navbar from "./navbar";
import layout from "./layout";
import auth from "./authentication";
import chat from "@src/views/pages/chat/store";

const rootReducer = {
    auth,
    navbar,
    layout,
    chat,
};

export default rootReducer;
