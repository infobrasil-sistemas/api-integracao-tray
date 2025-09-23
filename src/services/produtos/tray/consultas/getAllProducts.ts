import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoIntegrado } from '../../interfaces';

export async function getAllProducts(loja: ILojaTray, accessToken: string): Promise<{ id: number, reference: string }[]> {
    try {
        const produtos: { id: number; reference: string }[] = [];

        let page = 1;
        const limit = 50; // máximo que a Tray aceita
        let totalPages = 1;

        do {
            const response = await axios.get(`${loja.LTR_API_HOST}/products`, {
                params: {
                    access_token: accessToken,
                    page,
                    limit
                }
            });

            if (response.status === 200 || response.status === 201) {
                const { paging, Products } = response.data;

                if (Array.isArray(Products)) {
                    for (const produto of Products) {
                        produtos.push({
                            id: parseInt(produto.id),
                            reference: produto.reference
                        });
                    }
                }

                const total = paging?.total ?? 0;
                totalPages = Math.ceil(total / limit);
                page++;
            } else {
                logger.error(
                    `Erro ao buscar produtos da loja ${loja.LTR_CNPJ} -> ${response.data.message}`
                );
                throw new Error(
                    `Erro ao buscar produtos da loja ${loja.LTR_CNPJ} -> ${response.data.message}`
                );
            }
        } while (page <= totalPages);

        return produtos;

    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexão com API da TRAY`
        });
        throw new Error(`Erro de conexão com API da TRAY`);
    }
}
