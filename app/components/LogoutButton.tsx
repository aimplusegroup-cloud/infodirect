"use client"

import { useSession, signOut } from "next-auth/react"

export default function LogoutButton() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/logADinfo-100MperW/login", // مسیر درست لاگین
        })
      }
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      خروج
    </button>
  )
}
