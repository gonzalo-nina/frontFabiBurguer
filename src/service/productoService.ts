// src/service/productoService.ts
import axios from '../config/axios'; 
import { Producto } from '../types/producto';

const API_URL = '/api/v1/productos';

class ProductoService {
    async getAllProductos(): Promise<Producto[]> {
        const response = await axios.get(API_URL);
        return response.data;
    }

    async getProductoById(id: number): Promise<Producto> {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }

    async createProducto(producto: Producto): Promise<Producto> {
        const response = await axios.post(API_URL, producto);
        return response.data;
    }


    async updateProducto(id: number, producto: Producto): Promise<Producto> {
        const response = await axios.put(`${API_URL}/${id}`, producto);
        return response.data;
    }

    async deleteProducto(id: number): Promise<void> {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new ProductoService();