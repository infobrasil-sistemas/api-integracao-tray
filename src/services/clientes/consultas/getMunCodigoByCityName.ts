import { ILojaTray } from '../../../interfaces/ILojaTray';
import logger from '../../../utils/logger';
import { sanitizeCity } from '../../../utils/sanitizeCity';

export async function getMunCodigoByCityName(loja: ILojaTray, transaction: any, city: string): Promise<number | null> {
    try {
        const sanitizedCity = sanitizeCity(city)

        const query = `
        SELECT MUN.MUN_CODIGO FROM MUNICIPIOS MUN
        WHERE MUN.MUN_NOME = '${sanitizedCity}'
        `;

        return new Promise((resolve, reject) => {
            transaction.query(query, [], (err: any, result: any) => {
                if (err) {
                    return reject(new Error(`Erro ao obter código do municipio ${city} da loja ${loja.LTR_CNPJ} -> ${err}`));
                }
                resolve(result[0]?.MUN_CODIGO || null);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter código do municipio ${city} da loja ${loja.LTR_CNPJ} -> ${error}`)
    }
}
