import api from "../pages/authentication/api";

const consumo = api.get('estoques/estoque/').then((res) => {
    return res;
});

export const EstoqueAtual = async () => {
    const d = await consumo;
    return d;
}
