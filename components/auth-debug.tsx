"use client"

import { useClerkAuth } from '@/hooks/use-clerk-auth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { apiService } from '@/lib/api'

export function AuthDebug() {
  const { user, isLoaded, userId, getCurrentToken } = useClerkAuth()
  const [testResult, setTestResult] = useState<string>('')
  const [isTesting, setIsTesting] = useState(false)

  const testAuth = async () => {
    setIsTesting(true)
    setTestResult('')
    
    try {
      console.log('=== AUTH DEBUG START ===')
      
      // Testar obtenção do token
      const token = await getCurrentToken()
      console.log('Token obtained:', token ? 'YES' : 'NO')
      if (token) {
        console.log('Token length:', token.length)
        console.log('Token preview:', token.substring(0, 50) + '...')
      }
      
      // Testar chamada para a API
      try {
        const response = await apiService.get('auth/verify-token')
        console.log('API call successful:', response.status)
        setTestResult('✅ API call successful')
      } catch (error: any) {
        console.error('API call failed:', error)
        setTestResult(`❌ API call failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`)
      }
      
      console.log('=== AUTH DEBUG END ===')
    } catch (error) {
      console.error('Debug error:', error)
      setTestResult(`❌ Debug error: ${error}`)
    } finally {
      setIsTesting(false)
    }
  }

  if (!isLoaded) {
    return <div>Loading auth...</div>
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Auth Debug</h3>
      
      <div className="space-y-2 mb-4">
        <div><strong>User ID:</strong> {userId || 'None'}</div>
        <div><strong>User:</strong> {user ? 'Yes' : 'No'}</div>
        {user && (
          <>
            <div><strong>Name:</strong> {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</div>
            <div><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress || 'N/A'}</div>
          </>
        )}
      </div>
      
      <Button 
        onClick={testAuth} 
        disabled={isTesting}
        className="mb-4"
      >
        {isTesting ? 'Testing...' : 'Test Authentication'}
      </Button>
      
      {testResult && (
        <div className="p-3 bg-white border rounded">
          <strong>Test Result:</strong>
          <pre className="mt-2 text-sm">{testResult}</pre>
        </div>
      )}
      
      <div className="text-xs text-gray-600 mt-4">
        Check browser console for detailed logs
      </div>
    </div>
  )
}
