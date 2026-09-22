import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import { LuCheck, LuPackage2 } from "react-icons/lu";

type SeguroListItemProps = {
  product: Partial<Product>;
  handleSelectProduct: (id?: number | string | null) => void;
};

export default function SeguroListItem({
  product,
  handleSelectProduct,
}: Readonly<SeguroListItemProps>) {
  return (
    <Card
      key={product.idProduto}
      className={`relative flex items-center justify-between p-2 hover:cursor-pointer ${
        product.checked ? "bg-gray-100 dark:bg-zinc-900 !bg-opacity-40" : ""
      }`}
      onClick={() => {
        handleSelectProduct(product.idProduto);
      }}
    >
      <div className="flex items-center gap-x-4 p-2">
        {product.dsLogo ? (
          <img
            src={product.dsLogo+"?sp=r&st=2025-05-21T01:16:44Z&se=2026-05-21T09:16:44Z&spr=https&sv=2024-11-04&sr=c&sig=0o75S62Z761Xs2J5GX5XaVRwz%2BlqaGD3trx2uaKZzYw%3D"}
            alt={`Produto: ${product.nmProduto}`}
            className="w-11 h-11 rounded-md border"
          />
        ) : (
          <div className="rounded-md bg-gray-50 dark:bg-zinc-900 text-2xl p-2 w-10 h-10">
            <LuPackage2 className="relative text-gray-500 text-2xl mr-8" />
          </div>
        )}

        <CardHeader className="p-0">
          <CardTitle>{product.nmProduto}</CardTitle>
        </CardHeader>
      </div>
      {product.checked && (
        <LuCheck className="relative text-green-500 text-2xl mr-8" />
      )}
    </Card>
  );
}
