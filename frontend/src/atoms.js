import {
    atom,
    selector
} from "recoil";
import Cookies from "js-cookie";


export const authAtom = atom({
    key: "authentication",
    default: {
        isAuthenticated: null,
        token: Cookies.get("token"),
        refreshToken: Cookies.get("refresh-token"),
        user: Cookies.get("USER-ID"),
    }
})

export const alertAtom = atom({
    key: "alert",
    default: {
        message: null,
        type: null
    }
})