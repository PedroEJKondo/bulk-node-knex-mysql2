const readXlsxFile = require('read-excel-file/node')

const db = require('../../config/database');
const sql = require('../sql/insert-generate');

async function readFileInsertToBD(file) {

    async function insert(row) {
        return await sql.insert(db, row);
    }

    readXlsxFile(`file-excel/${file}.xlsx`).then(  async (rows) => {

        const data = new Date()

        for (let index = 0; index < 50000; index++) {
            console.log(index);
        }
        // for (const row of rows) {

        //     if (![1, 11].includes(row[1])) {

        //         const newRow = {
        //             name: row[0],
        //             sigla: row[0],
        //             idProvincia: row[1],
        //             id_user: row[2],
        //             description: 'Migração de dados',
        //             created_at: data,
        //             updated_at: data
        //         }

        //         const result = insert(newRow)
        //     }
        // }

    })

}

module.exports = {
    readFileInsertToBD
}