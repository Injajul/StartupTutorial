// src/pages/Connection.jsx
import React, { useState } from "react";
import Connections from "./Connection";
import ChatList from "./ChatList";
import { MdGroup, MdChat } from "react-icons/md";

const TABS = {
  CONNECTIONS: "connections",
  CHATS: "chats",
};

const ConnectionMain = () => {
  const [activeTab, setActiveTab] = useState(TABS.CONNECTIONS);

  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-2">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5">
          {/* Tabs */}
          <div className="flex gap-2 bg-surface border border-border rounded-2xl p-1 w-fit">
            <button
              onClick={() => setActiveTab(TABS.CONNECTIONS)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition
                ${
                  activeTab === TABS.CONNECTIONS
                    ? "bg-accent text-white shadow"
                    : "text-text-secondary hover:bg-accent/10"
                }
              `}
            >
              <MdGroup className="w-5 h-5" />
              Connections
            </button>

            <button
              onClick={() => setActiveTab(TABS.CHATS)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition
                ${
                  activeTab === TABS.CHATS
                    ? "bg-accent text-white shadow"
                    : "text-text-secondary hover:bg-accent/10"
                }
              `}
            >
              <MdChat className="w-5 h-5" />
              Chats
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="transition-all duration-300">
        {activeTab === TABS.CONNECTIONS && <Connections />}
        {activeTab === TABS.CHATS && <ChatList />}
      </div>
    </div>
  );
};

export default ConnectionMain;