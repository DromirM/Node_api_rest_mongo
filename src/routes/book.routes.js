const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// MIDDLEWARE
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if(!id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(404).json(
      {
        message: 'El ID del libro no es valido'
      }
    )
  }

  try {
    book = await Book.findById(id);
    if(!book){
      return res.status(404).json(
        {
          message: 'El libro no fue encontrado'
        }
      )
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }

  res.book = book;
  next();
}


// Obtener todos los libros. [GET ALL]
router.get('/', async (req, res) => {
  //Maneja solicitudes [GET]
  try {
    const books = await Book.find();
    //console.log('GET ALL', books);
    if(books.length === 0){
      return res.status(204).json({});
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
});

// Crear un nuevo libro.
router.post('/', async (req, res) => {
  //Maneja solicitudes [POST]
  const { title, author, genre, publication_date } = req?.body;

  if(!title || !author || !genre || !publication_date){
    return res.status(400).json({
      message: 'Los campos titulo, autor, genero y fecha son obligatorios.'
    });
  }

  const book = new Book({
    title,
    author,
    genre,
    publication_date
  });

  try {
    const newBook = await book.save();
    //console.log('POST', newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Obtiene un libro por ID.
router.get('/:id', getBook, async (req, res) => {
  // Maneja una solicitud [GET]
  res.json(res.book);
});

//Actualiza un libro.
router.put('/:id', getBook, async (req, res) => {
  // Maneja solicitudes [PUT]
  try {
    const book = res.book;

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updateBook = await book.save();
    res.json(updateBook);
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
});

//Actualiza parcialmente un libro.
router.patch('/:id', getBook, async (req, res) => {
  // Maneja solicitudes [PATCH]

  if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
    return res.status(400).json({
      message: 'Al menos uno de estos campos: "titulo", "autor", "genero" y "fecha de publicacion" debe ser enviado.'
    });
  }

  try {
    const book = res.book;

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updateBook = await book.save();
    res.json(updateBook);
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
});

router.delete('/:id', getBook, async (req, res) => {
  // Maneja solicitudes [DELETE]
  try {
    const book = res.book;
    await book.deleteOne({
      _id: book._id
    });
    res.json({
      message: `El libro ${book.title} eliminado correctamente.`
    }) 
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;