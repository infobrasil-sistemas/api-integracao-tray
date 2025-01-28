export interface ICustomer {
    id: number; // Código do cliente
    cnpj?: string; // CNPJ
    name: string; // Nome
    rg?: string; // RG
    cpf?: string; // CPF
    phone?: string; // Telefone fixo
    cellphone?: string; // Telefone celular
    birth_date?: Date; // Data de aniversário
    gender: number; // Sexo (0 = Masculino, 1 = Feminino)
    email: string; // E-mail
    nickname?: string; // Apelido
    observation?: string; // Informações sobre o cliente
    type: number; // Tipo de cliente (0 = Pessoa física, 1 = Pessoa jurídica)
    company_name?: string; // Razão social
    state_inscription?: string; // Inscrição estadual
    last_purchase?: Date; // Data da última compra
    address: string; // Logradouro
    zip_code: string; // CEP
    number: string; // Número do endereço
    complement?: string; // Complemento
    neighborhood: string; // Bairro
    city: string; // Cidade
    state: string; // Estado
    country: string; // País
}

export interface ICustomerComMunCodigo extends ICustomerWithDeliveryAddress {
    munCodigo: number
    endereco: ICustomerAddress
    munCodigoEnt?: number | null
    enderecoEnt?: ICustomerAddress | null
}

export interface ICustomerWithDeliveryAddress {
    id: number; // Código do cliente
    cnpj?: string; // CNPJ
    name: string; // Nome
    rg?: string; // RG
    cpf?: string; // CPF
    phone?: string; // Telefone fixo
    cellphone?: string; // Telefone celular
    birth_date?: Date; // Data de aniversário
    gender: number; // Sexo (0 = Masculino, 1 = Feminino)
    email: string; // E-mail
    nickname?: string; // Apelido
    observation?: string; // Informações sobre o cliente
    type: number; // Tipo de cliente (0 = Pessoa física, 1 = Pessoa jurídica)
    company_name?: string; // Razão social
    state_inscription?: string; // Inscrição estadual
    last_purchase?: Date; // Data da última compra
    address: string; // Logradouro
    zip_code: string; // CEP
    number: string; // Número do endereço
    complement?: string; // Complemento
    neighborhood: string; // Bairro
    city: string; // Cidade
    state: string; // Estado
    country: string; // País
    CustomerAddress: ICustomerAddress[]; // Lista de endereços do cliente
}

export interface ICustomerAddress {
    id: number; // Código do endereço
    customer_id: number; // Código do cliente
    address: string; // Logradouro
    number: string; // Número do endereço
    complement?: string; // Complemento
    neighborhood: string; // Bairro
    city: string; // Cidade
    state: string; // Estado
    zip_code: string; // CEP
    country: string; // País
    type: string
}

export interface IProductDadosCusto {
    PRO_CODIGO: string,
    PRG_CODIGO?: string,
    PRO_PRCCOMPRA: number,
    PRO_PRCCUSTO: number,
    PRO_PRCCOMPRAFISCAL: number,
    PRO_CUSTOFISCAL: number
}

export interface IProductSold {
    product_id: number; // Código do produto
    quantity: number; // Quantidade vendida
    id: number; // Código do item vendido
    price: number; // Preço do produto
    variant_id?: number; // Código da variação
}

export interface IPayment {
    id: number; // Código do pagamento
    payment_method_id: number; // Código do método de pagamento
    method: string // Método
    value: number; // Valor do pagamento
}

export interface IOrder {
    status: string; // Status do pedido
    id: number; // Código do pedido
    date: Date; // Data do pedido
    hour: string; // Horário do pedido (HH:MM:SS)
    partial_total: number; // Valor parcial do pedido
    taxes?: number; // Valor de acréscimo/taxa
    discount?: number; // Valor de desconto
    shipment?: string; // Tipo de frete
    shipment_value?: number; // Valor do frete
    store_note?: string; // Informações adicionais da loja
    customer_note?: string; // Informações adicionais do cliente
    payment_method_rate?: number; // Taxa do meio de pagamento
    installment?: number; // Quantidade de parcelas
    delivery_time?: string; // Tempo de entrega
    payment_method: string; // Meio de pagamento
    total: number; // Valor total do pedido
    payment_date: Date; // Data de pagamento
    interest?: number; // Juros do pedido
    estimated_delivery_date?: Date; // Data estimada de entrega
    has_payment: boolean; // Indica se existe pagamento confirmado
    has_invoice: boolean; // Indica se existe nota fiscal
    Customer: ICustomer; // Dados do cliente
    // DeliveryAddress: ICustomerAddress
    ProductsSold: IProductSold[]; // Produtos vendidos
    // Payment: IPayment[]; // Informações de pagamento
}

export interface IOrderInsert {
    id: number; // Código do pedido -- 
    date: Date; // Data do pedido (VEN_DATA)
    hour: string; // Horário do pedido (HH:MM:SS) (VEN_HORA)
    partial_total: number; // Valor parcial do pedido (VEN_TOTALBRUTO)
    taxes?: number; // Valor de acréscimo/taxa (VEN_TOTALACRESC)
    discount?: number; // Valor de desconto (VEN_TOTALDESC)
    shipment?: string; // Tipo de frete
    shipment_value?: number; // Valor do frete (VEN_VALORENT)
    store_note?: string; // Informações adicionais da loja
    customer_note?: string; // Informações adicionais do cliente
    payment_method_rate?: number; // Taxa do meio de pagamento (VEN_TAXAPAG)
    installment?: number; // Quantidade de parcelas (PP1)
    payment_method: string; // Meio de pagamento (FP1)
    total: number; // Valor total do pedido (VEN_TOTALLIQUIDO)
}



// INSERT INTO vendas 
// (
//     VEN_NUMERO
//     VEN_ID_ECOMMERCE,
//     SIT_CODIGO,               1
//     LOJ_CODIGO,
//     USU_CODIGO,
//     PP1_CODIGO,
//     FP1_CODIGO,
//     VEN_TIPO (E),
//     VEN_PRECO (TABELA DE PREÇO DO PRODUTO NAS CONFIGS DA LOJA),
//     VEN_DATA,
//     VEN_HORA,
//     VEN_TOTALBRUTO,
//     VEN_TOTALDESC,
//     VEN_TOTALACRESC, 
//     VEN_VALORENT,
//     VEN_TAXAPAG,
//     VEN_TOTALLIQUIDO,
// )


