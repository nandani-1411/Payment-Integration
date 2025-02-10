import React, { useState ,useEffect} from 'react'
import {loadStripe} from "@stripe/stripe-js"
const stripePromise = loadStripe("")// publishable key here.......

const App = () => {
  const [product,setProduct]=useState({
    name:"React product1",
    price:100,
    productBy:"React PRoductss"
  })
  const [token,setToken]=useState({
    email:"thiss@gmail.com",
  })
  //aa id backend na res mathi male che ... create ordder thy tyr e male
  const [sessionId,setSessionId]=useState(null)
console.log(product)
  const handlePayment=async()=>{
    // alert("Payment")
    
    console.log("hello")
    const body={
      product,token
    }
    const headers={
      "Content-Type":"application/json"
    }

    try{
      const res= await fetch(`http://localhost:5000/payment`,{
        method:"POST",
        headers,
        body:JSON.stringify(body)
      })
  
      //id male e setseession ma store kri...
      const result=await res.json()
      console.log(result.status)
    console.log("hello2")

      
      setSessionId(result.id)
      console.log("IDs")
      console.log(sessionId)
     
  
    }
    catch(er){
      console.log(er)
    }
  }
  

  useEffect(() => {
    if (sessionId) {
      stripePromise.then((stripe) => {
        stripe.redirectToCheckout({ sessionId });
      });
    }
  }, [sessionId]);

 

  return (
    <>
      <h1>Stripe Payments</h1>
      <button onClick={handlePayment}>Buy {product.price}</button>
    </>
  )
}

export default App
