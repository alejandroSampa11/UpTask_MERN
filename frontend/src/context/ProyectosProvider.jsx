import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client'
import useAuth from "../hook/useAuth";

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({ children }) => {
    //STATES
    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate()
    const {auth} = useAuth()

    //EFFECT
    useEffect(() => {
        const obtenerProyecto = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    return
                }
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyecto()
    }, [auth])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [auth])

    //FUNCIONES
    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 5000)
    }

    const submitProyecto = async (proyecto) => {

        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }
        return

    }

    const editarProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            //SINCRONIZAR LA ALERTA
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)

            //MOSTRAR LA ALERTA

            //REDIRECCIONAR
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }
    const nuevoProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            setProyectos([...proyectos, data])
            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const obtenerProyecto = async (id) => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
            // console.log(data)
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
        setCargando(false)
    }

    const eliminarProyecto = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async (tarea) => {
        if (tarea?.id2) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }

    }

    const crearTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config)
            setAlerta({})
            handleModalTarea()

            //SOCKET.IO
            socket.emit('nueva tarea', data)
        } catch (error) {
            console.log(error)
        }
    }
    const editarTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id2}`, tarea, config)



            //SOCKET IO
            socket.emit('actualizar tarea', data)
            setAlerta({})
            setModalFormularioTarea(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }
    const handleModalEliminarTarea = (tarea) => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })

            setModalEliminarTarea(false)

            //SOCKET
            socket.emit('eliminar tarea', tarea)
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async (email) => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
        setCargando(false)
    }

    const agregarColaborador = async (email) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        // console.log(colaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)
            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter((colaboradorState) => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

    const completarTarea = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            //SOCKET IO
            socket.emit('cambiar estado', data)
            setTarea({})
            setAlerta({})
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //SOCKET IO
    const submitTareasProyecto = (tarea) => {
        //AGREGAR LA TAREA AL STATE
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = (tarea) => {
        //ELIMINAR LA TAREA DEL STATE
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter((tareaState) => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = (tarea) => {

        //ACTUALIZAR LA TAREA DEL STATE
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = tarea => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)

    }

    const cerrarSesionProyectos = ()=>{
        setProyectos([])
        setProyecto({})
        setAlerta({})
        
    }


    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                handleModalTarea,
                modalFormularioTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext