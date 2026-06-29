const path = require("path");
const dotenv = require("dotenv");
const axios = require("axios");
const connectDB = require("../config/db");
const Book = require("../models/booksModel");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";
const TARGET_IMPORT_COUNT = Number(process.env.BOOK_IMPORT_TARGET) || 2000;
const BATCH_SIZE = Number(process.env.BOOK_IMPORT_BATCH_SIZE) || 100;
const GOOGLE_MAX_RESULTS = 40;

const GENRES = [
  "Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Science Fiction",
  "History",
  "Biography",
  "Business",
  "Technology",
  "Self-Help",
  "Philosophy",
  "Psychology",
  "Health",
  "Education",
  "Young Adult",
  "Horror",
  "Adventure",
  "Classics",
  "Children's Literature",
];

const stats = {
  processed: 0,
  inserted: 0,
  duplicatesSkipped: 0,
  failed: 0,
};

const getPublishedYear = (publishedDate) => {
  if (!publishedDate) {
    return undefined;
  }

  const year = Number(publishedDate.toString().slice(0, 4));
  return Number.isInteger(year) ? year : undefined;
};

const normalizeImage = (imageLinks = {}) =>
  imageLinks.thumbnail || imageLinks.smallThumbnail || undefined;

const mapGoogleBookToDocument = (item) => {
  const volume = item.volumeInfo || {};
  const authorName = volume.authors?.join(", ");
  const genres = volume.categories || [];

  if (!item.id || !volume.title || !authorName) {
    return null;
  }

  return {
    title: volume.title,
    authorName,
    authorId: null,
    author: null,
    description: volume.description,
    genre: genres[0],
    genres,
    publisher: volume.publisher,
    publishedYear: getPublishedYear(volume.publishedDate),
    pageCount: volume.pageCount,
    language: volume.language,
    averageRating: volume.averageRating,
    ratingsCount: volume.ratingsCount,
    coverImage: normalizeImage(volume.imageLinks),
    googleBookId: item.id,
    source: "google",
    status: "active",
  };
};

const fetchGoogleBooks = async (genre, startIndex) => {
  const params = {
    q: `subject:${genre}`,
    startIndex,
    maxResults: GOOGLE_MAX_RESULTS,
    printType: "books",
  };

  if (process.env.GOOGLE_BOOKS_API_KEY) {
    params.key = process.env.GOOGLE_BOOKS_API_KEY;
  }

  const response = await axios.get(GOOGLE_BOOKS_URL, { params, timeout: 15000 });
  return response.data.items || [];
};

const flushBatch = async (batch, existingGoogleIds) => {
  if (batch.length === 0) {
    return;
  }

  const googleBookIds = batch.map((book) => book.googleBookId);
  const alreadySaved = await Book.find({
    googleBookId: { $in: googleBookIds },
  }).select("googleBookId");

  const savedIds = new Set(alreadySaved.map((book) => book.googleBookId));
  const uniqueBatch = batch.filter((book) => {
    if (savedIds.has(book.googleBookId)) {
      stats.duplicatesSkipped += 1;
      return false;
    }

    existingGoogleIds.add(book.googleBookId);
    return true;
  });

  if (uniqueBatch.length === 0) {
    return;
  }

  try {
    const result = await Book.insertMany(uniqueBatch, { ordered: false });
    stats.inserted += result.length;
  } catch (error) {
    const insertedCount = error.insertedDocs?.length || 0;
    stats.inserted += insertedCount;
    stats.failed += Math.max(uniqueBatch.length - insertedCount, 0);
    console.error("Batch insert warning:", error.message);
  }
};

const importBooks = async () => {
  await connectDB();

  const existingBooks = await Book.find({
    googleBookId: { $exists: true, $ne: null },
  }).select("googleBookId");
  const existingGoogleIds = new Set(
    existingBooks.map((book) => book.googleBookId)
  );

  let batch = [];
  let startIndex = 0;

  while (stats.inserted < TARGET_IMPORT_COUNT) {
    let fetchedAnyBooks = false;

    for (const genre of GENRES) {
      if (stats.inserted >= TARGET_IMPORT_COUNT) {
        break;
      }

      try {
        const items = await fetchGoogleBooks(genre, startIndex);
        fetchedAnyBooks = fetchedAnyBooks || items.length > 0;

        for (const item of items) {
          stats.processed += 1;
          const book = mapGoogleBookToDocument(item);

          if (!book) {
            stats.failed += 1;
            continue;
          }

          if (existingGoogleIds.has(book.googleBookId)) {
            stats.duplicatesSkipped += 1;
            continue;
          }

          existingGoogleIds.add(book.googleBookId);
          batch.push(book);

          if (batch.length >= BATCH_SIZE) {
            await flushBatch(batch, existingGoogleIds);
            batch = [];
            console.log(
              `Processed: ${stats.processed} | Inserted: ${stats.inserted} | Duplicates: ${stats.duplicatesSkipped} | Failed: ${stats.failed}`
            );
          }

          if (stats.inserted + batch.length >= TARGET_IMPORT_COUNT) {
            break;
          }
        }
      } catch (error) {
        stats.failed += 1;
        console.error(`Failed fetching ${genre} at ${startIndex}:`, error.message);
      }
    }

    if (!fetchedAnyBooks) {
      break;
    }

    startIndex += GOOGLE_MAX_RESULTS;
  }

  await flushBatch(batch.slice(0, TARGET_IMPORT_COUNT - stats.inserted), existingGoogleIds);

  console.log("Import complete");
  console.log(`Books processed: ${stats.processed}`);
  console.log(`Books inserted: ${stats.inserted}`);
  console.log(`Duplicate books skipped: ${stats.duplicatesSkipped}`);
  console.log(`Failed entries: ${stats.failed}`);
  console.log(`Total imported: ${stats.inserted}`);

  process.exit(0);
};

importBooks().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
