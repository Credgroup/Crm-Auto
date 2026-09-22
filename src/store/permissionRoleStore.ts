import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { encrypt, decrypt } from "@/hooks/useCrypt";

type Roles = "Master" | "Sistema" | "Administrador" | "Colaborador" | "Backoffice" | "Monitoramento" | "Cliente"

interface PermissionRole {
  name: Roles | null;
  code: number | null;
  setPermissionRole: (item: PermissionRole) => void;
  setPermissionRoleByCode: (code: number) => void;
}

const AvaliableRoles: { name: Roles; value: number }[] = [
    {
        name: "Master",
        value: 1
    },
    {
        name: "Sistema",
        value: 2
    },
    {
        name: "Administrador",
        value: 3
    },
    {
        name: "Colaborador",
        value: 4
    },
    {
        name: "Backoffice",
        value: 5
    },
    {
        name: "Monitoramento",
        value: 6
    },
    {
        name: "Cliente",
        value: 7
    }
]

export const usePermissionRoleStore = create<PermissionRole>()(
  persist(
    (set) => ({
      name: null,
      code: null,
      setPermissionRole: (item) => set(() => ({ name: item.name, code: item.code })),
      setPermissionRoleByCode: (code) => set(() => {
        console.log("o codigo que passou pra registrar é: ", code)
        const selectedRole = AvaliableRoles.find((role) => role.value === code)
        if(!selectedRole){
            return ({ name: null, code: null })
        }
        console.log(selectedRole)
        return ({ name: selectedRole.name, code: selectedRole.value })
      }),
    }),
    {
      name: 'permission-role-storage', // Nome da chave que será salva no localStorage
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const decryptedValue = decrypt(str);
            return decryptedValue;
          } catch (e) {
            console.error("Erro ao descriptografar permissionRoleStore", e);
            return null;
          }
        },
        setItem: (name, value) => {
          const encryptedValue = encrypt(value);
          localStorage.setItem(name, encryptedValue);
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);

export const ifUserIsHigherOrIqualsTo = ({roleName, expression = true}: {roleName: Roles, expression?: boolean}) => {
    // 💡 IMPORTANTE: Você precisa chamar usePermissionRoleStore.getState() aqui dentro
    // para pegar o valor **atualizado** da store, incluindo o que vem do localStorage!
    const userCode = usePermissionRoleStore.getState().code;
    
    console.log("Código do Usuário atual:", userCode)
    const selectedRole = AvaliableRoles.find((role) => role.name === roleName)
    if(!selectedRole || !userCode){
        return false
    }
    const validatedExpression = expression != undefined && expression
    return (userCode <= selectedRole.value && validatedExpression)
}

// Criando um Hook customizado para usar dentro de componentes React de forma reativa:
export const useIfUserIsHigherOrIqualsTo = ({roleName, expression = true}: {roleName: Roles, expression?: boolean}) => {
    const userCode = usePermissionRoleStore((state) => state.code); // Hook do Zustand que escuta as mudanças!
    
    const selectedRole = AvaliableRoles.find((role) => role.name === roleName)
    if(!selectedRole || !userCode){
        return false
    }
    const validatedExpression = expression != undefined ? expression : true;
    return (userCode <= selectedRole.value && validatedExpression)
}