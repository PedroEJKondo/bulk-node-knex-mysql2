
async function index(db, where) {
    
    return db
        .select('*')
        .from(where.table)
        .where(where.where1, where.where2)
        .orderBy(where.orderBy);

}

async function update(db, table, id, latitude, longitude, trx = null) {
    return db
        .from(table)
        // .returning(['id','latitude','longitude'])
        // .transacting(trx)
        .where({ id })
        .update({ latitude, longitude })
        .then(async () => {
            // trx.commit();
            console.log(`SUCCESS 😍`);
        })
        .catch(() => {
            // trx.rollback();
            console.log('ERROR 😡');
        });

}

module.exports = {
    update,
    index
};