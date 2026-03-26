 ponto para escritórios de contabilidade e profissionais de Departamento Pessoal.

Desenvolvido com auxílio de inteligência artificial (Claude/Anthropic) · © 2026 João Miguel E Ferreira


🎯 O que é
O PontoCerto DP substitui planilhas manuais e acelera o fechamento mensal de ponto, entregando ao contador os dados prontos para lançamento na folha de pagamento — com cálculos automáticos baseados na CLT.
Funciona como um arquivo HTML único que roda direto no navegador. Sem instalação, sem servidor, sem conta.

✨ Funcionalidades

Tabela mensal de ponto gerada automaticamente com todos os dias do mês
Cálculo automático de:

Horas trabalhadas por dia — sem descontar intervalo padrão quando não há registro (ex: 08h–12h = 4h exatas)
Virada de meia-noite tratada corretamente (ex: 23:00–01:00 = 2h trabalhadas)
Meio-período automático: se preenchido só entrada + saída do intervalo (sem retorno/saída), conta o tempo trabalhado até ali e gera atraso para o restante da jornada
Intrajornada com validação CLT (Art. 71 — ≤4h sem obrigação / 4h01–6h mínimo 15min / >6h mínimo 60min)
Atrasos com tolerância configurável (padrão: 10 min)
Horas extras em dois modelos:

Padrão: 50% dias úteis / 100% domingos e feriados
Personalizado: 1ª faixa até X horas com % A, demais com % B (ex: 65% nas primeiras 2h, 85% nas demais)


Adicional noturno (22h–05h) com hora reduzida opcional (52min30s) — calcula corretamente mesmo com virada de meia-noite


Sábado configurável — quando habilitado, horas extras são 100%; campos editáveis mesmo quando desabilitado
Domingos editáveis — aceitam lançamento com HE 100% automático
Coluna de ocorrências por linha: Falta / Atestado / Feriado (marcado automaticamente)
Feriados nacionais 2025, 2026 e 2027 já incluídos; estaduais/municipais cadastráveis
Linha de totais no rodapé da tabela, alinhada com as colunas
Resumo mensal com violações de intrajornada incluídas, pronto para folha de pagamento
Exportação CSV compatível com Excel e Google Sheets
Impressão PDF em modo paisagem A4 com cabeçalho (empresa, funcionário, mês/ano)
Modo claro/escuro
Sidebar colapsável (modo somente ícones com tooltip)
Navegação por Enter entre campos de horário


🚀 Como usar

Faça o download do arquivo ponto-certo.html
Abra no seu navegador (Chrome, Firefox, Edge)
Preencha empresa, funcionário e mês/ano
Configure a jornada e clique em Gerar Tabela
Digite os horários ou use Preencher Padrão
Exporte o CSV ou imprima o PDF

Não precisa de internet após o download (exceto para carregar a fonte Google Fonts, o que é opcional).

⚠️ Versão gratuita: os dados existem apenas durante a sessão atual do navegador. Ao fechar a aba, os registros são apagados. Exporte o CSV ou imprima o PDF antes de sair.


🧪 Casos de uso testados
CenárioComportamento esperado08:00–12:00 sem intervalo4h trabalhadas (não desconta intervalo padrão)08:00–12:00–13:00–17:008h trabalhadas (desconta 1h de intervalo registrado)23:00–01:00 (virada meia-noite)2h trabalhadas + 2h de adicional noturno23:00–00:001h trabalhada + 1h09 de adicional noturno (hora reduzida)Entrada 07:00, saída intervalo 11:00, sem retorno4h trabalhadas + atraso equivalente ao restante da jornadaLançamento em domingoHE 100% automáticoFeriado cadastradoMarcado automaticamente como ocorrência "Feriado"Intrajornada < mínimo CLTColuna mostra ⚠ e resumo conta a violação

Meia-noite: use 00:00 para representar meia-noite. O sistema detecta automaticamente a virada de dia quando a saída é menor que a entrada.


📐 Regras CLT aplicadas
RegraBase legalTolerância de atraso (padrão: 10 min)Art. 58 §1º CLTHoras extrasArt. 59 CLT · Súmula 291 TSTIntervalo intrajornadaArt. 71 CLT · Súmula 437 TSTAdicional noturno (22h–05h)Art. 73 CLT · Súmula 60 TSTHora noturna reduzida (52'30'' = 1h)Art. 73 §1º CLTFaltasArt. 131 CLTAtestadosArt. 476 CLT

🗂 Estrutura
dp-ponto-certo/
├── ponto-certo.html    ← arquivo principal, tudo aqui
└── README.md

📋 Histórico de versões
v4.1

Correção do cálculo de horas: intervalo padrão não é descontado quando não há registro de saída/retorno
Suporte a virada de meia-noite (ex: 23:00–01:00)
Meio-período: entrada + saída do intervalo sem retorno gera horas trabalhadas + atraso proporcional
Adicional noturno corrigido para turnos que cruzam meia-noite
Feriados nacionais 2027 incluídos
Violações de intrajornada exibidas no resumo mensal
Domingos somados corretamente nos totais (HE 100%)

v4.0

HE personalizada com duas faixas de percentual
Coluna de intrajornada com validação CLT
Sábado habilitável com horário próprio e HE 100%
Finais de semana editáveis
Impressão PDF em paisagem A4
Sidebar colapsável com tooltips
Modo claro com cores neutras

v3.0

Popup inicial de aviso de sessão
Rodapé com botões de feedback
Simplificação da versão gratuita


🔒 Versão PRO (em desenvolvimento)

Cadastro persistente de empresas e funcionários (nuvem)
Importação de ponto via TXT/CSV de relógio eletrônico
Cálculo de DSR sobre horas extras
Espelho de ponto assinável em PDF
Login multi-usuário por escritório
Backup automático

Interesse? contato_joaomiguel@outlook.com.br

🤝 Contribuindo

Fork do repositório
git checkout -b minha-melhoria
git commit -m 'Descrição da melhoria'
git push origin minha-melhoria
Abra um Pull Request

Ou abra uma Issue com sua sugestão.

⭐ Apoie o projeto

Deixe uma estrela no GitHub ⭐
Compartilhe com outros profissionais de DP
Feedback: contato_joaomiguel@outlook.com.br


📄 Licença
Uso livre para fins profissionais e pessoais. Redistribuição permitida desde que mantidos os créditos do autor.

Desenvolvido com auxílio de inteligência artificial (Claude/Anthropic)
