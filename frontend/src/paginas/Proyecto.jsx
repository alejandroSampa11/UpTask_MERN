import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useProyectos from "../hook/useProyectos";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import Tarea from "../components/Tarea";
import Alerta from "../components/Alerta";
import Colaborador from "../components/Colaborador";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import useAdmin from "../hook/useAdmin";
import io from 'socket.io-client'

let socket

function Proyecto() {
  const { id } = useParams();
  localStorage.setItem("lastPath", `/proyectos/${id}`);
  const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea } = useProyectos();
  // console.log(proyecto)

  const { nombre } = proyecto;

  const admin = useAdmin()

  useEffect(() => {
    obtenerProyecto(id);
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
    socket.emit('abrir proyecto', id)
  }, [])

  useEffect(() => {
    socket.on('tarea agregada', tareaNueva =>{
      if(tareaNueva.proyecto === proyecto._id){
        submitTareasProyecto(tareaNueva)
      }
    })
    socket.on('tarea eliminada', tareaEliminada =>{
      if(tareaEliminada.proyecto === proyecto._id){
        eliminarTareaProyecto(tareaEliminada)
      }
    })
    socket.on('tarea actualizada', tareaActualizada=>{
      if(tareaActualizada.proyecto._id === proyecto._id){
        actualizarTareaProyecto(tareaActualizada)
      }
    })
    socket.on('nuevo estado', tareaEstadoTarea=>{
      if(tareaEstadoTarea.proyecto._id === proyecto._id){
        cambiarEstadoTarea(tareaEstadoTarea)
      }
    })
  })


  const { msg } = alerta

  return cargando ? (
    ""
  ) : (
    <>
      <div className="flex justify-between">
        <h1 className="font-black text-4xl">{nombre}</h1>

        {admin && (
          <div className="flex items-center gap-1 text-gray-400 hover:text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            <Link className="uppercase font-bold" to={`/proyectos/editar/${id}`}>
              Editar
            </Link>
          </div>
        )}

      </div>


      {admin && (
        <button
          onClick={handleModalTarea}
          type="button"
          className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 hover:bg-sky-600 transition-colors flex gap-2 items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Nueva Tarea
        </button>
      )}
      <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

      <div className="bg-white shadow mt-10 rounded-lg">
        {proyecto.tareas?.length ? (
          proyecto.tareas?.map((tarea) =>
            <Tarea
              key={tarea._id}
              tarea={tarea} />)
        ) : (
          <p className="text-center my-5 p-10">
            No Hay Tareas en este Proyecto
          </p>
        )}
      </div>

      {/* COLABORADORES */}
      {admin && (
        <>
          <div className="flex items-center justify-between mt-10">
            <p className="font-bold text-xl">Colaboradores</p>
            <div className="flex items-center gap-1 text-gray-400 hover:text-black">
              <Link className="uppercase font-bold" to={`/proyectos/nuevo-colaborador/${proyecto._id}`}>
                Añadir
              </Link>
            </div>
          </div>

          <div className="bg-white shadow mt-10 rounded-lg">
            {proyecto.colaboradores?.length ? (
              proyecto.colaboradores?.map((colaborador) =>
                <Colaborador
                  key={colaborador._id}
                  colaborador={colaborador} />)
            ) : (
              <p className="text-center my-5 p-10">
                No Hay Colaboradores en este Proyecto
              </p>
            )}
          </div>
        </>
      )}
      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  )
}

export default Proyecto;
