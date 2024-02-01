import FormularioProyecto from "../components/FormularioProyecto"
function NuevoProyecto() {
    localStorage.setItem('lastPath', '/proyectos/crear-proyecto')
    return (
        <>
            <h1 className='text-4xl font-black'>Crear Proyecto</h1>
            <div className="mt-10 flex justify-center">
                <FormularioProyecto/>
            </div>
        </>
    )
}

export default NuevoProyecto