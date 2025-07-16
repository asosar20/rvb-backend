const fs = require('fs')
const csv = require('csv-parser')
const axios = require('axios')

const casas = []

fs.createReadStream('data.csv') 
  .pipe(csv())
  .on('data', (row) => {
    casas.push({
      etapa: row.etapa,
      manzana: row.manzana,
      lote: row.lote,
      ubicacion: row.ubicacion_casa,
      area_total: parseFloat(row.area_total),
      costo_terreno_m2: parseFloat(row.costo_terreno_m2),
      costo_construccion_m2: parseFloat(row.costo_construccion_m2),
      modulo_m2: parseFloat(row.modulo_m2),
      bono: parseFloat(row.bono),
      aplica_calle: row.aplica_calle != '',
      aplica_parque: row.aplica_parque != '',
    })
  })
  .on('end', async () => {
    try {
      const res = await axios.post('http://localhost:3000/casas', casas)
      console.log('✅ Casas registradas:', res.data)
    } catch (error) {
      console.error('❌ Error al enviar los datos:', error.response?.data || error.message)
    }
  })
