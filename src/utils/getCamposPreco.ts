export interface ICamposPreco {
    campo_preco: string
    campo_desconto: string
}

export function getCamposPreco(tabelaPreco: number): ICamposPreco {
    let campo_preco;
    let campo_desconto;

    switch (tabelaPreco) {
        case 1:
            campo_preco = 'est.pro_preco1';
            campo_desconto = 'est.pro_desconto1';
            break;
        case 2:
            campo_preco = 'est.pro_preco2';
            campo_desconto = 'est.pro_desconto2';
            break;
        case 3:
            campo_preco = 'est.pro_preco3';
            campo_desconto = 'est.pro_desconto3';
            break;
        case 4:
            campo_preco = 'est.pro_preco4';
            campo_desconto = 'est.pro_desconto4';
            break;
        case 5:
            campo_preco = 'est.pro_preco5';
            campo_desconto = 'est.pro_desconto5';
            break;
        case 6:
            campo_preco = 'est.pro_preco6';
            campo_desconto = 'est.pro_desconto6';
            break;
        case 7:
            campo_preco = 'est.pro_preco7';
            campo_desconto = 'est.pro_desconto7';;
            break;
        case 8:
            campo_preco = 'est.pro_preco8';
            campo_desconto = 'est.pro_desconto8';
            break;
        case 9:
            campo_preco = 'est.pro_preco9';
            campo_desconto = 'est.pro_desconto9';
            break;
        case 10:
            campo_preco = 'est.pro_preco10';
            campo_desconto = 'est.pro_desconto10';
            break;
        case 11:
            campo_preco = 'est.pro_preco11';
            campo_desconto = 'est.pro_desconto11';
            break;
        case 12:
            campo_preco = 'est.pro_preco12';
            campo_desconto = 'est.pro_desconto12';
            break;
    }

    return {
        campo_preco: campo_preco || 'est.pro_preco1',
        campo_desconto: campo_desconto || 'est.pro_precop1'
    }
}

