import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  getMessagesByRoom,
  sendMessage,
  receiveMessage,
} from "../../redux/slices/messageSlice";
import { getMyChatRooms } from "../../redux/slices/chatRoomSlice";
import { getSocket } from "../../lib/socket";
import {
  MdSend,
  MdAccountCircle,
  MdArrowBack,
  MdAttachFile,
  MdClose,
} from "react-icons/md";
import { toast } from "react-toastify";

const ChatRoom = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { rooms, loading: roomsLoading } = useSelector(
    (state) => state.chatRoom
  );
  const { byRoom } = useSelector((state) => state.message);
  const { currentAuthUser } = useSelector((state) => state.user);

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  /* --------------------------------------------------
     1️⃣ FETCH ROOMS ON REFRESH (CRITICAL)
  -------------------------------------------------- */
  useEffect(() => {
    if (rooms.length) return;

    const fetchRooms = async () => {
      const token = await getToken();
      dispatch(getMyChatRooms(token));
    };

    fetchRooms();
  }, [dispatch, getToken, rooms.length]);

  /* --------------------------------------------------
     2️⃣ FIND CURRENT ROOM
  -------------------------------------------------- */
  const currentRoom = rooms.find((r) => r._id?.toString() === roomId);
  const messages = byRoom[roomId] || [];

  const otherUser = currentRoom?.participants?.find(
    (p) => p._id.toString() !== currentAuthUser?.user?._id.toString()
  );

  /* --------------------------------------------------
     3️⃣ LOAD MESSAGES (CRITICAL)
  -------------------------------------------------- */
  useEffect(() => {
    if (!roomId || !currentRoom) return;

    const loadMessages = async () => {
      const token = await getToken();
      dispatch(getMessagesByRoom({ roomId, token }));
    };

    loadMessages();
  }, [roomId, currentRoom, dispatch, getToken]);

  /* --------------------------------------------------
     4️⃣ SOCKET (NEW MESSAGES ONLY)
  -------------------------------------------------- */
  useEffect(() => {
    if (!currentAuthUser?.user?._id || !roomId) return;

    const socket = getSocket(currentAuthUser.user.clerkId);
    socket.emit("joinRoom", roomId);

    socket.on("newMessage", (msg) => {
      if (msg.from === currentAuthUser.user._id) return;
      dispatch(receiveMessage(msg));
    });

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("newMessage");
    };
  }, [roomId, currentAuthUser?.user?._id, dispatch]);

  /* --------------------------------------------------
     5️⃣ AUTO SCROLL
  -------------------------------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* --------------------------------------------------
     6️⃣ SEND MESSAGE
  -------------------------------------------------- */
  const handleSend = async () => {
    if (!message.trim() && files.length === 0) return;

    try {
      const token = await getToken();
      const formData = new FormData();

      formData.append("roomId", roomId);
      formData.append("body", message.trim());

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      await dispatch(
        sendMessage({
          data: formData,
          token,
          isMultipart: true,
        })
      ).unwrap();

      setMessage("");
      setFiles([]);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* --------------------------------------------------
     7️⃣ LOADING & SAFETY STATES
  -------------------------------------------------- */
  if (roomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Loading chat…</p>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Chat room not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col pb-20 lg:pb-2">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-6 text-text-primary py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-surface"
          >
            <MdArrowBack size={22} />
          </button>

          {otherUser?.avatarUrl ? (
            <img
              src={otherUser.avatarUrl}
              alt={otherUser.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <MdAccountCircle size={40} />
          )}

          <h2 className="font-semibold text-text-primary">
            {otherUser?.fullName || "Chat"}
          </h2>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        {messages.map((msg) => {
          const isMine =
            msg.from.toString() ===
            currentAuthUser.user._id.toString();

          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[75%] space-y-2">
                {msg.body && (
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isMine
                        ? "bg-accent text-white"
                        : "bg-card border"
                    }`}
                  >
                    {msg.body}
                  </div>
                )}

                {msg.attachments?.map((att, i) => {
                  if (att.mimeType.startsWith("image/")) {
                    return (
                      <img
                        key={i}
                        src={att.file.url}
                        alt="attachment"
                        className="max-w-xs rounded-xl border shadow"
                      />
                    );
                  }

                  return (
                    <a
                      key={i}
                      href={att.file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-accent underline block"
                    >
                      {att.meta?.originalName || att.mimeType}
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ================= IMAGE PREVIEW ================= */}
      {files.length > 0 && (
        <div className="px-4 sm:px-6 py-2 bg-card border-t border-border flex gap-3 overflow-x-auto">
          {files.map((file, i) =>
            file.type.startsWith("image/") ? (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-xl border"
                />
                <button
                  onClick={() => removeFile(i)}
                  className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1"
                >
                  <MdClose size={14} />
                </button>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* ================= INPUT ================= */}
      <div className="border-t border-border bg-card">
        <div className="max-w-5xl mx-auto text-text-primary px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-3 rounded-full bg-surface"
          >
            <MdAttachFile />
          </button>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            hidden
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message…"
            className="flex-1 px-5 py-3 rounded-full bg-surface border"
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() && files.length === 0}
            className="p-3 rounded-full bg-accent text-white"
          >
            <MdSend size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;