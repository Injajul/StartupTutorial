import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/slices/userSlice"
import founderReducer from "../redux/slices/founderSlice"
import investorReducer from "../redux/slices/investorSlice"
import matchRequesReducer from "../redux/slices/matchRequestSlice"
import connectionReducer from "../redux/slices/connectionSlice"
import chatRoomReducer from "../redux/slices/ChatRoomSlice"
import messageReducer from "../redux/slices/messageSlice"
import notificationReducer from "../redux/slices/notificationSlice"
import recommendationReducer from "../redux/slices/recommendationSlice"

export const store = configureStore({
    reducer:{
        user:userReducer,
        founder:founderReducer,
        investor:investorReducer,
        matchRequest:matchRequesReducer,
        connection:connectionReducer,
        chatRoom:chatRoomReducer,
        message:messageReducer,
        notification:notificationReducer,
        recommendation: recommendationReducer,
    }
})