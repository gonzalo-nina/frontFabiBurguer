// src/service/catalogoService.ts
import axios from 'axios';
import { Catalogo } from '../types/catalogo';

const API_URL = '/api/v1/catalogos';

class CatalogoService {
  async getAllCatalogos(): Promise<Catalogo[]> {
    const response = await axios.get(API_URL);
    return response.data;
  }

  async getCatalogoById(id: number): Promise<Catalogo> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  async createCatalogo(catalogo: Catalogo): Promise<Catalogo> {
    const response = await axios.post(API_URL, catalogo);
    return response.data;
  }

  async updateCatalogo(id: number, catalogo: Catalogo): Promise<Catalogo> {
    const response = await axios.put(`${API_URL}/${id}`, catalogo);
    return response.data;
  }

  async deleteCatalogo(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}

export default new CatalogoService();