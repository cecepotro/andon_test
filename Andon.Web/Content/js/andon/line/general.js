let perPageSelector;
let lineSearch;
let searchButton;
const config = { controller: "Line", action: "GetList", tableId: "table-lines" };

document.addEventListener("DOMContentLoaded", function () {
    perPageSelector = document.getElementById('perpageSelect');
    lineSearch = document.getElementById('line-search');
    searchButton = document.getElementById('btn-search');
    initializeTable(config, perPageSelector);

    lineSearch.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            loadTable(config, 1, parseInt(perPageSelector.value), getFilters());
        }
    });

    searchButton.addEventListener('click', function () {
        loadTable(config, 1, parseInt(perPageSelector.value), getFilters());
    });

    document.getElementById("btn-line-modal").addEventListener("click", function () {
        openModal(0);
    });

    KTDom.ready(function () {
        KTSelect.init();
        KTComponents.init();
    });
});

function getFilters() {
    return {
        name: document.getElementById('line-search')?.value.trim()
    };
}

async function openModal(id) {
    const response = await fetch(`${url}/Line/Modal/${id}`);
    const html = await response.text();
    modalElement.innerHTML = html;
    KTDom.ready(function () {
        KTComponents.init();
    });
    const modal = KTModal.getInstance(modalElement);
    modal.show();

    document.getElementById('btn-line-save').addEventListener('click', function () {
        save();
    });
}

function save() {
    const formData = new FormData();
    const nameInput = document.getElementById("line-name");
    const lineMessages = document.querySelector('#line-messages')?.dataset;

    nameInput.classList.remove("input-error");
    if (nameInput.value.trim() === "") {
        nameInput.classList.add("input-error");
        showToast(lineMessages.emptyName, ToastVariant.ERROR);
        return;
    }

    showLoading();
    formData.append("id", document.getElementById("line-id").value);
    formData.append("name", nameInput.value.trim());

    fetch(`${url}/Line/Save`, {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            hideLoading();
            if (data.Success) {
                loadTable(config, 1, parseInt(perPageSelector.value), getFilters());
                showToast(globalMessages.entrySaved, ToastVariant.SUCCESS);
                KTModal.getInstance(modalElement).hide();
            } else {
                showToast(data.Message, ToastVariant.ERROR);
            }
        })
        .catch(error => {
            hideLoading();
            showToast(globalMessages.genericError, ToastVariant.ERROR);
            console.error("Error saving line:", error);
        });
}
