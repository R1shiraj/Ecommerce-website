import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav'
import { useState } from "react"
import Logo from "./Logo";


export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className=" w-screen h-screen bg-bgGray text-black flex items-center justify-center">
        <div className=" text-center">
          <button onClick={() => signIn('google')} className=" bg-white rounded-lg p-2 px-4">Login with Google</button>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="bg-bgGray min-h-screen text-black">
        <div className="flex md:hidden">
          <button onClick={() => setShowNav(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex grow justify-center mr-8 p-4 font-semibold">
            <Logo />
          </div>
        </div>

        <div className="flex">
          <Nav show={showNav} />
          <div className="  flex-grow text-black mt-2 mr-2 mb-2 rounded-lg p-4 ">
            {children}
          </div>
        </div>
      </div>
    )
  }

}
