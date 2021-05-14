const ms = require('ms');

exports.run = async (client, message, args) => {

    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':boom: You need to have the \`MANAGE_MESSAGES\` permissions to start giveaways.');
    }

    let giveawayChannel = message.mentions.channels.first();
    if(!giveawayChannel){
        return message.channel.send(':boom: Uh oh, I couldn\'t find that channel! Try again!');
    }

    let giveawayDuration = args[1];
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':boom: Hm. you haven\'t provided a duration. Can you try again?');
    }

    let giveawayNumberWinners = args[2];
    if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
        return message.channel.send(':boom: Uh... you haven\'t provided the amount of winners.');
    }

    let giveawayPrize = args.slice(3).join(' ');
    if(!giveawayPrize){
        return message.channel.send(':boom: Oh, it seems like you didn\'t give me a valid prize!');
    }

    client.giveawaysManager.start(giveawayChannel, {
        time: ms(giveawayDuration),
        prize: giveawayPrize,
        winnerCount: parseInt(giveawayNumberWinners),
        hostedBy: client.config.hostedBy ? message.author : null,
        messages: {
            giveaway: (client.config.everyoneMention ? "@everyone\n\n" : "")+":tada: WEŹ UDZIAŁ W KONKURSIE",
            giveawayEnded: (client.config.everyoneMention ? "@everyone\n\n" : "")+":tada: WYNIKI KONKURSU!",
            timeRemaining: "Koniec konkursu za: **{duration}**!",
            inviteToParticipate: "Zareaguj pod postem, emoji 🎉 aby wziąć udział.",
            winMessage: "Gratulację, {winners} wygrałeś **{prize}**.",
            embedFooter: "Konkurs",
            noWinner: "Nikt nie wygrał, no cóż.",
            hostedBy: "Konkurs stworzony przez {user}",
            winners: "Zwyciężca/y: ",
            endedAt: "Koniec o godzinie ",
            units: {
                seconds: "sekund",
                minutes: "minut",
                hours: "godzin",
                days: "dni",
                pluralS: false
            }
        }
    });

    message.channel.send(`:tada: Done! The giveaway for the \`${giveawayPrize}\` is starting in ${giveawayChannel}!`);

};
