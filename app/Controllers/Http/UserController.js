'use strict'

const User = use("App/Models/User");
const { validateAll } = use('Validator');

class UserController {
    async create({request, response}){
        try{
            const erroMessage = {
                "username.required": "Este campo é obrigatório",
                "username.unique": "Este nome já existe",
                "username.min": "O nome deve ter no mínimo 5 caracteres"
            }
            const validation = await validateAll(request.all(), {
                username: 'required|min:5|unique:users',
                email: 'required|email|unique:users',
                password: 'required|min:6',
            }, erroMessage);

            if (validation.fails()) {
                return response.status(500).send({message: validation.messages()});
            }

            const data = request.only(["username", "email", "password"]);
            const user = await User.create(data);
    
            return user;

        }catch(error){
            console.error(response.status(500).send({error: `Erro: ${error.message}`}));
        } 
    }

    async login({request, response, auth}){
        try {
            const {email, password} = request.all();
            const validaToken = await auth.attempt(email, password);

            return validaToken;
            
        } catch (error) {
            console.error(response.status(500).send({error: `Erro: ${error.message}`}));
        }
    }
}

module.exports = UserController;
