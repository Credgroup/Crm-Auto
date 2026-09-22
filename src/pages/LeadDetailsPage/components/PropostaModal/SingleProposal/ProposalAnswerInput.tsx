import { Label } from "@/components/ui/label";
import type { FieldType } from "@/types";

type ProposalAnswerInputProps = {
  field: Partial<FieldType>;
};
export default function ProposalAnswerInput({
  field,
}: Readonly<ProposalAnswerInputProps>) {
  return (
    <Label>
      <div className="flex flex-col gap-1">
        <div>
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {field.campoApi ?? "--"}
          </span>
          {field.obrigatorio && (
            <span className="text-red-500 text-lg ml-1">*</span>
          )}
        </div>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {field.conteudo ?? "--"}
        </span>
      </div>
    </Label>
  );
}
