const db = require('../db/libdb');
const painting = db.get_chdata_sync({ file: 'csdata', name: 'painting' });

module.exports = {
    raw: require('./json/painting.json'),
    embed: {
        color: 0xca5010,
        title: 'Test Challenge: Name that Painting',
        description: 'Provide the title of this artwork created by American painter Edward Hopper.',
        thumbnail: {
            url: 'https://i.imgur.com/vjYbHsX.png'
        },
        fields: [
            {
                name: 'Command:',
                value: '\`/painting\`'
            }
        ],
        image: {
            url: 'https://i.imgur.com/SKrVSGe.jpeg'
        },
        footer: {
            text: `Current point value: ${painting.currPoints}\nSolves: ${painting.correct.length}`
        }
    }
}