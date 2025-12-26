

document.addEventListener('DOMContentLoaded', () => {
	correctVh();
	initDatePickers();
	initViewSwitcher();
});

window.addEventListener('resize', () => {
	correctVh();
});


function correctVh() {
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', vh + 'px');
}

function initDatePickers() {
	const containers = document.querySelectorAll('.input-datepicker');
	const pickers = {};

	containers.forEach(container => {
		const input = container.querySelector('input');
		const dp = new Datepicker(input, {
			autohide: true,
			showOnFocus: false,
			orientation: 'bottom left'
		});

		const clearBtn = container.querySelector('button[data-clear]');
		clearBtn.addEventListener('click', () => {
			input.value = '';
			dp.setDate(null);
		});

		const triggerBtn = container.querySelector('button[data-trigger]');
		triggerBtn.addEventListener('mousedown', e => {
			e.preventDefault();
			dp.toggle();
		});

		pickers[input.name] = dp;
	});

	const toPicker = pickers['date-to'];

	document.querySelector('input[name="date-from"]').addEventListener('changeDate', e => {
		const fromDate = e.detail.date;
		if (fromDate) {
			toPicker.setOptions({ minDate: fromDate });
			const toDate = toPicker.getDate();
			if (toDate && toDate < fromDate) {
				toPicker.setDate(null);
				document.querySelector('input[name="date-to"]').value = '';
			}
		} else {
			toPicker.setOptions({ minDate: null });
		}
	});
}

function initViewSwitcher() {
	const switcher = document.querySelector('.view-switcher');
	const buttons = switcher.querySelectorAll('button');
	const holder = document.querySelector('.cards-holder');

	const defaultView = 'list';

	let currentView = localStorage.getItem('viewMode') || defaultView;
	applyView(currentView);

	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			const view = btn.dataset.view;
			applyView(view);
			localStorage.setItem('viewMode', view);
		});
	});

	function applyView(view) {
		holder.classList.remove('grid', 'list');
		holder.classList.add(view);


		const cards = holder.querySelectorAll('.card');
		cards.forEach((card, i) => {
			card.style.animationDelay = `${i * 0.05}s`;
			card.classList.remove('fade-up');
			void card.offsetWidth;
			card.classList.add('fade-up');
		});

		buttons.forEach(b => b.classList.toggle('active', b.dataset.view === view));
	}
}
