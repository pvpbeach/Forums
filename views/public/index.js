const showDropdownMenu = (dropdownSelector) => {
	const dropdown = document.querySelector(dropdownSelector);
	if (dropdown) {
		const dropdownMenu = dropdown.querySelector('.dropdown__menu');
		if (dropdownMenu) {
			dropdown.classList.add('dropdown--active');
		}
	}
}

const hideDropdownMenu = (dropdownSelector) => {
	const dropdown = document.querySelector(dropdownSelector);
	if (dropdown) {
		const dropdownMenu = dropdown.querySelector('.dropdown__menu');
		if (dropdownMenu) {
			dropdown.classList.remove('dropdown--active');
		}
	}
}

const navContent = document.querySelector('.nav__content');
const navMenuTrigger = document.querySelector('.nav__item--menu');

navMenuTrigger.addEventListener('click', event => {
	event.preventDefault();
	if (navContent.classList.contains('nav__content--active')) {
		navContent.classList.remove('nav__content--active');
		navMenuTrigger.innerHTML = '<i class="lni lni-menu"></i>';
	} else {
		navContent.classList.add('nav__content--active');
		navMenuTrigger.innerHTML = '<i class="lni lni-close"></i>';
	}
});

const playerSearchInput = document.querySelector('.input--player-search');
const playerSearchDropdown = document.querySelector('.dropdown--player-search');
const playerSearchDropdownMenu = playerSearchDropdown.querySelector('.dropdown__menu');

let playerSearchDropdownAvailable = false;
let playerSearchTimeout = null;

playerSearchInput.addEventListener('input', (event) => {
		
	playerSearchDropdownAvailable = false;

	if (playerSearchInput.value.length < 3) {
		hideDropdownMenu('.dropdown--player-search');
	} else {

		if (playerSearchTimeout) {
			clearTimeout(playerSearchTimeout);
		}

		playerSearchTimeout = setTimeout(async () => {

			let searchQuery = await fetch(`/search-player`, {
				method: 'post',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: `query=${playerSearchInput.value}`
			});

			searchQuery = await searchQuery.json();

			playerSearchDropdownMenu.innerHTML = '';
			for (const query of searchQuery) {
				playerSearchDropdownMenu.innerHTML += `
					<a href="${query.link}" class="dropdown__item">
						<img src="${query.avatar}" alt="${query.name}" />
						${query.name}
					</a>
				`;
			}

			if (searchQuery.length > 0) {
				playerSearchDropdownAvailable = true;
				showDropdownMenu('.dropdown--player-search');
			} else {
				playerSearchDropdownAvailable = false;
			}

		}, 1000);
	}
});

window.addEventListener('click', (event) => {

	let parentIsDropdown = false;
	for (let element = event.target; element; element = element.parentNode) {
		if (element && element.classList && element.classList.contains('dropdown')) {
			parentIsDropdown = true;
			break;
		}
	}

	if (!parentIsDropdown) {
		document.querySelectorAll('.dropdown').forEach((element) => {
			element.classList.remove('dropdown--active');
		});
	}

});

playerSearchInput.addEventListener('focus', () => {
	if (playerSearchDropdownAvailable) {
		showDropdownMenu('.dropdown--player-search');
	}
});

document.addEventListener('DOMContentLoaded', function(event) {
	document.documentElement.classList.add('loaded');
});