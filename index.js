const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});


client.on('messageCreate', async message => {
  if (message.content === '$معلومات') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('قائمة المعلومات')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#f8ca3d')
        .setThumbnail('https://media.discordapp.net/attachments/1236395855855226890/1240636315049922631/rfty.png?ex=6647481b&is=6645f69b&hm=c3920523617507a50a0fc12cdd1892b58bb962513917343583d52789a83ff88b&=&format=webp&quality=lossless&width=662&height=435')
        .setTitle('معلومات السيرفر')
        .setDescription('**الرجاء اختيار احد المعلومات لقرائته من قائمة الاختيارات تحت**')
        .setImage('https://media.discordapp.net/attachments/1236395855855226890/1240707084362842172/011011.png?ex=66478a04&is=66463884&hm=eb9f02bea5fa78dd9fa8d902e7209053b4ffc2a34653b88e681e524304f7fce8&=&format=webp&quality=lossless&width=504&height=356')
        .setFooter({ text: 'ELITE INFO' })
        .setTimestamp();

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#f8ca3d')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: 'ELITE INFO' })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
