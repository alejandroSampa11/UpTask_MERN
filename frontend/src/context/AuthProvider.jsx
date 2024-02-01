import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

const AuthProvider = ({ children }) => {

    //STATES
    const [auth, setAuth] = useState({})
    const [ cargando, setCargando ] = useState(true)

    const navigate = useNavigate()

    //FUNCTIONS


    //EFFECTS
    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setCargando(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios('/usuarios/perfil', config)
                setAuth(data)
                const lastPath = localStorage.getItem('lastPath') || '/proyectos';
                navigate(lastPath)
            } catch (error) {
                setAuth({})
            }
            setCargando(false)

        }
        autenticarUsuario()
    }, [])

    const cerrarSesionAuth = ()=>{
        setAuth({})
    }




    return (
        <AuthContext.Provider value={{
            setAuth,
            auth,
            cargando,
            cerrarSesionAuth
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;