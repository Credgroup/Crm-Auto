import { Card } from "@/components/ui/card";

interface Template {
  iddoc?: string | number;
  nmdoc?: string;
  dsassunto?: string;
  dsmulticanal?: string;
  nmoperacaomulticanal?: string;
  dsstatus?: string;
  dsaviso?: string;
  parametros?: Array<{ key: string }>;
  [key: string]: any;
}

type Props = {
  templates?: Template[];
  isLoading?: boolean;
};

export default function TemplatesTab({
  templates,
  selectedTemplate,
  onSelect,
  channelType,
  isLoading
}: Props & {
  templates?: Template[] | null;
  selectedTemplate?: string | null;
  onSelect?: (id: string) => void;
  channelType?: string;
}) {
  const templatesList = Array.isArray(templates) ? templates : [];

  // Filtrar templates por tipo de canal
  const filteredTemplates = templatesList.filter((template) => {
    if (channelType === "email") {
      return template.chmulticanal === 2;
    } else if (channelType === "phone") {
      return template.chmulticanal === 3;
    }
    return true; // Sem filtro se não houver channelType
  });

  if (!isLoading && filteredTemplates.length === 0) {
    return <div className="text-center py-6">Nenhum template disponível</div>;
  }

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTemplates.map((item, i) => {
        const templateId = item.iddoc ?? i;
        const idString = templateId.toString();
        const isSelected = selectedTemplate === idString;

        return (
          <Card
            key={templateId}
            onClick={() => onSelect?.(idString)}
            className={`p-4 cursor-pointer ${isSelected ? "ring-2 ring-[var(--cor-principal)]" : ""}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm">{item.nmdoc}</h3>

              {item.dsstatus && (
                <Card className="px-2 py-1 text-xs">{item.dsstatus}</Card>
              )}
            </div>

            {item.dsassunto && (
              <p className="text-xs mb-2">
                <span className="font-semibold">Assunto:</span> {item.dsassunto}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              {item.dsmulticanal && (
                <div>
                  <span>Canal:</span>
                  <p className="font-medium">{item.dsmulticanal}</p>
                </div>
              )}
              {item.dsaviso && (
                <div>
                  <span>Tipo:</span>
                  <p className="font-medium">{item.dsaviso}</p>
                </div>
              )}
            </div>

            {item.nmoperacaomulticanal && (
              <div className="mb-2 p-2 rounded bg-muted text-xs">
                {item.nmoperacaomulticanal}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
