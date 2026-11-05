# Login, pedidos e celular — Jeffe Painting LLC

## Uso

- O site em execução é este repositório, não a pasta separada Site para venda.
- Clientes enviam o formulário de contato sem login. O pedido é salvo e o pop-up de sucesso aparece somente após a confirmação do servidor.
- O proprietário entra pelo botão Owner login ou por `/login`. O painel fica em `/owner`.
- O usuário Jef e o hash da senha solicitada foram configurados apenas no `.env.local` local, ignorado pelo Git.
- O painel contém todos os campos enviados, leitura, paginação, atualização automática e controles de notificações.

## Teste na rede local

Com telefone e PC no mesmo Wi-Fi, mantenha `npm run dev -- --hostname 0.0.0.0` em execução e abra `http://192.168.4.197:3000/login` no telefone. Se o IP do PC mudar, ajuste `NEXT_PUBLIC_SITE_URL` e a lista exata `OWNER_DEV_ORIGINS` em `.env.local` e reinicie o servidor. A lista extra de origens só funciona em desenvolvimento; produção mantém a origem configurada estritamente.

O formulário anterior só abria um link mailto. A versão atual usa `/api/quote`, valida os campos e salva os pedidos em SQLite. Ela não depende de um aplicativo de e-mail instalado.

## Notificações no celular

Web Push precisa de HTTPS (exceto localhost no próprio computador). O endereço HTTP da rede local serve para testar páginas, login e pedidos, mas não habilita push no telefone.

Depois de publicar em HTTPS: Android → menu do navegador → Instalar aplicativo; iPhone/iPad → Safari → Compartilhar → Adicionar à Tela de Início (iOS/iPadOS 16.4+). Abra o ícone instalado, entre novamente se necessário, toque em Ativar notificações e permita os avisos. Instalar sozinho não concede permissão. Use Testar notificação no painel.

A notificação contém um resumo do pedido; toque para consultar os detalhes completos no painel autenticado. O sistema do aparelho pode atrasar/ocultar avisos e exibir detalhes na tela bloqueada. Sair revoga a sessão e a inscrição do aparelho atual. O painel também permite desativar todos os aparelhos. Sessões duram 30 dias; mudar o hash da senha invalida sessões antigas.

## Hospedagem

Use Node 24+, HTTPS e um volume persistente. Não hospede esta versão como site estático nem use SQLite em disco efêmero. Configure privadamente as variáveis de `.env.example`: usuário, hash scrypt, diretório de dados, chaves VAPID estáveis, contato VAPID e token de retry. Nunca publique `.env.local` nem o banco.

Execute `npm start` após `npm run build`. Para novas tentativas de push, execute `npm run push:worker` supervisionado ao lado do servidor ou agende POST em `/api/owner/push/retry` com Authorization Bearer usando o segredo privado. `npm run push:worker -- --once` verifica uma execução da fila.

Os pedidos e os jobs de notificação são salvos na mesma transação. Falha de push não apaga pedidos. Aparelhos expirados são removidos e falhas transitórias ficam na fila. Pedidos recebidos antes de haver aparelho inscrito permanecem no painel. Faça backup consistente do SQLite; mantenha uma réplica do servidor para esta implementação e migre para banco compartilhado antes de escalar entre máquinas.

Revise a política de privacidade da empresa para incluir armazenamento dos pedidos, retenção, sessões e os provedores de push. A automação de navegador e o recebimento em celular físico ainda precisam ser verificados; testes HTTP não comprovam entrega visual de notificações.

## Arquivos e validação

`src/components/estimate-form.tsx`: substitui mailto por envio validado, preserva erros e mostra o pop-up.

`src/app/login`, `src/app/owner`, `src/app/api/owner`, `src/lib/owner`: acesso e gestão dos pedidos.

`src/app/api/quote`, `src/lib/validation/estimate.ts`: entrada pública e validação.

`public/sw.js`, `src/app/manifest.ts`, `public/icons`: instalação e push.

Execute `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build`. O script `scripts/qa-local.mjs` lê a senha por stdin e verifica o fluxo HTTP na rede local. Use-o só com banco de teste: cria um pedido fictício e o remove ao concluir.

Durante testes por IP, PUSH_RETRY_ORIGIN=http://localhost:3000 permite que o worker acesse o servidor localmente. Em produ��o, use HTTPS ou a origem interna confi�vel do pr�prio servidor.


## Teste HTTPS tempor?rio autorizado

A sess?o ativa e os identificadores dos processos ficam em `.local-data/https-preview.json` (ignorado pelo Git). O link usa Cloudflare Quick Tunnel e uma inst?ncia de produ??o em 127.0.0.1:3001, com worker de retry em segundo plano. O site local de desenvolvimento na porta 3000 continua separado. Mantenha o PC e esses processos ligados; o endere?o pode mudar se o t?nel for recriado. N?o ? uma hospedagem permanente.

Instale o app a partir do novo endere?o HTTPS, entre como propriet?rio e permita as notifica??es. Um atalho antigo para o IP HTTP n?o ganha suporte a push automaticamente. O recebimento precisa ser confirmado com o bot?o de teste no aparelho.

O modal usa posicionamento fixo, inset zero e margem autom?tica para centrar no viewport, com limite de altura e rolagem em telas pequenas. As verifica??es HTTP confirmaram o CSS atualizado; inspe??o visual automatizada permaneceu indispon?vel.
