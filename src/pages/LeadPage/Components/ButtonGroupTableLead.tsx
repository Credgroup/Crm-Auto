import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SelectedTableType } from "..";

type ButtonGroupTableLeadProps = {
  dispatch: (value: SelectedTableType) => void;
};
function ButtonGroupTableLead({
  dispatch,
}: Readonly<ButtonGroupTableLeadProps>) {
  const [selectedButton, setSelectedButton] = useState<number>(1);

  const handleButtonClick = (buttonIndex: number) => {
    setSelectedButton(buttonIndex);
  };

  useEffect(() => {
    if (selectedButton === 1) {
      dispatch("empresa");
    }
    if (selectedButton === 2) {
      dispatch("pessoa");
    }
  }, [selectedButton]);

  return (
    <div className="inline-flex rounded-md shadow-sm ">
      <Button
        className={`rounded-r-none border-none shadow-none ${
          selectedButton === 1
            ? ""
            : "bg-white dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-900 text-black dark:text-white"
        }`}
        onClick={() => handleButtonClick(1)}
      >
        Empresa
      </Button>

      <Button
        className={`rounded-l-none -ml-px border-none shadow-none ${
          selectedButton === 2
            ? ""
            : "bg-white dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-900 text-black dark:text-white"
        }`}
        onClick={() => handleButtonClick(2)}
      >
        Pessoa
      </Button>
    </div>
  );
}

export default ButtonGroupTableLead;
