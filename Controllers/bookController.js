const Book = require("../Models/bookModel");
const stripe = require('stripe')(process.env.paymentKey);


exports.addBook = async (req, res) => {
  console.log("inside addBook");
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  try {
    const {
      title,
      author,
      noofpages,
      imageUrl,
      price,
      dprice,
      abstract,
      publisher,
      language,
      isbn,
      category,
    } = req.body;

    const userMail = req.payload; // ensure middleware sets this
    console.log("User:", userMail);

    const uploadedImages = req.files?.map((f) => f.filename) || [];

    if (!userMail) {
      return res.status(400).json("User mail missing");
    }

    const existingBook = await Book.findOne({ title, userMail });

    if (existingBook) {
      return res.status(401).json("Book already exist");
    }

    const newBook = new Book({
      title,
      author,
      noofpages: Number(noofpages),
      imageUrl,
      price: Number(price),
      dprice: Number(dprice),
      abstract,
      publisher,
      language,
      isbn,
      category,
      userMail,
      images: uploadedImages,
    });

    const saved = await newBook.save();
    console.log(saved);

    res.status(200).json("Book Added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getBook = async (req, res) => {
  const searchKey = req.query.search || "";
  console.log(searchKey);
  const title= {
        $regex: searchKey,
        $options: "i",
      }
    
  try {
    const allBooks = await Book.find({title});
    res.status(200).json(allBooks);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getHomeBook = async (req, res) => {
  try {
    const allBooks = await Book.find().sort({ _id: -1 }).limit(4);
    res.status(200).json(allBooks);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.viewBook = async (req, res) => {
  const { id } = req.params;
  try {
    const viewBook = await Book.findOne({ _id: id });
    res.status(200).json(viewBook);
  } catch (error) {
    res.status(500).json(error);
  }
};


exports.buyBook=async(req,res)=>{
  console.log("inside payment");
  const {bookDetails}=req.body
    email=req.payload
   console.log(bookDetails);
  try{
    const existingBook=await Book.findByIdAndUpdate(bookDetails._id,{
      title:bookDetails.title,
      author:bookDetails.author,
      noofpages:bookDetails.noofpages,
      imageUrl:bookDetails.imageUrl,
      price:bookDetails.price,
      discount_price:bookDetails.discount_price,
      abstract:bookDetails.abstract,
      publisher:bookDetails.publisher,
      language:bookDetails.language,
      isbn:bookDetails.isbn,
      category:bookDetails.category,
      UploadedImages:bookDetails.UploadedImages,
      status:"sold",
      userMail:bookDetails.userMail,
      brought:email
    },
    {new:true}
  )
  
  const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: bookDetails.title,
            description: `${bookDetails.author} | ${bookDetails.publisher}`,
            images: [bookDetails.imageUrl],
            metadata: {
              title: bookDetails.title,
              author: bookDetails.author,
              noofpages: bookDetails.noofpages,
              imageUrl: bookDetails.imageUrl,
              price: bookDetails.price,
              discount_price: bookDetails.discount_price,
              abstract: bookDetails.abstract,
              publisher: bookDetails.publisher,
              language: bookDetails.language,
              isbn: bookDetails.isbn,
              category: bookDetails.category,
              UploadedImages: bookDetails.UploadedImages,
              status: "sold",
              userMail: bookDetails.userMail,
              brought: email,
            },
          },
          unit_amount: Math.round(Number(bookDetails.dprice) * 100),
        },
        quantity: 1,
      },
    ];
  const session = await stripe.checkout.sessions.create({
  payment_method_types:['card'],
  success_url: 'http://localhost:5173/payment-success',
  cancel_url:'http://localhost:5173/payment-error',
  line_items,
  mode: 'payment',
});
    res.status(200).json({message:"success",session,sessionID:session.id} )

  }
  catch(error)
  {
    console.log(error);
    
    res.status(500).json("error"+error)
    
  }
  
}
