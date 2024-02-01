import { useState } from "react";
import useProyectos from "../hook/useProyectos";
import Alerta from "./Alerta";

function FormularioColaborador() {
  const [email, setEmail] = useState("");
  const { alerta, mostrarAlerta, submitColaborador } = useProyectos();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      mostrarAlerta({
        msg: "El Email es Obligatorio",
        error: true,
      });
      return;
    }
    submitColaborador(email)
  };

  const { msg } = alerta;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white py-10 px-5 w-full md:w-2/3 rounded-lg shadow"
    >
      {msg && <Alerta alerta={alerta} />}
      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="email"
        >
          Email del Colaborador:
        </label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Email del Colaborador"
        />
      </div>
      <input
        type="submit"
        className="bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-md text-sm"
        value="Buscar Colaborador"
      />
    </form>
  );
}

export default FormularioColaborador;
