# Sistema de Scroll Automático do Sidebar

## Visão Geral

Este sistema implementa um scroll horizontal automático para o menu de navegação do formulário de produtos. Quando uma sessão se torna ativa, o scroll automaticamente centraliza o item correspondente na viewport.

## Componentes

### SidebarContext
- **Arquivo**: `context/SidebarContext.tsx`
- **Função**: Gerencia o estado do scroll e fornece métodos para controlar o comportamento do scroll
- **Funcionalidades**:
  - `scrollContainerRef`: Referência para o container de scroll
  - `scrollToActiveItem(index)`: Faz scroll para um item específico por índice
  - `scrollToItem(element)`: Faz scroll para um elemento específico

### NavContainer
- **Arquivo**: `components/NavContainer/index.tsx`
- **Função**: Container principal do menu de navegação
- **Integração**: Usa o SidebarContext para gerenciar o scroll

### FormNavItem
- **Arquivo**: `components/FormNavItem/index.tsx`
- **Função**: Item individual do menu
- **Funcionalidades**: Suporte a clique para scroll manual

## Como Usar

### 1. Usar o ProductFormWrapper (Recomendado)
```tsx
import ProductFormWrapper from "./components/ProductFormWrapper";

export default function ProductFormPage() {
  return <ProductFormWrapper />;
}
```

### 2. Envolver manualmente com SidebarProvider
```tsx
import { SidebarProvider } from "./context/SidebarContext";

export default function ProductFormPage() {
  return (
    <SidebarProvider>
      {/* Seu conteúdo aqui */}
    </SidebarProvider>
  );
}
```

### 3. Usar o hook useSidebarContext
```tsx
import { useSidebarContext } from "./context/SidebarContext";

function MyComponent() {
  const { scrollToActiveItem } = useSidebarContext();
  
  // Fazer scroll para o item ativo
  scrollToActiveItem(2);
}
```

## Solução de Problemas

### Erro: "useSidebarContext must be used within a SidebarProvider"

Este erro ocorre quando o `useSidebarContext` é chamado fora do `SidebarProvider`. Para resolver:

1. **Use o ProductFormWrapper**: Este componente já gerencia corretamente o provider
2. **Verifique a ordem**: O `SidebarProvider` deve envolver todos os componentes que usam o context
3. **Hook seguro**: O `ProductFormHook` agora tem tratamento de erro para quando o context não está disponível

## Funcionalidades

### Scroll Automático
- Detecta automaticamente mudanças na sessão ativa
- Centraliza o item ativo na viewport
- Scroll suave com animação

### Scroll Manual
- Clique em qualquer item do menu para fazer scroll
- Funciona apenas em itens não desabilitados

### Responsividade
- Funciona apenas na versão desktop (sm:block)
- Versão mobile mantém comportamento original

## Configuração

### Delays de Scroll
Os delays podem ser ajustados no `ProductFormHook.ts`:
- Scroll automático: 150ms
- Scroll por mudança de sessão: 200ms

### Estilos
O scroll usa as seguintes classes CSS:
- `overflow-x-scroll`: Habilita scroll horizontal
- `scrollbar-none`: Esconde a barra de scroll
- `scrollbarWidth: 'none'`: Esconde a barra de scroll no Firefox

## Estrutura de Arquivos

```
ProductFormPage/
├── context/
│   └── SidebarContext.tsx
├── components/
│   ├── NavContainer/
│   │   └── index.tsx
│   ├── FormNavItem/
│   │   └── index.tsx
│   └── ProductFormWrapper.tsx
├── ProductFormHook.ts
└── index.tsx
``` 