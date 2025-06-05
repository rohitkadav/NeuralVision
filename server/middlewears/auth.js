import jwt from 'jsonwebtoken';


const userAuth = async (req , res , next) =>{
    // console.log("dd");
    const {token} = req.headers;
    if(!token) {
        return res.json ({success :  false , message :'Not authorized login'})
    }

    try{
        const tokenDecode = jwt.verify(token , process.env.JWT_SECRET)
        
        if(tokenDecode.id) {
            // console.log(tokenDecode.id)
            req.user = { id: tokenDecode.id };
            // req.body.userId= tokenDecode.id;
        }else{
            return res.json ({success :  false , message :'Not authorized login'})
        }

        next();
    }catch(e) {
         return res.json ({success :  false , message :e.message})
 
    }
}


export default userAuth;