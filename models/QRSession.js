// import mongoose from "mongoose";

// const qrSessionSchema = new mongoose.Schema(
//   {
//     token: { type: String, required: true, unique: true }, 
//     qrImage: { type: String, required: true }, 

   
//     startAt: { type: Date, required: true }, 
//     endAt: { type: Date, required: true },   

  
//     status: {
//       type: String,
//       enum: ["active", "expired"],
//       default: "active",
//     },

//     date: {
//       type: String, 
//       required: true,
//     },

   
//     generatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );


// qrSessionSchema.pre("save", function (next) {
//   const qr = this;
//   const now = new Date();

 
//   const qrDate = new Date(qr.date);
//   if (
//     qr.status === "active" &&
//     (now.toDateString() !== qrDate.toDateString() || now > qr.endAt)
//   ) {
//     qr.status = "expired";
//   }

//   next();
// });

// export default mongoose.model("QRSession", qrSessionSchema);



import mongoose from "mongoose";

const qrSessionSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  qrImage: { type: String, required: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  date: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active",
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("QRSession", qrSessionSchema);

