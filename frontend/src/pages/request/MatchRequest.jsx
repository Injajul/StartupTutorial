// src/components/matchRequests/MatchRequestsPanel.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import {
  getIncomingMatchRequests,
  getSentMatchRequests,
  respondToMatchRequest,
  cancelMatchRequest,
  clearMatchRequestError,
} from "../../redux/slices/matchRequestSlice";
import { toast } from "react-toastify";

import {
  MdInbox,
  MdSend,
  MdCheckCircle,
  MdCancel,
  MdHourglassEmpty,
  MdAccountCircle,
} from "react-icons/md";

const MatchRequests = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const { incoming, sent, loading, error } = useSelector(
    (state) => state.matchRequest
  );

  // 🔹 Tabs: "incoming" | "sent"
  const [activeTab, setActiveTab] = useState("incoming");

  /* ----------------------------------
     Fetch requests
  ---------------------------------- */
  useEffect(() => {
    const fetchRequests = async () => {
      const token = await getToken();
      dispatch(getIncomingMatchRequests(token));
      dispatch(getSentMatchRequests(token));
    };

    fetchRequests();
  }, [dispatch, getToken]);

  /* ----------------------------------
     Error handling
  ---------------------------------- */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMatchRequestError());
    }
  }, [error, dispatch]);

  /* ----------------------------------
     Actions
  ---------------------------------- */
  const handleRespond = async (requestId, action) => {
    try {
      const token = await getToken();
      await dispatch(
        respondToMatchRequest({ requestId, action, token })
      ).unwrap();

      toast.success(
        action === "accepted" ? "Match accepted!" : "Request rejected"
      );
    } catch {
      toast.error("Failed to respond");
    }
  };

  const handleCancel = async (requestId) => {
    try {
      const token = await getToken();
      await dispatch(cancelMatchRequest({ requestId, token })).unwrap();
      toast.success("Request cancelled");
    } catch {
      toast.error("Failed to cancel");
    }
  };

  /* ----------------------------------
     Card
  ---------------------------------- */
  const RequestCard = ({ request, isIncoming }) => {
    const user = isIncoming ? request.from : request.to;
    const profileImage = user?.profileImage?.url || user?.avatarUrl;

    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-md">
        <div className="flex gap-4">
          {profileImage ? (
            <img
              src={profileImage}
              alt={user?.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <MdAccountCircle className="w-16 h-16 text-text-muted" />
          )}

          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary">
              {user?.fullName || "Unknown User"}
            </h3>

            <p className="text-sm text-text-secondary capitalize">
              {request.type.replaceAll("-", " ")}
            </p>

            {request.message && (
              <p className="text-sm text-text-muted mt-2 italic">
                “{request.message}”
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-3">
          {isIncoming ? (
            <>
              <button
                onClick={() => handleRespond(request._id, "accepted")}
                disabled={loading}
                className="px-4 py-2 bg-success text-white rounded-lg flex items-center gap-2"
              >
                <MdCheckCircle />
                Accept
              </button>

              <button
                onClick={() => handleRespond(request._id, "rejected")}
                disabled={loading}
                className="px-4 py-2 bg-error text-white rounded-lg flex items-center gap-2"
              >
                <MdCancel />
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={() => handleCancel(request._id)}
              disabled={loading || request.status !== "pending"}
              className="px-4 py-2 border border-border rounded-lg flex items-center gap-2"
            >
              <MdCancel />
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  };

  /* ----------------------------------
     Empty state
  ---------------------------------- */
  const emptyState = (
    <div className="text-center py-16">
      <MdHourglassEmpty className="w-20 h-20 text-text-muted/30 mx-auto mb-4" />
      <p className="text-text-muted">
        No {activeTab === "incoming" ? "incoming" : "sent"} requests
      </p>
    </div>
  );

  /* ----------------------------------
     Render
  ---------------------------------- */
  const data = activeTab === "incoming" ? incoming : sent;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`pb-3 flex items-center gap-2 font-semibold ${
            activeTab === "incoming"
              ? "border-b-2 border-accent text-accent"
              : "text-text-muted"
          }`}
        >
          <MdInbox />
          Incoming ({incoming.length})
        </button>

        <button
          onClick={() => setActiveTab("sent")}
          className={`pb-3 flex items-center gap-2 font-semibold ${
            activeTab === "sent"
              ? "border-b-2 border-accent text-accent"
              : "text-text-muted"
          }`}
        >
          <MdSend />
          Sent ({sent.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-text-muted">Loading...</div>
      ) : data.length === 0 ? (
        emptyState
      ) : (
        <div className="space-y-4">
          {data.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              isIncoming={activeTab === "incoming"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchRequests;