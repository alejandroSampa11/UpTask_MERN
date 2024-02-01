import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios.jsx"
import useAuth from "../hook/useAuth.jsx"

function Login() {

  //STATES
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  //CONTEXT
  const {setAuth} = useAuth()

  const navigate = useNavigate()
  
  //FUNCTIONS
  const handleSubmit = async (e) => {
    e.preventDefault()
    if([email,password].includes('')){
      setAlerta({
        msg: 'Todos los campos son Obligatorios',
        error: true
      });
      return
    }
    
    try {
      const {data} = await clienteAxios.post('/usuarios/login',{email,password})
      setAlerta({})
      localStorage.setItem('token',data.token)
      setAuth(data)
      navigate('/proyectos')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      });
    }
  }

  const {msg} = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Inicia Sesión y Administra tus {""}
        <span className="text-slate-700">Proyectos</span>
      </h1>

      {msg && <Alerta
        alerta={alerta}
      />}

      <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-100"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-100"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>
      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/registrar"
        >
          ¿No tienes una Cuenta? Registrate
        </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/olvide-password"
        >
          Olvide mi Password
        </Link>
      </nav>
    </>
  );
}

export default Login