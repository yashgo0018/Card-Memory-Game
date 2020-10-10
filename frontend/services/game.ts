import jwt_decode from 'jwt-decode';

const APIEndpoint = "/api";

export function startNewGame() {
    if (!localStorage.getItem('token')) {
        return false;
    }
    fetch(`${APIEndpoint}/new_game`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return true;
}

export const login = async (username: string, password: string) => {
    try {
        const { access_token: token } = await (await fetch(`${APIEndpoint}/login`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })).json();
        let { exp } = jwt_decode(token);
        exp = exp * 1000;
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", exp);
    }
    catch {
        return "Invalid Credentials";
    }
}

export const register = async (name: string, username: string, password: string) => {
    return !((await fetch(`${APIEndpoint}/register`, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            username,
            password
        })
    })).status == 400)
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
}