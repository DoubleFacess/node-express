import { Model } from '../models/index'
import Response from 'express';
import {__email as msg, do_mail as mailer} from '../scripts/mailer'
import { MailMessage } from '../interfaces/MailerModel'
import { generateImage } from '../scripts/imageGenerator'


/* @@ request interfaces @@ */
interface RequestById {
    params: {
        id: number
    }
}

interface RequestMail {    
    body: {
        email: string,        
        subject: string,        
        text: string,
        name: string
    }
}

export interface RequestPrompt {
    params: {
        prompt: string
    }
}

interface Response {
    send: (body: any) => void
    status: (code: number) => Response; 
}

export class MainController {

    static home(req: RequestById, res: Response) {
        try{
            const message = 'Welcome to node-server application'
            res.send(message)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    static async getAllUsers(req: RequestById, res: Response) {
        try {
            const users = await Model.queryAll()
            res.send(users)
        } catch (err) {
            res.status(500).send(err)
        }
    }
    static async getById(req: RequestById, res: Response) {
        const id = req.params.id
        if(!req.params.id){
            return res.status(400).send('Id parameter is required')
        } else {
            const user = await Model.queryById(id)
            .catch(err => {
                res.status(500).send(err)
            })
            if(!user){
                return res.status(404).send('User not found')
            }
            else res.send(user)
        }
    }
    static sendMail(req: RequestMail, res: Response) {

        console.log('Request Body:', req.body)
        const msg = new MailMessage({
            _to: req.body.email,
            _from: 'double.facessss@gmail.com',
            _subject: req.body.subject,
            _text: req.body.text,
            _name: req.body.name
        })
        try{
            mailer(msg)
            const message = 'Message sent successully! Check your email.'
            res.send(message)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    /* @@ test requests @@ */
    static testApi(req: RequestById, res: Response) {

        try{
            const message = 'Hello from api'
            res.send(message)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    static testMailer(req: RequestById, res: Response) {
        
        try{
            mailer(msg)
            const message = 'Message sent successully! Check your email.'
            res.send(message)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    /* @@ huggingface transformers @@ */

    static doImage(req: RequestPrompt, res: Response) {

        try {
            generateImage("photo of a basketball decorated with a palestinian flag")
            const message = 'Image was created successully! Check in your public path'
            res.send(message)
        } catch (e) {
            console.log(e)
        }

    }

}


/*async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);  
      const user = await UserModel.getById(id);
      res.send(user);
    } catch (err) {
      res.status(500).send(err);
    }
 }
*/



/*
export const main = {

    test: async (req: any, res: any) => {

        try {  
            const nome = req.query.nome
            const cognome = req.query.cognome
            const email = req.query.email
            const data = await Model.test()    
            res.send(data)    
        } catch (err) {
            res.status(500).send(err);
        }

    }
}
*/

