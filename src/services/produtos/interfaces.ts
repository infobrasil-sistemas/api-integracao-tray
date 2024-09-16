export interface IProdutoNaoIntegrado {
    ean: string;
    name: string;
    ncm: string;
    description: string;
    description_small: string;
    price: number;
    cost_price: number;
    promotional_price: number | null;
    start_promotion: string | null;
    end_promotion: string | null;
    ipi_value: number;
    brand: string;
    model: string | null;
    weight: number;
    length: number;
    width: number;
    height: number;
    stock: number;
    category_id: number;
    available: number;
    availability: string | null;
    availability_days: number | null;
    reference: string;
    hot: number;
    release: number;
    additional_button: string | null;
    related_categories: string | null;
    release_date: string | null;
    metatag: string | null;
    type: string | null;
    content: string | null;
    local: string | null;
}

export interface IProdutoIntegrado {
    id: number;
    ean: string;
    name: string;
    ncm: string;
    description: string;
    description_small: string;
    price: number;
    cost_price: number;
    promotional_price: number | null;
    start_promotion: string | null;
    end_promotion: string | null;
    brand: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    category_id: number;
    available: number;
    reference: string;
}

export interface IEstoqueProduto {
    id: number;
    name: string;
    stock: number;
}