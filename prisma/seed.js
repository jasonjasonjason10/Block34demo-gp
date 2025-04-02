const prisma = require("../prisma");
const seed = async () => {
  // TODO: Create 5 authors with 2 books each
  const createAuthors = async () => {
    const authors = [
        { name: "Author 1 " }, 
        { name: "Author 2 " }, 
        { name: "Author 3 " }, 
        { name: "Author 4 " }, 
        { name: "Author 5 " }
    ];
    await prisma.author.createMany({ data: authors });
  };
  const createBooks = async () => {
    const books = [
        {title: "Book 1", authorId: 1},
        {title: "Book 2", authorId: 1},
        {title: "Book 3", authorId: 2},
        {title: "Book 4", authorId: 2},
        {title: "Book 5", authorId: 3},
        {title: "Book 6", authorId: 3},
        {title: "Book 7", authorId: 4},
        {title: "Book 8", authorId: 4},
        {title: "Book 9", authorId: 5},
        {title: "Book 10", authorId: 5},
    ]
    await prisma.book.createMany({ data: books })
  };

  await createAuthors()
  await createBooks()
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
