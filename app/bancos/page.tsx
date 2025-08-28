"use client"

import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useBankIntegrations } from "@/hooks/bank/use-bank-integrations"
import { toast } from 'sonner'
import { useSelectedCompany } from "@/hooks/companies/use-selected-company"
import { Loader2, AlertCircle, Upload, X } from "lucide-react"
import { BankIntegrationInput } from "@/types/bank"
import BankSkeleton from "../../components/skeletons/bank"

export default function BancosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<BankIntegrationInput>({
    accountNumber: "",
    pixKey: "",
    clientId: "",
    clientSecret: "",
    certification: null,
    key: null,
  })
  const [dragOver, setDragOver] = useState(false)

  const { selectedCompany } = useSelectedCompany()
  const { 
    integrations, 
    isLoading, 
    error, 
    fetchIntegrations, 
    createIntegration 
  } = useBankIntegrations()

  useEffect(() => {
    if (selectedCompany?.id) {
      fetchIntegrations()
    }
  }, [selectedCompany, fetchIntegrations])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: 'certification' | 'key', file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent, field: 'certification' | 'key') => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(field, files[0])
    }
  }

  const handleSubmit = async () => {
    try {
      await createIntegration(formData)
      setIsModalOpen(false)
      setFormData({
        accountNumber: "",
        pixKey: "",
        clientId: "",
        clientSecret: "",
        certification: null,
        key: null,
      })
    } catch (error) {
      // Error is handled by the hook
      console.error("Erro ao criar integração:", error)
    }
  }

  const columns = [
    {
      key: "bankName" as keyof typeof integrations[0],
      header: "Banco",
    },
    {
      key: "conta" as keyof typeof integrations[0],
      header: "Número da Conta",
    },
    {
      key: "pix" as keyof typeof integrations[0],
      header: "Chave Pix",
    },
  ]

  if (!selectedCompany) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-semibold text-gray-900">Bancos Integrados</h1>
        </div>
        <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-2">Nenhuma empresa selecionada</p>
            <p className="text-sm text-gray-500">Selecione uma empresa para gerenciar integrações bancárias</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-semibold text-gray-900">Bancos Integrados</h1>
        </div>
        <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchIntegrations()}>Tentar novamente</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Bancos Integrados</h1>
          <span className="text-sm text-gray-500">Empresa: {selectedCompany.displayName}</span>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">+ Nova Integração</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Nova Integração</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Número da Conta */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                  Número da Conta
                </Label>
                <Input
                  id="accountNumber"
                  placeholder="Ex: 12345-6"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Chave Pix */}
              <div className="space-y-2">
                <Label htmlFor="pixKey" className="text-sm font-medium text-gray-700">
                  Chave Pix
                </Label>
                <Input
                  id="pixKey"
                  value={formData.pixKey}
                  onChange={(e) => handleInputChange("pixKey", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Client Id */}
              <div className="space-y-2">
                <Label htmlFor="clientId" className="text-sm font-medium text-gray-700">
                  Client Id
                </Label>
                <Input
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) => handleInputChange("clientId", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Client Secret */}
              <div className="space-y-2">
                <Label htmlFor="clientSecret" className="text-sm font-medium text-gray-700">
                  Client Secret
                </Label>
                <Input
                  id="clientSecret"
                  type="password"
                  value={formData.clientSecret}
                  onChange={(e) => handleInputChange("clientSecret", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Upload Areas */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragOver ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'certification')}
                  onClick={() => document.getElementById('certification-upload')?.click()}
                >
                  <input
                    id="certification-upload"
                    type="file"
                    accept=".crt,.pem"
                    className="hidden"
                    onChange={(e) => handleFileUpload('certification', e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center space-y-2">
                    {formData.certification ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Upload className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">
                            {formData.certification.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFileUpload('certification', null)
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-sm text-gray-600 text-center">
                          Clique ou arraste e solte aqui para fazer upload do certificado .crt
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragOver ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'key')}
                  onClick={() => document.getElementById('key-upload')?.click()}
                >
                  <input
                    id="key-upload"
                    type="file"
                    accept=".key,.pem"
                    className="hidden"
                    onChange={(e) => handleFileUpload('key', e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center space-y-2">
                    {formData.key ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Upload className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">
                            {formData.key.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFileUpload('key', null)
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-sm text-gray-600 text-center">
                          Clique ou arraste e solte aqui para fazer upload da chave .key
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Ver tutorial */}
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <button className="text-sm text-gray-600 hover:text-gray-800 underline">Ver tutorial</button>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="px-6">
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-6">
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {isLoading ? (
          <BankSkeleton />
        ) : (
          <>
            {integrations.length > 0 ? (
              <DataTable data={integrations} columns={columns} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Nenhuma integração bancária encontrada</p>
                <p className="text-muted-foreground text-sm mt-2">Crie sua primeira integração para começar</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
