"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { useCompanies } from "@/hooks/companies/use-companies";

import { useRouter } from "next/navigation";
import { formatCNPJ } from "@/lib/validation";
import CompanySkeleton from "@/components/skeletons/company-skeleton";

export default function CampanhasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    description: "",
  });

  const {
    companies,
    pagination,
    isLoading,
    error,
    fetchCompanies,
    createCompany,
    selectCompany,
    goToPage,
  } = useCompanies();

  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
  }, []); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCompany({
        name: formData.name,
        taxId: formData.taxId,
        description: formData.description || undefined,
      });

      setIsModalOpen(false);
      setFormData({ name: "", taxId: "", description: "" });
    } catch (error) {
      throw error;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccessCompany = (companyId: string) => {
    selectCompany(companyId);
    router.push("/");
  };

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between p-4 border-b bg-background">
          <h1 className="text-2xl font-semibold text-foreground">
            Suas Companhias
          </h1>
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchCompanies()}>Tentar novamente</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Suas Companhias
          </h1>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              + Nova Companhia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Adicionar Nova Companhia
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Razão Social
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="taxId"
                  className="text-sm font-medium text-muted-foreground"
                >
                  CNPJ
                </Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              <DialogFooter className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Adicionar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <CompanySkeleton />
        ) : (
          <>
            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-foreground">
                      {company.displayName}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-blue-600">CNPJ:</span>{" "}
                        {formatCNPJ(company.taxId)}
                      </p>
                      <p>
                        <span className="font-medium text-blue-600">ERP:</span>{" "}
                        {company.erpType}
                      </p>
                    </div>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                      onClick={() => handleAccessCompany(company.id)}
                    >
                      Acessar
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Custom Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">

                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}

            {companies.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhuma empresa encontrada
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Crie sua primeira empresa para começar
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
