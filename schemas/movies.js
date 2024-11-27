const z = require("zod")

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "Movie title must be a string",
    required_error: "Movie title is required. Please add a title",
  }),
  year: z.number().int().min(1900).max(2025), // .positive()
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).optional(),
  poster: z.string().url(), // .endsWith(".jpg")
  genre: z.array(
    z.enum(["Action", "Comedy", "Drama", "Horror", "Thriller"]),
    {
      required_error: "Movie genre is required",
      invalid_type_error: "Movie genre must be an array of enum genres",
    }
  ),
  // z.enum(["Action", "Comedy", "Drama", "Horror", "Thriller"]).array(),
})

function validateMovie(object) {
  // parse(object)
  // safeParse(object)  devolver un objeto result si hay un error o si hay datos
  // safeParseAsync(object)
  return movieSchema.safeParse(object)
}

function validatePartialMovie(input) {
  return movieSchema.partial().safeParse(input) // las hace opcionales, si no esta no pasa nada pero si esta las valida
}

module.exports = { validateMovie, validatePartialMovie }