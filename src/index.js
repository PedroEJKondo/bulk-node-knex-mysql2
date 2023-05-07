const knex = require('../config/database');

function getProvincias() {
    return knex.select().from('municipios').select()
        .then(rows => {
            return rows;
        })
        .catch(error => {
            console.error(error);
        });
}

function getDocumentos() {
    return knex.select().from('documentos').select('local').distinct()
        .then(rows => {
            return rows;
        })
        .catch(error => {
            console.error(error);
        });
}

async function migrateData(trx) {

    Promise.all([
        getProvincias(),
        getDocumentos()
    ])
        .then(async results => {

            const [municipios, documentos] = results;

            for (const doc of documentos) {

                let municipio = municipios.find((item) => item.id == doc.local)

                await knex
                    .from('documentos')
                    .transacting(trx)
                    .where({
                        local: doc.local,
                    })
                    .update({
                        local: Number(municipio.idProvincia),
                    })
            }

        })
        .catch(async error => {
            console.error(error);
            await trx.rollback();
        })
        .finally(async () => {
            knex.destroy();
            await trx.commit();
        });

}

async function main() {

    const trx = await knex.transaction();

    try {
        await migrateData(trx)
        // await trx.rollback();
    } catch (err) {
        // await trx.rollback();
        console.log(err);
        process.exit(1);
    }
    finally {
    }
}

console.log('Fim da migração da actualização dos dados !!!')

main();
