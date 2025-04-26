import axios from "axios";
import { addAuthInterceptor } from "./axios";
import type { BookStatus } from "../types/book";

const BASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

const api = axios.create({ baseURL: BASE_URL });
addAuthInterceptor(api);

type FavoriteBooksResponse = {
  ids: number[];
};

type BooksWithStatusesResponse = {
  books: { [bookId: number]: BookStatus };
};

export const UserService = {
  getFavoriteBooks(): FavoriteBooksResponse {
    return { ids: [] };
  },

  addFavoriteBook() {},

  removeFavoriteBook() {},

  getBooksWithStatuses(): BooksWithStatusesResponse {
    return { books: {} };
  },

  setBookStatus() {},
};
