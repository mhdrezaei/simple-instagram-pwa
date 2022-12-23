const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter job title"],
    maxLenght: [
      100,
      "The length of the title should be less than 100 characters",
    ],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "please enter the job description"],
    maxLength: [
      200,
      "The length of the description should be less than 200 characters ",
    ],
  },
  email : {
    type : String ,
    validate : [validator.isEmail , "please entyer valid email address"],
  },
  address : String ,
  industry : {
    type : String,
    required : true,
    
  },
  salary : Number,
  image : String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

jobSchema.pre('save' , function(next){
    this.slug = slugify(this.title , {lower : true})
    next();
  })

module.exports = mongoose.model('Jobs' , jobSchema)
