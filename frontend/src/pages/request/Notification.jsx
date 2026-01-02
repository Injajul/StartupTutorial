import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../redux/slices/notificationSlice";
import { MdDone, MdDelete, MdNotifications, MdInbox } from "react-icons/md";
import MatchRequests from "./MatchRequest";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const { list, loading, error } = useSelector((state) => state.notification);

  const [activeTab, setActiveTab] = useState("notifications");

  /* ----------------------------------
     FETCH NOTIFICATIONS (ON LOAD)
  ---------------------------------- */
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = await getToken();
      dispatch(getMyNotifications(token));
    };

    fetchNotifications();
  }, [dispatch, getToken]);

  /* ----------------------------------
     HANDLERS
  ---------------------------------- */
  const handleMarkRead = async (id) => {
    const token = await getToken();
    dispatch(markNotificationAsRead({ notificationId: id, token }));
  };

  const handleMarkAllRead = async () => {
    const token = await getToken();
    dispatch(markAllNotificationsAsRead(token));
  };

  const handleDelete = async (id) => {
    const token = await getToken();
    dispatch(deleteNotification({ notificationId: id, token }));
  };

  /* ----------------------------------
     LOADING STATE
  ---------------------------------- */
  if (loading && activeTab === "notifications") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Loading notifications…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-6 py-10 pb-20 lg:pb-2">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`pb-4 font-semibold flex items-center gap-2 ${
              activeTab === "notifications"
                ? "border-b-2 border-accent text-accent"
                : "text-text-muted"
            }`}
          >
            <MdNotifications className="text-xl" />
            <span className="hidden lg:inline font-medium text-text-primary">
              Notifications
            </span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-4 font-semibold flex items-center gap-2 ${
              activeTab === "requests"
                ? "border-b-2 border-accent text-accent"
                : "text-text-muted"
            }`}
          >
            <MdInbox className="text-xl" />
            <span className="hidden lg:inline font-medium text-text-primary">
              Match Requests
            </span>
          </button>
        </div>

        {/* Error */}
        {error && activeTab === "notifications" && (
          <p className="text-red-500 mb-4">
            {typeof error === "string" ? error : "Something went wrong"}
          </p>
        )}

        {/* TAB CONTENT */}
        {activeTab === "notifications" && (
          <>
            {list.length === 0 ? (
              <div className="text-center py-20 text-text-muted">
                No notifications yet
              </div>
            ) : (
              <>
                {/* Actions */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={handleMarkAllRead}
                    className="text-sm px-4 py-2 text-text-primary rounded-xl bg-surface border border-border hover:bg-card transition"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="space-y-4">
                  {list.map((n) => (
                    <div
                      key={n._id}
                      className={`p-5 rounded-2xl border flex justify-between gap-4 transition ${
                        n.isRead
                          ? "bg-card border-border"
                          : "bg-surface border-accent"
                      }`}
                    >
                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-text-primary font-medium">
                          {n.message}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkRead(n._id)}
                            className="p-2 rounded-full bg-success/10 text-success hover:bg-success/20 transition"
                            title="Mark as read"
                          >
                            <MdDone />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                          title="Delete"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* MATCH REQUESTS TAB */}
        {activeTab === "requests" && <MatchRequests />}
      </div>
    </div>
  );
};

export default NotificationsPage;