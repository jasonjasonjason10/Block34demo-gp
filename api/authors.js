const router = require("express").Router();
module.exports = router;

const prisma = require("../prisma");

//Returns an array of all authors in database
router.get("/", async (req, res, next) => {
  try {
    const authors = await prisma.author.findMany();
    res.json(authors);
  } catch (error) {
    next();
  }
});

//
router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    // We want to send a meaningful error message to the client
    if (!name) {
      // This object doesn't contain too much information,
      // but it's all we need for now based on our only error handling middleware.
      const error = {
        status: 400,
        message: "Author must have a name.",
      };

      // We need to `return` here; otherwise, the function will continue.
      return next(error);
    }

    const author = await prisma.author.create({ data: { name } });
    res.status(201).json(author);
  } catch (error) {
    next();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const author = await prisma.author.findUnique({ where: { id } });

    if (!author) {
      return next({
        status: 404,
        message: `Could not find author with id ${id}.`,
      });
    }

    res.json(author);
  } catch (error) {
    next();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const authorExists = await prisma.author.findUnique({ where: { id } });
    if (!authorExists) {
      return next({
        status: 404,
        message: `Could not find author with id ${id}.`,
      });
    }

    //Update
    const { name } = req.body;
    if (!name) {
      return next({
        status: 400,
        message: "Author must have a name.",
      });
    }

    const author = await prisma.author.update({
      where: { id },
      data: { name },
    });

    res.json(author);
  } catch (error) {
    next();
  }
});

//delete
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const authorExists = await prisma.author.findUnique({ where: { id } });
    if (!authorExists) {
      return next({
        status: 404,
        message: `Could not find author with id ${id}.`,
      });
    }

    await prisma.author.delete({ where: { id } });

    res.sendStatus(204);
  } catch (error) {
    next();
  }
});

//return all books written by author with a specified id
router.get("/:id/books", async (req, res, next) => {
  try {
    const id = +req.params.id;

    // Check if author exists
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) {
      return next({
        status: 404,
        message: `Could not find author with id ${id}.`,
      });
    }

    const books = await prisma.book.findMany({ where: { authorId: id } });

    res.json(books);
  } catch (error) {
    next();
  }
});

//CREATE A NEW BOOK FOR AN AUTHOR
router.post("/:id/books", async (req, res, next) => {
  try {
    const id = +req.params.id;

    // Check if author exists
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) {
      return next({
        status: 404,
        message: `Could not find author with id ${id}.`,
      });
    }
    // Validate request body
    const { title } = req.body;
    if (!title) {
      return next({
        status: 400,
        message: "Book must have a title.",
      });
    }

    const book = await prisma.book.create({
      data: { title, author: { connect: { id } } },
    });

    res.json(book);
  } catch (error) {
    next();
  }
});

// router.post("/:id/books", async (req, res, next) => {
//     try {
//       const id = +req.params.id;
  
//       // Check if author exists
//       const author = await prisma.author.findUnique({ where: { id } });
//       if (!author) {
//         return next({
//           status: 404,
//           message: `Could not find author with id ${id}.`,
//         });
//       }
  
//       // Validate request body
//       const { title } = req.body;
//       if (!title) {
//         return next({
//           status: 400,
//           message: "Book must have a title.",
//         });
//       }
  
//       const book = await prisma.book.create({
//         data: { title, author: { connect: { id } } },
//       });
  
//       res.json(book);
//     } catch {
//       next();
//     }
//   });