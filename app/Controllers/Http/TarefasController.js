'use strict'

const Tarefa = use("App/Models/Tarefas");
const Database = use("Database");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tarefas
 */
class TarefaController {
  /**
   * Show a list of all tarefas.
   * GET tarefas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth }) {
    // const tarefa = await Tarefa.query().where('user_id', auth.user.id).fetch();
    // fazendo select da base de dados
    const tarefa = Database.select('id', 'titulo', 'descricao').from('tarefas').where('user_id', auth.user.id);
    return tarefa;
  }


  /**
   * Create/save a new tarefa.
   * POST tarefas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const {id} = auth.user;
    const data = request.only(["titulo", "descricao"]);
    const tarefa = await Tarefa.create({...data, user_id:id});

    return tarefa;
  }

  /**
   * Display a single tarefa.
   * GET tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view, auth}) {
    const tarefa = await Tarefa.query().where('id', params.id).where('user_id', '=' ,auth.user.id).first();
    
    if (!tarefa) {
      return response.status(404).send({message: "Tarefa inexistente"});
    }
    
    await tarefa.load('arquivos');
    return tarefa;
  }


  /**
   * Update tarefa details.
   * PUT or PATCH tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const {titulo, descricao } = request.all();
    const tarefa = await Tarefa.query().where('id', params.id).where('user_id', '=' ,auth.user.id).first();
    if (!tarefa) {
      return response.status(404).send({message: "Tarefa inexistente"});
    }

    tarefa.titulo = titulo;
    tarefa.descricao = descricao;
    tarefa.id = params.id;

    await tarefa.save();

    return tarefa;

  }

  /**
   * Delete a tarefa with id.
   * DELETE tarefas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  
  async destroy ({ params, request, response, auth }) {
    const tarefa = await Tarefa.query().where('id', params.id).where('user_id', '=' ,auth.user.id).first();
    if (!tarefa) {
      return response.status(404).send({message: "Tarefa inexistente"});
    }

    await tarefa.delete();
    return response.status(200).send({message: "Registro deletado com sucesso"});
  }
}


module.exports = TarefaController
