import { ReactNode } from "react";

type ShowHideInformationProps = {
  show: boolean;
  children: ReactNode;
};
export default function ShowHideInformation({
  show,
  children,
}: Readonly<ShowHideInformationProps>) {
  return (
    <div className="w-full h-fit py-2">
      {show ? (
        children
      ) : (
        <div className="w-full h-6 rounded-sm dark:bg-muted/90 bg-zinc-200"></div>
      )}
    </div>
  );
}
