const express = require("express")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

//Produts
app.post('/createProduct', async(req, res)=> {
  const {name, image, price } =  req.body
  const result = await prisma.product.create({
      data:{
          name, image, price
      }
  })
  res.json(result)
})


app.get('/products', async(req, res) =>{
  const products = await prisma.product.findMany()
  res.json(products)
})


app.put('/product/:id', async(req, res)=>{
  const {id} = req.params
  const {name, price, image} = req.body
  const product = await prisma.product.update({
    where:{id: Number(id)},
    data:{name, price, image}
  })
  res.json(product)
})


app.delete('/product/:id', async(req, res)=>{
  const {id} = req.params
  const product = await prisma.product.delete({
    where: {id: Number(id)}
  })
  res.json(`Producto eliminado`)
})

//Orders
app.post('/createOrder', async(req, res)=> {
    const {user, items} = req.body
    try {
        const orderCreated = await prisma.order.create({
            data: {
                user,
                items: {
                    create: items
                }
            },
            include: {
                items: true
            }
        })
        res.json(orderCreated)
    } catch (error) {
        res.status(400).json({ error })
    }
})


app.get('/orders', async(req, res) =>{
    const orders = await prisma.order.findMany({include:{items:true}})
    res.json(orders)
  })


app.put('/order/:id', async(req, res)=>{
    const {id} = req.params
    const {status} = req.body
    const order = await prisma.order.update({
      where:{id: Number(id)},
      data:{status}
    })
    res.json(order)
  })

app.listen(3000, ()=>
console.log(`El server está listo`)
)
