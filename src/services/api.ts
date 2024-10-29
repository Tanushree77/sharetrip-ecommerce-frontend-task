import axios from 'axios';
import { ProductsResponse } from '../types/Product';

const API_URL = 'https://dummyjson.com/products';

export const getProducts = async (): Promise<ProductsResponse> => {
  const response = await axios.get<ProductsResponse>(API_URL);
  return response.data;
};