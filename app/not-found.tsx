"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <section className="bg-white font-sans min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            {/* Logo Atalho */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img src="logo.png" alt="Atalho" className="h-8 w-auto" />
              </div>
            </div>

            <div
              className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-gray-900 text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8 font-bold">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl text-gray-900 sm:text-3xl font-bold mb-4">
                Parece que você se perdeu
              </h3>
              <p className="mb-6 text-gray-600 sm:mb-5 text-lg">
                A página que você está procurando não está disponível!
              </p>

              <Button
                variant="default"
                onClick={() => router.push("/")}
                className="my-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-medium"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir para Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
