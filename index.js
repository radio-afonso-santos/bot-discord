/*
  Bot para Discord da Rádio Afonso Santos
  https://github.com/radio-afonso-santos/bot-discord
 
  Uma rádio criada com ajuda do software Open Source AzuraCast
  https://azuracast.com
  https://github.com/AzuraCast/AzuraCast
 
  Afonso Santos
  http://afonsosantos.x10.mx
  https://github.com/afonsosantos
 
  Criado em 08/2019
 
  Licença: Apache-2.0
 */

/*
 *  Inclusão de pacotes do NPM
 */
const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();

// Cria o bot
const bot = new Discord.Client({ disableEveryone: true });

// Quando o bot estiver pronto (online)
bot.on('ready', async () => {
  console.log(`O bot da Rádio Afonso Santos está online!`);
  bot.user.setStatus('dnd');

  // URL da API da rádio
  const url =
    'https://painel.radio-afonsosantos.tk/api/nowplaying/radioafonsosantos';

  // 10000 ms = 10 s
  const intervalo = 15000;
  var musica;
  var dj;

  setInterval(function() {
    axios
      .get(url)
      .then(response => {
        nowPlaying = response.data;
        // Verifica se um DJ está ao vivo
        if (nowPlaying.live.is_live == true) {
          dj = nowPlaying.live.streamer_name;
          bot.user.setActivity(`${dj} ao vivo`, {
            type: 'WATCHING'
          });
          bot.user.setGame('Rádio Afonso Santos');
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
        console.error(error);
      });
  }, intervalo);
});

// Faz login na API do Discord com o bot criado acima
bot.login(process.env.BOT_TOKEN);
