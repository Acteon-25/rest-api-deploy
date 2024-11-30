// Validaciones de reglas de negocio relacionadas con la persistencia de datos en la base de datos:
// 1. Asegurar la integridad y coherencia de los datos:
//    - Garantizar que no se pueda insertar un valor que viole las restricciones de la base de datos (por ejemplo, IDs duplicados).
//    - Evitar valores inválidos o no permitidos en los campos (como IDs inexistentes o referencias a registros no relacionados).
// 2. Validaciones de existencia:
//    - Comprobar si un valor único, como un email, ya existe antes de realizar la inserción o actualización.
// 3. Separación de responsabilidades:
//    - Delegar estas validaciones al modelo de datos siempre que sea posible, para centralizar la lógica de integridad.
// Este enfoque asegura que la base de datos mantenga su consistencia y previene errores en operaciones de lectura/escritura.
import { randomUUID } from "node:crypto"
import { readJSON } from "../utils.js"

const movies = readJSON("./movies.json")

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      return movies.filter(
        movie => movie.genre.some(gen => gen.toLowerCase() === genre.toLowerCase())
      )
    }
    return movies
  }

  static async getById({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input,
    }
    movies.push(newMovie)
    return newMovie
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
      return res.status(404).json({ message: "Movie not found" })
    }
    movies.splice(movieIndex, 1)
    return true
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return res.status(404).json({ message: "Movie not found" })
    }
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input,
    }
    return movies[movieIndex]
  }
}