import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  content: ReactNode;
}

interface GenericTabsProps {
  tabs: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export default function GenericTabs({
  tabs,
  value,
  onValueChange,
  className
}: Readonly<GenericTabsProps>) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList className="flex w-full max-w-lg m-auto">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className="flex-1"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-1">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
