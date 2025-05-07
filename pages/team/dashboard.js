"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../auth/auth-context"
import ProtectedRoute from "../../components/protected-route"
import Link from "next/link"
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore"

export default function TeamDashboard() {
  const { currentUser, userRole, logout } = useAuth()
  const [teamData, setTeamData] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [teamChats, setTeamChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!currentUser) return

      try {
        const db = getFirestore()

        // Get user data to find team ID
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (!userDoc.exists()) {
          console.error("User document not found")
          setLoading(false)
          return
        }

        const userData = userDoc.data()

        // Get team data
        const teamDoc = await getDoc(doc(db, "teams", userData.uid)) // For team owners, team ID is the same as user ID
        if (!teamDoc.exists()) {
          console.error("Team document not found")
          setLoading(false)
          return
        }

        const team = teamDoc.data()
        setTeamData(team)
        setTeamMembers(team.members || [])

        // Get team chats
        const chatsQuery = query(
          collection(db, "chats"),
          where("teamId", "==", userData.uid),
          orderBy("updatedAt", "desc"),
        )
        const chatsSnapshot = await getDocs(chatsQuery)
        const chatsData = chatsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setTeamChats(chatsData)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching team data:", error)
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [currentUser])

  return (
    <ProtectedRoute requiredRole="team">
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950">
        {/* Team Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-400 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">I</span>
                </div>
                <h1 className="text-xl font-bold text-white">Invet Team Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-purple-200">{currentUser?.email}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Team Content */}
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-16">
              <svg
                className="animate-spin h-12 w-12 mx-auto text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4 text-xl font-medium text-white">Loading team data...</p>
            </div>
          ) : teamData ? (
            <>
              {/* Team Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{teamData.teamName}</h2>
                    <p className="text-purple-200">{teamData.teamDescription || "No description provided"}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-purple-300 text-sm">Team PIN:</span>
                      <span className="bg-indigo-900/50 px-3 py-1 rounded-md text-white font-mono">
                        {teamData.teamPin}
                      </span>
                      <span className="text-purple-300 text-xs">(Share with team members to join)</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href="/chat"
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Team Chat
                    </Link>
                    <Link
                      href="/team/settings"
                      className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Team Settings
                    </Link>
                  </div>
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Team Members</h3>
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">{teamMembers.length}</div>
                  <p className="text-purple-300 mt-2">Active team members</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Team Chats</h3>
                    <div className="h-10 w-10 rounded-full bg-green-600/20 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400"
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
                  </div>
                  <div className="text-3xl font-bold text-white">{teamChats.length}</div>
                  <p className="text-purple-300 mt-2">Active conversations</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Team Size</h3>
                    <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="M3 9h18"></path>
                        <path d="M9 21V9"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white capitalize">{teamData.teamSize || "Small"}</div>
                  <p className="text-purple-300 mt-2">Team category</p>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Team Members</h3>
                  <Link
                    href="/team/members"
                    className="text-indigo-300 hover:text-white text-sm flex items-center gap-1"
                  >
                    Manage Members
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>

                {teamMembers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-purple-200 font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-purple-200 font-medium">Email</th>
                          <th className="text-left py-3 px-4 text-purple-200 font-medium">Joined</th>
                          <th className="text-left py-3 px-4 text-purple-200 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map((member, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-white">{member.name}</td>
                            <td className="py-3 px-4 text-purple-200">{member.email}</td>
                            <td className="py-3 px-4 text-purple-200">
                              {member.joinedAt?.toDate().toLocaleDateString() || "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              <button className="text-indigo-400 hover:text-indigo-300 mr-3">Message</button>
                              <button className="text-red-400 hover:text-red-300">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-purple-300">No team members found</p>
                    <p className="text-purple-200 mt-2">Share your team PIN with others so they can join your team.</p>
                  </div>
                )}
              </div>

              {/* Team Chats */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Team Chats</h3>
                  <Link href="/chat" className="text-indigo-300 hover:text-white text-sm flex items-center gap-1">
                    View All Chats
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>

                {teamChats.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamChats.map((chat) => (
                      <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-colors">
                          <h4 className="text-white font-medium mb-2">{chat.title}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-purple-300 text-sm">
                              {chat.participants?.length || 0} participants
                            </span>
                            <span className="text-purple-300 text-sm">
                              {chat.updatedAt?.toDate().toLocaleDateString() || "N/A"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-purple-300">No chats found</p>
                    <Link
                      href="/chat/new"
                      className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      Create New Chat
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-indigo-400 mb-4"
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
              <h2 className="text-2xl font-bold text-white mb-2">Team Not Found</h2>
              <p className="text-purple-200 mb-6">
                We couldn't find your team data. Please contact support if you believe this is an error.
              </p>
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                Return to Login
              </Link>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
