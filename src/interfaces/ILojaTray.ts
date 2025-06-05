export interface ILojaTray extends ILojaTrayInicializada {
  LTR_CODIGO: number;
}

export interface ILojaTrayInicializada {
  LTR_CONSUMER_KEY: string;
  LTR_CONSUMER_SECRET: string;
  LTR_CODE: string;
  LTR_ACCESS_TOKEN: string;
  LTR_REFRESH_TOKEN: string;
  LTR_EXPIRATION_ACCESS_TOKEN: Date;
  LTR_EXPIRATION_REFRESH_TOKEN: Date;
  LTR_API_HOST: string;
  LTR_STORE_ID: number;
  LTR_CNPJ: string;
  LTR_LOJAS_ESTOQUE: string,
  LTR_TIPO_ESTOQUE: number,
  LTR_ESTOQUE_MINIMO: number
  LOJ_CODIGO: number,
  LTR_TABELA_PRECO: number,
  LTR_INTERMEDIADOR_PAGAMENTO?: string | null,
  LTR_ID_STATUS_SINCRONIZADO: number,
  DAD_CODIGO: number;
  LTR_SINCRONIZA_ALTERACOES: string
}

export interface ILojaTrayInicializar {
  LTR_CONSUMER_KEY: string;
  LTR_CONSUMER_SECRET: string;
  LTR_CODE: string;
  LTR_API_HOST: string;
  LTR_STORE_ID: number;
  LTR_CNPJ: string;
  LTR_LOJAS_ESTOQUE: string,
  LTR_TIPO_ESTOQUE: number,
  LTR_ESTOQUE_MINIMO: number
  LOJ_CODIGO: number,
  LTR_TABELA_PRECO: number,
  LTR_INTERMEDIADOR_PAGAMENTO?: string
  DAD_CODIGO: number
}

export interface ILojaTrayAtualizar {
  LTR_CONSUMER_KEY?: string
  LTR_CONSUMER_SECRET?: string
  LTR_CODE?: string
  LTR_API_HOST?: string
  LTR_STORE_ID?: number
  LTR_CNPJ: string
  LTR_LOJAS_ESTOQUE?: string
  LTR_TIPO_ESTOQUE?: number
  LTR_ESTOQUE_MINIMO?: number
  LOJ_CODIGO?: number
  LTR_TABELA_PRECO?: number
  LTR_ID_STATUS_SINCRONIZADO?: number
  LTR_INTERMEDIADOR_PAGAMENTO?: string
  LTR_SITUACAO?: string
}

export interface IDadosEndereco {
  DAD_HOST: string
  DAD_PORTA: number
  DAD_USER: string
  DAD_CAMINHO: string
  DAD_CNPJ: string
  DAD_ID: string
}

export interface IDadosEnderecoAtualizar {
  DAD_HOST?: string
  DAD_PORTA?: number
  DAD_USER?: string
  DAD_CAMINHO?: string
  DAD_CNPJ: string
  DAD_ID?: string
}



