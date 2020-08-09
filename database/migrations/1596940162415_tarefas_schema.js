'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TarefasSchema extends Schema {
  up () {
    this.create('tarefas', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
      table.integer('titulo').notNullable();
      table.integer('descricao').notNullable();
      table.timestamps();
    })
  }

  down () {
    this.drop('tarefas')
  }
}

module.exports = TarefasSchema
