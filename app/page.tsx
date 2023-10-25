import ChatInterface from '@/components/Chatinterface'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <ChatInterface />
        </div>
    </>
  )
}
