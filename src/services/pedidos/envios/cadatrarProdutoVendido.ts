import { ILojaTray } from '../../../interfaces/ILojaTray';
import { IProductDadosCusto, IProductSold } from '../../pedidos/interfaces';

export async function cadastrarProdutoVendido(loja: ILojaTray, transaction: any, produtoVendido: IProductSold, nossoProduto: IProductDadosCusto, ven_numero: number, desconto: number): Promise<void> {
    try {
        const produtoVendidoInsert = {
            VEN_NUMERO: ven_numero,
            IVD_ID_ECOMMERCE: produtoVendido.id,
            LOJ_CODIGO: loja.LOJ_CODIGO,
            PRO_CODIGO: nossoProduto.PRO_CODIGO,
            PRK_CODIGO: produtoVendido.variant_id ? nossoProduto.PRO_CODIGO : null,
            TAM_CODIGO: produtoVendido.variant_id ? nossoProduto.TAM_CODIGO : null,
            COR_CODIGO: produtoVendido.variant_id ? nossoProduto.COR_CODIGO : null,
            PRG_CODIGO: nossoProduto.PRG_CODIGO || null,
            IVD_QTDE: produtoVendido.quantity,
            IVD_PRECO: produtoVendido.original_price,
            IVD_TOTAL: produtoVendido.original_price * produtoVendido.quantity,
            IVD_DESCONTO: desconto,
            IVD_LIQUIDO: (produtoVendido.original_price * produtoVendido.quantity) - desconto,
            IVD_PRCCOMPRA: nossoProduto.PRO_PRCCOMPRA || null,
            IVD_PRCCUSTO: nossoProduto.PRO_PRCCUSTO || null,
            IVD_PRCFISCAL: nossoProduto.PRO_PRCCOMPRAFISCAL || null,
            IVD_PRCCUSTOFISCAL: nossoProduto.PRO_CUSTOFISCAL || null,
            IVD_ENTREGUE: 'N',
            IVD_PRCAVISTA: produtoVendido.original_price
        };

        const IVD_NUMERO = 'GEN_ID(GEN_NUMEROIVD, 1)';

        const query = `
            INSERT INTO ITENSVEN
            (                
                IVD_NUMERO,
                VEN_NUMERO,
                IVD_ID_ECOMMERCE,
                LOJ_CODIGO,
                PRO_CODIGO,
                PRK_CODIGO,
                TAM_CODIGO,
                COR_CODIGO,
                PRG_CODIGO,
                IVD_QTDE,
                IVD_PRECO,
                IVD_DESCONTO,
                IVD_TOTAL,
                IVD_LIQUIDO,
                IVD_PRCCOMPRA,
                IVD_PRCCUSTO, 
                IVD_PRCFISCAL,
                IVD_PRCCUSTOFISCAL,
                IVD_ENTREGUE,
                IVD_PRCAVISTA
            )
            VALUES (${IVD_NUMERO}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            produtoVendidoInsert.VEN_NUMERO,
            produtoVendidoInsert.IVD_ID_ECOMMERCE,
            produtoVendidoInsert.LOJ_CODIGO,
            produtoVendidoInsert.PRO_CODIGO,
            produtoVendidoInsert.PRK_CODIGO,
            produtoVendidoInsert.TAM_CODIGO,
            produtoVendidoInsert.COR_CODIGO,
            produtoVendidoInsert.PRG_CODIGO,
            produtoVendidoInsert.IVD_QTDE,
            produtoVendidoInsert.IVD_PRECO,
            produtoVendidoInsert.IVD_DESCONTO,
            produtoVendidoInsert.IVD_TOTAL,
            produtoVendidoInsert.IVD_LIQUIDO,
            produtoVendidoInsert.IVD_PRCCOMPRA,
            produtoVendidoInsert.IVD_PRCCUSTO,
            produtoVendidoInsert.IVD_PRCFISCAL,
            produtoVendidoInsert.IVD_PRCCUSTOFISCAL,
            produtoVendidoInsert.IVD_ENTREGUE,
            produtoVendidoInsert.IVD_PRCAVISTA
        ];

        return new Promise((resolve, reject) => {
            transaction.query(query, values, (err: any, result: any) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    } catch (error) {
        throw new Error(`Erro ao inserir produto vendido ${produtoVendido.id} na loja ${loja.LTR_CNPJ} -> ${error}`);
    }
}
