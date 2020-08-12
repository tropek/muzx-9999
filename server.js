const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://mrcbotfo.glitch.me/`);
}, 280000);

//const {YT_API_KEY, prefix, devs} = require('./config')
//كل البكجات الي ممكن تحتجها في اي بوت
const { Client, RichEmbed, Collection } = require("discord.js");
var { Util } = require("discord.js");
const { prefix } = require("./config");
const client = new Client({ disableEveryone: true });
const ytdl = require("ytdl-core");
const canvas = require("canvas");
const Canvas = require("canvas");
const convert = require("hh-mm-ss");
const fetchVideoInfo = require("youtube-info");
const botversion = require("./package.json").version;
const simpleytapi = require("simple-youtube-api");
const moment = require("moment");
const fs = require("fs");
const util = require("util");
const gif = require("gif-search");
const ms = require("ms");
const jimp = require("jimp");
const { get } = require("snekfetch");
const guild = require("guild");
const dateFormat = require("dateformat"); //npm i dateformat
const YouTube = require("simple-youtube-api");
const youtube = new YouTube("AIzaSyCzQMe3gNTKxj9-_1yT-XH1pORItohcNJg");
const hastebins = require("hastebin-gen");
const getYoutubeID = require("get-youtube-id");
const yt_api_key = "AIzaSyCzQMe3gNTKxj9-_1yT-XH1pORItohcNJg";
const pretty = require("pretty-ms");
client.login(process.env.BOT_TOKEN);
const queue = new Map();
var table = require("table").table;
const Discord = require("discord.js");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot Is Ready`);
  console.log(`Im ready u can use me`);
  console.log(`${prefix}help`);
  console.log(`${prefix}invite`);
  console.log(`Hi m7md`);
  console.log("server :", `${client.guilds.size}`);

  client.user.setStatus("online");
  client.user.setGame(`${prefix}help | ${prefix}invite`);
});

//كود للتجربة
const developers = [
  "629506454822453258",
  "629506454822453258",
  "629506454822453258",
  "629506454822453258"
];
const adminprefix = "!";
client.on("message", message => {
  var argresult = message.content
    .split(` `)
    .slice(1)
    .join(" ");
  if (!developers.includes(message.author.id)) return;

  if (message.content.startsWith(adminprefix + "pl")) {
    client.user.setGame(argresult);
    message.channel.send(
      "**:white_check_mark: | The Playing Status Has Been Changed To : ``" +
        `${argresult}` +
        "``**"
    );
  } else if (message.content.startsWith(adminprefix + "wt")) {
    client.user.setActivity(argresult, { type: "WATCHING" });
    message.channel.send(
      "**:white_check_mark: | The Watching Status Has Been Changed To : ``" +
        `${argresult}` +
        "``**"
    );
  } else if (message.content.startsWith(adminprefix + "ls")) {
    client.user.setActivity(argresult, { type: "LISTENING" });
    ("");
    message.channel.send(
      "**:white_check_mark: | The Listening Status Has Been Changed To : ``" +
        `${argresult}` +
        "``**"
    );
  } else if (message.content.startsWith(adminprefix + "st")) {
    client.user.setGame(argresult, "https://www.twitch.tv/zzayplayss");
    message.channel.send(
      "**:white_check_mark: | The Streaming Status Has Been Changed To : ``" +
        `${argresult}` +
        "``**"
    );
  }
  if (message.content.startsWith(adminprefix + "setname")) {
    client.user.setUsername(argresult).then;
    message.channel.send(`Changing The Name To ..**${argresult}** `);
  } else if (message.content.startsWith(adminprefix + "setavatar")) {
    client.user.setAvatar(argresult);
    message.channel.send(`Changing The Avatar To :**${argresult}** `);
  }
});

let cmds = {
  play: { cmd: "play", a: ["p", "شغل"] },
  skip: { cmd: "skip", a: ["sk", "تخطى"] },
  stop: { cmd: "stop", a: ["ايقاف", "st"] },
  pause: { cmd: "pause", a: ["ايقاف مؤقت"] },
  resume: { cmd: "resume", a: ["r", "كمل"] },
  volume: { cmd: "volume", a: ["vol", "صوت"] },
  queue: { cmd: "queue", a: ["q", "قائمة"] },
  repeat: { cmd: "repeat", a: ["re", "تكرار"] },
  forceskip: { cmd: "forceskip", a: ["تخطي الكل", "fskip"] },
  skipto: { cmd: "skipto", a: ["st", "اذهب الى"] },
  nowplaying: { cmd: "Nowplaying", a: ["np", "الان"] }
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

Object.keys(cmds).forEach(key => {
  var value = cmds[key];
  var command = value.cmd;
  client.commands.set(command, command);

  if (value.a) {
    value.a.forEach(alias => {
      client.aliases.set(alias, command);
    });
  }
});

let active = new Map();

client.on("warn", console.warn);

client.on("error", console.error);

client.on("message", async msg => {
  if (msg.author.bot) return undefined;
  if (!msg.content.startsWith(prefix)) return undefined;

  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";

  let cmd =
    client.commands.get(command) ||
    client.commands.get(client.aliases.get(command));

  let s;

  if (cmd === "play") {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel)
      return msg.channel.send(
        `:no_entry_sign: You must be listening in a voice channel to use that!`
      );
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT")) {
      return msg.channel.send(
        `:no_entry_sign: I can't join Your voiceChannel because i don't have ` +
          "`" +
          "`CONNECT`" +
          "`" +
          ` permission!`
      );
    }

    if (!permissions.has("SPEAK")) {
      return msg.channel.send(
        `:no_entry_sign: I can't SPEAK in your voiceChannel because i don't have ` +
          "`" +
          "`SPEAK`" +
          "`" +
          ` permission!`
      );
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();

      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel.send(`Added to queue: ${playlist.title}`);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(args, 1);

          // eslint-disable-next-line max-depth
          var video = await youtube.getVideoByID(videos[0].id);
        } catch (err) {
          console.error(err);
          return msg.channel.send("I can't find any thing");
        }
      }

      return handleVideo(video, msg, voiceChannel);
    }

    async function handleVideo(video, msg, voiceChannel, playlist = false) {
      const serverQueue = active.get(msg.guild.id);

      //	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));

      let hrs =
        video.duration.hours > 0
          ? video.duration.hours > 9
            ? `${video.duration.hours}:`
            : `0${video.duration.hours}:`
          : "";
      let min =
        video.duration.minutes > 9
          ? `${video.duration.minutes}:`
          : `0${video.duration.minutes}:`;
      let sec =
        video.duration.seconds > 9
          ? `${video.duration.seconds}`
          : `0${video.duration.seconds}`;
      let dur = `${hrs}${min}${sec}`;

      let ms = video.durationSeconds * 1000;

      const song = {
        id: video.id,
        title: video.title,
        duration: dur,
        msDur: ms,
        url: `https://www.youtube.com/watch?v=${video.id}`
      };
      if (!serverQueue) {
        const queueConstruct = {
          textChannel: msg.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [], ////تعديل غير اساسي
          volume: 100, //// تعديل درجة الصوت الاساسية
          requester: msg.author,
          playing: true,
          repeating: false
        };
        active.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueConstruct.connection = connection;
          play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
          console.error(`I could not join the voice channel: ${error}`);
          active.delete(msg.guild.id);
          return msg.channel.send(`I cant join this voice channel`);
        }
      } else {
        serverQueue.songs.push(song);

        if (playlist) return undefined;
        if (!args) return msg.channel.send("no results.");
        else
          return msg.channel
            .send(":watch: Loading... [`" + args + "`]")
            .then(m => {
              setTimeout(() => {
                //:watch: Loading... [let]
                m.edit(
                  `:notes: Added **${song.title}**` +
                    "(` " +
                    song.duration +
                    ")`" +
                    ` to the queue at position ` +
                    `${serverQueue.songs.length}`
                );
              }, 500);
            });
      }
      return undefined;
    }

    function play(guild, song) {
      const serverQueue = active.get(guild.id);

      if (!song) {
        serverQueue.voiceChannel.leave();
        active.delete(guild.id);
        return;
      }
      //console.log(serverQueue.songs);
      if (serverQueue.repeating) {
        console.log("Repeating");
      } else {
        serverQueue.textChannel.send(
          ":notes: Added **" +
            song.title +
            "** (`" +
            song.duration +
            "`) to begin playing."
        );
      }
      const dispatcher = serverQueue.connection
        .playStream(ytdl(song.url))
        .on("end", reason => {
          //if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
          //else console.log(reason);
          if (serverQueue.repeating) return play(guild, serverQueue.songs[0]);
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    }
  } else if (cmd === "stop") {
    if (msg.guild.me.voiceChannel !== msg.member.voiceChannel)
      return msg.channel.send(
        `You must be in ${msg.guild.me.voiceChannel.name}`
      );
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      msg.react("❌");
      return msg.channel.send("You don't have permission `ADMINSTRATOR`");
    }
    let queue = active.get(msg.guild.id);
    if (queue.repeating)
      return msg.channel.send(
        "Repeating Mode is on, you can't stop the music, run `" +
          `${prefix}repeat` +
          "` to turn off it."
      );
    queue.songs = [];
    queue.connection.dispatcher.end();
    return msg.channel.send(
      ":notes: The player has stopped and the queue has been cleared."
    );
  } else if (cmd === "skip") {
    let vCh = msg.member.voiceChannel;

    let queue = active.get(msg.guild.id);

    if (!vCh)
      return msg.channel.send(
        "Sorry, but you can't because you are not in voice channel"
      );

    if (!queue) return msg.channel.send("No music playing to skip it");

    if (queue.repeating)
      return msg.channel.send(
        "You can't skip it, because repeating mode is on, run " +
          `\`${prefix}forceskip\``
      );

    let req = vCh.members.size - 1;

    if (req == 1) {
      msg.channel.send("**:notes: Skipped **" + args);
      return queue.connection.dispatcher.end("Skipping ..");
    }

    if (!queue.votes) queue.votes = [];

    if (queue.votes.includes(msg.member.id))
      return msg.say(
        `You already voted for skip! ${queue.votes.length}/${req}`
      );

    queue.votes.push(msg.member.id);

    if (queue.votes.length >= req) {
      msg.channel.send("**:notes: Skipped **" + args);

      delete queue.votes;

      return queue.connection.dispatcher.end("Skipping ..");
    }

    msg.channel.send(
      `**You have successfully voted for skip! ${queue.votes.length}/${req}**`
    );
  } else if (cmd === "pause") {
    let queue = active.get(msg.guild.id);

    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send(`You are not in my voice channel.`);

    if (!queue) {
      return msg.channel.send("No music playing to pause.");
    }

    if (!queue.playing)
      return msg.channel.send(
        ":no_entry_sign: There must be music playing to use that!"
      );

    let disp = queue.connection.dispatcher;

    disp.pause("Pausing..");

    queue.playing = false;

    msg.channel.send(
      ":notes: Paused " + args + ". **Type** `" + prefix + "resume` to unpause!"
    );
  } else if (cmd === "resume") {
    let queue = active.get(msg.guild.id);

    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send(`You are not in my voice channel.`);

    if (!queue) return msg.channel.send(":notes: No music paused to resume.");

    if (queue.playing)
      return msg.channel.send(":notes: No music paused to resume.");

    let disp = queue.connection.dispatcher;

    disp.resume("Resuming..");

    queue.playing = true;

    msg.channel.send(":notes: Resumed.");
  } else if (cmd === "volume") {
    let queue = active.get(msg.guild.id);

    if (!queue || !queue.songs)
      return msg.channel.send(
        ":notes: There is no music playing to set volume."
      );

    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send(":notes: You are not in my voice channel");

    let disp = queue.connection.dispatcher;

    if (isNaN(args[0])) return msg.channel.send(":notes: Numbers only!");

    if (parseInt(args[0]) > 100)
      return msg.channel.send("You can't set the volume more than **100**.");
    //:speaker: Volume changed from 20 to 20 ! The volume has been changed from ${queue.volume} to ${args[0]}
    msg.channel.send(
      ":loud_sound: Volume has been **changed** from (`" +
        queue.volume +
        "`) to (`" +
        args[0] +
        "`)"
    );

    queue.volume = args[0];

    disp.setVolumeLogarithmic(queue.volume / 100);
  } else if (cmd === "queue") {
    let queue = active.get(msg.guild.id);

    if (!queue)
      return msg.channel.send(
        ":no_entry_sign: There must be music playing to use that!"
      );

    let embed = new Discord.RichEmbed().setAuthor(
      `${client.user.username}`,
      client.user.displayAvatarURL
    );
    let text = "";

    for (var i = 0; i < queue.songs.length; i++) {
      let num;
      if (i > 8) {
        let st = `${i + 1}`;
        let n1 = converter.toWords(st[0]);
        let n2 = converter.toWords(st[1]);
        num = `:${n1}::${n2}:`;
      } else {
        let n = converter.toWords(i + 1);
        num = `:${n}:`;
      }
      text += `${num} ${queue.songs[i].title} [${queue.songs[i].duration}]\n`;
    }
    embed.setDescription(`Songs Queue | ${msg.guild.name}\n\n ${text}`);
    msg.channel.send(embed);
  } else if (cmd === "repeat") {
    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send("You are not in my voice channel");

    let queue = active.get(msg.guild.id);

    if (!queue || !queue.songs)
      return msg.channel.send("There is no music playing to repeat it.");

    if (queue.repeating) {
      queue.repeating = false;
      return msg.channel.send(
        ":arrows_counterclockwise: **Repeating Mode** (`False`)"
      );
    } else {
      queue.repeating = true;
      return msg.channel.send(
        ":arrows_counterclockwise: **Repeating Mode** (`True`)"
      );
    }
  } else if (cmd === "forceskip") {
    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send("You are not in my voice channel");

    let queue = active.get(msg.guild.id);

    if (queue.repeating) {
      queue.repeating = false;

      msg.channel.send("ForceSkipped, Repeating mode is on.");

      queue.connection.dispatcher.end("ForceSkipping..");

      queue.repeating = true;
    } else {
      queue.connection.dispatcher.end("ForceSkipping..");

      msg.channel.send("ForceSkipped.");
    }
  } else if (cmd === "skipto") {
    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send("You are not in my voice channel");

    let queue = active.get(msg.guild.id);

    if (!queue.songs || queue.songs < 2)
      return msg.channel.send("There is no music to skip to.");

    if (queue.repeating)
      return msg.channel.send(
        "You can't skip, because repeating mode is on, run " +
          `\`${prefix}repeat\` to turn off.`
      );

    if (!args[0] || isNaN(args[0]))
      return msg.channel.send(
        "Please input song number to skip to it, run " +
          prefix +
          `queue` +
          " to see songs numbers."
      );

    let sN = parseInt(args[0]) - 1;

    if (!queue.songs[sN])
      return msg.channel.send("There is no song with this number.");

    let i = 1;

    msg.channel.send(
      `Skipped to: **${queue.songs[sN].title}[${queue.songs[sN].duration}]**`
    );

    while (i < sN) {
      i++;
      queue.songs.shift();
    }

    queue.connection.dispatcher.end("SkippingTo..");
  } else if (cmd === "Nowplaying") {
    let q = active.get(msg.guild.id);

    let now = npMsg(q);

    msg.channel.send(now.mes, now.embed).then(me => {
      setInterval(() => {
        let noww = npMsg(q);
        me.edit(noww.mes, noww.embed);
      }, 5000);
    });

    function npMsg(queue) {
      let m =
        !queue || !queue.songs[0] ? "No music playing." : "Now Playing...";

      const eb = new Discord.RichEmbed();

      eb.setColor(msg.guild.me.displayHexColor);

      if (!queue || !queue.songs[0]) {
        eb.setTitle("No music playing");
        eb.setDescription(
          "\u23F9 " + bar(-1) + " " + volumeIcon(!queue ? 100 : queue.volume)
        );
      } else if (queue.songs) {
        if (queue.requester) {
          let u = msg.guild.members.get(queue.requester.id);

          if (!u) eb.setAuthor("Unkown (ID:" + queue.requester.id + ")");
          else eb.setAuthor(u.user.tag, u.user.displayAvatarURL);
        }

        if (queue.songs[0]) {
          try {
            eb.setTitle(queue.songs[0].title);
            eb.setURL(queue.songs[0].url);
          } catch (e) {
            eb.setTitle(queue.songs[0].title);
          }
        }
        eb.setDescription(embedFormat(queue));
      }

      return {
        mes: m,
        embed: eb
      };
    }

    function embedFormat(queue) {
      if (!queue || !queue.songs) {
        return "No music playing\n\u23F9 " + bar(-1) + " " + volumeIcon(100);
      } else if (!queue.playing) {
        return (
          "No music playing\n\u23F9 " + bar(-1) + " " + volumeIcon(queue.volume)
        );
      } else {
        let progress = queue.connection.dispatcher.time / queue.songs[0].msDur;
        let prog = bar(progress);
        let volIcon = volumeIcon(queue.volume);
        let playIcon = queue.connection.dispatcher.paused ? "\u23F8" : "\u25B6";
        let dura = queue.songs[0].duration;

        return (
          playIcon +
          " " +
          prog +
          " `[" +
          formatTime(queue.connection.dispatcher.time) +
          "/" +
          dura +
          "]`" +
          volIcon
        );
      }
    }

    function formatTime(duration) {
      var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      return (hours > 0 ? hours + ":" : "") + minutes + ":" + seconds;
    }

    function bar(precent) {
      var str = "";

      for (var i = 0; i < 12; i++) {
        let pre = precent;
        let res = pre * 12;

        res = parseInt(res);

        if (i == res) {
          str += "\uD83D\uDD18";
        } else {
          str += "▬";
        }
      }

      return str;
    }

    function volumeIcon(volume) {
      if (volume == 0) return "\uD83D\uDD07";
      if (volume < 30) return "\uD83D\uDD08";
      if (volume < 70) return "\uD83D\uDD09";
      return "\uD83D\uDD0A";
    }
  }
});

client.on("message", msg => {
  if (!msg.channel.guild) return;
  if (msg.content.startsWith(prefix + "help")) {
    msg.author
      .send(
        `
 
>   **Bot Prefix** < **${prefix}** >
>   **${prefix}play • لــــتــــشــــغــــيــــل اغــــاـنــــي **
>   **${prefix}skip • لــــتــــخــــطــــي الاغــــنــــيــــة **
>   **${prefix}stop • لايــــقــــاف الاغــــنــــيــــة **
>   **${prefix}pause • لايــــقــــاف الاغــــنــــيــــة مــــوئــــقــــتــــا **
>   **${prefix}resume • لــــرجــــوع الــــى الاغــــنــــيــــة **
>   **${prefix}volume • لــــتــــغــــيــــيــــر الصــــوت **
>   **${prefix}queue • لاضــــهــــار القائــــمــــة **
>   **${prefix}repeat • لــــوضــــع الــــتــــكــــراـر **
>   **${prefix}forceskip • لــــتــــخـــطـــي  اغـــنـــيـــة فــــــي حــــــالــــــة تــــــكــــــرار **
>   **${prefix}skipto • لــــتــخــــطــــي الــــى **
>   **${prefix}np • لــــعــــرض مــــايــــتــــم ســــمــــاعــــه **
>   **${prefix}server • لــــعــــرض مــــعــــلــــومــــات عـــن الــــســــيــــرفــــر **
>   **${prefix}user • لــــعــــرض مــــعــــلــــومــــات عــــن حــــســــابك **
>   **${prefix}avatar •  لاضــــهــــار افــــتــــار **
>   **${prefix}emojis • لاضــــهــــار ايــــمــــوجــــيــــات الــــمــــوجــــودة بالــــســــيــــرفــــر **
`
      )
      .then(e => {
        msg.react("🎶");
      })
      .catch(() => {
        return msg
          .reply(
            "**يجب السماح بأستقبال الرسائل في الخاص ، لأتمكن من ارسال الاوامر لك **"
          )
          .then(() => {
            return msg.react("❌");
          });
      });
  }
});

client.on("message", msg => {
  if (msg.content.startsWith(prefix + "invite")) {
    msg.author.send(
      `https://discord.com/api/oauth2/authorize?client_id=734533547863572530&permissions=66345792&scope=bot`
    );
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "invite")) {
    let embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setColor("#9B59B6")
      .addField(" Done | تــــم", " |  تــــم ارســالك في الخــاص");

    message.channel.sendEmbed(embed);
  }
});
client.on("message", msg => {
  if (msg.content === prefix + "leave") {
    msg.guild.leave();
  }
  if (msg.content === prefix + "leave") {
    msg.guild.owner.send("شكرا لاستعمال البوت ❤️");
  }
});

const os = require("os");
client.on("message", message => {
  let totalDMs = client.channels.filter(function(s) {
    if (s.type && s.type === "dm") {
      return true;
    }
    return false;
  });

  let totalTextChannels = client.channels.filter(function(s) {
    if (s.type && s.type === "text") {
      return true;
    }
    return false;
  });

  let cpu = os.cpus();
  let cpuArray = cpu[0].model
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
  let cpuCores = cpu.length;
  if (
    message.content.startsWith(prefix + "stats") ||
    message.content.startsWith(prefix + "bot")
  ) {
    message.channel.send({
      embed: new Discord.RichEmbed()
        .setColor("#36393e")
        .setTitle("  | Bot Information | ")
        .addField("»| Server |:", `${client.guilds.size}`, true)
        .addField("» | Channels| :", `${client.channels.size}`, true)
        .addField("» |User | :", `${client.users.size}`, true)
        .addField("»|Name |:", `<@${client.user.id}>`, true)
        .addField("»|Bot Owner| :  ", `» <@689877337856016410>`, true)
        .addField(
          "»| Bot Ping| : ",
          ` » ${Date.now() - message.createdTimestamp} ` +
            " ms" +
            ":signal_strength:",
          true
        )
        .setThumbnail(message.author.avatarURL)
    });
  }
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.isMentioned(client.user)) {
    message.channel.send(
      "> **my prefix is **`" +
        `${prefix}` +
        "`" +
        "\n" +
        "> `" +
        `${prefix}` +
        "help`"
    );
  }
});

client.on("guildMemberAdd", member => {
  let id = member.user.id;
  let m = member.user;
  const addserver =
    "https://discord.com/api/oauth2/authorize?client_id=734533547863572530&permissions=66345792&scope=bot";
  const SUPPORT = "https://discord.gg/f7vPBTC";
  var embed = new Discord.RichEmbed()
    .setAuthor(member.user.username, member.user.avatarURL)
    .setThumbnail(m.avatarURL)
    .setColor("RANDOM")
    .setFooter(
      `==== نــتــمــنــآ لــكــم آســتــمـــتــآع ====`,
      "https://cdn.discordapp.com/avatars/678517905150836757/a_7c5a6b0118fc41e068df890cc5c56f34.gif?size=1024"
    )
    .setTitle(`**ولكم نورت السيرفر **`)
    .addField("**__اسم العضو__**", `<@${id}>`)
    .addField(" **__Welcome To Server__**", `**${member.guild.name}**`)
    .addField("**__انت العضو__** ", `${member.guild.memberCount} `)
    .addField(
      "__انضم للسيرفر__",
      moment(member.joinedAt).format("D/M/YYYY h:mm a ")
    )
    .setDescription(
      `**[Add To Your Server ](${addserver})** | **[ Server Support](${SUPPORT})**`
    );
  member.send(embed);
});

client.on("message", msg => {
  var command = "sup";
  if (msg.content.startsWith(prefix + command)) {
    msg.author.send("https://discord.gg/f7vPBTC");
  }
});

client.on("message", message => {
  if (message.content === prefix + "listbot") {
    var list_all = [];
    message.guild.members.forEach(bb => {
      if (!bb.user.bot) return;
      list_all.push(`<@${bb.user.id}>`);
    });
    message.channel.send(list_all.join(", "));
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "rank")) {
    const roles = message.guild.roles
      .map(m => `${m.name}         members: ${m.members.size}`)
      .join(" " + "\n");
    return message.channel.send("```" + `${roles}` + "```");
  }
});

client.on("message", function(msg) {
  if (msg.content.startsWith(prefix + "server")) {
    var online = msg.guild.members.filter(o => o.presence.status == "online")
      .size;
    var dnd = msg.guild.members.filter(d => d.presence.status == "dnd").size;
    var idle = msg.guild.members.filter(i => i.presence.status == "idle").size;
    var onaa = online + dnd + idle;
    var chte = msg.guild.channels.filter(m => m.type === "text").size;
    var chvo = msg.guild.channels.filter(m => m.type === "voice").size;
    var toch = chte + chvo;
    if (!msg.channel.guild) return msg.reply("الامر للسيرفرات");
    let embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setThumbnail(msg.guild.iconURL)
      .setTitle(`Showing Details Of  **${msg.guild.name}**`)
      .addField("🌐** نوع السيرفر**", `[** __${msg.guild.region}__ **]`, true)
      .addField("🏅** __الرتب__**", `[** __${msg.guild.roles.size}__ **]`, true)
      .addField(
        "🔴**__ عدد الاعضاء__**",
        `[** __${msg.guild.memberCount}__ **]`,
        true
      )
      .addField(
        ":green_circle:**عدد الاعضاء المتواجديد **",
        `**[__${onaa}__]**`,
        true
      )
      .addField("**عدد الاعضاء الاون لاين**", `**[__${online}__]** `, true)
      .addField("**عدد الاعضاء في حالة الخمول**", `**[__${idle}__]**`, true)
      .addField("**عدد الاعضاء في حالة DND**", `**[__${dnd}__]**`, true)
      .addField(
        "Bots: ",
        `[**__${msg.guild.members.filter(member => member.user.bot).size}__**]`,
        true
      )
      .addField("**الرومات**", `[** __${toch}__** ]`, true)
      .addField(
        "📝**__ الرومات الكتابية__**",
        `[** __${msg.guild.channels.filter(m => m.type === "text").size}__** ]`,
        true
      )
      .addField(
        "🎤**__ رومات الصوت__**",
        `[** __${
          msg.guild.channels.filter(m => m.type === "voice").size
        }__ **]`,
        true
      )
      .addField("👑**__ الأونـر__**", `**${msg.guild.owner}**`, true)
      .addField("🆔**__ ايدي السيرفر__**", `**${msg.guild.id}**`, true)
      .addField(
        "📅**__ تم عمل السيرفر في__**",
        msg.guild.createdAt.toLocaleString()
      );
    msg.channel.send({ embed: embed });
  }
});

client.on("message", msg => {
  if (!developers.includes(msg.author.id)) return;
  if (msg.content.startsWith(adminprefix + "ar-rules")) {
    let embed = new Discord.RichEmbed()
      .setTitle("مرحباً بك في سيرفر  MRC ، رجاءًا قم بقراءه القوانين بعنايه..")
      .setThumbnail("https://cdn.probot.io/KzPK8moOyC.png")
      .setFooter(
        `وشكرا`,
        "https://cdn.discordapp.com/avatars/678517905150836757/a_7c5a6b0118fc41e068df890cc5c56f34.gif?size=1024"
      ).setDescription(`
1 - لا تمنشن الإدارة ، فهذا يعتبر مزعج لهم.
2 - لا تقم بنشر روابط سيرفرات أخرى ، فهذا قد يكون سبب في تبنيدك.
3 - لاتتحدث بالامور السياسية و الدينية ، كل شخص وله تفكير.
4 - ارجو حل المشاكل الشخصيه في الخاص ، فـ نحن لا نحب ذلك.
5 - لا تتحدث عن بوتات أخرى ، هذا السيرفر الخاص ببروبوت ليس قائمة البوتات العامة.
6 - لا تقم بنشر الصور الاباحية، الحساسة ، فهذا ممنوع منعاً باتاً.
7 - اذا كان لديك مشكلة او سؤال ، قم بمنشنة  [ <@&735821432658985071> ] ، مرة واحدة ، لا تكن مزعج.
8 - لا تراسل الإدارة على الخاص لطلب المساعدة ، سيرفر الدعم ليس زينة.
9 - لا يُسمح بتكرار الرسائل، الصور، المنشن ، هذا يؤدي الى اعطائك ميوت.
10 - لايُسمح بتكرار الإقتراحات ، فهذا قد يعرضك للتحذير.
11 - لا تقم بذكر أسامي سيرفرات خارجيه ، فهذا قد يعرضك للتحذير.
12 - لا تطلب الكريدت، الريب، الخ ، فهذه ليست جمعية.
13 - لا تهين الآخرين ، كن لطيفاً.

- تنويه : يجب الحذر من تعاملك مع اي شخص خارج طاقم الدعم الفني لبروبوت..
ونخلي مسؤوليتنا من التعامل معهم تماماً..

لطلب المساعدة ، يرجى التوجه لـ 
<#735813644914393118>
`);
    msg.channel.sendEmbed(embed);
  }
  if (msg.content.startsWith(adminprefix + "en-rules")) {
    let emb = new Discord.RichEmbed()
      .setTitle(
        "Welcome to MRC support server , please read the rules carefully!"
      )
      .setFooter(
        `THANKS`,
        "https://cdn.discordapp.com/avatars/678517905150836757/a_7c5a6b0118fc41e068df890cc5c56f34.gif?size=1024"
      )
      .setThumbnail("https://cdn.probot.io/y1uKPgqQ6q.png").setDescription(`
       1 - don't mention the developers, this bothers them..
2 - don't publish external server links, this causes banning without hesitation!
3 - don't talk about political and religious matters, everyone has his own mind.
4 - keep your fights between yourselves privately, we don't need troubles here!
5 - don't open a discussions about other bots, this server is only responsible for probot.
6 - don't share your pornographic images, sensitive here, this is strictly prohibited!
7 - if you got an inquiry or issue(regarding probot), please mention [ <@&735838549789769738> ] once, don't be annoying.
8 - don't contact the staffs privately to ask for help, the support server is not for a decoration..
9 - repeating messages, images, mentions isn't allowed, this causes muting you.
10- don't repeat yours/other's suggestions, this causes warning.
11- don't mention servers names, this causes warning!
12- don't trade/ask for credits, reps, etc. this is not an assosiation!
13- do not insult others, be friendly.

Note: be careful in dealing with anybody outside probot support team,
and we take away our responsibility to deal with them seriously..

to request help, please move ahead to .
<#735838508127617114>
       `);
    msg.channel.sendEmbed(emb);
  }
});
/*
client.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command == "say") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;

    message.channel.sendMessage(args.join("  "));
    message.delete();
  }
});

const anime = require('./anime.json');
client.on("message" , message => {
     var an = anime[Math.floor(Math.random() * anime.length)];
  if(message.content.startsWith(prefix + "anime")){
message.channel.send(an.a)
}
});
soon
*/

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd === "ping") {
    const msg = await message.channel.send(`:ping_pong: pinging...`);
    msg.edit(
      `:ping_pong: Pong!\n > Latency is ${Math.floor(
        msg.createdTimestamp - message.createdTimestamp
      )}\n > API Latency ${Math.round(client.ping)}ms`
    );
  }
});

/*

const buy = JSON.parse(fs.readFileSync('./buy.json' , 'utf8'));
client.on('message',message =>{
  if(message.content.startsWith(prefix + 'buy role')) {
  if(!buy[message.guild.id]) buy[message.guild.id] = {
  role:'null',
  price:'null',
  transfer:'null',
  onoff:'Off'
  };fs.writeFile("./buy.json",JSON.stringify(buy),(err)=>{if(err)console.error(err)})
  if(!message.member.hasPermission('MANAGE_GUILD')) return;
  let args = message.content.split(" ").slice(2).join(" ");
  if(!args) return message.channel.send(`🙄 Please Type the role Name/ID`);
  let role = message.guild.roles.find('name',args)||message.guild.roles.find('id',args);
  if(!role) return message.channel.send(`🙄 I Can't find this role`);
  buy[message.guild.id].role = role.id
  fs.writeFile("./buy.json", JSON.stringify(buy), (err) => {if (err) console.error(err)})
  message.channel.send(new Discord.RichEmbed()
  .setColor('#35393e').setFooter(message.author.tag,message.author.avatarURL).setTimestamp()
  .setAuthor('Change settings',message.guild.iconURL)
  .addField(`**Role Now**`,`**\`\`\`${role.name}\`\`\`**`,true)
  )
  }
  if(message.content.startsWith(prefix+'buy price')) {
  if(!message.member.hasPermission('MANAGE_GUILD')) return;
  if(!buy[message.guild.id]) buy[message.guild.id] = {
  role:'null',
  price:'null',
  transfer:'null',
  onoff:'Off'
  };fs.writeFile("./buy.json",JSON.stringify(buy),(err)=>{if(err)console.error(err)})
  let args = message.content.split(" ").slice(2).join(" ");
  if(!args) return message.channel.send(`🙄 Please Type the role Price`)
  if(isNaN(parseInt(args))) return message.channel.send(`🙄 The price is wrong!`)
  if(parseInt(args)<0) return message.channel.send(`🙄 The price is wrong!`)
  buy[message.guild.id].price = args
  fs.writeFile("./buy.json", JSON.stringify(buy),(err)=>{if(err)console.error(err)})
  message.channel.send(new Discord.RichEmbed()
  .setColor('#36393e').setFooter(message.author.tag,message.author.avatarURL).setTimestamp()
  .setAuthor('Change settings',message.guild.iconURL)
  .addField(`**Role Price Now**`,`**\`\`\`${args}$\`\`\`**`,true)
  )
  }
  if(message.content.startsWith(prefix+'buy tran')) {
  if(!message.member.hasPermission('MANAGE_GUILD')) return;
  if(!buy[message.guild.id]) buy[message.guild.id] = {
  role:'null',
  price:'null',
  transfer:'null',
  onoff:'Off'
  };fs.writeFile("./buy.json",JSON.stringify(buy),(err)=>{if(err)console.error(err)})
  let user = message.mentions.members.first() || message.guild.members.get(message.content.split(" ")[2])
  buy[message.guild.id].transfer = user.id
  fs.writeFile("./buy.json", JSON.stringify(buy), (err) => {if (err) console.error(err)})
  message.channel.send(new Discord.RichEmbed()
  .setColor('#36393e').setFooter(message.author.tag,message.author.avatarURL).setTimestamp()
  .setAuthor('Change settings',message.guild.iconURL)
  .addField(`**Trans To**`,`**${user}**`,true)
  )
  }
  if(message.content.startsWith(prefix+'buy on')) {
  if(!message.member.hasPermission('MANAGE_GUILD')) return;
  if(!buy[message.guild.id]) buy[message.guild.id] = {
  role:'null',
  price:'null',
  transfer:'null',
  onoff:'Off'
  };fs.writeFile("./buy.json",JSON.stringify(buy),(err)=>{if(err)console.error(err)})
  buy[message.guild.id].onoff = 'On'
  fs.writeFile("./buy.json", JSON.stringify(buy), (err) => {if (err) console.error(err)})
  let on1 = new Discord.RichEmbed()
  .setColor('#36393e')
  .setDescription(`**\`\`\`The BuyRole Has Been Enabled\`\`\`**`)
  message.channel.send(on1)
  }
  if(message.content.startsWith(prefix+'buy off')) {
  if(!message.member.hasPermission('MANAGE_GUILD')) return;
  if(!buy[message.guild.id]) buy[message.guild.id] = {
  role:'null',
  price:'null',
  transfer:'null',
  onoff:'Off'
  };fs.writeFile("./buy.json",JSON.stringify(buy),(err)=>{if(err)console.error(err)})
  buy[message.guild.id].onoff = 'Off'
  fs.writeFile("./buy.json", JSON.stringify(buy), (err) => {if (err) console.error(err)})
  let off1 = new Discord.RichEmbed()
  .setColor('#36393e')
  .setDescription(`**\`\`\`The BuyRole has been disabled\`\`\`**`)
  message.channel.send(off1)
  }
  if(message == prefix + 'buy VIP') {
  if(!buy[message.guild.id]) buy[message.guild.id] = {
  role:'null',
  price:'null',
  transfer:'null',
  onoff:'Off'
  };fs.writeFile("./buy.json",JSON.stringify(buy),(err)=>{if(err)console.error(err)})
  let pp = buy[message.guild.id].price
  let brole = message.guild.roles.find('id',buy[message.guild.id].role)
  let btrans = buy[message.guild.id].transfer
  if(!brole) return message.channel.send(`🙁 Please setup the command again`)
  if(!message.guild.members.find('id',buy[message.guild.id].transfer))return message.channel.send(`🙁 Please setup the command again`)
  if(buy[message.guild.id].onoff === 'Off') return message.channel.send(`🙁 - the command has been disabled\nplease type __${prefix}buy on__ to turn it on`)
  if(message.author.id === buy[message.guild.id].transfer) return message.channel.send(`you can't buy a rank because you can't transfer credits to your self 🤗`)
  if(message.member.roles.find(r=>r.id == buy[message.guild.id].role)) return message.reply(`**You already have the rank \`${brole.name}\` ✅**`);
  message.channel.send(new Discord.RichEmbed()
  .setColor('#36393e')
  .addField(`**Command:**`, `**\`#credits ${message.guild.members.get(buy[message.guild.id].transfer)} ${buy[message.guild.id].price}\`**`)).then(msgs=>{
  let lPrice = Math.floor(pp-(pp*(5/100)));
  let filter = response => response.author.id == "282859044593598464" && response.mentions._content.includes(`:moneybag: | ${message.author.username}, has transferred \`$${lPrice}\` to <@${buy[message.guild.id].transfer}>`);
  message.channel.awaitMessages(filter, { maxMatches: 1, time: 240000, errors: ['time'] })
  .then( collected =>{
  let log = message.guild.channels.find("name", `❖・log・vip`);
  let gg = new Discord.RichEmbed()
  .setColor('#36393e')
  .setThumbnail(`https://cdn.discordapp.com/attachments/584630360017469461/588151955063570433/582096911448801288.png`)
  .setAuthor(`New purchase`,`https://cdn.discordapp.com/attachments/584630360017469461/584687464334098432/581239984376381455.gif`)
  .addField(`**User :**`,`\`\`\`${message.author.username}\`\`\``,true)
  .addField(`**Role :**`,`\`\`\`${brole.name}\`\`\``,true)
  .addField(`**💰 Rank Price :**`,`\`\`\`${buy[message.guild.id].price}$\`\`\``,true)
  .addField(`**💳 Transferd To :**`,`<@${buy[message.guild.id].transfer}>`,true)
  .setTimestamp();
  if(log) log.send(gg)
  const done = new Discord.RichEmbed()
  .setColor('#36393e')
  .setDescription(`**\`\`\`Done Buy Role ${brole.name}\`\`\`**`)
  .setTimestamp();
  message.member.addRole(brole)
  message.channel.send(done);
 var mmm = setTimeout(() => {
message.member.removeRole(brole)
}, 2592000000)
  message.author.send(new Discord.RichEmbed()
  .setColor("#36393e")
  .setTitle('Role VIP')
  .setDescription(`\`\`\`RANK NAME: ${brole.name} RANK PRICE: ${buy[message.guild.id].price}$ \`\`\``)
  .setFooter(message.guild.name,message.guild.iconURL))
})
})
}
});
*/

client.on("message", message => {
  if (message.content.startsWith(prefix + "user")) {
    var user = message.guild.member(
      message.mentions.members.first() || message.author
    );
    var embed = new RichEmbed()
      .setColor("RANDOM")
      .setTitle("User information")
      .addField("Username: ", user.user.username, true)
      .addField("ID: ", user.user.id, true)
      .addField(
        "CreatedAt: ",
        require("moment")(user.user.createdAt).format("DD/MM/YYYY h:mm a"),
        true
      )
      .addField(
        "JoinedAt: ",
        require("moment")(user.joinedAt).format("DD/MM/YYYY h:mm a"),
        true
      );
    message.channel.send(embed);
  }
});

client.on("message", async message => {
  if (!message.guild || message.author.bot) return;
  if (message.content.startsWith(prefix + "emojis")) {
    var emojis = message.guild.emojis;
    if (emojis.size == 0)
      return message.channel.send("لاتوجد ايموجيات في هاذا السيرفر");
    else {
      var embed = new RichEmbed()
        .setColor("GREEN")
        .setTimestamp()
        .setTitle(message.guild.name + "'s Emojis list")
        .setDescription(
          `Not Animated : ${emojis
            .filter(e => !e.animated)
            .map(e => e)
            .join(" ")}\n\n\nAnimated : ${emojis
            .filter(e => e.animated)
            .map(e => e)
            .join(" ")}`
        );
      message.channel.send(embed);
    }
  }
});
client.on("message", message => {
  let args = message.content.split(" ");
  if (args[0].toLowerCase() === `${prefix}avatar`) {
    let member = message.mentions.users.first();
    if (args[0] && !args[1]) {
      const emb = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor("#51545b")
        .setTitle("Avatar Link")
        .setURL(`${message.author.avatarURL}`)
        .setImage(`${message.author.avatarURL}`)
        .setFooter(
          "Requested by" + message.author.tag,
          message.author.avatarURL
        );
      message.channel.sendEmbed(emb);
    }
    if (member) {
      const embed = new Discord.RichEmbed()
        .setAuthor(member.tag, member.avatarURL)
        .setColor("#51545b")
        .setTitle("Avatar Link")
        .setURL(`${member.avatarURL}`)
        .setImage(`${member.avatarURL}`)
        .setFooter(
          "Requested by" + message.author.tag,
          message.author.avatarURL
        );
      message.channel.sendEmbed(embed);
    } else if (args[1] && !member) {
      client.fetchUser(args[1]).then(user => {
        const embed = new Discord.RichEmbed()
          .setAuthor(user.tag, user.avatarURL)
          .setColor("#51545b")
          .setTitle("Avatar Link")
          .setURL(`${user.avatarURL}`)
          .setImage(`${user.avatarURL}`)
          .setFooter(
            "Requested by" + message.author.tag,
            message.author.avatarURL
          );
        message.channel.sendEmbed(embed);
      });
    }
  }
});

/*
const rWlc = JSON.parse(fs.readFileSync("./AutoRole.json", "utf8"));
client.on('message', message => {
if(message.channel.type === "dm") return;
if(message.author.bot) return;
   if(!rWlc[message.guild.id]) rWlc[message.guild.id] = {
    role: "member"
  }
const channel = rWlc[message.guild.id].role
  if (message.content.startsWith(prefix + "autorole")) {
    if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
    let newrole = message.content.split(' ').slice(1).join(" ")
    if(!newrole) return message.reply(`**${prefix}autorole <role name>**`)
    rWlc[message.guild.id].role = newrole
    message.channel.send(`**${message.guild.name}'s role has been changed to ${newrole}**`);
  }
fs.writeFile("./AutoRole.json", JSON.stringify(rWlc), function(e){
    if (e) throw e;
})
});
client.on("guildMemberAdd", member => {
      if(!rWlc[member.guild.id]) rWlc[member.guild.id] = {
    role: "member"
  }
    const sRole = rWlc[member.guild.id].role
    let Rrole = member.guild.roles.find('name', sRole);
  member.addRole(Rrole);
 
      });
      


client.on("message", msg => {
    if(msg.content.startsWith(prefix + "infoautorole")){
    var sRole = rWlc[msg.guild.id].role
let emb = new Discord.RichEmbed()
.setTitle("**AutoRole معلومات**")
.setAuthor(msg.guild.name,msg.guild.iconURL)
.setThumbnail(msg.guild.iconURL)
.setColor("GREEN")
.addField("**ايدي السيرفر**", msg.guild.id)
.addField("**اسم السيرفر**", msg.guild.name)
.addField("**الرتبه المحددة**", sRole)
.setFooter(client.user.tag,client.user.avatarURL)
msg.channel.send(emb)
    }
});
*/

client.on("message", message => {
  if (message.content.startsWith(prefix + "slap")) {
    var user = message.guild.member(message.mentions.members.first());
    if (!user) return message.channel.send("❌ User not found!");
    if (!message.channel.guild) return message.reply("Error 404/");
    const embed = new Discord.RichEmbed()
      .setTitle("Slaping...")
      .setDescription(`🖐️ <@${message.author.id}> slapped ${user} 😱`)
      .setColor("RED")
      .setFooter(
        "Requested by" + " " + message.author.tag,
        message.author.avatarURL
      );
    message.channel.sendEmbed(embed);
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "kiss")) {
    var meh = message.guild.member(message.mentions.members.first());
    if (!meh) return message.channel.send("❌ User not found!");
    if (!message.channel.guild) return message.reply("Error 404/");
    const embed = new RichEmbed()
      .setTitle("Kissing...")
      .setColor("RED")
      .setDescription(`❤️ <@${message.author.id}> kissed  ${meh} 💋`)
      .setFooter(
        "Requested by" + " " + message.author.tag,
        message.author.avatarURL
      );
    message.channel.sendEmbed(embed);
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "kill")) {
    var hel = message.guild.member(message.mentions.members.first());
    if (!hel) return message.reply("❌ User not found!");
    if (!message.channel.guild) return message.reply("Error 404/");
    const embed = new RichEmbed()
      .setTitle("Killing...")
      .setColor("RED")
      .setDescription(`🔫 <@${message.author.id}> killed  ${hel} 🔫`)
      .setFooter(
        "Requested by" + " " + message.author.tag,
        message.author.avatarURL
      );
    message.channel.sendEmbed(embed);
  }
});
/*
let temp = JSON.parse(fs.readFileSync('./temp.json' , 'utf8'));
clientlet command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    if (command === "help" || command == "h") {
        const helpembed = new Discord.RichEmbed()
            .setColor("#747679")
            .setAuthor(bot.user.tag, bot.user.displayAvatarURL)
            .setDescription(`
__**Commands List**__
> \`play OR p\` > **\`play (URL-Name)\`**
> \`skip OR s\`, \`stop OR leave OR disconnect\`,  \`pause\`, \`resume\`
> \`nowplaying\`, \`queue\`, \`volume\``)
            .setFooter("©️ 2020 ProMax-Music✨ ", "https://app.zealcord.xyz/assets/Logo.png");
        msg.channel.send(helpembed);
    }.on('message', async message => {
 if(message.channel.type === "dm") return;
  if(message.author.bot) return;
 if(message.content == (prefix+'temp on')){
if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
if(temp[message.guild.id]) return message.channel.send('**الروم موجود فعليا ✅**')
 message.guild.createChannel('Temporary Channels', 'category').then(cg => {
 message.guild.createChannel('اضغط لإنشاء روم خاص', 'voice').then(ch => {
ch.setParent(cg)
 message.channel.send('**تم تفعيل الخاصيه ✅**')
 temp[message.guild.id] = {time: "3000", category : cg.id,  channel :ch.id}
});
 })
 }fs.writeFile("./temp.json", JSON.stringify(temp),(err)=>{if(err)console.error(err)})
    });
///LUXY
client.on('message' , message => {
  if(message.content == prefix+'temp off') {
    if(!temp[message.guild.id])return message.channel.send('**تم إيقاف تفعيل الخاصيه ✅**')
   if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
let cg = message.guild.channels.get(temp[message.guild.id].category);let ch = message.guild.channels.get(temp[message.guild.id].channel)
if(cg&&ch) {ch.delete().then(()=>{cg.delete()});message.channel.send('**تم إيقاف تفعيل الخاصيه ✅**')}
else {message.channel.send('**تم ايقاف تفعيل الخاصيه ✅**')};delete temp[message.guild.id]} });
 
///LUXY
client.on('message' , message => {
if (message.content.startsWith(prefix + "temp time")) {
if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
let newTime= message.content.split(' ').slice(2);
if(!newTime) return message.channel.send(`**You Must type the number after the command** ❎`)
if(isNaN(newTime)) return message.channel.send(`**Please Type The a Correct Number \🔢\❌**`);
if(newTime < 3) return message.channel.send(`**The Time Must Be More Than \`3s\` ❌**`)
let Time = Math.floor((newTime*(1000)));
temp[message.guild.id].time = Time
message.channel.send(`**✅ The Time Set To: \`${newTime}s\`**`);
}})
////LUXY
client.on('voiceStateUpdate', (old, neww) => {
if(!temp[old.guild.id]) return
if(!neww.guild.member(client.user).hasPermission('ADMINISTRATOR'))return;;
let newUserChannel = neww.voiceChannel;let oldUserChannel = old.voiceChannel
if(newUserChannel == oldUserChannel) return;
let channel = temp[neww.guild.id].channel
let category = temp[neww.guild.id].category
let ch = old.guild.channels.get(channel);if(!ch) return
let ct = old.guild.channels.get(category);if(!ct) return
 
if(newUserChannel !== undefined && newUserChannel.id == channel) {
neww.guild.createChannel(neww.displayName , 'voice').then(c => {
c.setParent(category).then(()=>{c.setParent(category).catch(err=>{return})})
c.overwritePermissions(neww.user, {MANAGE_CHANNELS:true,MUTE_MEMBERS:true})
.then(()=>{ch.overwritePermissions(neww,{CONNECT:false})});return neww.setVoiceChannel(c)});}
if(oldUserChannel !== undefined) {
setTimeout(()=>{
let chh = neww.guild.channels.find('name',neww.displayName)
if(!chh) return
if(chh.type === 'voice')return[chh.delete(),
ch.overwritePermissions(neww, {
CONNECT:null})]
}, temp[neww.guild.id].time);}
client.on('channelDelete',channel =>{
  if(oldUserChannel !== undefined) {
    setTimeout(()=>{
    let chh = neww.guild.channels.find('name',neww.displayName)
    if(!chh) return
    if(chh.type === 'voice')return[chh.delete(),
    ch.overwritePermissions(neww, {
    CONNECT:null})]
    }, temp[neww.guild.id].time);}
})
});
*/

client.on("message", message => {
  if (message.content.startsWith("-help")) {
    let pages = [
      `

>   **Bot Prefix** < **${prefix}** >

>   **${prefix}play • لــــتــــشــــغــــيــــل اغــــاـنــــي **

>   **${prefix}skip • لــــتــــخــــطــــي الاغــــنــــيــــة **

>   **${prefix}stop • لايــــقــــاف الاغــــنــــيــــة **

>   **${prefix}pause • لايــــقــــاف الاغــــنــــيــــة مــــوئــــقــــتــــا **

>   **${prefix}resume • لــــرجــــوع الــــى الاغــــنــــيــــة **

>   **${prefix}volume • لــــتــــغــــيــــيــــر الصــــوت **

>   **${prefix}queue • لاضــــهــــار القائــــمــــة **

>   **${prefix}repeat • لــــوضــــع الــــتــــكــــراـر **

>   **${prefix}forceskip • لــــتــــخـــطـــي  اغـــنـــيـــة فــــــي حــــــالــــــة تــــــكــــــرار **

>   **${prefix}skipto • لــــتــخــــطــــي الــــى **

>   **${prefix}np • لــــعــــرض مــــايــــتــــم ســــمــــاعــــه **

>   **${prefix}server • لــــعــــرض مــــعــــلــــومــــات عـــن الــــســــيــــرفــــر **

>   **${prefix}user • لــــعــــرض مــــعــــلــــومــــات عــــن حــــســــابك **

>   **${prefix}avatar •  لاضــــهــــار افــــتــــار **

>   **${prefix}emojis • لاضــــهــــار ايــــمــــوجــــيــــات الــــمــــوجــــودة بالــــســــيــــرفــــر **

      

`
    ];

    let page = 1;

    let embed = new Discord.RichEmbed()

      .setColor("#747679")

      .setFooter(`Page ${page} of ${pages.length}`)

      .setDescription(pages[page - 1]);

    message.channel.sendEmbed(embed).then(msg => {
      msg.react("").then(r => {
        msg.react("");

        setTimeout(() => {
          msg.delete;
        }, 60 * 1000);

        {
        }
      });
    });
  }
});
