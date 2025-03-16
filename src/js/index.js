document.addEventListener("DOMContentLoaded", function() {
	const addModal = document.getElementById("add-modal");
	const editModal = document.getElementById("edit-modal");
	const savePlaceButton = document.getElementById("save-place");
	const saveProfileButton = document.getElementById("save-profile");
	const placeNameInput = document.getElementById("place-name");
	const placeUrlInput = document.getElementById("place-url");
	const nameInput = document.getElementById("name");
	const jobInput = document.getElementById("job");

	const cardsWrapper = document.querySelector(".cards__wrapper");
	const editButton = document.querySelector(".icon--edit-button");
	const addButton = document.querySelector(".icon--add-button");

	const closeButtons = document.querySelectorAll(".close, .close-modal");

	const profileTitle = document.querySelector(".avatar-desc__title");
	const profileSubtitle = document.querySelector(".avatar-desc__sub-title");

	// Дефолтные карточки
	const initialCards = [
		{ name: "Карачаевск", imageUrl: "./img/cards/1.jpg" },
		{ name: "Гора Эльбрус", imageUrl: "./img/cards/2.jpg" },
		{ name: "Домбай", imageUrl: "./img/cards/3.jpg" },
	];

	// Функция создания карточки
	function createCard(name, imageUrl) {
		const card = document.createElement("div");
		card.classList.add("card");
		card.innerHTML = `
		  <img src="${imageUrl}" alt="${name}">
		  <div class="title-wrapper">
			<h3 class="title">${name}</h3>
			<svg class="icon icon--heart">
				<use href="./img/svgsprite/sprite.symbol.svg#heart"></use>
			</svg>
		  </div>
		  <svg class="icon icon--trash">
				<use href="./img/svgsprite/sprite.symbol.svg#trash"></use>
		  </svg>
		`;

		// Удаление карточки
		card.querySelector(".icon--trash").addEventListener("click", () => {
			card.remove();
			saveCardsToLocalStorage();
		});

		return card;
	}

	// Функция добавления новой карточки
	function addNewCard(event) {
		event.preventDefault();

		const name = placeNameInput.value.trim();
		const imageUrl = placeUrlInput.value.trim();

		if (name && imageUrl) {
			const newCard = createCard(name, imageUrl);
			cardsWrapper.prepend(newCard);

			// Сохранение в LocalStorage
			saveCardsToLocalStorage();

			// Очищаем поля ввода
			placeNameInput.value = "";
			placeUrlInput.value = "";

			// Закрываем модальное окно
			closeModal(addModal);
		}
	}

	savePlaceButton.addEventListener("click", addNewCard);

	// Функция удаления карточки
	function deleteCard(event) {
		const trashIcon = event.target.closest(".icon--trash");
		if (trashIcon) {
			const card = trashIcon.closest(".card");
			if (card) {
				card.remove();
				saveCardsToLocalStorage();
			}
		}
	}

	document.body.addEventListener("click", deleteCard);

	// Функция открытия модального окна с анимацией
	function openModal(modal) {
		modal.style.display = "flex";
		setTimeout(() => modal.classList.add("show"), 10);
	}

	// Функция закрытия модального окна с анимацией
	function closeModal(modal) {
		modal.classList.remove("show");
		setTimeout(() => {
			modal.style.display = "none";
		}, 300); // Задержка совпадает с `transition` в CSS
	}

	// Обработчики для кнопок открытия
	editButton.addEventListener("click", () => {
		// Заполняем модальное окно текущими значениями профиля
		nameInput.value = profileTitle.textContent;
		jobInput.value = profileSubtitle.textContent;
		openModal(editModal);
	});

	addButton.addEventListener("click", () => openModal(addModal));

	// Обработчики для кнопок закрытия
	closeButtons.forEach((button) => {
		button.addEventListener("click", function() {
			const modal = this.closest(".modal");
			closeModal(modal);
		});
	});

	// Закрытие по клику вне модального окна
	window.addEventListener("click", (event) => {
		if (event.target.classList.contains("modal")) {
			closeModal(event.target);
		}
	});

	// Закрытие по нажатию Esc
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			document.querySelectorAll(".modal.show").forEach(closeModal);
		}
	});

	// Функция сохранения отредактированного профиля
	saveProfileButton.addEventListener("click", () => {
		profileTitle.textContent = nameInput.value;
		profileSubtitle.textContent = jobInput.value;

		// Сохраняем данные профиля в LocalStorage
		localStorage.setItem(
			"profile",
			JSON.stringify({
				name: nameInput.value,
				job: jobInput.value,
			})
		);

		closeModal(editModal);
	});

	// Функция сохранения карточек в LocalStorage
	function saveCardsToLocalStorage() {
		const cards = [];
		document.querySelectorAll(".card").forEach((card) => {
			const name = card.querySelector(".title").textContent;
			const imageUrl = card.querySelector("img").src;
			cards.push({ name, imageUrl });
		});
		localStorage.setItem("cards", JSON.stringify(cards));
	}

	// Функция загрузки карточек из LocalStorage (исправлено)
	function loadCardsFromLocalStorage() {
		const savedCards = JSON.parse(localStorage.getItem("cards"));

		// Если карточек нет в LocalStorage, загружаем дефолтные
		if (!savedCards || savedCards.length === 0) {
			initialCards.forEach(({ name, imageUrl }) => {
				cardsWrapper.append(createCard(name, imageUrl));
			});
			saveCardsToLocalStorage(); // Сохранение дефолтных карточек
		} else {
			savedCards.forEach(({ name, imageUrl }) => {
				cardsWrapper.append(createCard(name, imageUrl));
			});
		}
	}

	// Функция загрузки данных профиля из LocalStorage
	function loadProfileFromLocalStorage() {
		const savedProfile = JSON.parse(localStorage.getItem("profile"));
		if (savedProfile) {
			profileTitle.textContent = savedProfile.name;
			profileSubtitle.textContent = savedProfile.job;
		}
	}

	// Загружаем сохраненные данные при загрузке страницы
	loadProfileFromLocalStorage();
	loadCardsFromLocalStorage();

	// Модальное окно для просмотра изображений
	const imageModal = document.getElementById("image-modal");
	const modalImage = document.getElementById("modal-image");
	const modalTitle = document.getElementById("modal-title");

	// Функция открытия модального окна с изображением
	function openImageModal(imageUrl, title) {
		modalImage.src = imageUrl;
		modalImage.alt = title;
		modalTitle.textContent = title;
		openModal(imageModal);
	}

	// Обработчик клика на изображение карточки
	document.body.addEventListener("click", (event) => {
		const cardImage = event.target.closest(".card img");
		if (cardImage) {
			const card = cardImage.closest(".card");
			const title = card.querySelector(".title").textContent;
			openImageModal(cardImage.src, title);
		}
	});

	// Закрытие модального окна с изображением
	imageModal.querySelector(".close").addEventListener("click", () => {
		closeModal(imageModal);
	});
});
