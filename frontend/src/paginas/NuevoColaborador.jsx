import { useParams } from "react-router-dom";
import FormularioColaborador from "../components/FormularioColaborador"
import useProyectos from "../hook/useProyectos";
import { useEffect } from "react";
import Alerta from "../components/Alerta";


function NuevoColaborador() {
    const params = useParams()
    localStorage.setItem("lastPath", `/proyectos/nuevo-colaborador/${params.id}`);
    const {obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador,alerta} = useProyectos()

    useEffect(()=>{
      obtenerProyecto(params.id)
    },[])

    const handleAgregarColaborador = (email)=>{
      agregarColaborador(email)
    }

    if(!proyecto?._id) return <Alerta alerta={alerta}/>

  return (
    <>
        <h1 className="text-4xl font-black">Añadir Colaborador(a) al Proyecto: {proyecto.nombre}</h1>
        <div className="mt-10 flex justify-center">
            <FormularioColaborador/>
        </div>
        {cargando ? '' : colaborador?._id && (
          <div className="flex justify-center mt-10">
            <div className="bg-white py-5 px-5 md:w-1/2 rounded-lg shadow w-full">
              <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>
              <div className="flex justify-between items-center">
                <p>{colaborador.nombre}</p>
                <button onClick={()=>handleAgregarColaborador({email:colaborador.email})} className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm" type="button">Agregar al Proyecto</button>
              </div>
            </div>

          </div>
        )}
    </>
  )
}

export default NuevoColaborador