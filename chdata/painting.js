module.exports = {
    raw: {
        "channel": "name-that-painting",
        "channelId": null,
        "embedId": null,
        "answers": [
            "nighthawks"
        ],
        "points": 10,
        "currPoints": 10,
        "files": null,
        "correct": []
    },
    embed: {
        color: 0xca5010,
        title: 'Test Challenge: Name that Painting 🥋',
        description: 'Provide the title of this artwork created by American painter Edward Hopper.',
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
            text: `Current point value: 10\nSolves: 0`
        }
    }
}