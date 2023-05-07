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
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            knex.destroy();
        });

}

async function main() {

    const trx = await knex.transaction();

    /*
      console.time('MIGRATION');
    
    
      try {
        await Promise.resolve()
          // .then(() => createNature(workbook, trx))
          // .then(() => createUnit(workbook, trx))
          // .then(() => createTemplate(workbook, trx))
          // .then(() => createGroups(workbook, trx))
          // .then(() => addTemplateToGroup(workbook, trx))
          // .then(() => createOrganism(workbook, trx))
          // .then(() => addOrganismToGroup(workbook, trx))
          // .then(() => addSchedule(workbook, trx))
          // .then(() => addFieldsToTemplate(workbook, trx))
          .then(() => generateBITable(workbook, trx))
          .then(() => console.log('done'))
          .then(() => console.timeEnd('MIGRATION'));
        await trx.commit();
      } catch (err) {
        console.log(err);
    
        await trx.rollback();
      }
    */
    try {
        await migrateData(trx)
        await trx.rollback();
    } catch (err) {
        await trx.rollback();
        console.log(err);
        process.exit(1);
    }
    finally {
    }
}
console.log('Fim da migração da actualização dos dados !!!')

main();
