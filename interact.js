const { ethers } = require("ethers");
const BooksLibrary = require("./BooksLibrary.json"); // You can copy also the compiled contract
const dotenv = require('dotenv');

dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;
const USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY;


const run = async function () {
    const provider = new ethers.InfuraProvider(
        "sepolia",
        INFURA_API_KEY
    );

    const ownerWallet = new ethers.Wallet(
        OWNER_PRIVATE_KEY,
        provider
    );

    const userWallet = new ethers.Wallet(
        USER_PRIVATE_KEY,
        provider
    );


    const balance1 = await provider.getBalance(ownerWallet.address);
    console.log('balance of owner = ' + balance1);

    const balance2 = await provider.getBalance(userWallet.address);
    console.log('balance of user  = ' + balance2);

    const booksLibraryOwnerContract = new ethers.Contract(
        "0x29c7DA5e258E1bAc4E203a9f1127D7f279591F05",
        BooksLibrary.abi,
        ownerWallet
    );

    const booksLibraryUserContract = new ethers.Contract(
        "0x29c7DA5e258E1bAc4E203a9f1127D7f279591F05",
        BooksLibrary.abi,
        userWallet
    );

    //--------CREATES A BOOK--------
    // const transactionAddBook = await booksLibraryOwnerContract.addBook("J.K. Rowling", "Harry Potter", 100);
    // const transactionAddBookReceipt = await transactionAddBook.wait();
    // if (transactionAddBookReceipt.status != 1) {
    //     console.log("Transaction was not successful");
    //     return;
    // }


    //--------Checks all available books--------
    const availableBooks = await booksLibraryUserContract.getAllAvailableBooks();
    console.log("All available books:" + JSON.stringify(availableBooks));
    console.log();
    

    //--------Rents a book--------
    // const transactionRentBook = await booksLibraryUserContract.borrowBook(availableBooks[0]);
    // const transactionRentBookReceipt = await transactionRentBook.wait();
    // if (transactionRentBookReceipt.status != 1) {
    //     console.log("Transaction was not successful");
    //     return;
    // }


    //--------Checks that it is rented--------
    const bookId = availableBooks[0];
    const book = await booksLibraryUserContract.books(bookId);
    const userIsHoldingBook = await booksLibraryUserContract.borrowedBook(userWallet.address, bookId);
    if(userIsHoldingBook) {
        console.log("Address " + userWallet.address + " is holding book " + book[1] + " by " + book[0])
    } else {
        console.log("Address " + userWallet.address + " is not holding book " + book)
    }
    console.log();


    //--------Returns the book--------
    // const transactionReturnBook = await booksLibraryUserContract.returnBook(book);
    // const transactionReturnBookReceipt = await transactionReturnBook.wait();
    // if (transactionReturnBookReceipt.status != 1) {
    //     console.log("Transaction was not successful");
    //     return;
    // }


    //--------Checks the availability of the book--------
    const isBookAvailable = (await booksLibraryUserContract.getAllAvailableBooks()).includes(bookId);
    
    console.log(isBookAvailable)
    if(isBookAvailable) {
        console.log("Book " + book[1] + " by " + book[0] + " is available!")
    } else {
        console.log("Book " + book[1] + " by " + book[0] + " is not available!")

    }
    console.log();

};
run();