const express = require('express')
const cors = require('cors')
const supabase = require('./supabase')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' })) 
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const PORT = process.env.PORT || 3000

app.post('/casas', async (req, res) => {
  try {
    const entradas = Array.isArray(req.body) ? req.body : [req.body]

    const registrosCalculados = []

    for (const item of entradas) {
      const {
        etapa,
        manzana,
        lote,
        ubicacion,
        area_total,
        costo_terreno_m2,
        costo_construccion_m2,
        modulo_m2,
        bono,
        aplica_calle,
        aplica_parque
      } = item

      const costo_lote = Math.round(area_total * costo_terreno_m2)
      const costo_construccion_modulo = Math.round(modulo_m2 * costo_construccion_m2)
      const costo_parcial = Math.round(costo_lote + costo_construccion_modulo)
      const calle = aplica_calle ? Math.round(costo_parcial * 0.01) : 0
      const parque = aplica_parque ? Math.round(costo_parcial * 0.04) : 0
      const costo_venta = Math.round(costo_parcial + calle + parque)
      const adicional_10 = Math.round(costo_venta * 1.1)
      const costo_con_bono = Math.round(costo_venta - bono)
      const bono_contado = Math.round(adicional_10 - bono)

      let inicial_3000 = null
      let inicial_5000 = null

      if (ubicacion === 'ESPECIAL') {
        inicial_5000 = Math.round(bono_contado + 7000 - 1000)
      } else {
        inicial_3000 = Math.round(bono_contado + 7000)
        inicial_5000 = Math.round(inicial_3000 - 1000)
      }

      const inicial_10000 = Math.round(inicial_5000 - 1000)
      const inicial_15000 = Math.round(inicial_10000 - 1000)

      const utilidad_lote = Math.round(area_total * 134)
      const utilidad_modulo = Math.round(modulo_m2 * 329)

      registrosCalculados.push({
        etapa,
        manzana,
        lote,
        ubicacion,
        area_total,
        costo_terreno_m2,
        costo_construccion_m2,
        modulo_m2,
        bono,
        aplica_calle,
        aplica_parque,
        costo_lote,
        costo_construccion_modulo,
        costo_parcial,
        calle,
        parque,
        costo_venta,
        adicional_10,
        costo_con_bono,
        bono_contado,
        inicial_3000,
        inicial_5000,
        inicial_10000,
        inicial_15000,
        utilidad_lote,
        utilidad_modulo
      })
    }

    const { data, error } = await supabase.from('casas').insert(registrosCalculados)

    if (error) {
      console.error('❌ Error al insertar:', error)
      return res.status(500).json({ error: error.message || error })
    }

    res.status(201).json({ message: '✅ Casas registradas con éxito', cantidad: registrosCalculados.length, data })
  } catch (e) {
    console.error('❗ Error inesperado:', e)
    res.status(500).json({ error: 'Error inesperado', detalles: e.message })
  }
})


app.get('/casas', async (req, res) => {
  try {
    const { modulo_m2, manzana, lote } = req.query
    let query = supabase.from('casas').select('*')

    if (modulo_m2) {
      query = query.eq('modulo_m2', Number(modulo_m2))
    }

    if (manzana && lote && modulo_m2) {
      query = query
        .eq('manzana', manzana)
        .eq('lote', lote)
        .eq('modulo_m2', Number(modulo_m2))
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Error al obtener datos:', error)
      return res.status(500).json({ error: error.message })
    }

    res.json({ cantidad: data.length, data })
  } catch (e) {
    console.error('❗ Error inesperado:', e)
    res.status(500).json({ error: 'Error inesperado', detalles: e.message })
  }
})


app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`)
})
