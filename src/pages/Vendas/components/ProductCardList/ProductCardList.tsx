import { ProductCard } from "../ProductCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useOperationStore } from "@/store/operationStore";
import ProductSkeleton from "@/components/Skeletons/ProductSkeleton";
import { fetchProducts } from "./ProductCardListHook";

type ProductCardListProps = {
  filtros: {
    busca: string;
    categoria: string;
    subCategoria: string;
  };
};

const PAGE_SIZE = 12;

export default function ProductCardList({filtros}: Readonly<ProductCardListProps>) {
  const idOperation = useOperationStore((state) => state.idOperation);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["fetchOperationProducts", idOperation, filtros.busca, filtros.categoria, filtros.subCategoria],
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({
        idOperation,
        pageNumber: pageParam,
        pageSize: PAGE_SIZE,
        busca: filtros.busca,
        categoria: filtros.categoria,
        subCategoria: filtros.subCategoria,
      }),
    enabled: !!idOperation,
    refetchOnWindowFocus: false,
    staleTime: 0,
    refetchOnMount: true,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      
      const totalCount = lastPage.totalCount;
      const currentPage = lastPage.pageNumber;
      const pageSize = lastPage.pageSize;
      const totalPages = Math.ceil(totalCount / pageSize);
      
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  if (isError) {
    return (
      <div className="w-full flex flex-col justify-center items-center border">
        <p className="block w-full h-10 text-red-500">
          Erro ao carregar produtos: {error?.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      {isLoading && (
        <div className="space-y-4">
          {filtros.busca && (
            <div className="text-center text-sm text-muted-foreground">
              Buscando produtos...
            </div>
          )}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        </div>
      )}

      {!isLoading && data && data.pages.length > 0 && (
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.pages.map((page) =>
            page?.items?.map((produto) => (
              <ProductCard key={produto.idProduto} produto={produto} />
            ))
          )}
        </div>
      )}

      {!isLoading && (!data || data.pages.length === 0 || data.pages.every(page => !page?.items || page.items.length === 0)) && (
        <div className="w-full flex flex-col justify-center items-center">
          <p className="block w-full h-10">
            {filtros.busca 
              ? `Nenhum produto encontrado para "${filtros.busca}"`
              : "Nenhum produto disponível"
            }
          </p>
        </div>
      )}

      {hasNextPage && (
        <div className="relative flex justify-center mt-6">
          <button
            className="px-6 py-2 rounded bg-[var(--cor-principal)] text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Carregando..." : "Ver mais"}
          </button>
        </div>
      )}
    </div>
  );
};
