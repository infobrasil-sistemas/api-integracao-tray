import { IProdutoNaoIntegrado, IProdutoVariacaoNaoIntegrado, IVariacaoProdutoNaoIntegrada } from "../../services/produtos/interfaces";

export function transformarEmProdutoVariacaoNaoIntegrado(produtoNaoIntegrado: IProdutoNaoIntegrado, variacaoProduto: IVariacaoProdutoNaoIntegrada): IProdutoVariacaoNaoIntegrado {
    return {
        product_id: variacaoProduto.product_id,
        ean: variacaoProduto.ean,
        cost_price: produtoNaoIntegrado.cost_price,
        stock: 0,
        weight: produtoNaoIntegrado.weight,
        length: produtoNaoIntegrado.length,
        width: produtoNaoIntegrado.width,
        height: produtoNaoIntegrado.height,
        reference: produtoNaoIntegrado.reference,
        type_1: variacaoProduto.type_1,
        value_1: variacaoProduto.value_1,
        type_2: variacaoProduto.type_2,
        value_2: variacaoProduto.value_2
    };
}
