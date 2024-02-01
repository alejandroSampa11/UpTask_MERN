import { useState, useEffect } from "react";
import Alerta from "./Alerta";
import useProyectos from "../hook/useProyectos";
import { useParams } from "react-router-dom";

function FormularioProyecto() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [cliente, setCliente] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [id,setId] = useState(null)

    const params = useParams()
    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos()

    useEffect(()=>{
        if(params.id){
            setId(params.id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setCliente(proyecto.cliente)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
        }
    },[params])


    const handleSubmit = async (e) => {
        e.preventDefault()
        if ([nombre, descripcion, cliente, fechaEntrega].includes('')) {
            mostrarAlerta({
                msg: 'Todos los Campos son Obligatorios',
                error: true
            })
            return
        }

        //PASAR LOS DATOS HACIA EL PROVIDER
        await submitProyecto({id,nombre,descripcion,cliente,fechaEntrega})

        setId(null)
        setNombre("")
        setDescripcion("")
        setCliente("")
        setFechaEntrega("")
    }

    const { msg } = alerta

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="bg-white py-10 px-5 md:w-3/4 rounded-lg shadow"
                action=""
            >

                {msg && <Alerta alerta={alerta} />}
                
                <div className="mb-5">
                    <label
                        className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="nombre"
                    >
                        Nombre del Proyecto
                    </label>
                    <input
                        onChange={(e) => setNombre(e.target.value)}
                        id="nombre"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        placeholder="Nombre del Proyecto"
                        type="text"
                        value={nombre}
                    />
                </div>
                <div className="mb-5">
                    <label
                        className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="descripcion"
                    >
                        Descripción
                    </label>
                    <textarea
                        onChange={(e) => setDescripcion(e.target.value)}
                        id="descripcion"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        placeholder="Descripción del Proyecto"
                        value={descripcion}
                    />
                </div>
                <div className="mb-5">
                    <label
                        className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="cliente"
                    >
                        Cliente
                    </label>
                    <input
                        onChange={(e) => setCliente(e.target.value)}
                        id="cliente"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        placeholder="Nombre del Cliente"
                        type="text"
                        value={cliente}
                    />
                </div>
                <div className="mb-5">
                    <label
                        className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="fecha-entrega"
                    >
                        Fecha de Entrega
                    </label>
                    <input
                        onChange={(e) => setFechaEntrega(e.target.value)}
                        id="fecha-entrega"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                        type="date"
                        value={fechaEntrega}
                    />
                </div>
                <input
                    type="submit"
                    value={params.id ? 'Guardar Cambios' : 'Crear Proyecto'}
                    className="bg-sky-600 w-full p-3 rounded-md uppercase font-bold text-white cursor-pointer hover:bg-sky-700 transition-colors"
                />
            </form>
        </>
    );
}

export default FormularioProyecto;
