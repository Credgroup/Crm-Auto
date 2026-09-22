import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { encrypt } from "@/hooks/useCrypt";
import { obterIniciais } from "@/lib/obterIniciais";
import { formatValue } from "@/lib/utils";
import { Person } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router";
import ContactCard from "../ContactCard";
import { useQuery } from "@tanstack/react-query";
import { execApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ContactsSkeleton from "@/components/Skeletons/ContactsSkeleton";

type BindedPersonContactsProps = {
  person: Partial<Person>;
  qtdPersonsContacts?: number;
};
export default function BindedPersonContacts({
  person,
  qtdPersonsContacts = 1,
}: Readonly<BindedPersonContactsProps>) {
  const [phones, setPhones] = useState<any>([]);
  const [emails, setEmails] = useState<any>([]);

  const { data, isSuccess, isError, isLoading, error } = useQuery({
    queryKey: ["fetchEnterprisePersonsContactsById", person.idSeguradoI2k],
    queryFn: async () => {
      if (!person.idSeguradoI2k) {
        throw new Error("ID não encontrado");
      }

      const res: any = await execApi({
        url: `api/crm/lead/find/contact`,
        method: "POST",
        data: {
          IdSeguradoI2k: person.idSeguradoI2k,
        },
        isCrmApi: true,
      });

      if (res?.status !== 200) {
        throw new Error("Erro ao buscar contatos do representante");
      }

      return res.data;
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      console.log(data);
      setPhones(data.telefones ?? []);
      setEmails(data.email ?? []);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      console.log(error);
    }
  }, [isError]);

  if (isLoading) {
    return Array.from({ length: qtdPersonsContacts -1 }, (_, index) => (
      <ContactsSkeleton key={index} className="mb-8" />
    ));
  }

  return (
    <div className="mb-4 space-y-6">
      <div className="flex gap-4 items-center">
        <Avatar className="w-12 h-12 rounded-full">
          <AvatarFallback className="rounded-full">
            <span className="text-base font-bold">
              {obterIniciais(person.nome ?? "")}
            </span>
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0">
          <Link
            to={`/lead/details/${encodeURIComponent(
              encrypt(
                JSON.stringify({
                  id: person.idSeguradoI2k,
                  type: "person",
                })
              )
            )}`}
            className="font-semibold hover:underline"
          >
            {person.nome}
          </Link>
          {person.cpf ? (
            <h1 className="text-sm">
              {formatValue("cpf", person.cpf.toString())}
            </h1>
          ) : (
            <span>--</span>
          )}
        </div>
      </div>

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
    </div>
  );
}
