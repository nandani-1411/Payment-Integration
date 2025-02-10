import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import Stripe from "stripe"

dotenv.config({
    path: "./.env"
})

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    res.json("For the testing purpose.... Done")
})

//for the payment creation
app.post("/payment", async (req, res, next) => {
    try {
        const { product, token } = req.body
        console.log("PRODUCT " + product)
        console.log("Token " + token)
        if (!product || !token) {
            res.status(400).json({ msg: "Pls required product and token" })
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "INR",
                  product_data: {
                    name: product.name,
                    description: `Product by: ${product.productBy}`,
                  },
                  unit_amount: product.price *100, // ✅ Corrected from amount → unit_amount
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            customer_email: token.email,
            success_url: "http://localhost:5173",
            cancel_url: "http://localhost:5173",
          });

        console.log(session)
        //  all about the stripe informations........
        res.status(200).json({id:session.id})


    }
    catch (er) {
        console.log(er)
    }


})

app.listen(process.env.PORT, () => {
    console.log(`Running Server At Port ${process.env.PORT}`)
})