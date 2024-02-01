import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios.jsx"

function Registrar() {

  //STATES
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepetir, setPasswordRepetir] = useState('')
  const [alerta, setAlerta] = useState({})


  //FUNCIONES
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ([nombre, email, password, passwordRepetir].includes('')) {
      setAlerta({
        msg: 'Todos los Campos son Obligatorios',
        error: true
      })
      return
    }
    if (password !== passwordRepetir) {
      setAlerta({
        msg: 'Los Passwords no son igualess',
        error: true
      })
      return
    }
    if (password.length < 6) {
      setAlerta({
        msg: 'El Password debe tener Minimo 6 Caracteres',
        error: true
      })
      return
    }

    setAlerta({})

    //CREAR EL USUARIO EN LA API
    console.log('creando...')
    try {
      const { data } = await clienteAxios.post( `/usuarios`,
        { nombre, email, password })
      setAlerta({
        msg: data.msg,
        error: false
      })

      //REINICIAR FORMULARIO
      setNombre('')
      setEmail('')
      setPassword('')
      setPasswordRepetir('')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }
  const { msg } = alerta


  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Crea tu Cuenta y Adminsitra tus {''}
        <span className="text-slate-700">Proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="nombre">Nombre</label>
          <input id="nombre" type="text" placeholder="Tu Nombre" className="w-full mt-3 p-3 border rounded-xl bg-gray-100" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email de Registro" className="w-full mt-3 p-3 border rounded-xl bg-gray-100" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Password de Registro" className="w-full mt-3 p-3 border rounded-xl bg-gray-100" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password2">Repetir Password</label>
          <input id="password2" type="password" placeholder="Repetir tu Password" className="w-full mt-3 p-3 border rounded-xl bg-gray-100" value={passwordRepetir} onChange={e => setPasswordRepetir(e.target.value)} />
        </div>
        <input type="submit" value='Crear Cuenta' className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link className="block text-center my-5 text-slate-500 uppercase text-sm" to='/'>¿Ya Tienes una Cuenta? Inicia Sesión</Link>
        <Link className="block text-center my-5 text-slate-500 uppercase text-sm" to='/olvide-password'>Olvide mi Password</Link>
      </nav>
    </>
  )
}

export default Registrar