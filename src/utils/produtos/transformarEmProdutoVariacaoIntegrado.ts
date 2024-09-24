import { IProdutoIntegrado, IProdutoVariacaoIntegrado, IVariacaoProdutoIntegrada } from "../../services/produtos/interfaces";

export function transformarEmProdutoVariacaoIntegrado(produtoIntegrado: IProdutoIntegrado, variacaoProduto: IVariacaoProdutoIntegrada): IProdutoVariacaoIntegrado {
    return {
        id: variacaoProduto.id,
        ean: variacaoProduto.ean,
        price: produtoIntegrado.price,
        cost_price: produtoIntegrado.cost_price,
        reference: produtoIntegrado.reference,
        weight: produtoIntegrado.weight,
        length: produtoIntegrado.length,
        width: produtoIntegrado.width,
        height: produtoIntegrado.height,
        start_promotion: produtoIntegrado.start_promotion,
        end_promotion: produtoIntegrado.end_promotion,
        promotional_price: produtoIntegrado.promotional_price,
        value_1: variacaoProduto.value_1,
        value_2: variacaoProduto.value_2
    };
}
