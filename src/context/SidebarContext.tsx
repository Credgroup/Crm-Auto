import { createContext, useContext, useRef, ReactNode, useCallback } from 'react';

interface SidebarContextType {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  scrollToActiveItem: (index: number) => void;
  scrollToItem: (element: HTMLElement) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToItem = useCallback((element: HTMLElement) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();
    
    // Calcula a posição para centralizar o item
    const scrollLeft = element.offsetLeft - (containerRect.width / 2) + (itemRect.width / 2);
    
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth'
    });
  }, []);

  const scrollToActiveItem = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const items = container.children;
    
    if (index >= 0 && index < items.length) {
      const targetItem = items[index] as HTMLElement;
      scrollToItem(targetItem);
    }
  }, [scrollToItem]);

  return (
    <SidebarContext.Provider value={{ scrollContainerRef, scrollToActiveItem, scrollToItem }}>
      {children}
    </SidebarContext.Provider>
  );
}; 