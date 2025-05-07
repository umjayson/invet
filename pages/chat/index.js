"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../auth/auth-context"
import ProtectedRoute from "../../components/protected-route"
import Link from "next/link"
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore"

export default function ChatInterface() {
  const { currentUser, userRole } = useAuth()
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [teamData, setTeamData] = useState(null)
  const messagesEndRef = useRef(null)

  // Add better error handling and loading states for chat
  const [chatError, setChatError] = useState(null)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [creatingChat, setCreatingChat] = useState(false)

  // Fetch user data and chats
  useEffect(() => {
    if (!currentUser) return

    const fetchUserData = async () => {
      try {
        const db = getFirestore()
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserData(userData)

          // If user is part of a team, fetch team data
          if (userData.teamId) {
            const teamDoc = await getDoc(doc(db, "teams", userData.teamId))
            if (teamDoc.exists()) {
              setTeamData(teamDoc.data())
            }
          }

          // Set up chats listener based on user role
          let chatsQuery

          if (userRole === "admin") {
            // Admins can see all chats
            chatsQuery = query(collection(db, "chats"), orderBy("updatedAt", "desc"))
          } else if (userRole === "team") {
            // Team owners see their team's chats
            chatsQuery = query(
              collection(db, "chats"),
              where("teamId", "==", currentUser.uid),
              orderBy("updatedAt", "desc"),
            )
          } else {
            // Employees see chats they're participants in
            chatsQuery = query(
              collection(db, "chats"),
              where("participants", "array-contains", currentUser.uid),
              orderBy("updatedAt", "desc"),
            )
          }

          const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
            const chatsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            setChats(chatsData)

            // If no active chat is selected and we have chats, select the first one
            if (!activeChat && chatsData.length > 0) {
              setActiveChat(chatsData[0])
            }

            setLoading(false)
          })

          return unsubscribe
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser, userRole, activeChat])

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) return

    const db = getFirestore()
    const messagesQuery = query(collection(db, "chats", activeChat.id, "messages"), orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setMessages(messagesData)
    })

    return unsubscribe
  }, [activeChat])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleChatSelect = (chat) => {
    setActiveChat(chat)
  }

  // Update the handleSendMessage function with better error handling
  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !activeChat) return

    setSendingMessage(true)
    setChatError(null)

    try {
      const db = getFirestore()
      const messageData = {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: userData?.name || "User",
        timestamp: Timestamp.now(),
      }

      // Add message to subcollection
      await addDoc(collection(db, "chats", activeChat.id, "messages"), messageData)

      // Update chat's updatedAt timestamp
      await updateDoc(doc(db, "chats", activeChat.id), {
        updatedAt: Timestamp.now(),
        lastMessage: newMessage.substring(0, 50) + (newMessage.length > 50 ? "..." : ""),
        lastMessageTime: Timestamp.now(),
        lastMessageSender: userData?.name || "User",
      })

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      setChatError("Failed to send message. Please try again.")
    } finally {
      setSendingMessage(false)
    }
  }

  // Update the createNewChat function with better error handling
  const createNewChat = async () => {
    setCreatingChat(true)
    setChatError(null)

    try {
      const db = getFirestore()

      // Create a new chat document
      const chatData = {
        title: `New Chat - ${new Date().toLocaleString()}`,
        type: "individual",
        participants: [currentUser.uid],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      // If user is part of a team, add team info
      if (userData?.teamId) {
        chatData.teamId = userData.teamId
        chatData.teamName = userData.teamName
      }

      // Add the new chat to Firestore
      const newChatRef = await addDoc(collection(db, "chats"), chatData)

      // Add a welcome message
      await addDoc(collection(db, "chats", newChatRef.id, "messages"), {
        text: "Welcome to your new chat! Start typing to send messages.",
        senderId: "system",
        senderName: "System",
        timestamp: Timestamp.now(),
        type: "notification",
      })

      // Set the new chat as active
      setActiveChat({
        id: newChatRef.id,
        ...chatData,
      })
    } catch (error) {
      console.error("Error creating new chat:", error)
      setChatError("Failed to create new chat. Please try again.")
    } finally {
      setCreatingChat(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 flex flex-col">
        {/* Chat Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-green-600 to-teal-400 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">I</span>
                </div>
                <h1 className="text-xl font-bold text-white">Invet Chat</h1>
              </div>
              <div className="flex items-center gap-4">
                {userRole === "team" && (
                  <Link
                    href="/team/dashboard"
                    className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Team Dashboard
                  </Link>
                )}
                {userRole === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Sidebar */}
          <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col">
            {/* User Info */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {userData?.name?.charAt(0) || currentUser?.email?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{userData?.name || "User"}</p>
                  <p className="text-purple-300 text-sm truncate">{currentUser?.email}</p>
                </div>
              </div>
            </div>

            {/* Chat Search */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full bg-white/10 border border-white/20 rounded-md py-2 px-4 pl-10 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <button
                onClick={createNewChat}
                className="w-full bg-green-600 hover:bg-green-500 text-white rounded-md py-2 px-4 flex items-center justify-center gap-2 transition-colors"
                disabled={creatingChat}
              >
                {creatingChat ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                    New Chat
                  </>
                )}
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <svg
                    className="animate-spin h-8 w-8 text-purple-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : chats.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 cursor-pointer hover:bg-white/10 transition-colors ${
                        activeChat?.id === chat.id ? "bg-white/10" : ""
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-indigo-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{chat.title}</p>
                          <p className="text-purple-300 text-sm truncate">
                            {chat.teamName ? `Team: ${chat.teamName}` : "Personal Chat"}
                          </p>
                        </div>
                        <div className="text-xs text-purple-300">
                          {chat.updatedAt?.toDate().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-purple-400 mb-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p className="text-purple-200 mb-4">No chats found</p>
                  <button
                    onClick={createNewChat}
                    className="bg-green-600 hover:bg-green-500 text-white rounded-md py-2 px-4 text-sm transition-colors"
                  >
                    Start a New Chat
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Main Area */}
          <div className="flex-1 flex flex-col">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-white font-medium">{activeChat.title}</h2>
                        <p className="text-purple-300 text-sm">{activeChat.participants?.length || 0} participants</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-full hover:bg-white/10 text-purple-300 hover:text-white transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add error message display in the chat interface */}
                {chatError && (
                  <div className="p-2 bg-red-500/20 text-white border border-red-500/30 m-4 rounded-md">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span>{chatError}</span>
                    </div>
                  </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === currentUser.uid ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === currentUser.uid ? "bg-green-600 text-white" : "bg-white/10 text-white"
                          }`}
                        >
                          {message.senderId !== currentUser.uid && (
                            <p className="text-xs font-medium mb-1 text-purple-200">{message.senderName}</p>
                          )}
                          <p>{message.text}</p>
                          <p className="text-xs mt-1 text-right opacity-70">
                            {message.timestamp?.toDate().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-purple-400 mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <p className="text-purple-200">No messages yet</p>
                      <p className="text-purple-300 text-sm mt-2">Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-md py-2 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors"
                      disabled={sendingMessage}
                    >
                      {sendingMessage ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m22 2-7 20-4-9-9-4Z"></path>
                          <path d="M22 2 11 13"></path>
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-purple-400 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Invet Chat</h2>
                <p className="text-purple-200 max-w-md mb-6">
                  Select an existing chat from the sidebar or create a new one to get started.
                </p>
                <button
                  onClick={createNewChat}
                  className="bg-green-600 hover:bg-green-500 text-white rounded-md py-2 px-6 transition-colors"
                >
                  Start a New Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
