export interface ICamposPreco {
    campo_preco: string
}

export function getCamposPreco(tabelaPreco: number): ICamposPreco {
    let campo_preco;
    let campo_preco_promocinal;

    switch (tabelaPreco) {
        case 1:
            campo_preco = 'est.pro_preco1';
            //campo_preco_promocinal = 'est.pro_precop1';
            break;
        case 2:
            campo_preco = 'est.pro_preco2';
            //campo_preco_promocinal = 'est.pro_precop2';
            break;
        case 3:
            campo_preco = 'est.pro_preco3';
            //campo_preco_promocinal = 'est.pro_precop3';
            break;
        case 4:
            campo_preco = 'est.pro_preco4';
            //campo_preco_promocinal = 'est.pro_precop4';
            break;
        case 5:
            campo_preco = 'est.pro_preco5';
            //campo_preco_promocinal = 'est.pro_precop5';
            break;
        case 6:
            campo_preco = 'est.pro_preco6';
            //campo_preco_promocinal = 'est.pro_precop6';
            break;
        case 7:
            campo_preco = 'est.pro_preco7';
            //campo_preco_promocinal = 'est.pro_precop7';
            break;
        case 8:
            campo_preco = 'est.pro_preco8';
            //campo_preco_promocinal = 'est.pro_precop8';
            break;
        case 9:
            campo_preco = 'est.pro_preco9';
            //campo_preco_promocinal = 'est.pro_precop9';
            break;
        case 10:
            campo_preco = 'est.pro_preco10';
            //campo_preco_promocinal = 'est.pro_precop10';
            break;
        case 11:
            campo_preco = 'est.pro_preco11';
            //campo_preco_promocinal = 'est.pro_precop11';
            break;
        case 12:
            campo_preco = 'est.pro_preco12';
            //campo_preco_promocinal = 'est.pro_precop12';
            break;
    }

    return {
        campo_preco: campo_preco || 'est.pro_preco1',
        //campo_preco_promocional: campo_preco_promocinal || 'est.pro_precop1'
    }
}

