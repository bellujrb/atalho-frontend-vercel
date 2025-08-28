"use client"

import { SignIn } from "@clerk/nextjs"
import { motion } from "framer-motion"
import Link from "next/link"
import "../app/sign-in/[[...sign-in]]/clerk-custom.css"

export function SignInPageContent() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <img 
            src="/Logo atalho sem margens.svg" 
            alt="Atalho" 
            className="h-8 w-auto"
          />
        </div>
        <Link href="/sign-up" className="text-gray-600 hover:text-gray-900 transition-colors">
          Criar conta
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-bold text-gray-900">Entre na Atalho</h1>
            <p className="text-gray-600">Acesse sua conta de automação financeira.</p>
          </motion.div>

          {/* Clerk SignIn Component */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <SignIn 
              redirectUrl="/companies"
              appearance={{
                elements: {
                  card: "shadow-none bg-transparent",
                  footerAction: "hidden",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden", 
                }
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="p-6 flex justify-center space-x-6">
        <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
          Termos
        </Link>
        <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
          Política de Privacidade
        </Link>
      </footer>
    </div>
  )
}
