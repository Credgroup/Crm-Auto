import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { AxiosResponse } from "axios";
import ContactCard from "./ContactCard";
import { v4 as uuidv4 } from "uuid";

type ContatoTabProps = {
  id?: string | null;
};

function ContatoTab({ id }: Readonly<ContatoTabProps>) {
  const [phones, setPhones] = useState<any>([]);
  const [emails, setEmails] = useState<any>([]);

  const { data, isSuccess, isError, error, isLoading } = useQuery({
    queryKey: ["fetchEnterprisePersonsById", id],
    queryFn: async () => {
      const res: AxiosResponse<any> = await execApi({
        url: "api/crm/lead/find/contact",
        method: "POST",
        data: {
          IdSeguradoI2k: id,
        },
        isCrmApi: true,
      });

      if (res.status !== 200 || !res.data) {
        throw new Error("Erro ao buscar contatos da pessoa");
      }
      return res.data;
    },
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const { email, telefones } = data;
      setPhones(telefones);
      setEmails(email);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      console.log(error);
    }
  }, [isError]);

  if (!id) {
    return <div>Id não encontrado</div>;
  }
  return (
    <>
      <div className="relative">
        <Button size="sm">
          <Plus className="mr-2" />
          Adicionar contato
        </Button>
      </div>
      <div className="relative flex flex-col w-full space-y-4 mt-10">
        {isLoading && (
          <div className="flex flex-col gap-2">
            <div className="w-full h-10 bg-muted animate-pulse rounded-md delay-200"></div>
            <div className="w-full h-10 bg-muted animate-pulse rounded-md delay-75"></div>
          </div>
        )}

        {!isLoading && !data && (
          <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
            <h1 className="text-lg font-semibold">Nenhum contato encontrado</h1>
            <p className="text-sm text-gray-500">
              Não há contatos vinculados a esta empresa.
            </p>
          </div>
        )}

        {!isLoading && !!data && (
          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="flex flex-row w-full">
              <TabsTrigger value="phone" className="flex-1">
                Telefone
              </TabsTrigger>
              <TabsTrigger value="email" className="flex-1">
                Email
              </TabsTrigger>
            </TabsList>
            <TabsContent value="phone" className="space-y-1">
              {phones.length > 0 ? (
                phones.map((item: any) => (
                  <ContactCard key={uuidv4()} type="phone" contato={item} valueId={""} />
                ))
              ) : (
                <p>Sem números de telefone</p>
              )}
            </TabsContent>
            <TabsContent value="email" className="space-y-1">
              {emails.length > 0 ? (
                emails.map((item: any) => (
                  <ContactCard key={uuidv4()} type="email" contato={item} valueId={""} />
                ))
              ) : (
                <p>Sem emails</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}

export default ContatoTab;
