/*
  Bot para Discord da Rádio Afonso Santos
  https://github.com/radio-afonso-santos/bot-discord
 
  Uma rádio criada com ajuda do software Open Source AzuraCast
  https://azuracast.com
  https://github.com/AzuraCast/AzuraCast
 
  Afonso Santos
  http://afonsosantos-dev.tk
  https://github.com/afonsosantos
 
  Criado em 08/2019
 
  Licença: Apache-2.0
 */

/*
 *  PACOTES NPM
 */

const Client = require('discord.js');
const axios = require('axios');
const chalk = require('chalk');
require('dotenv').config();

/*
 *  VARIÁVEIS
 */

const url = 'https://painel.radio-afonsosantos.tk/api/nowplaying_static/radioafonsosantos.json';
var musica;
var dj;
const intervalo = 15000; // 15000 ms = 15 s

/*
 *  INCIALIZAÇÃO DO BOT (cliente)
 */
const bot = new Client({ disableEveryone: true });

/*
 *  QUANDO O BOT ESTIVER ONLINE
 */
bot.on('ready', async => {
  // Informa que o bot está online
  console.log(chalk.blue('SUCESSO'), 'O bot da Rádio Afonso Santos está online!');

  /*
   *  OBTÉM OS DADOS DA API E ATUALIZA A PRESENÇA
   */

  setInterval(function() {
    axios
      .get(url)
      .then(response => {
        nowPlaying = response.data;
        // Verifica se um DJ está ao vivo
        if (nowPlaying.live.is_live == true) {
          // DJ ao Vivo - Obtém o nome do DJ
          // Nome do DJ ao vivo
          dj = nowPlaying.live.streamer_name;
          bot.user.setActivity(`${dj} ao vivo`, {
            type: 'WATCHING'
          });
        } else {
          // Transmissão Normal - Obtém o que está a tocar
          // Artista - Título da Música
          musica = nowPlaying.now_playing.song.text;
          bot.user.setActivity(musica, {
            type: 'LISTENING'
          });
        }
      })
      .catch(error => {
        // Mostra o erro na consola
        console.error(chalk.redBright('ERRO'), error);
      });
  }, intervalo);
});

/*
 *  CADA VEZ QUE UM MEMBRO ENTRA NO SERVIDOR
 */
client.on('guildMemberAdd', member => {
  // Procura o canal para onde enviar a mensagem
  const channel = member.guild.channels.find(ch => ch.name === 'geral');

  // Caso o canal não seja encontrado, sai
  if (!channel) return;

  // Envia a mensagem para o servidor e para a consola
  channel.send(`**Bem-vindo ao servidor da Rádio Afonso Santos**, ${member}`);
  console.log(chalk.green('NOVO MEMBRO'), `Um novo membro juntou-se ao servidor (${member})`);
});

/*
 *  LOGIN DO BOT NA API DO DISCORD
 */
bot.login(process.env.BOT_TOKEN);
