import moment from "moment-timezone";
import api from "../pages/authentication/api";

export const EstoqueAtual = () => {
    async function getData() {
        let res = await api.get('estoques/estoque/')
        if(res.status === 200){
            console.log(res.data);
            return res.data;
        } else {
            return null;
        }
    }
    return [getData()];
}
