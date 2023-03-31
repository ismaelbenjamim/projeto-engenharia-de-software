import api from "../pages/authentication/api";

export const usuarioInfo = () => {
    async function getData() {
        let res = await api.get('usuarios/usuario/')
        if(res.status === 200){
            return res.data   
        } else {
            return null;
        }
    }
    return getData();
}