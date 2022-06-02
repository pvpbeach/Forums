module.exports = {
    staff: {
        name: 'Staff Application',
        subtitle: 'Apply to become Staff',
        fields: [
            {
                label: 'How old are you?',
                type: 'Number',
                placeholder: 'You must be at least 15 years old to apply for our staff team. If you do not meet this requirement, your application will not be shortlisted by default.'
            },
            // {
            //     label: 'Please',
            //     type: 'RichText',
            //     placeholder: 'https://mine.rip/profile/[ign]',
            // },
            {
                label: 'What is your Discord ID?',
                type: 'Number',
                placeholder: 'You can find this by enabling Developer Mode in Discord User Settings > Advanced, and right clicking your name in a chat, then clicking "Copy ID". This ID will allow us to know who you are on Discord if you change your username or discriminator.'
            },
            {
                label: 'Do you own a functional microphone?',
                type: 'ShortText',
                placeholder: 'Yes or No',
            },
            {
                label: 'Timezone',
                type: 'ShortText',
                placeholder: 'Do not tell us where you are from in this response. We need the time-zone name or an abbreviation of such name, or a relative UTC/GMT time, for example: EST, GMT, GMT-5. '

            },
            {
                label: 'What languages can you speak? (besides English.)',
                type: 'ShortText',
                placeholder: 'Spanish, Portuguese, Chinese, Manderin. Choose whatever.',
            },
            {
                label: 'Can any staff members currently on the team vouch for you? If yes, then list all of them, and if possible, your past working relationships with them.',
                type: 'ShortText',
                placeholder: 'Let us know of any staff members that can vouch for you, as that can help in the interview process.',
            },
            {
                label: 'What made you decide to apply for MineRIP',
                type: 'ShortText',
                placeholder: 'Please describe why you want to work for MineRIP and how you can contribute to the server.'
            },
            {
                label: 'What skills do you have that you think will benefit our team? What can you bring to the table?',
                type: 'ShortText',
                placeholder: 'Please list what skills you can bring to MineRIP.',
            },
            {
                label: 'Anything else you would like to mention?',
                type: 'ShortText',
                placeholder: 'Please tell us if there is anything else you would like to let us know!'
            }
        ],
        replies: [
            {
                name: 'Accepted',
                color: 'green'
            },
            {
                name: 'Denied',
                color: 'red'
            }
        ]
    },
    banned: {
        name: 'Ban Appeal',
        subtitle: 'Appeal your ban',
        fields: [
            {
                label: 'Where are you punished?',
                type: 'ShortText',
                placeholder: 'Discord or InGame?'
            },
            {
                label: 'What were you punished for?',
                type: 'ShortText',
                placeholder: 'Please include the exact punishment reason',
            },
            {
                label: 'What is your punishment ID?',
                type: 'ShortText',
                placeholder: 'ID: 432453'
            },
            {
                label: 'Do you agree that this was a fair punishment?',
                type: 'ShortText',
                placeholder: 'Yes or No'
            },
            {
                label: 'Have you been punished in the same category before? ',
                type: 'ShortText',
                placeholder: 'Yes or No' 
            },
            {
                label: 'Why should we revoke your punishment? ',
                type: 'ShortText',
                placeholder: 'Please provide as much detail as possible.'  
            },
            {
                label: 'Do you agree that you will not be sharing your appeal to other players, and that you would be re-punished if you were caught doing so. ',
                type: 'ShortText',
                placeholder: 'Yes or No'   
            },
            {
                label: 'Do you agree that your appeal was genuinely written and was not copied from other places.',
                type: 'ShortText',
                placeholder: 'Yes or No'
            },
            {
                label: 'Do you agree that will not ask staff members to check your appeal and will wait for it to be reviewed.',
                type: 'ShortText',
                placeholder: 'Yes or No'
            },

        ],
        replies: [
            {
                name: 'Accepted',
                color: 'green'
            },
            {
                name: 'Denied',
                color: 'red'
            }
        ]
    },
    support: {
        name: 'Support Ticket',
        subtitle: 'Create a support ticket',
        fields: [
            {
                label: 'Why are you creating this ticket?',
                type: 'ShortText',
                placeholder: 'Please be as specific as possible.'
            }

        ],
        replies: [
            {
                name: 'Resolved',
                color: 'green'
            },
            {
                name: 'Escalated',
                color: 'red'
            }
        ]
    }
};