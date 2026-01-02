import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  getMyConnections,
  getConnectionById,
  clearConnectionError,
  clearActiveConnection,
} from "../../redux/slices/connectionSlice";
import { toast } from "react-toastify";

import {
  MdGroup,
  MdChat,
  MdAccountCircle,
  MdAccessTime,
  MdArrowBack,
} from "react-icons/md";
import { FiUsers } from "react-icons/fi";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { list: connections, activeConnection, loading, error } = useSelector(
    (state) => state.connection
  );
  console.log("connections",connections)
  console.log("activeConnection",activeConnection)
  const { currentAuthUser } = useSelector((state) => state.user);

  const [selectedConnection, setSelectedConnection] = useState(null);

  /* ----------------------------------
     FETCH CONNECTIONS
  ---------------------------------- */
  useEffect(() => {
    const fetchConnections = async () => {
      const token = await getToken();
      dispatch(getMyConnections(token));
    };
    fetchConnections();
  }, [dispatch, getToken]);

  /* ----------------------------------
     ERROR HANDLING
  ---------------------------------- */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearConnectionError());
    }
  }, [error, dispatch]);

  /* ----------------------------------
     HANDLERS
  ---------------------------------- */
  const handleConnectionClick = async (connectionId) => {
    try {
      const token = await getToken();
      await dispatch(getConnectionById({ connectionId, token })).unwrap();
      setSelectedConnection(connectionId);
    } catch {
      toast.error("Failed to load connection details");
    }
  };

  const handleBack = () => {
    setSelectedConnection(null);
    dispatch(clearActiveConnection());
  };

  const openChatFromConnection = (connection) => {
    if (!connection?.chatRoomId) {
      toast.error("Chat room not ready yet");
      return;
    }
    navigate(`/chat/${connection.chatRoomId}`);
  };

  /* ----------------------------------
     HELPERS
  ---------------------------------- */
  const getOtherUser = (connection) => {
    if (!currentAuthUser) return null;
    return connection.participants.find(
      (p) => p._id.toString() !== currentAuthUser.user?._id.toString()
    );
  };

  /* ----------------------------------
     LOADING
  ---------------------------------- */
  if (loading && connections.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent mx-auto mb-6"></div>
          <p className="text-xl text-text-muted">Loading your connections...</p>
        </div>
      </div>
    );
  }

  /* ----------------------------------
     EMPTY STATE
  ---------------------------------- */
  if (!loading && connections.length === 0) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <MdGroup className="w-32 h-32 text-text-muted/30 mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            No Connections Yet
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Start sending match requests. Once accepted, they’ll appear here!
          </p>
          <button
            onClick={() => navigate("/founders")}
            className="mt-8 px-8 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent-hover transition"
          >
            Browse Founders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-3xl border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedConnection && (
              <button
                onClick={handleBack}
                className="p-3 rounded-2xl bg-surface shadow-lg hover:shadow-xl transition"
              >
                <MdArrowBack className="w-6 h-6 text-text-primary" />
              </button>
            )}
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
              {selectedConnection ? "Connection Details" : "My Connections"}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-text-secondary">
            <FiUsers className="w-6 h-6" />
            <span className="text-xl font-bold">{connections.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {selectedConnection && activeConnection ? (
          /* ==================== SINGLE CONNECTION VIEW ==================== */
          <div className="bg-card border border-border rounded-3xl shadow-2xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
              <div className="relative">
                {getOtherUser(activeConnection)?.avatarUrl ? (
                  <img
                    src={getOtherUser(activeConnection).avatarUrl}
                    alt={getOtherUser(activeConnection)?.fullName}
                    className="w-40 h-40 rounded-full object-cover border-8 border-card shadow-2xl"
                  />
                ) : (
                  <MdAccountCircle className="w-40 h-40 text-text-muted" />
                )}
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-success rounded-full border-4 border-card flex items-center justify-center">
                  <MdChat className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-4xl font-bold text-text-primary">
                  {getOtherUser(activeConnection)?.fullName}
                </h2>
                <p className="text-xl text-text-secondary mt-2 capitalize">
                  {activeConnection.type.replace("-", " ")}
                </p>
                <p className="text-text-muted mt-4">
                  Connected on{" "}
                  {new Date(activeConnection.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-surface/50 rounded-2xl p-8 text-center">
              <MdChat className="w-20 h-20 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-text-primary mb-3">
                Start Chatting
              </h3>
              <p className="text-text-muted max-w-2xl mx-auto">
                You’re now connected. Start the conversation!
              </p>
              <button
                onClick={() => openChatFromConnection(activeConnection)}
                className="mt-8 px-10 py-4 bg-gradient-to-r from-accent to-accent-hover text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition"
              >
                Open Chat
              </button>
            </div>
          </div>
        ) : (
          /* ==================== CONNECTIONS LIST VIEW ==================== */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {connections.map((connection) => {
              const otherUser = getOtherUser(connection);

              return (
                <div
                  key={connection._id}
                  onClick={() => handleConnectionClick(connection._id)}
                  className="bg-card border border-border rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                >
                  <div className="p-8 text-center">
                    <div className="relative inline-block mb-6">
                      {otherUser?.avatarUrl ? (
                        <img
                          src={otherUser.avatarUrl}
                          alt={otherUser.fullName}
                          className="w-32 h-32 rounded-full object-cover border-4 border-border shadow-lg"
                        />
                      ) : (
                        <MdAccountCircle className="w-32 h-32 text-text-muted" />
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-text-primary">
                      {otherUser?.fullName}
                    </h3>
                    <p className="text-text-secondary mt-2 capitalize">
                      {connection.type.replace("-", " ")}
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 text-text-muted">
                      <MdAccessTime className="w-5 h-5" />
                      <span className="text-sm">
                        {new Date(connection.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openChatFromConnection(connection);
                      }}
                      disabled={!connection.chatRoomId}
                      className={`w-full py-3 rounded-2xl font-semibold transition ${
                        connection.chatRoomId
                          ? "bg-gradient-to-r from-accent to-accent-hover text-white hover:shadow-lg"
                          : "bg-surface text-text-muted cursor-not-allowed"
                      }`}
                    >
                      {connection.chatRoomId ? "Send Message" : "Chat Not Ready"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;