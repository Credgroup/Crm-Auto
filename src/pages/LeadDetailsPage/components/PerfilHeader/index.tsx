import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { obterIniciais } from "@/lib/obterIniciais";
import { formatValue } from "@/lib/utils";
import { Enterprise, Person } from "@/types";
import IndicatorType from "./IndicatorType";

type PerfilHeaderProps =
  | {
      data: Partial<Enterprise>;
      type?: "enterprise";
    }
  | {
      data: Partial<Person>;
      type?: "person";
    };

function PerfilHeader({ data, type }: Readonly<PerfilHeaderProps>) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-fit h-fit">
        <Avatar className="w-28 h-28 rounded-full">
          <AvatarFallback className="rounded-full">
            <span className="text-2xl font-bold">
              {type == "enterprise" && obterIniciais(data.nmFantasia ?? "??")}
              {type == "person" && obterIniciais(data.nome ?? "??")}
            </span>
          </AvatarFallback>
        </Avatar>
        {type && <IndicatorType type={type} />}
      </div>
      <div>
        <h2 className="text-xl font-bold">
          {type == "enterprise" && data.nmFantasia}
          {type == "person" && data.nome}
        </h2>
        <p className="text-gray-500">
          <span className="text-md font-bold text-black dark:text-white">
            {type == "enterprise" && data.nmRazaoSocial}
            {type == "person" && formatValue("cpf", data.cpf?.toString() ?? "")}
          </span>
        </p>
      </div>
    </div>
  );
}

export default PerfilHeader;
