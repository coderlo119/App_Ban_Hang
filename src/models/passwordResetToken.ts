import { model, Schema } from "mongoose";
import { hash, compare, genSalt } from "bcrypt";

interface PassResetTokenDocument extends Document {
    owner: Schema.Types.ObjectId;
    token: string;
    createAt: Date;
}

interface Methods {
    compareToken(token: string): Promise<boolean>
}

const schema = new Schema<PassResetTokenDocument,{},Methods>({
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    token:{
        type: String,
        required: true
    },
    createAt:{
        type: Date,
        expires: 3600, //60*60
        defaut: Date.now()
    }
})


schema.pre('save', async function(next){
    if(this.isModified('token')){
        const salt = await genSalt(10);
        this.token = await hash(this.token, salt);
    }

    next();
});

schema.methods.compareToken = async function(token){
    return await compare(token, this.token);
};


const PassResetTokenModel = model("PassResetToken", schema);
export default PassResetTokenModel;