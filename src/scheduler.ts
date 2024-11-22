import cron from 'node-cron';
import { addJobToQueue } from './queue/jobsQueue';

addJobToQueue('sincronizarCategorias');

cron.schedule('*/1 * * * *', () => {
    console.log('Agendando sincronização de estoque...');
    addJobToQueue('sincronizarEstoques');
});

cron.schedule('*/10 * * * *', () => {
    console.log('Agendando sincronização de pedidos...');
    addJobToQueue('sincronizarPedidos');
});


cron.schedule('*/30 * * * *', () => {
    console.log('Agendando sincronização de produtos...');
    addJobToQueue('sincronizarProdutos');
});

cron.schedule('0 2 * * *', () => {
    console.log('Agendando sincronização de categorias...');
    addJobToQueue('sincronizarCategorias');
});
