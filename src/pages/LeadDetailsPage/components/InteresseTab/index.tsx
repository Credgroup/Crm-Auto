import UserInterestProductItem from "./UserInterestProductItem";
import { LuBox } from "react-icons/lu";
import { Button } from "@/components/ui/button";

type InteresseTabProps = {
  userType?: "enterprise" | "person";
  idEmpresaOperacao?: string;
};

function InteresseTab({
  userType,
  idEmpresaOperacao,
}: Readonly<InteresseTabProps>) {
  const isMock = true;
  const products = [
    { id: 1230, nome: "Seguro evento teste", disabled: false },
    { id: 42131, nome: "Seguro equipamento teste", disabled: true },
    { id: 532312, nome: "Auto Frota teste", disabled: false },
  ];

  return (
    <div className="w-full flex flex-col">
      {
        isMock ? (
          <div className="w-full flex-1 pr-4">Em desenvolvimento</div>
        ) : (
          <>
            <div className="w-full borderborder-red-400">
              <div className="flex items-center space-x-2 justify-between mb-4">
                <p className="font-medium text-xl">Interesses</p>
                <Button>Editar interesses</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {products.map((item) => {
                  return (
                    <UserInterestProductItem
                      icon={<LuBox />}
                      name={item.nome}
                      key={item.id}
                      id={item.id}
                      proposals={[]}
                      action={() => {console.log('opa')}}
                      userType={userType ?? "person"}
                      idEmpresaOperacao={idEmpresaOperacao}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}

export default InteresseTab;
