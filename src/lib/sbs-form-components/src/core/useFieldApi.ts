import { useState, useCallback, useRef } from 'react';
import { type FieldType } from './types';

export const useFieldApi = () => {
  const apiCacheRef = useRef<Record<string, any>>({});
  const loadingFieldsRef = useRef<Set<string>>(new Set());
  const [loadingFieldsArray, setLoadingFieldsArray] = useState<string[]>([]);

  // Função que atualiza os campos alvo - memoizada
  const updateTargetFields = useCallback((
    targetFields: { targetName: string; apiResponseKey: string }[],
    response: any,
    allFields: Partial<FieldType>[],
    onFieldUpdate: (targetName: string, newValue: string) => void
  ) => {
    targetFields.forEach(({ targetName, apiResponseKey }) => {
      const newValue = response[apiResponseKey];
      if (newValue) {
        // Chama a função de callback para notificar a mudança
        // Não modifica diretamente o campo, deixa o callback fazer isso
        onFieldUpdate(targetName, newValue);
      }
    });

    // funcao apenas para usar variavel
    if(allFields){
      return
    }

  }, []);

  // Função principal que chama a API - memoizada com dependências mínimas
  const callFieldApi = useCallback(async (
    field: Partial<FieldType>, 
    value: string, 
    allFields: Partial<FieldType>[],
    onFieldUpdate: (targetName: string, newValue: string) => void
  ) => {
    if (!field.apiConfig) return Promise.resolve();

    const cacheKey = `${field.campoApi}_${value}`;
    
    // Verifica se já temos cache
    if (apiCacheRef.current[cacheKey]) {
      updateTargetFields(field.apiConfig.targetFields!, apiCacheRef.current[cacheKey], allFields, onFieldUpdate);
      return Promise.resolve();
    }

    // Verifica se já está em loading
    if (loadingFieldsRef.current.has(field.campoApi!)) {
      return Promise.resolve();
    }

    // Adiciona loading
    loadingFieldsRef.current.add(field.campoApi!);
    setLoadingFieldsArray(Array.from(loadingFieldsRef.current));

    try {
      let response;
      
      if (field.apiConfig.type === 'cep') {
        // API de CEP específica - ViaCEP
        const cleanCep = value.replace(/\D/g, '');
        const apiResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await apiResponse.json();
        
        if (data.erro) {
          throw new Error('CEP não encontrado');
        }
        
        response = data;
      } else if (field.apiConfig.url) {
        const url = field.apiConfig.url;
        const method = field.apiConfig.method || 'GET';
        const payload = { value };
        // API customizada
        response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          // No fetch, o corpo deve ser uma string e não deve existir em requisições GET
          body: method !== 'GET' ? JSON.stringify(payload) : null,
        })
        .then((res) => res.json())
        .catch((err) => err.message)
      }

      // Salva no cache
      apiCacheRef.current[cacheKey] = response;
      
      // Atualiza os campos alvo
      updateTargetFields(field.apiConfig.targetFields!, response, allFields, onFieldUpdate);
      
      
    } catch (error) {
      console.error('Erro na API:', error);
      throw error; // Re-throw para permitir tratamento no componente
    } finally {
      // Remove loading
      loadingFieldsRef.current.delete(field.campoApi!);
      setLoadingFieldsArray(Array.from(loadingFieldsRef.current));
    }
  }, [updateTargetFields]); // Apenas updateTargetFields como dependência

  return { 
    callFieldApi, 
    updateTargetFields, 
    loadingFields: loadingFieldsArray 
  };
};
