import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav'


const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }) {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className=" w-screen h-screen bg-blue-500 text-black flex items-center justify-center">
        <div className=" text-center">
          <button onClick={() => signIn('google')} className=" bg-white rounded-lg p-2 px-4">Login with Google</button>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className=" bg-blue-900 min-h-screen flex">
        <Nav />
        <div className=" bg-white flex-grow text-black mt-2 mr-2 mb-2 rounded-lg p-4 ">
            {children}
        </div>
      </div>
    )
  }

}
