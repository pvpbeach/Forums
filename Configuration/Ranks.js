module.exports = {
    ranks: [
        // start of staff ranks
        {
            name: 'Owner',
            color: 'DARK_RED',
            permissions: ['*'],
            italics: false,
            bold: true,
            id: 'owner'
        },
        {
            name: 'Platform Admin',
            color: 'DARK_RED',
            permissions: ['*'],
            italics: true,
            bold: true,
            id: 'platformadmin'
        },
        {
            name: 'Developer',
            color: 'BLUE',
            permissions: ['*'],
            italics: false,
            bold: true,
            id: 'developer'
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
            italics: true,
            bold: false,
            id: 'admin'
        },
        {
            name: 'Senior Mod',
            color: 'DARK_PURPLE',
            permissions: ['TICKETS_MODERATE', 'STAFF'],
            italics: true,
            bold: false,
            id: 'seniormod'
        },
        {
            name: 'Moderator',
            color: 'DARK_PURPLE',
            permissions: ['TICKETS_MODERATE', 'STAFF'],
            italics: true,
            bold: false,
            id: 'moderator'
        },
        {
            name: 'Trial Mod',
            color: 'YELLOW',
            permissions: ['STAFF'],
            italics: true,
            bold: false,
            id: 'trialmod'
        },
        // end of staff
        // Media Ranks
    
        {
            name: 'Partner',
            color: 'LIGHT_PURPLE',
            permissions: ['CREATOR'],
            italics: true,
            bold: false,
            id: 'partner'
        },
        {
            name: 'Famous',
            color: 'DARK_PURPLE',
            permissions: ['CREATOR'],
            italics: true,
            bold: false,
            id: 'famous'
        },
        {
            name: 'Media',
            color: 'RED',
            permissions: ['CREATOR'],
            italics: true,
            bold: false,
            id: 'media'
        },
        // end of media
        {
            name: 'Beach',
            color: 'GOLD',
            permissions: [],
            italics: true,
            bold: true,
            id: 'beach'
        },
        {
            name: 'Ocean',
            color: 'BLUE',
            permissions: [],
            italics: false,
            bold: false,
            id: 'ocean'
        },
        {
            name: 'Squid',
            color: 'GREEN',
            permissions: [],
            italics: false,
            bold: false,
            id: 'squid'
        },
        {
            name: 'Shark',
            color: 'DARK_GREEN',
            permissions: [],
            italics: false,
            bold: false,
            id: 'shark'
        },
        {
            name: 'Fish',
            color: 'YELLOW',
            permissions: [],
            italics: false,
            bold: false,
            id: 'fish'
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