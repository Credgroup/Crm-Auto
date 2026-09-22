import AvaliableComissionTable from "./components/AvaliableComissionTable";
import ProcessedComissionTable from "./components/ProcessedComissionTable";
import { t } from "@/lib/i18n";

export default function ComissionPage() {
    return (
    <div className="p-8 h-full flex flex-col space-y-8">
        <section>
            <h3 className="text-xl font-semibold mb-4">{t("commission.available")}</h3>
            <AvaliableComissionTable />
        </section>
        <section>
            <h3 className="text-xl font-semibold mb-4">{t("commission.processed")}</h3>
            <ProcessedComissionTable />
        </section>
    </div>
    );
}