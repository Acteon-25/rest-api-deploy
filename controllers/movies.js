// Validación de formato y coherencia de los datos recibidos:
// 1. Verificar que los datos cumplan con los requisitos necesarios antes de ser enviados al modelo:
//    - Validar campos requeridos (asegurarse de que no falte información obligatoria).
//    - Comprobar que los valores cumplen con las restricciones esperadas (ejemplo: números dentro de un rango permitido, formato de email válido, etc.).
// 2. Seguridad:
//    - Detectar y prevenir posibles intentos de enviar datos maliciosos o manipulados (inyección de código, valores inesperados).
// 3. Separación de responsabilidades:
//    - Realizar estas validaciones en el controlador es una buena práctica para garantizar que el modelo reciba datos limpios y confiables.
// Este enfoque mejora la seguridad y estabilidad del sistema, asegurando que los datos sean adecuados para el procesamiento posterior.
// Se da mayor importancia al input de los usuarios


// Validaciones de vista:  
// 1. Propósito principal:  
//    - Estas validaciones no afectan directamente la lógica de negocio, pero son esenciales para mejorar la experiencia del usuario.  
// 2. Prevención temprana de errores:  
//    - Notificar al usuario sobre campos requeridos o formatos incorrectos antes de enviar los datos al servidor.  
//    - Evitar que el usuario pierda tiempo esperando una respuesta del servidor para errores que podrían haberse prevenido localmente.  
// 3. Beneficios:  
//    - Reducen la frustración del usuario al proporcionar retroalimentación inmediata.  
//    - Ayudan a guiar al usuario para completar formularios correctamente desde el principio.  
// Este enfoque mejora significativamente la usabilidad y la percepción de la aplicación por parte del usuario.  

import { MovieModel } from "../models/movie.js"
import { validateMovie, validatePartialMovie } from "../schemas/movies.js"

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async getById(req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) {
      res.json(movie)
    }
    res.status(404).json({ message: "Movie not found" })
  }

  static async create(req, res) {
    const result = validateMovie(req.body)
    if (result.error) {
      return res.status(400).json(result.error.message)
    }
    const newMovie = await MovieModel.create({ input: result.data })
    res.status(201).json(newMovie)
  }

  static async delete(req, res) {
    const { id } = req.params
    const result = await MovieModel.delete({ id })
    if (result === false) {
      return res.status(404).json({ message: "Movie not found" })
    }
    return res.json({ message: "Movie deleted" })
  }

  static async update(req, res) {
    const result = validatePartialMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updateMovie = await MovieModel.update({ id, input: result.data })
    return res.json(updateMovie)
  }
}