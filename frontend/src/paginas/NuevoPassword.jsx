import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios.jsx"

function NuevoPassword() {

  //STATES
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState({})
  const [password, setPassword] = useState('')
  const [passwordModificado, setPasswordModificado] = useState(false)

  const { token } = useParams()

  //EFFECTS
  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()
  }, [])

  const { msg } = alerta

  //FUNCIONES
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      setAlerta({
        msg: 'El Password debe ser minimo de 6 caracteres',
        error: true
      })
      return
    }
    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {
        password
      })
      setPasswordModificado(true)
      setAlerta({
        msg: data.msg,
        error: false
      })

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Reestablece tu Password y no Pierdas Tus {''}
        <span className="text-slate-700">Proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta} />}
      {tokenValido && (
        <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
          <div className="my-5">
            <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password">Nuevo Password</label>
            <input onChange={e => setPassword(e.target.value)} id="password" type="password" placeholder="Escribe tu Nuevo Password" className="w-full mt-3 p-3 border rounded-xl bg-gray-100" />
          </div>

          <input type="submit" value='Guardar Password' className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />
        </form>
      )}

      {passwordModificado && (
        <Link className="block text-center my-5 text-slate-500 uppercase text-sm" to='/'>Inicia Sesión</Link>
      )}

    </>
  )
}

export default NuevoPassword