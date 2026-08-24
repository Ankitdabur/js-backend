import mongoose from 'mongoose'

const orderItemsSchema = new mongoose.Schema({
     //productid store kr rhe hai
     //iss schema ko aur koi use nhi krne waala...isliye ye yahan bnaya..warna isko bhi import krke use kr skte the
    productId:{
       type : mongoose.Schema.Types.ObjectId,
       ref : "Product"
     },

     quantity :{
        type : Number,
        required : true,
     }
})

const orderSchema = new mongoose.Schema(
    {
        orderPrice:{
            type : Number,
            required:true,
        },

        customer : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true, 
        },

        orderItems:{
            type :[orderItemsSchema]
        },
        
    //can do this also
    //  orderItems: [
    // {
    //     productId: ObjectId,
    //     quantity: Number
    // }]

        address:{
           type : String,
           required : true
        },
        
        status:{
            type : String,
            enum :["PENDING" , "CANCELLED", "DELEVERED"],
            default:"PENDING"
        }
        
    } , {timestamps:true}
)

export const Order = mongoose.model("Order",orderSchema)