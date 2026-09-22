import { useMemo, useState } from "react";
import GenericField from "../GenericField";
import { FieldType } from "@/types";
import { Button } from "@/components/ui/button";

type CardFormProps = {
    FormConfig: string
}

export default function CardForm({FormConfig}: Readonly<CardFormProps>) {
    
    const fields = useMemo(() => {
        if (!FormConfig) return [];
        
        try {
            const parsed = JSON.parse(FormConfig);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('Erro ao fazer parse do jsonConf:', error);
            return [];
        }
    }, [FormConfig]);

    const [fieldsWithValues, setFieldsWithValues] = useState<Partial<FieldType>[]>(fields);

    const updateFieldValue = (fieldName: string, value: string) => {
        setFieldsWithValues(prev => 
            prev.map(field => 
                field.campoApi === fieldName 
                    ? { ...field, conteudo: value }
                    : field
            )
        );
    };

    if (fields.length === 0) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Sem Configuração de Pagamento</h1>
                <p>Nenhum campo foi adicionado para este método de pagamento, configure o layout ou selecione outro método de pagamento</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 w-full">
            {fieldsWithValues.map((field: Partial<FieldType>) => (
                <GenericField
                    key={field.campoApi} 
                    field={field}
                    onValueChange={(value) => {
                        updateFieldValue(field.campoApi || '', value);
                    }}
                    restFields={fieldsWithValues}
                />
            ))}
            <Button onClick={() => console.log(fieldsWithValues)}>Enviar</Button>
        </div>
    )
}