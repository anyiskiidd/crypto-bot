const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');

const token = 'yourtokenguy';
const PREFIX = '!';

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const command = message.content.slice(PREFIX.length).trim().split(' ')[0].toLowerCase();
  const args = message.content.slice(PREFIX.length + command.length).trim().split(' ');

  if (command === 'crypto') {
    const symbol = args[0] ? args[0].toUpperCase() : null;

    if (!symbol) {
      return message.channel.send('Veuillez fournir un symbole de crypto-monnaie valide, par exemple : `!crypto BTC`');
    }

    try {
      const responsePrice = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd,eur`);
      const price = responsePrice.data[symbol.toLowerCase()];

      if (!price) {
        return message.channel.send(`Symbole de crypto-monnaie introuvable. Assurez-vous d'utiliser un symbole valide. 😕\nSi vous rencontrez des problèmes, vous pouvez consulter le site [CoinGecko](https://www.coingecko.com/) pour plus d'informations.`);
      }

      const responseInfo = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}`);
      const fullName = responseInfo.data.name;

      const embed = new MessageEmbed()
        .setTitle(`Prix de ${fullName} (${symbol})`)
        .setDescription(`Le prix actuel de ${fullName} (${symbol}) est de ${price.usd} USD 💵 et ${price.eur} EUR 💶.`)
        .setColor('#0099ff');

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.channel.send("Une erreur s'est produite lors de la récupération des données. Veuillez réessayer plus tard. 😢\nSi vous rencontrez des problèmes, vous pouvez consulter le site [CoinGecko](https://www.coingecko.com/) pour plus d'informations.");
    }
  } else if (command === 'help') {
    const embed = new MessageEmbed()
      .setTitle('Commandes du bot Crypto')
      .setDescription('Voici la liste des commandes disponibles pour le bot Crypto :')
      .addField('!crypto [symbole]', 'Affiche le prix actuel de la crypto-monnaie spécifiée en USD et EUR. Exemple : `!crypto BTC`')
      .addField('!help', 'Affiche la liste des commandes disponibles pour le bot Crypto.')
      .setColor('#0099ff');

    message.channel.send({ embeds: [embed] });
  }
});

client.login(token);
