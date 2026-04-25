
import {Request,Response} from 'express'
import * as Sentry from "@sentry/node" ;


export const getUserCredits=async(req:Request , res:Response)=>{
    try{

    }catch(error:any){
        Sentry.captureException(error)
    }

}