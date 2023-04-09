import xlwt

planilha = {
    'dt_entrada': 'data',
    'usuario': {
        'nome': 'nome',
        'email': 'email'
    },
    'item': {
        'is_bem_de_consumo':'string',
        'grupo':'string',
        'cod':'string',
        'doc_fisc':'string',
        'is_doacao':'string',
        'doador':'string',
        'validade':'string',
        'val_unit':'string',
        'val_total':'string',
        'fornecedor':'string',
        'descricao':'string',
        'tipo_unit':'string',
    }

}


def escrever_planilha(queryset):
    for item in queryset:
        pass

