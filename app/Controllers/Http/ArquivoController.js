'use strict'

const Arquivo = use("App/Models/Arquivo");
const Tarefas = use("App/Models/Tarefas");

const Helpers = use("Helpers");

class ArquivoController {
    async create({params, request, response}){
        try {
            const tarefa = await Tarefas.findOrFail(params.id);
            const arquivos = request.file("file", {
                size: '1mb',
            });

            await arquivos.moveAll(Helpers.tmpPath('Arquivos'), (file) => ({
                name: `${Date.now()}-${file.clientName}`
            }));

            if (!arquivos.movedAll()) {
                return arquivos.errors();
            }

            await Promise.all(
                arquivos.movedList().map(item => tarefa.arquivos().create({caminho: item.fileName}))
            );

            return response.status(200).send({message: "Arquivo enviado com sucesso"});

        } catch (error) {
            return response.status(500).send({erro: "Ocorreu um erro no upload"});
        }
    }
}

module.exports = ArquivoController
