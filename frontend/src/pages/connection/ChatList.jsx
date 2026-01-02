// src/pages/ChatList.jsx  (or Chat.jsx)
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { getMyChatRooms } from "../../redux/slices/chatRoomSlice";
import { toast } from "react-toastify";

import { MdChat, MdAccountCircle } from "react-icons/md";

const ChatList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { rooms, loading } = useSelector((state) => state.chatRoom);
  const { currentAuthUser } = useSelector((state) => state.user);
console.log("rooms",rooms)
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const token = await getToken();
        await dispatch(getMyChatRooms(token)).unwrap();
      } catch (err) {
        toast.error("Failed to load chats");
      }
    };
    loadRooms();
  }, [dispatch, getToken]);

  const getOtherUser = (room) => {
    if (!currentAuthUser) return null;
    return room.participants.find(p => p._id.toString() !== currentAuthUser.user?._id.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-xl text-text-muted">Loading your chats...</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <MdChat className="w-24 h-24 text-text-muted/30 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            No Messages Yet
          </h2>
          <p className="text-text-muted">
            Start a conversation when you accept a match request!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Messages</h1>
        <div className="space-y-4">
          {rooms.map((room) => {
            const otherUser = getOtherUser(room);

            return (
              <div
                key={room._id}
                onClick={() => navigate(`/chat/${room._id}`)}
                className="bg-card border border-border rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  {otherUser?.avatarUrl ? (
                    <img
                      src={otherUser.avatarUrl}
                      alt={otherUser.fullName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <MdAccountCircle className="w-14 h-14 text-text-muted" />
                  )}
                  <div>
                    <h3 className="font-bold text-text-primary">
                      {otherUser?.fullName || "Unknown"}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {room.lastMessageId ? "Tap to continue chat" : "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatList;