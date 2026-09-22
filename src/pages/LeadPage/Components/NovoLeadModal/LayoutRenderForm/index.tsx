import { Button } from "@/components/ui/button";
import { LayoutForms } from "@/lib/sbs-form-components/src/components/LayoutForms";
import { NavContainer } from "@/lib/sbs-form-components/src/components/NavContainer";
import { SessionContainer } from "@/lib/sbs-form-components/src/components/SessionContainer";
import { StepFormConfig, useStepFormCore } from "@/lib/sbs-form-components/src/core/useStepFormCore";
import { LucideLoader2 } from "lucide-react";

type LayoutRenderFormProps = {
  action: () => void;
  formsConfig: StepFormConfig
  isLoadingFinishForm: boolean
};

export default function LayoutRenderForm({
  action,
  formsConfig,
  isLoadingFinishForm
}: Readonly<LayoutRenderFormProps>) {

  const {
    sidebar,
    currentSessao,
    fieldError,
    handleBackSession,
    handleNextSession,
    hasBackSession,
    hasNextSession,
    handleSelectSessao,
    updateFieldValue,
    updateNormalField,
  } = useStepFormCore(formsConfig)

  //logica para não aparecer uma sessão com campos com visual false.
  const filteredSidebar = sidebar?.filter((sessao) => {
  if (!sessao.campos || sessao.campos.length === 0) return true

  const visibleFields = sessao.campos.filter(
    (campo) =>
      campo.type !== "titulo_subtitulo" &&
      campo.visual !== false
  )

  return visibleFields.length > 0
})
  return (
    <LayoutForms orientation="vertical">
      <LayoutForms.Sidebar orientation="horizontal" stickyMenu={false} className="!p-0">
        {filteredSidebar && (
          <NavContainer orientation="horizontal" navItems={filteredSidebar} />
        )}
      </LayoutForms.Sidebar>

      <LayoutForms.Content>
        {currentSessao?.campos ? (
          <SessionContainer
            fields={currentSessao.campos.filter(
              (item) =>
                item.type !== "titulo_subtitulo" &&
                item.visual !== false
            )}
            error={fieldError}
            typeSession={currentSessao.typeSession}
            allSessions={sidebar?.map((sessao) => ({
              ...sessao,
              campos: sessao.campos?.filter(
                (campo) =>
                  campo.type !== "titulo_subtitulo" &&
                  campo.visual !== false
              ),
            }))}
            handleSelectSessao={handleSelectSessao}
            updateFieldValue={updateFieldValue}
            updateNormalField={updateNormalField}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            Nenhum campo foi encontrado para ser exibido
          </div>
        )}
      </LayoutForms.Content>

      {currentSessao && (
        <LayoutForms.Footer>
          {
            !hasBackSession() ? (
              <Button
                variant="secondary"
                onClick={()=> action()}
              >
                Cancelar
              </Button>

            ) : (
              <Button
                variant="secondary"
                onClick={handleBackSession}
                disabled={!hasBackSession()}
              >
                Voltar
              </Button>
            )
          }

          <Button
            onClick={handleNextSession}
            disabled={isLoadingFinishForm}
          >
            {
              hasNextSession() ? "Avançar" : (
                <span className="flex justify-center items-center gap-2">
                  Finalizar
                  {
                    isLoadingFinishForm && <LucideLoader2 className="animate-spin" />
                  }
                </span>
              )
            }
          </Button>
        </LayoutForms.Footer>
      )}
    </LayoutForms>
  );
}