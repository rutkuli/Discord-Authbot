const Discord = require('discord.js');
const mysql = require('mysql');
const moment = require('moment');
const config = require('./config.json');
const client = new Discord.Client();


moment.locale("en-ca");

const conn = mysql.createConnection({
    host     : 'IP',
    port     : 'PORT',
    user     : 'NAME',
    password : 'PASSWORD',
    database : 'Database name',
    charset  : 'utf8mb4'
});

client.once('ready', () => {
     console.log('-Rutkuli bot is online!');
    client.user.setActivity("-Rutkuli- !Help", { type: "Streaming"});
	
});

setInterval(function(){
    console.log('-Checking for expired keys...');

    conn.query("UPDATE users SET `valid` = 'false' WHERE `expire` <= DATE_SUB(NOW(), INTERVAL 5 MINUTE)", function (err, result, fields) {

        if (err) {
            return console.log(err);
        }

    });

}, 120000);
setInterval(function(){
    console.log('-Checking for expired keys with ip address...');

    conn.query("UPDATE users SET `server` = '0' WHERE `expire` <= DATE_SUB(NOW(), INTERVAL 5 MINUTE)", function (err, result, fields) {

        if (err) {
            return console.log(err);
        }

    });

}, 120000);

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    if (message.channel.type == "dm") return;	
    if (message.channel.id === 'channel id') return;
	if (message.channel.id === 'channel id') return;
	if (message.channel.id === 'channel id') return;
    const args = message.content.slice(config.prefix.length).split(' ');
    const command = args.shift();
	
    if (command === 'redeem') {
        if (!args.length) {
            const embed = new Discord.RichEmbed()
                .setColor('#e2574c')
                .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                .setDescription('Correct use: !redeem [MY KEY]')

            return message.channel.send(embed);
        }
        conn.query('SELECT * FROM users WHERE license = ?', [args[0]], function (err, result, fields) {
            if (err) {
                const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription('The key you entered is not valid.')

                return message.channel.send(embed);
            }
            if (result.length > 0) {
                if (result) {
                    if (result[0].user == "NULL") {
                        conn.query('UPDATE users SET user = ? WHERE license = ?', [message.member.id, args[0]], function (err, result, fields) {
                            if (err) {
                                const embed = new Discord.RichEmbed()
                                    .setColor('#e2574c')
                                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                    .setDescription('A server-side error has occurred.')
                
                                return message.channel.send(embed);
                            }
                            const embed = new Discord.RichEmbed()
                            .setColor('#9500ff')
                            .setAuthor('verified!', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                            .setDescription('The given key has been assigned to your account.')
            
                            return message.channel.send(embed);
                        });

                    } else {
                        const embed = new Discord.RichEmbed()
                            .setColor('#e2574c')
                            .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                            .setDescription('This key is already used.')
                        return message.channel.send(embed);
                    }
                }
            }
        });
    }

    if (command === 'setip') {
        message.delete();
        if (!args.length) {
            const embed = new Discord.RichEmbed()
                .setColor('#e2574c')
                .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                .setDescription('Correct use: !setip [YOUR KEY] [YOUR SERVER IP ADRESS]')

            return message.channel.send(embed);
        }
        conn.query('SELECT * FROM users WHERE license = ?', [args[0]], function (err, result, fields) {
            if (err) {
                const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription('The key you entered is not valid.')

                return message.channel.send(embed);
            }
            if (args[1] == "localhost" || args[1] == "127.0.0.1") {

                const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription(`You cannot use this server address (${args[1]}).\nYou should use the public address of the FiveM hosting server.`)

                return message.channel.send(embed);
            }
            if (result.length > 0) {
                if (result) {
                    let beforeIp = result[0].server;
                    if (result[0].user == message.member.id || message.member.hasPermission('ADMINISTRATOR')) {
                        conn.query('UPDATE users SET server = ? WHERE license = ?', [args[1], args[0]], function (err, result, fields) {
                            if (err) {
                                const embed = new Discord.RichEmbed()
                                    .setColor('#e2574c')
                                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                    .setDescription('A server-side error has occurred.')             
                                return message.channel.send(embed);
                            }
                            const embed = new Discord.RichEmbed()
                                .setColor('#9500ff')
                                .setAuthor('verified!', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                                .setDescription(`The server address assigned to the key has been successfully changed.\nFrom **${beforeIp}** to **${args[1]}**.`)
            
                            return message.channel.send(embed);
                        });

                    } else {
                        const embed = new Discord.RichEmbed()
                            .setColor('#e2574c')
                            .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                            .setDescription('You are not the owner of this key.')

                        return message.channel.send(embed);
                    }
                }
            }

        });
    }
	 if (command === 'setproduct') {

        message.delete(); 


        if (!args.length) {

            const embed = new Discord.RichEmbed()
                .setColor('#e2574c')
                .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                .setDescription('Correct use: !setgame [BUYER KEY] [product]')

            return message.channel.send(embed);
        }
        conn.query('SELECT * FROM users WHERE license = ?', [args[0]], function (err, result, fields) {
            if (err) {
                const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription('The product you entered is not valid.')

                return message.channel.send(embed);
            }
            if (args[1] == "steam" || args[1] == "steam") {
               const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription(`You cannot use this product (${args[1]}).\nYou should use products like FiveM / Spoofer etc.`)
                return message.channel.send(embed);
            }
            if (result.length > 0) {

                if (result) {

                    let beforeproduct = result[0].product;

                    if (result[0].user == message.member.id || message.member.hasPermission('ADMINISTRATOR')) {

                        conn.query('UPDATE users SET product = ? WHERE license = ?', [args[1], args[0]], function (err, result, fields) {

                            if (err) {

                                const embed = new Discord.RichEmbed()
                                    .setColor('#e2574c')
                                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                    .setDescription('A server-side error has occurred.')
                
                                return message.channel.send(embed);
                            }

                            const embed = new Discord.RichEmbed()
                                .setColor('#9500ff')
                                .setAuthor('verified!', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                                .setDescription(`The product assigned to the key has been successfully changed.`)
            
                            return message.channel.send(embed);

                        });

                    } else {
                        const embed = new Discord.RichEmbed()
                            .setColor('#e2574c')
                            .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                            .setDescription('You are not the owner of this key.')

                        return message.channel.send(embed);
                    }
                }
            }
        });
    }

 if (command === 'status') {

        conn.query('SELECT * FROM users WHERE user = ?', [message.member.id], function (err, result, fields) {

            if (err) {

                const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription('you dont own any products.')

                return message.channel.send(embed);
            }

            if (result.length > 0) {

                if (result) {

                    let date;

                    if (result[0].valid == "true") {
                        date = moment(result[0].expire).format('LLL');
                    } else {
                        date = "❌ Your subscription has expired.";
                    }

                    const embed = new Discord.RichEmbed()
                        .setColor('#9500ff')
						.setAuthor('STATUS', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                        .addField('your subscription will expire on:', date)
    
                    return message.channel.send(embed);

                }

            } else {

                const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription('The key you entered is not valid.')

                return message.channel.send(embed);

            }

        });
    }
    if (command === 'keys') {

        conn.query('SELECT * FROM users WHERE user = ?', [message.member.id], function (err, result, fields) {

            if (err) {

                const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription('An error occurred while retrieving your keys.')

                return message.channel.send(embed);
            }

            if (result.length > 0) {

                if (result) {

                    const embed = new Discord.RichEmbed()
                        .setColor('#9500ff')
                        .setAuthor('verified', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                        .setDescription('```List of keys assigned to your account.```');
                        result.forEach(function(row) {
                            embed.addField('Key:', row.license)
                        })
                        embed.setTimestamp()
    
                    return message.channel.send(embed);

                }

            } else {

                const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription('You don\'t have any keys on your account.')

                return message.channel.send(embed);

            }

        });
    }
////////////////////////////////////////////////////
    if (command === 'help') {

        const exampleEmbed = new Discord.RichEmbed()
            .setColor('#9500ff')
            .setAuthor('Rutkuli- Do you need help?', 'https://i.imgur.com/DhNQJUw.png')
			.setThumbnail('https://cdn.discordapp.com/attachments/728943475684278324/729468233677275226/a43c.png')
			.addField('!help',  'Lists bot commands')
            .addField('!delete', 'Deletes the key from the database (DEV)')			
            .addField('!create', 'Creates a new key (DEV)')
            .addField('!redeem:', 'Assigns a key to the account')
            .addField('!setip', 'Assigns the servers IP to the key')
			.addField('!setproduct', 'Assigns a product to the key (DEV)')
            .addField('!status', 'Tells you the status of your account')
            .addField('!keys', 'List of keys assigned to the account')			
            .addField('!Sreq', 'Opens support request platform (use only if you need help)')
            .setTimestamp()
        return message.channel.send(exampleEmbed).then(msg => msg.delete(60000));
    }
    if (command === 'delete') {

        if (message.member.hasPermission('ADMINISTRATOR')) {

            if (!args.length) {

                const exampleEmbed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription('Correct use: !delete [KEY]')

                return message.channel.send(exampleEmbed);
            }
            conn.query('SELECT license FROM users WHERE license = ?', [args[0]], function (err, result, fields) {
                if (err) {
                    const embed = new Discord.RichEmbed()
                        .setColor('#e2574c')
                        .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                        .setDescription('The key you entered is not valid.')
                    return message.channel.send(embed);
                }
                if (result.length > 0) {
                    if (result) {
                        conn.query('DELETE FROM users WHERE license = ?', [args[0]], function (err, result, fields) {                      
                            if (err) {
                                const embed = new Discord.RichEmbed()
                                    .setColor('#e2574c')
                                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                                    .setDescription('An error occurred while performing the operation.')
            
                                return message.channel.send(embed);
                            }
                            const embed = new Discord.RichEmbed()
                            .setColor('#9500ff')
                            .setAuthor('verified!', 'https://cdn.discordapp.com/attachments/728943475684278324/732990460557131786/41-418338_success-png-payment-successful-icon-clipart.png')
                            .setDescription(`The **${args[0]}** has been removed from the database.`)   
                           return message.channel.send(embed);
                        });
                    }
                }
            });
        } else {
            const embed = new Discord.RichEmbed()
            .setColor('#e2574c')
            .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
            .setDescription('You do not have the required permissions to use this.')
            return message.channel.send(embed);
        }
    }
    if (command === 'create') {
        if (message.member.hasPermission('ADMINISTRATOR') || message.member.roles.has('user id')) {
            let r = Math.random().toString(36).substr(5, 5) + "-" + Math.random().toString(36).substr(5, 5) + "-" + Math.random().toString(36).substr(5, 5) + "-" + Math.random().toString(36).substr(5, 5);	          
			if (!args.length) {
                const embed = new Discord.RichEmbed()
                    .setColor('#e2574c')
                    .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                    .setDescription('Correct use: !create [NUMBER] [DAY / MONTH / YEAR]')

                return message.channel.send(embed);
            }
                conn.query(`INSERT INTO users (license, expire, creator) VALUES ('${r}', DATE_ADD(NOW(), INTERVAL ${args[0]} ${args[1]}), ${message.member.id});`, function (err, result, fields) {
                    if (err) {
                        const embed = new Discord.RichEmbed()
                            .setColor('#e2574c')
                            .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
                            .setDescription('An error occurred while performing the operation.')
                        return message.channel.send(embed);
                    }
                    const priv = new Discord.RichEmbed()
                        .setColor('##9500ff')
                        .setAuthor('Lisence created!', 'https://cdn.discordapp.com/attachments/728943475684278324/729468233677275226/a43c.png')
                        .setDescription(`The **${r}** key was successfully generated.\nThe key is valid for **${args[0]} ${args[1]} ${args[2]}**.`)
                    message.author.send(priv);
                    const embed = new Discord.RichEmbed()
                        .setColor('#9500ff')
                        .setAuthor('Created!', 'https://cdn.discordapp.com/attachments/728943475684278324/729468233677275226/a43c.png')
                        .setDescription('Okay dude:sunglasses: ')
   
                    return message.channel.send(embed);
                });
        } else {
            const embed = new Discord.RichEmbed()
            .setColor('#e2574c')
            .setAuthor('ERROR!', 'https://i.imgur.com/8bo2OJT.png')
            .setDescription('You do not have the required permissions to do this.')

            return message.channel.send(embed);
        }
    }
});

client.login(config.token);