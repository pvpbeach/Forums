module.exports = {
    ranks: [
        // start of staff ranks
        {
            name: 'Owner',
            color: 'DARK_RED',
            permissions: ['*'],
            italics: false,
            bold: false,
            id: 'owner'
        },
        {
            name: 'Developer',
            color: 'BLUE',
            permissions: ['*'],
            italics: false,
            bold: false,
            id: 'developer'
        },
        {
            name: 'Platform Admin',
            color: 'DARK_RED',
            permissions: ['*'],
            italics: true,
            bold: false,
            id: 'platadmin'
        },
        {
            name: 'Senior Admin',
            color: 'RED',
            permissions: ['ADMINISTRATION', 'TICKETS_ADMIN', 'STAFF'],
            italics: true,
            bold: false,
            id: 'senioradmin'
        },
        {
            name: 'Admin',
            color: 'RED',
            permissions: ['ADMINISTRATION', 'TICKETS_ADMIN', 'STAFF'],
            italics: false,
            bold: false,
            id: 'admin'
        },
        {
            name: 'Senior Mod',
            color: 'CYAN',
            permissions: ['TICKETS_MODERATE', 'STAFF'],
            italics: true,
            bold: false,
            id: 'seniormod'
        },
        {
            name: 'Moderator',
            color: 'CYAN',
            permissions: ['TICKETS_MODERATE', 'STAFF'],
            italics: false,
            bold: false,
            id: 'mod'
        },
        {
            name: 'Trainee',
            color: 'YELLOW',
            permissions: ['STAFF'],
            italics: false,
            bold: false,
            id: 'trainee'
        },
        // end of staff
        // Media Ranks
    
        {
            name: 'Partner',
            color: 'LIGHT_PURPLE',
            permissions: ['CREATOR'],
            italics: false,
            bold: false,
            id: 'partner'
        },
        {
            name: 'Famous',
            color: 'LIGHT_RED',
            permissions: ['CREATOR'],
            italics: false,
            bold: false,
            id: 'famous'
        },
        {
            name: 'Media',
            color: 'DARK_PURPLE',
            permissions: ['CREATOR'],
            italics: false,
            bold: false,
            id: 'media'
        },
        // end of media
        {
            name: 'Miner',
            color: 'YELLOW',
            permissions: [],
            italics: false,
            bold: false,
            id: 'miner'
        },
        {
            name: 'Queen',
            color: 'PURPLE',
            permissions: ['ROYAL'],
            italics: false,
            bold: false,
            id: 'queen'
        },
        {
            name: 'King',
            color: 'PURPLE',
            permissions: ['ROYAL'],
            italics: false,
            bold: false,
            id: 'king'
        },
        {
            name: 'High Roller',
            color: 'GOLD',
            permissions: [],
            italics: false,
            bold: false,
            id: 'high roller'
        },
        {
            name: 'Epic',
            color: 'BLUE',
            permissions: [],
            italics: false,
            bold: false,
            id: 'epic'
        },
        {
            name: 'PRO',
            color: 'GOLD',
            permissions: [],
            italics: false,
            bold: false,
            id: 'pro'
        },
        {
            name: 'MVP',
            color: 'AQUA',
            permissions: [],
            italics: false,
            bold: false,
            id: 'mvp'
        },
        {
            name: 'VIP',
            color: 'GREEN',
            permissions: [],
            italics: false,
            bold: false,
            id: 'vip'
        },
        {
            name: 'Default',
            color: 'WHITE',
            permissions: [],
            italics: false,
            bold: false,
            id: 'default'
        }
    ]
};