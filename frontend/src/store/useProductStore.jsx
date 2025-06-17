import {create} from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

//base url is dynamic based on the environment
const BASE_URL = import.meta.env.MODE === 'development' ?  "http://localhost:3000" : "";

export const useProductStore = create((set, get) =>  ({
    products: [],
    loading: false,
    error: null,

    currentProduct: null,

    formData: {
        name: '',
        price: '',
        image: ''
    },

    setFormData: (formData) => set({formData}),
    resetFormData: () => set({formData : {name:'', price:'', image:''}}),
    
    addProduct: async (e) => {
        e.preventDefault();
        set({loading: true});
        try {
            const {formData} = get();
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();
            get().resetFormData();
            toast.success("Product added successfully");
            document.getElementById('add_product_modal').close();
        } catch (e) {
            console.log('Error adding product', e);
            toast.error('Something went wrong');
        } finally {
            set({loading: false});
        }
    },

    fetchProducts: async () => {
        set({ loading: true});
        try{
            const response  = await axios.get(`${BASE_URL}/api/products`);
            set({ products: response.data.data, error: null });
        } catch (e) {
             if(e.status === 429) set({ error: "Rate limit exceeded", products: [] });
             else set({ error: "Something went wrong in fetching products", products: [] });
        } finally {
            set({ loading: false});
        }
    },


    deleteProduct: async (id) => {
        set({ loading: true});
        try{
            if(window.confirm('Are you sure you want to delete this product?')) {
                await axios.delete(`${BASE_URL}/api/products/${id}`);
                toast.success("Product deleted successfully.");
        }

        } catch (e) {
            console.log("Error deleting product", e);
            toast.error("Something went wrong!");
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true});
        try{
            const response  = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({ currentProduct: response.data.data,
                  formData: response.data.data,
                  error: null });
        } catch (e) {
            console.log("Error fetching product", e);
            toast.error("Something went wrong!");
        } finally {
            set({ loading: false});
        }
    },

    updateProduct: async (id) => {
        set({ loading: true});
        try {
            const {formData} = get();
            const response  = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
            set({ currentProduct: response.data.data});
            toast.success("Product updated successfully");
        } catch (e) {
            console.log("Error updating product", e);
            toast.error("Something went wrong!");
        } finally {
            set({ loading: false});
        }
    },
}));