"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../auth/auth-context"
import ProtectedRoute from "../../components/protected-route"
import Link from "next/link"
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore"

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore()

        // Fetch teams
        const teamsQuery = query(collection(db, "teams"), orderBy("createdAt", "desc"), limit(5))
        const teamsSnapshot = await getDocs(teamsQuery)
        const teamsData = teamsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setTeams(teamsData)

        // Fetch users
        const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5))
        const usersSnapshot = await getDocs(usersQuery)
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUsers(usersData)

        // Fetch chats
        const chatsQuery = query(collection(db, "chats"), orderBy("updatedAt", "desc"), limit(5))
        const chatsSnapshot = await getDocs(chatsQuery)
        const chatsData = chatsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setChats(chatsData)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950">
        {/* Admin Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-400 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">I</span>
                </div>
                <h1 className="text-xl font-bold text-white">Invet Admin</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-purple-200">{currentUser?.email}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Banner */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Admin Dashboard</h2>
            <p className="text-purple-200">
              Manage your teams, users, and monitor chat activities from this central dashboard.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Total Teams</h3>
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
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{teams.length}</div>
              <p className="text-purple-300 mt-2">Active teams</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Total Users</h3>
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{users.length}</div>
              <p className="text-purple-300 mt-2">Registered users</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Active Chats</h3>
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
              <div className="text-3xl font-bold text-white">{chats.length}</div>
              <p className="text-purple-300 mt-2">Ongoing conversations</p>
            </div>
          </div>

          {/* Recent Teams */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Recent Teams</h3>
              <Link href="/admin/teams" className="text-purple-300 hover:text-white text-sm flex items-center gap-1">
                View All
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

            {loading ? (
              <div className="text-center py-8">
                <svg
                  className="animate-spin h-8 w-8 mx-auto text-purple-400"
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
                <p className="mt-2 text-purple-300">Loading teams...</p>
              </div>
            ) : teams.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Team Name</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Owner</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Members</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{team.teamName}</td>
                        <td className="py-3 px-4 text-purple-200">{team.ownerEmail}</td>
                        <td className="py-3 px-4 text-purple-200">{team.members?.length || 0}</td>
                        <td className="py-3 px-4 text-purple-200">
                          {team.createdAt?.toDate().toLocaleDateString() || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/admin/teams/${team.id}`} className="text-indigo-400 hover:text-indigo-300">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-purple-300">No teams found</p>
              </div>
            )}
          </div>

          {/* Recent Chats */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Recent Chats</h3>
              <Link href="/admin/chats" className="text-purple-300 hover:text-white text-sm flex items-center gap-1">
                View All
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

            {loading ? (
              <div className="text-center py-8">
                <svg
                  className="animate-spin h-8 w-8 mx-auto text-purple-400"
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
                <p className="mt-2 text-purple-300">Loading chats...</p>
              </div>
            ) : chats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Chat Title</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Participants</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Last Activity</th>
                      <th className="text-left py-3 px-4 text-purple-200 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chats.map((chat) => (
                      <tr key={chat.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{chat.title}</td>
                        <td className="py-3 px-4 text-purple-200">{chat.type}</td>
                        <td className="py-3 px-4 text-purple-200">{chat.participants?.length || 0}</td>
                        <td className="py-3 px-4 text-purple-200">
                          {chat.updatedAt?.toDate().toLocaleDateString() || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/admin/chats/${chat.id}`} className="text-indigo-400 hover:text-indigo-300">
                            View Chat
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-purple-300">No chats found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
