import axios from "axios";
import { getToken } from "../pages/authentication/auth"

export const usuarioInfo = () => {
    const token = getToken();
    async function getData() {
        let res = await axios({
            url: 'http://127.0.0.1:8000/api/usuarios/usuario/',
            method: 'get',
            timeout: 8000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
        })
        if(res.status === 200){
            return res.data   
        } else {
            return null;
        }
    }
    return (getData())
}