# language: pt
Funcionalidade: Rodar o EADP

    Esquema do Cenário: "<descricao_do_cenario>"
        Dado que o site está "<estado_do_site>"                     # disponivel, indisponivel
        E que os arquivos estão "<estado_dos_arquivos>"             # disponiveis, indisponiveis, parcialmente_disponiveis, faltantes_disponiveis
        E que a ultima execução tenha "<estado_do_processamento>"   # inexistente, desatualizado, incompleto, baixado, transferido
        Quando eu executo o consumidorbatch
        Então a requisição de "<requisicoes>" deve ser feita        # nada, site, site_e_todos_arquivos ,site_e_arquvis_faltantes
        E "<upload_s3>" deve ser salvo no bucket                    # nada, todos_os_arquivos, arquivos_sem_erro, os_arquivos_faltantes
        E o job do glue deve "<condicao_glue_esperada>"             # ser_chamado, nao_ser_chamado
        E o estado salvo no PS deve ser "<estado_final>"            # baixado, incompleto, transferido


        Exemplos: condições de execução
        | descricao_do_cenario                                 | estado_do_site   | estado_dos_arquivos      | estado_do_processamento | requisicoes              | upload_s3             | condicao_glue_esperada | estado_final |
        | Primeira execução: executar tudo                     | disponivel       | disponiveis              | inexistente             | site_e_todos_arquivos    | todos_os_arquivos     | ser_chamado            | baixado      |
        | Tudo já baixado e transferido: nada a fazer          | disponivel       | disponiveis              | transferido             | nada                     | nada                  | nao_ser_chamado        | transferido  |
        | Há atualização: reprocessar tudo                     | disponivel       | disponiveis              | desatualizado           | site_e_todos_arquivos    | todos_os_arquivos     | ser_chamado            | baixado      |
        | Tudo no S3 mas não transferido: apenas chamar o glue | disponivel       | disponiveis              | baixado                 | nada                     | nada                  | ser_chamado            | baixado      |
        | Download de algum arquivo falhar: subida parcial     | disponivel       | parcialmente_disponiveis | desatualizado           | site_e_todos_arquivos    | arquivos_sem_erro     | ser_chamado            | incompleto   |
        | Execução seguinte à falha: reprocessar o faltante    | disponivel       | faltantes_disponiveis    | incompleto              | site_e_arquvis_faltantes | os_arquivos_faltantes | ser_chamado            | baixado      |
        | Site indisponível: não há o que fazer                | indisponivel     | indisponiveis            | incompleto              | site                     | nada                  | nao_ser_chamado        | incompleto   |
