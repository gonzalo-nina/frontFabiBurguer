// src/types/common.ts
export interface BaseItem {
    id?: number;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'date';
    validation?: {
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: RegExp;
        errorMessage?: string;
    };
}